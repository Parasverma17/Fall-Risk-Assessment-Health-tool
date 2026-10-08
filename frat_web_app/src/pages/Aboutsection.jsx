import React from "react";

export default function AboutSection() {
  return (
    <section id="about" className="section">
      <div className="section__inner">
        <h2>Who We Are?</h2>
        <div>
          <p>
            FRAT helps clinicians assess falls risk quickly and accurately with an intuitive
            workflow and secure SMART-on-FHIR integration.
          </p>
          <p>Our design emphasizes clarity, accessibility, and speed.</p>
          <p>
            A desktop, tablet or mobile app that is clinically useful digital tool that can calculate falls risk score (60 years above) after answering a questionnaire, then display it in a user-friendly way and provide guide or action plan for falls prevention strategy.
          </p>
          <p>
            If flag high risk, flag GP (meds) and physiotherapy (mobility) for review.
          </p>
          <p>
            It should be interoperable in various setting (hospital, community, residential aged care facility) and healthcare team (General Practitioner, Nurse, caregivers) can access the data and use the app.
          </p>
          <h3>Clinical Importance of Falls Risk</h3>
          <p>Falls are a leading cause of injury and death among older adults.</p>
          <p>High healthcare costs and long hospital stays are common outcomes.</p>
          <p>Prevention through early risk identification is essential.</p>
          <h3>Digital Intervention Strategy</h3>
          <p>SMART on FHIR-enabled app to assess and manage falls risk.</p>
          <p>Integration with EHRs for streamlined workflows.</p>
          <p>Features include patient data input, scoring, and tailored recommendations.</p>
        </div>
      </div>
    </section>
  );
}