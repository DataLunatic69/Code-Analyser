import React from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

interface PricingTier {
  name: string;
  price: string;
  description: string;
  features: string[];
  popular?: boolean;
}

const PricingSection: React.FC = () => {
  const pricingTiers: PricingTier[] = [
    {
      name: "Starter",
      price: "$0",
      description: "Perfect for individual developers and small projects.",
      features: [
        "5 code analyses per month",
        "Basic recommendations",
        "File size up to 1MB"
      ]
    },
    {
      name: "Professional",
      price: "$29",
      description: "For professional developers and growing teams.",
      features: [
        "50 code analyses per month",
        "Advanced recommendations",
        "File size up to 5MB",
        "Historical analysis tracking",
        "API access"
      ],
      popular: true
    },
    {
      name: "Enterprise",
      price: "$99",
      description: "For large teams and organizations.",
      features: [
        "Unlimited code analyses",
        "Premium recommendations",
        "File size up to 20MB",
        "Team collaboration features",
        "Custom integration options",
        "Priority support"
      ]
    }
  ];

  const scrollToWaitlist = () => {
    const waitlistSection = document.getElementById("waitlist");
    if (waitlistSection) {
      waitlistSection.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <div id="pricing" className="py-12 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="lg:text-center">
          <h2 className="text-base text-primary font-semibold tracking-wide uppercase">Pricing</h2>
          <p className="mt-2 text-3xl leading-8 font-extrabold tracking-tight text-gray-900 sm:text-4xl">
            Simple, Transparent Pricing
          </p>
          <p className="mt-4 max-w-2xl text-xl text-gray-500 lg:mx-auto">
            Choose the plan that's right for you - from hobbyists to enterprise teams.
          </p>
        </div>

        <div className="mt-10 space-y-12 lg:space-y-0 lg:grid lg:grid-cols-3 lg:gap-8">
          {pricingTiers.map((tier, index) => (
            <div 
              key={index}
              className={`relative p-8 bg-white border rounded-2xl shadow-sm flex flex-col ${
                tier.popular ? 'border-primary-200' : 'border-gray-200'
              }`}
            >
              {tier.popular && (
                <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                  <Badge className="bg-primary text-white px-4 py-1">
                    Most Popular
                  </Badge>
                </div>
              )}
              
              <div className="flex-1">
                <h3 className="text-xl font-semibold text-gray-900">{tier.name}</h3>
                <p className="mt-4 flex items-baseline text-gray-900">
                  <span className="text-5xl font-extrabold tracking-tight">{tier.price}</span>
                  <span className="ml-1 text-xl font-semibold">/month</span>
                </p>
                <p className="mt-6 text-gray-500">{tier.description}</p>

                <ul role="list" className="mt-6 space-y-6">
                  {tier.features.map((feature, featureIndex) => (
                    <li key={featureIndex} className="flex">
                      <i className="fas fa-check flex-shrink-0 text-green-500"></i>
                      <span className="ml-3 text-gray-500">{feature}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <Button
                onClick={scrollToWaitlist}
                variant={tier.popular ? "default" : "outline"}
                className={`mt-8 w-full ${
                  tier.popular 
                    ? 'bg-primary hover:bg-primary/90 text-white' 
                    : 'bg-primary/5 border-primary/10 text-primary hover:bg-primary/10'
                }`}
              >
                Join Waitlist
              </Button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default PricingSection;
