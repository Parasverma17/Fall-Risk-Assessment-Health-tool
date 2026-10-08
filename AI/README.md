# AI Service README

**This README is for the AI microservice component of the FRAT application.**

---

# AI Care Plan Microservice

FastAPI-based microservice for generating personalized fall-prevention care plans using AI.

---

## Overview

The AI service:

- **Accepts patient data** and assessment results via REST API
- **Calls OpenRouter API** with multiple LLM models
- **Generates personalized care plans** based on risk factors
- **Provides clinical rationale** for recommendations
- **Returns structured JSON** for frontend display

---

## Features

- Multiple AI model support (Gemma, Nemotron, GPT-OSS)
- Patient-specific care plan generation
- Risk-based recommendations
- Clinical rationale for each intervention
- RESTful API design
- CORS enabled for frontend integration
- Health check endpoint
- Error handling and validation

---

## Setup Instructions

### 1. **Clone the Repository**

If you haven't already, clone the main project repo and navigate to the `AI` folder:

```sh
cd 2025-wellTechThree/AI
```

---

### 2. **Python Environment**

It is recommended to use a virtual environment:

```sh
python -m venv venv
source venv/bin/activate   # On Windows: venv\Scripts\activate
```

---

### 3. **Install Dependencies**

Install required Python packages:

```sh
pip install fastapi httpx python-dotenv pydantic uvicorn
```

---

### 4. **Configure Environment Variables**

Copy `.env.example` to `.env` (if not already present) and fill in your OpenRouter API key:

```sh
cp .env.example .env
```

Edit `.env` and set:

```
OPENROUTER_API_KEY=sk-or-xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
MODEL_ID=google/gemma-3-27b-it:free
```

- You can get your API key from [https://openrouter.ai/](https://openrouter.ai/) (sign up and generate a key).
- `MODEL_ID` is optional; defaults to `google/gemma-3-27b-it:free`.

---

### 5. **Run the FastAPI Server**

Start the service with:

```sh
run this:
uvicorn ai_careplan:app --reload --host 0.0.0.0 --port 8000

# uvicorn ai_careplan:app --reload
```

- The API will be available at: [http://localhost:8000/api/ai-careplan](http://localhost:8000/api/ai-careplan)

---

### 6. **CORS Support**

CORS is enabled by default for all origins, so you can call this API from your frontend running on a different port (e.g., React on `localhost:3000`).

---

### 7. **API Usage**

**Endpoint:**  
`POST /api/ai-careplan`

**Payload Example:**

```json
{
  "patient_info": {
    "id": "123456",
    "name": "Jane Doe",
    "birthDate": "1950-01-01",
    "gender": "female",
    "hospital_id": "UR001",
    "medical_history": ["Hypertension"],
    "medications": ["Amlodipine"],
    "observations": ["AMTS: 9/10"],
    "amts_score": 9,
    "immunizations": ["Influenza vaccine on 2025-04-03"]
  },
  "assessment": {
    "part1": { ... },
    "part2": { ... }
  },
  "risk_level": "HIGH",
  "risk_score": 18
}
```

**Response Example:**

```json
{
  "risk_level": "HIGH",
  "care_plan": [
    "Review medications for fall risk.",
    "Increase supervision.",
    "Refer to physiotherapy."
  ],
  "rationale": "Patient has multiple risk factors including recent falls and high-risk medications."
}
```

---

### 8. **Available AI Models**

Get list of models:

```bash
GET /api/models
```

Response:

```json
{
  "models": [
    {
      "id": "google/gemma-3-27b-it:free",
      "name": "Google Gemma 3 27B",
      "description": "Advanced model for comprehensive care planning"
    },
    {
      "id": "nvidia/nemotron-nano-9b-v2:free",
      "name": "NVIDIA Nemotron Nano 9B",
      "description": "Optimized for healthcare applications"
    },
    {
      "id": "openai/gpt-oss-20b:free",
      "name": "GPT-OSS 20B",
      "description": "Open-source model for clinical reasoning"
    }
  ]
}
```

---

### 9. **Health Check**

Check service status:

```bash
GET /health
```

Response:

```json
{
  "status": "healthy",
  "service": "AI Care Plan Generator",
  "api_key_loaded": true
}
```

---

### 10. **Troubleshooting**

**401 Unauthorized from OpenRouter:**

```bash
# Check API key in .env file
cat .env | grep OPENROUTER_API_KEY

# Verify API key is valid at https://openrouter.ai/keys
# Make sure key starts with: sk-or-v1-
```

**CORS errors:**

```bash
# CORS is enabled for all origins by default
# Check browser console for specific error
# Ensure service is running on correct port (8000)
```

**Model errors:**

```bash
# Verify model ID is correct
# Check OpenRouter status: https://openrouter.ai/docs
# Try a different model from the list
```

**Timeout errors:**

```bash
# Increase timeout in call_openrouter() function
# Some models may take longer to respond
# Try a faster model (e.g., Nemotron Nano)
```

**Port already in use:**

```bash
# Use a different port
uvicorn ai_careplan:app --reload --host 0.0.0.0 --port 8001

# Or kill process using port 8000
lsof -ti:8000 | xargs kill -9  # macOS/Linux
netstat -ano | findstr :8000   # Windows (then taskkill /PID <PID> /F)
```

---

### 11. **Environment Variables**

Required:

```env
OPENROUTER_API_KEY=sk-or-v1-xxxxxxxxxxxxxxxxxx
```

Optional:

```env
MODEL_ID=google/gemma-3-27b-it:free
OPENROUTER_BASE_URL=https://openrouter.ai/api/v1
```

---

### 12. **Development Notes**

- Modify `ai_careplan.py` to customize prompts or response formatting
- Add new models by updating the `AVAILABLE_MODELS` list
- Adjust temperature and max_tokens in API call for different outputs
- Enable debug logging by setting `uvicorn --log-level debug`

---

### 13. **API Rate Limits**

OpenRouter free tier has rate limits:

- Check current limits at: https://openrouter.ai/docs/limits
- Consider upgrading for production use
- Implement retry logic for rate limit errors

---
