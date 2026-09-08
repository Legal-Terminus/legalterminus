import React from "react";
import "../CompanyRegHero/CompanyRegHero.css";
import ConsultationForm from '../ConsultationForm/ConsultationForm';
import LOGO_ASSET from "../../assets/Legal-Terminus-LOGO-GIF_300-x-150.gif";

const FEATURES = [
  { title: "100% Online + Bhubaneswar Office" },
  { title: "Free Expert Consultation" },
  { title: "Transparent, No Hidden Charges" },
  { title: "Incorporation in 10–15 Days" },
];

const CroBreadcrum = () => {
  return (
    <section className="crh-hero">
      <div className="crh-blob crh-blob-1" aria-hidden="true" />
      <div className="crh-blob crh-blob-2" aria-hidden="true" />
      <div className="crh-grid" aria-hidden="true" />

      <div className="crh-container">
        {/* ---------------- LEFT ---------------- */}
        <div className="crh-content">
          <a href="/" className="crh-logo">
            <img src={LOGO_ASSET} alt="Legal Terminus" />
          </a>

          <span className="crh-badge">
            <span className="crh-badge-dot" />
            Company Registration Consultancy in Odisha
          </span>

          <h1 className="crh-title">
            Company Registration Consultancy
            <span className="crh-title-accent"> in Odisha</span>
            <br />
            <span className="crh-title-accent">Start Your Business the Right Way</span>
          </h1>

          <p className="crh-subtitle">
            Setting up a company in Bhubaneswar or anywhere across Odisha? Legal Terminus gives you
            expert, end-to-end assistance with proper documentation and complete compliance support —
            from name approval, DSC and DIN to MOA &amp; AOA, PAN, TAN and the Certificate of
            Incorporation, all filed on MCA21 V3. Whether it's a Private Limited, One Person Company,
            LLP or Public Limited, we register the right structure for your business. Consultancy
            services start from <strong>₹4,999</strong> (excluding government fees) with transparent,
            no-hidden-charge pricing and a free consultation to understand your requirements.
          </p>

          <div className="crh-price">
            <div className="crh-price-icon">₹</div>
            <div className="crh-price-text">
              <strong>Consultancy services starting from ₹4,999</strong>
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
                </div>
              </li>
            ))}
          </ul>

          <div className="crh-trust">
            <div className="crh-trust-count">
              <strong>1000+</strong>
              <span>Companies Registered</span>
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
                <span>Google Happy Reviews</span>
              </div>
            </div>

            <div className="crh-trust-divider" />

            <div className="crh-trust-count">
              <strong>7+</strong>
              <span>Years of Compliance Expertise</span>
            </div>
          </div>
        </div>

        {/* ---------------- RIGHT (FORM) ---------------- */}
        <div className="crh-form-col" id="cro-consult-form">
          <ConsultationForm
            source="company-registration-odisha"
            subtitle="Talk to our company registration expert in Odisha"
          />
        </div>
      </div>
    </section>
  );
};

export default CroBreadcrum;
