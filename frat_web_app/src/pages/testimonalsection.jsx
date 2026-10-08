// src/pages/TestimonialSection.jsx

import React from "react";
import clinician1 from "../images/assessment.jpg";
import clinician2 from "../images/info.jpg";
import clinician3 from "../images/patient.jpg";



const TESTIMONIALS = [
  {
    id: 1,
    name: "Nurse Emma L.",
    role: "RN, Medical Ward",
    quote:
      "FRAT helped us standardize falls risk assessment without adding clicks. It’s fast, clear, and dependable.",
    img: clinician1,
    alt: "Nurse smiling at a desk",
  },
  {
    id: 2,
    name: "Dr. Michael P.",
    role: "Consultant Geriatrician",
    quote:
      "The scoring and nurse-friendly flow make FRAT easy to adopt across the team. Highly recommended.",
    img: clinician2,
    alt: "Doctor in teal shirt with coffee",
  },
  {
    id: 3,
    name: "Ward Manager Priya S.",
    role: "Ward Manager",
    quote:
      "FRAT integrates with our EHR and keeps documentation tidy. We’ve seen quicker assessments and better handovers.",
    img: clinician3,
    alt: "Manager in conversation",
  },
];

export default function TestimonialSection() {
  return (
    <section id="results" className="section testimony">
      <div className="container">
        <header className="section-header">
          <h2 className="section-title">Testimonials</h2>
          <p className="section-subtitle">
            Real stories from clinicians using FRAT every day.
          </p>
        </header>

        {/* Stacked hero cards (desktop / tablet) */}
        <div className="testimony-stack" aria-hidden="true">
          {/* middle/top card */}
          <figure className="stack-card card-center">
            <img src={TESTIMONIALS[1].img} alt="" />
          </figure>

          {/* left/back card */}
          <figure className="stack-card card-left">
            <img src={TESTIMONIALS[0].img} alt="" />
          </figure>

          {/* right/back card */}
          <figure className="stack-card card-right">
            <img src={TESTIMONIALS[2].img} alt="" />
          </figure>
        </div>

        {/* Quotes list (always visible; on mobile this is the main focus) */}
        <div className="testimony-grid" role="list">
          {TESTIMONIALS.map((t) => (
            <article key={t.id} className="testimonial" role="listitem">
              <div className="testimonial-media">
                <img src={t.img} alt={t.alt} />
              </div>
              <div className="testimonial-body">
                <blockquote>
                  <p>“{t.quote}”</p>
                </blockquote>
                <footer>
                  <strong>{t.name}</strong>
                  <span>{t.role}</span>
                </footer>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
