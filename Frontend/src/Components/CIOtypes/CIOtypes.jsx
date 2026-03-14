import React from "react";
import "./CIOtypes.css";
import typesIllustration from "../../assets/pvtltd-types.png"


const PvtTypes = () => {
  return (
    <section className="cio-types-section">
      <div className="cio-types-container">
        {/* Left graphic */}
        <div className="cio-types-illustration-wrap">
          <img
            src={typesIllustration}
            alt="Types of Private Limited Company"
            className="cio-types-illustration"
          />
        </div>

        {/* Right content */}
        <div className="cio-types-content">
          <h2 className="cio-types-title">
            Types of Change in Object (LLP)
          </h2>

          {/* <p className="cio-types-intro">
            Private Limited Companies can be registered in different forms based on ownership, liability, and business objectives. Choosing the right type helps ensure legal protection, smooth operations, and long-term growth.
          </p> */}

          {/* Type 1 */}
          <div className="cio-types-block">
            <h3 className="cio-types-subtitle">Adding New Business Activities</h3>
            <p className="cio-types-text">
              The LLP may include new services or business areas in addition to its existing operations.
            </p>
          </div>

          {/* Type 2 */}
          <div className="cio-types-block">
            <h3 className="cio-types-subtitle">Removing Unnecessary Activities</h3>
            <p className="cio-types-text">
              Business activities that are no longer relevant or profitable can be removed from the LLP’s scope.</p>
          </div>

          {/* Type 3 */}
          <div className="cio-types-block">
            <h3 className="cio-types-subtitle">Modifying Existing Objectives</h3>
            <p className="cio-types-text">
             Current business activities can be updated or redefined to match new market trends or business strategies.</p>
          </div>

          {/* Type 4 */}
          <div className="cio-types-block">
            <h3 className="cio-types-subtitle">Changing the Main Business Activity</h3>
            <p className="cio-types-text">
             The LLP can change its primary business focus if it plans to move into a different core area of operation.</p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default PvtTypes;
