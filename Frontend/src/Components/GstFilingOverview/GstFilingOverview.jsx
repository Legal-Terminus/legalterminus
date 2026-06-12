import React from "react";
import "./GstFilingOverview.css";
import illustration from "../../assets/whypvt-imp1.svg";

const GstFilingOverview = () => {
  return (
    <div className="opc-full-wrapper">

      <section className="opc-intro-section">
        <div className="opc-intro-container">
          <div className="opc-intro-illustration-wrap">
            <img
              src={illustration}
              alt="GST Return Filing illustration"
              className="opc-intro-illustration"
            />
          </div>

          <div className="opc-intro-content">
            <h2 className="opc-intro-title">
              Why Choose GST Return Filing
            </h2>
            <p className="opc-intro-text">
              GST Return Filing is a mandatory compliance requirement for every GST-registered business in India, even if there are no sales or purchases during the return period. These returns include details of sales, purchases, input tax credit (ITC), and tax payments. Timely filing helps avoid late fees, interest, GST notices, ITC blockage, and registration-related issues, while ensuring your customers receive eligible tax credits.
              <br /><br />
              With GST returns now closely linked to invoice data, purchase records, supplier filings, and stricter timelines for ITC claims and return corrections, accurate reporting and reconciliation are more important than ever. At Legal Terminus, we help businesses maintain smooth GST compliance through accurate return filing, regular reconciliation, and timely submissions.
            </p>
          </div>
        </div>
      </section>

    </div>
  );
};

export default GstFilingOverview;
