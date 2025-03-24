import { 
  users, 
  type User, 
  type InsertUser, 
  codeAnalyses,
  type CodeAnalysis,
  type InsertCodeAnalysis,
  waitlist,
  type Waitlist,
  type InsertWaitlist
} from "@shared/schema";

// Modify the interface with any CRUD methods
// you might need
export interface IStorage {
  getUser(id: number): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  
  // Code Analysis methods
  createCodeAnalysis(analysis: InsertCodeAnalysis): Promise<CodeAnalysis>;
  getCodeAnalysis(id: number): Promise<CodeAnalysis | undefined>;
  
  // Waitlist methods
  addToWaitlist(entry: InsertWaitlist): Promise<Waitlist>;
  getWaitlistByEmail(email: string): Promise<Waitlist | undefined>;
}

export class MemStorage implements IStorage {
  private users: Map<number, User>;
  private codeAnalyses: Map<number, CodeAnalysis>;
  private waitlistEntries: Map<number, Waitlist>;
  userCurrentId: number;
  analysisCurrentId: number;
  waitlistCurrentId: number;

  constructor() {
    this.users = new Map();
    this.codeAnalyses = new Map();
    this.waitlistEntries = new Map();
    this.userCurrentId = 1;
    this.analysisCurrentId = 1;
    this.waitlistCurrentId = 1;
  }

  // User methods
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

  // Code Analysis methods
  async createCodeAnalysis(insertAnalysis: InsertCodeAnalysis): Promise<CodeAnalysis> {
    const id = this.analysisCurrentId++;
    const analysis: CodeAnalysis = { ...insertAnalysis, id };
    this.codeAnalyses.set(id, analysis);
    return analysis;
  }

  async getCodeAnalysis(id: number): Promise<CodeAnalysis | undefined> {
    return this.codeAnalyses.get(id);
  }

  // Waitlist methods
  async addToWaitlist(insertEntry: InsertWaitlist): Promise<Waitlist> {
    const id = this.waitlistCurrentId++;
    const entry: Waitlist = { ...insertEntry, id };
    this.waitlistEntries.set(id, entry);
    return entry;
  }

  async getWaitlistByEmail(email: string): Promise<Waitlist | undefined> {
    return Array.from(this.waitlistEntries.values()).find(
      (entry) => entry.email === email,
    );
  }
}

export const storage = new MemStorage();
