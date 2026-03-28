import { PenLine, Clock, CheckCircle2, XCircle, Eye, AlertCircle } from 'lucide-react'
import { PropertySelector } from './PropertySelector'
import { signatureRecords } from '@/data/mock'
import type { SignatureStatus } from '@/data/types'

interface Props {
  selectedProperty: string
  onPropertyChange: (id: string) => void
}

const statusConfig: Record<SignatureStatus, { label: string; icon: React.ReactNode; classes: string }> = {
  'Pending': {
    label: 'Pending',
    icon: <Clock className="w-3.5 h-3.5" />,
    classes: 'text-gold bg-gold/10 border-gold/20',
  },
  'Viewed': {
    label: 'Viewed',
    icon: <Eye className="w-3.5 h-3.5" />,
    classes: 'text-blue bg-blue/10 border-blue/20',
  },
  'Signed': {
    label: 'Signed',
    icon: <CheckCircle2 className="w-3.5 h-3.5" />,
    classes: 'text-green bg-green/10 border-green/20',
  },
  'Expired': {
    label: 'Expired',
    icon: <XCircle className="w-3.5 h-3.5" />,
    classes: 'text-red bg-red/10 border-red/20',
  },
}

export function SignaturesView({ selectedProperty, onPropertyChange }: Props) {
  const records = signatureRecords.filter(r => r.propertyId === selectedProperty)

  const total = records.length
  const signed = records.filter(r => r.status === 'Signed').length
  const pending = records.filter(r => r.status === 'Pending').length
  const viewed = records.filter(r => r.status === 'Viewed').length
  const expired = records.filter(r => r.status === 'Expired').length
  const completionRate = total > 0 ? Math.round((signed / total) * 100) : 0

  function formatDate(iso: string) {
    return new Date(iso).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 pt-24 pb-12">
      <div className="mb-6">
        <h1 className="font-serif text-3xl font-semibold text-foreground mb-1">
          E-Signature Tracking
        </h1>
        <p className="text-muted-fg text-sm">
          Monitor pending, viewed, and completed signature requests across your association.
        </p>
      </div>

      <PropertySelector selectedProperty={selectedProperty} onPropertyChange={onPropertyChange} />

      {/* Stats Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-8">
        <div className="bg-card border border-border rounded-xl p-4">
          <div className="flex items-center gap-2 mb-2">
            <div className="w-7 h-7 rounded-lg bg-green/10 border border-green/20 flex items-center justify-center">
              <CheckCircle2 className="w-3.5 h-3.5 text-green" />
            </div>
            <span className="text-xs text-muted-fg">Completion Rate</span>
          </div>
          <p className="font-serif text-2xl font-semibold text-green">{completionRate}%</p>
        </div>
        <div className="bg-card border border-border rounded-xl p-4">
          <div className="flex items-center gap-2 mb-2">
            <div className="w-7 h-7 rounded-lg bg-gold/10 border border-gold/20 flex items-center justify-center">
              <Clock className="w-3.5 h-3.5 text-gold" />
            </div>
            <span className="text-xs text-muted-fg">Pending</span>
          </div>
          <p className="font-serif text-2xl font-semibold text-gold">{pending}</p>
        </div>
        <div className="bg-card border border-border rounded-xl p-4">
          <div className="flex items-center gap-2 mb-2">
            <div className="w-7 h-7 rounded-lg bg-blue/10 border border-blue/20 flex items-center justify-center">
              <Eye className="w-3.5 h-3.5 text-blue" />
            </div>
            <span className="text-xs text-muted-fg">Viewed</span>
          </div>
          <p className="font-serif text-2xl font-semibold text-blue">{viewed}</p>
        </div>
        <div className="bg-card border border-border rounded-xl p-4">
          <div className="flex items-center gap-2 mb-2">
            <div className="w-7 h-7 rounded-lg bg-red/10 border border-red/20 flex items-center justify-center">
              <AlertCircle className="w-3.5 h-3.5 text-red" />
            </div>
            <span className="text-xs text-muted-fg">Expired</span>
          </div>
          <p className="font-serif text-2xl font-semibold text-red">{expired}</p>
        </div>
      </div>

      {/* Table */}
      {records.length === 0 ? (
        <div className="bg-card border border-border rounded-xl p-12 text-center text-muted-fg">
          <PenLine className="w-10 h-10 mx-auto mb-3 opacity-30" />
          <p className="text-sm">No signature requests for this property.</p>
        </div>
      ) : (
        <div className="bg-card border border-border rounded-xl overflow-hidden">
          {/* Table header */}
          <div className="hidden sm:grid grid-cols-12 gap-4 px-5 py-3 border-b border-border bg-white/2">
            <div className="col-span-4 text-[11px] font-medium text-muted-fg uppercase tracking-wider">Document</div>
            <div className="col-span-3 text-[11px] font-medium text-muted-fg uppercase tracking-wider">Signer</div>
            <div className="col-span-2 text-[11px] font-medium text-muted-fg uppercase tracking-wider">Sent</div>
            <div className="col-span-2 text-[11px] font-medium text-muted-fg uppercase tracking-wider">Status</div>
            <div className="col-span-1 text-[11px] font-medium text-muted-fg uppercase tracking-wider text-right">Days Left</div>
          </div>

          {/* Rows */}
          {records.map((rec, idx) => {
            const config = statusConfig[rec.status]
            return (
              <div
                key={rec.id}
                className={`grid sm:grid-cols-12 gap-2 sm:gap-4 px-5 py-4 transition-colors hover:bg-white/2 ${
                  idx < records.length - 1 ? 'border-b border-border' : ''
                }`}
              >
                {/* Document */}
                <div className="sm:col-span-4 flex items-start gap-2.5">
                  <div className="w-7 h-7 rounded-lg bg-blue/10 border border-blue/20 flex items-center justify-center flex-shrink-0 mt-0.5">
                    <PenLine className="w-3.5 h-3.5 text-blue" />
                  </div>
                  <div className="min-w-0">
                    <p className="text-xs font-medium text-foreground leading-snug">
                      {rec.documentName}
                    </p>
                    {rec.unit && (
                      <p className="text-[11px] text-muted-fg mt-0.5">Unit {rec.unit}</p>
                    )}
                  </div>
                </div>

                {/* Signer */}
                <div className="sm:col-span-3">
                  <p className="text-xs font-medium text-foreground">{rec.signerName}</p>
                  <p className="text-[11px] text-muted-fg truncate">{rec.signerEmail}</p>
                </div>

                {/* Sent date */}
                <div className="sm:col-span-2 flex items-center">
                  <span className="text-xs text-muted-fg">{formatDate(rec.sentDate)}</span>
                </div>

                {/* Status */}
                <div className="sm:col-span-2 flex items-center">
                  <span className={`inline-flex items-center gap-1.5 text-[11px] font-medium px-2 py-1 rounded-md border ${config.classes}`}>
                    {config.icon}
                    {config.label}
                  </span>
                </div>

                {/* Days remaining */}
                <div className="sm:col-span-1 flex items-center justify-end">
                  {rec.status === 'Signed' || rec.status === 'Expired' ? (
                    <span className="text-xs text-muted-fg">—</span>
                  ) : (
                    <span className={`text-xs font-semibold ${rec.daysRemaining <= 3 ? 'text-red' : rec.daysRemaining <= 7 ? 'text-orange' : 'text-foreground'}`}>
                      {rec.daysRemaining}d
                    </span>
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
