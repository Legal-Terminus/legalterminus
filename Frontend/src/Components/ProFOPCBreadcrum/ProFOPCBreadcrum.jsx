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
            Ready to scale your business? A Proprietorship to Private Limited Conversion helps you move from a personally-owned business structure to a legally separate company with limited liability, better credibility, and stronger growth potential.
          </p>

          <p className="ProPrietorship-opc-Bc-public-description">
            We handle the complete conversion process under Sections 366–374 of the Companies Act, 2013 by filing Form URC-1, publishing the mandatory URC-2 newspaper notice, drafting the company’s MOA &amp; AOA, obtaining required consents, and filing SPICe+ Part B on the official MCA portal.
          </p>

          <p className="ProPrietorship-opc-Bc-public-description">
            Your new Private Limited Company comes with a separate legal identity, easier fundraising opportunities, eligibility for Startup India benefits, ESOP structuring, and better acceptance from banks, investors, and large clients.
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
          source="proprietorship-to-opc"
          subtitle="Talk to our expert"
        />

      </div>
    </section>
  );
};

export default Breadcrum;
