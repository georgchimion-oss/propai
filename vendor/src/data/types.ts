export interface Property {
  id: string
  name: string
  address: string
  units: number
  yearBuilt: number
}

export type RFPCategory =
  | 'Plumbing'
  | 'Electrical'
  | 'Landscaping'
  | 'Painting'
  | 'Roofing'
  | 'Elevator'
  | 'HVAC'
  | 'Security'

export type RFPStatus =
  | 'Draft'
  | 'Open for Bids'
  | 'Under Review'
  | 'Awarded'
  | 'Closed'

export type VendorStatus = 'Active' | 'Suspended' | 'New'

export interface RFP {
  id: string
  propertyId: string
  title: string
  category: RFPCategory
  status: RFPStatus
  deadline: string
  bidsReceived: number
  budgetMin: number
  budgetMax: number
  description: string
  postedDate: string
}

export interface Bid {
  id: string
  rfpId: string
  vendorId: string
  vendorName: string
  amount: number
  timelineDays: number
  insuranceVerified: boolean
  licensed: boolean
  aiScore: number
  aiReasoning: string
  vendorRating: number
  submittedDate: string
  notes: string
  recommended: boolean
}

export interface VendorRecord {
  id: string
  company: string
  specialty: RFPCategory[]
  phone: string
  email: string
  rating: number
  jobsCompleted: number
  licensed: boolean
  insuranceExpiry: string
  status: VendorStatus
  yearsInBusiness: number
}
