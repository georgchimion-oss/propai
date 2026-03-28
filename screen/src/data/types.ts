export interface Property {
  id: string
  name: string
  address: string
  units: number
  yearBuilt: number
}

export type ApplicationStatus = 'pending_review' | 'in_progress' | 'approved' | 'denied'

export interface BackgroundCheck {
  criminal: 'clear' | 'flag' | 'pending'
  eviction: 'clear' | 'flag' | 'pending'
  employment: 'verified' | 'unverified' | 'pending'
  criminalDetail?: string
  evictionDetail?: string
  employmentDetail?: string
}

export interface Application {
  id: string
  propertyId: string
  applicantName: string
  email: string
  phone: string
  unit: string
  dateSubmitted: string
  status: ApplicationStatus
  screeningScore: number
  creditScore: number
  monthlyIncome: number
  monthlyRent: number
  backgroundCheck: BackgroundCheck
  aiRiskLevel: 'low' | 'medium' | 'high'
  aiRiskScore: number
  aiReasoning: string
  employerName: string
  yearsEmployed: number
  priorEvictions: number
}
