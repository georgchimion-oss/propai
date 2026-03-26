import { useState } from 'react'
import { Navbar } from '@/components/Navbar'
import { OverviewView } from '@/components/OverviewView'
import { TimelineView } from '@/components/TimelineView'
import { DocumentsView } from '@/components/DocumentsView'

type View = 'overview' | 'timeline' | 'documents'

function App() {
  const [currentView, setCurrentView] = useState<View>('overview')
  const [selectedProperty, setSelectedProperty] = useState('bayshore')

  return (
    <div className="min-h-screen bg-background text-foreground">
      <Navbar currentView={currentView} onViewChange={setCurrentView} />

      {currentView === 'overview' && (
        <OverviewView
          selectedProperty={selectedProperty}
          onPropertyChange={setSelectedProperty}
        />
      )}
      {currentView === 'timeline' && (
        <TimelineView
          selectedProperty={selectedProperty}
          onPropertyChange={setSelectedProperty}
        />
      )}
      {currentView === 'documents' && (
        <DocumentsView
          selectedProperty={selectedProperty}
          onPropertyChange={setSelectedProperty}
        />
      )}
    </div>
  )
}

export default App
