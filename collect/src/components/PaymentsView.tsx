import {
  DollarSign,
  TrendingUp,
  AlertTriangle,
  Clock,
  ArrowUpRight,
  ArrowDownRight,
  CreditCard,
  Building2,
} from 'lucide-react'
import { tenants, recentPayments, properties } from '@/data/mock'
import { useScrollReveal } from '@/hooks/useScrollReveal'
import { PropertySelector } from '@/components/PropertySelector'

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
  waived: 'bg-muted/15 text-muted-fg border-muted/25',
}

const statusLabels: Record<string, string> = {
  paid: 'Paid',
  pending: 'Pending',
  late: 'Late',
  delinquent: 'Delinquent',
  partial: 'Partial',
  waived: 'Waived',
}

export function PaymentsView({ selectedProperty, onPropertyChange }: Props) {
  const headerRef = useScrollReveal<HTMLDivElement>()
  const statsRef = useScrollReveal<HTMLDivElement>(100)
  const tableRef = useScrollReveal<HTMLDivElement>(200)
  const recentRef = useScrollReveal<HTMLDivElement>(150)

  const property = properties.find(p => p.id === selectedProperty)
  const filteredTenants = tenants.filter(t => t.propertyId === selectedProperty)
  const tenantIds = new Set(filteredTenants.map(t => t.id))
  const filteredPayments = recentPayments.filter(p => tenantIds.has(p.tenantId))

  const totalDue = filteredTenants.reduce((s, t) => s + t.monthlyRent, 0)
  const totalOutstanding = filteredTenants.reduce((s, t) => s + t.balance, 0)
  const totalCollected = totalDue - totalOutstanding
  const collectionRate = totalDue > 0 ? Math.round((totalCollected / totalDue) * 100) : 0
  const lateUnits = filteredTenants.filter(t => t.status === 'late' || t.status === 'delinquent' || t.status === 'partial').length
  const outstandingRate = totalDue > 0 ? Math.round((totalOutstanding / totalDue) * 100) : 0

  return (
    <div className="min-h-screen pt-20 pb-8 px-4 max-w-7xl mx-auto">
      <div ref={headerRef} className="mb-6">
        <h1 className="font-serif text-2xl sm:text-3xl font-semibold text-foreground">Payment Dashboard</h1>
        <p className="text-sm text-muted-fg mt-1">March 2024 Collection Cycle</p>
      </div>

      <PropertySelector selectedProperty={selectedProperty} onPropertyChange={onPropertyChange} />

      {/* Stats */}
      <div ref={statsRef} className="grid grid-cols-2 lg:grid-cols-4 gap-3 mb-6">
        <div className="bg-card border border-border rounded-xl p-4">
          <div className="flex items-center justify-between mb-2">
            <div className="w-7 h-7 rounded-lg bg-green/10 border border-green/20 flex items-center justify-center">
              <DollarSign className="w-4 h-4 text-green" />
            </div>
            <span className="flex items-center text-[10px] font-medium text-green">
              <ArrowUpRight className="w-3 h-3" /> {collectionRate}%
            </span>
          </div>
          <p className="text-2xl font-serif font-semibold text-foreground">${(totalCollected / 1000).toFixed(1)}K</p>
          <p className="text-xs text-muted-fg mt-0.5">Collected</p>
        </div>
        <div className="bg-card border border-border rounded-xl p-4">
          <div className="flex items-center justify-between mb-2">
            <div className="w-7 h-7 rounded-lg bg-red/10 border border-red/20 flex items-center justify-center">
              <AlertTriangle className="w-4 h-4 text-red" />
            </div>
            <span className="flex items-center text-[10px] font-medium text-red">
              <ArrowDownRight className="w-3 h-3" /> {outstandingRate}%
            </span>
          </div>
          <p className="text-2xl font-serif font-semibold text-foreground">${(totalOutstanding / 1000).toFixed(1)}K</p>
          <p className="text-xs text-muted-fg mt-0.5">Outstanding</p>
        </div>
        <div className="bg-card border border-border rounded-xl p-4">
          <div className="flex items-center gap-2 mb-2">
            <div className="w-7 h-7 rounded-lg bg-orange/10 border border-orange/20 flex items-center justify-center">
              <Clock className="w-4 h-4 text-orange" />
            </div>
          </div>
          <p className="text-2xl font-serif font-semibold text-foreground">{lateUnits}</p>
          <p className="text-xs text-muted-fg mt-0.5">Late Units</p>
        </div>
        <div className="bg-card border border-border rounded-xl p-4">
          <div className="flex items-center gap-2 mb-2">
            <div className="w-7 h-7 rounded-lg bg-teal/10 border border-teal/20 flex items-center justify-center">
              <TrendingUp className="w-4 h-4 text-teal" />
            </div>
          </div>
          <p className="text-2xl font-serif font-semibold text-foreground">{collectionRate}%</p>
          <p className="text-xs text-muted-fg mt-0.5">Collection Rate</p>
        </div>
      </div>

      {/* Collection Progress Bar */}
      <div className="bg-card border border-border rounded-2xl p-4 sm:p-5 mb-6">
        <div className="flex items-center justify-between mb-3">
          <h2 className="font-serif text-lg font-semibold text-foreground">
            {property?.name} — March Collection Progress
          </h2>
          <span className="text-sm font-semibold text-green">{collectionRate}%</span>
        </div>
        <div className="h-3 bg-white/5 rounded-full overflow-hidden flex">
          <div
            className="h-full bg-green rounded-l-full"
            style={{ width: `${filteredTenants.filter(t => t.status === 'paid').length / Math.max(filteredTenants.length, 1) * 100}%` }}
          />
          <div
            className="h-full bg-orange"
            style={{ width: `${filteredTenants.filter(t => t.status === 'late').length / Math.max(filteredTenants.length, 1) * 100}%` }}
          />
          <div
            className="h-full bg-teal"
            style={{ width: `${filteredTenants.filter(t => t.status === 'partial').length / Math.max(filteredTenants.length, 1) * 100}%` }}
          />
          <div
            className="h-full bg-red rounded-r-full"
            style={{ width: `${filteredTenants.filter(t => t.status === 'delinquent').length / Math.max(filteredTenants.length, 1) * 100}%` }}
          />
        </div>
        <div className="flex items-center gap-4 mt-2 text-[10px] text-muted-fg">
          <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-green" /> Paid ({filteredTenants.filter(t => t.status === 'paid').length})</span>
          <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-orange" /> Late ({filteredTenants.filter(t => t.status === 'late').length})</span>
          <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-red" /> Delinquent ({filteredTenants.filter(t => t.status === 'delinquent').length})</span>
          <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-teal" /> Partial ({filteredTenants.filter(t => t.status === 'partial').length})</span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Tenant Table */}
        <div ref={tableRef} className="lg:col-span-2 bg-card border border-border rounded-2xl overflow-hidden">
          <div className="p-4 border-b border-border">
            <h2 className="font-serif text-lg font-semibold text-foreground">Unit Status</h2>
          </div>
          <div className="divide-y divide-border">
            {filteredTenants.length === 0 ? (
              <div className="p-8 text-center text-sm text-muted-fg">No tenants for this property.</div>
            ) : (
              filteredTenants.map((t) => (
                <div key={t.id} className="p-3 sm:p-4 hover:bg-white/[0.02] transition-colors">
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-lg bg-white/5 border border-border flex items-center justify-center flex-shrink-0">
                      <Building2 className="w-4 h-4 text-muted-fg" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="text-sm font-medium text-foreground">{t.name}</span>
                        <span className={`px-2 py-0.5 rounded-full text-[10px] font-semibold border ${statusStyles[t.status]}`}>
                          {statusLabels[t.status]}
                        </span>
                        {t.paymentPlan && (
                          <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-teal/10 text-teal border border-teal/20">Plan</span>
                        )}
                      </div>
                      <div className="flex items-center gap-3 text-[10px] text-muted mt-0.5">
                        <span>{t.building} — {t.unit}</span>
                        <span>${t.monthlyRent.toLocaleString()}/mo</span>
                        {t.lastPayment && <span>Last: {new Date(t.lastPayment).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}</span>}
                      </div>
                    </div>
                    <div className="text-right flex-shrink-0">
                      {t.balance > 0 ? (
                        <p className="text-sm font-semibold text-red">${t.balance.toLocaleString()}</p>
                      ) : (
                        <p className="text-sm font-semibold text-green">$0</p>
                      )}
                      <p className="text-[10px] text-muted">balance</p>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Recent Payments */}
        <div ref={recentRef} className="bg-card border border-border rounded-2xl p-4 sm:p-5 h-fit">
          <h2 className="font-serif text-lg font-semibold text-foreground mb-3">Recent Payments</h2>
          {filteredPayments.length === 0 ? (
            <p className="text-sm text-muted-fg">No recent payments for this property.</p>
          ) : (
            <div className="space-y-2.5">
              {filteredPayments.slice(0, 8).map((p) => {
                const tenant = filteredTenants.find((t) => t.id === p.tenantId)
                return (
                  <div key={p.id} className="flex items-center gap-3 p-2.5 rounded-xl bg-white/[0.02] border border-border">
                    <div className="w-8 h-8 rounded-lg bg-green/10 border border-green/20 flex items-center justify-center flex-shrink-0">
                      <CreditCard className="w-3.5 h-3.5 text-green" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-xs font-medium text-foreground truncate">{tenant?.name}</p>
                      <p className="text-[10px] text-muted">{p.method} · {new Date(p.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}</p>
                    </div>
                    <span className={`text-xs font-semibold ${p.status === 'partial' ? 'text-teal' : 'text-green'}`}>
                      +${p.amount.toLocaleString()}
                    </span>
                  </div>
                )
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
