import React from "react";
import "./PtollpElegibility.css";

const steps = [
  {
    title: "Discovery & Section 55 Eligibility Audit",
    day: "Day 0",
    text: "60-min call with our Company Secretary to confirm: Partnership Deed terms + registration status under Partnership Act 1932, all partners' identities + KYC, business activity, registered office, capital contribution + profit-sharing ratio of each partner, all-partners-must-be-LLP-partners compliance (no composition change), partner-to-designated-partner mapping, audited-accounts readiness, creditor list, current GST / FSSAI / Shop & Estd / Trade License / Udyam / Trademarks.",
  },
  {
    title: "Documents + Statement of Accounts Preparation",
    day: "Day 1–7",
    text: "Personalised checklist: each partner's PAN + Aadhaar + photograph + KYC + DSC, registered office proof + NOC, Statement of Accounts of the firm CA-certified (not older than 30 days from Form 17 filing — we coordinate CA work if not ready), Capital Account statement of each partner, list of creditors with consents, last 3 years' firm ITRs + GST returns, Partnership Deed (original + supplementary deeds), Firm Registration Certificate.",
  },
  {
    title: "DSC + DPIN + Name Reservation",
    day: "Day 7–9",
    text: "DSC procured for ALL designated partners (Class 3 Individual, 2-year). DPIN auto-applied via FiLLiP for designated partners (existing DINs / DPINs carry over). Form RUN-LLP filed (or via FiLLiP Part A) on the MCA portal with up to 2 proposed names ending with 'LLP'. MCA approval typically within this window.",
  },
  {
    title: "Form 17 + Form FiLLiP Drafting + Filing",
    day: "Day 9–11",
    text: "Form 17 (Conversion Application + Statement) + Form FiLLiP (LLP Incorporation) drafted with full annexures. Form 17 attachments: list of ALL partners + consents, Statement of Accounts (CA-certified), list of creditors with consents, declaration of solvency, affidavits, Partnership Deed, Firm Registration Certificate. Form FiLLiP attachments: registered office proof, designated partner KYC, contribution schedule. Both filed in parallel on the MCA portal.",
  },
  {
    title: "ROC Scrutiny + Query Reply",
    day: "Day 11–17",
    text: "The Registrar reviews the Form 17 + FiLLiP submission. Any queries / objections (typically: name conflict, Statement of Accounts adequacy, partner-composition match between firm and LLP, registered-office proof clarity) are addressed within 5 working days.",
  },
  {
    title: "Certificate of Incorporation as LLP Issuance",
    day: "Day 17–20",
    text: "On approval: Certificate of Incorporation issued under the LLP Act 2008 + LLPIN allocated + PAN + TAN auto-generated. By operation of the Second Schedule: firm DEEMED DISSOLVED + all assets / liabilities AUTO-VEST in the LLP.",
  },
  {
    title: "Form 14 (Within 15 Days) + Form 3 (Within 30 Days)",
    day: "Day 20–50",
    text: "Within 15 DAYS of CoI: Form 14 (Notice to Registrar of Firms) filed under the Indian Partnership Act 1932 — formal intimation of conversion + dissolution. Included in all plans. Within 30 DAYS of CoI: Form 3 (LLP Agreement) filed — Enriched + Supreme tiers (Elemental clients file themselves using our template).",
  },
  {
    title: "GST Migration + Bank + Licenses + 6-Month Compliance",
    day: "Day 20–90",
    text: "Enriched / Supreme: Firm's GSTIN cancelled (Form REG-16); LLP's GSTIN active via fresh REG-01. ITC carry-forward via Form ITC-02. Corporate bank account opened (Resolution + KYC + signatory mandate). Udyam / MSME migration. Supreme: Asset Transfer Agreement (where needed beyond auto-vesting), Shop & Estd / Trade License migration, 6-month statutory annual stack (Form 11 + Form 8 + ITR + audit support if applicable).",
  },
];

const PtollpElegibility = () => {
  return (
    <section className="opcelg-wrapper">
      <h2 className="opcelg-heading">
        Steps for Converting Partnership Firm into an LLP
      </h2>
      <p className="opcelg-subheading">
        Eight steps. End-to-end timeline: 15–20 working days for clean cases (much faster than the URC-1 route to a company which takes 35–50 days due to newspaper advertisement + objection window). Post-CoI: Form 14 within 15 days + Form 3 within 30 days.
      </p>

      <div className="opcelg-timeline">
        <div className="opcelg-timeline-line" />

        {steps.map((step, index) => (
          <div
            key={index}
            className={`opcelg-timeline-item ${index % 2 === 0 ? "left" : "right"} ${index === 0 ? "first" : ""} ${index === steps.length - 1 ? "last" : ""}`}
          >
            <div className="opcelg-timeline-dot">{index + 1}</div>

            <div className="opcelg-timeline-card">
              <h4>
                {step.title}
                {step.day && <span className="opcelg-day-tag">{step.day}</span>}
              </h4>
              <p>{step.text}</p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};

export default PtollpElegibility;
