import { computed, ref, watch } from 'vue'
import { defineStore } from 'pinia'
import type {
  CfActivityLog,
  CfDatabase,
  CfInvoice,
  CfInvoiceLine,
  CfNotification,
  CfPriceHistory,
  CfProduct,
  CfRole,
  CfStockMovement,
  CfSupplier,
  CfUser,
  NotificationType,
  StockMovementType,
} from '../types'
import {
  CF_SESSION_KEY,
  CF_SYNC_CHANNEL,
  createSeedDatabase,
  exportDatabaseJson,
  importDatabaseJson,
  loadDatabase,
  saveDatabase,
} from '../db'
import {
  formatMoney,
  getClientIp,
  isSameDay,
  nowParts,
  todayKey,
  uid,
} from '../utils/helpers'

const PRICE_ROLES: CfRole[] = ['Administrateur', 'Directeur']
const SUPERVISOR_ROLES: CfRole[] = ['Administrateur', 'Directeur', 'Superviseur']
const ADMIN_ROLES: CfRole[] = ['Administrateur', 'Directeur']

export const useCfStore = defineStore('chambreFroide', () => {
  const db = ref<CfDatabase>(loadDatabase())
  const currentUser = ref<CfUser | null>(readSession())
  const searchQuery = ref('')

  function persist() {
    saveDatabase(db.value)
  }

  function readSession(): CfUser | null {
    const raw = localStorage.getItem(CF_SESSION_KEY)
    if (!raw) return null
    try {
      return JSON.parse(raw) as CfUser
    } catch {
      return null
    }
  }

  function setSession(user: CfUser | null) {
    currentUser.value = user
    if (user) localStorage.setItem(CF_SESSION_KEY, JSON.stringify(user))
    else localStorage.removeItem(CF_SESSION_KEY)
  }

  function reloadFromStorage() {
    db.value = loadDatabase()
    currentUser.value = readSession()
  }

  // Real-time sync across tabs/posts
  if (typeof window !== 'undefined') {
    try {
      const channel = new BroadcastChannel(CF_SYNC_CHANNEL)
      channel.onmessage = () => reloadFromStorage()
    } catch {
      // ignore
    }
    window.addEventListener('storage', (e) => {
      if (e.key === 'cf_database_v2' || e.key === CF_SESSION_KEY) reloadFromStorage()
    })
  }

  function log(action: string, details?: string, user?: CfUser | null) {
    const actor = user ?? currentUser.value
    const { date, time, iso } = nowParts()
    const entry: CfActivityLog = {
      id: uid('log'),
      userId: actor?.id ?? 'anonymous',
      userName: actor?.fullName ?? 'Anonyme',
      action,
      details,
      date,
      time,
      ip: getClientIp(),
      createdAt: iso,
    }
    db.value.logs.unshift(entry)
    persist()
  }

  function notify(type: NotificationType, title: string, message: string) {
    const n: CfNotification = {
      id: uid('notif'),
      type,
      title,
      message,
      read: false,
      createdAt: nowParts().iso,
    }
    db.value.notifications.unshift(n)
    persist()
  }

  function login(username: string, password: string): { ok: boolean; message: string } {
    const user = db.value.users.find(
      (u) => u.username.toLowerCase() === username.toLowerCase() && u.password === password,
    )
    if (!user) {
      notify('acces_refuse', 'Accès non autorisé', `Tentative de connexion échouée pour « ${username} ».`)
      log('Tentative de connexion échouée', `Utilisateur: ${username}`, null)
      return { ok: false, message: 'Identifiant ou mot de passe incorrect' }
    }
    if (!user.isActive) {
      notify('acces_refuse', 'Compte désactivé', `Le compte « ${username} » est inactif.`)
      return { ok: false, message: 'Compte désactivé' }
    }
    setSession(user)
    log('Connexion', `Rôle: ${user.role}`, user)
    return { ok: true, message: `Bienvenue ${user.fullName}` }
  }

  function logout() {
    if (currentUser.value) log('Déconnexion')
    setSession(null)
  }

  function hasRole(...roles: CfRole[]) {
    return !!currentUser.value && roles.includes(currentUser.value.role)
  }

  function canManagePrices() {
    return hasRole(...PRICE_ROLES)
  }

  function canSuperviseStock() {
    return hasRole(...SUPERVISOR_ROLES)
  }

  function canManageUsers() {
    return hasRole(...ADMIN_ROLES)
  }

  // ---------- Products / Stock ----------
  function productStats(product: CfProduct) {
    const entries = db.value.movements
      .filter((m) => m.productId === product.id && m.type === 'entree')
      .reduce((s, m) => s + m.quantity, 0)
    const sold = db.value.movements
      .filter((m) => m.productId === product.id && m.type === 'sortie_vente')
      .reduce((s, m) => s + m.quantity, 0)
    const otherOut = db.value.movements
      .filter((m) =>
        m.productId === product.id &&
        ['correction', 'perte', 'perime', 'ajustement'].includes(m.type) &&
        m.quantity < 0,
      )
      .reduce((s, m) => s + Math.abs(m.quantity), 0)
    const correctionsIn = db.value.movements
      .filter((m) =>
        m.productId === product.id &&
        m.type === 'correction' &&
        m.quantity > 0,
      )
      .reduce((s, m) => s + m.quantity, 0)

    return {
      stockInitial: product.stockInitial,
      quantiteEntree: entries + correctionsIn,
      quantiteVendue: sold,
      quantiteSortie: sold + otherOut,
      stockRestant: product.stockCurrent,
      valeurStock: product.stockCurrent * product.purchasePrice,
    }
  }

  function checkStockAlerts(product: CfProduct) {
    if (product.stockCurrent <= 0) {
      notify('rupture', 'Rupture de stock', `${product.name} est en rupture.`)
    } else if (product.stockCurrent <= product.stockMin) {
      notify('stock_faible', 'Stock faible', `${product.name} : stock bientôt en rupture (${product.stockCurrent} restants).`)
    }
  }

  function resolveSupplierName(supplierId?: string, fallback?: string) {
    if (supplierId) {
      const found = db.value.suppliers.find((s) => s.id === supplierId)
      if (found) return found.name
    }
    return fallback?.trim() || undefined
  }

  function upsertSupplier(payload: {
    id?: string
    name: string
    phone?: string
    address?: string
    notes?: string
    isActive?: boolean
  }) {
    if (!canSuperviseStock()) throw new Error('Accès non autorisé')
    const name = payload.name.trim()
    if (!name) throw new Error('Nom du fournisseur requis')

    const duplicate = db.value.suppliers.find(
      (s) => s.name.toLowerCase() === name.toLowerCase() && s.id !== payload.id,
    )
    if (duplicate) throw new Error('Ce fournisseur existe déjà')

    if (payload.id) {
      const supplier = db.value.suppliers.find((s) => s.id === payload.id)
      if (!supplier) throw new Error('Fournisseur introuvable')
      supplier.name = name
      supplier.phone = payload.phone?.trim() || undefined
      supplier.address = payload.address?.trim() || undefined
      supplier.notes = payload.notes?.trim() || undefined
      if (payload.isActive != null) supplier.isActive = payload.isActive
      for (const p of db.value.products) {
        if (p.supplierId === supplier.id) p.supplier = supplier.name
      }
      log('Modification fournisseur', supplier.name)
      persist()
      return supplier
    }

    const supplier: CfSupplier = {
      id: uid('sup'),
      name,
      phone: payload.phone?.trim() || undefined,
      address: payload.address?.trim() || undefined,
      notes: payload.notes?.trim() || undefined,
      isActive: payload.isActive ?? true,
      createdAt: nowParts().iso,
    }
    db.value.suppliers.unshift(supplier)
    log('Nouveau fournisseur', supplier.name)
    persist()
    return supplier
  }

  function supplierStats(supplier: CfSupplier) {
    const products = db.value.products.filter(
      (p) => p.supplierId === supplier.id || p.supplier === supplier.name,
    )
    const entries = db.value.movements.filter(
      (m) => m.type === 'entree' && m.supplier === supplier.name,
    )
    const totalQty = entries.reduce((s, m) => s + m.quantity, 0)
    const totalValue = entries.reduce((s, m) => s + (m.totalValue || 0), 0)
    return {
      productCount: products.length,
      entriesCount: entries.length,
      totalQty,
      totalValue,
    }
  }

  const activeSuppliers = computed(() =>
    [...db.value.suppliers]
      .filter((s) => s.isActive)
      .sort((a, b) => a.name.localeCompare(b.name, 'fr')),
  )

  /** Sorties de stock : ventes, pertes et produits périmés. */
  const etatSorties = computed(() =>
    db.value.movements.filter((m) =>
      ['sortie_vente', 'perte', 'perime'].includes(m.type),
    ),
  )

  const etatSortiesResume = computed(() => {
    const map = new Map<
      string,
      { productId: string; productName: string; quantite: number; valeur: number }
    >()
    for (const m of etatSorties.value) {
      const prev = map.get(m.productId) ?? {
        productId: m.productId,
        productName: m.productName,
        quantite: 0,
        valeur: 0,
      }
      prev.quantite += m.quantity
      prev.valeur += m.totalValue ?? m.quantity * (m.unitPrice ?? 0)
      map.set(m.productId, prev)
    }
    return [...map.values()].sort((a, b) => b.quantite - a.quantite)
  })

  function addProduct(payload: {
    name: string
    unit: string
    purchasePrice: number
    salePrice: number
    stockInitial: number
    stockMin: number
    supplier?: string
    supplierId?: string
  }) {
    if (!canSuperviseStock()) throw new Error('Accès non autorisé')
    const { iso } = nowParts()
    const supplierName = resolveSupplierName(payload.supplierId, payload.supplier)
    const product: CfProduct = {
      id: uid('prod'),
      name: payload.name.trim(),
      unit: payload.unit,
      purchasePrice: payload.purchasePrice,
      salePrice: payload.salePrice,
      stockInitial: payload.stockInitial,
      stockCurrent: payload.stockInitial,
      stockMin: payload.stockMin,
      supplier: supplierName,
      supplierId: payload.supplierId,
      createdAt: iso,
      updatedAt: iso,
    }
    db.value.products.unshift(product)
    if (payload.stockInitial > 0) {
      addMovement({
        type: 'entree',
        productId: product.id,
        quantity: payload.stockInitial,
        unitPrice: payload.purchasePrice,
        supplier: payload.supplier,
        reason: 'Stock initial',
      })
    }
    log('Nouveau produit', product.name)
    persist()
    return product
  }

  function addMovement(payload: {
    type: StockMovementType
    productId: string
    quantity: number
    unitPrice?: number
    supplier?: string
    reason?: string
    invoiceId?: string
  }) {
    const product = db.value.products.find((p) => p.id === payload.productId)
    if (!product) throw new Error('Produit introuvable')
    const { date, time, iso } = nowParts()
    const signedQty =
      payload.type === 'entree' || (payload.type === 'correction' && payload.quantity > 0)
        ? Math.abs(payload.quantity)
        : payload.type === 'correction'
          ? payload.quantity
          : -Math.abs(payload.quantity)

    if (signedQty < 0 && product.stockCurrent + signedQty < 0) {
      throw new Error(`Stock insuffisant pour ${product.name}`)
    }

    product.stockCurrent += signedQty
    product.updatedAt = iso

    const movement: CfStockMovement = {
      id: uid('mov'),
      type: payload.type,
      productId: product.id,
      productName: product.name,
      quantity: Math.abs(payload.quantity),
      unitPrice: payload.unitPrice,
      totalValue: payload.unitPrice != null ? Math.abs(payload.quantity) * payload.unitPrice : undefined,
      supplier: payload.supplier,
      reason: payload.reason,
      userId: currentUser.value?.id ?? 'system',
      userName: currentUser.value?.fullName ?? 'Système',
      invoiceId: payload.invoiceId,
      date,
      time,
      createdAt: iso,
    }
    db.value.movements.unshift(movement)
    checkStockAlerts(product)
    persist()
    return movement
  }

  function supplyStock(payload: {
    productId: string
    quantity: number
    purchasePrice: number
    supplier?: string
    supplierId?: string
  }) {
    if (!canSuperviseStock()) throw new Error('Accès non autorisé')
    const product = db.value.products.find((p) => p.id === payload.productId)
    if (!product) throw new Error('Produit introuvable')
    const supplierName = resolveSupplierName(payload.supplierId, payload.supplier)
    if (!supplierName) throw new Error('Fournisseur requis')
    product.purchasePrice = payload.purchasePrice
    product.supplier = supplierName
    product.supplierId = payload.supplierId
    const mov = addMovement({
      type: 'entree',
      productId: payload.productId,
      quantity: payload.quantity,
      unitPrice: payload.purchasePrice,
      supplier: supplierName,
      reason: 'Approvisionnement',
    })
    log('Approvisionnement', `${product.name} +${payload.quantity} (${supplierName})`)
    return mov
  }

  function stockAdjustment(payload: {
    productId: string
    type: 'correction' | 'perte' | 'perime'
    quantity: number
    reason: string
  }) {
    if (!canSuperviseStock()) throw new Error('Accès non autorisé')
    const qty =
      payload.type === 'correction' ? payload.quantity : -Math.abs(payload.quantity)
    const mov = addMovement({
      type: payload.type,
      productId: payload.productId,
      quantity: qty,
      reason: payload.reason,
    })
    log(`Stock ${payload.type}`, payload.reason)
    return mov
  }

  function updatePrice(payload: {
    productId: string
    priceType: 'achat' | 'vente'
    newPrice: number
    reason: string
  }) {
    if (!canManagePrices()) throw new Error('Seuls Administrateur ou Directeur peuvent modifier les prix')
    const product = db.value.products.find((p) => p.id === payload.productId)
    if (!product) throw new Error('Produit introuvable')
    const { date, time, iso } = nowParts()
    const oldPrice = payload.priceType === 'achat' ? product.purchasePrice : product.salePrice
    if (payload.priceType === 'achat') product.purchasePrice = payload.newPrice
    else product.salePrice = payload.newPrice
    product.updatedAt = iso

    const hist: CfPriceHistory = {
      id: uid('price'),
      productId: product.id,
      productName: product.name,
      priceType: payload.priceType,
      oldPrice,
      newPrice: payload.newPrice,
      userId: currentUser.value!.id,
      userName: currentUser.value!.fullName,
      reason: payload.reason,
      date,
      time,
      createdAt: iso,
    }
    db.value.priceHistory.unshift(hist)
    log('Modification de prix', `${product.name}: ${oldPrice} → ${payload.newPrice} (${payload.priceType})`)
    persist()
    return hist
  }

  // ---------- Invoices / Sales ----------
  function createInvoice(payload: {
    lines: Array<{ productId: string; quantity: number }>
    clientName?: string
    clientPhone?: string
  }) {
    if (!hasRole('Facturier', 'Administrateur', 'Directeur')) {
      throw new Error('Seul le facturier peut créer une facture')
    }
    if (!payload.lines.length) throw new Error('Aucun produit sélectionné')

    const lines: CfInvoiceLine[] = payload.lines.map((l) => {
      const product = db.value.products.find((p) => p.id === l.productId)
      if (!product) throw new Error('Produit introuvable')
      if (l.quantity <= 0) throw new Error('Quantité invalide')
      if (product.stockCurrent < l.quantity) {
        throw new Error(`Stock insuffisant pour ${product.name}`)
      }
      return {
        productId: product.id,
        productName: product.name,
        quantity: l.quantity,
        unitPrice: product.salePrice,
        amount: l.quantity * product.salePrice,
      }
    })

    const { date, time, iso } = nowParts()
    db.value.invoiceCounter += 1
    const invoice: CfInvoice = {
      id: uid('inv'),
      number: `FAC-${db.value.invoiceCounter}`,
      date,
      time,
      clientName: payload.clientName?.trim() || undefined,
      clientPhone: payload.clientPhone?.trim() || undefined,
      lines,
      total: lines.reduce((s, l) => s + l.amount, 0),
      facturierId: currentUser.value!.id,
      facturierName: currentUser.value!.fullName,
      status: 'en_attente',
      createdAt: iso,
    }
    db.value.invoices.unshift(invoice)
    log('Création facture', invoice.number)
    persist()
    return invoice
  }

  function payInvoice(invoiceId: string) {
    if (!hasRole('Caissier', 'Administrateur', 'Directeur')) {
      throw new Error('Seul le caissier peut valider le paiement')
    }
    const invoice = db.value.invoices.find((i) => i.id === invoiceId)
    if (!invoice) throw new Error('Facture introuvable')
    if (invoice.status === 'payee') throw new Error('Facture déjà payée')
    if (invoice.status === 'annulee') throw new Error('Facture annulée')

    for (const line of invoice.lines) {
      addMovement({
        type: 'sortie_vente',
        productId: line.productId,
        quantity: line.quantity,
        unitPrice: line.unitPrice,
        invoiceId: invoice.id,
        reason: `Vente ${invoice.number}`,
      })
    }

    const { iso } = nowParts()
    db.value.receiptCounter += 1
    invoice.status = 'payee'
    invoice.paidAt = iso
    invoice.caissierId = currentUser.value!.id
    invoice.caissierName = currentUser.value!.fullName
    invoice.receiptNumber = `REC-${db.value.receiptCounter}`
    log('Paiement validé', `${invoice.number} / ${invoice.receiptNumber}`)
    persist()
    return invoice
  }

  function cancelInvoice(invoiceId: string, reason: string) {
    if (!hasRole('Administrateur', 'Directeur', 'Facturier')) {
      throw new Error('Accès non autorisé')
    }
    const invoice = db.value.invoices.find((i) => i.id === invoiceId)
    if (!invoice) throw new Error('Facture introuvable')
    if (invoice.status === 'payee') throw new Error('Impossible d’annuler une facture payée')
    invoice.status = 'annulee'
    notify('facture_annulee', 'Facture annulée', `${invoice.number} annulée. Motif: ${reason}`)
    log('Annulation facture', `${invoice.number} — ${reason}`)
    persist()
    return invoice
  }

  // ---------- Users ----------
  function upsertUser(payload: Omit<CfUser, 'id' | 'createdAt'> & { id?: string }) {
    if (!canManageUsers()) throw new Error('Accès non autorisé')
    if (payload.id) {
      const user = db.value.users.find((u) => u.id === payload.id)
      if (!user) throw new Error('Utilisateur introuvable')
      Object.assign(user, {
        username: payload.username,
        password: payload.password,
        fullName: payload.fullName,
        role: payload.role,
        isActive: payload.isActive,
      })
      log('Modification utilisateur', user.username)
      persist()
      return user
    }
    const exists = db.value.users.some(
      (u) => u.username.toLowerCase() === payload.username.toLowerCase(),
    )
    if (exists) throw new Error('Cet identifiant existe déjà')
    const user: CfUser = {
      id: uid('user'),
      username: payload.username,
      password: payload.password,
      fullName: payload.fullName,
      role: payload.role,
      isActive: payload.isActive,
      createdAt: nowParts().iso,
    }
    db.value.users.push(user)
    log('Création utilisateur', user.username)
    persist()
    return user
  }

  // ---------- Dashboard / Reports ----------
  const unpaidInvoices = computed(() =>
    db.value.invoices.filter((i) => i.status === 'en_attente'),
  )
  const paidToday = computed(() =>
    db.value.invoices.filter((i) => i.status === 'payee' && i.paidAt && isSameDay(i.paidAt)),
  )
  const ventesDuJour = computed(() => paidToday.value.length)
  const recettesDuJour = computed(() =>
    paidToday.value.reduce((s, i) => s + i.total, 0),
  )
  const facturesDuJour = computed(() =>
    db.value.invoices.filter((i) => isSameDay(i.createdAt)).length,
  )
  const produitsRupture = computed(() =>
    db.value.products.filter((p) => p.stockCurrent <= 0),
  )
  const produitsBientotRupture = computed(() =>
    db.value.products.filter((p) => p.stockCurrent > 0 && p.stockCurrent <= p.stockMin),
  )
  const valeurTotaleStock = computed(() =>
    db.value.products.reduce((s, p) => s + p.stockCurrent * p.purchasePrice, 0),
  )
  const produitsPlusVendus = computed(() => {
    const map = new Map<string, { name: string; qty: number; amount: number }>()
    for (const inv of paidToday.value) {
      for (const line of inv.lines) {
        const prev = map.get(line.productId) ?? { name: line.productName, qty: 0, amount: 0 }
        prev.qty += line.quantity
        prev.amount += line.amount
        map.set(line.productId, prev)
      }
    }
    return [...map.values()].sort((a, b) => b.qty - a.qty).slice(0, 5)
  })
  const unreadNotifications = computed(() =>
    db.value.notifications.filter((n) => !n.read),
  )

  function markNotificationRead(id: string) {
    const n = db.value.notifications.find((x) => x.id === id)
    if (n) {
      n.read = true
      persist()
    }
  }

  function markAllNotificationsRead() {
    db.value.notifications.forEach((n) => {
      n.read = true
    })
    persist()
  }

  function reportForPeriod(fromIso: string, toIso: string) {
    const paid = db.value.invoices.filter(
      (i) => i.status === 'payee' && i.paidAt && i.paidAt >= fromIso && i.paidAt <= toIso,
    )
    const ventes = paid.length
    const recettes = paid.reduce((s, i) => s + i.total, 0)
    let coutAchat = 0
    let stockVendu = 0
    for (const inv of paid) {
      for (const line of inv.lines) {
        const product = db.value.products.find((p) => p.id === line.productId)
        coutAchat += line.quantity * (product?.purchasePrice ?? 0)
        stockVendu += line.quantity
      }
    }
    return {
      ventes,
      recettes,
      benefices: recettes - coutAchat,
      stockVendu,
      stockRestant: db.value.products.reduce((s, p) => s + p.stockCurrent, 0),
      valeurStock: valeurTotaleStock.value,
      details: paid,
    }
  }

  function dailyReport() {
    const day = todayKey()
    return reportForPeriod(`${day}T00:00:00.000Z`, `${day}T23:59:59.999Z`)
  }

  function weeklyReport() {
    const end = new Date()
    const start = new Date()
    start.setDate(end.getDate() - 6)
    return reportForPeriod(start.toISOString(), end.toISOString())
  }

  function monthlyReport() {
    const now = new Date()
    const start = new Date(now.getFullYear(), now.getMonth(), 1)
    const end = new Date(now.getFullYear(), now.getMonth() + 1, 0, 23, 59, 59, 999)
    return reportForPeriod(start.toISOString(), end.toISOString())
  }

  function yearlyReport() {
    const now = new Date()
    const start = new Date(now.getFullYear(), 0, 1)
    const end = new Date(now.getFullYear(), 11, 31, 23, 59, 59, 999)
    return reportForPeriod(start.toISOString(), end.toISOString())
  }

  function globalSearch(q: string) {
    const query = q.trim().toLowerCase()
    if (!query) {
      return { products: [], invoices: [], clients: [], users: [], ventes: [] }
    }
    const products = db.value.products.filter((p) => p.name.toLowerCase().includes(query))
    const invoices = db.value.invoices.filter(
      (i) =>
        i.number.toLowerCase().includes(query) ||
        i.clientName?.toLowerCase().includes(query) ||
        i.clientPhone?.includes(query),
    )
    const clients = [
      ...new Map(
        db.value.invoices
          .filter((i) => i.clientName && i.clientName.toLowerCase().includes(query))
          .map((i) => [i.clientName!, { name: i.clientName!, phone: i.clientPhone }]),
      ).values(),
    ]
    const users = db.value.users.filter(
      (u) =>
        u.username.toLowerCase().includes(query) ||
        u.fullName.toLowerCase().includes(query) ||
        u.role.toLowerCase().includes(query),
    )
    const ventes = db.value.invoices.filter(
      (i) =>
        i.status === 'payee' &&
        (i.number.toLowerCase().includes(query) ||
          i.receiptNumber?.toLowerCase().includes(query) ||
          i.lines.some((l) => l.productName.toLowerCase().includes(query))),
    )
    return { products, invoices, clients, users, ventes }
  }

  function backup(): string {
    log('Sauvegarde manuelle')
    return exportDatabaseJson()
  }

  function restore(json: string) {
    db.value = importDatabaseJson(json)
    log('Restauration des données')
  }

  function resetDemoData() {
    if (!canManageUsers()) throw new Error('Accès non autorisé')
    db.value = createSeedDatabase()
    persist()
    log('Réinitialisation des données démo')
  }

  // Auto backup every hour
  if (typeof window !== 'undefined') {
    const AUTO_KEY = 'cf_auto_backup_v2'
    const last = Number(localStorage.getItem('cf_last_auto_backup') || 0)
    if (Date.now() - last > 60 * 60 * 1000) {
      localStorage.setItem(AUTO_KEY, exportDatabaseJson())
      localStorage.setItem('cf_last_auto_backup', String(Date.now()))
    }
    setInterval(() => {
      localStorage.setItem(AUTO_KEY, exportDatabaseJson())
      localStorage.setItem('cf_last_auto_backup', String(Date.now()))
    }, 60 * 60 * 1000)
  }

  watch(
    db,
    () => {
      // keep reactive reference consistent
    },
    { deep: true },
  )

  return {
    db,
    currentUser,
    searchQuery,
    unpaidInvoices,
    paidToday,
    ventesDuJour,
    recettesDuJour,
    facturesDuJour,
    produitsRupture,
    produitsBientotRupture,
    valeurTotaleStock,
    produitsPlusVendus,
    unreadNotifications,
    activeSuppliers,
    etatSorties,
    etatSortiesResume,
    login,
    logout,
    hasRole,
    canManagePrices,
    canSuperviseStock,
    canManageUsers,
    productStats,
    supplierStats,
    upsertSupplier,
    addProduct,
    supplyStock,
    stockAdjustment,
    updatePrice,
    createInvoice,
    payInvoice,
    cancelInvoice,
    upsertUser,
    markNotificationRead,
    markAllNotificationsRead,
    dailyReport,
    weeklyReport,
    monthlyReport,
    yearlyReport,
    globalSearch,
    backup,
    restore,
    resetDemoData,
    reloadFromStorage,
    formatMoney,
    log,
  }
})
