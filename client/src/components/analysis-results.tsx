import React, { useEffect, useRef } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { CATEGORIES } from "@/types";
import { CodeAnalysisResult } from "@/types";

interface AnalysisResultsProps {
  results: CodeAnalysisResult;
}

const ScoreCircle: React.FC<{ score: number }> = ({ score }) => {
  return (
    <div className="flex items-center justify-center w-24 h-24 rounded-full border-4 border-primary bg-primary/10">
      <div className="text-center">
        <span className="text-3xl font-bold">{score}</span>
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
      className="mb-8 animate-in fade-in duration-300"
    >
      <Card className="shadow">
        <CardHeader className="bg-gray-50">
          <CardTitle>Analysis Results for {results.fileName}</CardTitle>
        </CardHeader>
        
        {/* Overall Score */}
        <CardContent className="p-6">
          <div className="flex flex-col md:flex-row items-center gap-6 mb-8 pb-6 border-b">
            <ScoreCircle score={results.overallScore} />
            <div>
              <h4 className="text-xl font-semibold mb-2">Overall Score: {results.overallScore}/100</h4>
              <p className="text-gray-600">
                This score represents the overall quality of your code based on six key metrics.
              </p>
            </div>
          </div>
          
          {/* Categories */}
          <div className="mb-8">
            <h4 className="text-lg font-medium mb-4">Category Scores</h4>
            <div className="space-y-4">
              {CATEGORIES.map((category, index) => {
                let score = 0;
                
                // Map to score keys
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
                  <div key={index}>
                    <div className="flex justify-between items-center mb-1">
                      <span className="font-medium">{category.name}</span>
                      <span>{score}/{category.maxScore}</span>
                    </div>
                    <Progress value={percentage} className="h-2" />
                  </div>
                );
              })}
            </div>
          </div>
          
          {/* Recommendations */}
          <div className="mb-8">
            <h4 className="text-lg font-medium mb-4">Recommendations</h4>
            <ul className="space-y-2 list-disc pl-5">
              {results.recommendations.map((recommendation, index) => (
                <li key={index} className="text-gray-700">
                  {recommendation}
                </li>
              ))}
            </ul>
          </div>
          
          {/* Code Preview */}
          <div>
            <h4 className="text-lg font-medium mb-4">Code Preview</h4>
            <div className="bg-gray-900 rounded overflow-hidden">
              <pre className="p-4 text-sm text-white font-mono whitespace-pre overflow-x-auto max-h-[300px]">
                <code>{results.codeContent}</code>
              </pre>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default AnalysisResults;
