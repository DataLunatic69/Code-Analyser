import React, { useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import { CodeAnalysisResult } from "@/types";
import AnalysisResults from "@/components/analysis-results";

interface CodeUploadProps {
  onAnalysisComplete: (results: CodeAnalysisResult) => void;
  results: CodeAnalysisResult | null;
}

const CodeUpload: React.FC<CodeUploadProps> = ({ onAnalysisComplete, results }) => {
  const [file, setFile] = useState<File | null>(null);
  const [isDragging, setIsDragging] = useState(false);
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

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      validateAndSetFile(e.dataTransfer.files[0]);
    }
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
    <div id="code-analyzer" className="py-12 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="lg:text-center mb-10">
          <h2 className="text-base text-primary font-semibold tracking-wide uppercase">Try It Now</h2>
          <p className="mt-2 text-3xl leading-8 font-extrabold tracking-tight text-gray-900 sm:text-4xl">
            Analyze Your Code
          </p>
          <p className="mt-4 max-w-2xl text-xl text-gray-500 lg:mx-auto">
            Upload your JavaScript, JSX, or Python file to get instant feedback and recommendations.
          </p>
        </div>

        <div className="max-w-3xl mx-auto">
          <div 
            className={`border-2 border-dashed rounded-lg p-6 flex flex-col items-center justify-center bg-white
              ${isDragging ? 'border-primary bg-primary/5' : 'border-gray-300'}
              ${file ? 'border-primary/50' : ''}`}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
          >
            <div className="flex flex-col items-center text-center">
              <i className="fas fa-cloud-upload-alt text-4xl text-gray-400 mb-4"></i>
              <h3 className="text-lg font-medium text-gray-900">Upload your code file</h3>
              <p className="text-sm text-gray-500 mt-1">
                Drag and drop your file here, or click to browse
              </p>
              <p className="text-xs text-gray-400 mt-2">
                Accepts .js, .jsx, and .py files up to 5MB
              </p>
            </div>
            
            <input 
              type="file" 
              className="hidden" 
              ref={fileInputRef}
              onChange={handleFileChange}
              accept=".js,.jsx,.py" 
            />
            
            <Button
              onClick={() => fileInputRef.current?.click()}
              className="mt-4"
              variant="default"
            >
              Browse Files
            </Button>
            
            {file && (
              <div className="mt-4">
                <div className="flex items-center space-x-2">
                  <i className="fas fa-file-code text-primary"></i>
                  <span className="text-sm font-medium">{file.name}</span>
                  <button 
                    className="text-red-500 hover:text-red-700"
                    onClick={handleRemoveFile}
                  >
                    <i className="fas fa-times"></i>
                  </button>
                </div>
              </div>
            )}
          </div>
          
          <div className="mt-4 flex justify-center">
            <Button
              onClick={handleAnalyzeCode}
              disabled={!file || isLoading}
              className="px-6 py-3 flex items-center justify-center"
            >
              {isLoading ? (
                <>
                  <i className="fas fa-spinner fa-spin mr-2"></i>
                  Analyzing...
                </>
              ) : (
                <>
                  <i className="fas fa-code-branch mr-2"></i>
                  Analyze Code
                </>
              )}
            </Button>
          </div>
        </div>

        {results && <AnalysisResults results={results} />}
      </div>
    </div>
  );
};

export default CodeUpload;
