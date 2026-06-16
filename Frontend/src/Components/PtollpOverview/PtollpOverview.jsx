import React from "react";
import "./PtollpOverview.css";
import illustration from "../../assets/whypvt-imp1.svg";

const PtollpOverview = () => {
  return (
    <div className="opc-full-wrapper">

      <section className="opc-intro-section">
        <div className="opc-intro-container">
          <div className="opc-intro-illustration-wrap">
            <img
              src={illustration}
              alt="Partnership to LLP Conversion illustration"
              className="opc-intro-illustration"
            />
          </div>

          <div className="opc-intro-content">
            <h2 className="opc-intro-title">
              Why Convert a Partnership Firm into an LLP
            </h2>
            <p className="opc-intro-text">
              A traditional partnership under the Indian Partnership Act, 1932 has one fundamental weakness — unlimited liability. Every partner is personally liable for the firm's debts, and even for the wrongful acts of the other partners. The firm is also not a separate legal entity, so it cannot own property in its own name and ends whenever the partnership changes. A Limited Liability Partnership (LLP) keeps the flexibility of a partnership but adds the protection of a company: limited liability for each partner, a separate legal identity, and perpetual succession.
              <br /><br />
              The move is a clean statutory conversion under Section 55 and the Second Schedule of the LLP Act, 2008. The same partners carry over, and on conversion all the firm's assets, liabilities, rights, and obligations vest in the LLP automatically by operation of law — without separate transfer deeds or stamp duty on each asset. You file Form FiLLiP with Form 17, a CA-certified statement of assets and liabilities, and creditor consent, and the firm is deemed dissolved once the LLP is registered. The result is the same business and team, now insulated by limited liability and far more credible to banks and clients — with compliance still lighter than a private limited company.
            </p>
          </div>
        </div>
      </section>

      <section className="opc-compare-section">
        <div className="opc-compare-container">
          <h2 className="opc-compare-title">Partnership Firm vs LLP: The Honest Comparison</h2>
          <p className="opc-compare-subtitle">
            What changes for your business when it moves from a partnership firm to an LLP:
          </p>
          <div className="opc-compare-table-wrapper">
            <table className="opc-compare-table">
              <thead>
                <tr>
                  <th>Parameter</th>
                  <th>Limited Liability Partnership</th>
                  <th>Partnership Firm</th>
                </tr>
              </thead>
              <tbody>
                <tr><td>Liability</td><td>Limited to contribution</td><td>Unlimited &amp; joint</td></tr>
                <tr><td>Legal Status</td><td>Separate legal entity (body corporate)</td><td>Not separate from partners</td></tr>
                <tr><td>Liability for Others' Acts</td><td>Partner not liable for another's wrongdoing</td><td>Each partner liable for all</td></tr>
                <tr><td>Continuity</td><td>Perpetual succession</td><td>Changes with partners</td></tr>
                <tr><td>Number of Partners</td><td>No upper limit</td><td>Maximum 50</td></tr>
                <tr><td>Asset Transfer on Conversion</td><td>Vests automatically (Section 55)</td><td>N/A</td></tr>
                <tr><td>Compliance</td><td>Form 8 &amp; Form 11; audit only above threshold</td><td>Minimal</td></tr>
              </tbody>
            </table>
          </div>
        </div>
      </section>

    </div>
  );
};

export default PtollpOverview;
