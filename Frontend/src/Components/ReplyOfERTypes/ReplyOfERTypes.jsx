import React from "react";
import "./ReplyOfERTypes.css";
import typesIllustration from "../../assets/pvtltd-types.png"


const PvtTypes = () => {
  return (
    <section className="Replyof-ERtypes-section">
      <div className="Replyof-ERtypes-container">
        {/* Left graphic */}
        <div className="Replyof-ERtypes-illustration-wrap">
          <img
            src={typesIllustration}
            alt="Types of Private Limited Company"
            className="Replyof-ERtypes-illustration"
          />
        </div>

        {/* Right content */}
        <div className="Replyof-ERtypes-content">
          <h2 className="Replyof-ERtypes-title">
            Types of Reply to Examination Report Trademark
          </h2>

          {/* <p className="Replyof-ERtypes-intro">
            Private Limited Companies can be registered in different forms based on ownership, liability, and business objectives. Choosing the right type helps ensure legal protection, smooth operations, and long-term growth.
          </p> */}

          {/* Type 1 */}
          <div className="Replyof-ERtypes-block">
            <h3 className="Replyof-ERtypes-subtitle">Reply to Absolute Grounds of Refusal (Section 9):</h3>
            <p className="Replyof-ERtypes-text">
              We explain that your trademark is unique, not just descriptive, and has gained recognition through use. We prove that it is not a common or generic term in your industry.            </p>
          </div>

          {/* Type 2 */}
          <div className="Replyof-ERtypes-block">
            <h3 className="Replyof-ERtypes-subtitle">Reply to Relative Grounds of Refusal (Section 11):</h3>
            <p className="Replyof-ERtypes-text">
               We clarify that your trademark is different from already registered marks. This may include showing differences in brand name, logo, or business category. If required, we can also submit a consent letter from the existing trademark owner.            </p>
          </div>

          {/* Type 3 */}
          <div className="Replyof-ERtypes-block">
            <h3 className="Replyof-ERtypes-subtitle">Reply to Formal or Procedural Objections:</h3>
            <p className="Replyof-ERtypes-text">
             We correct simple technical issues such as wrong trademark class, missing documents, insufficient fees, or missing Power of Attorney (TM-48).            </p>
          </div>
          
          {/* Type 4 */}
          <div className="Replyof-ERtypes-block">
            <h3 className="Replyof-ERtypes-subtitle">Reply with Evidence of Usage:</h3>
            <p className="Replyof-ERtypes-text">
             We submit proof showing that your trademark is already being used in the market. This may include invoices, advertisements, website details, social media presence, and an affidavit to support your claim.</p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default PvtTypes;
