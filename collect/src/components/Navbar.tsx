import { useState, useEffect, useRef } from 'react'
import { DollarSign, Menu, X, ChevronDown, Grid3X3 } from 'lucide-react'

type View = 'payments' | 'ledger' | 'automations'

interface NavbarProps {
  currentView: View
  onViewChange: (view: View) => void
}

const modules = [
  { label: 'Triage', href: 'https://triage.georg.miami', current: false },
  { label: 'Comply', href: 'https://comply.georg.miami', current: false },
  { label: 'Collect', href: '#', current: true },
  { label: 'Screen', href: '#', current: false, soon: true },
  { label: 'Docs', href: '#', current: false, soon: true },
  { label: 'Vendor', href: '#', current: false, soon: true },
]

export function Navbar({ currentView, onViewChange }: NavbarProps) {
  const [scrolled, setScrolled] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)
  const [modulesOpen, setModulesOpen] = useState(false)
  const modulesRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 10)
    window.addEventListener('scroll', onScroll)
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (modulesRef.current && !modulesRef.current.contains(e.target as Node)) {
        setModulesOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  const tabs: { key: View; label: string }[] = [
    { key: 'payments', label: 'Payments' },
    { key: 'ledger', label: 'Ledger' },
    { key: 'automations', label: 'Automations' },
  ]

  return (
    <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${scrolled ? 'bg-navy-deep/95 backdrop-blur-xl border-b border-border shadow-lg shadow-black/20' : 'bg-transparent'}`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="flex items-center justify-between h-16">
          {/* Logo + module switcher */}
          <div className="flex items-center gap-3">
            <a href="https://vestia.georg.miami" className="flex items-center gap-2.5 group">
              <div className="w-8 h-8 rounded-lg bg-green/15 flex items-center justify-center border border-green/25 group-hover:bg-green/25 transition-colors">
                <DollarSign className="w-4 h-4 text-green" />
              </div>
              <div className="flex items-baseline gap-1.5">
                <span className="font-serif text-xl font-semibold text-foreground tracking-wide">Vestia</span>
                <span className="text-xs font-medium text-green uppercase tracking-widest">Collect</span>
              </div>
            </a>

            {/* Module switcher dropdown */}
            <div className="relative hidden sm:block" ref={modulesRef}>
              <button
                onClick={() => setModulesOpen(!modulesOpen)}
                className="flex items-center gap-1 px-2 py-1 rounded-lg text-xs text-muted-fg hover:text-foreground hover:bg-white/5 transition-colors border border-transparent hover:border-border"
              >
                <Grid3X3 className="w-3.5 h-3.5" />
                <ChevronDown className={`w-3 h-3 transition-transform ${modulesOpen ? 'rotate-180' : ''}`} />
              </button>

              {modulesOpen && (
                <div className="absolute top-full left-0 mt-2 w-52 bg-card border border-border rounded-xl shadow-xl shadow-black/30 overflow-hidden">
                  <div className="px-3 py-2 border-b border-border">
                    <p className="text-[10px] text-muted uppercase tracking-wider font-medium">Vestia Modules</p>
                  </div>
                  <div className="py-1">
                    {modules.map((mod) => (
                      mod.current ? (
                        <div key={mod.label} className="flex items-center justify-between px-3 py-2 bg-green/10">
                          <span className="text-sm font-medium text-green">{mod.label}</span>
                          <span className="text-[10px] text-green/70 bg-green/10 px-1.5 py-0.5 rounded font-medium">Current</span>
                        </div>
                      ) : mod.soon ? (
                        <div key={mod.label} className="flex items-center justify-between px-3 py-2 opacity-40 cursor-not-allowed">
                          <span className="text-sm text-muted-fg">{mod.label}</span>
                          <span className="text-[10px] text-muted bg-white/5 px-1.5 py-0.5 rounded">Soon</span>
                        </div>
                      ) : (
                        <a
                          key={mod.label}
                          href={mod.href}
                          className="flex items-center px-3 py-2 text-sm text-foreground hover:bg-white/5 transition-colors"
                          onClick={() => setModulesOpen(false)}
                        >
                          {mod.label}
                        </a>
                      )
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* View tabs */}
          <div className="hidden sm:flex items-center gap-1 bg-card/50 rounded-xl p-1 border border-border">
            {tabs.map((tab) => (
              <button
                key={tab.key}
                onClick={() => onViewChange(tab.key)}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${currentView === tab.key ? 'bg-green/15 text-green border border-green/25' : 'text-muted-fg hover:text-foreground hover:bg-white/5'}`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          <button onClick={() => setMenuOpen(!menuOpen)} className="sm:hidden text-muted-fg hover:text-foreground p-2">
            {menuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>

        {menuOpen && (
          <div className="sm:hidden pb-4 border-t border-border mt-2 pt-3 flex flex-col gap-1">
            {tabs.map((tab) => (
              <button key={tab.key} onClick={() => { onViewChange(tab.key); setMenuOpen(false) }} className={`px-4 py-2.5 rounded-lg text-sm font-medium text-left transition-all ${currentView === tab.key ? 'bg-green/15 text-green' : 'text-muted-fg hover:text-foreground hover:bg-white/5'}`}>
                {tab.label}
              </button>
            ))}
            <div className="border-t border-border mt-2 pt-2">
              <p className="px-4 py-1 text-[10px] text-muted uppercase tracking-wider">Other Modules</p>
              {modules.filter(m => !m.current).map((mod) => (
                mod.soon ? (
                  <div key={mod.label} className="px-4 py-2 text-sm text-muted-fg opacity-40 flex items-center justify-between">
                    <span>{mod.label}</span>
                    <span className="text-[10px]">Soon</span>
                  </div>
                ) : (
                  <a key={mod.label} href={mod.href} className="block px-4 py-2 text-sm text-foreground hover:bg-white/5 rounded-lg transition-colors">
                    {mod.label}
                  </a>
                )
              ))}
            </div>
          </div>
        )}
      </div>
    </nav>
  )
}
