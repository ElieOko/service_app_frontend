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

export const CF_DB_KEY = 'cf_platform_v4'
export const CF_DB_KEY_LEGACY = 'cf_platform_v3'
export const CF_DB_KEY_LEGACY_V2 = 'cf_database_v2'
export const CF_SESSION_KEY = 'cf_session_v2'
export const CF_SYNC_CHANNEL = 'cf_sync_v2'

const DEMO_ORG_ID = 'org_demo'
const { iso } = nowParts()

function withOrgId(users: Omit<CfUser, 'organizationId'>[], organizationId: string): CfUser[] {
  return users.map((u) => ({ ...u, organizationId }))
}

/** Identifiants démo : le mot de passe = l'identifiant */
const seedUsersBase: Omit<CfUser, 'organizationId'>[] = [
  {
    id: 'u_admin',
    username: 'admin',
    password: 'admin',
    fullName: 'Jean-Pierre Mukendi',
    role: 'Administrateur',
    isActive: true,
    createdAt: iso,
  },
  {
    id: 'u_directeur',
    username: 'directeur',
    password: 'directeur',
    fullName: 'Patrick Tshilombo',
    role: 'Directeur',
    isActive: true,
    createdAt: iso,
  },
  {
    id: 'u_superviseur',
    username: 'superviseur',
    password: 'superviseur',
    fullName: 'Grace Mbayo',
    role: 'Superviseur',
    isActive: true,
    createdAt: iso,
  },
  {
    id: 'u_facturier',
    username: 'facturier',
    password: 'facturier',
    fullName: 'Aline Kabongo',
    role: 'Facturier',
    isActive: true,
    createdAt: iso,
  },
  {
    id: 'u_caissier',
    username: 'caissier',
    password: 'caissier',
    fullName: 'David Ilunga',
    role: 'Caissier',
    isActive: true,
    createdAt: iso,
  },
]

const seedSuppliers: CfSupplier[] = [
  {
    id: 'sup_avicole',
    name: 'Aviculture Kongo Frais',
    phone: '081 234 5678',
    address: 'Nsele, Kinshasa',
    notes: 'Volaille fraîche et congelée',
    isActive: true,
    createdAt: iso,
  },
  {
    id: 'sup_fleuve',
    name: 'Pêcherie Fleuve Congo',
    phone: '082 345 6789',
    address: 'Kinkole, Kinshasa',
    notes: 'Poissons du fleuve et lacs',
    isActive: true,
    createdAt: iso,
  },
  {
    id: 'sup_nzuzi',
    name: 'Boucherie Mama Nzuzi',
    phone: '099 112 3344',
    address: 'Marché de la Liberté, Kinshasa',
    notes: 'Viandes de bœuf et porc',
    isActive: true,
    createdAt: iso,
  },
  {
    id: 'sup_frigo',
    name: 'Frigo Gombe SARL',
    phone: '085 556 7788',
    address: 'Gombe, Kinshasa',
    notes: 'Distribution chambre froide',
    isActive: true,
    createdAt: iso,
  },
  {
    id: 'sup_bateke',
    name: 'Fermes Bateke',
    phone: '097 221 3344',
    address: 'Plateau des Bateke',
    notes: 'Élevage local',
    isActive: true,
    createdAt: iso,
  },
]

/** Vivres frais courants en RDC — prix en USD (gros) */
const seedProducts: CfProduct[] = [
  {
    id: 'prod_cuisse',
    name: 'Cuisse de poulet',
    unit: 'kg',
    purchasePrice: 3.5,
    salePrice: 5,
    stockInitial: 200,
    stockCurrent: 200,
    stockMin: 30,
    supplier: 'Aviculture Kongo Frais',
    supplierId: 'sup_avicole',
    createdAt: iso,
    updatedAt: iso,
  },
  {
    id: 'prod_aile',
    name: 'Aile de poulet',
    unit: 'kg',
    purchasePrice: 3.2,
    salePrice: 4.8,
    stockInitial: 150,
    stockCurrent: 150,
    stockMin: 25,
    supplier: 'Aviculture Kongo Frais',
    supplierId: 'sup_avicole',
    createdAt: iso,
    updatedAt: iso,
  },
  {
    id: 'prod_poulet',
    name: 'Poulet entier',
    unit: 'pièce',
    purchasePrice: 6,
    salePrice: 9,
    stockInitial: 120,
    stockCurrent: 120,
    stockMin: 20,
    supplier: 'Fermes Bateke',
    supplierId: 'sup_bateke',
    createdAt: iso,
    updatedAt: iso,
  },
  {
    id: 'prod_capitaine',
    name: 'Poisson capitaine',
    unit: 'kg',
    purchasePrice: 7,
    salePrice: 11,
    stockInitial: 90,
    stockCurrent: 90,
    stockMin: 15,
    supplier: 'Pêcherie Fleuve Congo',
    supplierId: 'sup_fleuve',
    createdAt: iso,
    updatedAt: iso,
  },
  {
    id: 'prod_tilapia',
    name: 'Poisson tilapia',
    unit: 'kg',
    purchasePrice: 4,
    salePrice: 6.5,
    stockInitial: 110,
    stockCurrent: 18,
    stockMin: 20,
    supplier: 'Pêcherie Fleuve Congo',
    supplierId: 'sup_fleuve',
    createdAt: iso,
    updatedAt: iso,
  },
  {
    id: 'prod_mbandakala',
    name: 'Poisson mbandakala',
    unit: 'kg',
    purchasePrice: 5,
    salePrice: 8,
    stockInitial: 70,
    stockCurrent: 70,
    stockMin: 12,
    supplier: 'Pêcherie Fleuve Congo',
    supplierId: 'sup_fleuve',
    createdAt: iso,
    updatedAt: iso,
  },
  {
    id: 'prod_boeuf',
    name: 'Viande de bœuf',
    unit: 'kg',
    purchasePrice: 8,
    salePrice: 12,
    stockInitial: 80,
    stockCurrent: 80,
    stockMin: 15,
    supplier: 'Boucherie Mama Nzuzi',
    supplierId: 'sup_nzuzi',
    createdAt: iso,
    updatedAt: iso,
  },
  {
    id: 'prod_foie',
    name: 'Foie de bœuf',
    unit: 'kg',
    purchasePrice: 5.5,
    salePrice: 8.5,
    stockInitial: 40,
    stockCurrent: 40,
    stockMin: 8,
    supplier: 'Boucherie Mama Nzuzi',
    supplierId: 'sup_nzuzi',
    createdAt: iso,
    updatedAt: iso,
  },
  {
    id: 'prod_porc',
    name: 'Viande de porc',
    unit: 'kg',
    purchasePrice: 6.5,
    salePrice: 10,
    stockInitial: 60,
    stockCurrent: 60,
    stockMin: 10,
    supplier: 'Frigo Gombe SARL',
    supplierId: 'sup_frigo',
    createdAt: iso,
    updatedAt: iso,
  },
  {
    id: 'prod_crevette',
    name: 'Crevettes fraîches',
    unit: 'kg',
    purchasePrice: 12,
    salePrice: 18,
    stockInitial: 25,
    stockCurrent: 0,
    stockMin: 5,
    supplier: 'Frigo Gombe SARL',
    supplierId: 'sup_frigo',
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
        message: 'Poisson tilapia : stock bientôt en rupture (18 kg restants).',
        read: false,
        createdAt: iso,
      },
      {
        id: uid('notif'),
        type: 'rupture',
        title: 'Rupture de stock',
        message: 'Crevettes fraîches sont en rupture.',
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
    name: 'Froid Congo Vivres',
    code: 'DEMO',
    phone: '081 700 1122',
    email: 'contact@froidcongo.cd',
    address: 'Avenue du Port, Gombe — Kinshasa, RDC',
    isActive: true,
    createdAt: iso,
  }

  const secondOrgId = 'org_froidplus'
  const secondOrg: CfOrganization = {
    id: secondOrgId,
    name: 'Mboka Froid SARL',
    code: 'FROIDPLUS',
    phone: '099 880 1122',
    email: 'info@mbokafroid.cd',
    address: 'Lubumbashi, Haut-Katanga',
    isActive: true,
    createdAt: iso,
  }

  return {
    organizations: [demoOrg, secondOrg],
    workspaces: {
      [DEMO_ORG_ID]: createDemoWorkspace(DEMO_ORG_ID),
      [secondOrgId]: {
        ...createEmptyWorkspace(secondOrgId, {
          fullName: 'Joseph Kalala',
          username: 'admin',
          password: 'admin',
        }),
        products: [],
        suppliers: [],
      },
    },
    version: 4,
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
  data.version = 4
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
