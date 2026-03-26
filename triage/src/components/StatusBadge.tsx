import type { Priority, Status } from '@/data/types'

const priorityConfig: Record<Priority, { label: string; className: string }> = {
  critical: { label: 'Critical', className: 'bg-red/15 text-red border-red/25' },
  high: { label: 'High', className: 'bg-orange/15 text-orange border-orange/25' },
  medium: { label: 'Medium', className: 'bg-gold/15 text-gold border-gold/25' },
  low: { label: 'Low', className: 'bg-green/15 text-green border-green/25' },
}

const statusConfig: Record<Status, { label: string; className: string }> = {
  new: { label: 'New', className: 'bg-teal/15 text-teal border-teal/25' },
  triaging: { label: 'Triaging', className: 'bg-gold/15 text-gold border-gold/25' },
  assigned: { label: 'Assigned', className: 'bg-green/15 text-green border-green/25' },
  in_progress: { label: 'In Progress', className: 'bg-orange/15 text-orange border-orange/25' },
  resolved: { label: 'Resolved', className: 'bg-muted/15 text-muted-fg border-muted/25' },
}

interface PriorityBadgeProps {
  priority: Priority
}

export function PriorityBadge({ priority }: PriorityBadgeProps) {
  const config = priorityConfig[priority]
  return (
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold border ${config.className}`}>
      {priority === 'critical' && <span className="w-1.5 h-1.5 rounded-full bg-red mr-1.5 animate-pulse-dot" />}
      {config.label}
    </span>
  )
}

interface StatusBadgeProps {
  status: Status
}

export function StatusBadge({ status }: StatusBadgeProps) {
  const config = statusConfig[status]
  return (
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold border ${config.className}`}>
      {config.label}
    </span>
  )
}
