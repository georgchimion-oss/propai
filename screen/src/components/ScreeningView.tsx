import { useState } from 'react'
import {
  ArrowLeft,
  CheckCircle2,
  XCircle,
  Clock,
  ShieldCheck,
  ShieldAlert,
  ShieldX,
  TrendingUp,
  DollarSign,
  Briefcase,
  Brain,
  Check,
  X,
} from 'lucide-react'
import { applications } from '@/data/mock'
import type { ApplicationStatus } from '@/data/types'

interface ScreeningViewProps {
  selectedApplicationId: string | null
  selectedProperty: string
  onBack: () => void
}

const statusConfig: Record<ApplicationStatus, { label: string; text: string; bg: string; border: string }> = {
  pending_review: { label: 'Pending Review', text: 'text-orange', bg: 'bg-orange/10', border: 'border-orange/20' },
  in_progress:    { label: 'In Progress',    text: 'text-teal',   bg: 'bg-teal/10',   border: 'border-teal/20'   },
  approved:       { label: 'Approved',        text: 'text-green',  bg: 'bg-green/10',  border: 'border-green/20'  },
  denied:         { label: 'Denied',          text: 'text-red',    bg: 'bg-red/10',    border: 'border-red/20'    },
}

function CreditGauge({ score }: { score: number }) {
  const min = 300
  const max = 850
  const pct = ((score - min) / (max - min)) * 100

  const color =
    score >= 720 ? 'text-green' :
    score >= 660 ? 'text-teal' :
    score >= 580 ? 'text-orange' :
    'text-red'

  const trackColor =
    score >= 720 ? 'bg-green' :
    score >= 660 ? 'bg-teal' :
    score >= 580 ? 'bg-orange' :
    'bg-red'

  const label =
    score >= 720 ? 'Excellent' :
    score >= 660 ? 'Good' :
    score >= 580 ? 'Fair' :
    'Poor'

  return (
    <div className="bg-card/50 border border-border rounded-2xl p-5">
      <div className="flex items-center gap-2 mb-4">
        <TrendingUp className="w-4 h-4 text-purple" />
        <span className="text-xs font-medium text-muted-fg uppercase tracking-wide">Credit Score</span>
      </div>
      <div className={`font-serif text-4xl font-bold ${color} mb-1`}>{score}</div>
      <div className="text-xs text-muted-fg mb-4">{label} · Range 300–850</div>
      <div className="h-2 bg-white/5 rounded-full overflow-hidden">
        <div
          className={`h-full rounded-full transition-all duration-700 ${trackColor}`}
          style={{ width: `${pct}%` }}
        />
      </div>
      <div className="flex justify-between mt-1.5 text-[10px] text-muted-fg">
        <span>Poor 300</span>
        <span>Fair 580</span>
        <span>Good 660</span>
        <span>Excellent 720+</span>
      </div>
    </div>
  )
}

type CheckResult = 'clear' | 'flag' | 'pending' | 'verified' | 'unverified'

function CheckRow({
  icon: Icon,
  label,
  result,
  detail,
}: {
  icon: React.ElementType
  label: string
  result: CheckResult
  detail?: string
}) {
  const config: Record<CheckResult, { icon: React.ElementType; text: string; bg: string; border: string; tag: string }> = {
    clear:      { icon: CheckCircle2, text: 'text-green',  bg: 'bg-green/10',  border: 'border-green/15',  tag: 'Clear' },
    verified:   { icon: CheckCircle2, text: 'text-green',  bg: 'bg-green/10',  border: 'border-green/15',  tag: 'Verified' },
    flag:       { icon: XCircle,      text: 'text-red',    bg: 'bg-red/10',    border: 'border-red/15',    tag: 'Flag' },
    pending:    { icon: Clock,        text: 'text-orange', bg: 'bg-orange/10', border: 'border-orange/15', tag: 'Pending' },
    unverified: { icon: XCircle,      text: 'text-red',    bg: 'bg-red/10',    border: 'border-red/15',    tag: 'Unverified' },
  }
  const c = config[result]
  const StatusIcon = c.icon

  return (
    <div className={`flex items-start gap-3 p-3.5 rounded-xl border ${c.bg} ${c.border}`}>
      <div className="mt-0.5 flex-shrink-0">
        <Icon className="w-4 h-4 text-muted-fg" />
      </div>
      <div className="flex-1 min-w-0">
        <div className="text-sm font-medium text-foreground">{label}</div>
        {detail && <div className="text-xs text-muted-fg mt-0.5">{detail}</div>}
      </div>
      <div className={`flex items-center gap-1 text-xs font-medium ${c.text}`}>
        <StatusIcon className="w-3.5 h-3.5" />
        {c.tag}
      </div>
    </div>
  )
}

export function ScreeningView({ selectedApplicationId, selectedProperty, onBack }: ScreeningViewProps) {
  const propertyApps = applications.filter((a) => a.propertyId === selectedProperty)
  const app = selectedApplicationId
    ? applications.find((a) => a.id === selectedApplicationId)
    : propertyApps[0]

  const [activeAppId, setActiveAppId] = useState(app?.id ?? '')

  const displayApp = applications.find((a) => a.id === activeAppId) ?? app

  if (!displayApp) {
    return (
      <div className="min-h-screen pt-24 pb-12 px-4 flex items-center justify-center">
        <p className="text-muted-fg">No applications available for this property.</p>
      </div>
    )
  }

  const statusCfg = statusConfig[displayApp.status]
  const ratio = (displayApp.monthlyIncome / displayApp.monthlyRent).toFixed(1)
  const ratioNum = displayApp.monthlyIncome / displayApp.monthlyRent
  const ratioColor = ratioNum >= 2.5 ? 'text-green' : ratioNum >= 2.0 ? 'text-orange' : 'text-red'

  const riskBarColor =
    displayApp.aiRiskLevel === 'low' ? 'bg-green' :
    displayApp.aiRiskLevel === 'medium' ? 'bg-orange' :
    'bg-red'

  const riskTextColor =
    displayApp.aiRiskLevel === 'low' ? 'text-green' :
    displayApp.aiRiskLevel === 'medium' ? 'text-orange' :
    'text-red'

  return (
    <div className="min-h-screen pt-24 pb-12 px-4 sm:px-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex items-center gap-3 mb-6">
          <button
            onClick={onBack}
            className="flex items-center gap-1.5 text-sm text-muted-fg hover:text-foreground transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            Applications
          </button>
          <span className="text-muted-fg">/</span>
          <span className="text-sm text-foreground font-medium">{displayApp.applicantName}</span>
        </div>

        {/* Applicant selector (if multiple for property) */}
        {propertyApps.length > 1 && (
          <div className="flex flex-wrap gap-2 mb-6">
            {propertyApps.map((a) => (
              <button
                key={a.id}
                onClick={() => setActiveAppId(a.id)}
                className={`px-3 py-1.5 rounded-lg text-xs font-medium border transition-all ${
                  activeAppId === a.id
                    ? 'bg-purple/15 text-purple border-purple/25'
                    : 'bg-card/50 text-muted-fg border-border hover:text-foreground hover:bg-white/5'
                }`}
              >
                {a.applicantName} · {a.unit}
              </button>
            ))}
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
          {/* Left column */}
          <div className="lg:col-span-1 flex flex-col gap-5">
            {/* Applicant card */}
            <div className="bg-card/50 border border-border rounded-2xl p-5">
              <div className="flex items-start justify-between mb-4">
                <div className="w-12 h-12 rounded-xl bg-purple/15 border border-purple/20 flex items-center justify-center">
                  <span className="text-purple font-semibold font-serif text-lg">
                    {displayApp.applicantName.split(' ').map((n) => n[0]).join('')}
                  </span>
                </div>
                <div className={`flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-medium border ${statusCfg.bg} ${statusCfg.text} ${statusCfg.border}`}>
                  {statusCfg.label}
                </div>
              </div>
              <h2 className="font-serif text-xl font-semibold text-foreground mb-0.5">
                {displayApp.applicantName}
              </h2>
              <p className="text-sm text-muted-fg mb-4">Unit {displayApp.unit} · {displayApp.email}</p>
              <div className="flex flex-col gap-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-muted-fg">Phone</span>
                  <span className="text-foreground">{displayApp.phone}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-fg">Submitted</span>
                  <span className="text-foreground">{displayApp.dateSubmitted}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-fg">Application ID</span>
                  <span className="text-foreground font-mono text-xs">{displayApp.id}</span>
                </div>
              </div>
            </div>

            {/* Income card */}
            <div className="bg-card/50 border border-border rounded-2xl p-5">
              <div className="flex items-center gap-2 mb-4">
                <DollarSign className="w-4 h-4 text-purple" />
                <span className="text-xs font-medium text-muted-fg uppercase tracking-wide">Income & Rent</span>
              </div>
              <div className="flex flex-col gap-3">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-muted-fg">Monthly Income</span>
                  <span className="text-sm font-medium text-foreground">
                    ${displayApp.monthlyIncome.toLocaleString()}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-muted-fg">Monthly Rent</span>
                  <span className="text-sm font-medium text-foreground">
                    ${displayApp.monthlyRent.toLocaleString()}
                  </span>
                </div>
                <div className="border-t border-border pt-3 flex justify-between items-center">
                  <span className="text-sm text-muted-fg">Income-to-Rent</span>
                  <span className={`text-sm font-bold font-serif ${ratioColor}`}>{ratio}x</span>
                </div>
                <div className={`text-xs mt-1 ${ratioNum >= 2.5 ? 'text-green' : 'text-red'}`}>
                  {ratioNum >= 2.5 ? 'Meets 2.5x minimum requirement' : 'Below 2.5x minimum requirement'}
                </div>
              </div>
            </div>

            {/* Employment card */}
            <div className="bg-card/50 border border-border rounded-2xl p-5">
              <div className="flex items-center gap-2 mb-4">
                <Briefcase className="w-4 h-4 text-purple" />
                <span className="text-xs font-medium text-muted-fg uppercase tracking-wide">Employment</span>
              </div>
              <div className="flex flex-col gap-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-muted-fg">Employer</span>
                  <span className="text-foreground text-right max-w-[60%]">{displayApp.employerName}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-fg">Tenure</span>
                  <span className="text-foreground">
                    {displayApp.yearsEmployed > 0
                      ? `${displayApp.yearsEmployed} yr${displayApp.yearsEmployed !== 1 ? 's' : ''}`
                      : 'New / TBD'}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-fg">Prior Evictions</span>
                  <span className={displayApp.priorEvictions > 0 ? 'text-red font-medium' : 'text-green'}>
                    {displayApp.priorEvictions}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Right column */}
          <div className="lg:col-span-2 flex flex-col gap-5">
            {/* Credit gauge */}
            <CreditGauge score={displayApp.creditScore} />

            {/* Background checks */}
            <div className="bg-card/50 border border-border rounded-2xl p-5">
              <div className="flex items-center gap-2 mb-4">
                <ShieldCheck className="w-4 h-4 text-purple" />
                <span className="text-xs font-medium text-muted-fg uppercase tracking-wide">Background Checks</span>
              </div>
              <div className="flex flex-col gap-2.5">
                <CheckRow
                  icon={ShieldAlert}
                  label="Criminal History"
                  result={displayApp.backgroundCheck.criminal}
                  detail={displayApp.backgroundCheck.criminalDetail}
                />
                <CheckRow
                  icon={ShieldX}
                  label="Eviction History"
                  result={displayApp.backgroundCheck.eviction}
                  detail={displayApp.backgroundCheck.evictionDetail}
                />
                <CheckRow
                  icon={Briefcase}
                  label="Employment Verification"
                  result={displayApp.backgroundCheck.employment}
                  detail={displayApp.backgroundCheck.employmentDetail}
                />
              </div>
            </div>

            {/* AI Risk Assessment */}
            <div className="bg-card/50 border border-border rounded-2xl p-5">
              <div className="flex items-center gap-2 mb-4">
                <Brain className="w-4 h-4 text-purple" />
                <span className="text-xs font-medium text-muted-fg uppercase tracking-wide">AI Risk Assessment</span>
              </div>

              <div className="flex items-center justify-between mb-3">
                <div>
                  <div className={`font-serif text-3xl font-bold ${riskTextColor}`}>
                    {displayApp.aiRiskScore}
                    <span className="text-base text-muted-fg font-sans font-normal">/100</span>
                  </div>
                  <div className={`text-xs font-medium ${riskTextColor} mt-0.5 capitalize`}>
                    {displayApp.aiRiskLevel} Risk
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-xs text-muted-fg">Screening Score</div>
                  <div className={`font-serif text-2xl font-bold ${
                    displayApp.screeningScore >= 80 ? 'text-green' :
                    displayApp.screeningScore >= 60 ? 'text-teal' :
                    displayApp.screeningScore >= 40 ? 'text-orange' :
                    'text-red'
                  }`}>
                    {displayApp.screeningScore}
                  </div>
                </div>
              </div>

              <div className="h-2 bg-white/5 rounded-full overflow-hidden mb-4">
                <div
                  className={`h-full rounded-full transition-all duration-700 ${riskBarColor}`}
                  style={{ width: `${displayApp.aiRiskScore}%` }}
                />
              </div>

              <p className="text-sm text-muted-fg leading-relaxed mb-5 italic">
                "{displayApp.aiReasoning}"
              </p>

              {/* Approve / Deny */}
              {(displayApp.status === 'pending_review' || displayApp.status === 'in_progress') && (
                <div className="flex gap-3">
                  <button className="flex-1 flex items-center justify-center gap-2 py-3 rounded-xl bg-green/15 border border-green/25 text-green text-sm font-medium hover:bg-green/25 transition-all">
                    <Check className="w-4 h-4" />
                    Approve Application
                  </button>
                  <button className="flex-1 flex items-center justify-center gap-2 py-3 rounded-xl bg-red/10 border border-red/20 text-red text-sm font-medium hover:bg-red/20 transition-all">
                    <X className="w-4 h-4" />
                    Deny Application
                  </button>
                </div>
              )}
              {displayApp.status === 'approved' && (
                <div className="flex items-center gap-2 p-3 rounded-xl bg-green/10 border border-green/20">
                  <CheckCircle2 className="w-4 h-4 text-green flex-shrink-0" />
                  <span className="text-sm text-green font-medium">Application approved</span>
                </div>
              )}
              {displayApp.status === 'denied' && (
                <div className="flex items-center gap-2 p-3 rounded-xl bg-red/10 border border-red/20">
                  <XCircle className="w-4 h-4 text-red flex-shrink-0" />
                  <span className="text-sm text-red font-medium">Application denied</span>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
