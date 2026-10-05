import heroImg from '@/assets/hero-miami.jpg';
import { useScrollReveal } from '@/hooks/useScrollReveal';

const HeroSection = () => {
  const { ref, isVisible } = useScrollReveal(0.1);

  const reveal = (step: number) => ({
    className: `reveal-transition ${
      isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
    }`,
    style: { transitionDelay: `${step * 0.1}s` },
  });

  return (
    <section ref={ref} className="relative min-h-screen overflow-hidden lg:grid lg:grid-cols-[44%_56%]">
      {/* Photo — mobile: top block; desktop: right column. No overlay, full color. */}
      <div className="relative h-[52vh] lg:h-auto lg:order-2 overflow-hidden">
        <img
          src={heroImg}
          alt="Miami Beach luxury condos at sunset"
          className="absolute inset-0 w-full h-full object-cover saturate-[1.1] animate-kenburns"
        />
        {/* feathered seam into the cream panel */}
        <div className="absolute inset-x-0 bottom-0 h-24 hero-seam-y lg:hidden" />
        <div className="absolute inset-y-0 left-0 w-28 hero-seam-x hidden lg:block" />
      </div>

      {/* Content — solid panel, no transparency games */}
      <div className="relative lg:order-1 bg-background flex items-center">
        <div className="w-full px-6 sm:px-10 lg:pl-[max(2rem,calc((100vw-80rem)/2+2rem))] lg:pr-14 py-16 lg:py-28">
          <div {...reveal(0)}>
            <div className="inline-flex items-center gap-2.5 bg-glass rounded-full px-4 py-2 mb-8 border border-border">
              <span className="w-2 h-2 rounded-full bg-teal animate-pulse-dot" />
              <span className="text-xs font-sans tracking-widest uppercase text-muted-fg">
                AI-Powered Property Management
              </span>
            </div>
          </div>

          <h1
            {...reveal(1)}
            className={`${reveal(1).className} font-serif text-5xl sm:text-6xl lg:text-6xl xl:text-7xl font-light text-foreground leading-[0.98] mb-6 text-balance`}
          >
            The future of property intelligence
          </h1>

          <p
            {...reveal(2)}
            className={`${reveal(2).className} font-sans text-lg lg:text-xl text-muted-fg max-w-xl mb-10 leading-relaxed`}
          >
            Six AI modules purpose-built for South Florida condo associations. From maintenance triage to compliance tracking, one platform, zero spreadsheets.
          </p>

          <div {...reveal(3)}>
            <div className="flex flex-wrap gap-4 mb-10">
              <div className="bg-white border border-border rounded-lg px-5 py-3 shadow-sm">
                <span className="text-gold font-serif text-2xl font-semibold">27/30</span>
                <span className="text-muted-fg text-sm font-sans ml-2">AI Disruption Score</span>
              </div>
              <div className="bg-white border border-border rounded-lg px-5 py-3 shadow-sm">
                <span className="text-teal font-serif text-2xl font-semibold">38%</span>
                <span className="text-muted-fg text-sm font-sans ml-2">of cycles automatable</span>
              </div>
            </div>
          </div>

          <div {...reveal(4)}>
            <div className="flex flex-wrap gap-4">
              <button className="gradient-gold text-ink font-sans font-semibold px-8 py-3.5 rounded-md hover:brightness-110 transition-all duration-300 active:scale-[0.97] text-sm tracking-wide">
                See the Platform
              </button>
              <button className="border border-foreground/30 text-foreground font-sans font-medium px-8 py-3.5 rounded-md hover:bg-foreground/5 transition-all duration-300 active:scale-[0.97] text-sm tracking-wide">
                Watch Demo
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
