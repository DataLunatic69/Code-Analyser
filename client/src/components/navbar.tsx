import React from "react";
import { Button } from "@/components/ui/button";

interface NavbarProps {
  onNavClick: (sectionId: string) => void;
}

const Navbar: React.FC<NavbarProps> = ({ onNavClick }) => {
  return (
    <nav className="bg-white shadow sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex">
            <div className="flex-shrink-0 flex items-center">
              <span className="text-primary text-2xl font-bold">CodeAnalyzer</span>
            </div>
          </div>
          <div className="flex items-center space-x-4">
            <button 
              onClick={() => onNavClick("features")} 
              className="text-gray-700 hover:text-primary px-3 py-2 rounded-md text-sm font-medium"
            >
              Features
            </button>
            <button 
              onClick={() => onNavClick("how-it-works")} 
              className="text-gray-700 hover:text-primary px-3 py-2 rounded-md text-sm font-medium"
            >
              How it Works
            </button>
            <button 
              onClick={() => onNavClick("pricing")} 
              className="text-gray-700 hover:text-primary px-3 py-2 rounded-md text-sm font-medium"
            >
              Pricing
            </button>
            <Button
              onClick={() => onNavClick("waitlist")}
              className="bg-primary hover:bg-primary/90 text-white"
            >
              Join Waitlist
            </Button>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
