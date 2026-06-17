import React from "react";
import "../ProFOPCBreadcrum/ProFOPCBreadcrum.css";

import ConsultationForm from '../ConsultationForm/ConsultationForm';

const Breadcrum = () => {
  return (
    <section className="ProPrietorship-opc-Bc-public-hero">
      <div className="ProPrietorship-opc-Bc-public-container">

        {/* LEFT CONTENT */}
        <div className="ProPrietorship-opc-Bc-public-content">

          <span className="ProPrietorship-opc-Bc-public-tag">
            Public Ltd to Private Ltd Conversion
          </span>

          <h1 className="ProPrietorship-opc-Bc-public-title">
            Convert Public Limited to Private Limited in India
            <br />
            <span className="ProPrietorship-opc-Bc-title-tagline">Cut compliance, keep control</span>
          </h1>

          <p className="ProPrietorship-opc-Bc-public-description">
            Convert your Public Limited Company into a Private Limited Company to reduce your regulatory burden, keep ownership closely held, and gain the flexibility of a privately managed business. This transition lets you restrict share transfers, limit public exposure, and run the company with fewer statutory formalities.
          </p>

          <p className="ProPrietorship-opc-Bc-public-description">
            We manage the entire conversion process under the Companies Act, 2013, including the special resolution, alteration of MOA &amp; AOA, MGT-14 filing, newspaper advertisement in Form INC-25A, notices to creditors and regulators, and the application to the Regional Director in Form RD-1 — right up to filing INC-28 once the order is approved.
          </p>

          <div className="ProPrietorship-opc-Bc-public-features">
            <div className="ProPrietorship-opc-Bc-feature-item">Section 14 Compliant</div>
            <div className="ProPrietorship-opc-Bc-feature-item">RD-1 + MGT-14 Filed</div>
            <div className="ProPrietorship-opc-Bc-feature-item">RD Approval Managed</div>
            <div className="ProPrietorship-opc-Bc-feature-item">Reduced Compliance</div>
          </div>

          <div className="ProPrietorship-opc-Bc-public-highlights">
            <div>
              <h3>1,000+</h3>
              <p>Conversions Made</p>
            </div>
            <div>
              <h3>End-to-End Transition</h3>
              <p>Resolution + RD + ROC Filings</p>
            </div>
            <div>
              <h3>7+</h3>
              <p>Years of Compliance Expertise</p>
            </div>
          </div>

        </div>

        {/* RIGHT FORM */}
        <ConsultationForm
          source="public-to-private"
          subtitle="Talk to our conversion expert"
        />

      </div>
    </section>
  );
};

export default Breadcrum;
