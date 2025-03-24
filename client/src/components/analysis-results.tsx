import React, { useEffect, useRef } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { CATEGORIES } from "@/types";
import { CodeAnalysisResult } from "@/types";

interface AnalysisResultsProps {
  results: CodeAnalysisResult;
}

const CircularProgress: React.FC<{ percentage: number, score: number }> = ({ percentage, score }) => {
  const radius = 70;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (percentage / 100) * circumference;

  return (
    <div className="relative inline-flex">
      <svg className="w-40 h-40" viewBox="0 0 160 160">
        <circle 
          className="text-gray-200" 
          strokeWidth="12" 
          stroke="currentColor" 
          fill="transparent" 
          r={radius} 
          cx="80" 
          cy="80"
        />
        <circle 
          className="text-primary transition-all duration-1000 ease-out"
          strokeWidth="12" 
          stroke="currentColor" 
          fill="transparent" 
          r={radius} 
          cx="80" 
          cy="80"
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          transform="rotate(-90 80 80)"
        />
      </svg>
      <div className="absolute inset-0 flex items-center justify-center">
        <span className="text-4xl font-bold text-gray-900">{score}</span>
        <span className="text-xl text-gray-600">/100</span>
      </div>
    </div>
  );
};

const AnalysisResults: React.FC<AnalysisResultsProps> = ({ results }) => {
  const resultsRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (resultsRef.current) {
      resultsRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [results]);

  return (
    <div 
      ref={resultsRef}
      className="max-w-5xl mx-auto mt-10 animate-in fade-in duration-500"
    >
      <Card className="shadow-lg">
        <CardHeader className="border-b border-gray-200">
          <CardTitle>Analysis Results</CardTitle>
          <CardDescription>
            Detailed breakdown of your code's quality across 6 categories.
          </CardDescription>
        </CardHeader>
        
        {/* Overall Score */}
        <CardContent className="flex flex-col items-center justify-center p-6 border-b border-gray-200">
          <div className="text-center mb-4">
            <h4 className="text-xl font-semibold text-gray-900">Overall Score</h4>
            <p className="text-sm text-gray-500">Based on 6 evaluation criteria</p>
          </div>
          
          <CircularProgress percentage={results.overallScore} score={results.overallScore} />
        </CardContent>
        
        {/* Category Scores */}
        <CardContent className="px-4 py-5 sm:p-6">
          <h4 className="text-lg font-medium text-gray-900 mb-4">Category Scores</h4>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {CATEGORIES.map((category, index) => {
              const scoreKey = category.name.toLowerCase().replace(/\s+/g, '') as keyof typeof results.categoryScores;
              let score = 0;
              
              // Map category names to the actual keys in the results object
              switch (index) {
                case 0: score = results.categoryScores.namingConventions; break;
                case 1: score = results.categoryScores.functionLength; break;
                case 2: score = results.categoryScores.commentsDocumentation; break;
                case 3: score = results.categoryScores.formatting; break;
                case 4: score = results.categoryScores.reusability; break;
                case 5: score = results.categoryScores.bestPractices; break;
              }
              
              const percentage = (score / category.maxScore) * 100;
              
              return (
                <div key={index} className="bg-gray-50 p-4 rounded-lg">
                  <div className="flex justify-between items-center mb-2">
                    <span className="font-medium text-gray-900">{category.name}</span>
                    <span className="font-medium text-primary">{score}/{category.maxScore}</span>
                  </div>
                  <Progress value={percentage} className="h-2.5" />
                </div>
              );
            })}
          </div>
        </CardContent>
        
        {/* Recommendations */}
        <CardContent className="px-4 py-5 sm:p-6 border-t border-gray-200">
          <h4 className="text-lg font-medium text-gray-900 mb-4">Recommendations</h4>
          
          <div className="space-y-4">
            {results.recommendations.map((recommendation, index) => (
              <div key={index} className="bg-green-50 border-l-4 border-green-400 p-4">
                <div className="flex">
                  <div className="flex-shrink-0">
                    <i className="fas fa-lightbulb text-green-400"></i>
                  </div>
                  <div className="ml-3">
                    <p className="text-sm text-green-700">
                      {recommendation}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
        
        {/* Code Sample */}
        <CardContent className="px-4 py-5 sm:p-6 border-t border-gray-200">
          <h4 className="text-lg font-medium text-gray-900 mb-4">Your Code</h4>
          
          <div className="bg-gray-800 rounded-md overflow-hidden">
            <pre className="p-4 text-sm text-white font-mono whitespace-pre overflow-x-auto">
              <code>{results.codeContent}</code>
            </pre>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default AnalysisResults;
