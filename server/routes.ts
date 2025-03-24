import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { exec } from "child_process";
import { spawn } from "child_process";
import fs from "fs";
import path from "path";
import { validFileTypes, insertWaitlistEntrySchema } from "@shared/schema";
import { z } from "zod";
import multer from "multer";
import { randomUUID } from "crypto";

const ensurePythonBackendStarted = () => {
  // Check if the Python backend is already running
  const isRunning = fs.existsSync("./python_backend.pid");
  
  if (!isRunning) {
    // Start the Python backend
    const pythonProcess = spawn("python", ["server/analyzer.py"], {
      detached: true,
      stdio: "ignore",
    });
    
    // Store the process ID
    fs.writeFileSync("./python_backend.pid", pythonProcess.pid.toString());
    
    // Unref the child process to allow the node process to exit
    pythonProcess.unref();
    
    console.log("Python backend started with PID:", pythonProcess.pid);
  }
};

export async function registerRoutes(app: Express): Promise<Server> {
  // Set up file storage for code uploads
  const storage = multer.diskStorage({
    destination: function (req, file, cb) {
      const uploadDir = path.join(__dirname, 'uploads');
      
      // Create the directory if it doesn't exist
      if (!fs.existsSync(uploadDir)) {
        fs.mkdirSync(uploadDir, { recursive: true });
      }
      
      cb(null, uploadDir);
    },
    filename: function (req, file, cb) {
      // Generate a unique filename
      const uniqueFilename = `${randomUUID()}-${file.originalname}`;
      cb(null, uniqueFilename);
    }
  });
  
  const upload = multer({
    storage,
    fileFilter: (req, file, cb) => {
      const fileExt = path.extname(file.originalname).toLowerCase();
      if (validFileTypes.includes(fileExt)) {
        return cb(null, true);
      }
      cb(new Error(`Only ${validFileTypes.join(', ')} files are allowed`));
    },
    limits: {
      fileSize: 5 * 1024 * 1024, // 5MB
    },
  });
  
  // Start the Python backend
  ensurePythonBackendStarted();
  
  // Waitlist API endpoint
  app.post('/api/waitlist', async (req, res) => {
    try {
      const validatedData = insertWaitlistEntrySchema.parse(req.body);
      const entry = await storage.createWaitlistEntry(validatedData);
      res.status(201).json({ success: true, data: entry });
    } catch (error) {
      if (error instanceof z.ZodError) {
        res.status(400).json({ 
          success: false, 
          message: 'Validation error', 
          errors: error.errors 
        });
      } else {
        console.error('Error creating waitlist entry:', error);
        res.status(500).json({ 
          success: false, 
          message: 'Failed to join waitlist'
        });
      }
    }
  });
  
  // Code analysis API endpoint
  app.post('/api/analyze-code', upload.single('file'), async (req, res) => {
    if (!req.file) {
      return res.status(400).json({ 
        success: false, 
        message: 'No file uploaded'
      });
    }
    
    try {
      // File details
      const filePath = req.file.path;
      const fileName = req.file.originalname;
      const fileType = path.extname(fileName);
      
      // Read file content
      const fileContent = fs.readFileSync(filePath, 'utf-8');
      
      // Make request to Python backend
      const analysisResult = await fetch('http://localhost:8000/analyze', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          file_content: fileContent,
          file_name: fileName,
          file_type: fileType
        }),
      });
      
      if (!analysisResult.ok) {
        throw new Error(`Analysis failed with status: ${analysisResult.status}`);
      }
      
      const analysisData = await analysisResult.json();
      
      // Save analysis to storage
      const savedAnalysis = await storage.createCodeAnalysis({
        fileName,
        fileType,
        namingScore: analysisData.category_scores.naming,
        modularityScore: analysisData.category_scores.modularity,
        documentationScore: analysisData.category_scores.documentation,
        formattingScore: analysisData.category_scores.formatting,
        reusabilityScore: analysisData.category_scores.reusability,
        bestPracticesScore: analysisData.category_scores.best_practices,
        totalScore: analysisData.total_score,
        recommendations: analysisData.recommendations,
      });
      
      // Cleanup uploaded file
      fs.unlinkSync(filePath);
      
      // Return the analysis results
      res.status(200).json({
        success: true,
        data: savedAnalysis
      });
    } catch (error) {
      console.error('Error analyzing code:', error);
      res.status(500).json({ 
        success: false, 
        message: 'Failed to analyze code',
        error: error instanceof Error ? error.message : 'Unknown error'
      });
    }
  });
  
  // Get recent analyses
  app.get('/api/recent-analyses', async (req, res) => {
    try {
      const analyses = await storage.getRecentCodeAnalyses(5);
      res.status(200).json({ success: true, data: analyses });
    } catch (error) {
      console.error('Error fetching recent analyses:', error);
      res.status(500).json({ 
        success: false, 
        message: 'Failed to fetch recent analyses'
      });
    }
  });

  const httpServer = createServer(app);

  return httpServer;
}
