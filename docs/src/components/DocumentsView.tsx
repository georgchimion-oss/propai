import { useState } from 'react'
import { Search, FileText, X, Calendar, User, HardDrive, ChevronRight } from 'lucide-react'
import { PropertySelector } from './PropertySelector'
import { documents } from '@/data/mock'
import type { Document, DocType, DocStatus } from '@/data/types'

interface Props {
  selectedProperty: string
  onPropertyChange: (id: string) => void
}

const typeColors: Record<DocType, string> = {
  'Lease': 'text-blue bg-blue/10 border-blue/20',
  'Amendment': 'text-teal bg-teal/10 border-teal/20',
  'Notice': 'text-orange bg-orange/10 border-orange/20',
  'Meeting Minutes': 'text-gold bg-gold/10 border-gold/20',
  'Financial Report': 'text-green bg-green/10 border-green/20',
  'Rules & Regs': 'text-muted-fg bg-white/5 border-border',
}

const statusColors: Record<DocStatus, string> = {
  'Active': 'text-green bg-green/10 border-green/20',
  'Draft': 'text-gold bg-gold/10 border-gold/20',
  'Pending Signature': 'text-blue bg-blue/10 border-blue/20',
  'Expired': 'text-red bg-red/10 border-red/20',
  'Archived': 'text-muted-fg bg-white/5 border-border',
}

const docTypes: DocType[] = ['Lease', 'Amendment', 'Notice', 'Meeting Minutes', 'Financial Report', 'Rules & Regs']
const docStatuses: DocStatus[] = ['Draft', 'Pending Signature', 'Active', 'Expired', 'Archived']

export function DocumentsView({ selectedProperty, onPropertyChange }: Props) {
  const [search, setSearch] = useState('')
  const [filterType, setFilterType] = useState<DocType | ''>('')
  const [filterStatus, setFilterStatus] = useState<DocStatus | ''>('')
  const [selectedDoc, setSelectedDoc] = useState<Document | null>(null)

  const filtered = documents.filter(d => {
    if (d.propertyId !== selectedProperty) return false
    if (filterType && d.type !== filterType) return false
    if (filterStatus && d.status !== filterStatus) return false
    if (search) {
      const q = search.toLowerCase()
      return d.name.toLowerCase().includes(q) || d.description.toLowerCase().includes(q) || (d.createdBy.toLowerCase().includes(q))
    }
    return true
  })

  function formatDate(iso: string) {
    return new Date(iso).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 pt-24 pb-12">
      <div className="mb-6">
        <h1 className="font-serif text-3xl font-semibold text-foreground mb-1">
          Document Library
        </h1>
        <p className="text-muted-fg text-sm">
          All association documents — leases, notices, meeting records, and financials.
        </p>
      </div>

      <PropertySelector selectedProperty={selectedProperty} onPropertyChange={onPropertyChange} />

      {/* Search & Filters */}
      <div className="flex flex-col sm:flex-row gap-3 mb-6">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-fg" />
          <input
            type="text"
            placeholder="Search documents..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-4 py-2.5 bg-card border border-border rounded-xl text-sm text-foreground placeholder:text-muted-fg outline-none focus:border-blue/40 transition-colors"
          />
          {search && (
            <button onClick={() => setSearch('')} className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-fg hover:text-foreground">
              <X className="w-3.5 h-3.5" />
            </button>
          )}
        </div>
        <select
          value={filterType}
          onChange={(e) => setFilterType(e.target.value as DocType | '')}
          className="bg-card border border-border rounded-xl px-3 py-2.5 text-sm text-foreground outline-none focus:border-blue/40 transition-colors cursor-pointer"
        >
          <option value="">All Types</option>
          {docTypes.map(t => <option key={t} value={t}>{t}</option>)}
        </select>
        <select
          value={filterStatus}
          onChange={(e) => setFilterStatus(e.target.value as DocStatus | '')}
          className="bg-card border border-border rounded-xl px-3 py-2.5 text-sm text-foreground outline-none focus:border-blue/40 transition-colors cursor-pointer"
        >
          <option value="">All Statuses</option>
          {docStatuses.map(s => <option key={s} value={s}>{s}</option>)}
        </select>
      </div>

      <div className="flex gap-6">
        {/* Document List */}
        <div className={`flex-1 flex flex-col gap-2 ${selectedDoc ? 'hidden sm:flex' : 'flex'}`}>
          {filtered.length === 0 ? (
            <div className="bg-card border border-border rounded-xl p-12 text-center text-muted-fg">
              <FileText className="w-10 h-10 mx-auto mb-3 opacity-30" />
              <p className="text-sm">No documents match your filters.</p>
            </div>
          ) : (
            filtered.map((doc) => (
              <button
                key={doc.id}
                onClick={() => setSelectedDoc(doc)}
                className={`w-full text-left bg-card border rounded-xl p-4 hover:border-blue/30 transition-all group ${
                  selectedDoc?.id === doc.id ? 'border-blue/40 bg-blue/5' : 'border-border'
                }`}
              >
                <div className="flex items-start gap-3">
                  <div className="w-9 h-9 rounded-lg bg-blue/10 border border-blue/20 flex items-center justify-center flex-shrink-0 mt-0.5">
                    <FileText className="w-4 h-4 text-blue" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-2">
                      <p className="text-sm font-medium text-foreground group-hover:text-blue transition-colors truncate">
                        {doc.name}
                      </p>
                      <ChevronRight className="w-4 h-4 text-muted-fg flex-shrink-0 mt-0.5 opacity-0 group-hover:opacity-100 transition-opacity" />
                    </div>
                    <div className="flex flex-wrap items-center gap-2 mt-1.5">
                      <span className={`text-[11px] font-medium px-2 py-0.5 rounded-md border ${typeColors[doc.type]}`}>
                        {doc.type}
                      </span>
                      <span className={`text-[11px] font-medium px-2 py-0.5 rounded-md border ${statusColors[doc.status]}`}>
                        {doc.status}
                      </span>
                      <span className="text-[11px] text-muted-fg">
                        Modified {formatDate(doc.lastModified)}
                      </span>
                    </div>
                  </div>
                </div>
              </button>
            ))
          )}
        </div>

        {/* Detail Panel */}
        {selectedDoc && (
          <div className="w-full sm:w-80 lg:w-96 flex-shrink-0">
            <div className="bg-card border border-border rounded-xl p-5 sticky top-24">
              <div className="flex items-center justify-between mb-4">
                <h2 className="font-serif text-lg font-semibold text-foreground">Document Details</h2>
                <button
                  onClick={() => setSelectedDoc(null)}
                  className="text-muted-fg hover:text-foreground p-1 rounded-lg hover:bg-white/5 transition-colors"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              <div className="w-12 h-12 rounded-xl bg-blue/10 border border-blue/20 flex items-center justify-center mb-4">
                <FileText className="w-6 h-6 text-blue" />
              </div>

              <h3 className="text-sm font-semibold text-foreground mb-3 leading-snug">
                {selectedDoc.name}
              </h3>

              <p className="text-xs text-muted-fg leading-relaxed mb-4">
                {selectedDoc.description}
              </p>

              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs text-muted-fg">Type</span>
                  <span className={`text-[11px] font-medium px-2 py-0.5 rounded-md border ${typeColors[selectedDoc.type]}`}>
                    {selectedDoc.type}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-xs text-muted-fg">Status</span>
                  <span className={`text-[11px] font-medium px-2 py-0.5 rounded-md border ${statusColors[selectedDoc.status]}`}>
                    {selectedDoc.status}
                  </span>
                </div>
                {selectedDoc.unit && (
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-muted-fg">Unit</span>
                    <span className="text-xs font-medium text-foreground">{selectedDoc.unit}</span>
                  </div>
                )}
                <div className="flex items-center gap-2">
                  <Calendar className="w-3.5 h-3.5 text-muted-fg flex-shrink-0" />
                  <span className="text-xs text-muted-fg">Last modified</span>
                  <span className="text-xs text-foreground ml-auto">{formatDate(selectedDoc.lastModified)}</span>
                </div>
                <div className="flex items-center gap-2">
                  <User className="w-3.5 h-3.5 text-muted-fg flex-shrink-0" />
                  <span className="text-xs text-muted-fg">Created by</span>
                  <span className="text-xs text-foreground ml-auto">{selectedDoc.createdBy}</span>
                </div>
                <div className="flex items-center gap-2">
                  <HardDrive className="w-3.5 h-3.5 text-muted-fg flex-shrink-0" />
                  <span className="text-xs text-muted-fg">File size</span>
                  <span className="text-xs text-foreground ml-auto">{selectedDoc.fileSize}</span>
                </div>
              </div>

              <div className="mt-5 flex gap-2">
                <button className="flex-1 bg-blue/15 hover:bg-blue/25 text-blue border border-blue/25 text-xs font-medium py-2 rounded-lg transition-colors">
                  Download
                </button>
                <button className="flex-1 bg-white/5 hover:bg-white/10 text-foreground border border-border text-xs font-medium py-2 rounded-lg transition-colors">
                  Share
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
