import { useScrollReveal } from '@/hooks/useScrollReveal';
import ctaImg from '@/assets/cta-pool.jpg';
import { useState } from 'react';

const CTASection = () => {
  const { ref, isVisible } = useScrollReveal();
  const [email, setEmail] = useState('');

  return (
    <section ref={ref} className="relative py-24 lg:py-32 overflow-hidden">
      <div className="absolute inset-0">
        <img src={ctaImg} alt="Luxury condo pool at sunset" className="w-full h-full object-cover" />
        <div className="absolute inset-0 bg-background/80" />
      </div>

      <div className="relative max-w-7xl mx-auto px-6 lg:px-8">
        <div
          className={`max-w-2xl mx-auto text-center reveal-transition ${
            isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'
          }`}
        >
          <h2 className="font-serif text-4xl lg:text-5xl font-light text-foreground leading-tight mb-6 text-balance">
            Ready to modernize your property management?
          </h2>
          <p className="text-muted-fg font-sans text-lg mb-10">
            Free for the first 50 associations.
          </p>

          <div className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto">
            <input
              type="email"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="flex-1 bg-glass border border-border rounded-md px-5 py-3.5 text-foreground font-sans text-sm placeholder:text-muted focus:outline-none focus:ring-2 focus:ring-gold/50 transition-all"
            />
            <button className="gradient-gold text-background font-sans font-semibold px-8 py-3.5 rounded-md hover:brightness-110 transition-all duration-300 active:scale-[0.97] text-sm tracking-wide whitespace-nowrap">
              Get Early Access
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default CTASection;
