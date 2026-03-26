import { Building2 } from 'lucide-react'
import { properties } from '@/data/mock'

interface Props {
  selectedProperty: string
  onPropertyChange: (id: string) => void
}

export function PropertySelector({ selectedProperty, onPropertyChange }: Props) {
  const current = properties.find(p => p.id === selectedProperty)
  return (
    <div className="flex items-center gap-3 bg-card border border-border rounded-xl p-3 mb-6">
      <Building2 className="w-5 h-5 text-green flex-shrink-0" />
      <div className="flex-1 min-w-0">
        <select
          value={selectedProperty}
          onChange={(e) => onPropertyChange(e.target.value)}
          className="w-full bg-transparent text-sm font-medium text-foreground outline-none cursor-pointer"
        >
          {properties.map(p => (
            <option key={p.id} value={p.id}>{p.name} ({p.units} units)</option>
          ))}
        </select>
        {current && (
          <p className="text-[10px] text-muted mt-0.5">{current.address}</p>
        )}
      </div>
    </div>
  )
}
