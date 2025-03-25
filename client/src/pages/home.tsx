import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import CodeUpload from "@/components/code-upload";
import { CodeAnalysisResult } from "@/types";

export default function HomePage() {
  const [analysisResults, setAnalysisResults] = useState<CodeAnalysisResult | null>(null);

  const handleAnalysisComplete = (results: CodeAnalysisResult) => {
    setAnalysisResults(results);
  };

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto py-4 px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center">
            <h1 className="text-2xl font-bold text-gray-900">Code Quality Analyzer</h1>
            <nav className="flex space-x-4">
              <a href="#code-analyzer" className="text-gray-500 hover:text-gray-700">Analyzer</a>
              <a href="#about" className="text-gray-500 hover:text-gray-700">About</a>
            </nav>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <div className="bg-gradient-to-r from-blue-50 to-indigo-50">
        <div className="max-w-7xl mx-auto py-16 px-4 sm:py-24 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-4xl font-extrabold text-gray-900 sm:text-5xl sm:tracking-tight lg:text-6xl">
              <span className="block">Improve your code quality with</span>
              <span className="block text-primary">AI-powered analysis</span>
            </h1>
            <p className="max-w-xl mt-5 mx-auto text-xl text-gray-500">
              Our tool analyzes your JavaScript, JSX, or Python code and provides actionable recommendations to improve code quality.
            </p>
            <div className="mt-8 flex justify-center">
              <Button
                as="a"
                href="#code-analyzer"
                size="lg"
                className="px-8 py-3 rounded-md shadow"
              >
                Try it now
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Code Analyzer Section */}
      <CodeUpload 
        onAnalysisComplete={handleAnalysisComplete}
        results={analysisResults}
      />

      {/* About Section */}
      <div id="about" className="py-12 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="lg:text-center mb-10">
            <h2 className="text-base text-primary font-semibold tracking-wide uppercase">About</h2>
            <p className="mt-2 text-3xl leading-8 font-extrabold tracking-tight text-gray-900 sm:text-4xl">
              How it works
            </p>
          </div>
          <div className="mt-10">
            <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
              <Card>
                <CardContent className="p-6">
                  <div className="flex flex-col items-center">
                    <div className="flex items-center justify-center h-12 w-12 rounded-md bg-primary text-white mb-4">
                      1
                    </div>
                    <h3 className="text-lg font-medium text-gray-900 mb-2">Upload your code</h3>
                    <p className="text-gray-500 text-center">
                      Upload your JavaScript, JSX, or Python file using our simple interface.
                    </p>
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-6">
                  <div className="flex flex-col items-center">
                    <div className="flex items-center justify-center h-12 w-12 rounded-md bg-primary text-white mb-4">
                      2
                    </div>
                    <h3 className="text-lg font-medium text-gray-900 mb-2">AI Analysis</h3>
                    <p className="text-gray-500 text-center">
                      Our AI system analyzes your code across 6 key quality categories.
                    </p>
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-6">
                  <div className="flex flex-col items-center">
                    <div className="flex items-center justify-center h-12 w-12 rounded-md bg-primary text-white mb-4">
                      3
                    </div>
                    <h3 className="text-lg font-medium text-gray-900 mb-2">Get Results</h3>
                    <p className="text-gray-500 text-center">
                      Receive a detailed score breakdown and actionable recommendations.
                    </p>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-gray-50">
        <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
          <div className="border-t border-gray-200 pt-8 flex justify-center">
            <p className="text-sm text-gray-500">
              &copy; {new Date().getFullYear()} Code Quality Analyzer. All rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}