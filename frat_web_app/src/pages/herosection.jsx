import React from "react";

export default function HeroSection({ onGetStarted }) {
  return (
    <section id="home" className="hero">
      <div className="hero__inner">
        <h1>
          Falls <span className="accent">RISK</span> Assessment Tool
        </h1>
        <p className="hero__lead">
          A modern digital tool that simplifies falls-risk assessment through intuitive
          design and secure FHIR integration.
        </p>
        <div className="hero__cta">
          <button className="btn btn-primary" onClick={onGetStarted}>
            Get Started
          </button>
        </div>
      </div>
    </section>
  );
}
