import React from "react";
import "./PtopvtBreadcrum.css";
import "../OPCBreadcrum/OPCBreadcrum.css";
import ConsultationForm from '../ConsultationForm/ConsultationForm';

const PtopvtBreadcrum = () => {
  return (
    <section className="lt-public-hero">
      <div className="lt-public-container">

        <div className="lt-public-content">

          <span className="lt-public-tag">
            Proprietorship to Pvt Ltd Conversion
          </span>

          <h1 className="lt-public-title">
            Convert Proprietorship to Pvt Ltd
            <span className="lt-title-india"> in India</span>
            <br />
            <span className="lt-title-tagline">Build a company investors trust</span>
          </h1>

          <p className="lt-public-description">
            Convert your Proprietorship into a Private Limited Company and unlock greater credibility, limited liability protection, and a separate legal identity. This transition helps your business scale more effectively while improving acceptance among banks, investors, and corporate clients.
            <br /><br />
            We manage the entire conversion process under the Companies Act, 2013, including URC-1 filing, URC-2 newspaper publication, MOA &amp; AOA drafting, required approvals, and SPICe+ Part B filing on the MCA portal. Your new company will be better positioned for fundraising, ESOP implementation, and government initiatives such as Startup India benefits.
          </p>

          <div className="lt-public-features">
            <div className="lt-feature-item">URC-1 + URC-2 Filed</div>
            <div className="lt-feature-item">Section 366 Compliant</div>
            <div className="lt-feature-item">2-Director Ready</div>
            <div className="lt-feature-item">Investor-Grade</div>
          </div>

          <div className="lt-public-highlights">
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

        <div id="ptopvt-consult-form">
          <ConsultationForm
            source="proprietorship-to-private"
            subtitle="Talk to our Pvt Ltd conversion expert"
          />
        </div>

      </div>
    </section>
  );
};

export default PtopvtBreadcrum;
