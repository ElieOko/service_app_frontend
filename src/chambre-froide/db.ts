import type { CfDatabase, CfProduct, CfSupplier, CfUser } from './types'
import { uid, nowParts } from './utils/helpers'

export const CF_DB_KEY = 'cf_database_v2'
export const CF_SESSION_KEY = 'cf_session_v2'
export const CF_SYNC_CHANNEL = 'cf_sync_v2'

const { iso } = nowParts()

const seedUsers: CfUser[] = [
  {
    id: 'u_admin',
    username: 'admin',
    password: 'admin123',
    fullName: 'Administrateur Système',
    role: 'Administrateur',
    isActive: true,
    createdAt: iso,
  },
  {
    id: 'u_directeur',
    username: 'directeur',
    password: 'dir123',
    fullName: 'Directeur Général',
    role: 'Directeur',
    isActive: true,
    createdAt: iso,
  },
  {
    id: 'u_superviseur',
    username: 'superviseur',
    password: 'sup123',
    fullName: 'Superviseur Stock',
    role: 'Superviseur',
    isActive: true,
    createdAt: iso,
  },
  {
    id: 'u_facturier',
    username: 'facturier',
    password: 'fac123',
    fullName: 'Facturier Principal',
    role: 'Facturier',
    isActive: true,
    createdAt: iso,
  },
  {
    id: 'u_caissier',
    username: 'caissier',
    password: 'cai123',
    fullName: 'Caissier Principal',
    role: 'Caissier',
    isActive: true,
    createdAt: iso,
  },
]

const seedSuppliers: CfSupplier[] = [
  { id: 'sup_ferme', name: 'Ferme Nord', phone: '081 000 1111', address: 'Kinshasa', isActive: true, createdAt: iso },
  { id: 'sup_peche', name: 'Pêcherie Atlantique', phone: '081 000 2222', address: 'Matadi', isActive: true, createdAt: iso },
  { id: 'sup_boucherie', name: 'Boucherie Centrale', phone: '081 000 3333', address: 'Kinshasa', isActive: true, createdAt: iso },
  { id: 'sup_charcut', name: 'Charcuterie Plus', phone: '081 000 4444', isActive: true, createdAt: iso },
  { id: 'sup_lactalis', name: 'Lactalis Pro', phone: '081 000 5555', isActive: true, createdAt: iso },
]

const seedProducts: CfProduct[] = [
  {
    id: uid('prod'),
    name: 'Poulet entier congelé',
    unit: 'pièce',
    purchasePrice: 8,
    salePrice: 12,
    stockInitial: 100,
    stockCurrent: 100,
    stockMin: 15,
    supplier: 'Ferme Nord',
    supplierId: 'sup_ferme',
    createdAt: iso,
    updatedAt: iso,
  },
  {
    id: uid('prod'),
    name: 'Poisson capitaine',
    unit: 'kg',
    purchasePrice: 6,
    salePrice: 10,
    stockInitial: 80,
    stockCurrent: 80,
    stockMin: 10,
    supplier: 'Pêcherie Atlantique',
    supplierId: 'sup_peche',
    createdAt: iso,
    updatedAt: iso,
  },
  {
    id: uid('prod'),
    name: 'Viande de bœuf',
    unit: 'kg',
    purchasePrice: 9,
    salePrice: 14,
    stockInitial: 50,
    stockCurrent: 50,
    stockMin: 8,
    supplier: 'Boucherie Centrale',
    supplierId: 'sup_boucherie',
    createdAt: iso,
    updatedAt: iso,
  },
  {
    id: uid('prod'),
    name: 'Saucisses cocktail',
    unit: 'paquet',
    purchasePrice: 3,
    salePrice: 5.5,
    stockInitial: 120,
    stockCurrent: 12,
    stockMin: 20,
    supplier: 'Charcuterie Plus',
    supplierId: 'sup_charcut',
    createdAt: iso,
    updatedAt: iso,
  },
  {
    id: uid('prod'),
    name: 'Glace vanille 5L',
    unit: 'seau',
    purchasePrice: 7,
    salePrice: 11,
    stockInitial: 40,
    stockCurrent: 0,
    stockMin: 5,
    supplier: 'Lactalis Pro',
    supplierId: 'sup_lactalis',
    createdAt: iso,
    updatedAt: iso,
  },
]

function ensureSuppliers(db: CfDatabase): CfDatabase {
  if (!Array.isArray(db.suppliers)) db.suppliers = []

  const byName = new Map(db.suppliers.map((s) => [s.name.trim().toLowerCase(), s]))

  for (const product of db.products || []) {
    const name = product.supplier?.trim()
    if (!name) continue
    const key = name.toLowerCase()
    let supplier = byName.get(key)
    if (!supplier) {
      supplier = {
        id: uid('sup'),
        name,
        isActive: true,
        createdAt: nowParts().iso,
      }
      db.suppliers.push(supplier)
      byName.set(key, supplier)
    }
    product.supplierId = supplier.id
    product.supplier = supplier.name
  }

  for (const mov of db.movements || []) {
    const name = mov.supplier?.trim()
    if (!name) continue
    const key = name.toLowerCase()
    if (!byName.has(key)) {
      const supplier: CfSupplier = {
        id: uid('sup'),
        name,
        isActive: true,
        createdAt: nowParts().iso,
      }
      db.suppliers.push(supplier)
      byName.set(key, supplier)
    }
  }

  return db
}

export function createSeedDatabase(): CfDatabase {
  return {
    users: seedUsers,
    products: seedProducts,
    suppliers: seedSuppliers,
    invoices: [],
    movements: [],
    priceHistory: [],
    logs: [],
    notifications: [
      {
        id: uid('notif'),
        type: 'stock_faible',
        title: 'Stock faible',
        message: 'Saucisses cocktail : stock bientôt en rupture (12 restants).',
        read: false,
        createdAt: iso,
      },
      {
        id: uid('notif'),
        type: 'rupture',
        title: 'Rupture de stock',
        message: 'Glace vanille 5L est en rupture.',
        read: false,
        createdAt: iso,
      },
    ],
    invoiceCounter: 1000,
    receiptCounter: 5000,
    version: 2,
  }
}

export function loadDatabase(): CfDatabase {
  const raw = localStorage.getItem(CF_DB_KEY)
  if (!raw) {
    const seed = createSeedDatabase()
    localStorage.setItem(CF_DB_KEY, JSON.stringify(seed))
    return seed
  }
  try {
    const parsed = ensureSuppliers(JSON.parse(raw) as CfDatabase)
    localStorage.setItem(CF_DB_KEY, JSON.stringify(parsed))
    return parsed
  } catch {
    const seed = createSeedDatabase()
    localStorage.setItem(CF_DB_KEY, JSON.stringify(seed))
    return seed
  }
}

export function saveDatabase(db: CfDatabase): void {
  localStorage.setItem(CF_DB_KEY, JSON.stringify(db))
  try {
    const channel = new BroadcastChannel(CF_SYNC_CHANNEL)
    channel.postMessage({ type: 'db_updated', at: Date.now() })
    channel.close()
  } catch {
    // BroadcastChannel may be unavailable in some environments
  }
}

export function exportDatabaseJson(): string {
  return JSON.stringify(loadDatabase(), null, 2)
}

export function importDatabaseJson(json: string): CfDatabase {
  const parsed = ensureSuppliers(JSON.parse(json) as CfDatabase)
  if (!parsed.users || !parsed.products) {
    throw new Error('Fichier de sauvegarde invalide')
  }
  saveDatabase(parsed)
  return parsed
}
