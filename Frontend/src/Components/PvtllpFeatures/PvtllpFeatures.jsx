import React from "react";
import "./PvtllpFeatures.css";

const types = [
  {
    number: "01",
    title: "Pre-Conversion Eligibility Audit",
    text: "Two-pronged audit BEFORE Form 18: (a) THIRD SCHEDULE CHECK — no security interest on company assets (CHG-7 verification) + all-shareholders-become-LLP-partners (no composition change) — HARD eligibility; (b) SECTION 47(xiiib) CHECK — turnover ≤ ₹60 lakh AND assets ≤ ₹5 crore in each of 3 preceding years — SOFT eligibility (breach = legal conversion but with capital-gains tax). We give you a clear go / no-go BEFORE you commit to the conversion.",
  },
  {
    number: "02",
    title: "Board Resolution + Shareholders' Consent",
    text: "Board Meeting to approve conversion in principle, recommend Special Resolution to shareholders, fix EGM. EGM convened; Special Resolution passed (75% majority) approving conversion + altered structure. UNANIMOUS CONSENT of all shareholders required (per Third Schedule Para 1(b) — all shareholders become LLP partners). Minutes + resolutions drafted + signed.",
  },
  {
    number: "03",
    title: "Form RUN-LLP / FiLLiP Part A — Name Reservation",
    text: "Reserve up to 2 proposed names for the LLP via RUN-LLP or via FiLLiP Part A on the MCA portal. Name must end with 'LLP' or 'Limited Liability Partnership'. We run name-clearance against MCA + TM database. Typically approved in 1–2 days.",
  },
  {
    number: "04",
    title: "Form 18 — Conversion Application + Statement",
    text: "Application for conversion of the Private Limited Company into an LLP under Section 56 of the LLP Act, 2008. Filed on MCA portal alongside Form FiLLiP. Attachments: list of ALL shareholders with consents (verifying all become LLP partners), Statement of Accounts (CA-certified, not older than 30 days), list of creditors with consents / NOCs, Board Resolution + Special Resolution, Memorandum + Articles of Association, latest income-tax acknowledgement, charge-register verification (no subsisting security interest), declaration of solvency. We curate the entire pack.",
  },
  {
    number: "05",
    title: "Form FiLLiP — LLP Incorporation Form",
    text: "Form for Incorporation of LLP. Filed IN PARALLEL with Form 18. Covers: LLP name (from RUN-LLP), registered office, designated partner details (PAN, Aadhaar, DPIN, DSC), partner details (all shareholders as LLP partners), capital contribution amount + structure (proportionate to shareholding for Section 47(xiiib) compliance), business activity. PAN + TAN auto-generated. CoI issued on approval.",
  },
  {
    number: "06",
    title: "Form 14 — Notice to ROC",
    text: "Mandatory post-CoI filing per Clause 8 of the Third Schedule. WITHIN 15 DAYS of LLP registration, Form 14 is filed with the concerned REGISTRAR OF COMPANIES (ROC) to formally intimate the conversion + dissolution of the company. Without Form 14, the company continues on the ROC's records + accumulates compliance obligations. Included in all plans.",
  },
  {
    number: "07",
    title: "Form 3 — LLP Agreement Filing + Section 47(xiiib) Structuring",
    text: "Per Section 23 of LLP Act + Rule 21 of LLP Rules, the LLP Agreement is filed in Form 3 within 30 DAYS of CoI. CRITICAL FOR TAX-NEUTRALITY: drafted to reflect Section 47(xiiib) conditions — capital contribution + profit-sharing ratios in SAME PROPORTION as shareholding immediately before conversion + 5-year lock-in commitment + no accumulated-profit distribution for 3 years. Custom LLP Agreement in Enriched + Supreme.",
  },
  {
    number: "08",
    title: "GST Migration + 6-Month Annual Stack + 47(xiiib) Monitoring",
    text: "Supreme tier covers: Pvt Ltd's GSTIN cancellation (Form REG-16); fresh GSTIN under LLP (Form REG-01); ITC carry-forward (Form ITC-02). Asset Transfer Agreement (where needed beyond auto-vesting — e.g., immovable property, secured loan novation). FSSAI / Shop & Estd / Trade License / IEC / Udyam migration. Employee payroll transition. 6-month statutory annual stack (Form 11 + Form 8 + ITR + audit support). SECTION 47(xiiib) 5-year LOCK-IN MONITORING + quarterly compliance flags.",
  },
];

const PvtllpFeatures = () => {
  return (
    <section className="opc-features-section">
      <div className="opc-features-container">

        <h2 className="opc-features-title">Types of Converting Pvt Ltd into LLP</h2>

        <div className="opc-features-cards">
          {types.map((type) => (
            <div className="opc-features-card" key={type.number}>
              <div className="opc-features-number">{type.number}</div>
              <h3 className="opc-features-card-title">{type.title}</h3>
              <p className="opc-features-card-text">{type.text}</p>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
};

export default PvtllpFeatures;
