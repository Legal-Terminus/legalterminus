import React from "react";
import "../ProFOPCTypes/ProFOPCTypes.css";
import typesIllustration from "../../assets/pvtltd-types.png";

const PvtTypes = () => {
  return (
    <section className="profopc-types-section">
      <div className="profopc-types-container">
        {/* Left graphic */}
        <div className="profopc-types-illustration-wrap">
          <img
            src={typesIllustration}
            alt="Types of Private Limited Company"
            className="profopc-types-illustration"
          />
        </div>

        {/* Right content */}
        <div className="profopc-types-content">
          <h2 className="profopc-types-title">
            Types of Private Limited Company You Can Convert Into
          </h2>

          <p className="profopc-types-intro">
            When you convert a Public Limited Company into a Private Limited Company, you can adopt the private structure that best fits your ownership and liability needs. The three recognised forms under the Companies Act, 2013 are explained below.
          </p>

          {/* Type 1 */}
          <div className="profopc-types-block">
            <h3 className="profopc-types-subtitle">Company limited by Shares</h3>
            <p className="profopc-types-text">
              The most common private company form. The liability of shareholders is limited to the unpaid amount on their shares — ideal for promoter-driven businesses that want to keep ownership closely held while protecting personal assets.
            </p>
          </div>

          {/* Type 2 */}
          <div className="profopc-types-block">
            <h3 className="profopc-types-subtitle">Company limited by Guarantee</h3>
            <p className="profopc-types-text">
              Members agree to contribute a fixed amount in the event of winding up. This form is generally suitable for not-for-profit or membership-based organisations that do not need share capital.
            </p>
          </div>

          {/* Type 3 */}
          <div className="profopc-types-block">
            <h3 className="profopc-types-subtitle">Unlimited Company</h3>
            <p className="profopc-types-text">
              An unlimited company places no limit on members’ liability, making them personally responsible for the company’s debts. It is less common and usually chosen by closely held businesses that want full control over operations.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default PvtTypes;
