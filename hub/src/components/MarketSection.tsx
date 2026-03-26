import { useScrollReveal } from '@/hooks/useScrollReveal';
import marketImg from '@/assets/market-aerial.jpg';

const stats = [
  { value: '$88B', label: 'Global PropTech market' },
  { value: '49,800', label: 'FL associations' },
  { value: '$19.5B', label: 'Annual assessments' },
  { value: '38%', label: 'Ripe for disruption' },
];

const MarketSection = () => {
  const { ref, isVisible } = useScrollReveal();

  return (
    <section ref={ref} className="relative py-24 lg:py-32 overflow-hidden">
      <div className="absolute inset-0">
        <img src={marketImg} alt="Miami Beach condo row aerial view" className="w-full h-full object-cover" />
        <div className="absolute inset-0 bg-background/85" />
      </div>

      <div className="relative max-w-7xl mx-auto px-6 lg:px-8">
        <div
          className={`text-center mb-16 reveal-transition ${
            isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'
          }`}
        >
          <p className="text-gold text-xs font-sans tracking-[0.2em] uppercase mb-4">Market Opportunity</p>
          <h2 className="font-serif text-4xl lg:text-5xl font-light text-foreground text-balance">
            South Florida is the perfect market.
          </h2>
        </div>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
          {stats.map((stat, i) => (
            <div
              key={stat.label}
              className={`bg-glass border border-border rounded-xl p-6 text-center transition-all duration-700 hover:-translate-y-1 hover:shadow-xl hover:shadow-black/10 reveal-transition ${
                isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'
              }`}
              style={{ transitionDelay: `${i * 100 + 200}ms` }}
            >
              <p className="font-serif text-3xl lg:text-4xl text-gold font-semibold mb-2">{stat.value}</p>
              <p className="text-muted-fg text-xs font-sans tracking-wide">{stat.label}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default MarketSection;
