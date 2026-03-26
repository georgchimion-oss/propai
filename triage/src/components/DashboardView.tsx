import { useState } from 'react'
import {
  AlertTriangle,
  Clock,
  CheckCircle2,
  Users,
  TrendingUp,
  Search,
  Filter,
  ChevronRight,
  Wrench,
  Building2,
  BarChart3,
} from 'lucide-react'
import { workOrders, vendors, properties } from '@/data/mock'
import { PriorityBadge, StatusBadge } from '@/components/StatusBadge'
import { PropertySelector } from '@/components/PropertySelector'
import { useScrollReveal } from '@/hooks/useScrollReveal'
import type { Priority, Status } from '@/data/types'

type FilterPriority = Priority | 'all'
type FilterStatus = Status | 'all'

interface DashboardViewProps {
  selectedProperty: string
  onPropertyChange: (id: string) => void
}

export function DashboardView({ selectedProperty, onPropertyChange }: DashboardViewProps) {
  const [priorityFilter, setPriorityFilter] = useState<FilterPriority>('all')
  const [statusFilter, setStatusFilter] = useState<FilterStatus>('all')
  const [searchQuery, setSearchQuery] = useState('')

  const propertyOrders = workOrders.filter((wo) => wo.propertyId === selectedProperty)
  const currentProperty = properties.find(p => p.id === selectedProperty)

  const filtered = propertyOrders.filter((wo) => {
    if (priorityFilter !== 'all' && wo.priority !== priorityFilter) return false
    if (statusFilter !== 'all' && wo.status !== statusFilter) return false
    if (searchQuery) {
      const q = searchQuery.toLowerCase()
      return (
        wo.description.toLowerCase().includes(q) ||
        wo.tenant.toLowerCase().includes(q) ||
        wo.unit.toLowerCase().includes(q) ||
        wo.id.toLowerCase().includes(q)
      )
    }
    return true
  })

  const stats = {
    critical: propertyOrders.filter((w) => w.priority === 'critical' && w.status !== 'resolved').length,
    open: propertyOrders.filter((w) => w.status !== 'resolved').length,
    resolved: propertyOrders.filter((w) => w.status === 'resolved').length,
    avgConfidence: propertyOrders.length > 0
      ? Math.round(
          (propertyOrders.reduce((acc, w) => acc + w.aiConfidence, 0) / propertyOrders.length) * 100
        )
      : 0,
  }

  const statsRef = useScrollReveal<HTMLDivElement>()
  const tableRef = useScrollReveal<HTMLDivElement>(150)
  const vendorsRef = useScrollReveal<HTMLDivElement>(300)

  return (
    <div className="min-h-screen pt-20 pb-8 px-4 max-w-7xl mx-auto">
      {/* Page Header */}
      <div className="mb-4">
        <h1 className="font-serif text-2xl sm:text-3xl font-semibold text-foreground">
          Maintenance Dashboard
        </h1>
        <p className="text-sm text-muted-fg mt-1">
          Real-time work order management
        </p>
      </div>

      {/* Property Selector */}
      <PropertySelector selectedProperty={selectedProperty} onPropertyChange={onPropertyChange} />

      {/* Property subtitle */}
      {currentProperty && (
        <p className="text-xs text-muted-fg -mt-4 mb-6 px-1">
          {currentProperty.address}
        </p>
      )}

      {/* Stats Row */}
      <div ref={statsRef} className="grid grid-cols-2 lg:grid-cols-4 gap-3 mb-6">
        <StatCard
          icon={<AlertTriangle className="w-4 h-4 text-red" />}
          label="Critical"
          value={stats.critical}
          accent="red"
        />
        <StatCard
          icon={<Clock className="w-4 h-4 text-orange" />}
          label="Open Issues"
          value={stats.open}
          accent="orange"
        />
        <StatCard
          icon={<CheckCircle2 className="w-4 h-4 text-green" />}
          label="Resolved"
          value={stats.resolved}
          accent="green"
        />
        <StatCard
          icon={<TrendingUp className="w-4 h-4 text-teal" />}
          label="AI Accuracy"
          value={`${stats.avgConfidence}%`}
          accent="teal"
        />
      </div>

      {/* Filters */}
      <div ref={tableRef} className="bg-card border border-border rounded-2xl overflow-hidden mb-6">
        <div className="p-4 border-b border-border">
          <div className="flex flex-col sm:flex-row gap-3">
            {/* Search */}
            <div className="flex-1 flex items-center gap-2 bg-white/5 rounded-xl px-3 py-2 border border-border">
              <Search className="w-4 h-4 text-muted" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search work orders..."
                className="flex-1 bg-transparent text-sm text-foreground placeholder-muted outline-none"
              />
            </div>

            {/* Priority Filter */}
            <div className="flex items-center gap-2">
              <Filter className="w-4 h-4 text-muted sm:block hidden" />
              <select
                value={priorityFilter}
                onChange={(e) => setPriorityFilter(e.target.value as FilterPriority)}
                className="bg-white/5 border border-border rounded-xl px-3 py-2 text-sm text-foreground outline-none cursor-pointer"
              >
                <option value="all">All Priorities</option>
                <option value="critical">Critical</option>
                <option value="high">High</option>
                <option value="medium">Medium</option>
                <option value="low">Low</option>
              </select>

              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value as FilterStatus)}
                className="bg-white/5 border border-border rounded-xl px-3 py-2 text-sm text-foreground outline-none cursor-pointer"
              >
                <option value="all">All Status</option>
                <option value="new">New</option>
                <option value="triaging">Triaging</option>
                <option value="assigned">Assigned</option>
                <option value="in_progress">In Progress</option>
                <option value="resolved">Resolved</option>
              </select>
            </div>
          </div>
        </div>

        {/* Work Order List */}
        <div className="divide-y divide-border">
          {filtered.length === 0 ? (
            <div className="p-8 text-center text-muted-fg text-sm">
              No work orders match your filters
            </div>
          ) : (
            filtered.map((wo) => (
              <div
                key={wo.id}
                className="p-4 hover:bg-white/[0.02] transition-colors cursor-pointer group"
              >
                <div className="flex items-start gap-4">
                  {/* Left: Icon */}
                  <div className="hidden sm:flex w-10 h-10 rounded-xl bg-white/5 items-center justify-center flex-shrink-0 border border-border">
                    <Wrench className="w-4 h-4 text-muted-fg" />
                  </div>

                  {/* Center: Content */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1 flex-wrap">
                      <span className="text-xs font-mono text-muted">{wo.id}</span>
                      <PriorityBadge priority={wo.priority} />
                      <StatusBadge status={wo.status} />
                    </div>
                    <p className="text-sm text-foreground font-medium mb-1 line-clamp-1">
                      {wo.description}
                    </p>
                    <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-muted-fg">
                      <span className="flex items-center gap-1">
                        <Building2 className="w-3 h-3" />
                        {wo.building} — Unit {wo.unit}
                      </span>
                      <span>
                        <Users className="w-3 h-3 inline mr-1" />
                        {wo.tenant}
                      </span>
                      {wo.vendor && (
                        <span>
                          <Wrench className="w-3 h-3 inline mr-1" />
                          {wo.vendor}
                        </span>
                      )}
                      {wo.estimatedCost && (
                        <span className="text-gold">{wo.estimatedCost}</span>
                      )}
                      <span className="flex items-center gap-1">
                        <BarChart3 className="w-3 h-3" />
                        AI: {Math.round(wo.aiConfidence * 100)}%
                      </span>
                    </div>
                  </div>

                  {/* Right: Arrow */}
                  <ChevronRight className="w-4 h-4 text-muted group-hover:text-foreground transition-colors flex-shrink-0 mt-1" />
                </div>
              </div>
            ))
          )}
        </div>

        {/* Footer */}
        <div className="p-3 border-t border-border flex items-center justify-between">
          <span className="text-xs text-muted-fg">
            Showing {filtered.length} of {propertyOrders.length} work orders
          </span>
          <span className="text-xs text-muted">
            Powered by Vestia AI
          </span>
        </div>
      </div>

      {/* Vendor Availability */}
      <div ref={vendorsRef}>
        <h2 className="font-serif text-lg font-semibold text-foreground mb-3">
          Vendor Network
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {vendors.map((vendor) => (
            <div
              key={vendor.id}
              className="bg-card border border-border rounded-xl p-4 hover:border-gold/20 transition-colors"
            >
              <div className="flex items-center justify-between mb-2">
                <h3 className="text-sm font-semibold text-foreground">{vendor.name}</h3>
                <span
                  className={`w-2 h-2 rounded-full ${
                    vendor.available ? 'bg-green' : 'bg-red'
                  }`}
                />
              </div>
              <div className="flex flex-wrap gap-1.5 mb-3">
                {vendor.specialty.map((s) => (
                  <span
                    key={s}
                    className="px-2 py-0.5 rounded-md text-[10px] font-medium bg-white/5 text-muted-fg border border-border"
                  >
                    {s.replace('_', ' ')}
                  </span>
                ))}
              </div>
              <div className="flex items-center gap-3 text-xs text-muted-fg">
                <span className="flex items-center gap-1">
                  <span className="text-gold">★</span> {vendor.rating}
                </span>
                <span>{vendor.responseTime}</span>
                <span>{vendor.hourlyRate}/hr</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

const accentStyles: Record<string, string> = {
  red: 'bg-red/10 border-red/20',
  orange: 'bg-orange/10 border-orange/20',
  green: 'bg-green/10 border-green/20',
  teal: 'bg-teal/10 border-teal/20',
}

function StatCard({
  icon,
  label,
  value,
  accent,
}: {
  icon: React.ReactNode
  label: string
  value: string | number
  accent: string
}) {
  return (
    <div className="bg-card border border-border rounded-xl p-4">
      <div className="flex items-center gap-2 mb-2">
        <div className={`w-7 h-7 rounded-lg flex items-center justify-center border ${accentStyles[accent] ?? ''}`}>
          {icon}
        </div>
        <span className="text-xs text-muted-fg font-medium">{label}</span>
      </div>
      <p className="text-2xl font-serif font-semibold text-foreground">{value}</p>
    </div>
  )
}
