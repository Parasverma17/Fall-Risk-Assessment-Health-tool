import React from "react";

export default function Footer() {
  return (
    <footer className="footer" role="contentinfo">
      <div className="footer-content">
        <strong className="footer-brand">FRAT</strong>
        <p>
          © {new Date().getFullYear()} FRAT System. All rights reserved.
          <br />
          In case of emergency, please call <a href="tel:000">000 (Ambulance)</a>.
        </p>
      </div>
    </footer>
  );
}
