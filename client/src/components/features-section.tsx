import React from "react";
import { CATEGORIES } from "@/types";

const FeaturesSection: React.FC = () => {
  return (
    <div id="features" className="py-12 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="lg:text-center">
          <h2 className="text-base text-primary font-semibold tracking-wide uppercase">Features</h2>
          <p className="mt-2 text-3xl leading-8 font-extrabold tracking-tight text-gray-900 sm:text-4xl">
            Comprehensive Code Analysis
          </p>
          <p className="mt-4 max-w-2xl text-xl text-gray-500 lg:mx-auto">
            Our AI-powered platform analyzes your code across multiple dimensions to provide actionable insights.
          </p>
        </div>

        <div className="mt-10">
          <dl className="space-y-10 md:space-y-0 md:grid md:grid-cols-2 md:gap-x-8 md:gap-y-10">
            {CATEGORIES.map((category, index) => (
              <div key={index} className="relative">
                <dt>
                  <div className="absolute flex items-center justify-center h-12 w-12 rounded-md bg-primary text-white">
                    <i className={`fas ${category.icon} text-lg`}></i>
                  </div>
                  <p className="ml-16 text-lg leading-6 font-medium text-gray-900">{category.name}</p>
                </dt>
                <dd className="mt-2 ml-16 text-base text-gray-500">
                  {category.description}
                </dd>
              </div>
            ))}
          </dl>
        </div>
      </div>
    </div>
  );
};

export default FeaturesSection;
