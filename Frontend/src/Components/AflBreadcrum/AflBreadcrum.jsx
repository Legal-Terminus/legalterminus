import React from "react";
import "./AflBreadcrum.css";
import "../OPCBreadcrum/OPCBreadcrum.css";
import ConsultationForm from '../ConsultationForm/ConsultationForm';

const AflBreadcrum = () => {
  return (
    <section className="lt-public-hero">
      <div className="lt-public-container">

        <div className="lt-public-content">

          <span className="lt-public-tag">
            LLP Annual Filing
          </span>

          <h1 className="lt-public-title">
            Annual Filing for LLP
            <span className="lt-title-india"> in India</span>
            <br />
            <span className="lt-title-tagline">Done Right, On Time</span>
          </h1>

          <p className="lt-public-description">
            Every Limited Liability Partnership (LLP) in India — whether active or inactive — must complete annual compliance filings every financial year. The key compliances include Form LLP-11 (Annual Return), Form LLP-8 (Statement of Account &amp; Solvency), and LLP Income Tax Return (ITR-5). Missing these deadlines can lead to additional late fees, penalties, and compliance issues under the LLP Act and Income Tax laws.
            <br /><br />
            At Legal Terminus, we help LLPs manage annual filing smoothly with timely filing support, regular compliance reminders, and proactive status updates throughout the year.
          </p>

          <div className="lt-public-features">
            <div className="lt-feature-item">Late-Fee Zero</div>
            <div className="lt-feature-item">3 Forms Filed</div>
            <div className="lt-feature-item">Monthly Updates</div>
            <div className="lt-feature-item">Tax Audit Coordinated</div>
          </div>

          <div className="lt-public-highlights">
            <div>
              <h3>1,400+</h3>
              <p>LLP annual cycles filed</p>
            </div>
            <div>
              <h3>6 Years</h3>
              <p>of MCA + IT compliance expertise</p>
            </div>
            <div>
              <h3>7+</h3>
              <p>Years of Legal Expertise</p>
            </div>
          </div>

        </div>

        <div id="afl-consult-form">
          <ConsultationForm
            source="annual-filing-llp"
            subtitle="Talk to our LLP compliance expert"
          />
        </div>

      </div>
    </section>
  );
};

export default AflBreadcrum;
