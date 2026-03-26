export type Priority = 'critical' | 'high' | 'medium' | 'low'
export type Status = 'new' | 'triaging' | 'assigned' | 'in_progress' | 'resolved'
export type Category = 'plumbing' | 'electrical' | 'hvac' | 'structural' | 'pest' | 'appliance' | 'common_area' | 'elevator' | 'fire_safety' | 'other'

export interface WorkOrder {
  id: string
  propertyId: string
  unit: string
  building: string
  tenant: string
  description: string
  category: Category
  priority: Priority
  status: Status
  vendor?: string
  aiConfidence: number
  createdAt: string
  estimatedCost?: string
  photos?: string[]
}

export interface Vendor {
  id: string
  name: string
  specialty: Category[]
  rating: number
  responseTime: string
  hourlyRate: string
  available: boolean
}

export interface ChatMessage {
  id: string
  role: 'tenant' | 'ai'
  content: string
  timestamp: string
  options?: string[]
  showUpload?: boolean
}

export interface TriageResult {
  category: Category
  priority: Priority
  confidence: number
  vendor: Vendor
  estimatedCost: string
  reasoning: string
  steps: string[]
}
