import React from "react";
import "./TmrnwOverview.css";
import illustration from "../../assets/whypvt-imp1.svg";

const renewalWindows = [
  { window: "1 year before expiry to expiry date", possible: "ON-TIME renewal (Section 25(3) + Rule 57)", fee: "₹9,000" },
  { window: "Within 6 months post-expiry", possible: "LATE RENEWAL with surcharge (Section 25(4) proviso)", fee: "₹13,500 (₹9,000 + ₹4,500 surcharge)" },
  { window: "6 to 12 months post-expiry", possible: "RESTORATION via Form TM-R + TM-18 (Section 25(5) + Rule 60)", fee: "₹18,000 (combined)" },
  { window: "Beyond 12 months post-expiry", possible: "Mark REMOVED permanently; fresh registration only", fee: "TM-A new application + lost seniority" },
  { window: "Validity Period (each renewal)", possible: "10 YEARS from previous expiry", fee: "Indefinitely renewable" },
];

const TmrnwOverview = () => {
  return (
    <div className="opc-full-wrapper">

      <section className="opc-intro-section">
        <div className="opc-intro-container">
          <div className="opc-intro-illustration-wrap">
            <img
              src={illustration}
              alt="Trademark Renewal illustration"
              className="opc-intro-illustration"
            />
          </div>

          <div className="opc-intro-content">
            <h2 className="opc-intro-title">
              Why Trademark Renewal Matters
            </h2>
            <p className="opc-intro-text">
              A registered trademark in India is valid for 10 years and must be renewed through Form TM-R on the official IP India portal to maintain its legal protection. Timely renewal helps preserve exclusive ownership rights, continued use of the ® symbol, protection against infringement, and overall brand value and credibility.
              <br /><br />
              Missing the renewal deadline can lead to additional fees, restoration procedures, or even removal of the trademark from the Register, resulting in loss of brand protection. To help businesses avoid such risks, Legal Terminus follows a structured renewal tracking and reminder system to ensure trademarks remain protected without interruption.
            </p>
          </div>
        </div>
      </section>

      <section className="opc-compare-section">
        <div className="opc-compare-container">
          <h2 className="opc-compare-title">Renewal Windows + Fees Summary (Uniform for All Applicants)</h2>
          <p className="opc-compare-subtitle">
            When you can renew, what's possible in each window, and the uniform government fee per class:
          </p>
          <div className="opc-compare-table-wrapper">
            <table className="opc-compare-table">
              <thead>
                <tr>
                  <th>Window</th>
                  <th>What's Possible</th>
                  <th>Govt Fee per Class (E-Filing) — UNIFORM</th>
                </tr>
              </thead>
              <tbody>
                {renewalWindows.map((row, i) => (
                  <tr key={i}>
                    <td>{row.window}</td>
                    <td>{row.possible}</td>
                    <td>{row.fee}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>

    </div>
  );
};

export default TmrnwOverview;
