export type InspectionStatus = 'passed' | 'failed' | 'scheduled' | 'overdue' | 'in_progress'
export type DocumentStatus = 'current' | 'expiring_soon' | 'expired' | 'missing'
export type ReserveHealth = 'funded' | 'underfunded' | 'critical'

export interface Building {
  name: string
  address: string
  yearBuilt: number
  stories: number
  units: number
  nextMilestone: string
  overallScore: number
}

export interface Property {
  id: string
  name: string
  address: string
  units: number
  yearBuilt: number
  stories: number
}

export interface Inspection {
  id: string
  type: string
  description: string
  status: InspectionStatus
  dueDate: string
  completedDate?: string
  inspector?: string
  findings?: string
  building: string
  propertyId: string
}

export interface ComplianceItem {
  id: string
  requirement: string
  category: string
  status: 'compliant' | 'action_needed' | 'non_compliant' | 'pending'
  dueDate: string
  details: string
  sbReference: string
  propertyId: string
}

export interface ReserveStudy {
  component: string
  currentFunding: number
  requiredFunding: number
  health: ReserveHealth
  usefulLife: number
  remainingLife: number
  propertyId: string
}

export interface ComplianceDocument {
  id: string
  name: string
  category: string
  status: DocumentStatus
  uploadDate: string
  expiryDate?: string
  fileSize: string
  propertyId: string
}

export interface TimelineEvent {
  id: string
  date: string
  title: string
  description: string
  type: 'inspection' | 'deadline' | 'filing' | 'meeting' | 'milestone'
  status: 'completed' | 'upcoming' | 'overdue'
  propertyId: string
}
