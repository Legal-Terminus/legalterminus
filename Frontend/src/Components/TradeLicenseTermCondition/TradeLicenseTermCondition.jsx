import React from "react";
import "./TradeLicenseTermCondition.css";

const TradeLicenseTermCondition = () => {
  return (
    <section className="tradetc-section">
      <div className="tradetc-container">
        <div className="tradetc-card">
          {/* Heading */}
          <h2 className="tradetc-title">TERMS &amp; CONDITIONS</h2>

          {/* Sub heading */}
          <p className="tradetc-subtitle">
            By subscribing to the above plans, you agree to abide by our following additional terms and conditions
          </p>

          {/* List */}
          <ol className="tradetc-list">
            <li className="tradetc-item">
              The fee mentioned above does not include govt. fee applicable, if any, which shall be payable over and above the fee mentioned
            </li>

            <li className="tradetc-item">
              The Professional Fees & Govt Fees, if any, varies from state to state, kindly contact our executive, we shall be happy to provide you a best quotation as per your requirement
            </li>
          </ol>
        </div>
      </div>
    </section>
  );
};

export default TradeLicenseTermCondition;
