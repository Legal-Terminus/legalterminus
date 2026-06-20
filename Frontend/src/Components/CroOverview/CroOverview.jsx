import React from "react";
import "../OPCOverview/OPCOverview.css";
import illustration from "../../assets/whypvt-imp1.svg";

const CroOverview = () => {
  return (
    <div className="opc-full-wrapper">

      <section className="opc-intro-section">
        <div className="opc-intro-container">
          <div className="opc-intro-illustration-wrap">
            <img
              src={illustration}
              alt="Company Registration in Odisha illustration"
              className="opc-intro-illustration"
            />
          </div>

          <div className="opc-intro-content">
            <h2 className="opc-intro-title">
              What is Company Registration and Why It Matters
            </h2>
            <p className="opc-intro-text">
              Company registration is the first legal step in starting a business in India. Under the
              Companies Act, 2013 — administered by the Ministry of Corporate Affairs (MCA) — registering
              your business gives it a separate legal identity, with its own rights, protections, and the
              ability to own property and sign contracts in its own name. Choosing the correct company
              type and registering it properly also unlocks access to government benefits and makes the
              business far more credible to investors, clients, and banks.
              <br /><br />
              The Companies Act, 2013 sets the framework for how companies are formed and governed in
              India, with a focus on compliance, transparency, and accountability. Listed companies and
              certain financial institutions carry additional oversight from SEBI (capital markets) and
              the RBI. Legal Terminus, based in Bhubaneswar, helps entrepreneurs across Odisha pick the
              right structure and complete a hassle-free incorporation within a reasonable timeframe at
              competitive, transparent fees — backed by a free telephonic consultation.
            </p>
          </div>
        </div>
      </section>

      <section className="opc-compare-section">
        <div className="opc-compare-container">
          <h2 className="opc-compare-title">Which Company Type is Right for You?</h2>
          <p className="opc-compare-subtitle">
            A quick comparison of the four most common structures we register in Odisha, so you can pick
            the one that fits your ownership, liability, and compliance needs:
          </p>
          <div className="opc-compare-table-wrapper">
            <table className="opc-compare-table">
              <thead>
                <tr>
                  <th>Parameter</th>
                  <th>Private Limited</th>
                  <th>One Person Company</th>
                  <th>LLP</th>
                  <th>Public Limited</th>
                </tr>
              </thead>
              <tbody>
                <tr><td>Members</td><td>2 – 200</td><td>1 (sole owner)</td><td>2 – unlimited</td><td>7 – unlimited</td></tr>
                <tr><td>Directors / Partners</td><td>2 – 15</td><td>1 director</td><td>2 designated partners</td><td>3 – 15 directors</td></tr>
                <tr><td>Liability</td><td>Limited</td><td>Limited to shares</td><td>Limited</td><td>Limited</td></tr>
                <tr><td>Compliance Load</td><td>Moderate</td><td>Low–Moderate</td><td>Low</td><td>Heaviest</td></tr>
                <tr><td>Raise Public Capital</td><td>No</td><td>No</td><td>No</td><td>Yes (shares tradable)</td></tr>
                <tr><td>Best For</td><td>Growing startups</td><td>Solo founders</td><td>Professional firms</td><td>Large, transparent companies</td></tr>
              </tbody>
            </table>
          </div>
        </div>
      </section>

    </div>
  );
};

export default CroOverview;
