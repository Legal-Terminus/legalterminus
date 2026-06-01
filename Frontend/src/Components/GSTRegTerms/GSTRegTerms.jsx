import React from "react";
import "./GSTRegTerms.css";

const GSTRegTerms = () => {
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
              Document Accuracy Matters: GST registration is subject to verification by the GST department. Approval depends on the accuracy and completeness of documents provided by you.
            </li>
            <li className="pvtltd-tc-item">
              Government Fee: As per Rule 8 of the CGST Rules, 2017, the government does not charge any fee for GST registration. Our fee covers professional advisory, document drafting and portal filing only.
            </li>
            <li className="pvtltd-tc-item">
              Timely Response Required: Delays in document submission or responses to queries may lead to application delays or rejection.
            </li>
            <li className="pvtltd-tc-item">
              Government Approval Timeline: GST registration approval is generally granted within 3 working days if approved under Rule 14A. In other cases, where detailed verification or clarification is required, the approval may take 10–15 working days, depending on the GST department.
            </li>
            <li className="pvtltd-tc-item">
              GST on Our Fee: All quoted prices are exclusive of GST @ 18%, which will be added at checkout and is fully eligible for input tax credit once your GSTIN is active.
            </li>
            <li className="pvtltd-tc-item">
              Scope per GSTIN: Each plan covers registration for one (1) GSTIN in one (1) state. Additional state registrations are charged at 100% of the chosen plan price.
            </li>
            <li className="pvtltd-tc-item">
              Aadhaar e-KYC: Mandatory under Rule 8(4A) of the CGST Rules. If e-KYC fails or is declined, physical verification is triggered by the Tax officer and timelines extend to up to 30 days. We will notify you within 24 hours of any rejection.
            </li>
            <li className="pvtltd-tc-item">
              Bank Account Details: As per the GSTN advisory dated 20 November 2025, valid bank account details must be furnished within 30 days of registration or before filing GSTR-1/IFF — whichever is earlier — to avoid suspension. Submission is the applicant's responsibility; we provide a one-touch reminder.
            </li>
            <li className="pvtltd-tc-item">
              Refund Policy: Full refund (less ₹499 documentation handling) is available if the application is not filed within 7 working days from receipt of complete documents. No refund is payable once ARN is generated, as the work is substantively complete.
            </li>
            <li className="pvtltd-tc-item">
              Rejection by Department: If the application is rejected for documentation defects on our end, we will re-file once free of cost. Re-filing for substantive deficiencies (e.g., disputed principal place of business, prior non-disclosure) attracts a re-work fee of ₹1499.
            </li>
            <li className="pvtltd-tc-item">
              Out-of-Scope Items: Casual Taxable Person (CTP) deposits, Non-Resident Taxable Person (NRTP) advance tax, DSC procurement charges, and notarisation / apostille charges are not included and will be billed separately at actuals.
            </li>
            <li className="pvtltd-tc-item">
              Compliance Post-Registration: Plans do not include monthly GSTR-1/3B filing, CMP-08 (Composition), GSTR-9 annual return, or e-invoicing setup beyond the first month (Supreme) or session (Enriched). These are billed under our GST Compliance retainer.
            </li>
          </ol>

        </div>
      </div>
    </section>
  );
};

export default GSTRegTerms;
