import heroImg from '@/assets/hero-miami.jpg';
import { useScrollReveal } from '@/hooks/useScrollReveal';

const HeroSection = () => {
  const { ref, isVisible } = useScrollReveal(0.1);

  return (
    <section ref={ref} className="relative min-h-screen flex items-end pb-24 lg:pb-32 overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0">
        <img
          src={heroImg}
          alt="Miami Beach luxury condos at sunset"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-background via-background/70 to-background/20" />
      </div>

      {/* Content */}
      <div className="relative z-10 max-w-7xl mx-auto px-6 lg:px-8 w-full">
        <div
          className={`max-w-3xl reveal-transition ${
            isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
          }`}
        >
          {/* Badge */}
          <div className="inline-flex items-center gap-2.5 bg-glass rounded-full px-4 py-2 mb-8 border border-border">
            <span className="w-2 h-2 rounded-full bg-teal animate-pulse-dot" />
            <span className="text-xs font-sans tracking-widest uppercase text-muted-fg">
              AI-Powered Property Management
            </span>
          </div>

          <h1 className="font-serif text-5xl sm:text-6xl lg:text-7xl xl:text-8xl font-light text-foreground leading-[0.95] mb-6 text-balance">
            The future of property intelligence
          </h1>

          <p className="font-sans text-lg lg:text-xl text-muted-fg max-w-2xl mb-10 leading-relaxed">
            Six AI modules purpose-built for South Florida condo associations. From maintenance triage to compliance tracking — one platform, zero spreadsheets.
          </p>

          {/* Stat pills */}
          <div className="flex flex-wrap gap-4 mb-10">
            <div className="bg-glass border border-border rounded-lg px-5 py-3">
              <span className="text-gold font-serif text-2xl font-semibold">27/30</span>
              <span className="text-muted-fg text-sm font-sans ml-2">AI Disruption Score</span>
            </div>
            <div className="bg-glass border border-border rounded-lg px-5 py-3">
              <span className="text-teal font-serif text-2xl font-semibold">38%</span>
              <span className="text-muted-fg text-sm font-sans ml-2">of cycles automatable</span>
            </div>
          </div>

          {/* CTAs */}
          <div className="flex flex-wrap gap-4">
            <button className="gradient-gold text-background font-sans font-semibold px-8 py-3.5 rounded-md hover:brightness-110 transition-all duration-300 active:scale-[0.97] text-sm tracking-wide">
              See the Platform
            </button>
            <button className="border border-foreground/30 text-foreground font-sans font-medium px-8 py-3.5 rounded-md hover:bg-foreground/5 transition-all duration-300 active:scale-[0.97] text-sm tracking-wide">
              Watch Demo
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
