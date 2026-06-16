import React from "react";
import "./PtpvtFeatures.css";

const types = [
  {
    number: "01",
    title: "Form URC-2 — Newspaper Advertisement",
    text: "MANDATORY notice published in TWO newspapers (one English + one vernacular language of the State / UT where the firm is situated). Published AT LEAST 21 DAYS BEFORE filing URC-1. Invites objections from creditors / members / public. We draft the URC-2 text in compliant format, coordinate publication, and manage the 21-day objection window.",
  },
  {
    number: "02",
    title: "Form URC-1 — Conversion Application",
    text: "Application for registration of the Partnership Firm as a Pvt Ltd Company under Section 366 of the Companies Act, 2013. Filed on MCA portal with: audited statement of accounts (not older than 30 days), list of ALL partners + capital accounts + profit-sharing ratio, list of creditors with consents, declaration of solvency, affidavits, URC-2 newspaper cuttings, Partnership Deed, proposed MOA + AOA. We curate the entire pack.",
  },
  {
    number: "03",
    title: "SPICe+ Part A — Name Reservation",
    text: "Reserve up to 4 proposed names for the Pvt Ltd via SPICe+ Part A on the MCA portal. Approval typically in 1–2 days. Name must end with 'Private Limited'. We run a comprehensive search across MCA + TM database to avoid identical / similar / prohibited names + ensure trademark clean-up.",
  },
  {
    number: "04",
    title: "SPICe+ Part B + AGILE-PRO-S — Incorporation",
    text: "Combined incorporation form on MCA portal filed IN PARALLEL with URC-1. Covers PAN + TAN + AGILE-PRO-S (combined GST, EPFO, ESIC, Profession Tax, Bank Account application). MOA + AOA + Form INC-9 (Declaration by both directors + subscribers) attached. CIN issued under Section 367 on approval.",
  },
  {
    number: "05",
    title: "Trademark Assignment via Form TM-P",
    text: "Firm-held trademarks assigned to the Pvt Ltd via Form TM-P (Application for assignment) on the IP India portal. Maintains brand continuity + protects the Pvt Ltd's IP. Goodwill / without-goodwill structure advised based on business model. Stamp duty on assignment deed at State actuals.",
  },
  {
    number: "06",
    title: "Asset / Liability Transfer Agreement + Partnership Dissolution Deed",
    text: "Asset Transfer Agreement drafted for movables + fixed assets + intangibles + work-in-progress + receivables. Liabilities transferred subject to creditor consent (loan novation, vendor consent letters). Tax-efficient structuring per Section 47(xiii). Partnership Dissolution Deed executed post-CoI to formally close the firm + settle inter-se accounts per Partnership Act 1932.",
  },
];

const PtpvtFeatures = () => {
  return (
    <section className="opc-features-section">
      <div className="opc-features-container">

        <h2 className="opc-features-title">Types of Converting Partnership Firm to a Pvt Ltd</h2>

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

export default PtpvtFeatures;
