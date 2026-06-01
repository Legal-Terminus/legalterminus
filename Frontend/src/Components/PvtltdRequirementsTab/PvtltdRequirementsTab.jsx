import React from "react";
import "./PvtltdRequirementsTab.css";

const RequirementsPvt = () => {
  return (
    <section className="req-section">
      <div className="req-container">
        {/* Heading + intro */}
        <header className="req-header">
          <h2 className="req-title">
            Benefits of Private Limited Company Registration in India
          </h2>
          <p className="req-subtitle">
            The registration process is managed by the Ministry of Corporate Affairs (MCA) through the SPICe+ integrated web form, which covers incorporation, PAN, TAN, GST, EPFO, ESIC, and bank account in one shot.
          </p>
        </header>

        {/* Cards */}
        <div className="req-grid">
          {/* 1 */}
          <article className="req-card">
            <h3 className="req-card-title">Discovery &amp; Structuring Call <span className="req-day-tag">Day 0</span></h3>
            <div className="req-card-underline" />
            <p className="req-card-text">
              60-min call with our CS to confirm: directors (min 2), shareholders (min 2), state of registered office, authorised + paid-up capital, primary business activity (NIC code), and tax-regime preference (115BAA vs default). We pre-screen 4 name options.
            </p>
          </article>

          {/* 2 */}
          <article className="req-card">
            <h3 className="req-card-title">Document Submission &amp; DSC Procurement <span className="req-day-tag">Day 1–3</span></h3>
            <div className="req-card-underline" />
            <p className="req-card-text">
              Share KYC documents and registered office address proof with us (as per checklist). This is your only job at the start — we handle everything from here. Class 3 Digital Signature Certificates issued to all directors and subscribers via Aadhaar e-KYC. Same-day for resident Indians; 3–5 days for NRIs / foreign nationals (apostille documents required).
            </p>
          </article>

          {/* 3 */}
          <article className="req-card">
            <h3 className="req-card-title">Company Name &amp; Objects Finalization</h3>
            <div className="req-card-underline" />
            <p className="req-card-text">
              We run a preliminary name availability check and help you finalize your company name and business objects (what your company will do). The name must comply with MCA naming guidelines and must not conflict with existing registered companies, LLPs, or trademarks.
            </p>
          </article>

          {/* 4 */}
          <article className="req-card">
            <h3 className="req-card-title">SPICe+ Part A — Name Reservation <span className="req-day-tag">Day 4–6</span></h3>
            <div className="req-card-underline" />
            <p className="req-card-text">
              Filed with 4 proposed names (in order of preference) ending with 'Private Limited' through MCA21 V3. CRC reviews under Rule 8 of the Companies (Incorporation) Rules. Approval: 2–3 working days typical. Reserved name valid for 20 days.
            </p>
          </article>

          {/* 5 */}
          <article className="req-card">
            <h3 className="req-card-title">MOA &amp; AOA Drafting <span className="req-day-tag">Day 4–7</span></h3>
            <div className="req-card-underline" />
            <p className="req-card-text">
              Memorandum of Association (object clause + capital + state) and Articles of Association (governance, share transfer, board powers, ESOP enablement, drag/tag, valuation, founder vesting) drafted. Two rounds of revision included.
            </p>
          </article>
        </div>
      </div>
    </section>
  );
};

export default RequirementsPvt;
