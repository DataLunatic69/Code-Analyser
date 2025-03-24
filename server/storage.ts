import { users, type User, type InsertUser, waitlistEntries, type WaitlistEntry, type InsertWaitlistEntry, codeAnalyses, type CodeAnalysis, type InsertCodeAnalysis } from "@shared/schema";

export interface IStorage {
  getUser(id: number): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  
  createWaitlistEntry(entry: InsertWaitlistEntry): Promise<WaitlistEntry>;
  getWaitlistEntries(): Promise<WaitlistEntry[]>;
  
  createCodeAnalysis(analysis: InsertCodeAnalysis): Promise<CodeAnalysis>;
  getCodeAnalysis(id: number): Promise<CodeAnalysis | undefined>;
  getRecentCodeAnalyses(limit: number): Promise<CodeAnalysis[]>;
}

export class MemStorage implements IStorage {
  private users: Map<number, User>;
  private waitlistEntries: Map<number, WaitlistEntry>;
  private codeAnalyses: Map<number, CodeAnalysis>;
  private userCurrentId: number;
  private waitlistCurrentId: number;
  private analysisCurrentId: number;

  constructor() {
    this.users = new Map();
    this.waitlistEntries = new Map();
    this.codeAnalyses = new Map();
    this.userCurrentId = 1;
    this.waitlistCurrentId = 1;
    this.analysisCurrentId = 1;
  }

  async getUser(id: number): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(
      (user) => user.username === username,
    );
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const id = this.userCurrentId++;
    const user: User = { ...insertUser, id };
    this.users.set(id, user);
    return user;
  }

  async createWaitlistEntry(insertEntry: InsertWaitlistEntry): Promise<WaitlistEntry> {
    const id = this.waitlistCurrentId++;
    const createdAt = new Date().toISOString();
    const entry: WaitlistEntry = { ...insertEntry, id, createdAt };
    this.waitlistEntries.set(id, entry);
    return entry;
  }

  async getWaitlistEntries(): Promise<WaitlistEntry[]> {
    return Array.from(this.waitlistEntries.values());
  }

  async createCodeAnalysis(insertAnalysis: InsertCodeAnalysis): Promise<CodeAnalysis> {
    const id = this.analysisCurrentId++;
    const createdAt = new Date().toISOString();
    const analysis: CodeAnalysis = { ...insertAnalysis, id, createdAt };
    this.codeAnalyses.set(id, analysis);
    return analysis;
  }

  async getCodeAnalysis(id: number): Promise<CodeAnalysis | undefined> {
    return this.codeAnalyses.get(id);
  }

  async getRecentCodeAnalyses(limit: number): Promise<CodeAnalysis[]> {
    return Array.from(this.codeAnalyses.values())
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
      .slice(0, limit);
  }
}

export const storage = new MemStorage();
