import React from "react";
import "./CIRtypes.css";
import typesIllustration from "../../assets/pvtltd-types.png"


const PvtTypes = () => {
  return (
    <section className="cir-types-section">
      <div className="cir-types-container">
        {/* Left graphic */}
        <div className="cir-types-illustration-wrap">
          <img
            src={typesIllustration}
            alt="Types of Private Limited Company"
            className="cir-types-illustration"
          />
        </div>

        {/* Right content */}
        <div className="cir-types-content">
          <h2 className="cir-types-title">
            Types of Change in Registered Office Address (LLP) 
          </h2>

          {/* <p className="cir-types-intro">
            Private Limited Companies can be registered in different forms based on ownership, liability, and business objectives. Choosing the right type helps ensure legal protection, smooth operations, and long-term growth.
          </p> */}

          {/* Type 1 */}
          <div className="cir-types-block">
            <h3 className="cir-types-subtitle">Within the Same State & Same ROC Jurisdiction</h3>
            <p className="cir-types-text">
              This is the simplest type of change, such as shifting to another office within the same city or ROC area. It requires partner approval and filing the prescribed form with the Registrar.
            </p>
          </div>

          {/* Type 2 */}
          <div className="cir-types-block">
            <h3 className="cir-types-subtitle">Within the Same State but Different ROC Jurisdiction</h3>
            <p className="cir-types-text">
              If the LLP shifts its office to a location that falls under a different ROC within the same state, necessary filings must be made and the LLP agreement may need to be updated.
            </p>
          </div>

          {/* Type 3 */}
          <div className="cir-types-block">
            <h3 className="cir-types-subtitle">From One State to Another</h3>
            <p className="cir-types-text">
              This is the most detailed process, as it involves changing the state mentioned in the LLP agreement. It requires partner approval, consent from secured creditors (if any), publication of a public notice in newspapers, and filing the required form with the new ROC.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default PvtTypes;
