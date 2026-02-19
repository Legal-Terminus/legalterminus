import React from "react";
import "./PartnershipLLPTypes.css";
import typesIllustration from "../../assets/pvtltd-types.png";

const PartnershipLLPTypes = () => {
  return (
    <section className="partnership-llp-types-section">
      <div className="partnership-llp-types-container">
        {/* Left graphic */}
        <div className="partnership-llp-types-illustration-wrap">
          <img
            src={typesIllustration}
            alt="Types of Private Limited Company"
            className="partnership-llp-types-illustration"
          />
        </div>

        {/* Right content */}
        <div className="partnership-llp-types-content">
          <h2 className="partnership-llp-types-title">
            Types of Conversion of Partnership into Limited Liability Partnership
          </h2>

          {/* Type 1 */}
          <div className="partnership-llp-types-block">
            <h3 className="partnership-llp-types-subtitle">Registered Firm Requirement:</h3>
            <p className="partnership-llp-types-text">
              The partnership firm should be registered under the Indian Partnership Act, 1932 before applying for conversion into an LLP.
            </p>
          </div>

          {/* Type 2 */}
          <div className="partnership-llp-types-block">
            <h3 className="partnership-llp-types-subtitle">Partners and Structure:</h3>
            <p className="partnership-llp-types-text">
              All existing partners of the firm must become partners in the LLP. No new partner can be added, and no existing partner can be removed during the conversion process.
            </p>
          </div>

          {/* Type 3 */}
          <div className="partnership-llp-types-block">
            <h3 className="partnership-llp-types-subtitle">Designated Partners:</h3>
            <p className="partnership-llp-types-text">
              At least two partners must be appointed as designated partners, and one of them must be a resident of India.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default PartnershipLLPTypes;
