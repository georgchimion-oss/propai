import { useScrollReveal } from '@/hooks/useScrollReveal';
import howItWorksBg from '@/assets/how-it-works-bg.jpg';
import { Smartphone, Brain, CheckCircle } from 'lucide-react';

const steps = [
  {
    icon: Smartphone,
    label: 'Report',
    desc: 'Tenant submits issue via text, email, or app — any channel, any time.',
  },
  {
    icon: Brain,
    label: 'AI Triage',
    desc: 'Vestia categorizes, prioritizes, and assigns the right vendor automatically.',
  },
  {
    icon: CheckCircle,
    label: 'Resolve',
    desc: 'Vendor dispatched, work tracked, tenant updated — all in one loop.',
  },
];

const HowItWorksSection = () => {
  const { ref, isVisible } = useScrollReveal();

  return (
    <section ref={ref} id="platform" className="relative py-24 lg:py-32 overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0">
        <img src={howItWorksBg} alt="" className="w-full h-full object-cover opacity-20" />
        <div className="absolute inset-0 bg-background/80" />
      </div>

      <div className="relative max-w-7xl mx-auto px-6 lg:px-8">
        <div
          className={`text-center mb-20 reveal-transition ${
            isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'
          }`}
        >
          <p className="text-teal text-xs font-sans tracking-[0.2em] uppercase mb-4">How It Works</p>
          <h2 className="font-serif text-4xl lg:text-5xl font-light text-foreground text-balance">
            From report to resolution, autonomously.
          </h2>
        </div>

        <div className="grid md:grid-cols-3 gap-8 lg:gap-12 relative">
          {/* Connecting line */}
          <div className="hidden md:block absolute top-16 left-[20%] right-[20%] h-px bg-border" />

          {steps.map((step, i) => (
            <div
              key={step.label}
              className={`relative text-center reveal-transition ${
                isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'
              }`}
              style={{ transitionDelay: `${i * 120 + 200}ms` }}
            >
              <div className="relative z-10 w-14 h-14 rounded-full bg-glass border border-border flex items-center justify-center mx-auto mb-6">
                <step.icon className="w-6 h-6 text-teal" />
              </div>

              <p className="text-xs font-sans tracking-[0.15em] uppercase text-gold mb-2">
                Step {i + 1}
              </p>
              <h3 className="font-serif text-2xl text-foreground mb-3">{step.label}</h3>
              <p className="text-muted-fg font-sans text-sm leading-relaxed max-w-xs mx-auto">
                {step.desc}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default HowItWorksSection;
