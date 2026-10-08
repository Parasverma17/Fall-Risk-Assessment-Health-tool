# Backend Service README

**This README is for the Backend API component of the FRAT application.**

---

# FRAT Backend Service

Flask-based REST API backend for the Falls Risk Assessment Tool (FRAT) application.

---

## Overview

The backend service handles:

- **SMART on FHIR OAuth2 authentication** with JWT token generation
- **Patient data retrieval** from FHIR servers
- **Assessment submission and storage** in JSON format
- **REST API endpoints** for frontend and AI service integration
- **CORS configuration** for cross-origin requests

---

## Features

- SMART on FHIR OAuth2 authentication
- JWT token-based authorization (Safari-compatible)
- Real-time FHIR data retrieval (R4 standard)
- Assessment draft saving and submission
- Persistent JSON storage for assessments
- RESTful API design
- CORS support for frontend integration

---

## Setup Instructions

### 1. **Clone the Repository**

If you haven't already, clone the main project repo and navigate to the `BACKEND` folder:

```sh
cd 2025-wellTechThree/BACKEND
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
pip install -r requirements.txt
```

---

### 4. **Configuration**

- Configuration settings are in `app/config.py`.
- You may need to set FHIR server URLs, secret keys, or other environment variables as required.

---

### 5. **Run the Flask Server**

Start the backend service with:

```sh
python run.py
```

- The API will be available at: [http://localhost:5000/](http://localhost:5000/)

---

## API Endpoints

### **Authentication**

- `GET /auth/launch` - Initiate SMART on FHIR launch
- `GET /auth/callback` - OAuth callback handler
- `POST /auth/verify-token` - Verify JWT token
- `GET /auth/logout` - Clear session

### **Patient**

- `GET /patient/info` - Get patient demographics and clinical data
- `GET /patient/conditions` - Get patient conditions
- `GET /patient/medications` - Get patient medications
- `GET /patient/observations` - Get patient observations
- `GET /patient/immunizations` - Get patient immunizations

### **Assessment**

- `GET /assessment/draft` - Retrieve saved assessment draft
- `POST /assessment/draft` - Save assessment draft
- `POST /assessment/submit` - Submit completed assessment
- `GET /assessment/result` - Get assessment results
- `POST /assessment/save` - Save assessment to patient record

---

## Data Storage

- All patient assessments are stored in:  
  `data/assessments/all_assessments.json`
- Each patient entry contains:
  - `patient_info`: demographics, medical history, medications, etc.
  - `assessments`: array of all submitted assessments for that patient

---

## Development Notes

- Main app code is in `app/routes/` (Flask Blueprints).
- FHIR integration is handled in `app/services/fhir_client.py`.
- You can extend or modify endpoints as needed for your workflow.

---

## Environment Variables

Create a `.env` file with the following variables:

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

For production deployment, set `SESSION_COOKIE_SECURE=True` and update URLs accordingly.

---

## Authentication Flow

1. Frontend initiates SMART launch via `/auth/launch`
2. User authenticates with FHIR authorization server
3. Callback receives authorization code at `/auth/callback`
4. Backend exchanges code for FHIR access token
5. Backend creates JWT containing patient_id and access_token
6. JWT sent to frontend via URL parameter
7. Frontend includes JWT in Authorization header for all API calls

---

## Troubleshooting

**Module not found:**

```bash
# Activate virtual environment
source venv/bin/activate  # macOS/Linux
.\venv\Scripts\Activate.ps1  # Windows

# Install dependencies
pip install -r requirements.txt
```

**Port conflicts:**

```bash
# Check what's using port 5000
lsof -ti:5000  # macOS/Linux
netstat -ano | findstr :5000  # Windows
```

**CORS errors:**

- Ensure `CORS_ORIGINS` in `.env` includes your frontend URL
- Check that frontend sends requests to correct backend URL

**JWT errors:**

- Verify `SECRET_KEY` is set in `.env`
- Check token hasn't expired (24-hour validity)

---
