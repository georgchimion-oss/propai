import { MapPin } from 'lucide-react';

const Footer = () => {
  return (
    <footer className="bg-navy-mid border-t border-border py-16">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <div className="grid md:grid-cols-4 gap-10 mb-12">
          {/* Brand */}
          <div className="md:col-span-1">
            <p className="font-serif text-xl tracking-[0.3em] font-semibold text-foreground mb-4">
              VESTIA
            </p>
            <p className="text-muted-fg font-sans text-sm leading-relaxed mb-4">
              AI-powered property intelligence for South Florida condo associations.
            </p>
            <div className="flex items-center gap-2 text-muted-fg">
              <MapPin className="w-3.5 h-3.5" />
              <span className="font-sans text-xs">Miami, FL</span>
            </div>
          </div>

          {/* Nav columns */}
          {[
            {
              title: 'Platform',
              links: ['Vestia Triage', 'Vestia Comply', 'Vestia Collect', 'Vestia Screen'],
            },
            {
              title: 'Company',
              links: ['About', 'Careers', 'Blog', 'Contact'],
            },
            {
              title: 'Legal',
              links: ['Privacy Policy', 'Terms of Service', 'Security'],
            },
          ].map((col) => (
            <div key={col.title}>
              <p className="text-foreground font-sans text-sm font-semibold mb-4 tracking-wide">
                {col.title}
              </p>
              <ul className="space-y-2.5">
                {col.links.map((link) => (
                  <li key={link}>
                    <a
                      href="#"
                      className="text-muted-fg font-sans text-sm hover:text-foreground transition-colors duration-300"
                    >
                      {link}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="border-t border-border pt-8 flex flex-col sm:flex-row justify-between items-center gap-4">
          <p className="text-muted-fg font-sans text-xs">
            &copy; 2026 Vestia. All rights reserved.
          </p>
          <p className="text-muted-fg font-sans text-xs">
            A{' '}
            <a href="https://georg.miami" className="text-gold hover:underline">
              Georg Chimion
            </a>{' '}
            project
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
