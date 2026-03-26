import Navbar from './components/Navbar';
import HeroSection from './components/HeroSection';
import ProblemSection from './components/ProblemSection';
import ModulesSection from './components/ModulesSection';
import HowItWorksSection from './components/HowItWorksSection';
import MarketSection from './components/MarketSection';
import ComplianceSection from './components/ComplianceSection';
import SocialProofSection from './components/SocialProofSection';
import CTASection from './components/CTASection';
import Footer from './components/Footer';

const App = () => {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <HeroSection />
      <ProblemSection />
      <ModulesSection />
      <HowItWorksSection />
      <MarketSection />
      <ComplianceSection />
      <SocialProofSection />
      <CTASection />
      <Footer />
    </div>
  );
};

export default App;
