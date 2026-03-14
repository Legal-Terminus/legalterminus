import React from "react";
import "./PvtltdPvtTypes.css";
import typesIllustration from "../../assets/pvtltd-types.png"


const PvtTypes = () => {
  return (
    <section className="pvt-types-section">
      <div className="pvt-types-container">
        {/* Left graphic */}
        <div className="pvt-types-illustration-wrap">
          <img
            src={typesIllustration}
            alt="Types of Private Limited Company"
            className="pvt-types-illustration"
          />
        </div>

        {/* Right content */}
        <div className="pvt-types-content">
          <h2 className="pvt-types-title">
            Types of Private Limited Companies in India
          </h2>

          {/* <p className="pvt-types-intro">
            Private Limited Companies can be registered in different forms based on ownership, liability, and business objectives. Choosing the right type helps ensure legal protection, smooth operations, and long-term growth.
          </p> */}

          {/* Type 1 */}
          <div className="pvt-types-block">
            <h3 className="pvt-types-subtitle">Company Limited by Shares (Most Common)</h3>
            <p className="pvt-types-text">
              This is the go-to structure for startups and growth-stage businesses. Shareholders' liability is limited to the unpaid amount on their shares — so your personal bank account stays safe even if the business hits a rough patch. Perfect for raising capital from angel investors or VCs.
            </p>
          </div>

          {/* Type 2 */}
          <div className="pvt-types-block">
            <h3 className="pvt-types-subtitle">Company Limited by Guarantee</h3>
            <p className="pvt-types-text">
              Members commit to contributing a fixed amount in the event of winding up — but there's no share capital involved. Preferred by non-profit entities, trade associations, and charitable organisations that want corporate structure without the equity game.
            </p>
          </div>

          {/* Type 3 */}
          <div className="pvt-types-block">
            <h3 className="pvt-types-subtitle">Unlimited Company (Rare)</h3>
            <p className="pvt-types-text">
              No ceiling on members' liability — they're personally on the hook for the company's debts. This structure is rarely used and is typically chosen only by closely held businesses with complete control over operations and very specific financial goals.
            </p>
              <br></br>
            <p className="pvt-types-text">
              <strong>Note: For most founders and entrepreneurs, Company Limited by Shares is the right call. If you're unsure, Book a Free Consultation and we'll help you decide.</strong>
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default PvtTypes;
