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
            Convert Proprietorship to OPC  in India
          </span>

          <h1 className="ProPrietorship-opc-Bc-public-title">
            Convert Proprietorship to OPC  in India
            <br />
            <span className="ProPrietorship-opc-Bc-title-tagline">One founder, full corporate shield</span>
          </h1>

          <p className="ProPrietorship-opc-Bc-public-description">
            A Proprietorship is easy to start, but as your business grows, it comes with limitations such as unlimited personal liability, no separate legal identity, and lower business credibility. Proprietorship firm to OPC conversion helps you upgrade your business into a legally recognized corporate structure while keeping complete ownership in the hands of a single founder. A One Person Company (OPC) under the Companies Act, 2013 offers limited liability protection, separate legal identity, better brand credibility, and improved business continuity.
          </p>

          <p className="ProPrietorship-opc-Bc-public-description">
            At Legal Terminus, we handle the complete Proprietorship firm to OPC conversion process — including OPC incorporation through the MCA portal, PAN & TAN application, GST migration support, and assistance with updating bank accounts and business registrations. Supreme Plans also include 12 months of compliance support.
          </p>

          <div className="ProPrietorship-opc-Bc-public-features">
            <div className="ProPrietorship-opc-Bc-feature-item">URC-1 + URC-2 Filed</div>
            <div className="ProPrietorship-opc-Bc-feature-item">Section 366 Compliant</div>
            <div className="ProPrietorship-opc-Bc-feature-item">Limited Liability</div>
            <div className="ProPrietorship-opc-Bc-feature-item">100% Founder-Held</div>
          </div>

          <div className="ProPrietorship-opc-Bc-public-highlights">
            <div>
              <h3>500+</h3>
              <p>OPC + URC-1 conversions</p>
            </div>
            <div>
              <h3>End-to-End Transition</h3>
              <p>GST + Bank + Licenses + IP</p>
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
