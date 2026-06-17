import React from "react";
import "./PvtllpElegibility.css";

const steps = [
  {
    title: "Discovery & Two-Pronged Eligibility Audit (Section 56 + 47(xiiib))",
    day: "Day 0",
    text: "60-min call with our professional to verify: (a) THIRD SCHEDULE check — NO security interest on company assets (charge register / CHG-7), all shareholders willing to be LLP partners, all-shareholders-no-one-else compliance; (b) SECTION 47(xiiib) check — turnover ≤ ₹60 lakh AND assets ≤ ₹5 crore in each of 3 preceding years (for tax-neutral conversion). Plus: business activity, registered office, designated partner identification, current GST / FSSAI / Shop & Estd / Trade License / IEC / Udyam / Trademarks.",
  },
  {
    title: "Documents + Audited Statement Preparation",
    day: "Day 1–7",
    text: "Personalised checklist: each shareholder's PAN + Aadhaar + DSC, registered office proof, Statement of Accounts of the company CA-certified (not older than 30 days from Form 18 filing — we coordinate CA work if not ready), Capital + Shareholding statement, list of creditors with consents, last 3 years' company ITRs + audited financials + Form CHG-7 charge register, Memorandum + Articles of Association.",
  },
  {
    title: "Board Resolution + EGM + Special Resolution",
    day: "Day 7–30",
    text: "Board Meeting to approve conversion in principle + convene EGM. EGM Notice + Explanatory Statement (Section 102) issued to shareholders on 21-clear-day advance notice (or shorter consent). EGM held; SPECIAL RESOLUTION passed (75% majority of members present + voting) approving conversion + altered structure. UNANIMOUS consent of all shareholders captured. Minutes drafted.",
  },
  {
    title: "DSC + DPIN + Name Reservation",
    day: "Day 30–32",
    text: "DSC procured for designated partners (existing director DSCs may carry over via DPIN allotment). Form RUN-LLP filed (or via FiLLiP Part A) on the MCA portal with up to 2 proposed names ending with 'LLP'. MCA approval typically within this window.",
  },
  {
    title: "Form 18 + Form FiLLiP Drafting + Filing",
    day: "Day 32–34",
    text: "Form 18 (Conversion Application + Statement) + Form FiLLiP (LLP Incorporation) drafted with full annexures. Form 18 attachments: list of ALL shareholders + consents, Statement of Accounts (CA-certified), list of creditors with consents, declaration of solvency, Board + Special Resolutions, MoA + AoA, latest IT acknowledgement, CHG-7 charge register, Form CHG-1 satisfaction (if any charges existed + are now released), affidavits. Form FiLLiP attachments: registered office proof, designated partner KYC, contribution schedule (mapped to shareholding proportionately for Section 47(xiiib) compliance). Both filed in parallel on the MCA portal.",
  },
  {
    title: "ROC Scrutiny + Query Reply",
    day: "Day 34–40",
    text: "The Registrar reviews the Form 18 + FiLLiP submission. Any queries / objections (typically: name conflict, Statement of Accounts adequacy, shareholder-partner mapping mismatch, charge-register clarity, registered-office proof) are addressed within 5 working days.",
  },
  {
    title: "Certificate of Incorporation as LLP Issuance",
    day: "Day 40–45",
    text: "On approval: Certificate of Incorporation issued under the LLP Act 2008 + LLPIN allocated + PAN + TAN auto-generated. By operation of the Third Schedule: company DEEMED DISSOLVED + all assets / liabilities AUTO-VEST in the LLP.",
  },
  {
    title: "Form 14 (15 Days) + Form 3 (30 Days) + GST + Bank",
    day: "Day 45–100",
    text: "Within 15 DAYS of CoI: Form 14 (Notice to ROC) filed — formal intimation of conversion + dissolution. Included in all plans. Within 30 DAYS of CoI: Form 3 (LLP Agreement) filed. Post-CoI: Pvt Ltd's GSTIN cancelled (Form REG-16); LLP's GSTIN active via fresh REG-01; ITC carry-forward via Form ITC-02. Corporate bank account opened.",
  },
];

const PvtllpElegibility = () => {
  return (
    <section className="opcelg-wrapper">
      <h2 className="opcelg-heading">
        Steps for Converting Pvt Ltd into LLP
      </h2>
      <p className="opcelg-subheading">
        Eight steps. End-to-end timeline: 25–35 working days for clean cases (slightly longer than Partnership-to-LLP because of Board Meeting + EGM + Section 47(xiiib) audit + charge-register verification). Post-CoI: Form 14 within 15 days + Form 3 within 30 days.
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

export default PvtllpElegibility;
