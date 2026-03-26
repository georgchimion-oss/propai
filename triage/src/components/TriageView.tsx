import { useState, useEffect } from 'react'
import { Brain, CheckCircle2, Loader2, ArrowRight, Star, Clock, DollarSign, Zap } from 'lucide-react'
import { demoTriageResult } from '@/data/mock'
import { PriorityBadge } from '@/components/StatusBadge'

interface TriageViewProps {
  onComplete: () => void
}

const categoryLabels: Record<string, string> = {
  plumbing: 'Plumbing',
  electrical: 'Electrical',
  hvac: 'HVAC',
  structural: 'Structural',
  pest: 'Pest Control',
  appliance: 'Appliance',
  common_area: 'Common Area',
  elevator: 'Elevator',
  fire_safety: 'Fire Safety',
  other: 'Other',
}

export function TriageView({ onComplete }: TriageViewProps) {
  const [currentStep, setCurrentStep] = useState(0)
  const [complete, setComplete] = useState(false)
  const result = demoTriageResult

  useEffect(() => {
    if (currentStep < result.steps.length) {
      const timer = setTimeout(
        () => setCurrentStep((s) => s + 1),
        currentStep === 0 ? 800 : 600 + Math.random() * 400
      )
      return () => clearTimeout(timer)
    } else if (!complete) {
      setTimeout(() => setComplete(true), 500)
    }
  }, [currentStep, complete, result.steps.length])

  return (
    <div className="min-h-screen pt-20 pb-8 px-4 max-w-3xl mx-auto">
      {/* Analysis Header */}
      <div className="text-center mb-8">
        <div
          className={`w-16 h-16 rounded-2xl mx-auto mb-4 flex items-center justify-center border transition-all duration-500 ${
            complete
              ? 'bg-green/15 border-green/25'
              : 'bg-teal/15 border-teal/25'
          }`}
        >
          {complete ? (
            <CheckCircle2 className="w-8 h-8 text-green" />
          ) : (
            <Brain className="w-8 h-8 text-teal animate-pulse" />
          )}
        </div>
        <h1 className="font-serif text-2xl sm:text-3xl font-semibold text-foreground mb-2">
          {complete ? 'Triage Complete' : 'AI Analyzing Issue'}
        </h1>
        <p className="text-sm text-muted-fg">
          {complete
            ? 'Work order generated and vendor dispatched'
            : 'Processing report, photos, and building history...'}
        </p>
      </div>

      {/* Steps Progress */}
      <div className="bg-card border border-border rounded-2xl p-5 sm:p-6 mb-6">
        <div className="space-y-3">
          {result.steps.map((step, i) => {
            const done = i < currentStep
            const active = i === currentStep && !complete
            return (
              <div
                key={i}
                className={`flex items-center gap-3 transition-all duration-300 ${
                  done
                    ? 'opacity-100'
                    : active
                      ? 'opacity-100'
                      : 'opacity-20'
                }`}
              >
                <div className="w-6 h-6 flex-shrink-0 flex items-center justify-center">
                  {done ? (
                    <CheckCircle2 className="w-5 h-5 text-green" />
                  ) : active ? (
                    <Loader2 className="w-5 h-5 text-teal animate-spin" />
                  ) : (
                    <div className="w-2 h-2 rounded-full bg-muted" />
                  )}
                </div>
                <span
                  className={`text-sm ${
                    done
                      ? 'text-foreground'
                      : active
                        ? 'text-teal font-medium'
                        : 'text-muted'
                  }`}
                >
                  {step}
                </span>
              </div>
            )
          })}
        </div>

        {/* Progress Bar */}
        <div className="mt-5 h-1.5 bg-white/5 rounded-full overflow-hidden">
          <div
            className="h-full bg-gradient-to-r from-teal to-gold rounded-full transition-all duration-500 ease-out"
            style={{
              width: `${complete ? 100 : (currentStep / result.steps.length) * 100}%`,
            }}
          />
        </div>
      </div>

      {/* Result Cards — only show when complete */}
      {complete && (
        <div className="space-y-4 animate-fade-in">
          {/* Classification Card */}
          <div className="bg-card border border-border rounded-2xl p-5 sm:p-6">
            <h3 className="text-xs font-semibold text-muted-fg uppercase tracking-wider mb-4">
              Classification
            </h3>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              <div>
                <span className="text-[10px] text-muted uppercase tracking-wider">Category</span>
                <p className="text-sm font-semibold text-foreground mt-1">
                  {categoryLabels[result.category]}
                </p>
              </div>
              <div>
                <span className="text-[10px] text-muted uppercase tracking-wider">Priority</span>
                <div className="mt-1">
                  <PriorityBadge priority={result.priority} />
                </div>
              </div>
              <div>
                <span className="text-[10px] text-muted uppercase tracking-wider">Confidence</span>
                <p className="text-sm font-semibold text-teal mt-1">
                  {Math.round(result.confidence * 100)}%
                </p>
              </div>
              <div>
                <span className="text-[10px] text-muted uppercase tracking-wider">Est. Cost</span>
                <p className="text-sm font-semibold text-foreground mt-1">
                  {result.estimatedCost}
                </p>
              </div>
            </div>
          </div>

          {/* AI Reasoning */}
          <div className="bg-card border border-border rounded-2xl p-5 sm:p-6">
            <h3 className="text-xs font-semibold text-muted-fg uppercase tracking-wider mb-3">
              AI Assessment
            </h3>
            <p className="text-sm text-foreground leading-relaxed">
              {result.reasoning}
            </p>
          </div>

          {/* Vendor Card */}
          <div className="bg-card border border-gold/20 rounded-2xl p-5 sm:p-6">
            <h3 className="text-xs font-semibold text-muted-fg uppercase tracking-wider mb-4">
              Assigned Vendor
            </h3>
            <div className="flex items-start justify-between gap-4">
              <div>
                <h4 className="text-lg font-serif font-semibold text-foreground">
                  {result.vendor.name}
                </h4>
                <div className="flex flex-wrap items-center gap-3 mt-2 text-xs text-muted-fg">
                  <span className="flex items-center gap-1">
                    <Star className="w-3.5 h-3.5 text-gold" />
                    {result.vendor.rating}
                  </span>
                  <span className="flex items-center gap-1">
                    <Clock className="w-3.5 h-3.5" />
                    {result.vendor.responseTime}
                  </span>
                  <span className="flex items-center gap-1">
                    <DollarSign className="w-3.5 h-3.5" />
                    {result.vendor.hourlyRate}/hr
                  </span>
                </div>
              </div>
              <div className="flex-shrink-0 w-10 h-10 rounded-xl bg-green/15 flex items-center justify-center border border-green/25">
                <Zap className="w-5 h-5 text-green" />
              </div>
            </div>
            <div className="mt-4 p-3 rounded-xl bg-green/5 border border-green/15">
              <p className="text-xs text-green font-medium">
                ✓ Vendor notified — estimated arrival in 45 minutes
              </p>
            </div>
          </div>

          {/* Action Button */}
          <button
            onClick={onComplete}
            className="w-full flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl bg-gold/15 border border-gold/25 text-gold font-semibold text-sm hover:bg-gold/25 transition-all group"
          >
            View Dashboard
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </button>
        </div>
      )}
    </div>
  )
}
