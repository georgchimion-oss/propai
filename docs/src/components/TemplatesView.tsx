import { FileText, Wand2, Clock, BarChart2 } from 'lucide-react'
import { templates } from '@/data/mock'

const categoryColors: Record<string, string> = {
  'Lease': 'text-blue bg-blue/10 border-blue/20',
  'Amendment': 'text-teal bg-teal/10 border-teal/20',
  'Notice': 'text-orange bg-orange/10 border-orange/20',
  'Meeting Minutes': 'text-gold bg-gold/10 border-gold/20',
  'Financial Report': 'text-green bg-green/10 border-green/20',
}

const categoryIcons: Record<string, string> = {
  'Lease': 'bg-blue/10 border-blue/20 text-blue',
  'Amendment': 'bg-teal/10 border-teal/20 text-teal',
  'Notice': 'bg-orange/10 border-orange/20 text-orange',
  'Meeting Minutes': 'bg-gold/10 border-gold/20 text-gold',
  'Financial Report': 'bg-green/10 border-green/20 text-green',
}

function getCategoryIconClass(category: string): string {
  return categoryIcons[category] ?? 'bg-white/5 border-border text-muted-fg'
}

function getCategoryBadgeClass(category: string): string {
  return categoryColors[category] ?? 'text-muted-fg bg-white/5 border-border'
}

export function TemplatesView() {
  function formatDate(iso: string) {
    return new Date(iso).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 pt-24 pb-12">
      <div className="mb-8">
        <h1 className="font-serif text-3xl font-semibold text-foreground mb-1">
          Document Templates
        </h1>
        <p className="text-muted-fg text-sm">
          Pre-built Florida-compliant templates. Generate a document in seconds.
        </p>
      </div>

      {/* Stats strip */}
      <div className="grid grid-cols-3 gap-4 mb-8">
        <div className="bg-card border border-border rounded-xl p-4">
          <p className="text-xs text-muted-fg mb-1">Total Templates</p>
          <p className="font-serif text-2xl font-semibold text-foreground">{templates.length}</p>
        </div>
        <div className="bg-card border border-border rounded-xl p-4">
          <p className="text-xs text-muted-fg mb-1">Total Generated</p>
          <p className="font-serif text-2xl font-semibold text-blue">
            {templates.reduce((sum, t) => sum + t.timesUsed, 0)}
          </p>
        </div>
        <div className="bg-card border border-border rounded-xl p-4">
          <p className="text-xs text-muted-fg mb-1">FL-Compliant</p>
          <p className="font-serif text-2xl font-semibold text-green">100%</p>
        </div>
      </div>

      {/* Template Grid */}
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {templates.map((tmpl) => (
          <div
            key={tmpl.id}
            className="bg-card border border-border rounded-xl p-5 hover:border-blue/30 transition-all group flex flex-col"
          >
            {/* Icon */}
            <div className={`w-10 h-10 rounded-lg border flex items-center justify-center mb-4 ${getCategoryIconClass(tmpl.category)}`}>
              <FileText className="w-5 h-5" />
            </div>

            {/* Name + badge */}
            <div className="flex items-start justify-between gap-2 mb-2">
              <h3 className="text-sm font-semibold text-foreground group-hover:text-blue transition-colors leading-snug">
                {tmpl.name}
              </h3>
              <span className={`text-[10px] font-medium px-1.5 py-0.5 rounded-md border flex-shrink-0 ${getCategoryBadgeClass(tmpl.category)}`}>
                {tmpl.category}
              </span>
            </div>

            {/* Description */}
            <p className="text-xs text-muted-fg leading-relaxed flex-1 mb-4">
              {tmpl.description}
            </p>

            {/* Meta */}
            <div className="flex items-center gap-3 mb-4">
              <div className="flex items-center gap-1.5 text-[11px] text-muted-fg">
                <BarChart2 className="w-3 h-3" />
                <span>{tmpl.timesUsed} uses</span>
              </div>
              <div className="flex items-center gap-1.5 text-[11px] text-muted-fg">
                <Clock className="w-3 h-3" />
                <span>{formatDate(tmpl.lastUpdated)}</span>
              </div>
            </div>

            {/* Generate button */}
            <button className="w-full flex items-center justify-center gap-2 bg-blue/15 hover:bg-blue/25 text-blue border border-blue/25 hover:border-blue/40 text-xs font-medium py-2.5 rounded-lg transition-all">
              <Wand2 className="w-3.5 h-3.5" />
              Generate
            </button>
          </div>
        ))}
      </div>
    </div>
  )
}
