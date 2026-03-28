import { useState } from 'react'
import { Star, ShieldCheck, ShieldX, Award, DollarSign, Clock, ChevronDown, Sparkles } from 'lucide-react'
import { PropertySelector } from './PropertySelector'
import { rfps as allRfps, bids as allBids } from '@/data/mock'

interface Props {
  selectedProperty: string
  onPropertyChange: (id: string) => void
  selectedRFPId: string | null
  onSelectRFP: (rfpId: string) => void
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

function ScoreBar({ score }: { score: number }) {
  const colorClass =
    score >= 85
      ? 'bg-green'
      : score >= 65
      ? 'bg-orange'
      : 'bg-red'
  return (
    <div className="flex items-center gap-2">
      <div className="flex-1 h-1.5 bg-white/8 rounded-full overflow-hidden">
        <div
          className={`h-full rounded-full transition-all duration-500 ${colorClass}`}
          style={{ width: `${score}%` }}
        />
      </div>
      <span className={`text-sm font-semibold tabular-nums ${
        score >= 85 ? 'text-green' : score >= 65 ? 'text-orange' : 'text-red'
      }`}>
        {score}
      </span>
    </div>
  )
}

function formatAmount(n: number): string {
  return `$${n.toLocaleString()}`
}

export function BidsView({ selectedProperty, onPropertyChange, selectedRFPId, onSelectRFP }: Props) {
  const propertyRfps = allRfps.filter(
    r => r.propertyId === selectedProperty && r.bidsReceived > 0
  )

  const activeRFPId = selectedRFPId ?? propertyRfps[0]?.id ?? null

  const selectedRFP = allRfps.find(r => r.id === activeRFPId)
  const rfpBids = allBids.filter(b => b.rfpId === activeRFPId)
    .sort((a, b) => b.aiScore - a.aiScore)

  const [expandedBid, setExpandedBid] = useState<string | null>(null)

  // Cost comparison data — sort by amount
  const chartBids = [...rfpBids].sort((a, b) => a.amount - b.amount)
  const maxAmount = Math.max(...chartBids.map(b => b.amount), 1)

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 pt-24 pb-16">
      <PropertySelector selectedProperty={selectedProperty} onPropertyChange={onPropertyChange} />

      {/* Header */}
      <div className="mb-6">
        <h1 className="font-serif text-3xl font-semibold text-foreground mb-1">Bid Comparison</h1>
        <p className="text-sm text-muted-fg">AI-scored bid analysis — select an RFP to compare submitted bids</p>
      </div>

      {/* RFP Selector */}
      {propertyRfps.length === 0 ? (
        <div className="text-center py-16 text-muted-fg">
          <DollarSign className="w-10 h-10 mx-auto mb-3 opacity-30" />
          <p className="text-sm">No RFPs with submitted bids for this property.</p>
        </div>
      ) : (
        <>
          <div className="flex items-center gap-2 bg-card border border-border rounded-xl p-2 mb-6 flex-wrap">
            {propertyRfps.map(r => (
              <button
                key={r.id}
                onClick={() => onSelectRFP(r.id)}
                className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-all duration-150 ${
                  activeRFPId === r.id
                    ? 'bg-orange/15 text-orange border border-orange/25'
                    : 'text-muted-fg hover:text-foreground hover:bg-white/5'
                }`}
              >
                {r.title.length > 40 ? r.title.slice(0, 40) + '…' : r.title}
                <span className="ml-1.5 text-xs opacity-60">({r.bidsReceived})</span>
              </button>
            ))}
          </div>

          {selectedRFP && (
            <div className="mb-6 bg-card border border-border rounded-2xl p-4">
              <div className="flex items-start justify-between gap-4 flex-wrap">
                <div>
                  <h2 className="font-serif text-xl font-semibold text-foreground mb-1">
                    {selectedRFP.title}
                  </h2>
                  <p className="text-sm text-muted-fg">{selectedRFP.description}</p>
                </div>
                <div className="flex items-center gap-3 text-xs text-muted-fg flex-shrink-0">
                  <span className="flex items-center gap-1">
                    <DollarSign className="w-3.5 h-3.5" />
                    Budget: ${selectedRFP.budgetMin.toLocaleString()} – ${selectedRFP.budgetMax.toLocaleString()}
                  </span>
                  <span className="flex items-center gap-1">
                    <Clock className="w-3.5 h-3.5" />
                    {selectedRFP.bidsReceived} bids
                  </span>
                </div>
              </div>
            </div>
          )}

          {rfpBids.length === 0 ? (
            <div className="text-center py-12 text-muted-fg text-sm">No bids found for this RFP.</div>
          ) : (
            <>
              {/* Cost Comparison Chart */}
              <div className="bg-card border border-border rounded-2xl p-5 mb-6">
                <h3 className="font-serif text-base font-semibold text-foreground mb-4">Cost Comparison</h3>
                <div className="space-y-3">
                  {chartBids.map(bid => (
                    <div key={bid.id} className="flex items-center gap-3">
                      <div className="w-44 text-sm text-muted-fg truncate flex-shrink-0">
                        {bid.vendorName.length > 22 ? bid.vendorName.slice(0, 22) + '…' : bid.vendorName}
                      </div>
                      <div className="flex-1 flex items-center gap-2">
                        <div className="flex-1 h-6 bg-white/5 rounded-lg overflow-hidden relative">
                          <div
                            className={`h-full rounded-lg transition-all duration-500 ${
                              bid.recommended ? 'bg-orange/40' : 'bg-white/10'
                            }`}
                            style={{ width: `${(bid.amount / maxAmount) * 100}%` }}
                          />
                          {bid.recommended && (
                            <div className="absolute inset-y-0 left-2 flex items-center">
                              <Award className="w-3 h-3 text-orange" />
                            </div>
                          )}
                        </div>
                        <span className="text-sm font-medium text-foreground tabular-nums w-20 text-right">
                          {formatAmount(bid.amount)}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Bid Cards */}
              <div className="grid gap-4">
                {rfpBids.map(bid => (
                  <div
                    key={bid.id}
                    className={`bg-card border rounded-2xl overflow-hidden transition-all duration-200 ${
                      bid.recommended
                        ? 'border-orange/40 shadow-lg shadow-orange/5'
                        : 'border-border'
                    }`}
                  >
                    {bid.recommended && (
                      <div className="flex items-center gap-2 px-5 py-2 bg-orange/10 border-b border-orange/20">
                        <Sparkles className="w-3.5 h-3.5 text-orange" />
                        <span className="text-xs font-semibold text-orange uppercase tracking-wider">
                          AI Recommended
                        </span>
                      </div>
                    )}

                    <div className="p-5">
                      <div className="flex items-start justify-between gap-4 mb-4">
                        <div>
                          <h3 className="font-serif text-lg font-semibold text-foreground mb-1">
                            {bid.vendorName}
                          </h3>
                          <StarRating rating={bid.vendorRating} />
                        </div>
                        <div className="text-right flex-shrink-0">
                          <div className="font-serif text-2xl font-semibold text-foreground">
                            {formatAmount(bid.amount)}
                          </div>
                          <div className="text-xs text-muted-fg">{bid.timelineDays} day timeline</div>
                        </div>
                      </div>

                      {/* Stats Grid */}
                      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-4">
                        <div className="bg-navy-mid/50 rounded-xl p-3">
                          <div className="text-xs text-muted-fg mb-1">AI Score</div>
                          <ScoreBar score={bid.aiScore} />
                        </div>
                        <div className="bg-navy-mid/50 rounded-xl p-3">
                          <div className="text-xs text-muted-fg mb-1">Insurance</div>
                          <div className={`flex items-center gap-1 text-sm font-medium ${bid.insuranceVerified ? 'text-green' : 'text-red'}`}>
                            {bid.insuranceVerified
                              ? <><ShieldCheck className="w-3.5 h-3.5" /> Verified</>
                              : <><ShieldX className="w-3.5 h-3.5" /> Not Verified</>
                            }
                          </div>
                        </div>
                        <div className="bg-navy-mid/50 rounded-xl p-3">
                          <div className="text-xs text-muted-fg mb-1">License</div>
                          <div className={`flex items-center gap-1 text-sm font-medium ${bid.licensed ? 'text-green' : 'text-red'}`}>
                            {bid.licensed
                              ? <><ShieldCheck className="w-3.5 h-3.5" /> Licensed</>
                              : <><ShieldX className="w-3.5 h-3.5" /> Unlicensed</>
                            }
                          </div>
                        </div>
                        <div className="bg-navy-mid/50 rounded-xl p-3">
                          <div className="text-xs text-muted-fg mb-1">Submitted</div>
                          <div className="text-sm font-medium text-foreground">{bid.submittedDate}</div>
                        </div>
                      </div>

                      {/* AI Reasoning — expandable */}
                      <button
                        onClick={() => setExpandedBid(expandedBid === bid.id ? null : bid.id)}
                        className="flex items-center gap-1.5 text-xs text-muted-fg hover:text-foreground transition-colors mb-1"
                      >
                        <Sparkles className="w-3 h-3 text-orange/70" />
                        AI Reasoning
                        <ChevronDown
                          className={`w-3 h-3 transition-transform duration-200 ${expandedBid === bid.id ? 'rotate-180' : ''}`}
                        />
                      </button>
                      {expandedBid === bid.id && (
                        <div className="bg-orange/5 border border-orange/15 rounded-xl p-3 text-sm text-muted-fg leading-relaxed mt-2">
                          {bid.aiReasoning}
                        </div>
                      )}

                      {bid.notes && expandedBid !== bid.id && (
                        <p className="text-xs text-muted-fg mt-2 italic">{bid.notes}</p>
                      )}
                      {bid.notes && expandedBid === bid.id && (
                        <p className="text-xs text-muted-fg mt-2 italic">{bid.notes}</p>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </>
          )}
        </>
      )}
    </div>
  )
}
