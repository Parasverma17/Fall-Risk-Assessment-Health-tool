# FRAT Application - Local Development Setup Guide

**Falls Risk Assessment Tool (FRAT)** - Complete setup instructions for running the application on localhost.

---

## Table of Contents

1. [Prerequisites](#prerequisites)
2. [Project Structure](#project-structure)
3. [Step-by-Step Setup](#step-by-step-setup)
4. [Running the Application](#running-the-application)
5. [Testing with Sample Patients](#testing-with-sample-patients)
6. [Troubleshooting](#troubleshooting)

---

## Prerequisites

Before you begin, ensure you have the following installed on your system:

### Required Software

1. **Python 3.8+**

   - Download from: https://www.python.org/downloads/
   - Verify installation: `python --version`

2. **Node.js 16+ and npm**

   - Download from: https://nodejs.org/
   - Verify installation: `node --version` and `npm --version`

3. **Git** (for cloning the repository)

   - Download from: https://git-scm.com/downloads
   - Verify installation: `git --version`

4. **OpenRouter API Key** (for AI Care Plan generation)
   - Sign up at: https://openrouter.ai/
   - Generate an API key from your dashboard

---

## Project Structure

```
2025-wellTechThree/
├── BACKEND/              # Flask backend service
├── AI/                   # FastAPI AI microservice
├── frat_web_app/         # React frontend
├── patient_data/         # Sample patient data for testing
└── README files...
```

---

## Step-by-Step Setup

### 1. Clone the Repository

```bash
git clone <repository-url>
cd 2025-wellTechThree
```

---

### 2. Backend Setup (Flask)

#### Navigate to Backend Folder

```bash
cd BACKEND
```

#### Create Virtual Environment

**Windows (PowerShell):**

```powershell
python -m venv venv
.\venv\Scripts\Activate.ps1
```

**macOS/Linux:**

```bash
python3 -m venv venv
source venv/bin/activate
```

#### Install Dependencies

```bash
pip install -r requirements.txt
```

#### Configure Environment Variables

Create a `.env` file in the `BACKEND` folder:

```bash
# Copy the example file
cp .env.example .env
```

Edit `.env` and set the following:

```env
FRONTEND_URL=http://localhost:3000
BACKEND_URL=http://localhost:5000
FHIR_SERVER_URL=https://launch.smarthealthit.org/v/r4/fhir
CLIENT_ID=abc
CLIENT_SECRET=
SECRET_KEY=your-secret-key-here
SESSION_COOKIE_SECURE=False
CORS_ORIGINS=http://localhost:3000
```

#### Test Backend

```bash
python run.py
```

Backend should be running at: http://localhost:5000

**Keep this terminal open!**

---

### 3. AI Service Setup (FastAPI)

#### Open a New Terminal

Navigate to the AI folder:

```bash
cd AI
```

#### Create Virtual Environment

**Windows (PowerShell):**

```powershell
python -m venv venv
.\venv\Scripts\Activate.ps1
```

**macOS/Linux:**

```bash
python3 -m venv venv
source venv/bin/activate
```

#### Install Dependencies

```bash
pip install -r requirements.txt
```

#### Configure Environment Variables

Create a `.env` file in the `AI` folder:

```bash
# Copy the example file
cp .env.example .env
```

Edit `.env` and set your OpenRouter API key:

```env
OPENROUTER_API_KEY=sk-or-v1-xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
MODEL_ID=meta-llama/llama-3.1-8b-instruct:free
```

#### Test AI Service

```bash
uvicorn ai_careplan:app --reload --host 0.0.0.0 --port 8000
```

AI Service should be running at: http://localhost:8000

You can test it by visiting: http://localhost:8000/health

**Keep this terminal open!**

---

### 4. Frontend Setup (React)

#### Open a New Terminal

Navigate to the frontend folder:

```bash
cd frat_web_app
```

#### Install Dependencies

```bash
npm install
```

#### Configure Environment Variables

Create a `.env.development` file in the `frat_web_app` folder:

```env
REACT_APP_BACKEND_URL=http://localhost:5000
REACT_APP_AI_SERVICE_URL=http://localhost:8000
REACT_APP_FHIR_SERVER=https://launch.smarthealthit.org/v/r4/fhir
```

#### Test Frontend

```bash
npm start
```

Frontend should automatically open in your browser at: http://localhost:3000

**Keep this terminal open!**

---

## Running the Application

You should now have **three terminals running**:

1. **Terminal 1:** Backend (Flask) - Port 5000
2. **Terminal 2:** AI Service (FastAPI) - Port 8000
3. **Terminal 3:** Frontend (React) - Port 3000

---

## Complete User Workflow (Step-by-Step)

### Step 1: Launch the Application via SMART on FHIR

1. Open your browser and navigate to the **SMART Launcher**:

   ```
   https://launch.smarthealthit.org/
   ```

2. On the SMART Launcher page, you'll see an **"App Launch URL"** field.

3. **Copy and paste** this URL into that field:

   ```
   http://localhost:5000/auth/launch
   ```

4. Click the **"Launch"** button.

---

### Step 2: Login as a Practitioner

1. The SMART Launcher will prompt you to log in as a **Practitioner**.

2. This step happens automatically - just proceed through the authentication flow.

---

### Step 3: Select a Patient

1. After practitioner authentication, you'll see a **patient search interface**.

2. **Search for a patient by name**. You can search by:

   - First name (e.g., "Betty", "Paul", "Linh")
   - Last name (e.g., "Taylor", "Anderson", "Nguyen")
   - Full name (e.g., "Betty Taylor", "Paul Anderson")

3. **Available patients** (see full details in [Sample Patient Names](#sample-patient-names) section):

   - Betty Taylor
   - Paul Anderson
   - Linh Nguyen
   - Robert Williams
   - Mary Davis
   - Michael Johnson
   - Susan Brown
   - Charles Wilson
   - Rosa Garcia
   - Frank Miller

4. **Click on a patient** from the search results to select them.

---

### Step 4: View Patient Information

1. After selecting a patient, you'll be **automatically redirected** to the Patient Information page.

2. This page displays:

   - **Demographics:** Name, Date of Birth, Gender, Hospital ID
   - **Medical History:** Existing conditions
   - **Current Medications:** List of medications
   - **Recent Observations:** AMTS score and other clinical observations
   - **Immunizations:** Vaccination history

3. You can also navigate to this page from the **Landing Page** by clicking "View Patient Info" (if you're already authenticated).

---

### Step 5: Start Falls Risk Assessment

1. From the Patient Info page, click the **"Start Assessment"** button.

2. You'll be taken to the **Assessment Page**.

---

### Step 6: Complete Part 1 of Assessment

Fill in all required fields in **Part 1**:

- **Recent Falls:** Select fall history (None, 3-12 months ago, Last 3 months, etc.)
- **High-Risk Medications:** Select how many high-risk medications the patient is taking
- **Psychological Status:** Select severity (None, Mild, Moderate, Severe)
- **Cognitive Impairment:** Select severity (Intact, Mild, Moderate, Severe)

Click **"Save Part 1 Draft"** to save your progress.

---

### Step 7: Complete Part 2 of Assessment

Fill in all applicable risk factors in **Part 2** (select all that apply):

- Vision impairment
- Mobility issues
- Transfer difficulties
- Behavioral concerns
- ADL limitations
- Unsafe equipment use
- Inappropriate footwear/clothing
- Environmental hazards
- Nutritional deficits
- Continence issues
- Other risk factors

Click **"Save Part 2 Draft"** to save your progress.

---

### Step 8: Submit Assessment

1. After completing **both Part 1 and Part 2**, click **"Submit Assessment"**.

2. **Form Validation:** If you haven't filled in all required fields in Part 1, you'll see validation errors. **Part 2 requires all boxes to be checked** for validation to pass. Please complete all required fields before submitting.

3. Upon successful submission, you'll be **automatically redirected** to the Results Page.

---

### Step 9: View Assessment Results

The **Results Page** displays:

1. **Four Key Metrics:**

   - Total Risk Score
   - Risk Level (Low, Medium, High, Very High)
   - Number of Risk Factors
   - Recommended Actions

2. **Risk Factor Breakdown:**

   - Detailed view of Part 1 and Part 2 responses
   - Color-coded risk indicators

3. **Print PDF Report:**
   - Click the **"Print PDF Report"** button to generate a printable assessment report

---

### Step 10: Generate AI Care Plan

1. From the Results Page, click the **"Generate AI Care Plan"** button.

2. You'll be taken to the **AI Care Plan Page**.

3. This page shows:

   - **Patient Demographics:** Summary of patient info
   - **Assessment Summary:** Risk level and key findings
   - **Model Selection:** Choose from 3 AI models:
     - Google Gemma 3 27B Instruct (Free)
     - NVIDIA Nemotron Nano 9B v2 (Free)
     - OpenAI GPT-OSS 20B (Free)

4. **Select a model** from the dropdown.

5. Click **"Generate Care Plan"**.

6. The AI will analyze:

   - Patient demographics and medical history
   - Assessment responses (Part 1 and Part 2)
   - Risk score and level
   - Current medications and observations

7. After processing (may take 10-30 seconds), you'll see:
   - **Personalized Care Plan:** Step-by-step recommendations
   - **Rationale:** Explanation of why these recommendations were made based on the patient's specific risk factors

---

## Sample Patient Names

Use these patient names when searching in the SMART Launcher. After practitioner authentication, search by first name, last name, or full name:

1. **Betty Ann Taylor** - Female, 1952-10-12 (Epilepsy, AMTS: 8/10)
2. **Paul Richard Anderson** - Male, 1962-03-25 (Previous MI, AMTS: 10/10)
3. **Linh An Nguyen** - Female, 1956-02-11 (At risk of falling, AMTS: 9/10)
4. **Robert James Williams** - Male, 1940-11-22 (Multiple falls, AMTS: 4/10)
5. **Mary Elizabeth Davis** - Female, 1950-06-14 (Anxiety disorder, AMTS: 8/10)
6. **Michael David Johnson** - Male, 1958-02-28 (Well-controlled diabetes, AMTS: 10/10)
7. **Susan Marie Brown** - Female, 1935-09-05 (Major depression, AMTS: 5/10)
8. **Charles Edward Wilson** - Male, 1946-12-01 (Previous fall, AMTS: 6/10)
9. **Rosa Isabel Garcia** - Female, 1960-07-18 (Well-controlled hypertension, AMTS: 9/10)
10. **Frank Joseph Miller** - Male, 1938-01-30 (Alzheimer's disease, AMTS: 2/10)

**Note:** These patients have pre-loaded data including complete medical history, current medications, AMTS scores, conditions, and immunization records for realistic testing.

---

## Quick Start Commands

### Start All Services (3 separate terminals)

**Terminal 1 - Backend:**

```bash
cd BACKEND
.\venv\Scripts\Activate.ps1  # Windows
# source venv/bin/activate    # macOS/Linux
python run.py
```

**Terminal 2 - AI Service:**

```bash
cd AI
.\venv\Scripts\Activate.ps1  # Windows
# source venv/bin/activate    # macOS/Linux
uvicorn ai_careplan:app --reload --host 0.0.0.0 --port 8000
```

**Terminal 3 - Frontend:**

```bash
cd frat_web_app
npm start
```

---

## Troubleshooting

### Backend Issues

**Problem:** `ModuleNotFoundError`

```bash
# Solution: Ensure virtual environment is activated and dependencies are installed
cd BACKEND
.\venv\Scripts\Activate.ps1
pip install -r requirements.txt
```

**Problem:** Port 5000 already in use

```bash
# Solution: Kill the process using port 5000 or change the port in run.py
# Windows:
netstat -ano | findstr :5000
taskkill /PID <PID> /F

# macOS/Linux:
lsof -ti:5000 | xargs kill -9
```

---

### AI Service Issues

**Problem:** `401 Unauthorized` from OpenRouter

```bash
# Solution: Check your API key in AI/.env
# Make sure OPENROUTER_API_KEY is set correctly
```

**Problem:** Port 8000 already in use

```bash
# Solution: Use a different port
uvicorn ai_careplan:app --reload --host 0.0.0.0 --port 8001
# Then update REACT_APP_AI_SERVICE_URL in frat_web_app/.env.development
```

---

### Frontend Issues

**Problem:** `npm install` fails

```bash
# Solution: Clear npm cache and try again
npm cache clean --force
rm -rf node_modules package-lock.json
npm install
```

**Problem:** CORS errors in browser console

```bash
# Solution: Ensure backend is running and CORS_ORIGINS includes http://localhost:3000
# Check BACKEND/.env file
```

---

### SMART Launcher Issues

**Problem:** "Invalid launch parameters" error

```bash
# Solution: Make sure you're using the correct launch URL:
http://localhost:5000/auth/launch
# NOT https:// and NOT the frontend URL
```

**Problem:** Patient not found after selection

```bash
# Solution: Ensure backend is running and can connect to SMART FHIR server
# Check backend terminal logs for errors
```

---

## Development Tips

### Viewing Logs

- **Backend logs:** Check the terminal where `python run.py` is running
- **AI Service logs:** Check the terminal where `uvicorn` is running
- **Frontend logs:** Check browser console (F12 → Console tab)

### Restarting Services

If you make code changes:

- **Backend:** Press `Ctrl+C` and run `python run.py` again
- **AI Service:** uvicorn auto-reloads with `--reload` flag
- **Frontend:** React auto-reloads when you save files

### Data Storage

- Assessment data is stored in: `BACKEND/data/assessments/all_assessments.json`
- You can view this file to see all submitted assessments

---

## Next Steps

- All services running? → Go to https://launch.smarthealthit.org/
- Patient selected? → View patient info and start assessment
- Assessment complete? → View results and generate AI care plan
- Want to test another patient? → Click "Back to Landing" and launch again

---

## Support

For issues or questions:

1. Check the troubleshooting section above
2. Review terminal logs for error messages
3. Ensure all services are running on correct ports
4. Verify environment variables are set correctly

---

**Happy Testing!**
