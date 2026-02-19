import React from "react";
import "./TrustPvtTypes.css";
import typesIllustration from "../../assets/pvtltd-types.png";

const TrustPvtTypes = () => {
  return (
    <section className="trust-types-section">
      <div className="trust-types-container">

        {/* Illustration */}
        <div className="trust-types-illustration-wrap">
          <img
            src={typesIllustration}
            alt="Types of Private Limited Company"
            className="trust-types-illustration"
          />
        </div>

        {/* Content */}
        <div className="trust-types-content">
          <h2 className="trust-types-title">
            Types of Trust Registration in India
          </h2>

          {/* Type 1 */}
          <div className="trust-types-block">
            <h3 className="trust-types-subtitle">
              Public Charitable Trusts:
            </h3>
            <p className="trust-types-text">
              These trusts are created for the benefit of the general public, such as for education, healthcare, religious activities, or other social welfare purposes. They are registered under the relevant state laws (for example, the Bombay Public Trust Act). Many public trusts apply for 12A and 80G registration to get income tax benefits.
            </p>
          </div>

          {/* Type 2 */}
          <div className="trust-types-block">
            <h3 className="trust-types-subtitle">
              Private Trusts:
            </h3>
            <p className="trust-types-text">
              These trusts are formed for the benefit of specific individuals or a particular family. They are governed by the Indian Trusts Act, 1882.
            </p>
          </div>

          {/* Type 3 */}
          <div className="trust-types-block">
            <h3 className="trust-types-subtitle">Public-cum-Private Trusts:</h3>
            <p className="trust-types-text">
              These trusts have both public and private purposes. Part of the income is used for public charitable activities, and part is used for specific private beneficiaries.
            </p>
          </div>
        </div>

      </div>
    </section>
  );
};

export default TrustPvtTypes;
