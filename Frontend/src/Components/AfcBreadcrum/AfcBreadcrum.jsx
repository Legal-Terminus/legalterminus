import React from "react";
import "./AfcBreadcrum.css";
import "../OPCBreadcrum/OPCBreadcrum.css";
import ConsultationForm from '../ConsultationForm/ConsultationForm';

const AfcBreadcrum = () => {
  return (
    <section className="lt-public-hero">
      <div className="lt-public-container">

        <div className="lt-public-content">

          <span className="lt-public-tag">
            Company Annual Filing
          </span>

          <h1 className="lt-public-title">
            Annual Filing for Company
            <span className="lt-title-india"> in India</span>
            <br />
            <span className="lt-title-tagline">Timely &amp; 100% Online</span>
          </h1>

          <p className="lt-public-description">
            Every Private Limited Company, OPC, and Small Company in India is required to complete annual compliance filings under the Companies Act, 2013 and Income Tax Act. These compliances generally include ROC filings such as AOC-4, MGT-7 / MGT-7A, ADT-1, DPT-3, DIR-3 KYC, MSME-1 (where applicable), along with Income Tax Return filing and statutory audit compliances. Unlike LLPs, statutory audit is mandatory for every company, irrespective of turnover or business activity. Delayed filing can lead to heavy additional fees, penalties, and compliance issues with MCA and Income Tax authorities.
            <br /><br />
            At Legal Terminus, we manage the complete annual compliance cycle through one coordinated team with timely filing support, regular reminders, and proactive status updates to help your company stay compliant throughout the year. Plans start from ₹6,999/year + GST. Filings are completed through the official MCA and Income Tax portals.
          </p>

          <div className="lt-public-features">
            <div className="lt-feature-item">Late-Fee Zero</div>
            <div className="lt-feature-item">8+ Forms Filed</div>
            <div className="lt-feature-item">Audit Coordinated</div>
            <div className="lt-feature-item">Monthly Updates</div>
          </div>

          <div className="lt-public-highlights">
            <div>
              <h3>3,800+</h3>
              <p>Company annual cycles filed</p>
            </div>
            <div>
              <h3>100%</h3>
              <p>Late-fee zero promise honoured</p>
            </div>
            <div>
              <h3>7+</h3>
              <p>Years of Legal Expertise</p>
            </div>
          </div>

        </div>

        <div id="afc-consult-form">
          <ConsultationForm
            source="annual-filing-company"
            subtitle="Talk to our company compliance expert"
          />
        </div>

      </div>
    </section>
  );
};

export default AfcBreadcrum;
