import React, { useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { Card, CardContent } from "@/components/ui/card";
import { CodeAnalysisResult } from "@/types";
import AnalysisResults from "@/components/analysis-results";

interface CodeUploadProps {
  onAnalysisComplete: (results: CodeAnalysisResult) => void;
  results: CodeAnalysisResult | null;
}

const CodeUpload: React.FC<CodeUploadProps> = ({ onAnalysisComplete, results }) => {
  const [file, setFile] = useState<File | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      validateAndSetFile(e.target.files[0]);
    }
  };

  const validateAndSetFile = (selectedFile: File) => {
    const fileExtension = selectedFile.name.split('.').pop()?.toLowerCase();
    const validExtensions = ['js', 'jsx', 'py'];
    
    if (!fileExtension || !validExtensions.includes(fileExtension)) {
      toast({
        title: "Invalid file type",
        description: "Please upload a .js, .jsx, or .py file.",
        variant: "destructive",
      });
      return;
    }
    
    if (selectedFile.size > 5 * 1024 * 1024) { // 5MB
      toast({
        title: "File too large",
        description: "Please upload a file smaller than 5MB.",
        variant: "destructive",
      });
      return;
    }
    
    setFile(selectedFile);
  };

  const handleRemoveFile = () => {
    setFile(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleAnalyzeCode = async () => {
    if (!file) return;
    
    setIsLoading(true);
    
    try {
      const formData = new FormData();
      formData.append('file', file);
      
      const response = await fetch('/api/analyze-code', {
        method: 'POST',
        body: formData,
        credentials: 'include',
      });
      
      if (!response.ok) {
        throw new Error(`Error: ${response.status}`);
      }
      
      const data = await response.json() as CodeAnalysisResult;
      onAnalysisComplete(data);
      
      toast({
        title: "Analysis complete",
        description: "Your code has been analyzed successfully.",
      });
    } catch (error) {
      console.error('Error analyzing code:', error);
      toast({
        title: "Analysis failed",
        description: error instanceof Error ? error.message : "An unknown error occurred",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div>
      <Card className="mb-6">
        <CardContent className="p-6">
          <div className="flex flex-col items-center">
            <div className="w-full">
              <div className="flex flex-col items-center mb-4">
                <h3 className="text-lg font-medium mb-2">Select a code file to analyze</h3>
                <p className="text-sm text-gray-500 mb-4">
                  Supported file types: .js, .jsx, .py (Max 5MB)
                </p>
                
                <div className="flex items-center gap-4">
                  <input 
                    type="file" 
                    id="file-upload"
                    className="hidden" 
                    ref={fileInputRef}
                    onChange={handleFileChange}
                    accept=".js,.jsx,.py" 
                  />
                  
                  <Button
                    onClick={() => fileInputRef.current?.click()}
                    className="px-4"
                  >
                    Select File
                  </Button>
                  
                  <Button
                    onClick={handleAnalyzeCode}
                    disabled={!file || isLoading}
                    className="px-4"
                    variant="default"
                  >
                    {isLoading ? "Analyzing..." : "Analyze Code"}
                  </Button>
                </div>
              </div>
              
              {file && (
                <div className="mt-4 p-3 bg-gray-50 rounded-md">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      <span className="text-sm font-medium">Selected file: {file.name}</span>
                    </div>
                    <Button 
                      variant="ghost"
                      size="sm"
                      onClick={handleRemoveFile}
                      className="text-red-500 h-auto p-1"
                    >
                      Remove
                    </Button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </CardContent>
      </Card>

      {results && <AnalysisResults results={results} />}
    </div>
  );
};

export default CodeUpload;
