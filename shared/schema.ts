import { pgTable, text, serial, integer, boolean, jsonb } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

// Original users table (keep this as required by project structure)
export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
});

export const insertUserSchema = createInsertSchema(users).pick({
  username: true,
  password: true,
});

export type InsertUser = z.infer<typeof insertUserSchema>;
export type User = typeof users.$inferSelect;

// Code analysis results table
export const codeAnalyses = pgTable("code_analyses", {
  id: serial("id").primaryKey(),
  fileName: text("file_name").notNull(),
  fileType: text("file_type").notNull(),
  codeContent: text("code_content").notNull(),
  overallScore: integer("overall_score").notNull(),
  // Category breakdown scores - use names that match our frontend
  namingScore: integer("naming_score").notNull(),
  functionScore: integer("function_score").notNull(),
  commentsScore: integer("comments_score").notNull(),
  formattingScore: integer("formatting_score").notNull(),
  reusabilityScore: integer("reusability_score").notNull(),
  bestPracticesScore: integer("best_practices_score").notNull(),
  recommendations: jsonb("recommendations").notNull().$type<string[]>(),
  createdAt: text("created_at").notNull(),
});

export const insertCodeAnalysisSchema = createInsertSchema(codeAnalyses).omit({
  id: true,
});

// Define a category scores schema that matches our frontend
export const categoryScoresSchema = z.object({
  namingConventions: z.number(),
  functionLength: z.number(),
  commentsDocumentation: z.number(),
  formatting: z.number(),
  reusability: z.number(),
  bestPractices: z.number()
});

export type CategoryScores = z.infer<typeof categoryScoresSchema>;

// Define a frontend-friendly analysis result type
export const analysisResultSchema = z.object({
  fileName: z.string(),
  fileType: z.string(),
  codeContent: z.string(),
  overallScore: z.number(),
  categoryScores: categoryScoresSchema,
  recommendations: z.array(z.string())
});

export type AnalysisResult = z.infer<typeof analysisResultSchema>;

export type InsertCodeAnalysis = z.infer<typeof insertCodeAnalysisSchema>;
export type CodeAnalysis = typeof codeAnalyses.$inferSelect;

// Waitlist schema
export const waitlist = pgTable("waitlist", {
  id: serial("id").primaryKey(),
  email: text("email").notNull().unique(),
  firstName: text("first_name").notNull(),
  lastName: text("last_name").notNull(),
  company: text("company"),
  role: text("role"),
  newsletter: boolean("newsletter").default(false),
  createdAt: text("created_at").notNull(),
});

export const insertWaitlistSchema = createInsertSchema(waitlist).omit({
  id: true,
  createdAt: true,
});

export const waitlistFormSchema = insertWaitlistSchema.extend({
  email: z.string().email("Please enter a valid email address"),
  firstName: z.string().min(1, "First name is required"),
  lastName: z.string().min(1, "Last name is required"),
  company: z.string().optional(),
  role: z.string().optional(),
  newsletter: z.boolean().default(false),
});

export type InsertWaitlist = z.infer<typeof insertWaitlistSchema>;
export type Waitlist = typeof waitlist.$inferSelect;
