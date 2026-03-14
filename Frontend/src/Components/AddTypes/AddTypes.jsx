import React from "react";
import "./AddTypes.css";
import typesIllustration from "../../assets/pvtltd-types.png"


const AddTypes= () => {
  return (
    <section className="Add-typestypes-section">
      <div className="Add-typestypes-container">
        {/* Left graphic */}
        <div className="Add-typestypes-illustration-wrap">
          <img
            src={typesIllustration}
            alt="Types of Private Limited Company"
            className="Add-typestypes-illustration"
          />
        </div>

        {/* Right content */}
        <div className="Add-typestypes-content">
          <h2 className="Add-typestypes-title">
            Types of Add Or Remove A Director (Company)
          </h2>

          {/* <p className="Add-typestypes-intro">
            Private Limited Companies can be registered in different forms based on ownership, liability, and business objectives. Choosing the right type helps ensure legal protection, smooth operations, and long-term growth.
          </p> */}

          {/* Type 1 */}
          <div className="Add-typestypes-block">
            <h3 className="Add-typestypes-subtitle">Appointment of Additional Director</h3>
            <p className="Add-typestypes-text">
             The Board of Directors can appoint an additional director if the company’s rules allow it. This director holds the position until the next Annual General Meeting (AGM), where shareholders can approve them as a regular director.            </p>
          </div>

          {/* Type 2 */}
          <div className="Add-typestypes-block">
            <h3 className="Add-typestypes-subtitle">Appointment of Alternate Director</h3>
            <p className="Add-typestypes-text">
             If a director is outside India for more than three months, the Board can appoint another person to act on their behalf during that period.            </p>
          </div>

          {/* Type 3 */}
          <div className="Add-typestypes-block">
            <h3 className="Add-typestypes-subtitle">Appointment of Nominee Director</h3>
            <p className="Add-typestypes-text">
              A financial institution, investor, or stakeholder may appoint a nominee director to represent their interests on the company’s board.            </p>
          </div>

          {/* Type 4 */}
          <div className="Add-typestypes-block">
            <h3 className="Add-typestypes-subtitle">Regularization of Director</h3>
            <p className="Add-typestypes-text">
              An additional director appointed by the Board can be confirmed as a regular director after approval by the shareholders at the AGM.</p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default AddTypes;
