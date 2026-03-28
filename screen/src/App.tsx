import { useState } from 'react'
import { Navbar } from '@/components/Navbar'
import { ApplicationsView } from '@/components/ApplicationsView'
import { ScreeningView } from '@/components/ScreeningView'
import { ReportsView } from '@/components/ReportsView'

type View = 'applications' | 'screening' | 'reports'

function App() {
  const [currentView, setCurrentView] = useState<View>('applications')
  const [selectedProperty, setSelectedProperty] = useState('bayshore')
  const [selectedApplicationId, setSelectedApplicationId] = useState<string | null>(null)

  const handleSelectApplication = (id: string) => {
    setSelectedApplicationId(id)
    setCurrentView('screening')
  }

  const handleBackFromScreening = () => {
    setCurrentView('applications')
    setSelectedApplicationId(null)
  }

  return (
    <div className="min-h-screen bg-background text-foreground">
      <Navbar currentView={currentView} onViewChange={setCurrentView} />

      {currentView === 'applications' && (
        <ApplicationsView
          selectedProperty={selectedProperty}
          onPropertyChange={setSelectedProperty}
          onSelectApplication={handleSelectApplication}
        />
      )}
      {currentView === 'screening' && (
        <ScreeningView
          selectedApplicationId={selectedApplicationId}
          selectedProperty={selectedProperty}
          onBack={handleBackFromScreening}
        />
      )}
      {currentView === 'reports' && (
        <ReportsView
          selectedProperty={selectedProperty}
          onPropertyChange={setSelectedProperty}
        />
      )}
    </div>
  )
}

export default App
