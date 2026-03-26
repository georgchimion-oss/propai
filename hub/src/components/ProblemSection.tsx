import problemImg from '@/assets/problem-manager.jpg';
import { useScrollReveal } from '@/hooks/useScrollReveal';

const ProblemSection = () => {
  const { ref, isVisible } = useScrollReveal();

  return (
    <section ref={ref} id="about" className="py-24 lg:py-32 bg-navy-mid">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <div
          className={`grid lg:grid-cols-2 gap-12 lg:gap-20 items-center reveal-transition ${
            isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'
          }`}
        >
          {/* Image */}
          <div className="relative rounded-xl overflow-hidden aspect-[4/3]">
            <img
              src={problemImg}
              alt="Overwhelmed property manager at desk"
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-background/20" />
          </div>

          {/* Content */}
          <div>
            <h2 className="font-serif text-4xl lg:text-5xl xl:text-6xl font-light text-foreground leading-[1.05] mb-10 text-balance">
              Property managers are drowning.
            </h2>

            <div className="space-y-8">
              {[
                {
                  stat: 'Email & phone',
                  desc: 'Average PM still coordinates via email and phone calls — no centralized system.',
                },
                {
                  stat: '$19.5B',
                  desc: 'In annual FL assessments managed on spreadsheets and paper processes.',
                },
                {
                  stat: 'Personal liability',
                  desc: 'Board members are personally liable for compliance failures under SB 4-D.',
                },
              ].map((item, i) => (
                <div
                  key={i}
                  className={`border-l-2 border-gold pl-6 reveal-transition ${
                    isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'
                  }`}
                  style={{ transitionDelay: `${i * 100 + 200}ms` }}
                >
                  <p className="text-gold font-serif text-xl font-semibold mb-1">{item.stat}</p>
                  <p className="text-muted-fg font-sans text-sm leading-relaxed">{item.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ProblemSection;
