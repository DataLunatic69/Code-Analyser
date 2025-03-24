import { CodeAnalysisResult } from "../client/src/types";
import { exec } from "child_process";
import { promisify } from "util";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import { createWriteStream } from "fs";

const execPromise = promisify(exec);

// Helper to get current directory with ESM
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const pythonFilePath = path.join(__dirname, 'pythonService.py');

// Function to write code content to temporary file for Python service to analyze
async function writeCodeToTempFile(code: string, fileType: string): Promise<string> {
  const tempDir = path.join(__dirname, 'temp');
  
  // Create temp directory if it doesn't exist
  if (!fs.existsSync(tempDir)) {
    fs.mkdirSync(tempDir, { recursive: true });
  }
  
  // Create a unique filename
  const timestamp = new Date().getTime();
  const filename = `code_${timestamp}.${fileType}`;
  const filePath = path.join(tempDir, filename);
  
  // Write the code to the file
  await fs.promises.writeFile(filePath, code, 'utf8');
  
  return filePath;
}

// Clean up temp files after analysis
async function cleanupTempFile(filePath: string) {
  try {
    if (fs.existsSync(filePath)) {
      await fs.promises.unlink(filePath);
    }
  } catch (error) {
    console.error('Error cleaning up temp file:', error);
  }
}

export async function analyzeCode(
  codeContent: string, 
  fileName: string, 
  fileType: string
): Promise<CodeAnalysisResult> {
  // Write code to temp file for Python service to analyze
  const tempFilePath = await writeCodeToTempFile(codeContent, fileType);
  
  try {
    // Call Python script to analyze the code
    const { stdout, stderr } = await execPromise(`python ${pythonFilePath} "${tempFilePath}" "${fileName}" "${fileType}"`);
    
    if (stderr) {
      console.error('Python script error:', stderr);
      throw new Error('Error analyzing code in Python service');
    }
    
    // Parse the results
    const results = JSON.parse(stdout) as CodeAnalysisResult;
    return results;
  } catch (error) {
    console.error('Error executing Python script:', error);
    
    // If we encounter an error, return a mock analysis result for now
    // In production, we'd handle this more gracefully
    return {
      fileName,
      fileType,
      codeContent,
      overallScore: 0,
      categoryScores: {
        namingConventions: 0,
        functionLength: 0,
        commentsDocumentation: 0,
        formatting: 0,
        reusability: 0,
        bestPractices: 0
      },
      recommendations: [
        "Error analyzing code. Please try again with a different file."
      ]
    };
  } finally {
    // Clean up temp file
    await cleanupTempFile(tempFilePath);
  }
}
