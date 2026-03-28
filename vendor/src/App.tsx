import { useState } from 'react'
import { Navbar } from '@/components/Navbar'
import { RFPsView } from '@/components/RFPsView'
import { BidsView } from '@/components/BidsView'
import { VendorsView } from '@/components/VendorsView'

type View = 'rfps' | 'bids' | 'vendors'

function App() {
  const [currentView, setCurrentView] = useState<View>('rfps')
  const [selectedProperty, setSelectedProperty] = useState('bayshore')
  const [selectedRFPId, setSelectedRFPId] = useState<string | null>(null)

  function handleSelectRFP(rfpId: string) {
    setSelectedRFPId(rfpId)
    setCurrentView('bids')
  }

  return (
    <div className="min-h-screen bg-background text-foreground">
      <Navbar currentView={currentView} onViewChange={setCurrentView} />

      {currentView === 'rfps' && (
        <RFPsView
          selectedProperty={selectedProperty}
          onPropertyChange={setSelectedProperty}
          onSelectRFP={handleSelectRFP}
        />
      )}
      {currentView === 'bids' && (
        <BidsView
          selectedProperty={selectedProperty}
          onPropertyChange={(id) => {
            setSelectedProperty(id)
            setSelectedRFPId(null)
          }}
          selectedRFPId={selectedRFPId}
          onSelectRFP={setSelectedRFPId}
        />
      )}
      {currentView === 'vendors' && (
        <VendorsView />
      )}
    </div>
  )
}

export default App
