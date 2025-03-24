import React from "react";
import Navbar from "@/components/navbar";
import HeroSection from "@/components/hero-section";
import FeaturesSection from "@/components/features-section";
import CodeUpload from "@/components/code-upload";
import HowItWorks from "@/components/how-it-works";
import PricingSection from "@/components/pricing-section";
import WaitlistForm from "@/components/waitlist-form";
import Footer from "@/components/footer";
import { CodeAnalysisResult } from "@/types";

const HomePage: React.FC = () => {
  const [analysisResults, setAnalysisResults] = React.useState<CodeAnalysisResult | null>(null);
  
  const scrollToSection = (sectionId: string) => {
    const section = document.getElementById(sectionId);
    if (section) {
      section.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 font-sans">
      <Navbar onNavClick={scrollToSection} />
      <HeroSection onTryNowClick={() => scrollToSection("code-analyzer")} onWaitlistClick={() => scrollToSection("waitlist")} />
      <FeaturesSection />
      <CodeUpload onAnalysisComplete={setAnalysisResults} results={analysisResults} />
      <HowItWorks />
      <PricingSection />
      <WaitlistForm />
      <Footer />
    </div>
  );
};

export default HomePage;
