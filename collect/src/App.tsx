import { useState } from 'react'
import { Navbar } from '@/components/Navbar'
import { PaymentsView } from '@/components/PaymentsView'
import { LedgerView } from '@/components/LedgerView'
import { AutomationsView } from '@/components/AutomationsView'

type View = 'payments' | 'ledger' | 'automations'

function App() {
  const [currentView, setCurrentView] = useState<View>('payments')
  const [selectedProperty, setSelectedProperty] = useState('bayshore')

  return (
    <div className="min-h-screen bg-background text-foreground">
      <Navbar currentView={currentView} onViewChange={setCurrentView} />

      {currentView === 'payments' && (
        <PaymentsView selectedProperty={selectedProperty} onPropertyChange={setSelectedProperty} />
      )}
      {currentView === 'ledger' && (
        <LedgerView selectedProperty={selectedProperty} onPropertyChange={setSelectedProperty} />
      )}
      {currentView === 'automations' && (
        <AutomationsView selectedProperty={selectedProperty} onPropertyChange={setSelectedProperty} />
      )}
    </div>
  )
}

export default App
