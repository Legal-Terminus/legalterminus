import React from "react";
import "../CompanyRegHero/CompanyRegHero.css";
import ConsultationForm from "../ConsultationForm/ConsultationForm";
import LOGO_ASSET from "../../assets/Legal-Terminus-LOGO-GIF_300-x-150.gif";

const FEATURES = [
  {
    title: "100% Online Filing + Bhubaneswar Office",
    text: "File your trademark from anywhere with expert guidance, or visit our Bhubaneswar office for personalized, face-to-face support.",
  },
  {
    title: "Free Expert Consultation",
    text: "Talk to our IP specialists to identify the right Nice class and the best filing strategy for your brand.",
  },
  {
    title: "Lifetime Status Updates",
    text: "Monthly status updates on your TM-A application for its entire lifecycle, with clear, no-hidden-charge pricing.",
  },
];

const TrademarkHero = () => {
  return (
    <section className="crh-hero">
      <div className="crh-blob crh-blob-1" aria-hidden="true" />
      <div className="crh-blob crh-blob-2" aria-hidden="true" />
      <div className="crh-grid" aria-hidden="true" />

      <div className="crh-container">
        {/* ---------------- LEFT ---------------- */}
        <div className="crh-content">
          <a href="/" className="crh-logo">
            <img
              src={LOGO_ASSET}
              alt="Legal Terminus"
            />
          </a>

          <span className="crh-badge">
            <span className="crh-badge-dot" />
            Trusted by 3,500+ Brands across Odisha
          </span>

          <h1 className="crh-title">
            Trademark Registration <br />
            in <span className="crh-title-accent">Odisha</span>
          </h1>

          <p className="crh-subtitle">
            Secure exclusive legal rights for your brand name, logo, and tagline under the
            Trade Marks Act, 1999 — filed on the official IP India portal with complete expert support.
          </p>

          <div className="crh-price">
            <div className="crh-price-icon">™</div>
            <div className="crh-price-text">
              <strong>Trademark filing starting from ₹1,499</strong>
              <span>excluding government fees</span>
            </div>
          </div>

          <ul className="crh-features">
            {FEATURES.map((f) => (
              <li className="crh-feature" key={f.title}>
                <span className="crh-check" aria-hidden="true">
                  <svg viewBox="0 0 24 24" width="16" height="16" fill="none">
                    <path
                      d="M20 6L9 17l-5-5"
                      stroke="currentColor"
                      strokeWidth="3"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                </span>
                <div className="crh-feature-body">
                  <h3>{f.title}</h3>
                  <p>{f.text}</p>
                </div>
              </li>
            ))}
          </ul>

          <div className="crh-trust">
            <div className="crh-trust-count">
              <strong>3,500+</strong>
              <span>Trademark applications filed</span>
            </div>

            <div className="crh-trust-divider" />

            <div className="crh-rating">
              <span className="crh-google" aria-hidden="true">
                <svg viewBox="0 0 24 24" width="22" height="22">
                  <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.77h3.57c2.08-1.92 3.27-4.74 3.27-8.1Z" />
                  <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.65l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84A11 11 0 0 0 12 23Z" />
                  <path fill="#FBBC05" d="M5.84 14.11a6.6 6.6 0 0 1 0-4.22V7.05H2.18a11 11 0 0 0 0 9.9l3.66-2.84Z" />
                  <path fill="#EA4335" d="M12 4.75c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 1.47 14.97.5 12 .5a11 11 0 0 0-9.82 6.05l3.66 2.84C6.71 6.68 9.14 4.75 12 4.75Z" />
                </svg>
              </span>
              <div className="crh-rating-text">
                <div className="crh-stars">
                  <strong>4.9/5</strong>
                  <span className="crh-stars-glyphs">★★★★★</span>
                </div>
                <span>Odisha&apos;s top-rated legal, tax &amp; compliance platform</span>
              </div>
            </div>
          </div>
        </div>

        {/* ---------------- RIGHT (FORM) ---------------- */}
        <div className="crh-form-col">
          <ConsultationForm
            source="trademark-application"
            title="Talk to an Expert"
            subtitle="Book your free consultation — our trademark expert calls you back."
          />
        </div>
      </div>
    </section>
  );
};

export default TrademarkHero;
