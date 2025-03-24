#!/usr/bin/env python
import sys
import os
import json
import re
from typing import Dict, List, Any, TypedDict
import ast
import tokenize
import io

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

# Initialize LangGraph here if needed
# For now we'll implement the analysis logic directly
def analyze_code(code: str, file_type: str) -> CodeAnalysisResult:
    # Initialize scores
    scores = {
        "namingConventions": 0,
        "functionLength": 0,
        "commentsDocumentation": 0,
        "formatting": 0,
        "reusability": 0,
        "bestPractices": 0
    }
    
    recommendations = []
    
    # Common analysis for any language
    lines = code.split('\n')
    total_lines = len(lines)
    
    # Analysis specific to Python files
    if file_type == 'py':
        # Analyze Python code
        scores, recommendations = analyze_python_code(code, scores, recommendations)
    
    # Analysis specific to JavaScript/JSX files
    elif file_type in ['js', 'jsx']:
        # Analyze JavaScript code
        scores, recommendations = analyze_js_code(code, scores, recommendations)
    
    # Calculate overall score (weighted)
    max_possible = 100  # Max possible total score
    total_score = sum(scores.values())
    normalized_score = min(100, max(0, int(total_score))) # Ensure it's between 0-100
    
    # If we don't have enough recommendations, add some generic ones
    if len(recommendations) < 3:
        generic_recommendations = [
            "Add more comments to explain complex logic",
            "Break down long functions into smaller, more focused ones",
            "Use more descriptive variable names for better code readability",
            "Add proper indentation to improve code structure",
            "Apply consistent formatting throughout the codebase"
        ]
        
        # Add generic recommendations until we have at least 3
        for rec in generic_recommendations:
            if rec not in recommendations and len(recommendations) < 5:
                recommendations.append(rec)
    
    # Limit to 5 recommendations at most
    if len(recommendations) > 5:
        recommendations = recommendations[:5]
    
    # Prepare the result
    result: CodeAnalysisResult = {
        "fileName": file_name,
        "fileType": file_type,
        "codeContent": code,
        "overallScore": normalized_score,
        "categoryScores": scores,
        "recommendations": recommendations
    }
    
    return result

def analyze_python_code(code: str, scores: Dict[str, int], recommendations: List[str]) -> tuple:
    try:
        # Use AST to parse Python code
        tree = ast.parse(code)
        
        # Check naming conventions (10 points)
        function_names = [node.name for node in ast.walk(tree) if isinstance(node, ast.FunctionDef)]
        variable_names = [node.id for node in ast.walk(tree) if isinstance(node, ast.Name) and isinstance(node.ctx, ast.Store)]
        
        # Check if names follow snake_case convention (Python standard)
        snake_case_pattern = re.compile(r'^[a-z][a-z0-9_]*$')
        good_func_names = sum(1 for name in function_names if snake_case_pattern.match(name))
        good_var_names = sum(1 for name in variable_names if snake_case_pattern.match(name))
        
        total_names = len(function_names) + len(variable_names)
        if total_names > 0:
            naming_score = int(10 * (good_func_names + good_var_names) / total_names)
        else:
            naming_score = 5  # Default score if no names are found
        
        scores["namingConventions"] = naming_score
        
        if naming_score < 7 and function_names:
            recommendations.append("Use snake_case for function and variable names following Python conventions")
        
        # Check function length and modularity (20 points)
        function_lines = {}
        for node in ast.walk(tree):
            if isinstance(node, ast.FunctionDef):
                if hasattr(node, 'end_lineno') and hasattr(node, 'lineno'):
                    function_lines[node.name] = node.end_lineno - node.lineno
        
        avg_func_length = sum(function_lines.values()) / len(function_lines) if function_lines else 0
        
        # Lower score for very long functions
        if avg_func_length > 30:
            scores["functionLength"] = 5
            recommendations.append("Break down long functions into smaller, more manageable pieces")
        elif avg_func_length > 20:
            scores["functionLength"] = 10
            recommendations.append("Consider breaking down some functions to improve readability")
        elif avg_func_length > 10:
            scores["functionLength"] = 15
        else:
            scores["functionLength"] = 20
        
        # Check comments and documentation (20 points)
        comments = []
        with io.BytesIO(code.encode('utf-8')) as f:
            try:
                tokens = tokenize.tokenize(f.readline)
                for token in tokens:
                    if token.type == tokenize.COMMENT:
                        comments.append(token.string)
            except tokenize.TokenError:
                pass
        
        # Check docstrings
        docstrings = [node.body[0].value.s for node in ast.walk(tree) 
                      if isinstance(node, ast.FunctionDef) and 
                      node.body and isinstance(node.body[0], ast.Expr) and 
                      isinstance(node.body[0].value, ast.Str)]
        
        comment_ratio = (len(comments) + len(docstrings)) / (len(code.split('\n')) + 0.1)
        
        if comment_ratio < 0.05:
            scores["commentsDocumentation"] = 5
            recommendations.append("Add more comments and docstrings to explain your code")
        elif comment_ratio < 0.1:
            scores["commentsDocumentation"] = 10
            recommendations.append("Consider adding more detailed docstrings to functions")
        elif comment_ratio < 0.2:
            scores["commentsDocumentation"] = 15
        else:
            scores["commentsDocumentation"] = 20
        
        # Check formatting and indentation (15 points)
        lines = code.split('\n')
        consistent_indent = True
        indent_size = None
        
        for line in lines:
            if line.strip() and line[0] == ' ':
                # Count leading spaces
                spaces = len(line) - len(line.lstrip(' '))
                if indent_size is None:
                    indent_size = spaces
                elif spaces % indent_size != 0:
                    consistent_indent = False
                    break
        
        # Look for issues like missing indentation or inconsistent spacing
        if consistent_indent:
            scores["formatting"] = 15
        else:
            scores["formatting"] = 8
            recommendations.append("Use consistent indentation throughout your code")
        
        # Check for reusability and DRY principles (15 points)
        # Look for repeated code patterns and similar functions
        function_bodies = {}
        for node in ast.walk(tree):
            if isinstance(node, ast.FunctionDef):
                func_code = ast.unparse(node) if hasattr(ast, 'unparse') else code[node.lineno-1:node.end_lineno]
                function_bodies[node.name] = func_code
        
        # Simple similarity check (could be more sophisticated)
        duplicate_code = False
        for name1, body1 in function_bodies.items():
            for name2, body2 in function_bodies.items():
                if name1 != name2 and len(body1) > 0 and len(body2) > 0:
                    similarity = difflib_similarity(body1, body2)
                    if similarity > 0.7:  # If functions are 70% similar
                        duplicate_code = True
                        break
        
        if duplicate_code:
            scores["reusability"] = 7
            recommendations.append("Refactor similar code into reusable functions to follow DRY principles")
        else:
            scores["reusability"] = 15
        
        # Check best practices for web dev (20 points)
        unsafe_patterns = [
            r'eval\s*\(',  # eval usage
            r'exec\s*\(',  # exec usage
            r'__import__',  # dynamic imports
            r'subprocess\.', # subprocess usage
            r'os\.system'  # os.system calls
        ]
        
        violations = 0
        for pattern in unsafe_patterns:
            if re.search(pattern, code):
                violations += 1
        
        if violations > 0:
            scores["bestPractices"] = max(0, 20 - violations * 5)
            recommendations.append("Avoid using potentially unsafe functions like eval, exec, or subprocess")
        else:
            scores["bestPractices"] = 20
        
    except SyntaxError:
        # If there's a syntax error, give low scores
        scores = {
            "namingConventions": 3,
            "functionLength": 5,
            "commentsDocumentation": 5,
            "formatting": 3,
            "reusability": 5,
            "bestPractices": 5
        }
        recommendations.append("Fix syntax errors in your code before further analysis")
    
    return scores, recommendations

def analyze_js_code(code: str, scores: Dict[str, int], recommendations: List[str]) -> tuple:
    # For JavaScript, we'll perform simpler analysis without AST parsing
    
    # Check naming conventions (10 points)
    camel_case_pattern = re.compile(r'^[a-z][a-zA-Z0-9]*$')
    constructor_pattern = re.compile(r'^[A-Z][a-zA-Z0-9]*$')
    
    # Simple regex to find function and variable declarations
    func_matches = re.findall(r'function\s+([a-zA-Z0-9_$]+)', code)
    var_matches = re.findall(r'(const|let|var)\s+([a-zA-Z0-9_$]+)', code)
    
    # Extract names
    function_names = func_matches
    variable_names = [match[1] for match in var_matches]
    
    # Check if names follow camelCase (JS standard)
    good_func_names = sum(1 for name in function_names if camel_case_pattern.match(name) or constructor_pattern.match(name))
    good_var_names = sum(1 for name in variable_names if camel_case_pattern.match(name))
    
    total_names = len(function_names) + len(variable_names)
    if total_names > 0:
        naming_score = int(10 * (good_func_names + good_var_names) / total_names)
    else:
        naming_score = 5  # Default score if no names are found
    
    scores["namingConventions"] = naming_score
    
    if naming_score < 7 and total_names > 0:
        recommendations.append("Use camelCase for variables and functions following JavaScript conventions")
    
    # Check function length (20 points)
    function_blocks = re.findall(r'function\s+[a-zA-Z0-9_$]+\s*\([^)]*\)\s*{([^{}]*(?:{[^{}]*}[^{}]*)*)}', code)
    arrow_functions = re.findall(r'=>\s*{([^{}]*(?:{[^{}]*}[^{}]*)*)}', code)
    
    all_functions = function_blocks + arrow_functions
    function_lengths = [block.count('\n') for block in all_functions]
    avg_func_length = sum(function_lengths) / len(function_lengths) if function_lengths else 0
    
    if avg_func_length > 30:
        scores["functionLength"] = 5
        recommendations.append("Break down long functions into smaller, more manageable pieces")
    elif avg_func_length > 20:
        scores["functionLength"] = 10
        recommendations.append("Consider breaking down some functions to improve readability")
    elif avg_func_length > 10:
        scores["functionLength"] = 15
    else:
        scores["functionLength"] = 20
    
    # Check comments (20 points)
    comments = re.findall(r'//.*?$|/\*.*?\*/', code, re.MULTILINE | re.DOTALL)
    jsdoc_comments = re.findall(r'/\*\*.*?\*/', code, re.MULTILINE | re.DOTALL)
    
    comment_ratio = (len(comments) + len(jsdoc_comments)) / (len(code.split('\n')) + 0.1)
    
    if comment_ratio < 0.05:
        scores["commentsDocumentation"] = 5
        recommendations.append("Add more comments and JSDoc to explain your code")
    elif comment_ratio < 0.1:
        scores["commentsDocumentation"] = 10
        recommendations.append("Consider adding more detailed JSDoc comments to functions")
    elif comment_ratio < 0.2:
        scores["commentsDocumentation"] = 15
    else:
        scores["commentsDocumentation"] = 20
    
    # Check formatting (15 points)
    lines = code.split('\n')
    consistent_indent = True
    indent_size = None
    
    for line in lines:
        if line.strip() and line[0] == ' ':
            # Count leading spaces
            spaces = len(line) - len(line.lstrip(' '))
            if indent_size is None:
                indent_size = spaces
            elif spaces % indent_size != 0:
                consistent_indent = False
                break
    
    # Check for inconsistent spacing around operators
    inconsistent_spacing = re.search(r'[a-zA-Z0-9]=[a-zA-Z0-9]|[a-zA-Z0-9]\+[a-zA-Z0-9]|[a-zA-Z0-9]-[a-zA-Z0-9]', code)
    
    if consistent_indent and not inconsistent_spacing:
        scores["formatting"] = 15
    elif consistent_indent:
        scores["formatting"] = 12
        recommendations.append("Use consistent spacing around operators")
    else:
        scores["formatting"] = 8
        recommendations.append("Use consistent indentation throughout your code")
    
    # Check reusability (15 points)
    # Look for duplicate code blocks (simple approach)
    code_blocks = re.findall(r'{([^{}]*(?:{[^{}]*}[^{}]*)*)}', code)
    
    duplicate_blocks = False
    for i, block1 in enumerate(code_blocks):
        if len(block1.strip()) < 10:  # Skip very small blocks
            continue
        for j, block2 in enumerate(code_blocks):
            if i != j and len(block2.strip()) >= 10:
                similarity = difflib_similarity(block1, block2)
                if similarity > 0.7:  # If blocks are 70% similar
                    duplicate_blocks = True
                    break
    
    if duplicate_blocks:
        scores["reusability"] = 7
        recommendations.append("Refactor similar code into reusable functions to follow DRY principles")
    else:
        scores["reusability"] = 15
    
    # Check best practices (20 points)
    unsafe_patterns = [
        r'eval\s*\(',  # eval usage
        r'document\.write\(',  # document.write
        r'innerHTML\s*=',  # innerHTML without sanitization
        r'with\s*\(',  # with statement
        r'new Function\('  # Function constructor
    ]
    
    violations = 0
    for pattern in unsafe_patterns:
        if re.search(pattern, code):
            violations += 1
    
    if violations > 0:
        scores["bestPractices"] = max(0, 20 - violations * 5)
        recommendations.append("Avoid using potentially unsafe constructs like eval, document.write, or innerHTML")
    else:
        scores["bestPractices"] = 20
    
    return scores, recommendations

# Simple implementation of similarity calculation (in real implementation would use difflib)
def difflib_similarity(str1, str2):
    # Count matching characters
    shorter = min(len(str1), len(str2))
    matching_chars = sum(1 for i in range(shorter) if str1[i] == str2[i])
    
    # Calculate similarity ratio
    return matching_chars / max(len(str1), len(str2)) if max(len(str1), len(str2)) > 0 else 0

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
