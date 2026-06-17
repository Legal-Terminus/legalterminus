import React from "react";
import "../ProFOPCRequirementsTab/ProFOPCRequirementsTab.css";

const RequirementsPvt = () => {
  return (
    <section className="profopc-req-section">
      <div className="profopc-req-container">
        {/* Heading + intro */}
        <header className="profopc-req-header">
          <h2 className="profopc-req-title">
            Benefits of Converting Public Limited to Private Limited
          </h2>
        </header>

        {/* Cards */}
        <div className="profopc-req-grid">
          {/* 1 */}
          <article className="profopc-req-card">
            <h3 className="profopc-req-card-title">Reduced Compliance</h3>
            <div className="profopc-req-card-underline" />
            <p className="profopc-req-card-text">
              A private company is freed from many of the heavy filings and public disclosures that a public company must make, cutting your ongoing compliance burden.
            </p>
          </article>

          {/* 2 */}
          <article className="profopc-req-card">
            <h3 className="profopc-req-card-title">
              Greater Privacy &amp; Control
            </h3>
            <div className="profopc-req-card-underline" />
            <p className="profopc-req-card-text">
              Restrict the transfer of shares and keep ownership within a small, trusted group — the public can no longer subscribe to your securities.
            </p>
          </article>

          {/* 3 */}
          <article className="profopc-req-card">
            <h3 className="profopc-req-card-title">
              Fewer Statutory Requirements
            </h3>
            <div className="profopc-req-card-underline" />
            <p className="profopc-req-card-text">
              Run the company with just 2 members and 2 directors instead of the 7 members and 3 directors a public company needs.
            </p>
          </article>

          {/* 4 */}
          <article className="profopc-req-card">
            <h3 className="profopc-req-card-title">Faster Decision Making</h3>
            <div className="profopc-req-card-underline" />
            <p className="profopc-req-card-text">
              Private companies enjoy several exemptions under the Companies Act, allowing leaner board and general meetings and quicker approvals.
            </p>
          </article>
        </div>
      </div>
    </section>
  );
};

export default RequirementsPvt;
