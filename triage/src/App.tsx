import { useState } from 'react'
import { Navbar } from '@/components/Navbar'
import { TenantView } from '@/components/TenantView'
import { TriageView } from '@/components/TriageView'
import { DashboardView } from '@/components/DashboardView'

type View = 'tenant' | 'triage' | 'dashboard'

function App() {
  const [currentView, setCurrentView] = useState<View>('tenant')
  const [selectedProperty, setSelectedProperty] = useState('bayshore')

  return (
    <div className="min-h-screen bg-background text-foreground">
      <Navbar currentView={currentView} onViewChange={setCurrentView} />

      {currentView === 'tenant' && (
        <TenantView
          onTriageStart={() => setCurrentView('triage')}
          selectedProperty={selectedProperty}
          onPropertyChange={setSelectedProperty}
        />
      )}
      {currentView === 'triage' && (
        <TriageView onComplete={() => setCurrentView('dashboard')} />
      )}
      {currentView === 'dashboard' && (
        <DashboardView
          selectedProperty={selectedProperty}
          onPropertyChange={setSelectedProperty}
        />
      )}
    </div>
  )
}

export default App
