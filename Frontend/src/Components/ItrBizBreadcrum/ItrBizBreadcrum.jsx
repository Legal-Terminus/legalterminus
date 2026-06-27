import React from "react";
import "./ItrBizBreadcrum.css";
import "../OPCBreadcrum/OPCBreadcrum.css";
import ConsultationForm from '../ConsultationForm/ConsultationForm';

const ItrBizBreadcrum = () => {
  return (
    <section className="lt-public-hero">
      <div className="lt-public-container">

        <div className="lt-public-content">

          <span className="lt-public-tag">
            Business Income Tax Return Filing
          </span>

          <h1 className="lt-public-title">
            ITR Filing for Business
            <span className="lt-title-india"> in India</span>
            <br />
            <span className="lt-title-tagline">Simple, Affordable, Accurate</span>
          </h1>

          <p className="lt-public-description">
            Business Income Tax Return (ITR) filing is a mandatory compliance under the Income Tax Act, 1961 for Sole Proprietorships and Partnership Firms. Filing the correct ITR ensures legal compliance, supports loan and tender applications, and helps maintain accurate financial records. Depending on the nature of the business, returns are generally filed using ITR-3, ITR-4, or ITR-5.
            <br /><br />
            At Legal Terminus, we provide affordable and professional Business ITR Filing services, including tax computation, preparation of financial statements, bookkeeping support, and accurate return filing through the Income Tax portal. Our experts ensure timely, compliant, and hassle-free filing tailored to your business needs.
          </p>

          <div className="lt-public-features">
            <div className="lt-feature-item">Easy Loan &amp; OD Approval</div>
            <div className="lt-feature-item">Faster Tax Refund Processing</div>
            <div className="lt-feature-item">Builds Financial Credibility</div>
            <div className="lt-feature-item">Avoids Income Tax Notices</div>
          </div>

          <div className="lt-public-highlights">
            <div>
              <h3>4,200+</h3>
              <p>Business ITRs filed (Proprietor + Partnership)</p>
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

        <div id="itrbiz-consult-form">
          <ConsultationForm
            source="itr-business"
            subtitle="Talk to our business ITR filing expert"
          />
        </div>

      </div>
    </section>
  );
};

export default ItrBizBreadcrum;
