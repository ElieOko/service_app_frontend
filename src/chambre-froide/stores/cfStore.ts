import { computed, ref, watch } from 'vue'
import { defineStore } from 'pinia'
import type {
  CfActivityLog,
  CfInvoice,
  CfInvoiceLine,
  CfNotification,
  CfOrganization,
  CfPlatformDatabase,
  CfPriceHistory,
  CfProduct,
  CfRole,
  CfSession,
  CfStockMovement,
  CfSupplier,
  CfUser,
  CfWorkspace,
  NotificationType,
  StockMovementType,
} from '../types'
import {
  CF_DB_KEY,
  CF_SESSION_KEY,
  CF_SYNC_CHANNEL,
  createDemoWorkspace,
  createEmptyWorkspace,
  createSeedPlatform,
  exportOrgWorkspaceJson,
  exportPlatformJson,
  importPlatformJson,
  loadPlatform,
  normalizeOrgCode,
  readSession as readStoredSession,
  savePlatform,
  writeSession,
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

function emptyWorkspace(): CfWorkspace {
  return createEmptyWorkspace('tmp')
}

export const useCfStore = defineStore('chambreFroide', () => {
  const platform = ref<CfPlatformDatabase>(loadPlatform())
  const session = ref<CfSession | null>(readStoredSession())
  const currentOrg = ref<CfOrganization | null>(null)
  const currentUser = ref<CfUser | null>(null)
  const db = ref<CfWorkspace>(emptyWorkspace())
  const searchQuery = ref('')

  function bindSession(next: CfSession | null) {
    session.value = next
    writeSession(next)
    if (!next) {
      currentOrg.value = null
      currentUser.value = null
      db.value = emptyWorkspace()
      return
    }
    const org = platform.value.organizations.find((o) => o.id === next.organizationId) || null
    currentOrg.value = org
    currentUser.value = next.user
    db.value = platform.value.workspaces[next.organizationId]
      ? platform.value.workspaces[next.organizationId]
      : emptyWorkspace()
  }

  // Restore workspace from existing session on boot
  if (session.value) {
    bindSession(session.value)
  }

  function persist() {
    if (!currentOrg.value) return
    platform.value.workspaces[currentOrg.value.id] = db.value
    savePlatform(platform.value)
  }

  function reloadFromStorage() {
    platform.value = loadPlatform()
    const stored = readStoredSession()
    bindSession(stored)
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
      if (e.key === CF_DB_KEY || e.key === CF_SESSION_KEY) reloadFromStorage()
    })
  }

  function log(action: string, details?: string, user?: CfUser | null) {
    if (!currentOrg.value) return
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
    if (!currentOrg.value) return
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

  function findOrgByCode(code: string): CfOrganization | undefined {
    const normalized = normalizeOrgCode(code)
    return platform.value.organizations.find((o) => o.code === normalized)
  }

  function login(
    orgCode: string,
    username: string,
    password: string,
  ): { ok: boolean; message: string } {
    const org = findOrgByCode(orgCode)
    if (!org) {
      return { ok: false, message: 'Organisation introuvable. Vérifiez le code.' }
    }
    if (!org.isActive) {
      return { ok: false, message: 'Cette organisation est désactivée' }
    }

    const workspace = platform.value.workspaces[org.id]
    if (!workspace) {
      return { ok: false, message: 'Espace organisation invalide' }
    }

    const user = workspace.users.find(
      (u) => u.username.toLowerCase() === username.toLowerCase() && u.password === password,
    )
    if (!user) {
      // Tentative sur le workspace cible sans session
      const { date, time, iso } = nowParts()
      workspace.logs.unshift({
        id: uid('log'),
        userId: 'anonymous',
        userName: 'Anonyme',
        action: 'Tentative de connexion échouée',
        details: `Utilisateur: ${username}`,
        date,
        time,
        ip: getClientIp(),
        createdAt: iso,
      })
      workspace.notifications.unshift({
        id: uid('notif'),
        type: 'acces_refuse',
        title: 'Accès non autorisé',
        message: `Tentative de connexion échouée pour « ${username} ».`,
        read: false,
        createdAt: iso,
      })
      platform.value.workspaces[org.id] = workspace
      savePlatform(platform.value)
      return { ok: false, message: 'Identifiant ou mot de passe incorrect' }
    }
    if (!user.isActive) {
      return { ok: false, message: 'Compte désactivé' }
    }

    const nextSession: CfSession = {
      organizationId: org.id,
      organizationCode: org.code,
      organizationName: org.name,
      user,
    }
    bindSession(nextSession)
    log('Connexion', `Org: ${org.code} · Rôle: ${user.role}`, user)
    return { ok: true, message: `Bienvenue ${user.fullName} — ${org.name}` }
  }

  function registerOrganization(payload: {
    name: string
    code: string
    phone?: string
    email?: string
    address?: string
    adminFullName: string
    adminUsername: string
    adminPassword: string
    withDemoData?: boolean
  }): { ok: boolean; message: string } {
    const code = normalizeOrgCode(payload.code)
    if (!payload.name.trim()) return { ok: false, message: 'Nom de l’organisation requis' }
    if (!code || code.length < 3) return { ok: false, message: 'Code organisation trop court (min. 3)' }
    if (platform.value.organizations.some((o) => o.code === code)) {
      return { ok: false, message: 'Ce code organisation est déjà utilisé' }
    }
    if (!payload.adminUsername.trim() || !payload.adminPassword) {
      return { ok: false, message: 'Compte administrateur requis' }
    }

    const org: CfOrganization = {
      id: uid('org'),
      name: payload.name.trim(),
      code,
      phone: payload.phone?.trim() || undefined,
      email: payload.email?.trim() || undefined,
      address: payload.address?.trim() || undefined,
      isActive: true,
      createdAt: nowParts().iso,
    }

    const workspace = payload.withDemoData
      ? createDemoWorkspace(org.id)
      : createEmptyWorkspace(org.id, {
          fullName: payload.adminFullName,
          username: payload.adminUsername,
          password: payload.adminPassword,
        })

    if (payload.withDemoData) {
      // Remplacer l'admin démo par le compte saisi
      const admin = workspace.users.find((u) => u.role === 'Administrateur') || workspace.users[0]
      if (admin) {
        admin.fullName = payload.adminFullName.trim()
        admin.username = payload.adminUsername.trim()
        admin.password = payload.adminPassword
        admin.organizationId = org.id
      }
      workspace.users.forEach((u) => {
        u.organizationId = org.id
      })
    }

    platform.value.organizations.push(org)
    platform.value.workspaces[org.id] = workspace
    savePlatform(platform.value)

    const adminUser = workspace.users.find(
      (u) => u.username.toLowerCase() === payload.adminUsername.trim().toLowerCase(),
    )!
    bindSession({
      organizationId: org.id,
      organizationCode: org.code,
      organizationName: org.name,
      user: adminUser,
    })
    log('Création organisation', org.code, adminUser)
    return { ok: true, message: `Organisation « ${org.name} » créée (code ${org.code})` }
  }

  function updateOrganization(payload: {
    name: string
    phone?: string
    email?: string
    address?: string
  }) {
    if (!canManageUsers() || !currentOrg.value) throw new Error('Accès non autorisé')
    const org = platform.value.organizations.find((o) => o.id === currentOrg.value!.id)
    if (!org) throw new Error('Organisation introuvable')
    org.name = payload.name.trim()
    org.phone = payload.phone?.trim() || undefined
    org.email = payload.email?.trim() || undefined
    org.address = payload.address?.trim() || undefined
    currentOrg.value = org
    if (session.value) {
      session.value.organizationName = org.name
      writeSession(session.value)
    }
    savePlatform(platform.value)
    log('Modification organisation', org.name)
    return org
  }

  function logout() {
    if (currentUser.value) log('Déconnexion')
    bindSession(null)
  }

  function leaveOrganization() {
    logout()
  }

  const organizations = computed(() =>
    [...platform.value.organizations].sort((a, b) => a.name.localeCompare(b.name, 'fr')),
  )

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
  function upsertUser(payload: {
    id?: string
    username: string
    password: string
    fullName: string
    role: CfRole
    isActive: boolean
  }) {
    if (!canManageUsers() || !currentOrg.value) throw new Error('Accès non autorisé')
    if (payload.id) {
      const user = db.value.users.find((u) => u.id === payload.id)
      if (!user) throw new Error('Utilisateur introuvable')
      Object.assign(user, {
        username: payload.username,
        password: payload.password,
        fullName: payload.fullName,
        role: payload.role,
        isActive: payload.isActive,
        organizationId: currentOrg.value.id,
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
      organizationId: currentOrg.value.id,
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
    if (!currentOrg.value) throw new Error('Aucune organisation active')
    log('Sauvegarde manuelle')
    return exportOrgWorkspaceJson(currentOrg.value.id)
  }

  function backupPlatform(): string {
    if (!canManageUsers()) throw new Error('Accès non autorisé')
    log('Sauvegarde plateforme')
    return exportPlatformJson()
  }

  function restore(json: string) {
    platform.value = importPlatformJson(json)
    const stored = readStoredSession()
    if (stored && platform.value.workspaces[stored.organizationId]) {
      bindSession(stored)
    } else if (currentOrg.value && platform.value.workspaces[currentOrg.value.id]) {
      const org = platform.value.organizations.find((o) => o.id === currentOrg.value!.id)!
      const user = platform.value.workspaces[org.id].users.find((u) => u.id === currentUser.value?.id)
        || platform.value.workspaces[org.id].users[0]
      if (user) {
        bindSession({
          organizationId: org.id,
          organizationCode: org.code,
          organizationName: org.name,
          user,
        })
      }
    }
    log('Restauration des données')
  }

  function resetDemoData() {
    if (!canManageUsers() || !currentOrg.value) throw new Error('Accès non autorisé')
    const orgId = currentOrg.value.id
    const admin = currentUser.value
    db.value = createDemoWorkspace(orgId)
    if (admin) {
      const target = db.value.users.find((u) => u.role === 'Administrateur') || db.value.users[0]
      if (target) {
        target.username = admin.username
        target.password = admin.password
        target.fullName = admin.fullName
        target.organizationId = orgId
        bindSession({
          organizationId: orgId,
          organizationCode: currentOrg.value.code,
          organizationName: currentOrg.value.name,
          user: target,
        })
      }
    }
    persist()
    log('Réinitialisation des données de l’organisation')
  }

  function resetPlatformDemo() {
    if (!canManageUsers()) throw new Error('Accès non autorisé')
    platform.value = createSeedPlatform()
    savePlatform(platform.value)
    bindSession(null)
  }

  // Auto backup every hour (organisation courante)
  if (typeof window !== 'undefined') {
    const AUTO_KEY = 'cf_auto_backup_v3'
    const last = Number(localStorage.getItem('cf_last_auto_backup') || 0)
    const doAuto = () => {
      try {
        if (currentOrg.value) {
          localStorage.setItem(AUTO_KEY, exportOrgWorkspaceJson(currentOrg.value.id))
          localStorage.setItem('cf_last_auto_backup', String(Date.now()))
        }
      } catch {
        // ignore
      }
    }
    if (Date.now() - last > 60 * 60 * 1000) doAuto()
    setInterval(doAuto, 60 * 60 * 1000)
  }

  watch(
    db,
    () => {
      // keep reactive reference consistent
    },
    { deep: true },
  )

  return {
    platform,
    db,
    session,
    currentOrg,
    currentUser,
    organizations,
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
    registerOrganization,
    updateOrganization,
    logout,
    leaveOrganization,
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
    backupPlatform,
    restore,
    resetDemoData,
    resetPlatformDemo,
    reloadFromStorage,
    findOrgByCode,
    formatMoney,
    log,
  }
})
