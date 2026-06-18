import React from "react";
import "./EpfRetOverview.css";
import illustration from "../../assets/whypvt-imp1.svg";

const EpfRetOverview = () => {
  return (
    <div className="opc-full-wrapper">

      <section className="opc-intro-section">
        <div className="opc-intro-container">
          <div className="opc-intro-illustration-wrap">
            <img
              src={illustration}
              alt="EPF Return Filing illustration"
              className="opc-intro-illustration"
            />
          </div>

          <div className="opc-intro-content">
            <h2 className="opc-intro-title">
              Why You Need Timely EPF Return Filing
            </h2>
            <p className="opc-intro-text">
              Under the Employees' Provident Funds and Miscellaneous Provisions Act, 1952, establishments employing 20 or more employees must comply with EPF regulations by deducting PF contributions, depositing contributions, paying applicable charges, and filing monthly ECR returns through the EPFO portal within the prescribed due date.
              <br /><br />
              Delayed EPF filing or payment can result in interest, penalties, departmental notices, compliance scrutiny, and difficulties during loans, investments, or tender processes. Continued non-compliance may also lead to legal action and prosecution.
              <br /><br />
              Apart from legal compliance, timely EPF return filing helps maintain employee trust and keeps your business records clean and verification-ready.
            </p>
          </div>
        </div>
      </section>

    </div>
  );
};

export default EpfRetOverview;
