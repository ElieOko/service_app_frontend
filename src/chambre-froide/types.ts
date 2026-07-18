export type CfRole =
  | 'Administrateur'
  | 'Directeur'
  | 'Superviseur'
  | 'Facturier'
  | 'Caissier'

export type InvoiceStatus = 'en_attente' | 'payee' | 'annulee'

export type StockMovementType =
  | 'entree'
  | 'sortie_vente'
  | 'correction'
  | 'perte'
  | 'perime'
  | 'ajustement'

export type NotificationType =
  | 'stock_faible'
  | 'rupture'
  | 'facture_annulee'
  | 'acces_refuse'

export interface CfOrganization {
  id: string
  name: string
  /** Code unique pour rejoindre l'organisation (ex: DEMO, FROID-KIN) */
  code: string
  phone?: string
  email?: string
  address?: string
  isActive: boolean
  createdAt: string
}

export interface CfUser {
  id: string
  organizationId: string
  username: string
  password: string
  fullName: string
  role: CfRole
  isActive: boolean
  createdAt: string
}

export interface CfSupplier {
  id: string
  name: string
  phone?: string
  address?: string
  notes?: string
  isActive: boolean
  createdAt: string
}

export interface CfProduct {
  id: string
  name: string
  unit: string
  purchasePrice: number
  salePrice: number
  stockInitial: number
  stockCurrent: number
  stockMin: number
  supplier?: string
  supplierId?: string
  createdAt: string
  updatedAt: string
}

export interface CfInvoiceLine {
  productId: string
  productName: string
  quantity: number
  unitPrice: number
  amount: number
}

export interface CfInvoice {
  id: string
  number: string
  date: string
  time: string
  clientName?: string
  clientPhone?: string
  lines: CfInvoiceLine[]
  total: number
  facturierId: string
  facturierName: string
  caissierId?: string
  caissierName?: string
  status: InvoiceStatus
  paidAt?: string
  receiptNumber?: string
  createdAt: string
}

export interface CfStockMovement {
  id: string
  type: StockMovementType
  productId: string
  productName: string
  quantity: number
  unitPrice?: number
  totalValue?: number
  supplier?: string
  reason?: string
  userId: string
  userName: string
  invoiceId?: string
  date: string
  time: string
  createdAt: string
}

export interface CfPriceHistory {
  id: string
  productId: string
  productName: string
  priceType: 'achat' | 'vente'
  oldPrice: number
  newPrice: number
  userId: string
  userName: string
  reason: string
  date: string
  time: string
  createdAt: string
}

export interface CfActivityLog {
  id: string
  userId: string
  userName: string
  action: string
  details?: string
  date: string
  time: string
  ip: string
  createdAt: string
}

export interface CfNotification {
  id: string
  type: NotificationType
  title: string
  message: string
  read: boolean
  createdAt: string
}

/** Données métier isolées d'une organisation */
export interface CfWorkspace {
  users: CfUser[]
  products: CfProduct[]
  suppliers: CfSupplier[]
  invoices: CfInvoice[]
  movements: CfStockMovement[]
  priceHistory: CfPriceHistory[]
  logs: CfActivityLog[]
  notifications: CfNotification[]
  invoiceCounter: number
  receiptCounter: number
}

/** @deprecated alias — utiliser CfWorkspace */
export type CfDatabase = CfWorkspace

export interface CfPlatformDatabase {
  organizations: CfOrganization[]
  workspaces: Record<string, CfWorkspace>
  version: number
}

export interface CfSession {
  organizationId: string
  organizationCode: string
  organizationName: string
  user: CfUser
}
