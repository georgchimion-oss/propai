import { useState } from 'react'
import { Search, SlidersHorizontal, ChevronRight, CircleDot } from 'lucide-react'
import { applications } from '@/data/mock'
import { PropertySelector } from './PropertySelector'
import type { ApplicationStatus } from '@/data/types'

interface ApplicationsViewProps {
  selectedProperty: string
  onPropertyChange: (id: string) => void
  onSelectApplication: (id: string) => void
}

const statusConfig: Record<ApplicationStatus, { label: string; dot: string; text: string; bg: string; border: string }> = {
  pending_review: { label: 'Pending Review', dot: 'bg-orange', text: 'text-orange', bg: 'bg-orange/10', border: 'border-orange/20' },
  in_progress:    { label: 'In Progress',    dot: 'bg-teal',   text: 'text-teal',   bg: 'bg-teal/10',   border: 'border-teal/20'   },
  approved:       { label: 'Approved',        dot: 'bg-green',  text: 'text-green',  bg: 'bg-green/10',  border: 'border-green/20'  },
  denied:         { label: 'Denied',          dot: 'bg-red',    text: 'text-red',    bg: 'bg-red/10',    border: 'border-red/20'    },
}

const riskConfig = {
  low:    { label: 'Low',    text: 'text-green',  bg: 'bg-green/10',  border: 'border-green/20'  },
  medium: { label: 'Medium', text: 'text-orange', bg: 'bg-orange/10', border: 'border-orange/20' },
  high:   { label: 'High',   text: 'text-red',    bg: 'bg-red/10',    border: 'border-red/20'    },
}

const scoreColor = (score: number) => {
  if (score >= 80) return 'text-green'
  if (score >= 60) return 'text-teal'
  if (score >= 40) return 'text-orange'
  return 'text-red'
}

export function ApplicationsView({ selectedProperty, onPropertyChange, onSelectApplication }: ApplicationsViewProps) {
  const [search, setSearch] = useState('')
  const [statusFilter, setStatusFilter] = useState<ApplicationStatus | 'all'>('all')

  const filtered = applications
    .filter((a) => a.propertyId === selectedProperty)
    .filter((a) => statusFilter === 'all' || a.status === statusFilter)
    .filter((a) =>
      search === '' ||
      a.applicantName.toLowerCase().includes(search.toLowerCase()) ||
      a.unit.toLowerCase().includes(search.toLowerCase())
    )

  const counts = applications.filter((a) => a.propertyId === selectedProperty).reduce(
    (acc, a) => {
      acc[a.status] = (acc[a.status] || 0) + 1
      return acc
    },
    {} as Record<string, number>
  )

  const totalForProperty = applications.filter((a) => a.propertyId === selectedProperty).length

  return (
    <div className="min-h-screen pt-24 pb-12 px-4 sm:px-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4 mb-8">
          <div>
            <h1 className="font-serif text-3xl font-semibold text-foreground mb-1">
              Applications
            </h1>
            <p className="text-muted-fg text-sm">
              {totalForProperty} application{totalForProperty !== 1 ? 's' : ''} · Tenant screening pipeline
            </p>
          </div>
          <PropertySelector selectedProperty={selectedProperty} onPropertyChange={onPropertyChange} />
        </div>

        {/* Summary chips */}
        <div className="flex flex-wrap gap-2 mb-6">
          <button
            onClick={() => setStatusFilter('all')}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium border transition-all ${
              statusFilter === 'all'
                ? 'bg-purple/15 text-purple border-purple/25'
                : 'bg-card/50 text-muted-fg border-border hover:text-foreground hover:bg-white/5'
            }`}
          >
            All ({totalForProperty})
          </button>
          {(Object.keys(statusConfig) as ApplicationStatus[]).map((s) => {
            const cfg = statusConfig[s]
            const count = counts[s] || 0
            return (
              <button
                key={s}
                onClick={() => setStatusFilter(s)}
                className={`px-3 py-1.5 rounded-lg text-xs font-medium border transition-all ${
                  statusFilter === s
                    ? `${cfg.bg} ${cfg.text} ${cfg.border}`
                    : 'bg-card/50 text-muted-fg border-border hover:text-foreground hover:bg-white/5'
                }`}
              >
                {cfg.label} ({count})
              </button>
            )
          })}
        </div>

        {/* Search + filter bar */}
        <div className="flex gap-3 mb-6">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-fg" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search by name or unit..."
              className="w-full bg-card/50 border border-border rounded-xl pl-9 pr-4 py-2.5 text-sm text-foreground placeholder-muted-fg focus:outline-none focus:border-purple/40 transition-colors"
            />
          </div>
          <button className="flex items-center gap-2 px-4 py-2.5 bg-card/50 border border-border rounded-xl text-sm text-muted-fg hover:text-foreground hover:bg-white/5 transition-all">
            <SlidersHorizontal className="w-4 h-4" />
            <span className="hidden sm:inline">Filter</span>
          </button>
        </div>

        {/* Applications list */}
        <div className="flex flex-col gap-3">
          {filtered.length === 0 && (
            <div className="text-center py-16 text-muted-fg text-sm">
              No applications match your filters.
            </div>
          )}
          {filtered.map((app) => {
            const cfg = statusConfig[app.status]
            const risk = riskConfig[app.aiRiskLevel]
            return (
              <button
                key={app.id}
                onClick={() => onSelectApplication(app.id)}
                className="w-full bg-card/50 border border-border rounded-2xl px-5 py-4 flex items-center gap-4 hover:border-purple/20 hover:bg-white/3 transition-all text-left group"
              >
                {/* Avatar */}
                <div className="w-10 h-10 rounded-xl bg-purple/15 border border-purple/20 flex items-center justify-center flex-shrink-0">
                  <span className="text-purple font-semibold text-sm">
                    {app.applicantName.split(' ').map((n) => n[0]).join('')}
                  </span>
                </div>

                {/* Name + unit */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-0.5">
                    <span className="text-sm font-medium text-foreground">{app.applicantName}</span>
                    <span className="text-xs text-muted-fg">· Unit {app.unit}</span>
                  </div>
                  <span className="text-xs text-muted-fg">Submitted {app.dateSubmitted}</span>
                </div>

                {/* Screening score */}
                <div className="hidden sm:flex flex-col items-center">
                  <span className={`text-lg font-bold font-serif ${scoreColor(app.screeningScore)}`}>
                    {app.screeningScore}
                  </span>
                  <span className="text-[10px] text-muted-fg uppercase tracking-wide">Score</span>
                </div>

                {/* Risk badge */}
                <div className={`hidden md:flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-medium border ${risk.bg} ${risk.text} ${risk.border}`}>
                  <CircleDot className="w-3 h-3" />
                  {risk.label} Risk
                </div>

                {/* Status badge */}
                <div className={`flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-medium border ${cfg.bg} ${cfg.text} ${cfg.border}`}>
                  <span className={`w-1.5 h-1.5 rounded-full ${cfg.dot}`} />
                  <span className="hidden sm:inline">{cfg.label}</span>
                </div>

                <ChevronRight className="w-4 h-4 text-muted-fg opacity-0 group-hover:opacity-100 transition-opacity flex-shrink-0" />
              </button>
            )
          })}
        </div>
      </div>
    </div>
  )
}
