import { Link } from "wouter";
import { Button } from "@/components/ui/button";

interface NavbarProps {
  onNavigate: (sectionId: string) => void;
  activeSection: string | null;
}

export default function Navbar({ onNavigate, activeSection }: NavbarProps) {
  const navItems = [
    { label: "About", sectionId: "about" },
    { label: "Features", sectionId: "features" },
    { label: "Join Waitlist", sectionId: "waitlist" },
  ];

  return (
    <nav className="bg-white shadow-sm sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <div className="flex-shrink-0 flex items-center">
              <Link href="/">
                <span className="text-3xl font-bold text-primary cursor-pointer">
                  Code<span className="text-purple-500">Quality</span>
                </span>
              </Link>
            </div>
          </div>
          <div className="flex items-center space-x-4">
            {navItems.map((item) => (
              <button
                key={item.sectionId}
                onClick={() => onNavigate(item.sectionId)}
                className={`text-gray-900 hover:text-primary px-3 py-2 text-sm font-medium
                  ${activeSection === item.sectionId ? "text-primary" : ""}`}
              >
                {item.label}
              </button>
            ))}
            <Button 
              variant="default" 
              onClick={() => onNavigate("upload")}
              className="bg-primary text-white hover:bg-primary/90"
            >
              Try Now
            </Button>
          </div>
        </div>
      </div>
    </nav>
  );
}
