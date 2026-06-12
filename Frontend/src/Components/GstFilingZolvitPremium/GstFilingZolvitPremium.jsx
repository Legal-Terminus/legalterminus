import React from "react";
import "./GstFilingZolvitPremium.css";
import premiumIllustration from "../../assets/lt-companys.svg";

const GstFilingZolvitPremium = () => {
  return (
    <section className="opczp-section">
      <div className="opczp-container">
        <div className="opczp-card">

          <div className="opczp-top-row">

            <div className="opczp-illustration-wrapper">
              <img
                src={premiumIllustration}
                alt="GST Return Filing by Legal Terminus"
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
                  GST Return Filing may look simple, but proper GST compliance involves much more than uploading sales data on the portal. Invoice matching, GSTR-1 accuracy, GSTR-3B reconciliation, ITC verification, IMS updates, and timely filing all play a major role in avoiding notices, penalties, and input tax credit mismatches. With LT Priority, your GST Return Filing is handled by experienced GST professionals who carefully manage the complete filing process — helping your business maintain accurate compliance and avoid costly filing errors.
                </p>
              </header>

              <section className="opczp-section-block">
                <h3 className="opczp-label">What you get</h3>
                <ul className="opczp-list opczp-features-list">
                  <li className="opczp-list-item">
                    <span className="opczp-list-icon">⚡</span>
                    Priority return processing and timely filing support
                  </li>
                  <li className="opczp-list-item">
                    <span className="opczp-list-icon">📑</span>
                    Proper reconciliation of sales, purchase, and ITC data
                  </li>
                  <li className="opczp-list-item">
                    <span className="opczp-list-icon">🧑‍⚖️</span>
                    Senior GST expert review before return submission
                  </li>
                  <li className="opczp-list-item">
                    <span className="opczp-list-icon">📊</span>
                    GSTR-2B and IMS matching support for better ITC accuracy
                  </li>
                  <li className="opczp-list-item">
                    <span className="opczp-list-icon">📅</span>
                    Compliance tracking support to help avoid late fees and penalties
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
                  GSTR-3B HARD-LOCKING: From July 2025, Tables 3.1 + 3.2 of GSTR-3B are AUTO-POPULATED from GSTR-1 / GSTR-1A / IFF and NOT EDITABLE. If your GSTR-1 has errors, you fix them in GSTR-1A BEFORE filing GSTR-3B - or your liability is locked at the wrong number. ITC Table 4 hard-locking is next (targeted ~July 2026).
                </li>
                <li className="opczp-note-item">
                  IMS PUTS YOUR BUYERS IN CONTROL: Every invoice you upload in GSTR-1 flows to your buyer's IMS dashboard. The buyer can ACCEPT / REJECT / KEEP PENDING. Rejected / pending invoices DON'T enter their GSTR-2B (their ITC blocked) and are PUSHED BACK to YOUR downstream GSTR-3B liability. Translation: bad invoice data = lose buyer goodwill + carry the tax liability yourself.
                </li>
                <li className="opczp-note-item">
                  3-YEAR TIME-BAR LOCKS FOREVER: From FY 2026-27, you CANNOT file any GST return more than 3 YEARS after its original due date. Old / pending returns must be filed within the 3-year window or ITC is permanently lost + non-filing prosecution risk continues. Backlog clean-up has a hard deadline.
                </li>
                <li className="opczp-note-item">
                  JANUARY 2026 LEDGER VALIDATIONS: Effective Jan 2026, the GST portal enforces stricter ledger checks - cash + credit ledger balance validations BEFORE GSTR-3B can be filed. ITC claims that fail ledger validations are blocked. Sloppy invoice booking = filing failure.
                </li>
              </ul>
            </div>

            <div className="opczp-cta-row">
              <a
                href="#gstf-consult-form"
                className="opczp-cta-btn"
                onClick={(e) => {
                  e.preventDefault();
                  document.getElementById("gstf-consult-form")?.scrollIntoView({ behavior: "smooth" });
                }}
              >
                Consult a GST Expert
              </a>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
};

export default GstFilingZolvitPremium;
