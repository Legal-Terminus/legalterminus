import React from "react";
import "./EpfRetZolvitPremium.css";
import premiumIllustration from "../../assets/lt-companys.svg";

const EpfRetZolvitPremium = () => {
  return (
    <section className="opczp-section">
      <div className="opczp-container">
        <div className="opczp-card">

          <div className="opczp-top-row">

            <div className="opczp-illustration-wrapper">
              <img
                src={premiumIllustration}
                alt="EPF Return Filing by Legal Terminus"
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
                  EPF filing looks like one challan a month — but a wrong wage base, an un-seeded UAN, a missed exit date, or a late deposit triggers 12% interest, 14B damages, and member grievances. Priority is what happens when a dedicated PF manager owns your monthly ECR from wage sheet to paid challan.
                </p>
              </header>

              <section className="opczp-section-block">
                <h3 className="opczp-label">What you get</h3>
                <ul className="opczp-list opczp-features-list">
                  <li className="opczp-list-item">
                    <span className="opczp-list-icon">⚡</span>
                    A monthly ECR routine locked to the 15th — wages collected, contributions computed, and challan ready well before the due date.
                  </li>
                  <li className="opczp-list-item">
                    <span className="opczp-list-icon">✅</span>
                    Accurate PF, EPS, and EDLI computation on the correct wage base — no over- or under-deposit that draws an inspection.
                  </li>
                  <li className="opczp-list-item">
                    <span className="opczp-list-icon">✅</span>
                    UAN generation and KYC seeding (Aadhaar, PAN, bank) so members' accounts are claim-ready and approvals don't stall.
                  </li>
                  <li className="opczp-list-item">
                    <span className="opczp-list-icon">🔄</span>
                    New joiner and exit (Date of Exit) updates handled each month so your member roster always matches reality.
                  </li>
                  <li className="opczp-list-item">
                    <span className="opczp-list-icon">📑</span>
                    Filed-return kit: ECR text file, paid challan (TRRN), contribution summary, and a running monthly compliance log.
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
                  The 15th is a hard deadline. EPF contributions for a month must be deposited by the 15th of the next month. Late deposit attracts 12% annual interest (Sec 7Q) plus graded damages of 5%–25% (Sec 14B) — we file ahead so a holiday or cash-flow gap never costs you.
                </li>
                <li className="opczp-note-item">
                  UAN and KYC accuracy is critical. Contributions deposited against an unverified UAN or mismatched KYC get stuck and block the member's withdrawals and transfers. We seed and approve KYC so every rupee reaches the right account.
                </li>
                <li className="opczp-note-item">
                  Exit dates matter. Forgetting to mark a Date of Exit for a separated employee keeps the establishment liable and blocks the member's settlement. We update joiners and exits as part of every month's filing.
                </li>
                <li className="opczp-note-item">
                  Non-compliance invites a 7A inquiry. Persistent default or under-reporting can trigger an EPFO assessment under Section 7A, with recovery, interest, and damages. Clean monthly filing keeps you off the radar.
                </li>
              </ul>
            </div>

            <div className="opczp-cta-row">
              <a
                href="#epfret-consult-form"
                className="opczp-cta-btn"
                onClick={(e) => {
                  e.preventDefault();
                  document.getElementById("epfret-consult-form")?.scrollIntoView({ behavior: "smooth" });
                }}
              >
                Consult a PF Compliance Expert
              </a>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
};

export default EpfRetZolvitPremium;
