import React from "react";
import "../PvtltdTermsCondition/PvtltdTermsCondition.css";

const StartupIndiaTnC = () => {
  return (
    <section className="pvtltd-tc-section">
      <div className="pvtltd-tc-container">
        <div className="pvtltd-tc-card">

          <h2 className="pvtltd-tc-title">TERMS &amp; CONDITIONS</h2>

          <p className="pvtltd-tc-subtitle">
            By subscribing to any of the above plans, you agree to the following terms and conditions. Please read them carefully before proceeding.
          </p>

          <ol className="pvtltd-tc-list">
            <li className="pvtltd-tc-item">
              <strong>Government Fee:</strong> DPIIT Recognition application fee is NIL - filed online at nsws.gov.in (National Single Window System). Our fee covers professional services - eligibility advisory, innovation pitch drafting and review, application filing.
            </li>

            <li className="pvtltd-tc-item">
              <strong>GST on Our Fee:</strong> All quoted prices are exclusive of GST @ 18%, charged at checkout.
            </li>

            <li className="pvtltd-tc-item">
              <strong>Eligibility Requirements:</strong> As per the revised DPIIT Notification (2026): (a) Entity must be a Private Limited Company (including OPC), LLP, Registered Partnership Firm, or Cooperative Society. (b) Not older than 10 years from incorporation date (20 years for Deep Tech startups). (c) Annual turnover not exceeding Rs.200 crores in any previous FY (Rs.300 crores for Deep Tech startups). (d) Working on innovation / development / improvement of products / processes / services OR a scalable business model with high potential for employment / wealth creation. (e) Not formed by splitting up / reconstructing an existing entity. Note: Section 56(2)(viib) angel tax has been abolished from FY 2025-26 - no separate exemption filing needed for new fundraises.
            </li>

            <li className="pvtltd-tc-item">
              <strong>Section 80-IAC Tax Exemption:</strong> Startup India (DPIIT) Recognition and Section 80-IAC tax exemption are separate processes. Recognition under DPIIT does not automatically grant tax exemption benefits. Eligible startups may separately apply for Section 80-IAC approval subject to government eligibility and approval conditions.
            </li>

            <li className="pvtltd-tc-item">
              <strong>Annual Compliance &amp; Reporting:</strong> Recognized startups may be required to submit declarations, reports, or updates on the Startup India portal from time to time. Annual reporting or compliance filings are not included unless specifically mentioned in the selected plan.
            </li>

            <li className="pvtltd-tc-item">
              <strong>Refund Policy:</strong> A refund of professional fees may be considered only if the application process has not been initiated from our end. Once drafting, review, or filing work has started, professional fees become non-refundable. Government fees, Organizational DSC charges (if applied), and any third-party costs are non-refundable under all circumstances.
            </li>

            <li className="pvtltd-tc-item">
              <strong>DPIIT Discretion:</strong> DPIIT may seek clarifications, additional documentation, or reject applications that don't meet innovation / scalability criteria. We pre-screen for eligibility before filing; one free resubmission is included if DPIIT raises objections from documentation drafted by us.
            </li>

            <li className="pvtltd-tc-item">
              <strong>Out-of-Scope Items:</strong> The following services are not included unless specifically mentioned in the selected plan or quoted separately: Patent registration or prosecution, Trademark objection or hearing response, GeM registration, Startup funding advisory or investor pitch support, Company incorporation services, Legal agreements or policy drafting, and Tax filing or ROC compliance services. Entities not meeting DPIIT eligibility conditions may not qualify for Startup India recognition.
            </li>
          </ol>
        </div>
      </div>
    </section>
  );
};

export default StartupIndiaTnC;
