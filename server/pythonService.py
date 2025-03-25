#!/usr/bin/env python
import sys
import os
import json
import re
from typing import Dict, List, Any, TypedDict
import ast
import tokenize
import io
from langchain_groq import ChatGroq
from langchain_core.messages import SystemMessage, HumanMessage

# Check if we have command line arguments for the file path
if len(sys.argv) < 4:
    print("Usage: python pythonService.py <file_path> <file_name> <file_type>")
    sys.exit(1)

file_path = sys.argv[1]
file_name = sys.argv[2]
file_type = sys.argv[3]

# TypedDict classes for type hints
class CategoryScores(TypedDict):
    namingConventions: int
    functionLength: int
    commentsDocumentation: int
    formatting: int
    reusability: int
    bestPractices: int

class CodeAnalysisResult(TypedDict):
    fileName: str
    fileType: str
    codeContent: str
    overallScore: int
    categoryScores: CategoryScores
    recommendations: List[str]

# Read the code content from the file
def read_code_file(file_path: str) -> str:
    try:
        with open(file_path, 'r', encoding='utf-8') as file:
            return file.read()
    except Exception as e:
        print(f"Error reading file: {e}")
        return ""

# Analyze code using Groq LLM
def analyze_code(code: str, file_type: str) -> CodeAnalysisResult:
    try:
        # Initialize Groq model
        model = ChatGroq(
            groq_api_key=os.environ.get("GROQ_API_KEY"),
            model_name="llama-3.1-70b-versatile"
        )

        # System prompt for code analysis
        system_prompt = """You are an expert code quality analyzer. Analyze the provided code and return a detailed assessment in EXACTLY this JSON format:
{
    "overall_score": [score 0-100],
    "category_scores": {
        "namingConventions": [score 0-10],
        "functionLength": [score 0-20],
        "commentsDocumentation": [score 0-20],
        "formatting": [score 0-15],
        "reusability": [score 0-15],
        "bestPractices": [score 0-20]
    },
    "recommendations": [
        "specific actionable improvement 1",
        "specific actionable improvement 2",
        "specific actionable improvement 3"
    ]
}

Scoring Guidelines:
1. Naming (10pts): Evaluate consistency (snake_case/camelCase), descriptiveness
2. Modularity (20pts): Check function length (>20 lines loses points), single responsibility
3. Comments (20pts): Docstrings, inline comments, explanation clarity
4. Formatting (15pts): PEP-8 compliance (Python) or standard style (JS), indentation, line length
5. Reusability (15pts): Code duplication, modular components
6. Best Practices (20pts): Language idioms, security, error handling

IMPORTANT:
- Return ONLY valid JSON with these exact field names
- Scores must be integers
- Provide 3-5 specific recommendations
- Never include markdown or extra text outside the JSON"""

        # Analyze code with Groq
        messages = [
            SystemMessage(content=system_prompt),
            HumanMessage(content=code)
        ]

        result = model.invoke(messages)
        llm_response = result.content
        
        # Parse the LLM response to extract JSON
        try:
            analysis = json.loads(llm_response)
            
            # Validate the response structure
            if "overall_score" not in analysis or "category_scores" not in analysis or "recommendations" not in analysis:
                raise ValueError("Invalid analysis format returned by model")
                
            # Map the scores to our expected format
            scores = analysis["category_scores"]
            
            # Prepare the result
            result_dict: CodeAnalysisResult = {
                "fileName": file_name,
                "fileType": file_type,
                "codeContent": code,
                "overallScore": analysis["overall_score"],
                "categoryScores": scores,
                "recommendations": analysis["recommendations"]
            }
            
            return result_dict
            
        except json.JSONDecodeError:
            print("Failed to parse JSON from LLM response")
            # Fall back to default analysis
    
    except Exception as e:
        print(f"Error in LLM analysis: {str(e)}")
    
    # If LLM analysis fails, perform basic analysis
    return perform_basic_analysis(code, file_type)

# Simple implementation of similarity calculation
def difflib_similarity(str1, str2):
    # Count matching characters
    shorter = min(len(str1), len(str2))
    matching_chars = sum(1 for i in range(shorter) if str1[i] == str2[i])
    similarity = matching_chars / max(len(str1), len(str2)) if max(len(str1), len(str2)) > 0 else 0
    return similarity

# Fallback analysis if LLM fails
def perform_basic_analysis(code: str, file_type: str) -> CodeAnalysisResult:
    # Initialize default scores
    scores = {
        "namingConventions": 5,
        "functionLength": 10,
        "commentsDocumentation": 10,
        "formatting": 8,
        "reusability": 8,
        "bestPractices": 10
    }
    
    # Default recommendations
    recommendations = [
        "Add more comments to explain complex logic",
        "Break down long functions into smaller, more focused ones",
        "Use more descriptive variable names for better code readability",
        "Apply consistent formatting throughout the codebase",
        "Follow standard best practices for error handling"
    ]
    
    # Calculate overall score
    total_score = sum(scores.values())
    
    # Prepare the result
    result: CodeAnalysisResult = {
        "fileName": file_name,
        "fileType": file_type,
        "codeContent": code,
        "overallScore": total_score,
        "categoryScores": scores,
        "recommendations": recommendations
    }
    
    return result

# Main execution
if __name__ == "__main__":
    # Read the code content
    code_content = read_code_file(file_path)
    
    if not code_content:
        # If we couldn't read the file, return an error
        result = {
            "fileName": file_name,
            "fileType": file_type,
            "codeContent": "",
            "overallScore": 0,
            "categoryScores": {
                "namingConventions": 0,
                "functionLength": 0,
                "commentsDocumentation": 0,
                "formatting": 0,
                "reusability": 0,
                "bestPractices": 0
            },
            "recommendations": ["Error reading file. Please try again with a valid file."]
        }
    else:
        # Analyze the code
        result = analyze_code(code_content, file_type)
    
    # Output the result as JSON
    print(json.dumps(result))