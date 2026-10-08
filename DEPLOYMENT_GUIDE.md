# FRAT Application - Deployment Guide & User Walkthrough

**This guide provides complete instructions for accessing and using the deployed FRAT application.**

**Falls Risk Assessment Tool (FRAT)** - Complete guide for accessing and using the deployed application.

---

## Live Application URLs

- **Frontend:** https://2025-well-tech-three-frontend.vercel.app/
- **Backend API:** https://two025-welltechthree-backend.onrender.com
- **AI Service:** https://your-ai-service.onrender.com

---

## Table of Contents

1. [Important Notice](#important-notice)
2. [About the Application](#about-the-application)
3. [System Architecture](#system-architecture)
4. [Complete User Workflow](#complete-user-workflow)
5. [Sample Patient Names](#sample-patient-names)
6. [Features Overview](#features-overview)
7. [Technical Details](#technical-details)

---

## Important Notice

### First-Time Load Delay

The **Backend** and **AI Service** are deployed on **Render's Free Tier**, which puts services to sleep after 15 minutes of inactivity.

**What this means:**

- **First request may take 30-60 seconds** as services wake up
- **Subsequent requests are fast** once services are active
- **Everything works normally** - just be patient on first load

**This behavior is demonstrated in the team video.**

If you see a loading spinner or delay:

- This is normal and expected
- Services are starting up
- Wait 30-60 seconds and the app will work perfectly

---

## About the FRAT Web Application

**FRAT (Falls Risk Assessment Tool)** is a comprehensive web application designed to:

1. **Assess fall risk** in elderly patients using a standardized clinical assessment
2. **Calculate risk scores** based on multiple risk factors
3. **Generate personalized care plans** using AI to prevent falls
4. **Integrate with FHIR servers** for real patient data access
5. **Provide actionable insights** for healthcare professionals

### Technology Stack

- **Frontend:** React.js (deployed on Vercel)
- **Backend:** Flask (Python) - deployed on Render
- **AI Service:** FastAPI (Python) - deployed on Render
- **Authentication:** SMART on FHIR OAuth2
- **Data Standard:** FHIR R4
- **AI Models:** OpenRouter (Gemma 3 27B, Nemotron Nano 9B, GPT-OSS 20B)

---

## System Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                     User Browser                            │
│                  (Frontend - Vercel)                        │
│          https://2025-well-tech-three-frontend.vercel.app   │
└────────────┬───────────────────────────────────┬────────────┘
             │                                   │
             │ JWT Token Auth                    │ AI Requests
             ▼                                   ▼
┌────────────────────────────┐    ┌────────────────────────────┐
│   Backend API (Render)     │    │   AI Service (Render)      │
│   Flask + FHIR Client      │    │   FastAPI + OpenRouter     │
│   JWT Authentication       │    │   Care Plan Generation     │
└────────────┬───────────────┘    └────────────────────────────┘
             │
             │ FHIR API Calls
             ▼
┌────────────────────────────┐
│   SMART FHIR Server        │
│   launch.smarthealthit.org │
│   Patient Data Repository  │
└────────────────────────────┘
```

### Data Flow

1. **OAuth Flow:** Frontend → SMART Launcher → Backend → JWT Token → Frontend
2. **Patient Data:** Frontend (JWT) → Backend → FHIR Server → Backend → Frontend
3. **Assessment:** Frontend (JWT) → Backend → File Storage → Frontend
4. **AI Care Plan:** Frontend → AI Service → OpenRouter API → AI Service → Frontend

---

## Complete Testing Workflow (12 Steps)

### Step 1: Access the SMART Launcher

1. Open your browser and navigate to:

   ```
   https://launch.smarthealthit.org/
   ```

2. You'll see the **SMART App Launcher** interface.

---

### Step 2: Configure App Launch

1. In the **"App Launch URL"** field, paste:

   ```
   https://two025-welltechthree-backend.onrender.com/auth/launch
   ```

2. **Press Ctrl + V** (or Cmd + V on Mac) to paste the URL.

3. Click the **"Launch"** button.

4. ⏳ **Wait 30-60 seconds on first load** (services waking up from sleep - this is normal!)

---

### Step 3: Practitioner Login (Automatic)

1. The SMART Launcher will automatically log you in as a **Practitioner**.

2. You'll see practitioner credentials pre-filled (this happens automatically in the SMART sandbox).

3. Simply proceed through the authentication flow.

---

### Step 4: Search and Select a Patient

1. After practitioner authentication, you'll see a **patient search interface**.

2. **Type a patient name** in the search box. You can search by:

   - First name (e.g., "Betty", "Paul", "Linh")
   - Last name (e.g., "Taylor", "Anderson", "Nguyen")
   - Full name (e.g., "Betty Taylor", "Paul Anderson")

3. **Available patients to search for** (see full details in [Sample Patient Names](#sample-patient-names) section):

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

5. After clicking, the patient will be selected and you'll be redirected to the Patient Info page.

---

### Step 5: View Patient Information

**Automatic Redirect:** After patient selection, you're automatically redirected to the Patient Info page.

**What you'll see:**

1. **Demographics Section:**

   - Name: Full patient name
   - Patient ID: FHIR resource ID
   - Date of Birth
   - Gender
   - Hospital ID (Identifier)

2. **Medical History Section:**

   - List of current conditions
   - Clinical status (active, resolved, etc.)

3. **Current Medications Section:**

   - All medications the patient is currently taking

4. **Recent Observations Section:**

   - **AMTS Score** (Abbreviated Mental Test Score) - displayed prominently
   - Other clinical observations

5. **Immunizations Section:**
   - Vaccination history with dates

**Alternative Access:** You can also navigate here from the Landing Page by clicking "View Patient Info" (if already authenticated).

---

### Step 6: Start Falls Risk Assessment

1. From the Patient Info page, click the **"Start Assessment"** button at the bottom.

2. You'll be redirected to the **Assessment Page**.

---

### Step 7: Complete Part 1 of Assessment

Fill in all required fields in **Part 1 - Initial Risk Factors:**

**Recent Falls:**

- Select one option:
  - None in last 12 months
  - One or more between 3-12 months ago
  - One or more in last 3 months
  - One or more in last 3 months while inpatient/resident

**High-Risk Medications:**

- Select one option:
  - Not taking any of these medications
  - Taking one high-risk medication
  - Taking two high-risk medications
  - Taking more than two high-risk medications

**Psychological Status:**

- Select severity level:
  - None
  - Mild
  - Moderate
  - Severe

**Cognitive Impairment:**

- Select severity level:
  - Intact
  - Mild
  - Moderate
  - Severe

**After completing Part 1:**

- Click **"Save Part 1 Draft"** to save your progress
- A success message will appear

---

### Step 8: Complete Part 2 of Assessment

Fill in all applicable risk factors in **Part 2 - Detailed Risk Factors**.

**Important:** Form validation requires that **all boxes must be checked** for the form to submit successfully. This demonstrates thorough assessment of all potential risk factors.

**Available Options (all should be checked):**

- Vision impairment
- Mobility issues
- Transfers (difficulty moving between positions)
- Behaviours (confusion, agitation, etc.)
- Activities of Daily Living (ADL) limitations
- Unsafe use of equipment
- Inappropriate footwear or clothing
- Environmental hazards
- ☐ Nutritional deficits
- ☐ Continence issues
- ☐ Other risk factors

**Instructions:**

- Check all boxes that apply to the patient
- You can select multiple options
- It's okay if no boxes are checked (if patient has no Part 2 risk factors)

**After completing Part 2:**

- Click **"Save Part 2 Draft"** to save your progress
- A success message will appear

---

### Step 9: Submit Assessment

1. After completing **both Part 1 and Part 2**, scroll to the bottom of the page.

2. Click **"Submit Assessment"** button.

3. **Form Validation:**

   - If you haven't filled in all **required fields in Part 1**, you'll see validation errors
   - Red borders will appear around incomplete fields
   - Error messages will indicate what needs to be filled
   - **Part 2 requires all boxes to be checked** for validation to pass

4. **Fix any validation errors** and click "Submit Assessment" again.

5. Upon successful submission:
   - A success message appears
   - Assessment is saved to the database
   - You're **automatically redirected** to the Results Page

---

### Step 10: View Assessment Results

**Automatic Redirect:** After submission, you're taken to the Results Page.

**Four Key Metrics Displayed:**

1. **Total Risk Score:**

   - Numeric value (0-40+)
   - Calculated from all risk factors

2. **Risk Level:**

   - **Low Risk:** Green badge (Score 0-6)
   - **Medium Risk:** Yellow badge (Score 7-12)
   - **High Risk:** Orange badge (Score 13-20)
   - **Very High Risk:** Red badge (Score 21+)

3. **Number of Risk Factors:**

   - Count of Part 2 risk factors selected

4. **Recommended Actions:**
   - Summary of next steps based on risk level

**Detailed Risk Factor Breakdown:**

- **Part 1 Responses:**

  - Recent falls history
  - High-risk medications count
  - Psychological status
  - Cognitive impairment level

- **Part 2 Responses:**
  - All selected risk factors
  - Each factor displayed with a colored indicator

**Print PDF Report:**

1. Click the **"Print PDF Report"** button
2. Your browser's print dialog will open
3. You can:
   - Print to a physical printer
   - Save as PDF
   - Adjust print settings (margins, orientation, etc.)

---

### Step 11: Generate AI Care Plan

1. From the Results Page, scroll down to find the **"Generate AI Care Plan"** button.

2. Click the button.

3. You'll be redirected to the **AI Care Plan Page**.

---

### Step 12: AI Care Plan Generation

**Page Layout:**

1. **Patient Demographics Summary:**

   - Patient name, age, gender
   - Hospital ID
   - Medical history overview
   - Current medications
   - AMTS score

2. **Assessment Summary:**

   - Risk level (color-coded)
   - Total risk score
   - Key risk factors identified

3. **Model Selection:**
   - Dropdown menu with 3 AI models:
     - **Google Gemma 3 27B Instruct** (Free, High Quality)
     - **NVIDIA Nemotron Nano 9B v2** (Free, Fast)
     - **OpenAI GPT-OSS 20B** (Free, Balanced)

**Generating the Care Plan:**

1. **Select a model** from the dropdown menu.

2. Click **"Generate Care Plan"** button.

3. **Loading state** (10-30 seconds):

   - Spinner appears
   - "Generating personalized care plan..." message
   - Please wait - AI is analyzing patient data

4. **What the AI analyzes:**
   - Patient demographics (age, gender)
   - Medical history and conditions
   - Current medications
   - AMTS score (cognitive function)
   - Part 1 assessment responses
   - Part 2 risk factors
   - Overall risk score and level

**Generated Output:**

1. **Personalized Care Plan:**

   - Step-by-step recommendations
   - Prioritized by importance
   - Specific to patient's risk factors
   - Actionable interventions
   - Examples:
     - "Review medications with pharmacist to reduce polypharmacy"
     - "Refer to physiotherapy for mobility assessment"
     - "Increase supervision during ADLs"
     - "Install grab bars in bathroom"
     - "Schedule vision screening"

2. **Rationale Section:**
   - Detailed explanation of why these recommendations were made
   - References specific patient risk factors
   - Clinical reasoning
   - Evidence-based justifications
   - Examples:
     - "Given the patient's high-risk medication profile..."
     - "The AMTS score of 7/10 indicates mild cognitive impairment..."
     - "Recent falls in the last 3 months significantly increase risk..."

---

## Sample Patient Names

Use these patient names when searching in the SMART Launcher. After practitioner authentication, search for any of these patients by first name, last name, or full name:

| #   | Patient Name              | Gender | Date of Birth | Notable Features                                |
| --- | ------------------------- | ------ | ------------- | ----------------------------------------------- |
| 1   | **Betty Ann Taylor**      | Female | 1952-10-12    | Epilepsy, AMTS: 8/10, balance concerns          |
| 2   | **Paul Richard Anderson** | Male   | 1962-03-25    | Previous MI (recovered), AMTS: 10/10            |
| 3   | **Linh An Nguyen**        | Female | 1956-02-11    | At risk of falling, unsteadiness, AMTS: 9/10    |
| 4   | **Robert James Williams** | Male   | 1940-11-22    | Multiple recent falls, severe AMTS: 4/10        |
| 5   | **Mary Elizabeth Davis**  | Female | 1950-06-14    | Anxiety disorder, mobility concerns, AMTS: 8/10 |
| 6   | **Michael David Johnson** | Male   | 1958-02-28    | Well-controlled diabetes, AMTS: 10/10           |
| 7   | **Susan Marie Brown**     | Female | 1935-09-05    | Major depression, recent falls, AMTS: 5/10      |
| 8   | **Charles Edward Wilson** | Male   | 1946-12-01    | Previous fall, balance issues, AMTS: 6/10       |
| 9   | **Rosa Isabel Garcia**    | Female | 1960-07-18    | Well-controlled hypertension, AMTS: 9/10        |
| 10  | **Frank Joseph Miller**   | Male   | 1938-01-30    | Alzheimer's disease, confusion, AMTS: 2/10      |

**All patients have:**

- Complete demographic information
- Medical history and conditions
- Current medications
- AMTS scores
- Recent observations
- Immunization records

---

## Features Overview

### 1. SMART on FHIR Integration

- **OAuth2 authentication** with FHIR servers
- **Real-time patient data** retrieval
- **JWT token-based** session management (works on all browsers including Safari)
- **Secure** and standards-compliant

### 2. Falls Risk Assessment

- **Two-part assessment** (initial + detailed risk factors)
- **Standardized scoring** algorithm
- **Draft saving** for both parts
- **Form validation** to ensure data quality
- **Immediate results** after submission

### 3. Risk Calculation

- **Automated scoring** based on clinical guidelines
- **Risk level categorization** (Low, Medium, High, Very High)
- **Color-coded indicators** for quick visual assessment
- **Detailed breakdown** of all risk factors

### 4. PDF Report Generation

- **Print-friendly** format
- **Complete assessment** details
- **Risk score** and level prominently displayed
- **Timestamped** for record-keeping

### 5. AI-Powered Care Plans

- **Three AI models** to choose from
- **Personalized recommendations** based on patient data
- **Rationale** for each recommendation
- **Evidence-based** interventions
- **Actionable** and specific guidance

### 6. Data Persistence

- **All assessments saved** in backend database
- **Historical data** available for review
- **Patient-specific** storage (linked by patient ID)
- **JSON format** for easy retrieval and analysis

---

## Technical Details

### Authentication Flow

1. **User initiates launch** from SMART Launcher
2. **OAuth redirect** to SMART authorization server
3. **User authenticates** as practitioner
4. **User selects patient**
5. **Authorization code** returned to backend
6. **Backend exchanges code** for FHIR access token
7. **Backend creates JWT** containing patient_id and access_token
8. **JWT sent to frontend** via URL parameter
9. **Frontend stores JWT** in localStorage
10. **All subsequent API calls** include JWT in Authorization header

### Data Security

- **JWT tokens** expire after 24 hours
- **HTTPS** encryption for all deployed services
- **No session cookies** (Safari-compatible solution)
- **CORS configured** for frontend domain only
- **Access tokens** never exposed to frontend

### API Endpoints

**Backend (Flask):**

- `GET /auth/launch` - Initiate SMART launch
- `GET /auth/callback` - OAuth callback handler
- `GET /patient/info` - Get patient demographics and data
- `POST /assessment/submit` - Submit completed assessment
- `GET /assessment/result` - Retrieve assessment results
- `GET /assessment/draft` - Get saved draft
- `POST /assessment/draft` - Save assessment draft

**AI Service (FastAPI):**

- `POST /api/ai-careplan` - Generate AI care plan
- `GET /api/models` - List available AI models
- `GET /health` - Health check endpoint

### Deployment Architecture

**Frontend (Vercel):**

- Continuous deployment from main branch
- Global CDN distribution
- Automatic HTTPS
- Environment variables for API URLs

**Backend (Render):**

- Docker container deployment
- Auto-scaling (free tier: 1 instance)
- Persistent file storage for assessments
- Environment variables for secrets and config

**AI Service (Render):**

- Docker container deployment
- Auto-scaling (free tier: 1 instance)
- OpenRouter API integration
- Model selection and routing

---

## Important Notes

### Browser Compatibility

- **Chrome/Edge:** Fully supported
- **Firefox:** Fully supported
- **Safari (Desktop & iOS):** Fully supported (JWT-based auth)
- **Mobile browsers:** Fully supported

### Performance

- **First load:** 30-60 seconds (free tier cold start)
- **Subsequent loads:** < 2 seconds
- **AI generation:** 10-30 seconds (depends on model and complexity)
- **FHIR data retrieval:** 2-5 seconds

### Data Privacy

- **No personal data stored** beyond assessment submission
- **FHIR data** retrieved in real-time (not cached)
- **JWT tokens** stored only in browser localStorage
- **Assessments** linked to patient ID (not personal information)

---

## Video Demonstration

A complete video walkthrough demonstrating all features is available, including:

- First-time load delay (services waking up)
- Complete user workflow
- All features in action
- Patient selection and data display
- Assessment completion
- Results visualization
- AI care plan generation

---

## Troubleshooting

### Issue: Application takes a long time to load

**Solution:** This is expected on first load (free tier cold start). Wait 30-60 seconds. Subsequent loads will be fast.

### Issue: "Not authenticated" error

**Solution:** Your JWT token may have expired (24 hours). Click "Back to Landing" and launch again via SMART Launcher.

### Issue: Patient data not displaying

**Solution:** Ensure you selected a patient in the SMART Launcher. Try launching again and selecting a different patient.

### Issue: AI care plan generation fails

**Solution:** This may be due to API rate limits or service availability. Try again in a few moments or select a different AI model.

### Issue: Assessment won't submit

**Solution:** Check for validation errors (red borders on fields). All Part 1 fields are required. Fix errors and try again.

---

## Success Checklist

Before testing, ensure you:

- Accessed https://launch.smarthealthit.org/
- Pasted the correct backend URL in App Launch URL field
- Waited 30-60 seconds on first load (if needed)
- Selected a patient from the list
- Viewed patient information successfully
- Started and completed an assessment (both parts)
- Viewed assessment results
- Generated an AI care plan

---

## Support

For questions or issues:

1. Check the troubleshooting section above
2. Review the video demonstration
3. Ensure all URLs are correct
4. Wait for services to wake up on first load

---

**Application developed by: WellTech Three Team**  
**Course:** COMP3820 - Project 23  
**Year:** 2025

---

**Thank you for testing the FRAT application!**
