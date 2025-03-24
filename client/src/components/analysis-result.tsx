import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Download, ArrowUpRight } from "lucide-react";
import { CodeAnalysis } from "@shared/schema";

interface AnalysisResultProps {
  analysis: CodeAnalysis;
  onNewAnalysis: () => void;
}

export default function AnalysisResult({ analysis, onNewAnalysis }: AnalysisResultProps) {
  const [downloading, setDownloading] = useState(false);

  const getScoreColor = (score: number, maxScore: number) => {
    const percentage = (score / maxScore) * 100;
    if (percentage >= 80) return "bg-green-100 text-green-800";
    if (percentage >= 60) return "bg-yellow-100 text-yellow-800";
    return "bg-red-100 text-red-800";
  };

  const getTotalScoreColor = (score: number) => {
    if (score >= 80) return "bg-green-100 text-green-800";
    if (score >= 60) return "bg-yellow-100 text-yellow-800";
    return "bg-red-100 text-red-800";
  };

  const handleDownloadReport = () => {
    setDownloading(true);
    
    // Create the report content
    const reportContent = `
# Code Quality Analysis Report

File: ${analysis.fileName}
Date: ${new Date(analysis.createdAt).toLocaleString()}
Total Score: ${analysis.totalScore}/100

## Category Breakdown

- Naming conventions: ${analysis.namingScore}/10
- Function length and modularity: ${analysis.modularityScore}/20
- Comments and documentation: ${analysis.documentationScore}/20
- Formatting/indentation: ${analysis.formattingScore}/15
- Reusability and DRY: ${analysis.reusabilityScore}/15
- Best practices in web dev: ${analysis.bestPracticesScore}/20

## Recommendations

${analysis.recommendations.map((rec: string, index: number) => `${index + 1}. ${rec}`).join('\n')}
`;

    // Create a blob and download it
    const blob = new Blob([reportContent], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `code-quality-report-${analysis.fileName}.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    
    setDownloading(false);
  };

  return (
    <Card className="bg-white shadow-md rounded-lg overflow-hidden">
      <div className="p-6 border-b border-gray-200">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-medium text-gray-900">Analysis Results</h3>
          <span 
            className={`px-3 py-1 rounded-full text-sm font-semibold ${getTotalScoreColor(analysis.totalScore)}`}
          >
            Score: {analysis.totalScore}/100
          </span>
        </div>
      </div>

      <div className="px-6 py-4">
        <h4 className="text-md font-medium text-gray-900 mb-3">Category Breakdown</h4>
        
        <div className="space-y-4">
          <div className="category-score">
            <div className="flex justify-between items-center mb-1">
              <span className="text-sm font-medium text-gray-900">Naming conventions</span>
              <span className="text-sm text-gray-500">{analysis.namingScore}/10</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2.5">
              <div 
                className="bg-primary h-2.5 rounded-full" 
                style={{ width: `${(analysis.namingScore / 10) * 100}%` }}
              ></div>
            </div>
          </div>

          <div className="category-score">
            <div className="flex justify-between items-center mb-1">
              <span className="text-sm font-medium text-gray-900">Function length and modularity</span>
              <span className="text-sm text-gray-500">{analysis.modularityScore}/20</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2.5">
              <div 
                className="bg-primary h-2.5 rounded-full" 
                style={{ width: `${(analysis.modularityScore / 20) * 100}%` }}
              ></div>
            </div>
          </div>

          <div className="category-score">
            <div className="flex justify-between items-center mb-1">
              <span className="text-sm font-medium text-gray-900">Comments and documentation</span>
              <span className="text-sm text-gray-500">{analysis.documentationScore}/20</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2.5">
              <div 
                className="bg-primary h-2.5 rounded-full" 
                style={{ width: `${(analysis.documentationScore / 20) * 100}%` }}
              ></div>
            </div>
          </div>

          <div className="category-score">
            <div className="flex justify-between items-center mb-1">
              <span className="text-sm font-medium text-gray-900">Formatting/indentation</span>
              <span className="text-sm text-gray-500">{analysis.formattingScore}/15</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2.5">
              <div 
                className="bg-primary h-2.5 rounded-full" 
                style={{ width: `${(analysis.formattingScore / 15) * 100}%` }}
              ></div>
            </div>
          </div>

          <div className="category-score">
            <div className="flex justify-between items-center mb-1">
              <span className="text-sm font-medium text-gray-900">Reusability and DRY</span>
              <span className="text-sm text-gray-500">{analysis.reusabilityScore}/15</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2.5">
              <div 
                className="bg-primary h-2.5 rounded-full" 
                style={{ width: `${(analysis.reusabilityScore / 15) * 100}%` }}
              ></div>
            </div>
          </div>

          <div className="category-score">
            <div className="flex justify-between items-center mb-1">
              <span className="text-sm font-medium text-gray-900">Best practices in web dev</span>
              <span className="text-sm text-gray-500">{analysis.bestPracticesScore}/20</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2.5">
              <div 
                className="bg-primary h-2.5 rounded-full" 
                style={{ width: `${(analysis.bestPracticesScore / 20) * 100}%` }}
              ></div>
            </div>
          </div>
        </div>
      </div>

      <div className="px-6 py-4 bg-gray-50">
        <h4 className="text-md font-medium text-gray-900 mb-3">Recommendations</h4>
        <ul className="list-disc pl-5 space-y-2 text-gray-600">
          {Array.isArray(analysis.recommendations) && analysis.recommendations.map((recommendation: string, index: number) => (
            <li key={index}>{recommendation}</li>
          ))}
        </ul>
      </div>

      <div className="px-6 py-4 border-t border-gray-200">
        <div className="flex flex-col sm:flex-row gap-4">
          <Button
            onClick={handleDownloadReport}
            variant="outline"
            className="flex-1 py-2 px-4 border border-primary rounded-md shadow-sm text-sm font-medium text-primary bg-white hover:bg-blue-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary"
            disabled={downloading}
          >
            <Download className="h-4 w-4 mr-2" />
            Download Report
          </Button>
          <Button
            onClick={onNewAnalysis}
            className="flex-1 py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary"
          >
            Analyze Another File
          </Button>
        </div>
      </div>
    </Card>
  );
}
