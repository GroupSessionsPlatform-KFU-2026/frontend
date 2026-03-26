import { Header } from '@/components/ui/Header.tsx';
import { HeroSection } from '@/components/ui/landingPage/HeroSection/HeroSection.tsx';
import { HowItWorks } from '@/components/ui/landingPage/HowItWorks/HowItWorks.tsx';
import { Features } from '@/components/ui/landingPage/Features/Features.tsx';
import { Footer } from '@/components/ui/Footer.tsx';

const LandingPage = () => {
  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white">
      <Header />
      <main>
        <HeroSection />
        <HowItWorks />
        <Features />
      </main>
      <Footer />
    </div>
  );
};

export default LandingPage;
