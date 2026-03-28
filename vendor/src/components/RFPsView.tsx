import { useState } from 'react'
import { FileText, Clock, Tag, DollarSign, ChevronRight } from 'lucide-react'
import { PropertySelector } from './PropertySelector'
import type { RFPCategory, RFPStatus } from '@/data/types'
import { rfps as allRfps } from '@/data/mock'

interface Props {
  selectedProperty: string
  onPropertyChange: (id: string) => void
  onSelectRFP: (rfpId: string) => void
}

const statusColors: Record<RFPStatus, string> = {
  'Draft': 'text-muted-fg bg-white/5 border-white/10',
  'Open for Bids': 'text-teal bg-teal/10 border-teal/20',
  'Under Review': 'text-orange bg-orange/10 border-orange/20',
  'Awarded': 'text-green bg-green/10 border-green/20',
  'Closed': 'text-muted-fg bg-white/5 border-white/10',
}

const categoryColors: Record<RFPCategory, string> = {
  'Plumbing': 'text-teal bg-teal/10',
  'Electrical': 'text-gold bg-gold/10',
  'Landscaping': 'text-green bg-green/10',
  'Painting': 'text-orange bg-orange/10',
  'Roofing': 'text-red bg-red/10',
  'Elevator': 'text-gold bg-gold/10',
  'HVAC': 'text-teal bg-teal/10',
  'Security': 'text-muted-fg bg-white/5',
}

function formatBudget(min: number, max: number): string {
  const fmt = (n: number) =>
    n >= 1000 ? `$${(n / 1000).toFixed(0)}K` : `$${n}`
  return `${fmt(min)} – ${fmt(max)}`
}

function daysUntil(dateStr: string): number {
  const now = new Date('2026-03-27')
  const deadline = new Date(dateStr)
  return Math.ceil((deadline.getTime() - now.getTime()) / (1000 * 60 * 60 * 24))
}

const ALL_STATUSES: RFPStatus[] = ['Draft', 'Open for Bids', 'Under Review', 'Awarded', 'Closed']
const ALL_CATEGORIES: RFPCategory[] = ['Plumbing', 'Electrical', 'Landscaping', 'Painting', 'Roofing', 'Elevator', 'HVAC', 'Security']

export function RFPsView({ selectedProperty, onPropertyChange, onSelectRFP }: Props) {
  const [statusFilter, setStatusFilter] = useState<RFPStatus | 'All'>('All')
  const [categoryFilter, setCategoryFilter] = useState<RFPCategory | 'All'>('All')

  const filtered = allRfps.filter(r => {
    if (r.propertyId !== selectedProperty) return false
    if (statusFilter !== 'All' && r.status !== statusFilter) return false
    if (categoryFilter !== 'All' && r.category !== categoryFilter) return false
    return true
  })

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 pt-24 pb-16">
      <PropertySelector selectedProperty={selectedProperty} onPropertyChange={onPropertyChange} />

      {/* Header */}
      <div className="mb-6">
        <h1 className="font-serif text-3xl font-semibold text-foreground mb-1">Active RFPs</h1>
        <p className="text-sm text-muted-fg">Request for Proposals — manage solicitations and track bidding activity</p>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap gap-3 mb-6">
        <div className="flex items-center gap-2 bg-card border border-border rounded-xl p-2">
          <Tag className="w-4 h-4 text-muted-fg flex-shrink-0" />
          <select
            value={statusFilter}
            onChange={e => setStatusFilter(e.target.value as RFPStatus | 'All')}
            className="bg-transparent text-sm text-foreground outline-none cursor-pointer pr-2"
          >
            <option value="All">All Statuses</option>
            {ALL_STATUSES.map(s => <option key={s} value={s}>{s}</option>)}
          </select>
        </div>
        <div className="flex items-center gap-2 bg-card border border-border rounded-xl p-2">
          <FileText className="w-4 h-4 text-muted-fg flex-shrink-0" />
          <select
            value={categoryFilter}
            onChange={e => setCategoryFilter(e.target.value as RFPCategory | 'All')}
            className="bg-transparent text-sm text-foreground outline-none cursor-pointer pr-2"
          >
            <option value="All">All Categories</option>
            {ALL_CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
          </select>
        </div>
        <div className="ml-auto flex items-center gap-1.5 text-xs text-muted-fg">
          <span>{filtered.length} RFP{filtered.length !== 1 ? 's' : ''}</span>
        </div>
      </div>

      {/* RFP Cards */}
      {filtered.length === 0 ? (
        <div className="text-center py-16 text-muted-fg">
          <FileText className="w-10 h-10 mx-auto mb-3 opacity-30" />
          <p className="text-sm">No RFPs match the current filters.</p>
        </div>
      ) : (
        <div className="grid gap-4">
          {filtered.map(rfp => {
            const days = daysUntil(rfp.deadline)
            const deadlineClass = days < 0
              ? 'text-red'
              : days <= 7
              ? 'text-orange'
              : 'text-muted-fg'
            return (
              <div
                key={rfp.id}
                onClick={() => rfp.bidsReceived > 0 && onSelectRFP(rfp.id)}
                className={`bg-card border border-border rounded-2xl p-5 transition-all duration-200 ${
                  rfp.bidsReceived > 0
                    ? 'hover:border-orange/30 hover:bg-orange/5 cursor-pointer'
                    : 'opacity-80'
                }`}
              >
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-2 flex-wrap">
                      <span className={`inline-flex items-center px-2 py-0.5 rounded-lg text-xs font-medium border ${statusColors[rfp.status]}`}>
                        {rfp.status}
                      </span>
                      <span className={`inline-flex items-center px-2 py-0.5 rounded-lg text-xs font-medium ${categoryColors[rfp.category]}`}>
                        {rfp.category}
                      </span>
                    </div>
                    <h3 className="font-serif text-lg font-semibold text-foreground mb-1 leading-snug">
                      {rfp.title}
                    </h3>
                    <p className="text-sm text-muted-fg line-clamp-2 mb-3">
                      {rfp.description}
                    </p>
                    <div className="flex flex-wrap items-center gap-4 text-xs text-muted-fg">
                      <span className="flex items-center gap-1">
                        <DollarSign className="w-3.5 h-3.5" />
                        {formatBudget(rfp.budgetMin, rfp.budgetMax)}
                      </span>
                      <span className="flex items-center gap-1">
                        <FileText className="w-3.5 h-3.5" />
                        {rfp.bidsReceived} bid{rfp.bidsReceived !== 1 ? 's' : ''} received
                      </span>
                      <span className={`flex items-center gap-1 ${deadlineClass}`}>
                        <Clock className="w-3.5 h-3.5" />
                        {days < 0
                          ? 'Deadline passed'
                          : days === 0
                          ? 'Due today'
                          : `${days} days until deadline`}
                      </span>
                    </div>
                  </div>
                  {rfp.bidsReceived > 0 && (
                    <div className="flex-shrink-0 flex items-center justify-center w-8 h-8 rounded-lg bg-orange/10 border border-orange/20">
                      <ChevronRight className="w-4 h-4 text-orange" />
                    </div>
                  )}
                </div>
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}
