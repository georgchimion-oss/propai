import { useState } from 'react'
import { Search, Filter, Building2, Mail, Phone, Calendar, DollarSign, ChevronRight } from 'lucide-react'
import { tenants, recentPayments } from '@/data/mock'
import { useScrollReveal } from '@/hooks/useScrollReveal'
import { PropertySelector } from '@/components/PropertySelector'
import type { PaymentStatus } from '@/data/types'

interface Props {
  selectedProperty: string
  onPropertyChange: (id: string) => void
}

const statusStyles: Record<string, string> = {
  paid: 'bg-green/15 text-green border-green/25',
  pending: 'bg-gold/15 text-gold border-gold/25',
  late: 'bg-orange/15 text-orange border-orange/25',
  delinquent: 'bg-red/15 text-red border-red/25',
  partial: 'bg-teal/15 text-teal border-teal/25',
}

const statusLabels: Record<string, string> = {
  paid: 'Paid',
  pending: 'Pending',
  late: 'Late',
  delinquent: 'Delinquent',
  partial: 'Partial',
}

type FilterStatus = PaymentStatus | 'all'

export function LedgerView({ selectedProperty, onPropertyChange }: Props) {
  const [search, setSearch] = useState('')
  const [statusFilter, setStatusFilter] = useState<FilterStatus>('all')
  const [selectedTenant, setSelectedTenant] = useState<string | null>(null)

  const propertyTenants = tenants.filter(t => t.propertyId === selectedProperty)

  const filtered = propertyTenants.filter((t) => {
    if (statusFilter !== 'all' && t.status !== statusFilter) return false
    if (search) {
      const q = search.toLowerCase()
      return t.name.toLowerCase().includes(q) || t.unit.toLowerCase().includes(q)
    }
    return true
  })

  const selected = propertyTenants.find((t) => t.id === selectedTenant)
  const selectedPayments = recentPayments.filter((p) => p.tenantId === selectedTenant)

  const headerRef = useScrollReveal<HTMLDivElement>()
  const listRef = useScrollReveal<HTMLDivElement>(100)

  const handlePropertyChange = (id: string) => {
    setSelectedTenant(null)
    onPropertyChange(id)
  }

  return (
    <div className="min-h-screen pt-20 pb-8 px-4 max-w-7xl mx-auto">
      <div ref={headerRef} className="mb-6">
        <h1 className="font-serif text-2xl sm:text-3xl font-semibold text-foreground">Tenant Ledger</h1>
        <p className="text-sm text-muted-fg mt-1">Individual payment history and account details</p>
      </div>

      <PropertySelector selectedProperty={selectedProperty} onPropertyChange={handlePropertyChange} />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Tenant List */}
        <div ref={listRef} className="lg:col-span-1 bg-card border border-border rounded-2xl overflow-hidden h-fit">
          <div className="p-3 border-b border-border space-y-2">
            <div className="flex items-center gap-2 bg-white/5 rounded-xl px-3 py-2 border border-border">
              <Search className="w-4 h-4 text-muted" />
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search tenants..."
                className="flex-1 bg-transparent text-sm text-foreground placeholder-muted outline-none"
              />
            </div>
            <div className="flex items-center gap-2">
              <Filter className="w-3.5 h-3.5 text-muted" />
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value as FilterStatus)}
                className="bg-white/5 border border-border rounded-lg px-2 py-1 text-xs text-foreground outline-none cursor-pointer"
              >
                <option value="all">All</option>
                <option value="paid">Paid</option>
                <option value="late">Late</option>
                <option value="delinquent">Delinquent</option>
                <option value="partial">Partial</option>
              </select>
            </div>
          </div>
          <div className="divide-y divide-border max-h-[600px] overflow-y-auto">
            {filtered.length === 0 ? (
              <div className="p-6 text-center text-sm text-muted-fg">No tenants match your filters.</div>
            ) : (
              filtered.map((t) => (
                <button
                  key={t.id}
                  onClick={() => setSelectedTenant(t.id)}
                  className={`w-full p-3 text-left hover:bg-white/[0.02] transition-colors flex items-center gap-3 ${selectedTenant === t.id ? 'bg-white/[0.03] border-l-2 border-l-green' : ''}`}
                >
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-medium text-foreground truncate">{t.name}</span>
                      <span className={`px-1.5 py-0.5 rounded-full text-[9px] font-semibold border ${statusStyles[t.status]}`}>
                        {statusLabels[t.status]}
                      </span>
                    </div>
                    <span className="text-[10px] text-muted">{t.building} — {t.unit}</span>
                  </div>
                  <div className="text-right flex-shrink-0">
                    <p className={`text-xs font-semibold ${t.balance > 0 ? 'text-red' : 'text-green'}`}>
                      ${t.balance.toLocaleString()}
                    </p>
                  </div>
                  <ChevronRight className="w-3.5 h-3.5 text-muted flex-shrink-0" />
                </button>
              ))
            )}
          </div>
        </div>

        {/* Detail Panel */}
        <div className="lg:col-span-2">
          {selected ? (
            <div className="space-y-4 animate-fade-in">
              {/* Tenant Info Card */}
              <div className="bg-card border border-border rounded-2xl p-5">
                <div className="flex items-start justify-between gap-4 mb-4">
                  <div>
                    <h2 className="font-serif text-xl font-semibold text-foreground">{selected.name}</h2>
                    <div className="flex items-center gap-3 mt-1 text-xs text-muted-fg">
                      <span className="flex items-center gap-1"><Building2 className="w-3 h-3" /> {selected.building} — Unit {selected.unit}</span>
                      <span className="flex items-center gap-1"><Calendar className="w-3 h-3" /> Since {new Date(selected.leaseStart).toLocaleDateString('en-US', { month: 'short', year: 'numeric' })}</span>
                    </div>
                  </div>
                  <span className={`px-2.5 py-1 rounded-full text-xs font-semibold border ${statusStyles[selected.status]}`}>
                    {statusLabels[selected.status]}
                  </span>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                  <div className="p-3 rounded-xl bg-white/[0.02] border border-border">
                    <p className="text-[10px] text-muted uppercase tracking-wider">Monthly Rent</p>
                    <p className="text-lg font-serif font-semibold text-foreground mt-1">${selected.monthlyRent.toLocaleString()}</p>
                  </div>
                  <div className="p-3 rounded-xl bg-white/[0.02] border border-border">
                    <p className="text-[10px] text-muted uppercase tracking-wider">Balance</p>
                    <p className={`text-lg font-serif font-semibold mt-1 ${selected.balance > 0 ? 'text-red' : 'text-green'}`}>
                      ${selected.balance.toLocaleString()}
                    </p>
                  </div>
                  <div className="p-3 rounded-xl bg-white/[0.02] border border-border">
                    <p className="text-[10px] text-muted uppercase tracking-wider">Last Payment</p>
                    <p className="text-sm font-medium text-foreground mt-1">
                      {selected.lastPayment ? new Date(selected.lastPayment).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }) : '—'}
                    </p>
                  </div>
                  <div className="p-3 rounded-xl bg-white/[0.02] border border-border">
                    <p className="text-[10px] text-muted uppercase tracking-wider">Contact</p>
                    <div className="mt-1 space-y-0.5">
                      <p className="text-[10px] text-foreground flex items-center gap-1"><Mail className="w-2.5 h-2.5" /> {selected.email}</p>
                      <p className="text-[10px] text-foreground flex items-center gap-1"><Phone className="w-2.5 h-2.5" /> {selected.phone}</p>
                    </div>
                  </div>
                </div>

                {selected.paymentPlan && (
                  <div className="mt-3 p-3 rounded-xl bg-teal/5 border border-teal/15">
                    <p className="text-xs text-teal font-medium">Active Payment Plan — $1,350/mo until balance cleared</p>
                  </div>
                )}
              </div>

              {/* Payment History */}
              <div className="bg-card border border-border rounded-2xl p-5">
                <h3 className="font-serif text-lg font-semibold text-foreground mb-3">Payment History</h3>
                {selectedPayments.length > 0 ? (
                  <div className="space-y-2">
                    {selectedPayments.map((p) => (
                      <div key={p.id} className="flex items-center gap-3 p-3 rounded-xl bg-white/[0.02] border border-border">
                        <div className="w-8 h-8 rounded-lg bg-green/10 border border-green/20 flex items-center justify-center">
                          <DollarSign className="w-3.5 h-3.5 text-green" />
                        </div>
                        <div className="flex-1">
                          <p className="text-sm font-medium text-foreground">${p.amount.toLocaleString()}</p>
                          <p className="text-[10px] text-muted">{p.method} · {p.reference}</p>
                        </div>
                        <div className="text-right">
                          <p className="text-xs text-muted-fg">{new Date(p.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}</p>
                          <span className={`text-[10px] font-semibold ${p.status === 'paid' ? 'text-green' : 'text-teal'}`}>
                            {p.status === 'paid' ? 'Cleared' : 'Partial'}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-sm text-muted-fg">No recent payments on record</p>
                )}
              </div>

              {/* Quick Actions */}
              <div className="flex flex-wrap gap-2">
                <button className="px-4 py-2 rounded-xl bg-green/15 border border-green/25 text-green text-sm font-medium hover:bg-green/25 transition-colors">
                  Record Payment
                </button>
                <button className="px-4 py-2 rounded-xl bg-orange/15 border border-orange/25 text-orange text-sm font-medium hover:bg-orange/25 transition-colors">
                  Send Reminder
                </button>
                <button className="px-4 py-2 rounded-xl bg-teal/15 border border-teal/25 text-teal text-sm font-medium hover:bg-teal/25 transition-colors">
                  Set Up Plan
                </button>
              </div>
            </div>
          ) : (
            <div className="bg-card border border-border rounded-2xl p-12 text-center">
              <Building2 className="w-12 h-12 text-muted mx-auto mb-3" />
              <h3 className="font-serif text-lg font-semibold text-foreground mb-1">Select a Tenant</h3>
              <p className="text-sm text-muted-fg">Choose a tenant from the list to view their account details and payment history</p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
