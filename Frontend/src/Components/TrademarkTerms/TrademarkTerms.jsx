import React from "react";
import "../GSTRegTerms/GSTRegTerms.css";

const TERMS = [
  "Per-Application Engagement Model: Our Trademark Application Filing plans are per-application engagements (one engagement, one TM-A filing). The plan covers our work from name search through registration (subject to per-plan tier limits on departmental query / hearing / opposition coverage). Monthly status updates are included until registration certificate issuance OR application abandonment / refusal.",
  "Plan Eligibility (4 Tiers — per Trademark Scenario): (a) ELEMENTAL (₹1,499) — For PROPOSED-TO-BE-USED marks (where commercial use hasn't begun). (b) ENRICHED (₹2,499) — For PRIOR-USE marks (where commercial use has begun); adds User Affidavit + evidence coordination. (c) SUPREME (₹6,499) — Adds UDYAM update + departmental query handling (max 2 times). (d) SUPREME PLUS (₹14,999) — Adds Trademark Hearing (max 2 times) + Opposition handling (1 time). All plans include monthly status updates till registration. All plans cover up to 1 class application in one Brand name.",
  "Statutory Anchor: Trademark Applications are governed by the TRADE MARKS ACT, 1999 + TRADE MARKS RULES, 2017 + the Nice Classification of Goods and Services (10th–11th edition). Filed on the IP India online portal (https://ipindiaonline.gov.in) operated by the Trade Marks Registry under the Controller General of Patents, Designs and Trade Marks (CGPDTM), Ministry of Commerce & Industry.",
  "Government Fees (Per Class — Pass-Through at Actuals): TM-A filing fee per class (e-filing): ₹4,500 for Individual / DPIIT Startup / Udyam MSME applicants; ₹9,000 for Companies / LLPs / Partnerships (non-MSME). Per First Schedule of the Trade Marks Rules, 2017. NOTE: Physical filing rates exist in the Rules (₹500 higher) but PHYSICAL FILING IS ESSENTIALLY OBSOLETE in 2026 practice — we file ONLY via the IP India online portal (https://ipindiaonline.gov.in) which is the standard + faster + entitled to the 10% lower fee. MULTI-CLASS FILINGS ARE MULTIPLICATIVE — each additional class is a separate filing fee. Opposition: ₹2,700 per class. Renewal: ₹9,000 per class (₹4,500 with rebate). All government fees are NON-REFUNDABLE.",
  "GST on Our Fee: All quoted prices are exclusive of GST @ 18%, charged at checkout.",
  "Single-Class Default + Multi-Class Add-On: Each plan covers ONE CLASS application by default. Additional classes are billed at actual as per plan + GST per class (professional fee) + government fee per class (at actuals).",
  "Examination Report Handling (Supreme + Supreme Plus): The Examination Report is typically issued within 3–6 months of filing. Under Section 18 of the Trade Marks Act, the applicant has 30 DAYS to respond. Supreme tier covers MAX 2 DEPARTMENTAL QUERY RESPONSES (initial + follow-up). Additional query responses beyond 2 are billed at ₹2,999 per response.",
  "Hearing + Opposition (Supreme Plus): Trademark Hearing under Rule 41 is scheduled by the Registry where examination objections persist OR an opposition is contested. Supreme Plus covers MAX 2 HEARINGS. Opposition under Section 21 — we file Counter-Statement + coordinate through evidence-led hearing (1 OPPOSITION HANDLED per plan). Additional hearings / oppositions beyond plan limits are billed at ₹4,999 per hearing / ₹7,999 per additional opposition.",
  "User Affidavit + Evidence of Prior Use (Enriched onwards): For prior-use claims, we draft a User Affidavit (sworn statement) declaring the date-of-first-use of the mark in commerce + the goods / services covered. We coordinate evidence: invoices, advertisements, social media history, GST returns, website screenshots, third-party endorsements, packaging samples. Authenticity of evidence is the client's representation; we structure presentation.",
  "Outcome Disclosures: Trademark registration is at the discretion of the Registry + subject to publication in the Trade Marks Journal + 4-month opposition window post-publication. Typical timeline: 12–24 months for clean cases; 24–36+ months where objections / oppositions arise. WE DO NOT GUARANTEE registration outcome — the Registry's decision is final. We commit to professional handling within the plan's coverage scope. Refunds for application abandonment / refusal are not applicable since work was performed.",
  "Refund Policy: Full refund of professional fee (less ₹499 Name search / documentation handling) is available if the TM-A application is NOT FILED within 7 working days from receipt of all required documents + POA + government fee. Government fees already paid are non-refundable (Trade Marks Rules 2017 — First Schedule).",
  "Out-of-Scope Items: Trademark searches beyond IP India database (e.g., Madrid Protocol / international filings — separately quoted), International Trademark filing under Madrid Protocol (separate service), Trademark Renewals (Form TM-R — separate service after 10 years), Trademark Assignment / Transmission (Form TM-P), Trademark Rectification / Cancellation Petitions (separate quote), Appellate matters before IPAB / Tribunals / Courts, Customs Recordal (IP Customs Rules 2007), IP Watch services, Trademark Brand Audit, Geographical Indications (GI) registration, Patent or Copyright filings — all separately quoted.",
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
