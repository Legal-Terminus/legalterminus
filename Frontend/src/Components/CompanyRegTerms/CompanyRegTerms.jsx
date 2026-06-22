import React from "react";
import "../GSTRegTerms/GSTRegTerms.css";

const TERMS = [
  {
    label: "Stamp Duty",
    text: "The Stamp Duty varies from state to state and shall be charged as per actuals.",
  },
  {
    label: "Authorised Capital",
    text: "The fees mentioned above are valid for Authorised Capital up to Rs. 15 Lakhs, where the government fee is minimum. For above Rs. 15 Lakhs, the government fee shall increase accordingly.",
  },
  {
    label: "Name Application",
    text: "The above fee includes Name application for up to 4 choice names and in case all the 4 names are rejected by the department, an additional fee shall be charged.",
  },
  {
    label: "Audit Fees",
    text: "The Audit Fees shall not be a part of our professional fees and shall be payable directly to the Auditor.",
  },
  {
    label: "Custom Plans",
    text: "In case the above plan does not qualify your requirements, kindly contact our executive. We shall be happy to customize a plan for you.",
  },
  {
    label: "GST on Our Fee",
    text: "18% GST applicable on professional fee.",
  },
  {
    label: "Government Fees & DSC",
    text: "Government fees and DSC charges shall be payable as per actuals.",
  },
  {
    label: "Foreign National / NRI",
    text: "In case any of the Directors / Shareholders is a Foreign National or NRI, the incorporation fees shall be determined with mutual discussion.",
  },
];

const CompanyRegTerms = () => {
  return (
    <section className="pvtltd-tc-section">
      <div className="pvtltd-tc-container">
        <div className="pvtltd-tc-card">

          <h2 className="pvtltd-tc-title">TERMS &amp; CONDITIONS</h2>

          <p className="pvtltd-tc-subtitle">
            By subscribing to any of the above plans, you agree to the following terms and
            conditions. Please read them carefully before proceeding.
          </p>

          <ol className="pvtltd-tc-list">
            {TERMS.map((t) => (
              <li className="pvtltd-tc-item" key={t.label}>
                {t.text}
              </li>
            ))}
          </ol>

        </div>
      </div>
    </section>
  );
};

export default CompanyRegTerms;
