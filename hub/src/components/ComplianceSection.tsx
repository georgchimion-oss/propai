import { useScrollReveal } from '@/hooks/useScrollReveal';
import { CheckCircle } from 'lucide-react';

const checks = [
  'Milestone inspections',
  'SIRS tracking',
  '15-year retention',
  'Reserve funding',
  'Board notifications',
  'CTMH reporting',
];

const ComplianceSection = () => {
  const { ref, isVisible } = useScrollReveal();

  return (
    <section ref={ref} id="compliance" className="py-24 lg:py-32 bg-navy-mid">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <div
          className={`bg-card border border-teal/20 rounded-2xl overflow-hidden reveal-transition ${
            isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'
          }`}
        >
          <div className="grid lg:grid-cols-2">
            {/* Content */}
            <div className="p-8 lg:p-12 xl:p-16">
              <p className="text-teal text-xs font-sans tracking-[0.2em] uppercase mb-4">
                SB 4-D Compliance
              </p>
              <h2 className="font-serif text-3xl lg:text-4xl font-light text-foreground leading-tight mb-6 text-balance">
                Post-Surfside compliance, fully automated.
              </h2>
              <p className="text-muted-fg font-sans text-sm leading-relaxed mb-8 max-w-lg">
                The Florida Building Safety Act introduced sweeping new requirements for condo associations. Vestia Comply tracks every milestone, deadline, and document — so board members aren't personally liable for missed inspections.
              </p>

              <div className="grid grid-cols-2 gap-4 mb-8">
                {checks.map((item, i) => (
                  <div
                    key={item}
                    className={`flex items-center gap-2.5 reveal-transition ${
                      isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
                    }`}
                    style={{ transitionDelay: `${i * 60 + 300}ms` }}
                  >
                    <CheckCircle className="w-4 h-4 text-teal shrink-0" />
                    <span className="text-foreground font-sans text-sm">{item}</span>
                  </div>
                ))}
              </div>

              <div className="bg-teal/5 border border-teal/20 rounded-lg p-4">
                <p className="text-teal font-sans text-xs font-semibold tracking-wide uppercase mb-1">
                  Critical Notice
                </p>
                <p className="text-muted-fg font-sans text-sm">
                  Board members are personally liable for non-compliance under Florida SB 4-D.
                </p>
              </div>
            </div>

            {/* Visual / Mockup */}
            <div className="relative bg-gradient-to-br from-teal/5 to-teal/10 flex items-center justify-center p-8 lg:p-12">
              <div className="w-full max-w-sm space-y-4">
                {[
                  { label: 'Milestone Inspection', status: 'On Track', pct: 87 },
                  { label: 'SIRS Report', status: 'Due in 14 days', pct: 62 },
                  { label: 'Reserve Study', status: 'Complete', pct: 100 },
                ].map((item) => (
                  <div key={item.label} className="bg-card border border-border rounded-lg p-4">
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-foreground font-sans text-sm">{item.label}</span>
                      <span className="text-teal font-sans text-xs">{item.status}</span>
                    </div>
                    <div className="h-1.5 bg-navy-mid rounded-full overflow-hidden">
                      <div
                        className="h-full bg-teal rounded-full transition-all duration-1000"
                        style={{ width: isVisible ? `${item.pct}%` : '0%' }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ComplianceSection;
