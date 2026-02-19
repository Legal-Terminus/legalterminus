import React from "react";
import "./PartnershipLLPRequirementsTab.css";

const PartnershipLLPRequirementsTab = () => {
  return (
    <section className="partnership-llp-req-section">
      <div className="partnership-llp-req-container">
        {/* Heading + intro */}
        <header className="partnership-llp-req-header">
          <h2 className="partnership-llp-req-title">
            Benefits of Conversion of Partnership into Limited Liability Partnership
          </h2>
          <p className="partnership-llp-req-subtitle">
            Converting a partnership firm into an LLP gives partners limited liability protection, safeguarding personal assets from business risks. It provides a separate legal identity and continuous existence of the business. LLP also offers better credibility, no limit on the number of partners, and more flexible management structure compared to a traditional partnership firm.
          </p>
        </header>

        {/* Cards */}
        <div className="partnership-llp-req-grid">
          {/* 1 */}
          <article className="partnership-llp-req-card">
            <h3 className="partnership-llp-req-card-title">Limited Liability:</h3>
            <div className="partnership-llp-req-card-underline" />
            <p className="partnership-llp-req-card-text">
              Partners are responsible only for the amount they invest in the business. Their personal property is generally safe from business losses or debts.
            </p>
          </article>

          {/* 2 */}
          <article className="partnership-llp-req-card">
            <h3 className="partnership-llp-req-card-title">
              Separate Legal Identity & Continuous Existence:
            </h3>
            <div className="partnership-llp-req-card-underline" />
            <p className="partnership-llp-req-card-text">
              An LLP is treated as a separate legal entity. It continues to exist even if a partner retires, passes away, or leaves the business.
            </p>
          </article>

          {/* 3 */}
          <article className="partnership-llp-req-card">
            <h3 className="partnership-llp-req-card-title">
              No Limit on Number of Partners:
            </h3>
            <div className="partnership-llp-req-card-underline" />
            <p className="partnership-llp-req-card-text">
              There is no maximum limit on the number of partners in an LLP, which makes it easier for the business to grow.
            </p>
          </article>

          {/* 4 */}
          <article className="partnership-llp-req-card">
            <h3 className="partnership-llp-req-card-title">Flexible Management:</h3>
            <div className="partnership-llp-req-card-underline" />
            <p className="partnership-llp-req-card-text">
              Partners can decide how they want to manage the business through an LLP agreement. It offers the flexibility of a partnership along with the benefits of a company structure.
            </p>
          </article>
        </div>
      </div>
    </section>
  );
};

export default PartnershipLLPRequirementsTab;
