import Navbar from "@/components/navbar";
import Hero from "@/components/hero";
import Features from "@/components/features";
import UploadForm from "@/components/upload-form";
import About from "@/components/about";
import WaitlistForm from "@/components/waitlist-form";
import Footer from "@/components/footer";
import { useState } from "react";
import SuccessModal from "@/components/success-modal";

export default function Home() {
  const [waitlistSuccess, setWaitlistSuccess] = useState(false);
  const [activeSection, setActiveSection] = useState<string | null>(null);

  const handleScrollToSection = (sectionId: string) => {
    setActiveSection(sectionId);
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar onNavigate={handleScrollToSection} activeSection={activeSection} />
      <Hero onNavigate={handleScrollToSection} />
      <Features />
      <div id="upload" className="py-12 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h2 className="text-base text-purple-500 font-semibold tracking-wide uppercase">Try it out</h2>
            <p className="mt-2 text-3xl leading-8 font-extrabold tracking-tight text-gray-900 sm:text-4xl">
              Upload your code for analysis
            </p>
            <p className="mt-4 max-w-2xl text-xl text-gray-500 mx-auto">
              Simply upload a .js, .jsx, or .py file to get instant feedback
            </p>
          </div>
          <UploadForm />
        </div>
      </div>
      <About />
      <div id="waitlist" className="py-12 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="lg:text-center">
            <h2 className="text-base text-purple-500 font-semibold tracking-wide uppercase">Join Our Waitlist</h2>
            <p className="mt-2 text-3xl leading-8 font-extrabold tracking-tight text-gray-900 sm:text-4xl">
              Be the first to get full access
            </p>
            <p className="mt-4 max-w-2xl text-xl text-gray-500 lg:mx-auto">
              Sign up to get notified when we launch our full product with even more powerful features
            </p>
          </div>
          <WaitlistForm onSuccess={() => setWaitlistSuccess(true)} />
        </div>
      </div>
      <Footer onNavigate={handleScrollToSection} />
      
      {waitlistSuccess && (
        <SuccessModal 
          title="Successfully Joined Waitlist"
          message="Thank you for joining our waitlist! We'll notify you when our product is ready for launch."
          onClose={() => setWaitlistSuccess(false)}
        />
      )}
    </div>
  );
}
