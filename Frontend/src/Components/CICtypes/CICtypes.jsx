import React from "react";
import "./CICtypes.css";
import typesIllustration from "../../assets/pvtltd-types.png"


const PvtTypes = () => {
  return (
    <section className="cic-types-section">
      <div className="cic-types-container">
        {/* Left graphic */}
        <div className="cic-types-illustration-wrap">
          <img
            src={typesIllustration}
            alt="Types of Private Limited Company"
            className="cic-types-illustration"
          />
        </div>

        {/* Right content */}
        <div className="cic-types-content">
          <h2 className="cic-types-title">
            Types of Change in Company Name
          </h2>

          {/* <p className="cic-types-intro">
            Private Limited Companies can be registered in different forms based on ownership, liability, and business objectives. Choosing the right type helps ensure legal protection, smooth operations, and long-term growth.
          </p> */}

          {/* Type 1 */}
          <div className="cic-types-block">
            <h3 className="cic-types-subtitle">Voluntary Name Change</h3>
            <p className="cic-types-text">
              The company may decide to change its name to improve branding, create a better market image, or match modern business trends.
            </p>
          </div>

          {/* Type 2 */}
          <div className="cic-types-block">
            <h3 className="cic-types-subtitle">Change Due to New Business Activities</h3>
            <p className="cic-types-text">
              If the company starts new services or changes its main business activities, it may update its name to better reflect what it actually does.
            </p>
          </div>

          {/* Type 3 */}
          <div className="cic-types-block">
            <h3 className="cic-types-subtitle">Change After Conversion (Private ↔ Public)</h3>
            <p className="cic-types-text">
             When a company converts from Private to Public or from Public to Private, it must add or remove the word “Private” in its name accordingly.            </p>
          </div>
          
          {/* Type 4 */}
          <div className="cic-types-block">
            <h3 className="cic-types-subtitle">Change After Merger or Ownership Change</h3>
            <p className="cic-types-text">
             If there is a merger, acquisition, or major change in management, the company name may be updated to reflect the new ownership.</p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default PvtTypes;
