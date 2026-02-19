import React from "react";
import "./PritoLlpRequirementsTab.css";

const RequirementsPvt = () => {
  return (
    <section className="PLC-to-LLP-req-section">
      <div className="PLC-to-LLP-req-container">
        {/* Heading + intro */}
        <header className="PLC-to-LLP-req-header">
          <h2 className="PLC-to-LLP-req-title">
            Benefits of Conversion of Private Limited Company into LLP
          </h2>
          <p className="PLC-to-LLP-req-subtitle">
            The Ministry of Corporate Affairs (MCA) manages the process of conversion of a Private Limited Company into an LLP in India. It includes filing the required forms with the Registrar of Companies (RoC), obtaining approval for conversion, and completing necessary compliance formalities as prescribed under the applicable laws.
          </p>
        </header>

        {/* Cards */}
        <div className="PLC-to-LLP-req-grid">
          {/* 1 */}
          <article className="PLC-to-LLP-req-card">
            <h3 className="PLC-to-LLP-req-card-title">Tax Benefits:</h3>
            <div className="PLC-to-LLP-req-card-underline" />
            <p className="PLC-to-LLP-req-card-text">
              Partners can share profits without Dividend Distribution Tax (DDT). LLPs are not required to pay MAT, and asset transfer during conversion can be tax-free if conditions are met. Past business losses can also be carried forward.
            </p>
          </article>

          {/* 2 */}
          <article className="PLC-to-LLP-req-card">
            <h3 className="PLC-to-LLP-req-card-title">Lower Compliance Costs:</h3>
            <div className="PLC-to-LLP-req-card-underline" />
            <p className="PLC-to-LLP-req-card-text">
              No need to conduct mandatory Board Meetings or Annual General Meetings. Audit is required only if turnover crosses the prescribed limit. Fewer forms need to be filed with ROC.
            </p>
          </article>

          {/* 3 */}
          <article className="PLC-to-LLP-req-card">
            <h3 className="PLC-to-LLP-req-card-title">
              Flexible Management:
            </h3>
            <div className="PLC-to-LLP-req-card-underline" />
            <p className="PLC-to-LLP-req-card-text">
              LLPs are managed as per the LLP Agreement, without strict company structure rules. There is no limit on the number of partners.
            </p>
          </article>

          {/* 4 */}
          <article className="PLC-to-LLP-req-card">
            <h3 className="PLC-to-LLP-req-card-title">
              Limited Liability Protection:
            </h3>
            <div className="PLC-to-LLP-req-card-underline" />
            <p className="PLC-to-LLP-req-card-text">
              Partners’ personal assets are protected from business debts, except in cases of fraud.
            </p>
          </article>
        </div>
      </div>
    </section>
  );
};

export default RequirementsPvt;
