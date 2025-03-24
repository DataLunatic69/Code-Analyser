import { useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Code, X, Download, FileText } from "lucide-react";
import { validFileTypes } from "@shared/schema";
import { useMutation } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import AnalysisResult from "./analysis-result";

export default function UploadForm() {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();

  const { mutate, isPending, data, reset } = useMutation({
    mutationFn: async (file: File) => {
      const formData = new FormData();
      formData.append("file", file);
      
      const response = await fetch("/api/analyze-code", {
        method: "POST",
        body: formData,
        credentials: "include",
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to analyze code");
      }
      
      return response.json();
    },
    onSuccess: () => {
      toast({
        title: "Analysis Complete",
        description: "Your code has been successfully analyzed.",
      });
    },
    onError: (error) => {
      toast({
        title: "Analysis Failed",
        description: error.message || "Failed to analyze code. Please try again.",
        variant: "destructive",
      });
    },
  });

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      validateAndSetFile(file);
    }
  };

  const validateAndSetFile = (file: File) => {
    const fileExt = `.${file.name.split('.').pop()?.toLowerCase() || ''}`;
    
    if (!validFileTypes.includes(fileExt)) {
      toast({
        title: "Invalid File Type",
        description: `Please select a ${validFileTypes.join(', ')} file.`,
        variant: "destructive",
      });
      return;
    }
    
    if (file.size > 5 * 1024 * 1024) {  // 5MB
      toast({
        title: "File Too Large",
        description: "Please select a file under 5MB.",
        variant: "destructive",
      });
      return;
    }
    
    setSelectedFile(file);
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
    
    const file = e.dataTransfer.files[0];
    if (file) {
      validateAndSetFile(file);
    }
  };

  const removeFile = () => {
    setSelectedFile(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!selectedFile) {
      toast({
        title: "No File Selected",
        description: "Please select a file to analyze.",
        variant: "destructive",
      });
      return;
    }
    
    mutate(selectedFile);
  };

  const handleNewAnalysis = () => {
    reset();
    setSelectedFile(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  return (
    <div className="mt-10 max-w-4xl mx-auto">
      {!data && !isPending && (
        <Card className="bg-white shadow-md rounded-lg">
          <CardContent className="p-6">
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label htmlFor="fileUpload" className="block text-sm font-medium text-gray-700">Upload code file</label>
                <div
                  className={`mt-1 flex justify-center px-6 pt-5 pb-6 border-2 ${
                    isDragging ? 'border-primary' : 'border-gray-300'
                  } border-dashed rounded-md`}
                  onDragOver={handleDragOver}
                  onDragLeave={handleDragLeave}
                  onDrop={handleDrop}
                >
                  <div className="space-y-1 text-center">
                    <Code className="mx-auto h-12 w-12 text-gray-400" />
                    <div className="flex text-sm text-gray-600">
                      <label
                        htmlFor="fileUpload"
                        className="relative cursor-pointer bg-white rounded-md font-medium text-primary hover:text-primary/90 focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-primary"
                      >
                        <span>Upload a file</span>
                        <input
                          id="fileUpload"
                          name="fileUpload"
                          type="file"
                          className="sr-only"
                          accept={validFileTypes.join(',')}
                          onChange={handleFileChange}
                          ref={fileInputRef}
                        />
                      </label>
                      <p className="pl-1">or drag and drop</p>
                    </div>
                    <p className="text-xs text-gray-500">
                      {validFileTypes.join(', ')} files up to 5MB
                    </p>
                  </div>
                </div>
                {selectedFile && (
                  <div className="mt-2">
                    <div className="flex items-center">
                      <FileText className="text-primary mr-2 h-5 w-5" />
                      <span className="text-sm font-medium text-gray-900">{selectedFile.name}</span>
                      <button
                        type="button"
                        onClick={removeFile}
                        className="ml-auto text-gray-400 hover:text-gray-500"
                      >
                        <X className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                )}
              </div>
              <Button
                type="submit"
                className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary"
                disabled={!selectedFile}
              >
                Analyze Code
              </Button>
            </form>
          </CardContent>
        </Card>
      )}

      {isPending && (
        <Card className="bg-white shadow-md rounded-lg overflow-hidden">
          <div className="p-8 flex flex-col items-center">
            <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-primary"></div>
            <p className="mt-4 text-lg font-medium text-gray-900">Analyzing your code...</p>
            <p className="text-sm text-gray-500">This may take a few moments</p>
          </div>
        </Card>
      )}

      {data && data.success && (
        <AnalysisResult 
          analysis={data.data} 
          onNewAnalysis={handleNewAnalysis} 
        />
      )}
    </div>
  );
}
