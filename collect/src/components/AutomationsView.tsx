import { useState } from 'react'
import {
  Zap,
  Mail,
  MessageSquare,
  AlertTriangle,
  Scale,
  CheckCircle2,
  Circle,
  ChevronDown,
  ChevronUp,
  Users,
  Power,
} from 'lucide-react'
import { automations, properties } from '@/data/mock'
import { useScrollReveal } from '@/hooks/useScrollReveal'
import { PropertySelector } from '@/components/PropertySelector'
import type { AutomationStep } from '@/data/types'

interface Props {
  selectedProperty: string
  onPropertyChange: (id: string) => void
}

const stepIcons: Record<AutomationStep, React.ReactNode> = {
  reminder: <Mail className="w-3.5 h-3.5" />,
  notice: <MessageSquare className="w-3.5 h-3.5" />,
  warning: <AlertTriangle className="w-3.5 h-3.5" />,
  escalation: <AlertTriangle className="w-3.5 h-3.5" />,
  legal: <Scale className="w-3.5 h-3.5" />,
}

const stepStyles: Record<AutomationStep, string> = {
  reminder: 'bg-teal/15 text-teal border-teal/25',
  notice: 'bg-gold/15 text-gold border-gold/25',
  warning: 'bg-orange/15 text-orange border-orange/25',
  escalation: 'bg-red/15 text-red border-red/25',
  legal: 'bg-red/15 text-red border-red/25',
}

const stepLabels: Record<AutomationStep, string> = {
  reminder: 'Reminder',
  notice: 'Notice',
  warning: 'Warning',
  escalation: 'Escalation',
  legal: 'Legal',
}

export function AutomationsView({ selectedProperty, onPropertyChange }: Props) {
  const [expanded, setExpanded] = useState<string | null>('a1')

  const headerRef = useScrollReveal<HTMLDivElement>()
  const statsRef = useScrollReveal<HTMLDivElement>(100)

  const property = properties.find(p => p.id === selectedProperty)
  const active = automations.filter((a) => a.active).length

  return (
    <div className="min-h-screen pt-20 pb-8 px-4 max-w-4xl mx-auto">
      <div ref={headerRef} className="mb-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="font-serif text-2xl sm:text-3xl font-semibold text-foreground">Automations</h1>
          <p className="text-sm text-muted-fg mt-1">AI-powered collection sequences and communication workflows</p>
        </div>
        <button className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-green/15 border border-green/25 text-green text-sm font-medium hover:bg-green/25 transition-colors">
          <Zap className="w-4 h-4" />
          New Sequence
        </button>
      </div>

      <PropertySelector selectedProperty={selectedProperty} onPropertyChange={onPropertyChange} />

      {/* Stats */}
      <div ref={statsRef} className="grid grid-cols-3 gap-3 mb-6">
        <div className="bg-card border border-border rounded-xl p-4">
          <p className="text-2xl font-serif font-semibold text-green">{active}</p>
          <p className="text-xs text-muted-fg mt-0.5">Active Sequences</p>
        </div>
        <div className="bg-card border border-border rounded-xl p-4">
          <p className="text-2xl font-serif font-semibold text-foreground">{automations.reduce((s, a) => s + a.steps.length, 0)}</p>
          <p className="text-xs text-muted-fg mt-0.5">Total Steps</p>
        </div>
        <div className="bg-card border border-border rounded-xl p-4">
          <p className="text-2xl font-serif font-semibold text-teal">{automations.reduce((s, a) => s + a.tenantsEnrolled, 0)}</p>
          <p className="text-xs text-muted-fg mt-0.5">Tenants Enrolled ({property?.name ?? 'All Properties'})</p>
        </div>
      </div>

      {/* Sequences */}
      <div className="space-y-3">
        {automations.map((seq, i) => {
          const isExpanded = expanded === seq.id
          const ref = useScrollReveal<HTMLDivElement>(150 + i * 60)
          return (
            <div
              key={seq.id}
              ref={ref}
              className={`bg-card border rounded-2xl overflow-hidden transition-colors ${
                seq.active ? 'border-border' : 'border-border opacity-60'
              }`}
            >
              {/* Header */}
              <button
                onClick={() => setExpanded(isExpanded ? null : seq.id)}
                className="w-full p-4 sm:p-5 flex items-center gap-4 text-left hover:bg-white/[0.02] transition-colors"
              >
                <div className={`w-10 h-10 rounded-xl flex items-center justify-center border flex-shrink-0 ${
                  seq.active ? 'bg-green/15 border-green/25' : 'bg-white/5 border-border'
                }`}>
                  <Zap className={`w-5 h-5 ${seq.active ? 'text-green' : 'text-muted'}`} />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <h3 className="text-sm font-semibold text-foreground">{seq.name}</h3>
                    {seq.active ? (
                      <span className="flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-semibold bg-green/15 text-green border border-green/25">
                        <Power className="w-2.5 h-2.5" /> Active
                      </span>
                    ) : (
                      <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-white/5 text-muted-fg border border-border">Inactive</span>
                    )}
                  </div>
                  <div className="flex items-center gap-3 mt-0.5 text-[10px] text-muted">
                    <span>{seq.trigger}</span>
                    <span className="flex items-center gap-1"><Users className="w-3 h-3" /> {seq.tenantsEnrolled} enrolled across all properties</span>
                    <span>{seq.steps.length} steps</span>
                  </div>
                </div>
                {isExpanded ? <ChevronUp className="w-4 h-4 text-muted" /> : <ChevronDown className="w-4 h-4 text-muted" />}
              </button>

              {/* Steps */}
              {isExpanded && (
                <div className="px-4 sm:px-5 pb-4 sm:pb-5 border-t border-border pt-4">
                  <div className="relative">
                    {/* Vertical line */}
                    <div className="absolute left-[15px] top-2 bottom-2 w-px bg-border" />

                    <div className="space-y-4">
                      {seq.steps.map((step, j) => (
                        <div key={j} className="relative pl-10">
                          {/* Dot */}
                          <div className="absolute left-2 top-1.5">
                            {step.sent ? (
                              <CheckCircle2 className="w-[18px] h-[18px] text-green" />
                            ) : (
                              <Circle className="w-[18px] h-[18px] text-muted" />
                            )}
                          </div>

                          <div className={`p-3 rounded-xl border ${step.sent ? 'bg-white/[0.02] border-border' : 'bg-white/[0.01] border-border'}`}>
                            <div className="flex items-center gap-2 mb-1.5 flex-wrap">
                              <span className="text-xs font-semibold text-foreground">
                                Day {step.day > 0 ? `+${step.day}` : step.day}
                              </span>
                              <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-semibold border ${stepStyles[step.action]}`}>
                                {stepIcons[step.action]}
                                {stepLabels[step.action]}
                              </span>
                              <span className="text-[10px] text-muted bg-white/5 px-1.5 py-0.5 rounded">{step.channel}</span>
                              {step.sent && <span className="text-[10px] text-green font-medium">Sent</span>}
                            </div>
                            <p className="text-xs text-muted-fg leading-relaxed">{step.message}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}
            </div>
          )
        })}
      </div>
    </div>
  )
}
