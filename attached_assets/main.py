from fastapi import FastAPI, UploadFile, File, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import Dict, List, Optional
import os
import json
from langchain_groq import ChatGroq
from langchain_core.messages import SystemMessage, HumanMessage
from typing_extensions import TypedDict

app = FastAPI()

# CORS configuration
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Allows all origins
    allow_credentials=True,
    allow_methods=["*"],  # Allows all methods
    allow_headers=["*"],  # Allows all headers
)

# Define response models
class Breakdown(TypedDict):
    naming: int
    modularity: int
    comments: int
    formatting: int
    reusability: int
    best_practices: int

class AnalysisResponse(BaseModel):
    overall_score: int
    breakdown: Breakdown
    recommendations: List[str]

class APIResponse(BaseModel):
    status: str
    analysis: Optional[AnalysisResponse] = None
    message: Optional[str] = None

@app.post("/analyze-code", response_model=APIResponse)
async def analyze_code(file: UploadFile = File(...)):
    """
    Analyze code quality and return assessment results.
    Accepts .py, .js, or .jsx files.
    """
    try:
        # Validate file type
        allowed_extensions = {'.py', '.js', '.jsx'}
        file_extension = os.path.splitext(file.filename)[1].lower()
        if file_extension not in allowed_extensions:
            raise HTTPException(
                status_code=400, 
                detail="Invalid file type. Only .py, .js, or .jsx files are allowed."
            )

        # Read file content
        contents = await file.read()
        code = contents.decode("utf-8")
        
        if not code.strip():
            raise HTTPException(
                status_code=400,
                detail="File is empty"
            )

        # Initialize Groq model
        model = ChatGroq(
            groq_api_key="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",
            model_name="Llama-3.3-70b-versatile"
        )

        # System prompt for code analysis
        system_prompt = """You are an expert code quality analyzer. Analyze the provided code and return a detailed assessment in EXACTLY this JSON format:
{
    "overall_score": [score 0-100],
    "breakdown": {
        "naming": [score 0-10],
        "modularity": [score 0-20],
        "comments": [score 0-20],
        "formatting": [score 0-15],
        "reusability": [score 0-15],
        "best_practices": [score 0-20]
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

        # Analyze code
        messages = [
            SystemMessage(content=system_prompt),
            HumanMessage(content=code)
        ]

        result = model.invoke(messages)
        
        try:
            analysis = json.loads(result.content)
            
            # Validate the response structure
            if not all(key in analysis for key in ['overall_score', 'breakdown', 'recommendations']):
                raise ValueError("Invalid analysis format returned by model")
                
            return {
                "status": "success",
                "analysis": analysis
            }
            
        except json.JSONDecodeError:
            return {
                "status": "error",
                "message": "Failed to parse analysis results"
            }
        except ValueError as ve:
            return {
                "status": "error",
                "message": str(ve)
            }

    except HTTPException as he:
        raise he
    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail=f"An error occurred: {str(e)}"
        )

@app.get("/health")
async def health_check():
    """Health check endpoint"""
    return {"status": "healthy"}

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)