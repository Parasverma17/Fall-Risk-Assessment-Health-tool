// src/pages/LandingPage.jsx
import React, { useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";

import Navbar from "../components/Navbar";
import HeroSection from "../pages/herosection";
import ActionsSection from "../pages/actionsection";
import AboutSection from "../pages/Aboutsection";
import TestimonialSection from "../pages/testimonalsection";
import ContactSection from "../pages/contactsection";

import { scrollToSection } from "../pages/scrolltosection";

const SMART_LAUNCHER_URL = "https://launch.smarthealthit.org/";
const APP_LAUNCH_URL = `${process.env.REACT_APP_BACKEND_URL || 'http://localhost:5000'}/auth/launch`;

export default function LandingPage() {
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const stateTarget = location.state?.scrollTo;
    const queryTarget = new URLSearchParams(location.search).get("scroll");
    const target = stateTarget || queryTarget;

    if (target) {
      navigate(location.pathname, { replace: true });
      requestAnimationFrame(() => scrollToSection(target));
    }
  }, [location, navigate]);

  const handleSmartLaunch = async () => {
    try {
      await navigator.clipboard.writeText(APP_LAUNCH_URL);
      alert(`App Launch URL copied to clipboard!\n\nURL: ${APP_LAUNCH_URL}\n\nPaste it in the "App's Launch URL" field in SMART Launcher.`);
    } catch (err) {
      console.log('Could not copy to clipboard:', err);
    }
    window.open(SMART_LAUNCHER_URL, '_blank');
  };
  const handleViewInfo = () => navigate("/patient-info");
  const handleStartAssessment = () => navigate("/assessment");

  return (
    <main className="landing-page">
      <Navbar />
      {/* HERO / INTRO */}
      <HeroSection onGetStarted={() => scrollToSection("about")} />

      {/* “Three cards” section */}
      <ActionsSection
        onSelectPatient={handleSmartLaunch}
        onViewInfo={handleViewInfo}
        onStartAssessment={handleStartAssessment}
      />

      {/* Waterfall sections with ids for the navbar to target */}
      <AboutSection />
      <TestimonialSection />
      <ContactSection />
    </main>
  );
}
