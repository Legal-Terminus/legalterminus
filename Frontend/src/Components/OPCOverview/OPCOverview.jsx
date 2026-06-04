import React from "react";
import "./OPCOverview.css";
import opcIllustration from "../../assets/whypvt-imp1.svg"; // Replace with your actual image if needed

const OPCOverview = () => {
  return (
    <div className="opc-full-wrapper">

      {/* ===========================
          SECTION 1 — INTRO
      ============================ */}
      <section className="opc-intro-section">
        <div className="opc-intro-container">
          {/* Illustration */}
          <div className="opc-intro-illustration-wrap">
            <img
              src={opcIllustration}
              alt="One Person Company illustration"
              className="opc-intro-illustration"
            />
          </div>

          {/* Text */}
          <div className="opc-intro-content">
            <h2 className="opc-intro-title">
              Why Choose a One Person Company
            </h2>
            <p className="opc-intro-text">
              OPC is the only Indian corporate structure that lets a single person run a fully incorporated company with limited liability and separate legal identity. Before OPC was introduced under the Companies Act, 2013, solo founders had to either run as a sole proprietorship (unlimited liability, no separate entity) or pretend to have a co-founder in a Pvt Ltd. OPC closed that gap — you get all the credibility of a private limited company without dragging in a partner you don't actually have.
              <br /><br />
              After the Companies (Incorporation) Second Amendment Rules 2021, OPCs are even more attractive: the mandatory conversion threshold (₹2 cr turnover / ₹50L paid-up capital) was scrapped, NRIs can now incorporate, and the stay requirement was reduced from 182 days to 120 days. OPC is no longer a stop-gap structure — it's a legitimate scale-up vehicle for solo founders.
            </p>
          </div>
        </div>
      </section>

      {/* ===========================
          SECTION 2 — COMPARISON TABLE
      ============================ */}
      <section className="opc-compare-section">
        <div className="opc-compare-container">
          <h2 className="opc-compare-title">OPC vs Sole Proprietorship vs Pvt Ltd: The Deep Dive</h2>
          <p className="opc-compare-subtitle">
            Most solo founders hesitate between three options. Here's the honest comparison:
          </p>
          <div className="opc-compare-table-wrapper">
            <table className="opc-compare-table">
              <thead>
                <tr>
                  <th>Parameter</th>
                  <th>Sole Prop</th>
                  <th>OPC</th>
                  <th>Pvt Ltd</th>
                </tr>
              </thead>
              <tbody>
                <tr><td>Owners Required</td><td>1</td><td>1 + 1 nominee</td><td>Min 2</td></tr>
                <tr><td>Separate Legal Entity</td><td>No</td><td>Yes</td><td>Yes</td></tr>
                <tr><td>Limited Liability</td><td>No</td><td>Yes</td><td>Yes</td></tr>
                <tr><td>Perpetual Succession</td><td>No</td><td>Yes (via nominee)</td><td>Yes</td></tr>
                <tr><td>Compliance Load</td><td>Minimal</td><td>Moderate</td><td>Heavy</td></tr>
                <tr><td>AGM Required</td><td>N/A</td><td>No (exempt)</td><td>Yes</td></tr>
                <tr><td>Annual Audit</td><td>Optional</td><td>Mandatory</td><td>Mandatory</td></tr>
                <tr><td>Foreign / Public Funding</td><td>No</td><td>No</td><td>Yes</td></tr>
                <tr><td>Setup Cost (Total)</td><td>₹2K – ₹5K</td><td>₹8K – ₹15K</td><td>₹10K – ₹25K</td></tr>
              </tbody>
            </table>
          </div>
        </div>
      </section>
    </div>
  );
};

export default OPCOverview;
