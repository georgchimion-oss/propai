import {
  ShieldCheck,
  AlertTriangle,
  XCircle,
  Clock,
  Building2,
  MapPin,
  TrendingUp,
  Calendar,
  ChevronRight,
} from 'lucide-react'
import { buildings, complianceItems, reserveStudy, inspections } from '@/data/mock'
import { PropertySelector } from '@/components/PropertySelector'
import { useScrollReveal } from '@/hooks/useScrollReveal'

interface Props {
  selectedProperty: string
  onPropertyChange: (id: string) => void
}

const statusStyles: Record<string, string> = {
  compliant: 'bg-green/15 text-green border-green/25',
  action_needed: 'bg-orange/15 text-orange border-orange/25',
  non_compliant: 'bg-red/15 text-red border-red/25',
  pending: 'bg-gold/15 text-gold border-gold/25',
}

const statusLabels: Record<string, string> = {
  compliant: 'Compliant',
  action_needed: 'Action Needed',
  non_compliant: 'Non-Compliant',
  pending: 'Pending',
}

const inspStatusStyles: Record<string, string> = {
  passed: 'bg-green/15 text-green border-green/25',
  failed: 'bg-red/15 text-red border-red/25',
  scheduled: 'bg-teal/15 text-teal border-teal/25',
  overdue: 'bg-red/15 text-red border-red/25',
  in_progress: 'bg-orange/15 text-orange border-orange/25',
}

const inspStatusLabels: Record<string, string> = {
  passed: 'Passed',
  failed: 'Failed',
  scheduled: 'Scheduled',
  overdue: 'Overdue',
  in_progress: 'In Progress',
}

const healthStyles: Record<string, string> = {
  funded: 'bg-green',
  underfunded: 'bg-orange',
  critical: 'bg-red',
}

export function OverviewView({ selectedProperty, onPropertyChange }: Props) {
  const building = buildings[selectedProperty]

  const filteredCompliance = complianceItems.filter((c) => c.propertyId === selectedProperty)
  const filteredReserve = reserveStudy.filter((r) => r.propertyId === selectedProperty)
  const filteredInspections = inspections.filter((i) => i.propertyId === selectedProperty)

  const compliant = filteredCompliance.filter((c) => c.status === 'compliant').length
  const actionNeeded = filteredCompliance.filter((c) => c.status === 'action_needed').length
  const nonCompliant = filteredCompliance.filter((c) => c.status === 'non_compliant').length
  const overdueInsp = filteredInspections.filter((i) => i.status === 'overdue').length

  const totalReserveNeeded = filteredReserve.reduce((s, r) => s + r.requiredFunding, 0)
  const totalReserveFunded = filteredReserve.reduce((s, r) => s + r.currentFunding, 0)
  const reservePercent = totalReserveNeeded > 0
    ? Math.round((totalReserveFunded / totalReserveNeeded) * 100)
    : 0

  const headerRef = useScrollReveal<HTMLDivElement>()
  const statsRef = useScrollReveal<HTMLDivElement>(100)
  const complianceRef = useScrollReveal<HTMLDivElement>(200)
  const reserveRef = useScrollReveal<HTMLDivElement>(150)
  const inspRef = useScrollReveal<HTMLDivElement>(250)

  return (
    <div className="min-h-screen pt-20 pb-8 px-4 max-w-7xl mx-auto">
      {/* Property Selector */}
      <div className="mt-4">
        <PropertySelector
          selectedProperty={selectedProperty}
          onPropertyChange={onPropertyChange}
        />
      </div>

      {/* Building Header */}
      <div ref={headerRef} className="mb-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="font-serif text-2xl sm:text-3xl font-semibold text-foreground">
              Compliance Dashboard
            </h1>
            <div className="flex items-center gap-4 mt-1.5 text-sm text-muted-fg">
              <span className="flex items-center gap-1.5">
                <Building2 className="w-3.5 h-3.5" />
                {building.name}
              </span>
              <span className="flex items-center gap-1.5">
                <MapPin className="w-3.5 h-3.5" />
                {building.address}
              </span>
            </div>
          </div>
          {/* Score Ring */}
          <div className="flex items-center gap-3 bg-card border border-border rounded-xl p-3 sm:p-4">
            <div className="relative w-14 h-14">
              <svg viewBox="0 0 56 56" className="w-14 h-14 -rotate-90">
                <circle cx="28" cy="28" r="24" fill="none" stroke="oklch(1 0 0 / 0.05)" strokeWidth="4" />
                <circle
                  cx="28" cy="28" r="24"
                  fill="none"
                  stroke={
                    building.overallScore >= 80
                      ? 'oklch(0.72 0.17 155)'
                      : building.overallScore >= 60
                        ? 'oklch(0.72 0.17 55)'
                        : 'oklch(0.63 0.21 25)'
                  }
                  strokeWidth="4"
                  strokeLinecap="round"
                  strokeDasharray={`${(building.overallScore / 100) * 150.8} 150.8`}
                />
              </svg>
              <span className="absolute inset-0 flex items-center justify-center text-sm font-bold text-foreground">
                {building.overallScore}
              </span>
            </div>
            <div>
              <p className="text-xs text-muted-fg">Compliance Score</p>
              <p className="text-sm font-semibold text-foreground">
                {building.overallScore >= 80
                  ? 'Good Standing'
                  : building.overallScore >= 60
                    ? 'Needs Attention'
                    : 'At Risk'}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Stats Row */}
      <div ref={statsRef} className="grid grid-cols-2 lg:grid-cols-4 gap-3 mb-6">
        <StatCard icon={<ShieldCheck className="w-4 h-4 text-green" />} label="Compliant" value={compliant} color="green" />
        <StatCard icon={<AlertTriangle className="w-4 h-4 text-orange" />} label="Action Needed" value={actionNeeded} color="orange" />
        <StatCard icon={<XCircle className="w-4 h-4 text-red" />} label="Non-Compliant" value={nonCompliant} color="red" />
        <StatCard icon={<Clock className="w-4 h-4 text-red" />} label="Overdue Inspections" value={overdueInsp} color="red" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Compliance Checklist — spans 2 cols */}
        <div ref={complianceRef} className="lg:col-span-2 bg-card border border-border rounded-2xl overflow-hidden">
          <div className="p-4 sm:p-5 border-b border-border flex items-center justify-between">
            <div>
              <h2 className="font-serif text-lg font-semibold text-foreground">SB 4-D Requirements</h2>
              <p className="text-xs text-muted-fg mt-0.5">Florida Building Safety Act compliance checklist</p>
            </div>
            <span className="text-xs text-muted-fg">{compliant}/{filteredCompliance.length} compliant</span>
          </div>
          <div className="divide-y divide-border">
            {filteredCompliance.map((item) => (
              <div key={item.id} className="p-4 hover:bg-white/[0.02] transition-colors group">
                <div className="flex items-start gap-3">
                  <div className="mt-0.5">
                    {item.status === 'compliant' ? (
                      <ShieldCheck className="w-4.5 h-4.5 text-green" />
                    ) : item.status === 'non_compliant' ? (
                      <XCircle className="w-4.5 h-4.5 text-red" />
                    ) : (
                      <AlertTriangle className="w-4.5 h-4.5 text-orange" />
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap mb-1">
                      <span className="text-sm font-medium text-foreground">{item.requirement}</span>
                      <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-semibold border ${statusStyles[item.status]}`}>
                        {statusLabels[item.status]}
                      </span>
                    </div>
                    <p className="text-xs text-muted-fg leading-relaxed line-clamp-2">{item.details}</p>
                    <div className="flex items-center gap-3 mt-1.5 text-[10px] text-muted">
                      <span className="flex items-center gap-1">
                        <Calendar className="w-3 h-3" />
                        Due: {new Date(item.dueDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                      </span>
                      <span>{item.sbReference}</span>
                      <span className="bg-white/5 px-1.5 py-0.5 rounded">{item.category}</span>
                    </div>
                  </div>
                  <ChevronRight className="w-4 h-4 text-muted group-hover:text-foreground transition-colors flex-shrink-0 mt-1" />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Right Column */}
        <div className="space-y-6">
          {/* Reserve Funding */}
          <div ref={reserveRef} className="bg-card border border-border rounded-2xl p-4 sm:p-5">
            <div className="flex items-center justify-between mb-4">
              <h2 className="font-serif text-lg font-semibold text-foreground">Reserve Funding</h2>
              <div className="flex items-center gap-1.5">
                <TrendingUp className="w-3.5 h-3.5 text-teal" />
                <span className="text-sm font-semibold text-teal">{reservePercent}%</span>
              </div>
            </div>
            {/* Overall bar */}
            <div className="mb-4">
              <div className="h-2.5 bg-white/5 rounded-full overflow-hidden">
                <div
                  className="h-full rounded-full animate-fill"
                  style={{
                    width: `${reservePercent}%`,
                    background:
                      reservePercent >= 80
                        ? 'oklch(0.72 0.17 155)'
                        : reservePercent >= 50
                          ? 'oklch(0.72 0.17 55)'
                          : 'oklch(0.63 0.21 25)',
                  }}
                />
              </div>
              <div className="flex justify-between mt-1.5 text-[10px] text-muted">
                <span>${(totalReserveFunded / 1000000).toFixed(1)}M funded</span>
                <span>${(totalReserveNeeded / 1000000).toFixed(1)}M required</span>
              </div>
            </div>
            {/* Per-component */}
            <div className="space-y-2.5">
              {filteredReserve.map((r) => {
                const pct = Math.round((r.currentFunding / r.requiredFunding) * 100)
                return (
                  <div key={r.component}>
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-xs text-foreground">{r.component}</span>
                      <div className="flex items-center gap-2">
                        <span className="text-[10px] text-muted-fg">{pct}%</span>
                        <span className={`w-1.5 h-1.5 rounded-full ${healthStyles[r.health]}`} />
                      </div>
                    </div>
                    <div className="h-1 bg-white/5 rounded-full overflow-hidden">
                      <div
                        className={`h-full rounded-full ${healthStyles[r.health]}`}
                        style={{ width: `${pct}%` }}
                      />
                    </div>
                  </div>
                )
              })}
            </div>
          </div>

          {/* Inspections Summary */}
          <div ref={inspRef} className="bg-card border border-border rounded-2xl p-4 sm:p-5">
            <h2 className="font-serif text-lg font-semibold text-foreground mb-3">Inspections</h2>
            <div className="space-y-2.5">
              {filteredInspections.map((insp) => (
                <div key={insp.id} className="flex items-center gap-3 p-2.5 rounded-xl bg-white/[0.02] border border-border">
                  <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-semibold border flex-shrink-0 ${inspStatusStyles[insp.status]}`}>
                    {inspStatusLabels[insp.status]}
                  </span>
                  <div className="min-w-0 flex-1">
                    <p className="text-xs font-medium text-foreground truncate">{insp.type}</p>
                    <p className="text-[10px] text-muted">
                      {insp.building} — Due {new Date(insp.dueDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

const colorMap: Record<string, string> = {
  green: 'bg-green/10 border-green/20',
  orange: 'bg-orange/10 border-orange/20',
  red: 'bg-red/10 border-red/20',
  teal: 'bg-teal/10 border-teal/20',
}

function StatCard({ icon, label, value, color }: { icon: React.ReactNode; label: string; value: number; color: string }) {
  return (
    <div className="bg-card border border-border rounded-xl p-4">
      <div className="flex items-center gap-2 mb-2">
        <div className={`w-7 h-7 rounded-lg flex items-center justify-center border ${colorMap[color] ?? ''}`}>
          {icon}
        </div>
        <span className="text-xs text-muted-fg font-medium">{label}</span>
      </div>
      <p className="text-2xl font-serif font-semibold text-foreground">{value}</p>
    </div>
  )
}
