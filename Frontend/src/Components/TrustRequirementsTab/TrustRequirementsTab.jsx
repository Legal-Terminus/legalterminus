import React from "react";
import "./TrustRequirementsTab.css";

const TrustRequirementsTab = () => {
  return (
    <section className="trust-req-section">
      <div className="trust-req-container">

        {/* ================= HEADER ================= */}
        <header className="trust-req-header">
          <h2 className="trust-req-title">
            Benefits of Trust Registration in India
          </h2>
          <p className="trust-req-subtitle">
            Trust registration in India is generally handled at the state level. The trust deed is registered with the local Sub-Registrar office under the applicable state laws.
          </p>
        </header>

        {/* ================= CARDS ================= */}
        <div className="trust-req-grid">

          {/* Card 1 */}
          <article className="trust-req-card">
            <h3 className="trust-req-card-title">
              Tax Benefits:
            </h3>
            <div className="trust-req-card-underline" />
            <p className="trust-req-card-text">
              A registered trust can apply for 12A to save income tax. It can also get 80G approval so that people who donate to the trust can claim tax benefits.
            </p>
          </article>

          {/* Card 2 */}
          <article className="trust-req-card">
            <h3 className="trust-req-card-title">
              Legal Recognition:
            </h3>
            <div className="trust-req-card-underline" />
            <p className="trust-req-card-text">
              Registration gives the trust a proper legal identity. It protects the trust’s property and helps avoid legal problems or disputes.
            </p>
          </article>

          {/* Card 3 */}
          <article className="trust-req-card">
            <h3 className="trust-req-card-title">
              Easy Transfer of Assets:
            </h3>
            <div className="trust-req-card-underline" />
            <p className="trust-req-card-text">
              In private trusts, assets can be smoothly transferred to family members or beneficiaries without long court procedures.
            </p>
          </article>

          {/* Card 4 */}
          <article className="trust-req-card">
            <h3 className="trust-req-card-title">
              Better Trust and Funding Support:
            </h3>
            <div className="trust-req-card-underline" />
            <p className="trust-req-card-text">
              A registered trust is more trusted by donors, government bodies, and companies. It can apply for government grants and foreign funding (after required approval).
            </p>
          </article>

        </div>
      </div>
    </section>
  );
};

export default TrustRequirementsTab;
