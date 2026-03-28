import { useState, useEffect, useRef } from 'react'
import { Shield, Menu, X, ChevronDown, ExternalLink } from 'lucide-react'

type View = 'applications' | 'screening' | 'reports'

interface NavbarProps {
  currentView: View
  onViewChange: (view: View) => void
}

const moduleLinks = [
  { name: 'Triage', url: 'https://triage.georg.miami' },
  { name: 'Comply', url: 'https://comply.georg.miami' },
  { name: 'Collect', url: 'https://collect.georg.miami' },
  { name: 'Screen', url: '#', current: true },
  { name: 'Docs', url: '', soon: true },
  { name: 'Vendor', url: '', soon: true },
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
    { key: 'applications', label: 'Applications' },
    { key: 'screening', label: 'Screening' },
    { key: 'reports', label: 'Reports' },
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
          {/* Logo */}
          <a
            href="https://vestia.georg.miami"
            className="flex items-center gap-2.5 group"
          >
            <div className="w-8 h-8 rounded-lg bg-purple/15 flex items-center justify-center border border-purple/25 group-hover:bg-purple/25 transition-colors">
              <Shield className="w-4 h-4 text-purple" />
            </div>
            <div className="flex items-baseline gap-1.5">
              <span className="font-serif text-xl font-semibold text-foreground tracking-wide">
                Vestia
              </span>
              <span className="text-xs font-medium text-purple uppercase tracking-widest">
                Screen
              </span>
            </div>
          </a>

          {/* Right side: tabs + module switcher */}
          <div className="hidden sm:flex items-center gap-3">
            {/* Desktop Tabs */}
            <div className="flex items-center gap-1 bg-card/50 rounded-xl p-1 border border-border">
              {tabs.map((tab) => (
                <button
                  key={tab.key}
                  onClick={() => onViewChange(tab.key)}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                    currentView === tab.key
                      ? 'bg-purple/15 text-purple border border-purple/25'
                      : 'text-muted-fg hover:text-foreground hover:bg-white/5'
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>

            {/* Module Switcher */}
            <div className="relative" ref={modulesRef}>
              <button
                onClick={() => setModulesOpen(!modulesOpen)}
                className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-medium text-muted-fg hover:text-foreground bg-card/50 border border-border hover:border-purple/20 transition-all"
              >
                Modules
                <ChevronDown
                  className={`w-3.5 h-3.5 transition-transform duration-200 ${modulesOpen ? 'rotate-180' : ''}`}
                />
              </button>

              {modulesOpen && (
                <div className="absolute right-0 top-full mt-2 w-44 bg-card border border-border rounded-xl shadow-xl shadow-black/30 overflow-hidden z-50">
                  {moduleLinks.map((mod) => (
                    <div key={mod.name}>
                      {mod.current ? (
                        <div className="flex items-center justify-between px-3 py-2.5 bg-purple/10">
                          <span className="text-sm font-medium text-purple">{mod.name}</span>
                          <span className="text-[10px] text-purple/70 bg-purple/10 px-1.5 py-0.5 rounded-md font-medium">
                            Active
                          </span>
                        </div>
                      ) : mod.soon ? (
                        <div className="flex items-center justify-between px-3 py-2.5 opacity-40 cursor-not-allowed">
                          <span className="text-sm text-muted-fg">{mod.name}</span>
                          <span className="text-[10px] text-muted-fg bg-white/5 px-1.5 py-0.5 rounded-md">
                            Soon
                          </span>
                        </div>
                      ) : (
                        <a
                          href={mod.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          onClick={() => setModulesOpen(false)}
                          className="flex items-center justify-between px-3 py-2.5 hover:bg-white/5 transition-colors group"
                        >
                          <span className="text-sm text-muted-fg group-hover:text-foreground transition-colors">
                            {mod.name}
                          </span>
                          <ExternalLink className="w-3 h-3 text-muted opacity-0 group-hover:opacity-100 transition-opacity" />
                        </a>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Mobile Menu Toggle */}
          <button
            onClick={() => setMenuOpen(!menuOpen)}
            className="sm:hidden text-muted-fg hover:text-foreground p-2"
          >
            {menuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>

        {/* Mobile Menu */}
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
                    ? 'bg-purple/15 text-purple'
                    : 'text-muted-fg hover:text-foreground hover:bg-white/5'
                }`}
              >
                {tab.label}
              </button>
            ))}

            {/* Mobile module links */}
            <div className="mt-2 pt-2 border-t border-border">
              <p className="px-4 pb-1 text-[10px] text-muted uppercase tracking-widest font-medium">
                Modules
              </p>
              {moduleLinks.map((mod) =>
                mod.current ? (
                  <div
                    key={mod.name}
                    className="px-4 py-2 text-sm font-medium text-purple flex items-center gap-2"
                  >
                    <span>{mod.name}</span>
                    <span className="text-[10px] bg-purple/10 px-1.5 py-0.5 rounded">Active</span>
                  </div>
                ) : mod.soon ? (
                  <div
                    key={mod.name}
                    className="px-4 py-2 text-sm text-muted-fg opacity-40 flex items-center gap-2"
                  >
                    <span>{mod.name}</span>
                    <span className="text-[10px] bg-white/5 px-1.5 py-0.5 rounded">Soon</span>
                  </div>
                ) : (
                  <a
                    key={mod.name}
                    href={mod.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-4 py-2 text-sm text-muted-fg hover:text-foreground flex items-center gap-2 transition-colors"
                    onClick={() => setMenuOpen(false)}
                  >
                    {mod.name}
                    <ExternalLink className="w-3 h-3 opacity-60" />
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
