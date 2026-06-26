import React from "react";
import "./ItrIndBreadcrum.css";
import "../OPCBreadcrum/OPCBreadcrum.css";
import ConsultationForm from '../ConsultationForm/ConsultationForm';

const ItrIndBreadcrum = () => {
  return (
    <section className="lt-public-hero">
      <div className="lt-public-container">

        <div className="lt-public-content">

          <span className="lt-public-tag">
            Individual Income Tax Return Filing
          </span>

          <h1 className="lt-public-title">
            ITR Filing for Individuals
            <span className="lt-title-india"> in India</span>
            <br />
            <span className="lt-title-tagline">Simple, Affordable, Professional</span>
          </h1>

          <p className="lt-public-description">
            Every individual earning income in India—including salaried employees, freelancers, professionals, pensioners, NRIs, and capital gains earners—may be required to file an Income Tax Return (ITR) under Section 139 of the Income Tax Act, 1961. For FY 2025–26 (AY 2026–27), the due date for most non-audit taxpayers is 31 July 2026. The New Tax Regime also offers rebate benefits under Section 87A, subject to applicable conditions.
            <br /><br />
            At Legal Terminus, we offer affordable and professionally managed ITR filing solutions based on your income type and complexity — from basic salaried returns to capital gains, foreign income, NRI taxation, and DTAA-related filings. Plans start from ₹799 + GST. Returns are filed through the official Income Tax portal at{" "}
            <a
              href="https://www.incometax.gov.in"
              target="_blank"
              rel="noopener noreferrer"
            >
              Income Tax Portal
            </a>.
          </p>

          <div className="lt-public-features">
            <div className="lt-feature-item">Pocket-Friendly</div>
            <div className="lt-feature-item">100% Online Process</div>
            <div className="lt-feature-item">Helps in Loan Approval</div>
            <div className="lt-feature-item">Faster Income Tax Refunds</div>
          </div>

          <div className="lt-public-highlights">
            <div>
              <h3>12,000+</h3>
              <p>Individual ITRs filed (ITR-1 + ITR-2)</p>
            </div>
            <div>
              <h3>100%</h3>
              <p>On-time filing promise honoured</p>
            </div>
            <div>
              <h3>7+</h3>
              <p>Years of Legal Expertise</p>
            </div>
          </div>

        </div>

        <div id="itrind-consult-form">
          <ConsultationForm
            source="itr-individual"
            subtitle="Talk to our personal ITR filing expert"
          />
        </div>

      </div>
    </section>
  );
};

export default ItrIndBreadcrum;
