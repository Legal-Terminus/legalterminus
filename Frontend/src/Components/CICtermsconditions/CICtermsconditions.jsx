import React from "react";
import "./CICtermsconditions.css";

const TermsConditions = () => {
  return (
    <section className="cic-tc-section">
      <div className="cic-tc-container">
        {/* Heading */}
        <h2 className="cic-tc-title">TERMS &amp; CONDITIONS</h2>

        {/* Sub heading
        <p className="cic-tc-subtitle">
          By subscribing to the above plans, you agree to abide by our following
          additional terms and conditions
        </p> */}

        {/* List */}
        <ol className="cic-tc-list">
          <li className="cic-tc-item">
            Please note that the above plan includes applicable Govt. Fees
          </li>
        </ol>
      </div>
    </section>
  );
};

export default TermsConditions;
