import {
  DollarSign,
  TrendingUp,
  AlertTriangle,
  Clock,
  Users,
  Building2,
  CreditCard,
  ArrowUpRight,
  ArrowDownRight,
} from 'lucide-react'
import { stats, tenants, recentPayments } from '@/data/mock'
import { useScrollReveal } from '@/hooks/useScrollReveal'

const statusStyles: Record<string, string> = {
  paid: 'bg-green/15 text-green border-green/25',
  pending: 'bg-gold/15 text-gold border-gold/25',
  late: 'bg-orange/15 text-orange border-orange/25',
  delinquent: 'bg-red/15 text-red border-red/25',
  partial: 'bg-gold/15 text-gold border-gold/25',
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

export function OverviewView() {
  const statsRef = useScrollReveal<HTMLDivElement>()
  const chartRef = useScrollReveal<HTMLDivElement>(100)
  const recentRef = useScrollReveal<HTMLDivElement>(150)
  const atRiskRef = useScrollReveal<HTMLDivElement>(200)

  const atRiskTenants = tenants.filter((t) => t.status === 'late' || t.status === 'delinquent').sort((a, b) => b.balance - a.balance)
  const totalOutstanding = tenants.reduce((s, t) => s + t.balance, 0)

  return (
    <div className="min-h-screen pt-20 pb-8 px-4 max-w-7xl mx-auto">
      <div className="mb-6">
        <h1 className="font-serif text-2xl sm:text-3xl font-semibold text-foreground">Collection Overview</h1>
        <p className="text-sm text-muted-fg mt-1">Bayshore Tower Residences — March 2024</p>
      </div>

      {/* Stats */}
      <div ref={statsRef} className="grid grid-cols-2 lg:grid-cols-4 gap-3 mb-6">
        <div className="bg-card border border-border rounded-xl p-4">
          <div className="flex items-center gap-2 mb-2">
            <div className="w-7 h-7 rounded-lg bg-green/10 border border-green/20 flex items-center justify-center">
              <DollarSign className="w-4 h-4 text-green" />
            </div>
            <span className="text-xs text-muted-fg font-medium">Collected</span>
          </div>
          <p className="text-2xl font-serif font-semibold text-foreground">${(stats.totalCollected / 1000).toFixed(0)}k</p>
          <div className="flex items-center gap-1 mt-1">
            <ArrowUpRight className="w-3 h-3 text-green" />
            <span className="text-[10px] text-green font-medium">{stats.collectionRate}% rate</span>
          </div>
        </div>
        <div className="bg-card border border-border rounded-xl p-4">
          <div className="flex items-center gap-2 mb-2">
            <div className="w-7 h-7 rounded-lg bg-orange/10 border border-orange/20 flex items-center justify-center">
              <Clock className="w-4 h-4 text-orange" />
            </div>
            <span className="text-xs text-muted-fg font-medium">Outstanding</span>
          </div>
          <p className="text-2xl font-serif font-semibold text-foreground">${(totalOutstanding / 1000).toFixed(1)}k</p>
          <div className="flex items-center gap-1 mt-1">
            <ArrowDownRight className="w-3 h-3 text-orange" />
            <span className="text-[10px] text-orange font-medium">{stats.lateUnits + stats.delinquentUnits} units</span>
          </div>
        </div>
        <div className="bg-card border border-border rounded-xl p-4">
          <div className="flex items-center gap-2 mb-2">
            <div className="w-7 h-7 rounded-lg bg-red/10 border border-red/20 flex items-center justify-center">
              <AlertTriangle className="w-4 h-4 text-red" />
            </div>
            <span className="text-xs text-muted-fg font-medium">Delinquent</span>
          </div>
          <p className="text-2xl font-serif font-semibold text-foreground">{stats.delinquentUnits}</p>
          <p className="text-[10px] text-muted-fg mt-1">30+ days past due</p>
        </div>
        <div className="bg-card border border-border rounded-xl p-4">
          <div className="flex items-center gap-2 mb-2">
            <div className="w-7 h-7 rounded-lg bg-teal/10 border border-teal/20 flex items-center justify-center">
              <TrendingUp className="w-4 h-4 text-teal" />
            </div>
            <span className="text-xs text-muted-fg font-medium">Avg Days Late</span>
          </div>
          <p className="text-2xl font-serif font-semibold text-foreground">{stats.avgDaysLate}</p>
          <p className="text-[10px] text-muted-fg mt-1">across late accounts</p>
        </div>
      </div>

      {/* Collection Rate Visual + Recent Payments */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
        {/* Collection Breakdown */}
        <div ref={chartRef} className="bg-card border border-border rounded-2xl p-5">
          <h2 className="font-serif text-lg font-semibold text-foreground mb-4">Collection Breakdown</h2>
          {/* Bar visualization */}
          <div className="space-y-3">
            <BarRow label="Paid on time" count={tenants.filter((t) => t.status === 'paid').length} total={tenants.length} color="bg-green" />
            <BarRow label="Partial" count={tenants.filter((t) => t.status === 'partial').length} total={tenants.length} color="bg-gold" />
            <BarRow label="Late (1-30 days)" count={tenants.filter((t) => t.status === 'late').length} total={tenants.length} color="bg-orange" />
            <BarRow label="Delinquent (30+)" count={tenants.filter((t) => t.status === 'delinquent').length} total={tenants.length} color="bg-red" />
          </div>
          {/* Total bar */}
          <div className="mt-5 h-3 bg-white/5 rounded-full overflow-hidden flex">
            <div className="bg-green h-full" style={{ width: `${(tenants.filter((t) => t.status === 'paid').length / tenants.length) * 100}%` }} />
            <div className="bg-gold h-full" style={{ width: `${(tenants.filter((t) => t.status === 'partial').length / tenants.length) * 100}%` }} />
            <div className="bg-orange h-full" style={{ width: `${(tenants.filter((t) => t.status === 'late').length / tenants.length) * 100}%` }} />
            <div className="bg-red h-full" style={{ width: `${(tenants.filter((t) => t.status === 'delinquent').length / tenants.length) * 100}%` }} />
          </div>
          <p className="text-[10px] text-muted mt-2 text-center">{tenants.length} units total</p>
        </div>

        {/* Recent Payments */}
        <div ref={recentRef} className="lg:col-span-2 bg-card border border-border rounded-2xl overflow-hidden">
          <div className="p-4 border-b border-border flex items-center justify-between">
            <h2 className="font-serif text-lg font-semibold text-foreground">Recent Payments</h2>
            <span className="text-xs text-muted-fg">{recentPayments.length} transactions</span>
          </div>
          <div className="divide-y divide-border">
            {recentPayments.slice(0, 7).map((payment) => {
              const tenant = tenants.find((t) => t.id === payment.tenantId)
              return (
                <div key={payment.id} className="p-3 sm:p-4 hover:bg-white/[0.02] transition-colors">
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-xl bg-white/5 border border-border flex items-center justify-center flex-shrink-0">
                      <CreditCard className="w-4 h-4 text-muted-fg" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-medium text-foreground">{tenant?.name}</span>
                        <span className={`px-2 py-0.5 rounded-full text-[10px] font-semibold border ${statusStyles[payment.status]}`}>{statusLabels[payment.status]}</span>
                      </div>
                      <div className="flex items-center gap-3 text-[10px] text-muted mt-0.5">
                        <span><Building2 className="w-3 h-3 inline mr-0.5" />{tenant?.building} — {tenant?.unit}</span>
                        <span>{payment.method}</span>
                        <span>{payment.reference}</span>
                      </div>
                    </div>
                    <div className="text-right flex-shrink-0">
                      <p className={`text-sm font-semibold ${payment.status === 'paid' ? 'text-green' : 'text-gold'}`}>
                        +${payment.amount.toLocaleString()}
                      </p>
                      <p className="text-[10px] text-muted">{new Date(payment.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}</p>
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      </div>

      {/* At Risk Tenants */}
      <div ref={atRiskRef} className="bg-card border border-red/15 rounded-2xl overflow-hidden">
        <div className="p-4 border-b border-border flex items-center gap-2">
          <AlertTriangle className="w-4 h-4 text-red" />
          <h2 className="font-serif text-lg font-semibold text-foreground">Accounts at Risk</h2>
          <span className="ml-auto text-xs text-muted-fg">{atRiskTenants.length} accounts</span>
        </div>
        <div className="divide-y divide-border">
          {atRiskTenants.map((tenant) => {
            const daysSincePayment = tenant.lastPayment ? Math.floor((Date.now() - new Date(tenant.lastPayment).getTime()) / 86400000) : 999
            return (
              <div key={tenant.id} className="p-4 hover:bg-white/[0.02] transition-colors">
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-xl bg-white/5 border border-border flex items-center justify-center flex-shrink-0">
                    <Users className="w-4 h-4 text-muted-fg" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="text-sm font-medium text-foreground">{tenant.name}</span>
                      <span className={`px-2 py-0.5 rounded-full text-[10px] font-semibold border ${statusStyles[tenant.status]}`}>{statusLabels[tenant.status]}</span>
                      {tenant.paymentPlan && <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold border bg-teal/15 text-teal border-teal/25">Payment Plan</span>}
                    </div>
                    <div className="flex items-center gap-3 text-[10px] text-muted mt-0.5">
                      <span>{tenant.building} — Unit {tenant.unit}</span>
                      <span>Last paid: {tenant.lastPayment ? new Date(tenant.lastPayment).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }) : 'Never'}</span>
                      <span className="text-red">{daysSincePayment} days ago</span>
                    </div>
                  </div>
                  <div className="text-right flex-shrink-0">
                    <p className="text-sm font-semibold text-red">${tenant.balance.toLocaleString()}</p>
                    <p className="text-[10px] text-muted">{Math.ceil(tenant.balance / tenant.monthlyRent)} months</p>
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}

function BarRow({ label, count, total, color }: { label: string; count: number; total: number; color: string }) {
  const pct = Math.round((count / total) * 100)
  return (
    <div>
      <div className="flex items-center justify-between mb-1">
        <span className="text-xs text-foreground">{label}</span>
        <span className="text-xs text-muted-fg">{count} ({pct}%)</span>
      </div>
      <div className="h-1.5 bg-white/5 rounded-full overflow-hidden">
        <div className={`h-full rounded-full ${color}`} style={{ width: `${pct}%` }} />
      </div>
    </div>
  )
}
