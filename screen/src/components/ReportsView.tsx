import { BarChart3, TrendingUp, Clock, Users, CheckCircle2, Hourglass, Eye } from 'lucide-react'
import { applications, properties } from '@/data/mock'
import { PropertySelector } from './PropertySelector'

interface ReportsViewProps {
  selectedProperty: string
  onPropertyChange: (id: string) => void
}

const statusColors: Record<string, { bg: string; text: string; fill: string }> = {
  pending_review: { bg: 'bg-orange/10', text: 'text-orange', fill: 'bg-orange' },
  in_progress:    { bg: 'bg-teal/10',   text: 'text-teal',   fill: 'bg-teal'   },
  approved:       { bg: 'bg-green/10',  text: 'text-green',  fill: 'bg-green'  },
  denied:         { bg: 'bg-red/10',    text: 'text-red',    fill: 'bg-red'    },
}

const statusLabels: Record<string, string> = {
  pending_review: 'Pending Review',
  in_progress: 'In Progress',
  approved: 'Approved',
  denied: 'Denied',
}

const scoreRanges = [
  { label: '0–39',   min: 0,  max: 39,  color: 'bg-red'    },
  { label: '40–59',  min: 40, max: 59,  color: 'bg-orange' },
  { label: '60–79',  min: 60, max: 79,  color: 'bg-teal'   },
  { label: '80–100', min: 80, max: 100, color: 'bg-green'  },
]

function StatCard({
  icon: Icon,
  label,
  value,
  sub,
  accent,
}: {
  icon: React.ElementType
  label: string
  value: string | number
  sub?: string
  accent?: string
}) {
  return (
    <div className="bg-card/50 border border-border rounded-2xl p-5">
      <div className="flex items-center gap-2 mb-3">
        <Icon className={`w-4 h-4 ${accent ?? 'text-purple'}`} />
        <span className="text-xs font-medium text-muted-fg uppercase tracking-wide">{label}</span>
      </div>
      <div className="font-serif text-3xl font-bold text-foreground mb-0.5">{value}</div>
      {sub && <div className="text-xs text-muted-fg">{sub}</div>}
    </div>
  )
}

export function ReportsView({ selectedProperty, onPropertyChange }: ReportsViewProps) {
  const propApps = applications.filter((a) => a.propertyId === selectedProperty)
  const total = propApps.length
  const approved = propApps.filter((a) => a.status === 'approved').length
  const denied = propApps.filter((a) => a.status === 'denied').length
  const approvalRate = total > 0 ? Math.round((approved / total) * 100) : 0

  const avgScore = total > 0
    ? Math.round(propApps.reduce((s, a) => s + a.screeningScore, 0) / total)
    : 0

  const avgCreditScore = total > 0
    ? Math.round(propApps.reduce((s, a) => s + a.creditScore, 0) / total)
    : 0

  // Status distribution
  const statusCounts = propApps.reduce((acc, a) => {
    acc[a.status] = (acc[a.status] || 0) + 1
    return acc
  }, {} as Record<string, number>)

  // Score distribution
  const scoreDist = scoreRanges.map((r) => ({
    ...r,
    count: propApps.filter((a) => a.screeningScore >= r.min && a.screeningScore <= r.max).length,
  }))
  const maxScoreCount = Math.max(...scoreDist.map((s) => s.count), 1)

  // Cross-property comparison
  const allProperties = properties.map((p) => {
    const apps = applications.filter((a) => a.propertyId === p.id)
    const appTotal = apps.length
    const appApproved = apps.filter((a) => a.status === 'approved').length
    const rate = appTotal > 0 ? Math.round((appApproved / appTotal) * 100) : 0
    const avgScreening = appTotal > 0 ? Math.round(apps.reduce((s, a) => s + a.screeningScore, 0) / appTotal) : 0
    return { ...p, total: appTotal, approvalRate: rate, avgScore: avgScreening }
  })
  const maxRate = Math.max(...allProperties.map((p) => p.approvalRate), 1)

  return (
    <div className="min-h-screen pt-24 pb-12 px-4 sm:px-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4 mb-8">
          <div>
            <h1 className="font-serif text-3xl font-semibold text-foreground mb-1">Reports</h1>
            <p className="text-muted-fg text-sm">Screening analytics and approval pipeline insights</p>
          </div>
          <PropertySelector selectedProperty={selectedProperty} onPropertyChange={onPropertyChange} />
        </div>

        {/* KPI row */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          <StatCard
            icon={Users}
            label="Applications"
            value={total}
            sub="This month"
          />
          <StatCard
            icon={CheckCircle2}
            label="Approval Rate"
            value={`${approvalRate}%`}
            sub={`${approved} approved · ${denied} denied`}
            accent="text-green"
          />
          <StatCard
            icon={TrendingUp}
            label="Avg Score"
            value={avgScore}
            sub="Screening score /100"
            accent="text-teal"
          />
          <StatCard
            icon={BarChart3}
            label="Avg Credit"
            value={avgCreditScore}
            sub="Credit score avg"
            accent="text-gold"
          />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-5 mb-5">
          {/* Applications by status */}
          <div className="bg-card/50 border border-border rounded-2xl p-5">
            <div className="flex items-center gap-2 mb-5">
              <Eye className="w-4 h-4 text-purple" />
              <span className="text-xs font-medium text-muted-fg uppercase tracking-wide">Applications by Status</span>
            </div>
            {total === 0 ? (
              <p className="text-sm text-muted-fg text-center py-6">No applications yet.</p>
            ) : (
              <div className="flex flex-col gap-3">
                {(Object.keys(statusLabels) as string[]).map((s) => {
                  const count = statusCounts[s] || 0
                  const pct = total > 0 ? Math.round((count / total) * 100) : 0
                  const cfg = statusColors[s]
                  return (
                    <div key={s}>
                      <div className="flex items-center justify-between mb-1.5">
                        <span className={`text-xs font-medium ${cfg.text}`}>{statusLabels[s]}</span>
                        <span className="text-xs text-muted-fg">{count} ({pct}%)</span>
                      </div>
                      <div className="h-2 bg-white/5 rounded-full overflow-hidden">
                        <div
                          className={`h-full rounded-full transition-all duration-700 ${cfg.fill}`}
                          style={{ width: `${pct}%` }}
                        />
                      </div>
                    </div>
                  )
                })}
              </div>
            )}
          </div>

          {/* Screening score distribution */}
          <div className="bg-card/50 border border-border rounded-2xl p-5">
            <div className="flex items-center gap-2 mb-5">
              <BarChart3 className="w-4 h-4 text-purple" />
              <span className="text-xs font-medium text-muted-fg uppercase tracking-wide">Score Distribution</span>
            </div>
            {total === 0 ? (
              <p className="text-sm text-muted-fg text-center py-6">No applications yet.</p>
            ) : (
              <div className="flex items-end gap-3 h-32">
                {scoreDist.map((range) => {
                  const heightPct = maxScoreCount > 0 ? (range.count / maxScoreCount) * 100 : 0
                  return (
                    <div key={range.label} className="flex-1 flex flex-col items-center gap-1.5">
                      <span className="text-xs text-muted-fg">{range.count}</span>
                      <div className="w-full flex items-end" style={{ height: '80px' }}>
                        <div
                          className={`w-full rounded-t-md transition-all duration-700 ${range.color} opacity-80`}
                          style={{ height: `${Math.max(heightPct, range.count > 0 ? 8 : 0)}%` }}
                        />
                      </div>
                      <span className="text-[10px] text-muted-fg">{range.label}</span>
                    </div>
                  )
                })}
              </div>
            )}
          </div>
        </div>

        {/* Cross-property comparison */}
        <div className="bg-card/50 border border-border rounded-2xl p-5">
          <div className="flex items-center gap-2 mb-5">
            <Hourglass className="w-4 h-4 text-purple" />
            <span className="text-xs font-medium text-muted-fg uppercase tracking-wide">All Properties — Approval Rate Comparison</span>
          </div>
          <div className="flex flex-col gap-4">
            {allProperties.map((p) => (
              <div key={p.id}>
                <div className="flex items-center justify-between mb-2">
                  <div>
                    <span className={`text-sm font-medium ${p.id === selectedProperty ? 'text-purple' : 'text-foreground'}`}>
                      {p.name}
                    </span>
                    {p.id === selectedProperty && (
                      <span className="ml-2 text-[10px] bg-purple/10 text-purple border border-purple/20 px-1.5 py-0.5 rounded-md font-medium">
                        Selected
                      </span>
                    )}
                  </div>
                  <div className="flex items-center gap-4 text-xs text-muted-fg">
                    <span>{p.total} apps</span>
                    <span>Avg score: {p.avgScore}</span>
                    <span className={p.approvalRate >= 50 ? 'text-green font-medium' : 'text-orange font-medium'}>
                      {p.approvalRate}% approved
                    </span>
                  </div>
                </div>
                <div className="h-2 bg-white/5 rounded-full overflow-hidden">
                  <div
                    className={`h-full rounded-full transition-all duration-700 ${p.id === selectedProperty ? 'bg-purple' : 'bg-muted'}`}
                    style={{ width: `${(p.approvalRate / maxRate) * 100}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Avg screening time note */}
        <div className="mt-5 flex items-center gap-3 p-4 bg-card/30 border border-border rounded-2xl">
          <Clock className="w-4 h-4 text-purple flex-shrink-0" />
          <p className="text-sm text-muted-fg">
            <span className="text-foreground font-medium">Average screening time: 1.8 business days</span>
            {' '}— Automated credit and background checks run instantly. Manual board review adds 1–2 days for borderline cases.
          </p>
        </div>
      </div>
    </div>
  )
}
