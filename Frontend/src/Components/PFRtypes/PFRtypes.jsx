import React from "react";
import "./PFRtypes.css";
import typesIllustration from "../../assets/pvtltd-types.png"


const PvtTypes = () => {
  return (
    <section className="pfr-types-section">
      <div className="pfr-types-container">
        {/* Left graphic */}
        <div className="pfr-types-illustration-wrap">
          <img
            src={typesIllustration}
            alt="Types of Partnership Firm"
            className="pfr-types-illustration"
          />
        </div>

        {/* Right content */}
        <div className="pfr-types-content">
          <h2 className="pfr-types-title">
            Types of Partnership Firm Registration
          </h2>

          {/* Type 1 */}
          <div className="pfr-types-block">
            <h3 className="pfr-types-subtitle">Partnership at will</h3>
            <p className="pfr-types-text">
              A partnership at will is formed without deciding any fixed time period for the partnership. The partners can decide later when they want to continue or dissolve the firm. The profit earned is considered as income of each partner, and every partner is responsible for paying the firm's debts.
            </p>
          </div>

          {/* Type 2 */}
          <div className="pfr-types-block">
            <h3 className="pfr-types-subtitle">Particular partnership</h3>
            <p className="pfr-types-text">
              A particular partnership is created for a specific purpose or project and is usually temporary in nature. It may end after the work is completed or on a decided date, but partners can also extend it with mutual agreement. In this type of partnership, partners may have to use their personal money or assets to clear business liabilities.
            </p>
          </div>

          {/* Type 3 */}
          <div className="pfr-types-block">
            <h3 className="pfr-types-subtitle">Limited liability partnership</h3>
            <p className="pfr-types-text">
              A Limited Liability Partnership (LLP) is governed by the LLP Act, 2008 and works like a corporate business structure. In an LLP, partners have limited liability, meaning they are responsible only up to the amount they have invested in the business. Generally, partners are not legally required to use their personal assets to pay business debts.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default PvtTypes;
