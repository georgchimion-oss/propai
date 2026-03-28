import { useState, useEffect } from 'react';

const modules = [
  { name: 'Triage', url: 'https://triage.georg.miami', live: true },
  { name: 'Comply', url: 'https://comply.georg.miami', live: true },
  { name: 'Collect', url: 'https://collect.georg.miami', live: true },
  { name: 'Screen', url: 'https://screen.georg.miami', live: true },
  { name: 'Docs', url: 'https://vestiadocs.georg.miami', live: true },
  { name: 'Vendor', url: 'https://vendor.georg.miami', live: true },
];

const Navbar = () => {
  const [scrolled, setScrolled] = useState(false);
  const [modulesOpen, setModulesOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
        scrolled ? 'bg-navy-deep/95 backdrop-blur-xl border-b border-border shadow-lg shadow-black/20' : 'bg-navy-deep/40 backdrop-blur-md'
      }`}
    >
      <div className="max-w-7xl mx-auto flex items-center justify-between py-4 px-6 lg:px-8">
        <a href="#" className="font-serif text-2xl tracking-[0.3em] font-semibold text-foreground">
          VESTIA
        </a>

        <div className="hidden md:flex items-center gap-8">
          <a href="#platform" className="text-sm font-sans text-foreground/80 hover:text-foreground transition-colors duration-300 tracking-wide font-medium">
            Platform
          </a>

          {/* Modules Dropdown */}
          <div className="relative" onMouseEnter={() => setModulesOpen(true)} onMouseLeave={() => setModulesOpen(false)}>
            <button className="text-sm font-sans text-foreground/80 hover:text-foreground transition-colors duration-300 tracking-wide font-medium flex items-center gap-1">
              Modules
              <svg className={`w-3.5 h-3.5 transition-transform ${modulesOpen ? 'rotate-180' : ''}`} fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" /></svg>
            </button>
            {modulesOpen && (
              <div className="absolute top-full left-1/2 -translate-x-1/2 pt-2 w-56"><div className="bg-card/95 backdrop-blur-xl border border-border rounded-xl shadow-2xl shadow-black/30 py-2 animate-fade-in">
                {modules.map((mod) => (
                  <a
                    key={mod.name}
                    href={mod.live ? mod.url : undefined}
                    target={mod.live ? '_blank' : undefined}
                    rel={mod.live ? 'noopener noreferrer' : undefined}
                    className={`flex items-center justify-between px-4 py-2.5 text-sm font-sans transition-colors ${
                      mod.live ? 'text-foreground hover:bg-white/5 cursor-pointer' : 'text-muted cursor-default'
                    }`}
                  >
                    <span>Vestia {mod.name}</span>
                    {mod.live ? (
                      <span className="text-[9px] font-semibold px-1.5 py-0.5 rounded-full bg-green/15 text-green border border-green/25">LIVE</span>
                    ) : (
                      <span className="text-[9px] font-semibold px-1.5 py-0.5 rounded-full bg-white/5 text-muted-fg border border-border">SOON</span>
                    )}
                  </a>
                ))}
              </div></div>
            )}
          </div>

          <a href="#compliance" className="text-sm font-sans text-foreground/80 hover:text-foreground transition-colors duration-300 tracking-wide font-medium">
            Compliance
          </a>
          <a href="#about" className="text-sm font-sans text-foreground/80 hover:text-foreground transition-colors duration-300 tracking-wide font-medium">
            About
          </a>
        </div>

        <button className="gradient-gold text-background font-sans text-sm font-semibold px-6 py-2.5 rounded-md hover:brightness-110 transition-all duration-300 active:scale-[0.97] tracking-wide">
          Request Demo
        </button>
      </div>
    </nav>
  );
};

export default Navbar;
