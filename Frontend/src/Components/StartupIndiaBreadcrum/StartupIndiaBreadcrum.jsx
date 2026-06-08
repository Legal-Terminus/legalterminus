import React from "react";
import "../Breadcrum/Breadcrum.css";
import ConsultationForm from "../ConsultationForm/ConsultationForm";

const StartupIndiaBreadcrum = () => {
  return (
    <section className="lt-public-hero">
      <div className="lt-public-container">

        <div className="lt-public-content">

          <span className="lt-public-tag">
            Startup India Registration — DPIIT Recognition
          </span>

          <h1 className="lt-public-title">
            Startup India Registration
            <br />
            <span className="lt-public-subtitle">Get Startup India Recognition</span>
          </h1>

          <p className="lt-public-description">
            Startup India (DPIIT) Recognition is an official recognition issued by the Department for Promotion of Industry and Internal Trade (DPIIT), Government of India, for eligible startups working towards innovation, scalability, and business growth. Recognized startups may become eligible for various government benefits such as tax exemption under Section 80-IAC (subject to approval), rebate on trademark and patent filing fees, access to Startup India schemes and funding support, and easier participation in government tenders and the GeM portal. We provide complete assistance for Startup India registration, including eligibility review, document preparation, startup profile drafting, and DPIIT application filing through the NSWS portal.
          </p>

          <div className="lt-public-features">
            <div className="lt-feature-item">3-Day Recognition</div>
            <div className="lt-feature-item">80-IAC Drafted</div>
            <div className="lt-feature-item">Angel Tax Abolished (FY 2025-26)</div>
            <div className="lt-feature-item">Professional Startup Guidance</div>
          </div>

          <div className="lt-public-highlights">
            <div>
              <h3>1,250+</h3>
              <p>DPIIT recognitions secured</p>
            </div>
            <div>
              <h3>4+</h3>
              <p>Sectors Covered</p>
            </div>
            <div>
              <h3>7+</h3>
              <p>Years of Legal Expertise</p>
            </div>
          </div>

        </div>

        <div id="startup-india-consult-form">
          <ConsultationForm
            source="startup-india"
            subtitle="Talk to our Startup India Registration expert"
          />
        </div>

      </div>
    </section>
  );
};

export default StartupIndiaBreadcrum;
