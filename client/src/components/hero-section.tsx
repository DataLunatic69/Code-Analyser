import React from "react";
import { Button } from "@/components/ui/button";

interface HeroSectionProps {
  onTryNowClick: () => void;
  onWaitlistClick: () => void;
}

const HeroSection: React.FC<HeroSectionProps> = ({ onTryNowClick, onWaitlistClick }) => {
  return (
    <div className="relative bg-white overflow-hidden">
      <div className="max-w-7xl mx-auto">
        <div className="relative z-10 pb-8 bg-white sm:pb-16 md:pb-20 lg:max-w-2xl lg:w-full lg:pb-28 xl:pb-32">
          <main className="mt-10 mx-auto max-w-7xl px-4 sm:mt-12 sm:px-6 md:mt-16 lg:mt-20 lg:px-8 xl:mt-28">
            <div className="sm:text-center lg:text-left">
              <h1 className="text-4xl tracking-tight font-extrabold text-gray-900 sm:text-5xl md:text-6xl">
                <span className="block xl:inline">AI-Powered</span>{" "}
                <span className="block text-primary xl:inline">Code Analysis</span>
              </h1>
              <p className="mt-3 text-base text-gray-500 sm:mt-5 sm:text-lg sm:max-w-xl sm:mx-auto md:mt-5 md:text-xl lg:mx-0">
                Analyze your code for best practices, get personalized recommendations, and improve your development skills with our advanced AI code analyzer.
              </p>
              <div className="mt-5 sm:mt-8 sm:flex sm:justify-center lg:justify-start">
                <div className="rounded-md shadow">
                  <Button 
                    onClick={onTryNowClick}
                    className="w-full flex items-center justify-center px-8 py-3 text-base font-medium rounded-md text-white bg-primary hover:bg-primary/90 md:py-4 md:text-lg md:px-10"
                  >
                    Try It Now
                  </Button>
                </div>
                <div className="mt-3 sm:mt-0 sm:ml-3">
                  <Button 
                    onClick={onWaitlistClick} 
                    variant="outline"
                    className="w-full flex items-center justify-center px-8 py-3 border border-primary text-base font-medium rounded-md text-primary bg-white hover:bg-gray-50 md:py-4 md:text-lg md:px-10"
                  >
                    Join Waitlist
                  </Button>
                </div>
              </div>
            </div>
          </main>
        </div>
      </div>
      <div className="lg:absolute lg:inset-y-0 lg:right-0 lg:w-1/2">
        <div className="h-56 w-full bg-gradient-to-r from-blue-100 to-indigo-100 flex items-center justify-center sm:h-72 md:h-96 lg:w-full lg:h-full">
          <div className="p-6 max-w-md">
            <div className="bg-white/80 backdrop-blur-sm p-4 rounded-lg shadow-lg">
              <div className="flex items-center mb-4">
                <div className="h-3 w-3 bg-red-500 rounded-full mr-2"></div>
                <div className="h-3 w-3 bg-yellow-500 rounded-full mr-2"></div>
                <div className="h-3 w-3 bg-green-500 rounded-full"></div>
              </div>
              <pre className="text-sm text-gray-800 font-mono overflow-x-auto">
                <code>{`function analyzeCode(code) {
  // AI-powered analysis
  const results = aiModel.analyze(code);
  
  return {
    score: results.score,
    recommendations: results.insights
  };
}`}</code>
              </pre>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HeroSection;
