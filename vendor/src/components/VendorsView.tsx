import { useState } from 'react'
import { Search, Star, ShieldCheck, ShieldX, Phone, Mail, Briefcase, AlertTriangle } from 'lucide-react'
import { vendors as allVendors } from '@/data/mock'
import type { RFPCategory, VendorStatus } from '@/data/types'

const ALL_SPECIALTIES: RFPCategory[] = ['Plumbing', 'Electrical', 'Landscaping', 'Painting', 'Roofing', 'Elevator', 'HVAC', 'Security']

const statusStyles: Record<VendorStatus, string> = {
  'Active': 'text-green bg-green/10 border-green/20',
  'Suspended': 'text-red bg-red/10 border-red/20',
  'New': 'text-teal bg-teal/10 border-teal/20',
}

function StarRating({ rating }: { rating: number }) {
  const full = Math.floor(rating)
  const half = rating - full >= 0.5
  return (
    <span className="flex items-center gap-0.5">
      {[1, 2, 3, 4, 5].map(i => (
        <Star
          key={i}
          className={`w-3 h-3 ${
            i <= full
              ? 'fill-gold text-gold'
              : i === full + 1 && half
              ? 'fill-gold/50 text-gold'
              : 'text-white/15 fill-white/5'
          }`}
        />
      ))}
      <span className="ml-1 text-xs text-muted-fg">{rating.toFixed(1)}</span>
    </span>
  )
}

function isExpiringSoon(dateStr: string): boolean {
  const now = new Date('2026-03-27')
  const exp = new Date(dateStr)
  const days = Math.ceil((exp.getTime() - now.getTime()) / (1000 * 60 * 60 * 24))
  return days <= 90
}

function isExpired(dateStr: string): boolean {
  const now = new Date('2026-03-27')
  return new Date(dateStr) < now
}

export function VendorsView() {
  const [search, setSearch] = useState('')
  const [specialtyFilter, setSpecialtyFilter] = useState<RFPCategory | 'All'>('All')

  const filtered = allVendors.filter(v => {
    if (search && !v.company.toLowerCase().includes(search.toLowerCase())) return false
    if (specialtyFilter !== 'All' && !v.specialty.includes(specialtyFilter)) return false
    return true
  })

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 pt-24 pb-16">
      {/* Header */}
      <div className="mb-6">
        <h1 className="font-serif text-3xl font-semibold text-foreground mb-1">Vendor Directory</h1>
        <p className="text-sm text-muted-fg">Approved contractors across all properties — shared vendor pool</p>
      </div>

      {/* Search & Filter */}
      <div className="flex flex-wrap gap-3 mb-6">
        <div className="flex items-center gap-2 bg-card border border-border rounded-xl px-3 py-2 flex-1 min-w-48">
          <Search className="w-4 h-4 text-muted-fg flex-shrink-0" />
          <input
            type="text"
            placeholder="Search vendors..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="bg-transparent text-sm text-foreground outline-none placeholder:text-muted-fg/50 flex-1"
          />
        </div>
        <div className="flex items-center gap-2 bg-card border border-border rounded-xl p-2">
          <Briefcase className="w-4 h-4 text-muted-fg flex-shrink-0" />
          <select
            value={specialtyFilter}
            onChange={e => setSpecialtyFilter(e.target.value as RFPCategory | 'All')}
            className="bg-transparent text-sm text-foreground outline-none cursor-pointer pr-2"
          >
            <option value="All">All Specialties</option>
            {ALL_SPECIALTIES.map(s => <option key={s} value={s}>{s}</option>)}
          </select>
        </div>
        <div className="ml-auto flex items-center gap-1.5 text-xs text-muted-fg self-center">
          <span>{filtered.length} vendor{filtered.length !== 1 ? 's' : ''}</span>
        </div>
      </div>

      {/* Vendor Cards */}
      {filtered.length === 0 ? (
        <div className="text-center py-16 text-muted-fg">
          <Briefcase className="w-10 h-10 mx-auto mb-3 opacity-30" />
          <p className="text-sm">No vendors match the current filters.</p>
        </div>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {filtered.map(vendor => {
            const expired = isExpired(vendor.insuranceExpiry)
            const expiring = !expired && isExpiringSoon(vendor.insuranceExpiry)
            return (
              <div
                key={vendor.id}
                className={`bg-card border rounded-2xl p-5 flex flex-col gap-4 transition-colors duration-200 hover:border-orange/20 ${
                  vendor.status === 'Suspended' ? 'border-red/20 opacity-75' : 'border-border'
                }`}
              >
                {/* Top row */}
                <div className="flex items-start justify-between gap-2">
                  <div className="flex-1 min-w-0">
                    <h3 className="font-serif text-base font-semibold text-foreground leading-snug mb-1 truncate">
                      {vendor.company}
                    </h3>
                    <StarRating rating={vendor.rating} />
                  </div>
                  <span className={`flex-shrink-0 inline-flex items-center px-2 py-0.5 rounded-lg text-xs font-medium border ${statusStyles[vendor.status]}`}>
                    {vendor.status}
                  </span>
                </div>

                {/* Specialties */}
                <div className="flex flex-wrap gap-1.5">
                  {vendor.specialty.map(s => (
                    <span
                      key={s}
                      className="px-2 py-0.5 rounded-lg bg-white/5 text-muted-fg text-xs font-medium"
                    >
                      {s}
                    </span>
                  ))}
                </div>

                {/* Stats */}
                <div className="grid grid-cols-2 gap-2 text-xs">
                  <div className="bg-navy-mid/50 rounded-xl p-2.5">
                    <div className="text-muted-fg mb-0.5">Jobs Completed</div>
                    <div className="font-semibold text-foreground">{vendor.jobsCompleted}</div>
                  </div>
                  <div className="bg-navy-mid/50 rounded-xl p-2.5">
                    <div className="text-muted-fg mb-0.5">Years Active</div>
                    <div className="font-semibold text-foreground">{vendor.yearsInBusiness} yrs</div>
                  </div>
                </div>

                {/* License & Insurance */}
                <div className="flex items-center gap-3 text-xs">
                  <div className={`flex items-center gap-1 font-medium ${vendor.licensed ? 'text-green' : 'text-red'}`}>
                    {vendor.licensed
                      ? <><ShieldCheck className="w-3.5 h-3.5" /> Licensed</>
                      : <><ShieldX className="w-3.5 h-3.5" /> Unlicensed</>
                    }
                  </div>
                  <div className={`flex items-center gap-1 font-medium ${expired ? 'text-red' : expiring ? 'text-orange' : 'text-green'}`}>
                    {expired
                      ? <><AlertTriangle className="w-3.5 h-3.5" /> Ins. Expired</>
                      : expiring
                      ? <><AlertTriangle className="w-3.5 h-3.5" /> Ins. Exp. {vendor.insuranceExpiry}</>
                      : <><ShieldCheck className="w-3.5 h-3.5" /> Ins. Valid</>
                    }
                  </div>
                </div>

                {/* Contact */}
                <div className="border-t border-border pt-3 flex flex-col gap-1.5">
                  <a
                    href={`tel:${vendor.phone}`}
                    className="flex items-center gap-2 text-xs text-muted-fg hover:text-foreground transition-colors"
                  >
                    <Phone className="w-3.5 h-3.5 flex-shrink-0" />
                    {vendor.phone}
                  </a>
                  <a
                    href={`mailto:${vendor.email}`}
                    className="flex items-center gap-2 text-xs text-muted-fg hover:text-orange transition-colors truncate"
                  >
                    <Mail className="w-3.5 h-3.5 flex-shrink-0" />
                    <span className="truncate">{vendor.email}</span>
                  </a>
                </div>
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}
