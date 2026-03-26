import { useState, useEffect } from 'react'
import { Shield, Menu, X, ChevronDown } from 'lucide-react'

type View = 'overview' | 'timeline' | 'documents'

interface NavbarProps {
  currentView: View
  onViewChange: (view: View) => void
}

interface Module {
  label: string
  href: string
  active: boolean
  comingSoon?: boolean
}

const modules: Module[] = [
  { label: 'Triage', href: 'https://triage.georg.miami', active: true },
  { label: 'Comply', href: '#', active: true },
  { label: 'Collect', href: 'https://collect.georg.miami', active: true },
  { label: 'Screen', href: '#', active: false, comingSoon: true },
  { label: 'Docs', href: '#', active: false, comingSoon: true },
  { label: 'Vendor', href: '#', active: false, comingSoon: true },
]

export function Navbar({ currentView, onViewChange }: NavbarProps) {
  const [scrolled, setScrolled] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)
  const [moduleMenuOpen, setModuleMenuOpen] = useState(false)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 10)
    window.addEventListener('scroll', onScroll)
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  // Close module menu when clicking outside
  useEffect(() => {
    if (!moduleMenuOpen) return
    const handler = () => setModuleMenuOpen(false)
    document.addEventListener('click', handler)
    return () => document.removeEventListener('click', handler)
  }, [moduleMenuOpen])

  const tabs: { key: View; label: string }[] = [
    { key: 'overview', label: 'Overview' },
    { key: 'timeline', label: 'Timeline' },
    { key: 'documents', label: 'Documents' },
  ]

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled
          ? 'bg-navy-deep/95 backdrop-blur-xl border-b border-border shadow-lg shadow-black/20'
          : 'bg-transparent'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="flex items-center justify-between h-16">
          {/* Logo + Module Switcher */}
          <div className="flex items-center gap-3">
            <a href="https://vestia.georg.miami" className="flex items-center gap-2.5 group">
              <div className="w-8 h-8 rounded-lg bg-teal/15 flex items-center justify-center border border-teal/25 group-hover:bg-teal/25 transition-colors">
                <Shield className="w-4 h-4 text-teal" />
              </div>
              <div className="flex items-baseline gap-1.5">
                <span className="font-serif text-xl font-semibold text-foreground tracking-wide">
                  Vestia
                </span>
                <span className="text-xs font-medium text-teal uppercase tracking-widest">
                  Comply
                </span>
              </div>
            </a>

            {/* Module switcher dropdown */}
            <div className="relative hidden sm:block">
              <button
                onClick={(e) => {
                  e.stopPropagation()
                  setModuleMenuOpen((prev) => !prev)
                }}
                className="flex items-center gap-1 px-2 py-1 rounded-lg text-xs text-muted-fg hover:text-foreground hover:bg-white/5 transition-colors border border-transparent hover:border-border"
              >
                Modules
                <ChevronDown className={`w-3 h-3 transition-transform ${moduleMenuOpen ? 'rotate-180' : ''}`} />
              </button>

              {moduleMenuOpen && (
                <div
                  className="absolute top-full left-0 mt-2 w-44 bg-card border border-border rounded-xl shadow-xl shadow-black/30 overflow-hidden"
                  onClick={(e) => e.stopPropagation()}
                >
                  {modules.map((mod) => (
                    <div key={mod.label}>
                      {mod.comingSoon ? (
                        <div className="flex items-center justify-between px-3 py-2.5 text-sm text-muted cursor-not-allowed">
                          <span>{mod.label}</span>
                          <span className="text-[9px] font-semibold bg-white/5 border border-border px-1.5 py-0.5 rounded text-muted uppercase tracking-wider">
                            Soon
                          </span>
                        </div>
                      ) : mod.href === '#' ? (
                        <div className="flex items-center justify-between px-3 py-2.5 text-sm text-teal bg-teal/5 border-l-2 border-teal cursor-default">
                          <span className="font-medium">{mod.label}</span>
                          <span className="text-[9px] font-semibold bg-teal/15 border border-teal/25 px-1.5 py-0.5 rounded text-teal uppercase tracking-wider">
                            Active
                          </span>
                        </div>
                      ) : (
                        <a
                          href={mod.href}
                          className="flex items-center px-3 py-2.5 text-sm text-muted-fg hover:text-foreground hover:bg-white/5 transition-colors"
                        >
                          {mod.label}
                        </a>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Tab Navigation */}
          <div className="hidden sm:flex items-center gap-1 bg-card/50 rounded-xl p-1 border border-border">
            {tabs.map((tab) => (
              <button
                key={tab.key}
                onClick={() => onViewChange(tab.key)}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                  currentView === tab.key
                    ? 'bg-teal/15 text-teal border border-teal/25'
                    : 'text-muted-fg hover:text-foreground hover:bg-white/5'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          <button
            onClick={() => setMenuOpen(!menuOpen)}
            className="sm:hidden text-muted-fg hover:text-foreground p-2"
          >
            {menuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>

        {/* Mobile menu */}
        {menuOpen && (
          <div className="sm:hidden pb-4 border-t border-border mt-2 pt-3 flex flex-col gap-1">
            {tabs.map((tab) => (
              <button
                key={tab.key}
                onClick={() => {
                  onViewChange(tab.key)
                  setMenuOpen(false)
                }}
                className={`px-4 py-2.5 rounded-lg text-sm font-medium text-left transition-all ${
                  currentView === tab.key
                    ? 'bg-teal/15 text-teal'
                    : 'text-muted-fg hover:text-foreground hover:bg-white/5'
                }`}
              >
                {tab.label}
              </button>
            ))}
            <div className="mt-2 pt-2 border-t border-border">
              <p className="px-4 text-[10px] uppercase tracking-wider text-muted mb-1">Modules</p>
              {modules.map((mod) =>
                mod.comingSoon ? (
                  <div key={mod.label} className="flex items-center justify-between px-4 py-2 text-sm text-muted">
                    <span>{mod.label}</span>
                    <span className="text-[9px] text-muted uppercase tracking-wider">Soon</span>
                  </div>
                ) : mod.href === '#' ? (
                  <div key={mod.label} className="px-4 py-2 text-sm text-teal font-medium">
                    {mod.label} (current)
                  </div>
                ) : (
                  <a
                    key={mod.label}
                    href={mod.href}
                    className="block px-4 py-2 text-sm text-muted-fg hover:text-foreground"
                  >
                    {mod.label}
                  </a>
                )
              )}
            </div>
          </div>
        )}
      </div>
    </nav>
  )
}
