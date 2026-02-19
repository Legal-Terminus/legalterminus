import React from "react";
import "./DissolvePrivateTermsCondition.css";

const DissolvePrivateTermsCondition = () => {
  return (
    <section className="DissolvePrivate-tc-section">
      <div className="DissolvePrivate-tc-container">

        {/* ================= HEADING ================= */}
        <h2 className="DissolvePrivate-tc-title">TERMS &amp; CONDITIONS</h2>

        {/* ================= LIST ================= */}
        <ol className="DissolvePrivate-tc-list">
          <li className="DissolvePrivate-tc-item">
            Please note that the above plan includes applicable Govt. Fees
          </li>
        </ol>
      </div>
    </section>
  );
};

export default DissolvePrivateTermsCondition;
