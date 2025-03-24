import { Button } from "@/components/ui/button";

interface HeroProps {
  onNavigate: (sectionId: string) => void;
}

export default function Hero({ onNavigate }: HeroProps) {
  return (
    <div className="relative bg-white overflow-hidden">
      <div className="max-w-7xl mx-auto">
        <div className="relative z-10 pb-8 bg-white sm:pb-16 md:pb-20 lg:max-w-2xl lg:w-full lg:pb-28 xl:pb-32">
          <main className="mt-10 mx-auto max-w-7xl px-4 sm:mt-12 sm:px-6 md:mt-16 lg:mt-20 lg:px-8 xl:mt-28">
            <div className="sm:text-center lg:text-left">
              <h1 className="text-4xl tracking-tight font-extrabold text-gray-900 sm:text-5xl md:text-6xl">
                <span className="block">Elevate your</span>
                <span className="block text-primary">code quality</span>
              </h1>
              <p className="mt-3 text-base text-gray-500 sm:mt-5 sm:text-lg sm:max-w-xl sm:mx-auto md:mt-5 md:text-xl lg:mx-0">
                Upload your code and get instant feedback on quality, best practices, and improvement suggestions powered by AI.
              </p>
              <div className="mt-5 sm:mt-8 sm:flex sm:justify-center lg:justify-start">
                <div className="rounded-md shadow">
                  <Button
                    onClick={() => onNavigate("upload")}
                    className="w-full flex items-center justify-center px-8 py-3 text-base font-medium rounded-md text-white bg-primary hover:bg-primary/90 md:py-4 md:text-lg md:px-10"
                  >
                    Try it now
                  </Button>
                </div>
                <div className="mt-3 sm:mt-0 sm:ml-3">
                  <Button
                    onClick={() => onNavigate("waitlist")}
                    variant="outline"
                    className="w-full flex items-center justify-center px-8 py-3 text-base font-medium rounded-md text-primary bg-blue-100 hover:bg-blue-200 md:py-4 md:text-lg md:px-10"
                  >
                    Join waitlist
                  </Button>
                </div>
              </div>
            </div>
          </main>
        </div>
      </div>
      <div className="lg:absolute lg:inset-y-0 lg:right-0 lg:w-1/2 bg-gray-100 flex items-center justify-center p-8">
        <div className="bg-white shadow-lg rounded-lg p-4 max-w-md w-full transform hover:-translate-y-1 transition-transform duration-300">
          <div className="flex items-center mb-4">
            <div className="h-3 w-3 bg-red-500 rounded-full mr-2"></div>
            <div className="h-3 w-3 bg-yellow-500 rounded-full mr-2"></div>
            <div className="h-3 w-3 bg-green-500 rounded-full"></div>
          </div>
          <pre className="bg-gray-900 rounded text-xs text-green-400 p-3 overflow-hidden">
            <code>
              <span className="text-blue-400">def</span> <span className="text-yellow-400">analyze_code</span>(file_content):
                  <span className="text-purple-400">"""Analyze code quality and return score"""</span>
                  score = {"{"} 
                      <span className="text-yellow-400">"naming"</span>: 8,
                      <span className="text-yellow-400">"modularity"</span>: 15,
                      <span className="text-yellow-400">"documentation"</span>: 18,
                      <span className="text-yellow-400">"formatting"</span>: 14,
                      <span className="text-yellow-400">"reusability"</span>: 12,
                      <span className="text-yellow-400">"best_practices"</span>: 16
                  {"}"}
                  <span className="text-blue-400">return</span> {"{"} 
                      <span className="text-yellow-400">"total"</span>: sum(score.values()),
                      <span className="text-yellow-400">"details"</span>: score,
                      <span className="text-yellow-400">"suggestions"</span>: get_suggestions(score)
                  {"}"}
            </code>
          </pre>
        </div>
      </div>
    </div>
  );
}
