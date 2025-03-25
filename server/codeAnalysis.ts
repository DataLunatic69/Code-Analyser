import { CodeAnalysisResult } from "../client/src/types";
import { exec } from "child_process";
import { promisify } from "util";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

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
    // Check if GROQ_API_KEY is available
    if (!process.env.GROQ_API_KEY) {
      console.warn('No GROQ_API_KEY found in environment variables');
    }
    
    // Call Python script to analyze the code
    const { stdout, stderr } = await execPromise(`python3 ${pythonFilePath} "${tempFilePath}" "${fileName}" "${fileType}"`);
    
    if (stderr && !stderr.includes("Downloading model weights")) {
      console.error('Python script error:', stderr);
    }
    
    // Make sure we're parsing only the JSON part of the output
    try {
      // Find the first { and last } to extract only the JSON part
      const jsonStart = stdout.indexOf('{');
      const jsonEnd = stdout.lastIndexOf('}') + 1;
      
      if (jsonStart >= 0 && jsonEnd > jsonStart) {
        const jsonStr = stdout.substring(jsonStart, jsonEnd);
        const results = JSON.parse(jsonStr) as CodeAnalysisResult;
        return results;
      } else {
        console.error('No valid JSON found in the Python output:', stdout);
        throw new Error('Invalid output format from analysis service');
      }
    } catch (parseError) {
      console.error('Error parsing JSON from Python output:', parseError);
      console.error('Raw output:', stdout);
      throw new Error('Invalid JSON format in analysis results');
    }
  } catch (error) {
    console.error('Error executing Python script:', error);
    
    // Return a proper error response
    throw new Error('Error analyzing code: ' + (error instanceof Error ? error.message : String(error)));
  } finally {
    // Clean up temp file
    await cleanupTempFile(tempFilePath);
  }
}
