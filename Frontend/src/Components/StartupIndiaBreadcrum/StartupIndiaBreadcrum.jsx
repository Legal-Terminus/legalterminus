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
            Startup India
            <span className="lt-title-india"> DPIIT Recognition</span>
            <br />
            <span className="lt-public-subtitle">Tax Holiday · Angel Tax · Fast Patents</span>
          </h1>

          <p className="lt-public-description">
            Startup India is the Government of India's flagship initiative under DPIIT (Department for Promotion of Industry and Internal Trade) to recognise innovative startups and unlock a suite of tax benefits, regulatory relaxations, and funding access. A DPIIT-recognised startup gets a 3-year income tax holiday under Section 80-IAC, angel tax exemption under Section 56(2)(viib), self-certification under labour &amp; environment laws, and fast-track patent examination at 80% rebate. In 2026, the entire application process is 100% online via the DPIIT Startup India portal. Eligible entities include Private Limited Companies, LLPs, and Partnership Firms incorporated within the last 10 years with annual turnover under ₹100 crore.
          </p>

          <div className="lt-public-features">
            <div className="lt-feature-item">3-Year Tax Holiday (Section 80-IAC)</div>
            <div className="lt-feature-item">Angel Tax Exemption (Sec 56(2)(viib))</div>
            <div className="lt-feature-item">Patent Filing at 80% Rebate</div>
            <div className="lt-feature-item">Self-Certification Under Labour Laws</div>
          </div>

          <div className="lt-public-highlights">
            <div>
              <h3>500+</h3>
              <p>Startups recognised</p>
            </div>
            <div>
              <h3>100% Online</h3>
              <p>DPIIT Startup India portal</p>
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
