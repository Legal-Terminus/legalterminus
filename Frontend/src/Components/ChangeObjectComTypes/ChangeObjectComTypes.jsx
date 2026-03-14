import React from "react";
import "./ChangeObjectComTypes.css";
import typesIllustration from "../../assets/pvtltd-types.png"


const ChangeObjectComTypes= () => {
  return (
    <section className="Change-ob-com-types-types-section">
      <div className="Change-ob-com-types-types-container">
        {/* Left graphic */}
        <div className="Change-ob-com-types-types-illustration-wrap">
          <img
            src={typesIllustration}
            alt="Types of Private Limited Company"
            className="Change-ob-com-types-types-illustration"
          />
        </div>

        {/* Right content */}
        <div className="Change-ob-com-types-types-content">
          <h2 className="Change-ob-com-types-types-title">
            Types of Change in Company Object
          </h2>

          {/* <p className="Change-ob-com-types-types-intro">
            Private Limited Companies can be registered in different forms based on ownership, liability, and business objectives. Choosing the right type helps ensure legal protection, smooth operations, and long-term growth.
          </p> */}

          {/* Type 1 */}
          <div className="Change-ob-com-types-types-block">
            <h3 className="Change-ob-com-types-types-subtitle">Addition of New Objects:</h3>
            <p className="Change-ob-com-types-types-text">
              Including new business activities or services in the object clause to support expansion, diversification, or a change in business direction.
            </p>
          </div>

          {/* Type 2 */}
          <div className="Change-ob-com-types-types-block">
            <h3 className="Change-ob-com-types-types-subtitle">Removal of Existing Objects:</h3>
            <p className="Change-ob-com-types-types-text">
              Deleting activities that are no longer relevant or aligned with the company’s current strategy.
            </p>
          </div>

          {/* Type 3 */}
          <div className="Change-ob-com-types-types-block">
            <h3 className="Change-ob-com-types-types-subtitle">Modification of Existing Objects:</h3>
            <p className="Change-ob-com-types-types-text">
              Revising or refining the wording of existing clauses to better match present operations and future plans.
            </p>
          </div>

          {/* Type 4 */}
          <div className="Change-ob-com-types-types-block">
            <h3 className="Change-ob-com-types-types-subtitle">Complete Replacement (Substitution):</h3>
            <p className="Change-ob-com-types-types-text">
              Replacing the entire object clause with a new one when the company intends to shift its core business focus.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ChangeObjectComTypes;
