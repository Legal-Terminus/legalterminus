import React from "react";
import "./ISOtermandcondition.css";

const TermsConditions = () => {
  return (
    <section className="isotc-section">
      <div className="isotc-container">
        <div className="isotc-card">
        {/* Heading */}
        <h2 className="isotc-title">TERMS &amp; CONDITIONS</h2>

        {/* Sub heading */}
        <p className="isotc-subtitle">
          By subscribing to any of the above plans, you agree to the following terms and conditions. Please read them carefully before proceeding.
        </p>

        {/* List */}
        <ol className="isotc-list">
          <li className="isotc-item">
            Surveillance charges of 50% of the certification fee shall be applicable every year on IAF-accredited certificates.
          </li>
          <li className="isotc-item">
            ISO certification fees vary by standard (ISO 9001, 14001, 27001, etc.) and by certifying body. The fee communicated at the time of engagement is specific to the standard and scope agreed upon.
          </li>
          <li className="isotc-item">
            The ISO certification scope must accurately describe your business activities. Any change in scope after certification will require a re-audit and may attract additional charges.
          </li>
          <li className="isotc-item">
            18% GST is applicable on all professional/consultancy fees charged by Legal Terminus.
          </li>
          <li className="isotc-item">
            Legal Terminus Private Limited is a private consultancy firm and is not affiliated with any ISO certifying body. ISO certificates are issued directly by the relevant certifying body.
          </li>
          <li className="isotc-item">
            In case the above plans do not qualify your requirements, kindly contact our executive — we will be happy to customise a plan for you.
          </li>
        </ol>
        </div>
      </div>
    </section>
  );
};

export default TermsConditions;
