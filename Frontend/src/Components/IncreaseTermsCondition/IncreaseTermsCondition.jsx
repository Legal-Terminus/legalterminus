import React from "react";
import "./IncreaseTermsCondition.css";

const IncreaseTermsCondition = () => {
  return (
    <section className="Increase-tc-section">
      <div className="Increase-tc-container">
        {/* Heading */}
        <h2 className="Increase-tc-title">TERMS &amp; CONDITIONS</h2>

        {/* Sub heading
        <p className="Increase-tc-subtitle">
          By subscribing to the above plans, you agree to abide by our following
          additional terms and conditions
        </p> */}

        {/* List */}
        <ol className="Increase-tc-list">
          <li className="Increase-tc-item">
            The fee mentioned above in the plan does not include any govt fees and shall be payable directly by the client.
          </li>    
        </ol>
      </div>
    </section>
  );
}

export default IncreaseTermsCondition;
