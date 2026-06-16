import React from "react";
import "./ProFOPCBreadcrum.css";

import ConsultationForm from '../ConsultationForm/ConsultationForm';
const Breadcrum = () => {
  return (
    <section className="ProPrietorship-opc-Bc-public-hero">
      <div className="ProPrietorship-opc-Bc-public-container">

        {/* LEFT CONTENT */}
        <div className="ProPrietorship-opc-Bc-public-content">

          <span className="ProPrietorship-opc-Bc-public-tag">
            Proprietorship to Pvt Ltd Conversion
          </span>

          <h1 className="ProPrietorship-opc-Bc-public-title">
            Convert Proprietorship to Pvt Ltd in India
            <br />
            <span className="ProPrietorship-opc-Bc-title-tagline">Build a company investors trust</span>
          </h1>

          <p className="ProPrietorship-opc-Bc-public-description">
            Convert your Proprietorship into a Private Limited Company and unlock greater credibility, limited liability protection, and a separate legal identity. This transition helps your business scale more effectively while improving acceptance among banks, investors, and corporate clients.
          </p>

          <p className="ProPrietorship-opc-Bc-public-description">
            We manage the entire conversion process under the Companies Act, 2013, including URC-1 filing, URC-2 newspaper publication, MOA &amp; AOA drafting, required approvals, and SPICe+ Part B filing on the MCA portal. Your new company will be better positioned for fundraising, ESOP implementation, and government initiatives such as Startup India benefits.
          </p>

          <div className="ProPrietorship-opc-Bc-public-features">
            <div className="ProPrietorship-opc-Bc-feature-item">URC-1 + URC-2 Filed</div>
            <div className="ProPrietorship-opc-Bc-feature-item">Section 366 Compliant</div>
            <div className="ProPrietorship-opc-Bc-feature-item">2-Director Ready</div>
            <div className="ProPrietorship-opc-Bc-feature-item">Investor-Grade</div>
          </div>

          <div className="ProPrietorship-opc-Bc-public-highlights">
            <div>
              <h3>1,000+</h3>
              <p>Conversion Made</p>
            </div>
            <div>
              <h3>End-to-End Transition</h3>
              <p>URC-1 + GST + Bank + Licenses</p>
            </div>
            <div>
              <h3>7+</h3>
              <p>Years of Compliance Expertise</p>
            </div>
          </div>

        </div>

        {/* RIGHT FORM */}
        <ConsultationForm
          source="proprietorship-to-private"
          subtitle="Talk to our expert"
        />

      </div>
    </section>
  );
};

export default Breadcrum;
