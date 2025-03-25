import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import CodeUpload from "@/components/code-upload";
import { CodeAnalysisResult } from "@/types";

export default function HomePage() {
  const [analysisResults, setAnalysisResults] = useState<CodeAnalysisResult | null>(null);

  const handleAnalysisComplete = (results: CodeAnalysisResult) => {
    setAnalysisResults(results);
  };

  return (
    <div className="min-h-screen bg-white">
      {/* Simple Header */}
      <header className="bg-primary text-white py-4">
        <div className="container mx-auto px-4">
          <h1 className="text-2xl font-bold">Code Quality Analyzer</h1>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
        <div className="max-w-3xl mx-auto">
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold mb-4">Upload Your Code for Analysis</h2>
            <p className="text-gray-600">
              Our AI-powered tool will analyze your JavaScript, JSX, or Python code and provide 
              quality scores and recommendations for improvement.
            </p>
          </div>

          {/* Code Upload Component */}
          <CodeUpload 
            onAnalysisComplete={handleAnalysisComplete}
            results={analysisResults}
          />
        </div>
      </main>

      {/* Simple Footer */}
      <footer className="bg-gray-100 py-4 mt-8">
        <div className="container mx-auto px-4 text-center text-gray-600">
          <p>&copy; {new Date().getFullYear()} Code Quality Analyzer</p>
        </div>
      </footer>
    </div>
  );
}