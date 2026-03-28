import { useState } from 'react'
import { Navbar } from '@/components/Navbar'
import { DocumentsView } from '@/components/DocumentsView'
import { TemplatesView } from '@/components/TemplatesView'
import { SignaturesView } from '@/components/SignaturesView'

type View = 'documents' | 'templates' | 'signatures'

function App() {
  const [currentView, setCurrentView] = useState<View>('documents')
  const [selectedProperty, setSelectedProperty] = useState('bayshore')

  return (
    <div className="min-h-screen bg-background text-foreground">
      <Navbar currentView={currentView} onViewChange={setCurrentView} />

      {currentView === 'documents' && (
        <DocumentsView
          selectedProperty={selectedProperty}
          onPropertyChange={setSelectedProperty}
        />
      )}
      {currentView === 'templates' && (
        <TemplatesView />
      )}
      {currentView === 'signatures' && (
        <SignaturesView
          selectedProperty={selectedProperty}
          onPropertyChange={setSelectedProperty}
        />
      )}
    </div>
  )
}

export default App
