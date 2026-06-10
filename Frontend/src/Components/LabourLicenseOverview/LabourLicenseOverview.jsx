import React from "react";
import "./LabourLicenseOverview.css";
import illustration from "../../assets/whypvt-imp1.svg";

const LabourLicenseOverview = () => {
  return (
    <div className="opc-full-wrapper">

      <section className="opc-intro-section">
        <div className="opc-intro-container">
          <div className="opc-intro-illustration-wrap">
            <img
              src={illustration}
              alt="Labour Licence (CLRA) Registration illustration"
              className="opc-intro-illustration"
            />
          </div>

          <div className="opc-intro-content">
            <h2 className="opc-intro-title">
              Why Labour Licence (CLRA) Registration Matters
            </h2>
            <p className="opc-intro-text">
              The Contract Labour (Regulation &amp; Abolition) Act, 1970 governs the engagement of contract labour in India. It applies to every establishment (the principal employer) and every contractor engaging 20 or more contract workmen on any day of the preceding 12 months. The principal employer must obtain a Certificate of Registration (RC) and the contractor must hold a Labour Licence before any contract labour can be lawfully engaged.
              <br /><br />
              Engaging contract labour without registration or a licence is an offence under the Act. Penalties under Sections 23 and 24 include imprisonment up to 3 months and/or a fine up to ₹1,000, with an additional daily fine for continuing contraventions. Beyond the legal risk, an unregistered engagement exposes the principal employer to the contractor's wage, PF, and ESI liabilities — and disqualifies the business from most PSU, government, and large-corporate contracts that demand CLRA compliance as a tender condition.
            </p>
          </div>
        </div>
      </section>

      <section className="opc-compare-section">
        <div className="opc-compare-container">
          <h2 className="opc-compare-title">CLRA Compliant vs Non-Compliant: The Honest Comparison</h2>
          <p className="opc-compare-subtitle">
            What happens when you engage contract labour without a valid CLRA registration / licence:
          </p>
          <div className="opc-compare-table-wrapper">
            <table className="opc-compare-table">
              <thead>
                <tr>
                  <th>Parameter</th>
                  <th>CLRA Compliant</th>
                  <th>No Registration / Licence</th>
                </tr>
              </thead>
              <tbody>
                <tr><td>Legal Status</td><td>Fully compliant under CLRA Act 1970</td><td>Offence under Sections 23 &amp; 24</td></tr>
                <tr><td>Penalty Exposure</td><td>None (if registration is current)</td><td>Up to ₹1,000 fine + up to 3 months jail + daily fine</td></tr>
                <tr><td>PSU / Govt Tenders</td><td>Eligible — CLRA proof accepted</td><td>Disqualified — RC / Licence mandatory</td></tr>
                <tr><td>Liability for Wages / PF / ESI</td><td>Stays with the contractor</td><td>Shifts to the principal employer</td></tr>
                <tr><td>Worksite Inspection</td><td>Cleared with valid RC / Licence</td><td>Stop-work risk &amp; prosecution</td></tr>
                <tr><td>Corporate Vendor Onboarding</td><td>Accepted by large principal employers</td><td>Rejected at compliance screening</td></tr>
                <tr><td>Cost (typical)</td><td>₹5,000 – ₹12,000 govt fee + deposit</td><td>Penalty + back-liabilities + lost contracts</td></tr>
              </tbody>
            </table>
          </div>
        </div>
      </section>

    </div>
  );
};

export default LabourLicenseOverview;
