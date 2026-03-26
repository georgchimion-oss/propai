import type { Tenant, Payment, AutomationSequence, CollectionStats, Property } from './types'

export const properties: Property[] = [
  { id: 'bayshore', name: 'Bayshore Tower Residences', address: '1200 Brickell Ave, Miami, FL 33131', units: 180 },
  { id: 'coconut', name: 'Coconut Grove Palms', address: '3400 Main Hwy, Miami, FL 33133', units: 96 },
  { id: 'sunridge', name: 'Sunridge at Aventura', address: '19500 Turnberry Way, Aventura, FL 33180', units: 240 },
]

export const stats: CollectionStats = {
  totalDue: 324000,
  totalCollected: 298080,
  collectionRate: 92,
  lateUnits: 8,
  delinquentUnits: 3,
  avgDaysLate: 12,
}

export const tenants: Tenant[] = [
  { id: 't1', name: 'Maria Santos', unit: '14B', building: 'Tower A', email: 'maria.s@email.com', phone: '(305) 555-0142', leaseStart: '2022-06-01', monthlyRent: 2800, balance: 0, status: 'paid', lastPayment: '2024-03-01', propertyId: 'bayshore' },
  { id: 't2', name: 'James Chen', unit: '7A', building: 'Tower B', email: 'j.chen@email.com', phone: '(305) 555-0198', leaseStart: '2023-01-15', monthlyRent: 2200, balance: 0, status: 'paid', lastPayment: '2024-03-03', propertyId: 'bayshore' },
  { id: 't3', name: 'Robert Kim', unit: '3D', building: 'Tower B', email: 'r.kim@email.com', phone: '(305) 555-0267', leaseStart: '2023-08-01', monthlyRent: 1800, balance: 1800, status: 'late', lastPayment: '2024-02-05', propertyId: 'bayshore' },
  { id: 't4', name: 'Lisa Park', unit: '22C', building: 'Tower A', email: 'l.park@email.com', phone: '(305) 555-0334', leaseStart: '2021-11-01', monthlyRent: 3200, balance: 0, status: 'paid', lastPayment: '2024-03-01', propertyId: 'bayshore' },
  { id: 't5', name: 'Diana Cruz', unit: '18A', building: 'Tower A', email: 'd.cruz@email.com', phone: '(305) 555-0411', leaseStart: '2022-03-15', monthlyRent: 2600, balance: 5200, status: 'delinquent', lastPayment: '2024-01-02', propertyId: 'bayshore' },
  { id: 't6', name: 'Tom Rivera', unit: '9B', building: 'Tower B', email: 't.rivera@email.com', phone: '(305) 555-0478', leaseStart: '2023-05-01', monthlyRent: 2000, balance: 2000, status: 'late', lastPayment: '2024-02-10', propertyId: 'coconut' },
  { id: 't7', name: 'Sarah Johnson', unit: '11C', building: 'Tower A', email: 's.johnson@email.com', phone: '(305) 555-0545', leaseStart: '2022-09-01', monthlyRent: 2400, balance: 0, status: 'paid', lastPayment: '2024-03-02', propertyId: 'coconut' },
  { id: 't8', name: 'Michael Torres', unit: '5A', building: 'Tower B', email: 'm.torres@email.com', phone: '(305) 555-0612', leaseStart: '2023-02-01', monthlyRent: 1900, balance: 950, status: 'partial', lastPayment: '2024-03-05', propertyId: 'coconut' },
  { id: 't9', name: 'Angela White', unit: '16D', building: 'Tower A', email: 'a.white@email.com', phone: '(305) 555-0689', leaseStart: '2021-07-01', monthlyRent: 2700, balance: 8100, status: 'delinquent', lastPayment: '2023-12-15', paymentPlan: true, propertyId: 'sunridge' },
  { id: 't10', name: 'David Lee', unit: '20B', building: 'Tower A', email: 'd.lee@email.com', phone: '(305) 555-0756', leaseStart: '2023-10-01', monthlyRent: 3000, balance: 0, status: 'paid', lastPayment: '2024-03-01', propertyId: 'sunridge' },
  { id: 't11', name: 'Jennifer Adams', unit: '2C', building: 'Tower B', email: 'j.adams@email.com', phone: '(305) 555-0823', leaseStart: '2022-12-01', monthlyRent: 1700, balance: 1700, status: 'late', lastPayment: '2024-02-01', propertyId: 'sunridge' },
  { id: 't12', name: 'Carlos Mendez', unit: '8D', building: 'Tower B', email: 'c.mendez@email.com', phone: '(305) 555-0890', leaseStart: '2023-04-01', monthlyRent: 2100, balance: 6300, status: 'delinquent', lastPayment: '2023-12-28', propertyId: 'sunridge' },
]

export const recentPayments: Payment[] = [
  { id: 'p1', tenantId: 't1', amount: 2800, date: '2024-03-01', method: 'ACH', status: 'paid', reference: 'ACH-8842' },
  { id: 'p2', tenantId: 't4', amount: 3200, date: '2024-03-01', method: 'ACH', status: 'paid', reference: 'ACH-8843' },
  { id: 'p3', tenantId: 't10', amount: 3000, date: '2024-03-01', method: 'ACH', status: 'paid', reference: 'ACH-8844' },
  { id: 'p4', tenantId: 't7', amount: 2400, date: '2024-03-02', method: 'Check', status: 'paid', reference: 'CHK-4421' },
  { id: 'p5', tenantId: 't2', amount: 2200, date: '2024-03-03', method: 'ACH', status: 'paid', reference: 'ACH-8847' },
  { id: 'p6', tenantId: 't8', amount: 950, date: '2024-03-05', method: 'Zelle', status: 'partial', reference: 'ZEL-1102' },
  { id: 'p7', tenantId: 't3', amount: 1800, date: '2024-02-05', method: 'ACH', status: 'paid', reference: 'ACH-8790' },
  { id: 'p8', tenantId: 't6', amount: 2000, date: '2024-02-10', method: 'Check', status: 'paid', reference: 'CHK-4398' },
  { id: 'p9', tenantId: 't9', amount: 1350, date: '2024-03-10', method: 'ACH', status: 'paid', reference: 'ACH-8855' },
]

export const automations: AutomationSequence[] = [
  {
    id: 'a1',
    name: 'Standard Late Payment',
    trigger: 'Payment not received by 5th of month',
    active: true,
    tenantsEnrolled: 8,
    steps: [
      { day: 5, action: 'reminder', channel: 'Email + SMS', message: 'Friendly reminder: your monthly assessment of $X is due. Pay now to avoid late fees.', sent: true },
      { day: 10, action: 'notice', channel: 'Email', message: 'Your payment is now 10 days past due. A late fee of $50 has been applied. Please remit payment immediately.', sent: true },
      { day: 15, action: 'warning', channel: 'Email + Certified Mail', message: 'FINAL NOTICE: Your account is 15 days past due. Balance: $X. Failure to pay within 5 days may result in lien filing per FL §718.116.', sent: false },
      { day: 30, action: 'escalation', channel: 'Email + Certified Mail', message: 'Your account has been referred to our collections process. A lien may be placed on your unit per Florida Statute §718.116.', sent: false },
      { day: 60, action: 'legal', channel: 'Certified Mail', message: 'Notice of Intent to Lien. Your account balance of $X is 60 days past due. Legal proceedings will commence in 15 days if not resolved.', sent: false },
    ],
  },
  {
    id: 'a2',
    name: 'Payment Plan Check-in',
    trigger: 'Tenant on active payment plan',
    active: true,
    tenantsEnrolled: 1,
    steps: [
      { day: 1, action: 'reminder', channel: 'Email', message: 'Your payment plan installment of $X is due today. Thank you for working with us to resolve your balance.', sent: true },
      { day: 3, action: 'notice', channel: 'Email + SMS', message: 'Your payment plan installment is 3 days past due. Please remit payment to stay in good standing.', sent: false },
      { day: 7, action: 'warning', channel: 'Email', message: 'Payment plan installment is 7 days late. Continued non-payment may void your payment agreement.', sent: false },
    ],
  },
  {
    id: 'a3',
    name: 'Pre-Due Reminder',
    trigger: '3 days before payment due date',
    active: true,
    tenantsEnrolled: 180,
    steps: [
      { day: -3, action: 'reminder', channel: 'Email', message: 'Your monthly assessment of $X is due in 3 days. Set up autopay to never miss a payment.', sent: true },
    ],
  },
  {
    id: 'a4',
    name: 'Special Assessment Notice',
    trigger: 'Board approves special assessment',
    active: false,
    tenantsEnrolled: 0,
    steps: [
      { day: 0, action: 'notice', channel: 'Email + Portal', message: 'The Board has approved a special assessment of $X per unit for [reason]. Payment is due by [date].', sent: false },
      { day: 14, action: 'reminder', channel: 'Email', message: 'Reminder: Special assessment of $X is due in 16 days.', sent: false },
      { day: 30, action: 'warning', channel: 'Email + Certified Mail', message: 'Special assessment payment is now due. Late fees will apply after [date].', sent: false },
    ],
  },
]
