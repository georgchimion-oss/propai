export interface Property {
  id: string
  name: string
  address: string
  units: number
  yearBuilt: number
}

export type DocType =
  | 'Lease'
  | 'Amendment'
  | 'Notice'
  | 'Meeting Minutes'
  | 'Financial Report'
  | 'Rules & Regs'

export type DocStatus = 'Draft' | 'Pending Signature' | 'Active' | 'Expired' | 'Archived'

export interface Document {
  id: string
  propertyId: string
  name: string
  type: DocType
  status: DocStatus
  lastModified: string
  createdBy: string
  unit?: string
  fileSize: string
  description: string
}

export interface Template {
  id: string
  name: string
  description: string
  timesUsed: number
  lastUpdated: string
  category: string
}

export type SignatureStatus = 'Pending' | 'Viewed' | 'Signed' | 'Expired'

export interface SignatureRecord {
  id: string
  propertyId: string
  documentName: string
  signerName: string
  signerEmail: string
  sentDate: string
  status: SignatureStatus
  daysRemaining: number
  unit?: string
}
