import React from "react";
import "../GSTRegTerms/GSTRegTerms.css";

const TERMS = [
  "Our Trademark Application Filing plans are per-application engagements (one engagement, one TM-A filing), covering our work from name search through registration, subject to per-plan tier limits on departmental query / hearing / opposition coverage. Monthly status updates are included until the registration certificate is issued or the application is abandoned / refused.",
  "Plan eligibility (4 tiers): Elemental (₹1,499) for proposed-to-be-used marks; Enriched (₹2,499) for prior-use marks, adding User Affidavit + evidence coordination; Supreme (₹6,499) adds Udyam update + departmental query handling (max 2 times); Supreme Plus (₹14,999) adds Trademark Hearing (max 2 times) + Opposition handling (1 time). All plans include monthly status updates till registration and cover up to 1 class for one brand name.",
  "Trademark applications are governed by the Trade Marks Act, 1999, the Trade Marks Rules, 2017 and the Nice Classification of Goods and Services, and are filed on the IP India online portal operated by the Trade Marks Registry under the CGPDTM, Ministry of Commerce & Industry.",
  "Government fees are pass-through at actuals: TM-A e-filing fee per class is ₹4,500 for Individual / DPIIT Startup / Udyam MSME applicants and ₹9,000 for Companies / LLPs / Partnerships (non-MSME). Multi-class filings are multiplicative — each additional class is a separate filing fee. All government fees are non-refundable.",
  "All quoted prices are exclusive of GST @ 18%, charged at checkout on the professional fee.",
  "Each plan covers one class application by default. Additional classes are billed at the plan fee + GST per class (professional fee) plus the government fee per class (at actuals).",
  "Examination Report handling (Supreme + Supreme Plus): the Examination Report is typically issued within 3–6 months of filing, with 30 days to respond under Section 18. Supreme covers up to 2 departmental query responses; additional responses are billed at ₹2,999 each.",
  "Hearing + Opposition (Supreme Plus): covers up to 2 hearings before the Registry and 1 opposition handled (Counter-Statement under Section 21). Additional hearings / oppositions beyond plan limits are billed at ₹4,999 per hearing / ₹7,999 per additional opposition.",
  "For prior-use claims (Enriched onwards), we draft a User Affidavit declaring the date of first use and coordinate evidence (invoices, advertisements, social media, GST returns, website screenshots, packaging). Authenticity of evidence is the client's representation; we structure the presentation.",
  "Trademark registration is at the discretion of the Registry and subject to publication in the Trade Marks Journal with a 4-month opposition window. Typical timeline is 12–24 months for clean cases and 24–36+ months where objections / oppositions arise. We do not guarantee the registration outcome; the Registry's decision is final.",
  "Full refund of the professional fee (less ₹499 name-search / documentation handling) is available if the TM-A application is not filed within 7 working days from receipt of all required documents, POA and government fee. Government fees already paid are non-refundable.",
  "Out of scope (separately quoted): international filings under the Madrid Protocol, trademark renewals (Form TM-R), assignment / transmission (Form TM-P), rectification / cancellation petitions, appellate matters, customs recordal, IP watch services, brand audits, GI registration, and patent or copyright filings.",
];

const TrademarkTerms = () => {
  return (
    <section className="pvtltd-tc-section">
      <div className="pvtltd-tc-container">
        <div className="pvtltd-tc-card">

          <h2 className="pvtltd-tc-title">TERMS &amp; CONDITIONS</h2>

          <p className="pvtltd-tc-subtitle">
            By subscribing to any of the above plans, you agree to the following terms and
            conditions. Please read them carefully before proceeding.
          </p>

          <ol className="pvtltd-tc-list">
            {TERMS.map((t, i) => (
              <li className="pvtltd-tc-item" key={i}>
                {t}
              </li>
            ))}
          </ol>

        </div>
      </div>
    </section>
  );
};

export default TrademarkTerms;
