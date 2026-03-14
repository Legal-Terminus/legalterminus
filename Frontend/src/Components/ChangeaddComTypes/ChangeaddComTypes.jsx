import React from "react";
import "./ChangeaddComTypes.css";
import typesIllustration from "../../assets/pvtltd-types.png"


const ChangeaddComTypes= () => {
  return (
    <section className="Change-add-com-Types-types-section">
      <div className="Change-add-com-Types-types-container">
        {/* Left graphic */}
        <div className="Change-add-com-Types-types-illustration-wrap">
          <img
            src={typesIllustration}
            alt="Types of Private Limited Company"
            className="Change-add-com-Types-types-illustration"
          />
        </div>

        {/* Right content */}
        <div className="Change-add-com-Types-types-content">
          <h2 className="Change-add-com-Types-types-title">
            Types of Changing in Registered Office Address (Company)
          </h2>

          {/* <p className="Change-add-com-Types-types-intro">
            Private Limited Companies can be registered in different forms based on ownership, liability, and business objectives. Choosing the right type helps ensure legal protection, smooth operations, and long-term growth.
          </p> */}

          {/* Type 1 */}
          <div className="Change-add-com-Types-types-block">
            <h3 className="Change-add-com-Types-types-subtitle">Change Within the Same City, Town, or Village</h3>
            <p className="Change-add-com-Types-types-text">
              If the company shifts its registered office within the same city, town, or village, it must inform the Registrar of Companies (RoC) by filing Form INC-22 within 30 days of passing the Board Resolution.
            </p>
          </div>

          {/* Type 2 */}
          <div className="Change-add-com-Types-types-block">
            <h3 className="Change-add-com-Types-types-subtitle">Change Outside Local Limits but Within the Same State and Same RoC</h3>
            <p className="Change-add-com-Types-types-text">
              If the office is moved outside the city or local limits but remains within the same state and under the same RoC, the company must pass the required resolutions and file Form MGT-14 and INC-22 within the prescribed time.
            </p>
          </div>

          {/* Type 3 */}
          <div className="Change-add-com-Types-types-block">
            <h3 className="Change-add-com-Types-types-subtitle">Change of RoC Within the Same State</h3>
            <p className="Change-add-com-Types-types-text">
              If the company shifts its registered office to another RoC within the same state, approval from the Regional Director (RD) is required along with filing the necessary forms for approval and registration.
            </p>
          </div>

          {/* Type 4 */}
          <div className="Change-add-com-Types-types-block">
            <h3 className="Change-add-com-Types-types-subtitle">Change from One State to Another State</h3>
            <p className="Change-add-com-Types-types-text">
              If the company moves its registered office from one state to another, approval from the Regional Director is mandatory, and the Memorandum of Association (MOA) must also be amended before completing the filing process.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ChangeaddComTypes;
