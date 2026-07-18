import type {
  CfOrganization,
  CfPlatformDatabase,
  CfProduct,
  CfSession,
  CfSupplier,
  CfUser,
  CfWorkspace,
} from './types'
import { uid, nowParts } from './utils/helpers'

export const CF_DB_KEY = 'cf_platform_v3'
export const CF_DB_KEY_LEGACY = 'cf_database_v2'
export const CF_SESSION_KEY = 'cf_session_v2'
export const CF_SYNC_CHANNEL = 'cf_sync_v2'

const DEMO_ORG_ID = 'org_demo'
const { iso } = nowParts()

function withOrgId(users: Omit<CfUser, 'organizationId'>[], organizationId: string): CfUser[] {
  return users.map((u) => ({ ...u, organizationId }))
}

const seedUsersBase: Omit<CfUser, 'organizationId'>[] = [
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
    id: 'prod_poulet',
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
    id: 'prod_poisson',
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
    id: 'prod_boeuf',
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
    id: 'prod_saucisse',
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
    id: 'prod_glace',
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

export function normalizeOrgCode(code: string): string {
  return code
    .trim()
    .toUpperCase()
    .replace(/\s+/g, '-')
    .replace(/[^A-Z0-9-_]/g, '')
}

export function createEmptyWorkspace(organizationId: string, admin?: {
  fullName: string
  username: string
  password: string
}): CfWorkspace {
  const users: CfUser[] = admin
    ? [
        {
          id: uid('user'),
          organizationId,
          username: admin.username.trim(),
          password: admin.password,
          fullName: admin.fullName.trim(),
          role: 'Administrateur',
          isActive: true,
          createdAt: nowParts().iso,
        },
      ]
    : []

  return {
    users,
    products: [],
    suppliers: [],
    invoices: [],
    movements: [],
    priceHistory: [],
    logs: [],
    notifications: [],
    invoiceCounter: 1000,
    receiptCounter: 5000,
  }
}

export function createDemoWorkspace(organizationId: string): CfWorkspace {
  return {
    users: withOrgId(seedUsersBase, organizationId),
    products: structuredClone(seedProducts),
    suppliers: structuredClone(seedSuppliers),
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
  }
}

function ensureSuppliers(ws: CfWorkspace): CfWorkspace {
  if (!Array.isArray(ws.suppliers)) ws.suppliers = []
  const byName = new Map(ws.suppliers.map((s) => [s.name.trim().toLowerCase(), s]))

  for (const product of ws.products || []) {
    const name = product.supplier?.trim()
    if (!name) continue
    const key = name.toLowerCase()
    let supplier = byName.get(key)
    if (!supplier) {
      supplier = { id: uid('sup'), name, isActive: true, createdAt: nowParts().iso }
      ws.suppliers.push(supplier)
      byName.set(key, supplier)
    }
    product.supplierId = supplier.id
    product.supplier = supplier.name
  }
  return ws
}

export function createSeedPlatform(): CfPlatformDatabase {
  const demoOrg: CfOrganization = {
    id: DEMO_ORG_ID,
    name: 'Chambre Froide Démo',
    code: 'DEMO',
    phone: '081 000 0000',
    email: 'demo@chambrefroide.local',
    address: 'Kinshasa',
    isActive: true,
    createdAt: iso,
  }

  const secondOrgId = 'org_froidplus'
  const secondOrg: CfOrganization = {
    id: secondOrgId,
    name: 'Froid Plus SARL',
    code: 'FROIDPLUS',
    phone: '082 111 2222',
    email: 'contact@froidplus.local',
    address: 'Lubumbashi',
    isActive: true,
    createdAt: iso,
  }

  return {
    organizations: [demoOrg, secondOrg],
    workspaces: {
      [DEMO_ORG_ID]: createDemoWorkspace(DEMO_ORG_ID),
      [secondOrgId]: {
        ...createEmptyWorkspace(secondOrgId, {
          fullName: 'Admin Froid Plus',
          username: 'admin',
          password: 'froid123',
        }),
        products: [],
        suppliers: [],
      },
    },
    version: 3,
  }
}

function migrateLegacyWorkspace(raw: any): CfPlatformDatabase {
  const org: CfOrganization = {
    id: DEMO_ORG_ID,
    name: 'Chambre Froide Démo',
    code: 'DEMO',
    isActive: true,
    createdAt: nowParts().iso,
  }
  const ws = ensureSuppliers({
    users: (raw.users || []).map((u: CfUser) => ({
      ...u,
      organizationId: u.organizationId || DEMO_ORG_ID,
    })),
    products: raw.products || [],
    suppliers: raw.suppliers || [],
    invoices: raw.invoices || [],
    movements: raw.movements || [],
    priceHistory: raw.priceHistory || [],
    logs: raw.logs || [],
    notifications: raw.notifications || [],
    invoiceCounter: raw.invoiceCounter || 1000,
    receiptCounter: raw.receiptCounter || 5000,
  })
  return {
    organizations: [org],
    workspaces: { [DEMO_ORG_ID]: ws },
    version: 3,
  }
}

function normalizePlatform(data: CfPlatformDatabase): CfPlatformDatabase {
  if (!Array.isArray(data.organizations)) data.organizations = []
  if (!data.workspaces || typeof data.workspaces !== 'object') data.workspaces = {}

  for (const org of data.organizations) {
    org.code = normalizeOrgCode(org.code || org.name)
    if (!data.workspaces[org.id]) {
      data.workspaces[org.id] = createEmptyWorkspace(org.id)
    } else {
      data.workspaces[org.id] = ensureSuppliers(data.workspaces[org.id])
      data.workspaces[org.id].users = (data.workspaces[org.id].users || []).map((u) => ({
        ...u,
        organizationId: org.id,
      }))
    }
  }
  data.version = 3
  return data
}

export function loadPlatform(): CfPlatformDatabase {
  const raw = localStorage.getItem(CF_DB_KEY)
  if (raw) {
    try {
      const parsed = JSON.parse(raw)
      if (parsed.organizations && parsed.workspaces) {
        const platform = normalizePlatform(parsed as CfPlatformDatabase)
        localStorage.setItem(CF_DB_KEY, JSON.stringify(platform))
        return platform
      }
    } catch {
      // fall through
    }
  }

  // Migration depuis l'ancienne clé mono-tenant
  const legacy = localStorage.getItem(CF_DB_KEY_LEGACY)
  if (legacy) {
    try {
      const parsed = JSON.parse(legacy)
      if (parsed.users && parsed.products && !parsed.organizations) {
        const migrated = migrateLegacyWorkspace(parsed)
        localStorage.setItem(CF_DB_KEY, JSON.stringify(migrated))
        return migrated
      }
    } catch {
      // fall through
    }
  }

  const seed = createSeedPlatform()
  localStorage.setItem(CF_DB_KEY, JSON.stringify(seed))
  return seed
}

export function savePlatform(platform: CfPlatformDatabase): void {
  localStorage.setItem(CF_DB_KEY, JSON.stringify(platform))
  try {
    const channel = new BroadcastChannel(CF_SYNC_CHANNEL)
    channel.postMessage({ type: 'db_updated', at: Date.now() })
    channel.close()
  } catch {
    // ignore
  }
}

/** @deprecated — compat store: charge le workspace de la session ou démo */
export function loadDatabase(): CfWorkspace {
  const platform = loadPlatform()
  const session = readSession()
  if (session && platform.workspaces[session.organizationId]) {
    return platform.workspaces[session.organizationId]
  }
  const first = platform.organizations[0]
  return first ? platform.workspaces[first.id] : createDemoWorkspace(DEMO_ORG_ID)
}

export function saveDatabase(_db: CfWorkspace): void {
  // Les sauvegardes workspace passent par le store (savePlatform)
}

export function readSession(): CfSession | null {
  const raw = localStorage.getItem(CF_SESSION_KEY)
  if (!raw) return null
  try {
    const parsed = JSON.parse(raw)
    // Ancien format: utilisateur seul
    if (parsed && parsed.username && !parsed.user) {
      return null
    }
    if (parsed?.user && parsed?.organizationId) return parsed as CfSession
    return null
  } catch {
    return null
  }
}

export function writeSession(session: CfSession | null): void {
  if (session) localStorage.setItem(CF_SESSION_KEY, JSON.stringify(session))
  else localStorage.removeItem(CF_SESSION_KEY)
}

export function exportPlatformJson(): string {
  return JSON.stringify(loadPlatform(), null, 2)
}

export function exportOrgWorkspaceJson(organizationId: string): string {
  const platform = loadPlatform()
  const org = platform.organizations.find((o) => o.id === organizationId)
  const workspace = platform.workspaces[organizationId]
  if (!org || !workspace) throw new Error('Organisation introuvable')
  return JSON.stringify({ organization: org, workspace }, null, 2)
}

export function importPlatformJson(json: string): CfPlatformDatabase {
  const parsed = JSON.parse(json)
  if (parsed.organizations && parsed.workspaces) {
    const platform = normalizePlatform(parsed as CfPlatformDatabase)
    savePlatform(platform)
    return platform
  }
  // Restauration d'un export organisation seule
  if (parsed.organization && parsed.workspace) {
    const platform = loadPlatform()
    const org = parsed.organization as CfOrganization
    org.code = normalizeOrgCode(org.code)
    const existingIdx = platform.organizations.findIndex((o) => o.id === org.id || o.code === org.code)
    if (existingIdx >= 0) platform.organizations[existingIdx] = org
    else platform.organizations.push(org)
    platform.workspaces[org.id] = ensureSuppliers(parsed.workspace as CfWorkspace)
    savePlatform(platform)
    return platform
  }
  throw new Error('Fichier de sauvegarde invalide')
}

/** Compat anciens imports store */
export function exportDatabaseJson(): string {
  return exportPlatformJson()
}

export function importDatabaseJson(json: string): CfWorkspace {
  const platform = importPlatformJson(json)
  const session = readSession()
  if (session?.organizationId && platform.workspaces[session.organizationId]) {
    return platform.workspaces[session.organizationId]
  }
  const first = platform.organizations[0]
  return platform.workspaces[first.id]
}

export function createSeedDatabase(): CfWorkspace {
  return createDemoWorkspace(DEMO_ORG_ID)
}
