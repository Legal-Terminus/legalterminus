import React from "react";
import "./Section8Breadcrum.css";

import ConsultationForm from '../ConsultationForm/ConsultationForm';
const Breadcrum = () => {
  return (
    <section className="lt-public-hero">
      <div className="lt-public-container">

        {/* LEFT CONTENT */}
        <div className="lt-public-content">

          <span className="lt-public-tag">
            Section-8 Company Registration
          </span>

          <h1 className="lt-public-title">
            Section-8 Company Registration
            <span className="lt-title-india"> in India</span>
            <br />
            <span className="lt-public-subtitle">NGO Registration Made Professional</span>
          </h1>

          <p className="lt-public-description">
            A Section 8 Company is the ideal legal structure for NGOs, non-profits, foundations, charitable organizations, and social impact ventures in India. Registered under the Companies Act, 2013, it offers a professional and credible structure with better governance and legal recognition compared to Trusts and Societies. Section 8 Companies are eligible to apply for important registrations and tax benefits such as 12A, 80G, CSR-1, and FCRA, subject to eligibility and approval from the respective authorities.
            We provide complete assistance for Section 8 Company registration, including name approval, license application, incorporation filing, and post-registration compliance support.
          </p>

          <div className="lt-public-features">
            <div className="lt-feature-item">Ideal for NGOs &amp; Non-Profits</div>
            <div className="lt-feature-item">12A, 80G &amp; CSR Eligible</div>
            <div className="lt-feature-item">Fully Online Process</div>
            <div className="lt-feature-item">Higher Legal Credibility</div>
          </div>

          <div className="lt-public-highlights">
            <div>
              <h3>500+</h3>
              <p>Section 8 companies set up</p>
            </div>
            <div>
              <h3>INC-12 + SPICe+</h3>
              <p>central-govt licence handled</p>
            </div>
            <div>
              <h3>7+</h3>
              <p>Years of Legal Expertise</p>
            </div>
          </div>

        </div>

        {/* RIGHT FORM */}
        <ConsultationForm
          source="section8-company"
          subtitle="Talk to our expert"
        />

      </div>
    </section>
  );
};

export default Breadcrum;
