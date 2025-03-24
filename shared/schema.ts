import { pgTable, text, serial, integer, boolean, jsonb } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
});

export const waitlistEntries = pgTable("waitlist_entries", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  email: text("email").notNull().unique(),
  role: text("role"),
  interest: text("interest"),
  createdAt: text("created_at").notNull().default("NOW()"),
});

export const codeAnalyses = pgTable("code_analyses", {
  id: serial("id").primaryKey(),
  fileName: text("file_name").notNull(),
  fileType: text("file_type").notNull(),
  namingScore: integer("naming_score").notNull(),
  modularityScore: integer("modularity_score").notNull(),
  documentationScore: integer("documentation_score").notNull(),
  formattingScore: integer("formatting_score").notNull(),
  reusabilityScore: integer("reusability_score").notNull(),
  bestPracticesScore: integer("best_practices_score").notNull(),
  totalScore: integer("total_score").notNull(),
  recommendations: jsonb("recommendations").notNull(),
  createdAt: text("created_at").notNull().default("NOW()"),
});

export const insertUserSchema = createInsertSchema(users).pick({
  username: true,
  password: true,
});

export const insertWaitlistEntrySchema = createInsertSchema(waitlistEntries).pick({
  name: true,
  email: true,
  role: true,
  interest: true,
});

export const insertCodeAnalysisSchema = createInsertSchema(codeAnalyses).pick({
  fileName: true,
  fileType: true,
  namingScore: true,
  modularityScore: true,
  documentationScore: true,
  formattingScore: true,
  reusabilityScore: true,
  bestPracticesScore: true,
  totalScore: true,
  recommendations: true,
});

export type InsertUser = z.infer<typeof insertUserSchema>;
export type User = typeof users.$inferSelect;

export type InsertWaitlistEntry = z.infer<typeof insertWaitlistEntrySchema>;
export type WaitlistEntry = typeof waitlistEntries.$inferSelect;

export type InsertCodeAnalysis = z.infer<typeof insertCodeAnalysisSchema>;
export type CodeAnalysis = typeof codeAnalyses.$inferSelect;

export const validFileTypes = ['.js', '.jsx', '.py'];

export const roleOptions = [
  { label: "Select your role", value: "" },
  { label: "Software Developer", value: "developer" },
  { label: "Frontend Developer", value: "frontend" },
  { label: "Backend Developer", value: "backend" },
  { label: "Full-Stack Developer", value: "fullstack" },
  { label: "Software Engineer", value: "engineer" },
  { label: "Tech Lead", value: "lead" },
  { label: "Engineering Manager", value: "manager" },
  { label: "Other", value: "other" }
];
