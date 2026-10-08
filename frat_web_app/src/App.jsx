import React from "react";
import { Routes, Route } from "react-router-dom";


import LandingPage from "./pages/LandingPage";
import PatientInfoPage from "./pages/PatientInfoPage";
import AssessmentPage from "./pages/AssessmentPage";
import ResultsPage from "./pages/ResultsPage";
import ErrorPage from "./pages/ErrorPage";
import CallBackPage from "./pages/CallBackPage";
import AICarePlanPage from "./pages/AICarePlanPage";
import AboutPage from "./pages/AboutPage";
import AccountPage from "./pages/AccountPage";
import LoginPage from "./pages/LoginPage";
import Footer from "./components/Footer";

import "./App.css";

export default function App() {
  return (
    <div className="theme-coral app-container">
      {/* Main content area that will grow */}
      <div className="main-content">
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/patient-info" element={<PatientInfoPage />} />
          <Route path="/assessment" element={<AssessmentPage />} />
          <Route path="/results" element={<ResultsPage />} />
          <Route path="/callback" element={<CallBackPage />} />
          <Route path="/ai-careplan" element={<AICarePlanPage />} />
          <Route path="/about" element={<AboutPage />} />
          <Route path="/account" element={<AccountPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/error" element={<ErrorPage />} />
          {/* 404 fallback */}
          <Route path="*" element={<ErrorPage />} />
        </Routes>
      </div>

      {/* Sticky footer - will always be at bottom */}
      <Footer />
    </div>
  );
}