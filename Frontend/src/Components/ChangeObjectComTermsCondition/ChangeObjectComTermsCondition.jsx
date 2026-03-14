import React from "react";
import "./ChangeObjectComTermsCondition.css";

const ChangeObjectComTermsCondition = () => {
  return (
    <section className="Change-ob-tc-tc-section">
      <div className="Change-ob-tc-tc-container">
        {/* Heading */}
        <h2 className="Change-ob-tc-tc-title">TERMS &amp; CONDITIONS</h2>

        {/* Sub heading
        <p className="Change-ob-tc-tc-subtitle">
          By subscribing to the above plans, you agree to abide by our following
          additional terms and conditions
        </p> */}

        {/* List */}
        <ol className="Change-ob-tc-tc-list">
          <li className="Change-ob-tc-tc-item">
            Please note that the above plan includes applicable Govt. Fees
          </li>
        </ol>
      </div>
    </section>
  );
};

export default ChangeObjectComTermsCondition;
