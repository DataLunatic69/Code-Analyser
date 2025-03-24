from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import List, Dict, Any, TypedDict, Optional
import os
import uvicorn
from langchain_groq import ChatGroq
from langchain_core.messages import HumanMessage, SystemMessage
import re
import os
from langchain.graphs.state_graph import StateGraph
from typing import TypedDict

app = FastAPI()

# Configure CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Models
class AnalysisRequest(BaseModel):
    file_content: str
    file_name: str
    file_type: str

class CategoryScores(TypedDict):
    naming: int
    modularity: int
    documentation: int
    formatting: int
    reusability: int
    best_practices: int

class AnalysisResponse(BaseModel):
    file_name: str
    total_score: int
    category_scores: Dict[str, int]
    recommendations: List[str]

class AnalysisState(TypedDict):
    file_content: str
    file_name: str
    file_type: str
    analysis_complete: bool
    naming_score: Optional[int]
    modularity_score: Optional[int]
    documentation_score: Optional[int]
    formatting_score: Optional[int]
    reusability_score: Optional[int]
    best_practices_score: Optional[int]
    total_score: Optional[int]
    recommendations: Optional[List[str]]
    error: Optional[str]

# Initialize Groq LLM
def get_llm():
    api_key = os.environ.get("GROQ_API_KEY")
    if not api_key:
        # Fallback to a default key for development
        api_key = "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"
    
    return ChatGroq(
        groq_api_key=api_key,
        model_name="Llama-3.3-70b-versatile"
    )

# LangGraph nodes for code analysis
def analyze_naming_conventions(state: AnalysisState) -> AnalysisState:
    """Analyze variable, function, and class naming for clarity and consistency with language conventions."""
    llm = get_llm()
    
    prompt = f"""
    Analyze the following code for naming conventions. Rate it on a scale of 0-10 points.
    Focus on variable names, function names, and class names for clarity and consistency with language conventions.
    
    Code to analyze:
    ```{state['file_type'][1:]}
    {state['file_content']}
    ```
    
    Provide ONLY a JSON response with the following structure:
    {{
        "score": <number between 0 and 10>,
        "explanation": "<brief explanation of the score, max 100 words>"
    }}
    """
    
    messages = [
        SystemMessage(content="You are a code quality analyzer specialized in naming conventions."),
        HumanMessage(content=prompt)
    ]
    
    try:
        response = llm.invoke(messages)
        
        # Extract the JSON from the response
        import json
        result = json.loads(response.content)
        
        state["naming_score"] = result["score"]
        return state
    except Exception as e:
        state["error"] = f"Error analyzing naming conventions: {str(e)}"
        return state

def analyze_modularity(state: AnalysisState) -> AnalysisState:
    """Analyze function length and modularity."""
    llm = get_llm()
    
    prompt = f"""
    Analyze the following code for function length and modularity. Rate it on a scale of 0-20 points.
    Focus on function size, complexity, and appropriate separation of concerns.
    
    Code to analyze:
    ```{state['file_type'][1:]}
    {state['file_content']}
    ```
    
    Provide ONLY a JSON response with the following structure:
    {{
        "score": <number between 0 and 20>,
        "explanation": "<brief explanation of the score, max 100 words>"
    }}
    """
    
    messages = [
        SystemMessage(content="You are a code quality analyzer specialized in function length and modularity."),
        HumanMessage(content=prompt)
    ]
    
    try:
        response = llm.invoke(messages)
        
        # Extract the JSON from the response
        import json
        result = json.loads(response.content)
        
        state["modularity_score"] = result["score"]
        return state
    except Exception as e:
        state["error"] = f"Error analyzing modularity: {str(e)}"
        return state

def analyze_documentation(state: AnalysisState) -> AnalysisState:
    """Analyze comments and documentation."""
    llm = get_llm()
    
    prompt = f"""
    Analyze the following code for comments and documentation. Rate it on a scale of 0-20 points.
    Focus on code documentation quality, presence of docstrings, and meaningful comments.
    
    Code to analyze:
    ```{state['file_type'][1:]}
    {state['file_content']}
    ```
    
    Provide ONLY a JSON response with the following structure:
    {{
        "score": <number between 0 and 20>,
        "explanation": "<brief explanation of the score, max 100 words>"
    }}
    """
    
    messages = [
        SystemMessage(content="You are a code quality analyzer specialized in documentation and comments."),
        HumanMessage(content=prompt)
    ]
    
    try:
        response = llm.invoke(messages)
        
        # Extract the JSON from the response
        import json
        result = json.loads(response.content)
        
        state["documentation_score"] = result["score"]
        return state
    except Exception as e:
        state["error"] = f"Error analyzing documentation: {str(e)}"
        return state

def analyze_formatting(state: AnalysisState) -> AnalysisState:
    """Analyze code formatting and indentation."""
    llm = get_llm()
    
    prompt = f"""
    Analyze the following code for formatting and indentation. Rate it on a scale of 0-15 points.
    Focus on code style consistency, indentation, and adherence to style guides.
    
    Code to analyze:
    ```{state['file_type'][1:]}
    {state['file_content']}
    ```
    
    Provide ONLY a JSON response with the following structure:
    {{
        "score": <number between 0 and 15>,
        "explanation": "<brief explanation of the score, max 100 words>"
    }}
    """
    
    messages = [
        SystemMessage(content="You are a code quality analyzer specialized in formatting and indentation."),
        HumanMessage(content=prompt)
    ]
    
    try:
        response = llm.invoke(messages)
        
        # Extract the JSON from the response
        import json
        result = json.loads(response.content)
        
        state["formatting_score"] = result["score"]
        return state
    except Exception as e:
        state["error"] = f"Error analyzing formatting: {str(e)}"
        return state

def analyze_reusability(state: AnalysisState) -> AnalysisState:
    """Analyze code reusability and DRY principles."""
    llm = get_llm()
    
    prompt = f"""
    Analyze the following code for reusability and DRY (Don't Repeat Yourself) principles. Rate it on a scale of 0-15 points.
    Focus on code duplication and potential for reuse across the codebase.
    
    Code to analyze:
    ```{state['file_type'][1:]}
    {state['file_content']}
    ```
    
    Provide ONLY a JSON response with the following structure:
    {{
        "score": <number between 0 and 15>,
        "explanation": "<brief explanation of the score, max 100 words>"
    }}
    """
    
    messages = [
        SystemMessage(content="You are a code quality analyzer specialized in code reusability and DRY principles."),
        HumanMessage(content=prompt)
    ]
    
    try:
        response = llm.invoke(messages)
        
        # Extract the JSON from the response
        import json
        result = json.loads(response.content)
        
        state["reusability_score"] = result["score"]
        return state
    except Exception as e:
        state["error"] = f"Error analyzing reusability: {str(e)}"
        return state

def analyze_best_practices(state: AnalysisState) -> AnalysisState:
    """Analyze adherence to best practices in web development."""
    llm = get_llm()
    
    # Determine which best practices to focus on based on file type
    file_type = state['file_type'][1:]  # Remove the dot
    if file_type in ['js', 'jsx']:
        language_focus = "JavaScript/React"
    elif file_type == 'py':
        language_focus = "Python"
    else:
        language_focus = "web development"
    
    prompt = f"""
    Analyze the following code for adherence to best practices in {language_focus}. Rate it on a scale of 0-20 points.
    Focus on industry standard practices specific to {language_focus} and language-specific conventions.
    
    Code to analyze:
    ```{file_type}
    {state['file_content']}
    