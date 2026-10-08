# Frontend README

**This README is for the Frontend (React) component of the FRAT application.**

---

# FRAT Frontend (React Web App)

React-based user interface for the Falls Risk Assessment Tool (FRAT) application.

---

## Overview

The frontend provides:

- **SMART on FHIR integration** for patient context
- **Interactive assessment forms** with validation
- **Real-time risk calculation** and visualization
- **AI-powered care plan generation** interface
- **Responsive design** for desktop and tablet
- **JWT authentication** for secure API access

---

## Features

- SMART on FHIR launch workflow
- Patient demographics and clinical data display
- Two-part falls risk assessment
- Draft saving functionality
- Form validation and error handling
- Risk score calculation and visualization
- PDF report generation
- AI care plan interface with model selection
- Modern, accessible UI components

---

## Setup Instructions

### 1. **Install Node.js and npm**

If you don't have Node.js and npm installed, download and install from:  
[https://nodejs.org/](https://nodejs.org/)

---

### 2. **Install Frontend Dependencies**

Navigate to the `frat_web_app` folder and install dependencies:

```sh
cd 2025-wellTechThree/frat_web_app
npm install
```

---

### 3. **Start the React Frontend**

Run the following command to start the development server:

```sh
npm start
```

- The app will open at [http://localhost:3000](http://localhost:3000) in your browser.

---

## SMART on FHIR Launch Workflow

1. **Start the Flask Backend**

   - Open a terminal in the `BACKEND` folder.
   - Run:
     ```sh
     python run.py
     ```
   - The backend will be available at [http://localhost:5000](http://localhost:5000).

2. **Start the AI Service**

   - Open a terminal in the `AI` folder.
   - Run:
     ```sh
     uvicorn ai_careplan:app --reload
     ```
   - The AI microservice will be available at [http://localhost:8000](http://localhost:8000).

3. **Start the React Frontend**

   - Open a terminal in the `frat_web_app` folder.
   - Run:
     ```sh
     npm start
     ```
   - The frontend will be available at [http://localhost:3000](http://localhost:3000).

4. **SMART Launcher Steps**

   - Go to [https://launch.smarthealthit.org/](https://launch.smarthealthit.org/) in your browser.
   - In the SMART Launcher, **paste this link** in the "App Launch URL" field:
     ```
     http://localhost:5000/auth/launch
     ```
   - Click **Launch**.
   - Select a patient from the SMART Launcher interface.
   - The FRAT app will open and display the selected patient's information.

---

## Patient Data Setup (Optional for Testing)

Load custom patient data:

1. **Use Postman or similar tool.**
2. **Send a POST request** to:
   ```
   https://launch.smarthealthit.org/v/r4/fhir
   ```
3. **Upload your `bundle.json (in patient_data folder)`** to FHIR SERVER.

---

## Typical User Flow

1. **Launch the app via SMART on FHIR as described above.**
2. **Select a patient** in the SMART Launcher.
3. **View patient information** in the FRAT app.
4. **Complete the assessment** by answering the questions.
5. **Submit the assessment** and view results.
6. **Generate AI Care Plan** for the patient (requires AI microservice running).

---

## Development Notes

- Main React code is in `src/pages/` and `src/components/`.
- API calls are handled in `src/api/fhir.js`.
- Styles are in `src/App.css` and `src/index.css`.

---

## Environment Variables

Create a `.env.development` file for local development:

```env
REACT_APP_BACKEND_URL=http://localhost:5000
REACT_APP_AI_SERVICE_URL=http://localhost:8000
REACT_APP_FHIR_SERVER=https://launch.smarthealthit.org/v/r4/fhir
```

Create a `.env.production` file for deployment:

```env
REACT_APP_BACKEND_URL=https://two025-welltechthree-backend.onrender.com
REACT_APP_AI_SERVICE_URL=https://your-ai-service.onrender.com
REACT_APP_FHIR_SERVER=https://launch.smarthealthit.org/v/r4/fhir
```

---

## Project Structure

```
src/
├── api/
│   └── fhir.js              # API client with JWT authentication
├── components/
│   ├── Navbar.jsx           # Navigation component
│   ├── Footer.jsx           # Footer component
│   └── Loader.jsx           # Loading spinner
├── pages/
│   ├── LandingPage.jsx      # Home/landing page
│   ├── LoginPage.jsx        # Login page
│   ├── CallBackPage.jsx     # OAuth callback handler
│   ├── PatientInfoPage.jsx  # Patient demographics display
│   ├── AssessmentPage.jsx   # Assessment form (Part 1 & 2)
│   ├── ResultsPage.jsx      # Assessment results
│   └── AICarePlanPage.jsx   # AI care plan generation
├── App.jsx                  # Main app component with routing
├── App.css                  # Global styles
└── index.js                 # Entry point
```

---

## Key Technologies

- **React 18** - UI framework
- **React Router** - Client-side routing
- **Axios** - HTTP client for API calls
- **localStorage** - JWT token persistence
- **CSS3** - Styling and responsive design

---

## Troubleshooting

**App not loading:**

```bash
# Check if backend is running
curl http://localhost:5000/health

# Check if AI service is running
curl http://localhost:8000/health

# Clear npm cache
npm cache clean --force
rm -rf node_modules package-lock.json
npm install
```

**CORS errors:**

- Verify backend `CORS_ORIGINS` includes `http://localhost:3000`
- Check browser console for specific CORS error details
- Ensure backend is running before starting frontend

**SMART launch issues:**

- Confirm launch URL: `http://localhost:5000/auth/launch` (not frontend URL)
- Check backend logs for OAuth errors
- Verify FHIR server is accessible

**JWT/Authentication errors:**

- JWT tokens expire after 24 hours
- Try clearing localStorage: `localStorage.clear()` in browser console
- Re-launch via SMART launcher to get new token

**Build errors:**

```bash
# Update dependencies
npm update

# Fix security vulnerabilities
npm audit fix
```

---
