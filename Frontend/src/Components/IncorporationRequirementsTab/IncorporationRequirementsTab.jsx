import React from "react";
import "./IncorporationRequirementsTab.css";

const IncorporationRequirementsTab = () => {
  return (
    <section className="incorp-req-section">
      <div className="incorp-req-container">

        {/* ================= HEADER ================= */}
        <header className="incorp-req-header">
          <h2 className="incorp-req-title">
            Benefits of Incorporation Of Wholly Owned Subsidiary in India
          </h2>
          <p className="incorp-req-subtitle">
            A Wholly Owned Subsidiary (WOS) in India is registered as a Private Limited Company under the Companies Act, 2013, with 100% shareholding held by the foreign parent company — giving you full control, limited liability, and direct access to India's rapidly growing market.
          </p>
        </header>

        {/* ================= CARDS ================= */}
        <div className="incorp-req-grid">

          {/* Card 1 */}
          <article className="incorp-req-card">
            <h3 className="incorp-req-card-title">
              Full Control Over Business
            </h3>
            <div className="incorp-req-card-underline" />
            <p className="incorp-req-card-text">
              Unlike a joint venture where decisions are shared, a Wholly Owned Subsidiary (WOS) allows the foreign parent company to make all decisions independently. This helps in running operations smoothly without disagreements.
            </p>
          </article>

          {/* Card 2 */}
          <article className="incorp-req-card">
            <h3 className="incorp-req-card-title">
              100% Ownership Rights
            </h3>
            <div className="incorp-req-card-underline" />
            <p className="incorp-req-card-text">
              With a WOS, foreign investors can own the company fully. There is no need to involve an Indian partner, so ownership and profits remain completely with the parent company.
            </p>
          </article>

          {/* Card 3 */}
          <article className="incorp-req-card">
            <h3 className="incorp-req-card-title">
              Easy Entry into the Indian Market
            </h3>
            <div className="incorp-req-card-underline" />
            <p className="incorp-req-card-text">
              India is one of the largest and fastest-growing markets. A WOS helps foreign companies operate directly in India, adjust services/products for local customers, and grow their business.
            </p>
          </article>

          {/* Card 4 */}
          <article className="incorp-req-card">
            <h3 className="incorp-req-card-title">
              Government Benefits and Support
            </h3>
            <div className="incorp-req-card-underline" />
            <p className="incorp-req-card-text">
              India offers various tax benefits and business incentives for foreign companies, especially in selected industries. Programs like Make in India also support international businesses setting up in India.
            </p>
          </article>

          {/* Card 5 */}
          <article className="incorp-req-card">
            <h3 className="incorp-req-card-title">
              Smooth Profit Transfer to Parent Company
            </h3>
            <div className="incorp-req-card-underline" />
            <p className="incorp-req-card-text">
              After paying the required taxes, the company can send profits back to the foreign parent company, making it financially beneficial for foreign businesses.
            </p>
          </article>

          {/* Card 6 */}
          <article className="incorp-req-card">
            <h3 className="incorp-req-card-title">
              Separate Legal Identity
            </h3>
            <div className="incorp-req-card-underline" />
            <p className="incorp-req-card-text">
              A WOS is treated as a separate company in India. This means the parent company gets legal protection, and liabilities of the Indian entity usually remain with the subsidiary.
            </p>
          </article>

        </div>
      </div>
    </section>
  );
};

export default IncorporationRequirementsTab;
