import {
  CalendarCheck,
  AlertTriangle,
  FileText,
  Users,
  Flag,
  CheckCircle2,
  Clock,
} from 'lucide-react'
import { timeline, buildings } from '@/data/mock'
import { PropertySelector } from '@/components/PropertySelector'
import { useScrollReveal } from '@/hooks/useScrollReveal'
import type { TimelineEvent } from '@/data/types'

interface Props {
  selectedProperty: string
  onPropertyChange: (id: string) => void
}

const typeIcons: Record<TimelineEvent['type'], React.ReactNode> = {
  inspection: <CalendarCheck className="w-4 h-4" />,
  deadline: <AlertTriangle className="w-4 h-4" />,
  filing: <FileText className="w-4 h-4" />,
  meeting: <Users className="w-4 h-4" />,
  milestone: <Flag className="w-4 h-4" />,
}

const statusColors: Record<TimelineEvent['status'], string> = {
  completed: 'bg-green/15 border-green/30 text-green',
  upcoming: 'bg-teal/15 border-teal/30 text-teal',
  overdue: 'bg-red/15 border-red/30 text-red',
}

const lineColors: Record<TimelineEvent['status'], string> = {
  completed: 'bg-green',
  upcoming: 'bg-teal',
  overdue: 'bg-red',
}

export function TimelineView({ selectedProperty, onPropertyChange }: Props) {
  const building = buildings[selectedProperty]
  const headerRef = useScrollReveal<HTMLDivElement>()
  const legendRef = useScrollReveal<HTMLDivElement>(100)

  const now = new Date('2024-03-25')

  const filtered = timeline.filter((e) => e.propertyId === selectedProperty)
  const completed = filtered.filter((e) => e.status === 'completed')
  const overdue = filtered.filter((e) => e.status === 'overdue')
  const upcoming = filtered.filter((e) => e.status === 'upcoming')
  const sorted = [
    ...overdue,
    ...upcoming.sort((a, b) => a.date.localeCompare(b.date)),
    ...completed.sort((a, b) => b.date.localeCompare(a.date)),
  ]

  return (
    <div className="min-h-screen pt-20 pb-8 px-4 max-w-4xl mx-auto">
      {/* Property Selector */}
      <div className="mt-4">
        <PropertySelector
          selectedProperty={selectedProperty}
          onPropertyChange={onPropertyChange}
        />
      </div>

      {/* Header */}
      <div ref={headerRef} className="mb-6">
        <h1 className="font-serif text-2xl sm:text-3xl font-semibold text-foreground">
          Compliance Timeline
        </h1>
        <p className="text-sm text-muted-fg mt-1">
          {building.name} — Key dates, deadlines, and milestones
        </p>
      </div>

      {/* Legend */}
      <div ref={legendRef} className="flex flex-wrap gap-4 mb-8">
        <LegendItem color="bg-red" label={`${overdue.length} Overdue`} />
        <LegendItem color="bg-teal" label={`${upcoming.length} Upcoming`} />
        <LegendItem color="bg-green" label={`${completed.length} Completed`} />
      </div>

      {/* Today Marker */}
      <div className="relative mb-2">
        <div className="flex items-center gap-3 mb-8">
          <div className="w-8 h-8 rounded-full bg-gold/20 border border-gold/30 flex items-center justify-center">
            <Clock className="w-4 h-4 text-gold" />
          </div>
          <div className="flex-1 h-px bg-gold/20" />
          <span className="text-xs font-semibold text-gold px-3 py-1 bg-gold/10 border border-gold/20 rounded-full">
            Today — {now.toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
          </span>
          <div className="flex-1 h-px bg-gold/20" />
        </div>
      </div>

      {/* Timeline */}
      <div className="relative">
        {/* Vertical line */}
        <div className="absolute left-4 sm:left-[1.95rem] top-0 bottom-0 w-px bg-border" />

        <div className="space-y-0">
          {sorted.length === 0 ? (
            <p className="pl-12 text-sm text-muted-fg">No timeline events for this property.</p>
          ) : (
            sorted.map((event, i) => (
              <TimelineCard key={event.id} event={event} index={i} />
            ))
          )}
        </div>
      </div>
    </div>
  )
}

function TimelineCard({ event, index }: { event: TimelineEvent; index: number }) {
  const ref = useScrollReveal<HTMLDivElement>(index * 60)

  const date = new Date(event.date)
  const formattedDate = date.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  })

  return (
    <div ref={ref} className="relative pl-12 sm:pl-16 pb-6">
      {/* Dot */}
      <div className={`absolute left-2.5 sm:left-5 top-1.5 w-3 h-3 rounded-full border-2 border-background ${lineColors[event.status]}`}>
        {event.status === 'overdue' && (
          <span className="absolute inset-0 rounded-full bg-red animate-pulse-dot" />
        )}
      </div>

      {/* Card */}
      <div className={`p-4 rounded-xl border ${
        event.status === 'overdue'
          ? 'bg-red/5 border-red/15'
          : 'bg-card border-border'
      } hover:border-teal/20 transition-colors`}>
        <div className="flex items-start gap-3">
          <div className={`w-8 h-8 rounded-lg flex items-center justify-center border flex-shrink-0 ${statusColors[event.status]}`}>
            {typeIcons[event.type]}
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 flex-wrap mb-1">
              <h3 className="text-sm font-semibold text-foreground">{event.title}</h3>
              {event.status === 'completed' && (
                <CheckCircle2 className="w-3.5 h-3.5 text-green flex-shrink-0" />
              )}
            </div>
            <p className="text-xs text-muted-fg leading-relaxed">{event.description}</p>
            <div className="flex items-center gap-3 mt-2 text-[10px] text-muted">
              <span>{formattedDate}</span>
              <span className={`px-1.5 py-0.5 rounded border text-[10px] font-medium ${statusColors[event.status]}`}>
                {event.status === 'overdue' ? 'OVERDUE' : event.status === 'completed' ? 'Done' : 'Upcoming'}
              </span>
              <span className="bg-white/5 px-1.5 py-0.5 rounded capitalize">{event.type}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

function LegendItem({ color, label }: { color: string; label: string }) {
  return (
    <div className="flex items-center gap-2">
      <div className={`w-2.5 h-2.5 rounded-full ${color}`} />
      <span className="text-xs text-muted-fg font-medium">{label}</span>
    </div>
  )
}
