import { useScrollReveal } from '@/hooks/useScrollReveal';
import { AlertTriangle, Shield, DollarSign, UserCheck, FileText, Users } from 'lucide-react';

const modules = [
  {
    name: 'Vestia Triage',
    desc: 'AI maintenance triage & dispatch. Auto-categorize, prioritize, and route work orders in real time.',
    color: 'text-red-400',
    borderColor: 'border-red-400/30',
    bgColor: 'bg-red-400/5',
    icon: AlertTriangle,
    tags: ['Auto-routing', 'Priority scoring', 'Vendor matching'],
    url: 'https://triage.georg.miami',
  },
  {
    name: 'Vestia Comply',
    desc: 'SB 4-D compliance tracking. Milestone inspections, SIRS, reserve funding — fully automated.',
    color: 'text-teal',
    borderColor: 'border-teal/30',
    bgColor: 'bg-teal/5',
    icon: Shield,
    tags: ['SIRS tracking', 'Milestone alerts', '15-yr retention'],
    url: 'https://comply.georg.miami',
  },
  {
    name: 'Vestia Collect',
    desc: 'Automated rent and assessment collection with smart reminders and lien management.',
    color: 'text-gold',
    borderColor: 'border-gold/30',
    bgColor: 'bg-gold/5',
    icon: DollarSign,
    tags: ['Auto-reminders', 'Payment plans', 'Lien tracking'],
    url: 'https://collect.georg.miami',
  },
  {
    name: 'Vestia Screen',
    desc: 'Tenant screening automation. Background checks, credit reports, and approval workflows.',
    color: 'text-purple-400',
    borderColor: 'border-purple-400/30',
    bgColor: 'bg-purple-400/5',
    icon: UserCheck,
    tags: ['Background checks', 'Credit scoring', 'Auto-approval'],
    url: 'https://screen.georg.miami',
  },
  {
    name: 'Vestia Docs',
    desc: 'AI-powered lease document generation. Templates, e-signatures, and secure storage.',
    color: 'text-blue-400',
    borderColor: 'border-blue-400/30',
    bgColor: 'bg-blue-400/5',
    icon: FileText,
    tags: ['AI drafting', 'E-signatures', 'Version control'],
    url: 'https://vestiadocs.georg.miami',
  },
  {
    name: 'Vestia Vendor',
    desc: 'Vendor RFP & bid comparison. Automated solicitation, scoring, and contract management.',
    color: 'text-orange-400',
    borderColor: 'border-orange-400/30',
    bgColor: 'bg-orange-400/5',
    icon: Users,
    tags: ['RFP automation', 'Bid scoring', 'Contract mgmt'],
    url: 'https://vendor.georg.miami',
  },
];

const ModulesSection = () => {
  const { ref, isVisible } = useScrollReveal();

  return (
    <section ref={ref} id="modules" className="py-24 lg:py-32 bg-navy-deep">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <div
          className={`text-center mb-16 reveal-transition ${
            isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'
          }`}
        >
          <p className="text-gold text-xs font-sans tracking-[0.2em] uppercase mb-4">The Platform</p>
          <h2 className="font-serif text-4xl lg:text-5xl font-light text-foreground text-balance">
            Six modules. One intelligence layer.
          </h2>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {modules.map((mod, i) => {
            const isLive = !!mod.url;
            const Wrapper = isLive ? 'a' : 'div';
            const wrapperProps = isLive ? { href: mod.url, target: '_blank' as const, rel: 'noopener noreferrer' } : {};

            return (
              <Wrapper
                key={mod.name}
                {...wrapperProps}
                className={`group relative bg-card border border-border rounded-xl p-7 hover:border-border transition-all duration-500 hover:-translate-y-1 hover:shadow-2xl hover:shadow-black/20 reveal-transition block no-underline ${
                  isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'
                } ${isLive ? 'cursor-pointer' : ''}`}
                style={{ transitionDelay: `${i * 80 + 150}ms`, textDecoration: 'none', color: 'inherit' }}
              >
                <div className="flex items-center justify-between mb-5">
                  <div className={`w-10 h-10 rounded-lg ${mod.bgColor} flex items-center justify-center`}>
                    <mod.icon className={`w-5 h-5 ${mod.color}`} />
                  </div>
                  {isLive ? (
                    <span className="text-[10px] font-sans font-semibold px-2 py-0.5 rounded-full bg-green/15 text-green border border-green/25 uppercase tracking-wider">
                      Live Demo
                    </span>
                  ) : (
                    <span className="text-[10px] font-sans font-semibold px-2 py-0.5 rounded-full bg-white/5 text-muted-fg border border-border uppercase tracking-wider">
                      Coming Soon
                    </span>
                  )}
                </div>

                <h3 className={`font-serif text-xl font-semibold ${mod.color} mb-2`}>
                  {mod.name}
                </h3>
                <p className="text-muted-fg font-sans text-sm leading-relaxed mb-5">
                  {mod.desc}
                </p>

                <div className="flex flex-wrap gap-2">
                  {mod.tags.map((tag) => (
                    <span
                      key={tag}
                      className={`text-xs font-sans px-2.5 py-1 rounded-full border ${mod.borderColor} ${mod.color} opacity-60`}
                    >
                      {tag}
                    </span>
                  ))}
                </div>

                {isLive && (
                  <div className="mt-5 flex items-center gap-1.5 text-xs font-sans font-medium text-gold group-hover:text-gold-bright transition-colors">
                    Try demo <span className="group-hover:translate-x-1 transition-transform">→</span>
                  </div>
                )}
              </Wrapper>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default ModulesSection;
