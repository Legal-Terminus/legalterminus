import React from "react";
import "./ItrBizZolvitPremium.css";
import premiumIllustration from "../../assets/lt-companys.svg";

const ItrBizZolvitPremium = () => {
  return (
    <section className="opczp-section">
      <div className="opczp-container">
        <div className="opczp-card">

          <div className="opczp-top-row">

            <div className="opczp-illustration-wrapper">
              <img
                src={premiumIllustration}
                alt="Business ITR Filing by Legal Terminus"
                className="opczp-illustration"
              />
            </div>

            <div className="opczp-content">

              <header className="opczp-header">
                <h2 className="opczp-title">
                  Legal Terminus{" "}
                  <span className="opczp-title-highlight">Priority</span>{" "}
                  <span className="opczp-title-icon">⚖</span>
                </h2>
                <p className="opczp-subtitle">
                  Business ITR sounds like filling a form — but the wrong ITR form, a missed presumptive condition, an unreconciled AIS entry, or a misjudged audit trigger turns into notices, penalties, and lost deductions. Priority is what happens when a Chartered Accountant owns your return from books to filed acknowledgement.
                </p>
              </header>

              <section className="opczp-section-block">
                <h3 className="opczp-label">What you get</h3>
                <ul className="opczp-list opczp-features-list">
                  <li className="opczp-list-item">
                    <span className="opczp-list-icon">⚡</span>
                    Correct ITR form selection — ITR-3, 4, 5, or 6 — based on your entity and income, plus a presumptive-vs-regular tax comparison before you file.
                  </li>
                  <li className="opczp-list-item">
                    <span className="opczp-list-icon">✅</span>
                    Full 26AS / AIS / TIS reconciliation so every TDS credit is claimed and no income flagged by the department is missed.
                  </li>
                  <li className="opczp-list-item">
                    <span className="opczp-list-icon">✅</span>
                    Deduction &amp; expense optimisation — depreciation, remuneration, Chapter VI-A — to compute the lowest lawful tax.
                  </li>
                  <li className="opczp-list-item">
                    <span className="opczp-list-icon">🔄</span>
                    Tax-audit applicability check (Sec 44AB) flagged early, with audit coordinated before the October deadline if required.
                  </li>
                  <li className="opczp-list-item">
                    <span className="opczp-list-icon">📑</span>
                    Filed-return kit: computation sheet, ITR-V acknowledgement, tax-paid challans, and a carry-forward-loss record for next year.
                  </li>
                </ul>
              </section>

            </div>
          </div>

          <div className="opczp-bottom-full">
            <h3 className="opczp-label">Important Notes</h3>
            <div className="opczp-note-box">
              <ul className="opczp-note-list">
                <li className="opczp-note-item">
                  The right ITR form is not optional. A proprietor with books needs ITR-3, a presumptive professional uses ITR-4, firms/LLPs file ITR-5, and companies file ITR-6. Filing the wrong form makes the return defective under Section 139(9). We confirm the form before touching your data.
                </li>
                <li className="opczp-note-item">
                  Presumptive taxation has conditions. Opting out of 44AD after opting in locks you out for five years and can trigger audit. Crossing turnover or cash-receipt limits changes everything. We model your eligibility before you commit.
                </li>
                <li className="opczp-note-item">
                  AIS / TIS mismatches drive notices. The department now pre-populates income from banks, registrars, and GST. Unreconciled high-value transactions are the leading cause of scrutiny. We reconcile every entry before filing.
                </li>
                <li className="opczp-note-item">
                  Deadlines differ by case. Non-audit business returns are due 31st July; audit cases 31st October (with the audit report by 30th September). Missing them brings Section 234F fees, 234A interest, and loss of the right to carry forward business losses.
                </li>
              </ul>
            </div>

            <div className="opczp-cta-row">
              <a
                href="#itrbiz-consult-form"
                className="opczp-cta-btn"
                onClick={(e) => {
                  e.preventDefault();
                  document.getElementById("itrbiz-consult-form")?.scrollIntoView({ behavior: "smooth" });
                }}
              >
                Consult a Tax Expert
              </a>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
};

export default ItrBizZolvitPremium;
