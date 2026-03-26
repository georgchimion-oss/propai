import { useScrollReveal } from '@/hooks/useScrollReveal';

const SocialProofSection = () => {
  const { ref, isVisible } = useScrollReveal();

  return (
    <section ref={ref} className="py-24 lg:py-32 bg-navy-deep">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <div
          className={`text-center reveal-transition ${
            isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'
          }`}
        >
          <p className="text-muted-fg text-xs font-sans tracking-[0.2em] uppercase mb-10">
            Trusted by South Florida property managers
          </p>

          <div className="flex flex-wrap justify-center items-center gap-10 lg:gap-16 mb-16 opacity-40">
            {['CAI', 'SFPMA', 'NARPM', 'IREM', 'CCIM'].map((org) => (
              <span
                key={org}
                className="font-serif text-2xl lg:text-3xl tracking-[0.15em] text-foreground"
              >
                {org}
              </span>
            ))}
          </div>

          <div className="max-w-2xl mx-auto bg-card border border-border rounded-xl p-8 lg:p-10">
            <p className="font-serif text-xl lg:text-2xl text-foreground italic leading-relaxed mb-6">
              "We've been waiting for something like Vestia. The compliance tracking alone would save us 20 hours a month."
            </p>
            <div>
              <p className="text-foreground font-sans text-sm font-medium">Maria Gonzalez</p>
              <p className="text-muted-fg font-sans text-xs">Property Director, 4 associations · Sunny Isles Beach</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default SocialProofSection;
