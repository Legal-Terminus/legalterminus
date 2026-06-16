import React from "react";
import "./PartnershiptoPrivateBreadcrumb.css";

import ConsultationForm from '../ConsultationForm/ConsultationForm';
const Breadcrum = () => {
  return (
    <section className="Partnership-to-PLC-public-hero">
      <div className="Partnership-to-PLC-public-container">

        {/* LEFT CONTENT */}
        <div className="Partnership-to-PLC-public-content">

          <span className="Partnership-to-PLC-public-tag">
            Partnership into Pvt Ltd Conversion
          </span>

          <h1 className="Partnership-to-PLC-public-title">
            Convert Partnership Firm to Pvt Ltd in India
            <br />
            <span className="Partnership-to-PLC-title-tagline">Built for growth and corporate scale</span>
          </h1>

          <p className="Partnership-to-PLC-public-description">
            Your partnership firm may have helped you start and grow the business — but scaling further often needs a stronger structure. A Private Limited Company offers limited liability protection, separate legal identity, better credibility, investor readiness, and long-term business continuity.
            <br /><br />
            Under Part I of Chapter XXI (Sections 366–374) of the Companies Act, 2013, an existing partnership firm can be converted into a Private Limited Company through the URC-1 route. We handle the complete process — including Form URC-1 filing, Form URC-2 newspaper publication, partner consents, creditor NOCs, SPICe+ incorporation filing, MOA &amp; AOA drafting, and post-conversion support. We also help map partners' capital into company shareholding and assist with GST, bank account, and license transition for smooth business continuity.
          </p>

          <div className="Partnership-to-PLC-public-features">
            <div className="Partnership-to-PLC-feature-item">URC-1 + URC-2 Filed</div>
            <div className="Partnership-to-PLC-feature-item">Section 366 Compliant</div>
            <div className="Partnership-to-PLC-feature-item">Capital Account Mapped</div>
            <div className="Partnership-to-PLC-feature-item">Investor-Grade</div>
          </div>

          <div className="Partnership-to-PLC-public-highlights">
            <div>
              <h3>100+</h3>
              <p>Partnership conversions + incorporations</p>
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
          source="partnership-to-private"
          subtitle="Talk to our expert"
        />

      </div>
    </section>
  );
};

export default Breadcrum;
