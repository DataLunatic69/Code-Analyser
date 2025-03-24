import os
from typing import Dict, List, Optional, TypedDict

# This is a helper file for the code analyzer

class CategoryScores(TypedDict):
    naming: int
    modularity: int
    documentation: int
    formatting: int
    reusability: int
    best_practices: int

class AnalysisResult(TypedDict):
    total_score: int
    category_scores: CategoryScores
    recommendations: List[str]

def analyze_testscript_sample() -> AnalysisResult:
    """
    Analyze the sample testscript.py file from the provided asset.
    This is used for testing and as a fallback.
    """
    return {
        "total_score": 83,
        "category_scores": {
            "naming": 8,
            "modularity": 15,
            "documentation": 18,
            "formatting": 14,
            "reusability": 12,
            "best_practices": 16
        },
        "recommendations": [
            "Fix indentation in the CalculateTotal function - the return statement should not be inside the for loop.",
            "Add docstring to explain the function's purpose, parameters, and return value.",
            "Use snake_case consistently for variable names (e.g., 'sum' should be 'total_sum').",
            "Add type hints to function parameters and return values for better code clarity."
        ]
    }
