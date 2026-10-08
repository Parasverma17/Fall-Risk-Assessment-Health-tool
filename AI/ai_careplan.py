from __future__ import annotations
import os
import json
from typing import Dict, Any, List, Optional
from pathlib import Path

import httpx
from fastapi import FastAPI, HTTPException
from fastapi.responses import FileResponse
from fastapi.staticfiles import StaticFiles
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from dotenv import load_dotenv

# -------- Config --------
load_dotenv()
OPENROUTER_API_KEY = os.getenv("OPENROUTER_API_KEY", "")
print("Loaded OpenRouter API Key:", OPENROUTER_API_KEY[:10] + "..." if OPENROUTER_API_KEY else "NOT SET")
MODEL_ID = os.getenv("MODEL_ID", "gemma")

# Get CORS origins from environment and normalize
cors_origins_str = os.getenv("CORS_ORIGINS", "http://localhost:3000")
CORS_ORIGINS = [origin.strip().rstrip('/') for origin in cors_origins_str.split(",") if origin.strip()]

# If no origins specified or empty, allow all
if not CORS_ORIGINS:
    CORS_ORIGINS = ["*"]

print(f"CORS enabled for origins: {CORS_ORIGINS}")

app = FastAPI(title="AI Care Plan Service", version="0.1.0")

# Add CORS middleware with environment-based origins
app.add_middleware(
    CORSMiddleware,
    allow_origins=CORS_ORIGINS,
    allow_credentials=True,
    allow_methods=["*"],  # Allow all methods
    allow_headers=["*"],  # Allow all headers
    expose_headers=["*"],
)

# Available models
AVAILABLE_MODELS = {
    "gemma": "google/gemma-3-27b-it:free",
    "nemotron-nano": "nvidia/nemotron-nano-9b-v2:free", 
    "gpt-oss-20b": "openai/gpt-oss-20b:free"
}

# -------- Pydantic Models --------
class PatientFullInfo(BaseModel):
    id: str
    name: str
    birthDate: str
    gender: str
    hospital_id: str
    medical_history: List[str]
    medications: List[str]
    observations: List[str]
    amts_score: Optional[int] = None  # Fixed: Made optional
    immunizations: List[str]

class Assessment(BaseModel):
    part1: Dict[str, Any]
    part2: Dict[str, Any]

class CarePlanRequest(BaseModel):
    patient_info: PatientFullInfo
    assessment: Assessment
    risk_level: str
    risk_score: int
    model_id: str = "gemma"

class CarePlanResponse(BaseModel):
    risk_level: str
    care_plan: List[str]
    rationale: str

# -------- Helper Functions --------
def build_prompt(data: Dict[str, Any]) -> str:
    patient = data["patient_info"]
    assessment = data["assessment"]
    risk_level = data["risk_level"]
    risk_score = data["risk_score"]
    
    prompt = f"""
Based on the following patient information and falls risk assessment, provide a care plan:

Patient: {patient["name"]} (ID: {patient["id"]})
Age: Calculate from DOB {patient["birthDate"]}
Medical History: {", ".join(patient["medical_history"])}
Current Medications: {", ".join(patient["medications"])}
Risk Level: {risk_level}
Risk Score: {risk_score}

Assessment Results: {json.dumps(assessment, indent=2)}

Please provide a JSON response with:
{{
    "care_plan": ["recommendation 1", "recommendation 2", "recommendation 3"],
    "rationale": "Brief explanation of the recommendations"
}}
"""
    return prompt

def _extract_json_block(text: str) -> str:
    """Extract JSON from response text."""
    import re
    json_match = re.search(r'```json\s*(.*?)\s*```', text, re.DOTALL)
    if json_match:
        return json_match.group(1)
    
    json_match = re.search(r'\{.*\}', text, re.DOTALL)
    if json_match:
        return json_match.group(0)
    
    return text

async def call_openrouter(prompt: str, model_id: str = "gemma") -> Dict[str, Any]:
    if not OPENROUTER_API_KEY:
        raise HTTPException(status_code=500, detail="Missing OPENROUTER_API_KEY")
    
    if model_id not in AVAILABLE_MODELS:
        raise HTTPException(status_code=400, detail=f"Model '{model_id}' not available")
    
    openrouter_model = AVAILABLE_MODELS[model_id]
    
    url = "https://openrouter.ai/api/v1/chat/completions"
    headers = {
        "Authorization": f"Bearer {OPENROUTER_API_KEY}",
        "Content-Type": "application/json",
        "HTTP-Referer": "http://localhost:8000/",
        "X-Title": "AI Care Plan Service",
    }
    payload = {
        "model": openrouter_model,
        "messages": [
            {"role": "system", "content": "You are a helpful clinical AI. Always respond with valid JSON."},
            {"role": "user", "content": prompt},
        ],
        "temperature": 0.3,
    }
    
    print(f"Using model: {openrouter_model}")
    
    try:
        async with httpx.AsyncClient(timeout=120) as client:
            r = await client.post(url, headers=headers, json=payload)
        
        print(f"Response status: {r.status_code}")
        
        if r.status_code >= 400:
            error_detail = f"Model '{openrouter_model}' failed: {r.text}"
            raise HTTPException(status_code=r.status_code, detail=error_detail)
        
        data = r.json()
        content = data["choices"][0]["message"]["content"]
        
        parsed_text = _extract_json_block(content)
        parsed = json.loads(parsed_text)
        
        return parsed
    
    except Exception as e:
        print(f"Error: {str(e)}")
        raise HTTPException(status_code=500, detail=str(e))

# -------- API Endpoints --------
@app.get("/")
async def root():
    return {
        "message": "AI Care Plan Service is running",
        "version": "0.1.0",
        "endpoints": ["/docs", "/api/models", "/api/ai-careplan", "/health"]
    }

@app.get("/health")
async def health_check():
    return {
        "status": "healthy",
        "api_key_loaded": bool(OPENROUTER_API_KEY),
        "available_models": list(AVAILABLE_MODELS.keys())
    }

@app.get("/api/models")
async def get_available_models():
    return {
        "models": [
            {"id": "gemma", "name": "Gemma 3-27B IT (Free)", "description": "Advanced reasoning model by Google, completely free"},
            {"id": "nemotron-nano", "name": "NVIDIA Nemotron Nano 9B (Free)", "description": "Fast and efficient free model"},
            {"id": "gpt-oss-20b", "name": "GPT OSS 20B (Free)", "description": "Open-source GPT model, free to use"}
        ]
    }

@app.post("/api/ai-careplan", response_model=CarePlanResponse)
async def ai_careplan(body: CarePlanRequest) -> CarePlanResponse:
    try:
        print(f"Received request for model: {body.model_id}")
        prompt = build_prompt(body.model_dump())
        result = await call_openrouter(prompt, body.model_id)
        
        return CarePlanResponse(
            risk_level=body.risk_level,
            care_plan=result.get("care_plan", []),
            rationale=result.get("rationale", ""),
        )
    except Exception as e:
        print(f"Error in ai_careplan: {str(e)}")
        raise

# -------- Static Files (Optional) --------
if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)