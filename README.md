# FRAT - Falls Risk Assessment Tool


A comprehensive web-based application for assessing fall risk in elderly patients and generating AI-powered personalized care plans.

---

## Quick Links

- **[Local Setup Guide](SETUP_LOCALHOST.md)** - Complete instructions for running on localhost
- **[Deployment Guide](DEPLOYMENT_GUIDE.md)** - Instructions for testing the deployed application
- **Live Application:** https://2025-well-tech-three-frontend.vercel.app/

---

## Project Overview

FRAT (Falls Risk Assessment Tool) is a healthcare application that:

1. **Integrates with FHIR servers** using SMART on FHIR OAuth2 authentication
2. **Retrieves real patient data** including demographics, medical history, and medications
3. **Conducts standardized fall risk assessments** using a two-part clinical evaluation
4. **Calculates risk scores** and categorizes patients into risk levels
5. **Generates AI-powered care plans** with personalized recommendations using OpenRouter LLMs

---

## Architecture

```
┌─────────────────────────────────────────────────────────┐
│                  Frontend (React)                       │
│            Vercel: 2025-well-tech-three                 │
│                                                         │
│  Pages: Landing, Patient Info, Assessment,             │
│         Results, AI Care Plan                          │
└────────────┬──────────────────────────┬─────────────────┘
             │                          │
             │ JWT Auth                 │ AI Requests
             ▼                          ▼
┌────────────────────────┐  ┌─────────────────────────────┐
│  Backend (Flask)       │  │  AI Service (FastAPI)       │
│  Render: Free Tier     │  │  Render: Free Tier          │
│                        │  │                             │
│  • SMART OAuth         │  │  • OpenRouter Integration   │
│  • JWT Generation      │  │  • Care Plan Generation     │
│  • FHIR Client         │  │  • Multiple AI Models       │
│  • Assessment Storage  │  │  • Clinical Reasoning       │
└────────────┬───────────┘  └─────────────────────────────┘
             │
             │ FHIR API
             ▼
┌────────────────────────┐
│  SMART FHIR Server     │
│  launch.smarthealthit  │
│  • Patient Data        │
│  • OAuth Server        │
└────────────────────────┘
```

---

## Technology Stack

### Frontend

- **React 18** - UI framework
- **React Router** - Client-side routing
- **Axios** - HTTP client
- **CSS3** - Responsive design
- **Deployed on:** Vercel

### Backend

- **Flask** - Python web framework
- **SMART on FHIR** - Healthcare authentication
- **JWT** - Token-based auth
- **python-jose** - JWT encoding/decoding
- **fhirclient** - FHIR R4 integration
- **Deployed on:** Render (Free Tier)

### AI Service

- **FastAPI** - Modern Python API framework
- **OpenRouter** - AI model routing
- **Pydantic** - Data validation
- **httpx** - Async HTTP client
- **Deployed on:** Render (Free Tier)

---

## Project Structure

```
2025-wellTechThree/
│
├── BACKEND/                    # Flask backend service
│   ├── app/
│   │   ├── routes/            # API endpoints
│   │   │   ├── auth.py        # SMART OAuth & JWT
│   │   │   ├── patient.py     # Patient data endpoints
│   │   │   └── assessment.py  # Assessment endpoints
│   │   ├── services/
│   │   │   └── fhir_client.py # FHIR integration
│   │   ├── __init__.py        # App factory
│   │   └── config.py          # Configuration
│   ├── data/
│   │   └── assessments/       # Assessment storage
│   ├── requirements.txt
│   ├── run.py                 # Entry point
│   └── README.md
│
├── AI/                         # FastAPI AI microservice
│   ├── ai_careplan.py         # AI service implementation
│   ├── requirements.txt
│   ├── .env.example
│   └── README.md
│
├── frat_web_app/              # React frontend
│   ├── src/
│   │   ├── api/
│   │   │   └── fhir.js        # API client with JWT
│   │   ├── components/        # Reusable components
│   │   ├── pages/             # Page components
│   │   ├── App.jsx            # Main app
│   │   └── index.js           # Entry point
│   ├── public/
│   ├── package.json
│   └── README.md
│
├── patient_data/              # Sample patient data
│   ├── bundle.json
│   └── patient-*.json
│
├── SETUP_LOCALHOST.md         # Local development guide
├── DEPLOYMENT_GUIDE.md        # Deployment usage guide
└── README.md                  # This file
```

---

## 📚 Documentation

Each component has its own detailed README:

- **[BACKEND/README.md](BACKEND/README.md)** - Backend API documentation
- **[AI/README.md](AI/README.md)** - AI service documentation
- **[frat_web_app/README.md](frat_web_app/README.md)** - Frontend documentation

For setup and usage instructions:

- **[SETUP_LOCALHOST.md](SETUP_LOCALHOST.md)** - Complete local development setup
- **[DEPLOYMENT_GUIDE.md](DEPLOYMENT_GUIDE.md)** - Using the deployed application

---

## Key Features

### 1. SMART on FHIR Integration

- Standards-compliant healthcare authentication
- Real-time patient data retrieval
- OAuth2 authorization flow
- JWT token-based session management

### 2. Falls Risk Assessment

- Two-part standardized assessment
- Draft saving functionality
- Form validation
- Automated risk scoring
- Risk level categorization (Low, Medium, High, Very High)

### 3. Patient Data Management

- Demographics display
- Medical history
- Current medications
- Clinical observations (AMTS scores)
- Immunization records

### 4. Results Visualization

- Four key metrics dashboard
- Risk factor breakdown
- Color-coded risk indicators
- PDF report generation

### 5. AI-Powered Care Plans

- Three AI models to choose from
- Personalized recommendations
- Clinical rationale
- Risk factor-specific interventions
- Evidence-based guidelines

---

## Getting Started

### Option 1: Use Deployed Application (Recommended for Testing)

Follow the **[DEPLOYMENT_GUIDE.md](DEPLOYMENT_GUIDE.md)** for complete instructions.

**Quick Start:**

1. Go to https://launch.smarthealthit.org/
2. Paste `https://two025-welltechthree-backend.onrender.com/auth/launch` in App Launch URL
3. Click Launch and select a patient
4. First load may take 30-60 seconds (free tier cold start)

### Option 2: Run Locally

Follow the **[SETUP_LOCALHOST.md](SETUP_LOCALHOST.md)** for complete instructions.

**Prerequisites:**

- Python 3.8+
- Node.js 16+
- OpenRouter API key

**Quick Start:**

```bash
# Backend
cd BACKEND
python -m venv venv
source venv/bin/activate  # or .\venv\Scripts\Activate.ps1 on Windows
pip install -r requirements.txt
python run.py

# AI Service (new terminal)
cd AI
python -m venv venv
source venv/bin/activate
pip install -r requirements.txt
uvicorn ai_careplan:app --reload --host 0.0.0.0 --port 8000

# Frontend (new terminal)
cd frat_web_app
npm install
npm start
```

---

## Sample Test Patients

After practitioner authentication in the SMART Launcher, search for patients by first name, last name, or full name:

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

All patients have complete demographics, medical history, current medications, AMTS scores, conditions, and immunization records.

---

## Security Features

- JWT token-based authentication (24-hour expiration)
- HTTPS encryption in production
- CORS protection
- Safari-compatible (no third-party cookie issues)
- Access tokens never exposed to frontend
- OAuth2 standards compliance

---

## Demo Video

A complete video demonstration is available showing:

- Complete user workflow
- All features in action
- Patient selection and data display
- Assessment completion
- Results visualization
- AI care plan generation
- Handling of free tier cold starts

---

## Development

### Running Tests

```bash
# Backend tests
cd BACKEND
pytest

# Frontend tests
cd frat_web_app
npm test
```

### Building for Production

```bash
# Frontend build
cd frat_web_app
npm run build
```

---

## License

This project is developed as part of COMP3820 coursework.

---

## Team

**WellTech Three**  
COMP3820 - Project 23  
University Course Project - 2025

---

## Support

For detailed setup instructions, see:

- [SETUP_LOCALHOST.md](SETUP_LOCALHOST.md) for local development
- [DEPLOYMENT_GUIDE.md](DEPLOYMENT_GUIDE.md) for using the deployed app

For technical documentation, see the README files in each subfolder:

- [BACKEND/README.md](BACKEND/README.md)
- [AI/README.md](AI/README.md)
- [frat_web_app/README.md](frat_web_app/README.md)

---

**Thank you for reviewing the FRAT application!**
