import React from "react";
import "./CocomOverview.css";
import illustration from "../../assets/whypvt-imp1.svg";

const CocomOverview = () => {
  return (
    <div className="opc-full-wrapper">

      <section className="opc-intro-section">
        <div className="opc-intro-container">
          <div className="opc-intro-illustration-wrap">
            <img
              src={illustration}
              alt="Change of Object Clause illustration"
              className="opc-intro-illustration"
            />
          </div>

          <div className="opc-intro-content">
            <h2 className="opc-intro-title">
              Why Change Your Company's Object Clause
            </h2>
            <p className="opc-intro-text">
              The object clause sits in the Memorandum of Association and defines exactly what business a company is allowed to carry on. It is the legal boundary of the company's activities — anything done outside it is considered "ultra vires" (beyond its powers) and can be challenged. So when your company wants to add a new line of business, pivot into a different sector, or modernise outdated objects, the object clause must be amended first under Section 13 of the Companies Act, 2013.
              <br /><br />
              The amendment is done through a special resolution passed by at least 75% of the members at a general meeting, and then filed with the Registrar in Form MGT-14 within 30 days. Once the ROC registers the change, the updated MOA legally empowers the company to carry on the new activities. Doing this properly — before you actually start the new business — protects your contracts, satisfies banks and investors during due diligence, and keeps the company on the right side of corporate law as it grows.
            </p>
          </div>
        </div>
      </section>

      <section className="opc-compare-section">
        <div className="opc-compare-container">
          <h2 className="opc-compare-title">Amended Objects vs Acting Beyond the MOA: The Honest Comparison</h2>
          <p className="opc-compare-subtitle">
            What changes when you formally amend the object clause versus running a new activity without it:
          </p>
          <div className="opc-compare-table-wrapper">
            <table className="opc-compare-table">
              <thead>
                <tr>
                  <th>Parameter</th>
                  <th>Object Clause Amended</th>
                  <th>Acting Outside the MOA</th>
                </tr>
              </thead>
              <tbody>
                <tr><td>Legal Authority</td><td>New activity fully authorised</td><td>Ultra vires — beyond powers</td></tr>
                <tr><td>Contract Validity</td><td>Enforceable in the new line</td><td>Open to challenge</td></tr>
                <tr><td>Bank / Investor Due Diligence</td><td>Clean MOA match</td><td>Red flag raised</td></tr>
                <tr><td>Tender / Licence Eligibility</td><td>Objects support the activity</td><td>Application rejected</td></tr>
                <tr><td>Compliance Risk</td><td>Low</td><td>Scrutiny &amp; penalty exposure</td></tr>
                <tr><td>GST / Sector Licences</td><td>Aligned to the new objects</td><td>Mismatch &amp; queries</td></tr>
                <tr><td>Company Continuity</td><td>CIN &amp; history unchanged</td><td>Same, but legally exposed</td></tr>
              </tbody>
            </table>
          </div>
        </div>
      </section>

    </div>
  );
};

export default CocomOverview;
