import { useState } from 'react'
import {
  FileText,
  Search,
  Filter,
  Download,
  Upload,
  AlertCircle,
  CheckCircle2,
  Clock,
  XCircle,
  FolderOpen,
} from 'lucide-react'
import { documents, buildings } from '@/data/mock'
import { PropertySelector } from '@/components/PropertySelector'
import { useScrollReveal } from '@/hooks/useScrollReveal'
import type { DocumentStatus } from '@/data/types'

interface Props {
  selectedProperty: string
  onPropertyChange: (id: string) => void
}

const statusConfig: Record<DocumentStatus, { label: string; icon: React.ReactNode; style: string }> = {
  current: { label: 'Current', icon: <CheckCircle2 className="w-3.5 h-3.5" />, style: 'bg-green/15 text-green border-green/25' },
  expiring_soon: { label: 'Expiring Soon', icon: <Clock className="w-3.5 h-3.5" />, style: 'bg-orange/15 text-orange border-orange/25' },
  expired: { label: 'Expired', icon: <AlertCircle className="w-3.5 h-3.5" />, style: 'bg-red/15 text-red border-red/25' },
  missing: { label: 'Missing', icon: <XCircle className="w-3.5 h-3.5" />, style: 'bg-red/15 text-red border-red/25' },
}

type FilterStatus = DocumentStatus | 'all'

export function DocumentsView({ selectedProperty, onPropertyChange }: Props) {
  const [search, setSearch] = useState('')
  const [statusFilter, setStatusFilter] = useState<FilterStatus>('all')
  const [categoryFilter, setCategoryFilter] = useState('all')

  const building = buildings[selectedProperty]
  const propertyDocs = documents.filter((d) => d.propertyId === selectedProperty)

  const categories = ['all', ...new Set(propertyDocs.map((d) => d.category))]

  const filtered = propertyDocs.filter((doc) => {
    if (statusFilter !== 'all' && doc.status !== statusFilter) return false
    if (categoryFilter !== 'all' && doc.category !== categoryFilter) return false
    if (search) {
      return doc.name.toLowerCase().includes(search.toLowerCase())
    }
    return true
  })

  const current = propertyDocs.filter((d) => d.status === 'current').length
  const expiring = propertyDocs.filter((d) => d.status === 'expiring_soon').length
  const expired = propertyDocs.filter((d) => d.status === 'expired').length
  const missing = propertyDocs.filter((d) => d.status === 'missing').length

  const headerRef = useScrollReveal<HTMLDivElement>()
  const statsRef = useScrollReveal<HTMLDivElement>(100)
  const tableRef = useScrollReveal<HTMLDivElement>(200)

  return (
    <div className="min-h-screen pt-20 pb-8 px-4 max-w-6xl mx-auto">
      {/* Property Selector */}
      <div className="mt-4">
        <PropertySelector
          selectedProperty={selectedProperty}
          onPropertyChange={(id) => {
            setCategoryFilter('all')
            setStatusFilter('all')
            setSearch('')
            onPropertyChange(id)
          }}
        />
      </div>

      {/* Header */}
      <div ref={headerRef} className="mb-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="font-serif text-2xl sm:text-3xl font-semibold text-foreground">
            Document Vault
          </h1>
          <p className="text-sm text-muted-fg mt-1">
            {building.name} — Compliance documents and certificates
          </p>
        </div>
        <button className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-teal/15 border border-teal/25 text-teal text-sm font-medium hover:bg-teal/25 transition-colors">
          <Upload className="w-4 h-4" />
          Upload Document
        </button>
      </div>

      {/* Stats */}
      <div ref={statsRef} className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-6">
        <DocStatCard count={current} label="Current" color="green" />
        <DocStatCard count={expiring} label="Expiring Soon" color="orange" />
        <DocStatCard count={expired} label="Expired" color="red" />
        <DocStatCard count={missing} label="Missing" color="red" />
      </div>

      {/* Table */}
      <div ref={tableRef} className="bg-card border border-border rounded-2xl overflow-hidden">
        {/* Filters */}
        <div className="p-4 border-b border-border">
          <div className="flex flex-col sm:flex-row gap-3">
            <div className="flex-1 flex items-center gap-2 bg-white/5 rounded-xl px-3 py-2 border border-border">
              <Search className="w-4 h-4 text-muted" />
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search documents..."
                className="flex-1 bg-transparent text-sm text-foreground placeholder-muted outline-none"
              />
            </div>
            <div className="flex items-center gap-2">
              <Filter className="w-4 h-4 text-muted hidden sm:block" />
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value as FilterStatus)}
                className="bg-white/5 border border-border rounded-xl px-3 py-2 text-sm text-foreground outline-none cursor-pointer"
              >
                <option value="all">All Status</option>
                <option value="current">Current</option>
                <option value="expiring_soon">Expiring Soon</option>
                <option value="expired">Expired</option>
                <option value="missing">Missing</option>
              </select>
              <select
                value={categoryFilter}
                onChange={(e) => setCategoryFilter(e.target.value)}
                className="bg-white/5 border border-border rounded-xl px-3 py-2 text-sm text-foreground outline-none cursor-pointer"
              >
                {categories.map((c) => (
                  <option key={c} value={c}>
                    {c === 'all' ? 'All Categories' : c}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* Document List */}
        <div className="divide-y divide-border">
          {filtered.length === 0 ? (
            <div className="p-8 text-center text-muted-fg text-sm">
              No documents match your filters
            </div>
          ) : (
            filtered.map((doc) => {
              const config = statusConfig[doc.status]
              return (
                <div key={doc.id} className="p-4 hover:bg-white/[0.02] transition-colors group">
                  <div className="flex items-center gap-4">
                    {/* Icon */}
                    <div className={`w-10 h-10 rounded-xl flex items-center justify-center border flex-shrink-0 ${
                      doc.status === 'missing'
                        ? 'bg-red/5 border-red/15'
                        : 'bg-white/5 border-border'
                    }`}>
                      {doc.status === 'missing' ? (
                        <XCircle className="w-4 h-4 text-red" />
                      ) : (
                        <FileText className="w-4 h-4 text-muted-fg" />
                      )}
                    </div>

                    {/* Content */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 flex-wrap mb-0.5">
                        <span className="text-sm font-medium text-foreground truncate">
                          {doc.name}
                        </span>
                        <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-semibold border ${config.style}`}>
                          {config.icon}
                          {config.label}
                        </span>
                      </div>
                      <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-[10px] text-muted">
                        <span className="flex items-center gap-1">
                          <FolderOpen className="w-3 h-3" />
                          {doc.category}
                        </span>
                        {doc.uploadDate && (
                          <span>
                            Uploaded: {new Date(doc.uploadDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                          </span>
                        )}
                        {doc.expiryDate && (
                          <span className={doc.status === 'expired' ? 'text-red' : doc.status === 'expiring_soon' ? 'text-orange' : ''}>
                            Expires: {new Date(doc.expiryDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                          </span>
                        )}
                        {doc.fileSize && <span>{doc.fileSize}</span>}
                      </div>
                    </div>

                    {/* Actions */}
                    {doc.status !== 'missing' ? (
                      <button className="p-2 rounded-lg text-muted hover:text-foreground hover:bg-white/5 transition-colors opacity-0 group-hover:opacity-100">
                        <Download className="w-4 h-4" />
                      </button>
                    ) : (
                      <button className="px-3 py-1.5 rounded-lg text-xs font-medium bg-red/10 border border-red/20 text-red hover:bg-red/20 transition-colors">
                        Upload
                      </button>
                    )}
                  </div>
                </div>
              )
            })
          )}
        </div>

        {/* Footer */}
        <div className="p-3 border-t border-border flex items-center justify-between">
          <span className="text-xs text-muted-fg">
            {filtered.length} of {propertyDocs.length} documents
          </span>
          <span className="text-xs text-muted">Powered by Vestia AI</span>
        </div>
      </div>
    </div>
  )
}

const colorMap: Record<string, string> = {
  green: 'text-green',
  orange: 'text-orange',
  red: 'text-red',
}

function DocStatCard({ count, label, color }: { count: number; label: string; color: string }) {
  return (
    <div className="bg-card border border-border rounded-xl p-3 sm:p-4">
      <p className={`text-2xl font-serif font-semibold ${colorMap[color] ?? 'text-foreground'}`}>{count}</p>
      <p className="text-xs text-muted-fg mt-0.5">{label}</p>
    </div>
  )
}
