import type { Express, Request, Response } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { waitlistFormSchema } from "@shared/schema";
import { analyzeCode } from "./codeAnalysis";
import { ZodError } from "zod";
import { fromZodError } from "zod-validation-error";
import { exec } from "child_process";
import { promisify } from "util";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const execPromise = promisify(exec);

// Helper to get current directory with ESM
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export async function registerRoutes(app: Express): Promise<Server> {
  // Set up file upload middleware
  const multer = await import("multer");
  const upload = multer.default({
    storage: multer.default.memoryStorage(),
    limits: {
      fileSize: 5 * 1024 * 1024, // 5MB limit
    },
    fileFilter: (req, file, cb) => {
      // Accept only .js, .jsx, and .py files
      const allowedExtensions = ['.js', '.jsx', '.py'];
      const ext = path.extname(file.originalname).toLowerCase();
      if (allowedExtensions.includes(ext)) {
        cb(null, true);
      } else {
        cb(new Error('Invalid file type. Only .js, .jsx, and .py files are allowed.'));
      }
    }
  });

  // API routes
  app.post('/api/analyze-code', upload.single('file'), async (req: Request, res: Response) => {
    try {
      if (!req.file) {
        return res.status(400).json({ message: 'No file uploaded' });
      }

      const file = req.file;
      const fileContent = file.buffer.toString('utf-8');
      const fileType = path.extname(file.originalname).substring(1);
      
      // Analyze the code
      const analysis = await analyzeCode(fileContent, file.originalname, fileType);
      
      // Store analysis in database if needed
      const timestamp = new Date().toISOString();
      const savedAnalysis = await storage.createCodeAnalysis({
        fileName: file.originalname,
        fileType,
        codeContent: fileContent,
        overallScore: analysis.overallScore,
        namingScore: analysis.categoryScores.namingConventions,
        functionScore: analysis.categoryScores.functionLength,
        commentsScore: analysis.categoryScores.commentsDocumentation,
        formattingScore: analysis.categoryScores.formatting,
        reusabilityScore: analysis.categoryScores.reusability,
        bestPracticesScore: analysis.categoryScores.bestPractices,
        recommendations: analysis.recommendations,
        createdAt: timestamp
      });

      return res.status(200).json(analysis);
    } catch (error) {
      console.error('Error analyzing code:', error);
      return res.status(500).json({ 
        message: 'Error analyzing code', 
        error: error instanceof Error ? error.message : 'Unknown error' 
      });
    }
  });

  // Join waitlist route
  app.post('/api/join-waitlist', async (req: Request, res: Response) => {
    try {
      const validatedData = waitlistFormSchema.parse(req.body);
      
      // Check if email already exists
      const existingEntry = await storage.getWaitlistByEmail(validatedData.email);
      if (existingEntry) {
        return res.status(400).json({ message: 'This email is already on our waitlist' });
      }
      
      // Add to waitlist
      const timestamp = new Date().toISOString();
      const waitlistEntry = await storage.addToWaitlist({
        ...validatedData,
        createdAt: timestamp
      });
      
      return res.status(201).json({ message: 'Successfully joined the waitlist' });
    } catch (error) {
      if (error instanceof ZodError) {
        const validationError = fromZodError(error);
        return res.status(400).json({ message: validationError.message });
      }
      
      console.error('Error joining waitlist:', error);
      return res.status(500).json({ 
        message: 'Error joining waitlist',
        error: error instanceof Error ? error.message : 'Unknown error'
      });
    }
  });

  // Check if Python service is available
  app.get('/api/health', async (req: Request, res: Response) => {
    try {
      // Check if Python is installed
      await execPromise("python --version");
      res.status(200).json({ status: 'ok', message: 'Service is healthy' });
    } catch (error) {
      res.status(500).json({ 
        status: 'error', 
        message: 'Python is not available', 
        error: error instanceof Error ? error.message : 'Unknown error'
      });
    }
  });

  const httpServer = createServer(app);

  return httpServer;
}
