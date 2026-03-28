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
      <Building2 className="w-5 h-5 text-blue flex-shrink-0" />
      <select
        value={selectedProperty}
        onChange={(e) => onPropertyChange(e.target.value)}
        className="flex-1 bg-transparent text-sm font-medium text-foreground outline-none cursor-pointer"
      >
        {properties.map(p => (
          <option key={p.id} value={p.id}>{p.name}</option>
        ))}
      </select>
      {current && (
        <span className="text-xs text-muted-fg hidden sm:block">{current.units} units</span>
      )}
    </div>
  )
}
