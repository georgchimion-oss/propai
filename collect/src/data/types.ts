export type PaymentStatus = 'paid' | 'pending' | 'late' | 'delinquent' | 'partial' | 'waived'
export type AutomationStep = 'reminder' | 'notice' | 'warning' | 'escalation' | 'legal'

export interface Tenant {
  id: string
  name: string
  unit: string
  building: string
  email: string
  phone: string
  leaseStart: string
  monthlyRent: number
  balance: number
  status: PaymentStatus
  lastPayment?: string
  paymentPlan?: boolean
  propertyId: string
}

export interface Property {
  id: string
  name: string
  address: string
  units: number
}

export interface Payment {
  id: string
  tenantId: string
  amount: number
  date: string
  method: string
  status: PaymentStatus
  reference?: string
}

export interface AutomationSequence {
  id: string
  name: string
  trigger: string
  steps: {
    day: number
    action: AutomationStep
    channel: string
    message: string
    sent?: boolean
  }[]
  active: boolean
  tenantsEnrolled: number
}

export interface CollectionStats {
  totalDue: number
  totalCollected: number
  collectionRate: number
  lateUnits: number
  delinquentUnits: number
  avgDaysLate: number
}
