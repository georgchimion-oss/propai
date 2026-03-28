import { Building2 } from 'lucide-react'
import { properties } from '@/data/mock'

interface PropertySelectorProps {
  selectedProperty: string
  onPropertyChange: (id: string) => void
}

export function PropertySelector({ selectedProperty, onPropertyChange }: PropertySelectorProps) {
  const property = properties.find((p) => p.id === selectedProperty)

  return (
    <div className="flex items-center gap-3">
      <div className="w-9 h-9 rounded-lg bg-purple/15 flex items-center justify-center border border-purple/25 flex-shrink-0">
        <Building2 className="w-4 h-4 text-purple" />
      </div>
      <div className="flex flex-col">
        <select
          value={selectedProperty}
          onChange={(e) => onPropertyChange(e.target.value)}
          className="bg-transparent text-foreground text-sm font-medium focus:outline-none cursor-pointer appearance-none pr-4"
        >
          {properties.map((p) => (
            <option key={p.id} value={p.id}>
              {p.name}
            </option>
          ))}
        </select>
        {property && (
          <span className="text-xs text-muted-fg">{property.units} units · Built {property.yearBuilt}</span>
        )}
      </div>
    </div>
  )
}
