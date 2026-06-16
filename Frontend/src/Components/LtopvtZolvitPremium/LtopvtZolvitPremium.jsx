import React from "react";
import "./LtopvtZolvitPremium.css";
import premiumIllustration from "../../assets/lt-companys.svg";

const LtopvtZolvitPremium = () => {
  return (
    <section className="opczp-section">
      <div className="opczp-container">
        <div className="opczp-card">

          <div className="opczp-top-row">

            <div className="opczp-illustration-wrapper">
              <img
                src={premiumIllustration}
                alt="LLP to Private Limited Conversion by Legal Terminus"
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
                  LLP to Pvt Ltd Company Conversion may look simple online, but the actual process involves detailed legal, tax, and MCA compliance work. Active LLP status, pending Form 8 or Form 11 filings, partner approvals, newspaper publication, capital conversion, and post-conversion LLP closure all need to be handled correctly to avoid delays or future compliance issues.
                </p>
                <p className="opczp-subtitle" style={{ marginTop: "12px" }}>
                  With LT Priority, your LLP to Pvt Ltd Company Conversion is managed end-to-end by experienced Company Secretaries and compliance professionals — ensuring a smooth transition from LLP structure to an investor-ready Private Limited Company.
                </p>
              </header>

              <section className="opczp-section-block">
                <h3 className="opczp-label">What you get</h3>
                <ul className="opczp-list opczp-features-list">
                  <li className="opczp-list-item">
                    <span className="opczp-list-icon">⚡</span>
                    Priority application handling and faster filing support.
                  </li>
                  <li className="opczp-list-item">
                    <span className="opczp-list-icon">📑</span>
                    Proper drafting and filing of URC-1, URC-2, SPICe+ and related MCA forms.
                  </li>
                  <li className="opczp-list-item">
                    <span className="opczp-list-icon">🔍</span>
                    Verification of LLP compliance status before conversion starts.
                  </li>
                  <li className="opczp-list-item">
                    <span className="opczp-list-icon">📲</span>
                    Dedicated coordination and real-time status updates.
                  </li>
                  <li className="opczp-list-item">
                    <span className="opczp-list-icon">📅</span>
                    Guidance on post-conversion compliances, GST, bank account, and LLP closure support.
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
                  YOUR LLP MUST BE ACTIVE: Form 11 (Annual Return) + Form 8 (Statement of Account + Solvency) up-to-date for ALL preceding financial years. LLPs with pending backlogs cannot file URC-1 until the backlog is cleared. Late-fee for each pending form = ₹100 PER DAY of delay (no cap). Many older LLPs have multi-year backlogs — factor this into your timeline + budget BEFORE conversion.
                </li>
                <li className="opczp-note-item">
                  TAX POSITION IS INTERPRETIVE: Section 47(xiii) of the Income-tax Act technically covers 'firms' (partnership firms under the Indian Partnership Act 1932). Its direct application to LLPs is NOT definitionally codified — CBDT has not issued direct clarification. Common practitioner approach: structure to satisfy 47(xiii) principles + maintain the same proportionate shareholding + 5-year aggregate holding > 50%. Supreme covers a basic structuring note; COMPLEX CASES NEED SEPARATE INCOME-TAX ADVISORY — we recommend engaging tax counsel for high-value transfers.
                </li>
                <li className="opczp-note-item">
                  ALL PARTNERS MUST CONSENT — UNANIMOUSLY: URC-1 requires consent from EVERY partner (designated + non-designated) of the LLP. Any dissenting partner blocks the conversion — resolve internal disagreements + buy-outs + retirements BEFORE you kick off the URC-1 process. Partner-dispute resolution is OUT OF SCOPE.
                </li>
                <li className="opczp-note-item">
                  LLP IS DEEMED DISSOLVED ON CoI — BUT FILE THE 15-DAY INTIMATION: On Certificate of Incorporation issuance under Section 367, the LLP is DEEMED DISSOLVED WITHOUT WINDING UP per the Companies (Authorised to Register) Rules, 2014. No separate Form 24 strike-off is required. BUT — within 15 DAYS of the company's registration, an INTIMATION (along with documents for dissolution) must be sent to the LLP Registrar; the LLP Registrar then formally closes the LLPIN. Miss this 15-day window and the LLP Registrar may keep the LLP active until you intimate. Supreme / Supreme Plus file this intimation; Elemental / Enriched — we provide the template + checklist for you to file yourself.
                </li>
              </ul>
            </div>

            <div className="opczp-cta-row">
              <a
                href="#ltopvt-consult-form"
                className="opczp-cta-btn"
                onClick={(e) => {
                  e.preventDefault();
                  document.getElementById("ltopvt-consult-form")?.scrollIntoView({ behavior: "smooth" });
                }}
              >
                Consult a Conversion Expert
              </a>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
};

export default LtopvtZolvitPremium;
