import React from "react";

export default function ContactSection() {
  return (
    <section id="contact" className="contact-block">
      <div className="contact-inner">
        <h2>Contact Us</h2>
        <p>Questions or feedback? We’d love to hear from you.</p>
        <ul className="contact-list">
          <li>📍 Main Street 65, Sydney</li>
          <li>📞 (555) 111-345345</li>
          <li>✉️ hello@frat.example</li>
        </ul>
      </div>
    </section>
  );
}
