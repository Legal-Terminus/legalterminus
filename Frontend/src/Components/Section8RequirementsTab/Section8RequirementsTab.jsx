import React from "react";
import "./Section8RequirementsTab.css";

const Section8RequirementsTab = () => {
  return (
    <section className="s8-req-section">
      <div className="s8-req-container">

        {/* ================= HEADER ================= */}
        <header className="s8-req-header">
          <h2 className="s8-req-title">
            Benefits of Section 8 Company Registration in India
          </h2>
          <p className="s8-req-subtitle">
            The Ministry of Corporate Affairs (MCA) governs the incorporation of a Section 8 Company in India. The process includes obtaining name approval, securing a Digital Signature Certificate (DSC) and Director Identification Number (DIN), and filing incorporation documents with the Registrar of Companies (RoC) along with mandatory Central Government approval (through the Regional Director).
          </p>
        </header>

        {/* ================= CARDS ================= */}
        <div className="s8-req-grid">

          {/* Card 1 */}
          <article className="s8-req-card">
            <h3 className="s8-req-card-title">
              Legal Recognition & Trust
            </h3>
            <div className="s8-req-card-underline" />
            <p className="s8-req-card-text">
              A Section 8 Company is registered under the Companies Act, 2013 and regulated by the Government. Because of strict compliance rules, it is considered more transparent and trustworthy by donors, government bodies, and other stakeholders.
            </p>
          </article>

          {/* Card 2 */}
          <article className="s8-req-card">
            <h3 className="s8-req-card-title">
              Tax Benefits
            </h3>
            <div className="s8-req-card-underline" />
            <p className="s8-req-card-text">
              Section 8 Companies can apply for 12A and 80G registration to get tax exemptions. Also receive tax benefits on their donations, which helps attract more funding.
            </p>
          </article>

          {/* Card 3 */}
          <article className="s8-req-card">
            <h3 className="s8-req-card-title">
              No Minimum Capital Requirement
            </h3>
            <div className="s8-req-card-underline" />
            <p className="s8-req-card-text">
              There is no requirement to maintain a minimum share capital. You can start a Section 8 Company with any suitable capital amount.
            </p>
          </article>

          {/* Card 4 */}
          <article className="s8-req-card">
            <h3 className="s8-req-card-title">
              Stamp Duty Exemption
            </h3>
            <div className="s8-req-card-underline" />
            <p className="s8-req-card-text">
              Section 8 Companies are generally exempt from paying stamp duty on their Memorandum and Articles of Association, unlike other companies.
            </p>
          </article>

        </div>
      </div>
    </section>
  );
};

export default Section8RequirementsTab;
