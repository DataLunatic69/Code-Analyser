// Analysis results types
export interface CategoryScores {
  namingConventions: number;
  functionLength: number;
  commentsDocumentation: number;
  formatting: number;
  reusability: number;
  bestPractices: number;
}

export interface CodeAnalysisResult {
  fileName: string;
  fileType: string;
  codeContent: string;
  overallScore: number;
  categoryScores: CategoryScores;
  recommendations: string[];
}

// Waitlist form types
export interface WaitlistFormData {
  email: string;
  firstName: string;
  lastName: string;
  company?: string;
  role?: string;
  newsletter: boolean;
}

// Category definitions for display
export interface CategoryDefinition {
  name: string;
  description: string;
  icon: string;
  maxScore: number;
}

export const CATEGORIES: CategoryDefinition[] = [
  {
    name: "Naming Conventions",
    description: "Evaluate variable, function, and class names for clarity and consistency with industry standards.",
    icon: "fa-code",
    maxScore: 10
  },
  {
    name: "Function Length & Modularity",
    description: "Assess function complexity and suggest refactoring to improve code maintainability.",
    icon: "fa-puzzle-piece",
    maxScore: 20
  },
  {
    name: "Comments & Documentation",
    description: "Check for proper documentation and helpful comments to enhance code readability.",
    icon: "fa-comment-alt",
    maxScore: 20
  },
  {
    name: "Formatting & Indentation",
    description: "Analyze code structure and formatting consistency to improve readability.",
    icon: "fa-indent",
    maxScore: 15
  },
  {
    name: "Reusability & DRY",
    description: "Identify repeated code and provide suggestions for reusable components and functions.",
    icon: "fa-recycle",
    maxScore: 15
  },
  {
    name: "Best Practices",
    description: "Evaluate adherence to industry best practices for web development and security.",
    icon: "fa-shield-alt",
    maxScore: 20
  }
];
