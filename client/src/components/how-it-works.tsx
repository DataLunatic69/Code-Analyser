import React from "react";

const HowItWorks: React.FC = () => {
  return (
    <div id="how-it-works" className="py-12 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="lg:text-center">
          <h2 className="text-base text-primary font-semibold tracking-wide uppercase">Process</h2>
          <p className="mt-2 text-3xl leading-8 font-extrabold tracking-tight text-gray-900 sm:text-4xl">
            How It Works
          </p>
          <p className="mt-4 max-w-2xl text-xl text-gray-500 lg:mx-auto">
            Our advanced AI system analyzes your code through multiple steps to provide comprehensive insights.
          </p>
        </div>

        <div className="relative mt-12 lg:mt-16">
          <div className="absolute inset-0 h-1/2 bg-white lg:hidden"></div>
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="relative lg:grid lg:grid-cols-3 lg:gap-8">
              <div className="lg:col-span-1">
                <div className="h-full flex flex-col justify-center">
                  <h3 className="text-2xl font-extrabold text-gray-900">
                    Advanced Analysis Process
                  </h3>
                  <p className="mt-3 text-lg text-gray-500">
                    Our system uses LangGraphs to provide deep insights into your code structure and quality.
                  </p>
                </div>
              </div>
              <div className="mt-10 -mx-4 relative lg:mt-0 lg:col-span-2">
                <div className="relative space-y-6">
                  {[
                    {
                      step: 1,
                      title: "Upload Your Code",
                      description: "Upload your JavaScript, JSX, or Python file through our secure interface. We validate file types and contents for security."
                    },
                    {
                      step: 2,
                      title: "AI-Powered Analysis",
                      description: "Our LangGraphs-based AI analyzes your code across 6 key categories using advanced pattern recognition."
                    },
                    {
                      step: 3,
                      title: "Comprehensive Report",
                      description: "Receive a detailed breakdown with scores for each category and an overall assessment of your code quality."
                    },
                    {
                      step: 4,
                      title: "Actionable Recommendations",
                      description: "Get specific, practical suggestions to improve your code quality, best practices, and efficiency."
                    }
                  ].map((item) => (
                    <div key={item.step} className="flex items-start">
                      <div className="flex-shrink-0">
                        <div className="flex items-center justify-center h-12 w-12 rounded-md bg-primary text-white">
                          <span className="text-lg font-bold">{item.step}</span>
                        </div>
                      </div>
                      <div className="ml-4">
                        <h4 className="text-lg leading-6 font-medium text-gray-900">{item.title}</h4>
                        <p className="mt-2 text-base text-gray-500">
                          {item.description}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HowItWorks;
