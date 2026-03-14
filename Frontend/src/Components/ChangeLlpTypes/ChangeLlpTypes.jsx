import React from "react";
import "./ChangeLlpTypes.css";
import typesIllustration from "../../assets/pvtltd-types.png"


const ChangeLlpTypes = () => {
  return (
    <section className="ChangeLlp-types-section">
      <div className="ChangeLlp-types-container">
        {/* Left graphic */}
        <div className="ChangeLlp-types-illustration-wrap">
          <img
            src={typesIllustration}
            alt="Types of Private Limited Company"
            className="ChangeLlp-types-illustration"
          />
        </div>

        {/* Right content */}
        <div className="ChangeLlp-types-content">
          <h2 className="ChangeLlp-types-title">
            Types of Change in LLP Name
          </h2>

          {/* <p className="ChangeLlp-types-intro">
            Private Limited Companies can be registered in different forms based on ownership, liability, and business objectives. Choosing the right type helps ensure legal protection, smooth operations, and long-term growth.
          </p> */}

          {/* Type 1 */}
          <div className="ChangeLlp-types-block">
            <h3 className="ChangeLlp-types-subtitle">Voluntary Change:</h3>
            <p className="ChangeLlp-types-text">
              The partners may decide to change the LLP name for reasons such as rebranding, change in business activities, or business restructuring. This is done by passing a partner resolution and submitting the required forms to the Registrar.
            </p>
          </div>

          {/* Type 2 */}
          <div className="ChangeLlp-types-block">
            <h3 className="ChangeLlp-types-subtitle">Change as per Government Direction:</h3>
            <p className="ChangeLlp-types-text">
              The government may ask an LLP to change its name if it is too similar to another registered business or is considered inappropriate. In such cases, the LLP must apply for a new name within the given time.
            </p>
          </div>

          {/* Type 3 */}
          <div className="ChangeLlp-types-block">
            <h3 className="ChangeLlp-types-subtitle">Name Correction:</h3>
            <p className="ChangeLlp-types-text">
              If an LLP is registered with a name that matches or closely resembles another company or trademark, the Registrar can require the LLP to correct and update its name.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ChangeLlpTypes;
