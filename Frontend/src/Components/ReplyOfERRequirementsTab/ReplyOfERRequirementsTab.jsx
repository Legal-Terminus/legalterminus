import React from "react";
import "./ReplyOfERRequirementsTab.css";

const RequirementsPvt = () => {
  return (
    <section className="Replyof-ER-req-section">
      <div className="Replyof-ER-req-container">
        {/* Heading + intro */}
        <header className="Replyof-ER-req-header">
          <h2 className="Replyof-ER-req-title">
            Benefits of Reply to Examination Report Trademark
          </h2>
          <p className="Replyof-ER-req-subtitle">
            Filing a Reply to the Examination Report is essential to protect your trademark application from rejection or abandonment. A well-drafted reply helps overcome objections raised by the Trademark Registry, ensures legal compliance, and increases the chances of successful trademark registration.
          </p>
        </header>

        {/* Cards */}
        <div className="Replyof-ER-req-grid">
          {/* 1 */}
          <article className="Replyof-ER-req-card">
            <h3 className="Replyof-ER-req-card-title">Prevents Application Abandonment:</h3>
            <div className="Replyof-ER-req-card-underline" />
            <p className="Replyof-ER-req-card-text">
              If no reply is filed within 30 days, the trademark application can be marked as “abandoned.” Filing a proper reply keeps your application active.
            </p>
          </article>

          {/* 2 */}
          <article className="Replyof-ER-req-card">
            <h3 className="Replyof-ER-req-card-title">Helps Overcome Objections:</h3>
            <div className="Replyof-ER-req-card-underline" />
            <p className="Replyof-ER-req-card-text">
             It gives you an opportunity to explain and clear the objections raised by the examiner, such as issues related to distinctiveness (Section 9) or similarity with existing trademarks (Section 11).            </p>
          </article>

          {/* 3 */}
          <article className="Replyof-ER-req-card">
            <h3 className="Replyof-ER-req-card-title">
              Moves You Closer to Registration:
            </h3>
            <div className="Replyof-ER-req-card-underline" />
            <p className="Replyof-ER-req-card-text">
               If the reply is accepted, your trademark gets published in the Trademark Journal, which is an important step toward final registration and legal protection.            </p>
          </article>

          {/* 4 */}
          <article className="Replyof-ER-req-card">
            <h3 className="Replyof-ER-req-card-title">
              Proves Your Trademark is Unique:
            </h3>
            <div className="Replyof-ER-req-card-underline" />
            <p className="Replyof-ER-req-card-text">
              You can submit supporting documents and legal arguments to show that your trademark is different and distinguishable from others in the market.            </p>
          </article>
        </div>
      </div>
    </section>
  );
};

export default RequirementsPvt;
