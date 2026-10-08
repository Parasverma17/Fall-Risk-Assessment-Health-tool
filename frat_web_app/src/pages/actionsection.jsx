import React from "react";

export default function ActionsSection({ onSelectPatient, onViewInfo, onStartAssessment }) {
  return (
    <section className="actions-cards">
      <div className="cards">
        <article className="card">
          <div className="card__icon">👤</div>
          <h3>Select Patient</h3>
          <p>Launch SMART-on-FHIR to choose a patient from the hospital record system.</p>
          <ul className="card__list">
            <li>Secure SMART-on-FHIR flow</li>
            <li>Pulls demographics &amp; identifiers</li>
            <li>Works with sandbox or live EHR</li>
          </ul>
          <button className="btn" onClick={onSelectPatient}>Select Patient</button>
        </article>

        <article className="card">
          <div className="card__icon">📄</div>
          <h3>View Patient Info</h3>
          <p>Review demographics, risk scores, and existing care plans prior to assessment.</p>
          <ul className="card__list">
            <li>Quick risk history</li>
            <li>Readable summaries</li>
            <li>WCAG-compliant typography</li>
          </ul>
          <button className="btn" onClick={onViewInfo}>View Patient Info</button>
        </article>

        <article className="card">
          <div className="card__icon">✅</div>
          <h3>Start Assessment</h3>
          <p>Complete the FRAT and instantly generate a summary with recommended actions.</p>
          <ul className="card__list">
            <li>Nurse-friendly flow</li>
            <li>Automatic scoring &amp; risk level</li>
            <li>Shareable care-plan summary</li>
          </ul>
          <button className="btn" onClick={onStartAssessment}>Start Assessment</button>
        </article>
      </div>
    </section>
  );
}