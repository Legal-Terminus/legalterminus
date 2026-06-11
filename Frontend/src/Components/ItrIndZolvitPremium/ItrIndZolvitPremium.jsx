import React from "react";
import "./ItrIndZolvitPremium.css";
import premiumIllustration from "../../assets/lt-companys.svg";

const ItrIndZolvitPremium = () => {
  return (
    <section className="opczp-section">
      <div className="opczp-container">
        <div className="opczp-card">

          <div className="opczp-top-row">

            <div className="opczp-illustration-wrapper">
              <img
                src={premiumIllustration}
                alt="Individual ITR Filing by Legal Terminus"
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
                  Personal ITR looks like a 10-minute form — until a wrong regime choice, a missed AIS entry, an unclaimed deduction, or a capital-gains slip costs you a refund or invites a notice. Priority is what happens when a tax expert owns your return from documents to e-verified acknowledgement.
                </p>
              </header>

              <section className="opczp-section-block">
                <h3 className="opczp-label">What you get</h3>
                <ul className="opczp-list opczp-features-list">
                  <li className="opczp-list-item">
                    <span className="opczp-list-icon">⚡</span>
                    Old-vs-new tax regime comparison run on your actual numbers, so you pay the lower tax — not the default.
                  </li>
                  <li className="opczp-list-item">
                    <span className="opczp-list-icon">✅</span>
                    Full Form 16 / 26AS / AIS / TIS reconciliation so every TDS credit is claimed and nothing flagged is missed.
                  </li>
                  <li className="opczp-list-item">
                    <span className="opczp-list-icon">✅</span>
                    Deduction maximisation — 80C, 80D, 80G, HRA, home-loan interest — to compute the lowest lawful tax and biggest refund.
                  </li>
                  <li className="opczp-list-item">
                    <span className="opczp-list-icon">🔄</span>
                    Correct handling of capital gains, multiple Form 16s, and side income so the right ITR form is filed the first time.
                  </li>
                  <li className="opczp-list-item">
                    <span className="opczp-list-icon">📑</span>
                    Filed-return kit: computation sheet, ITR-V acknowledgement, and refund-status tracking until it hits your bank.
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
                  The new tax regime is now the default. If you don't actively compare and opt for the old regime where it benefits you, you may pay more tax than necessary. We run both and file the one that's better for you.
                </li>
                <li className="opczp-note-item">
                  Picking the right form matters. Salary plus one house property fits ITR-1, but capital gains, foreign assets, or more than one property push you to ITR-2 or ITR-3. Filing the wrong form makes the return defective under Section 139(9).
                </li>
                <li className="opczp-note-item">
                  AIS / TIS mismatches drive notices. Banks, brokers, mutual funds, and registrars now report your transactions to the department. Interest, dividends, and share sales not matching your return are the top trigger for queries. We reconcile every entry.
                </li>
                <li className="opczp-note-item">
                  E-verification completes the filing. A return that isn't verified within 30 days is treated as not filed. We e-verify (Aadhaar OTP / net banking) so your filing — and refund — actually go through.
                </li>
              </ul>
            </div>

            <div className="opczp-cta-row">
              <a
                href="#itrind-consult-form"
                className="opczp-cta-btn"
                onClick={(e) => {
                  e.preventDefault();
                  document.getElementById("itrind-consult-form")?.scrollIntoView({ behavior: "smooth" });
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

export default ItrIndZolvitPremium;
