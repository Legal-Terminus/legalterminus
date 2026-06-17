import React from "react";
import "./LtopvtFeatures.css";

const types = [
  {
    number: "01",
    title: "Form URC-2 — Newspaper Advertisement",
    text: "MANDATORY notice published in TWO newspapers (one English + one vernacular language of the State / UT where the LLP's registered office is situated). Published AT LEAST 21 DAYS BEFORE filing URC-1. Invites objections from creditors / members / public. We draft URC-2 in compliant format, coordinate publication, and manage the 21-day objection window.",
  },
  {
    number: "02",
    title: "Form URC-1 — Conversion Application",
    text: "Application for registration of the LLP as a Pvt Ltd under Section 366 of the Companies Act, 2013. Filed on MCA portal with: audited statement of accounts (not older than 30 days, separate from Form 8), list of ALL partners + capital contribution + profit-sharing ratio (per LLP Agreement), list of creditors with consents, declaration of solvency, affidavits, URC-2 newspaper cuttings, LLP Agreement, LLPIN + LLP's CoI, proposed MOA + AOA. We curate the entire pack.",
  },
  {
    number: "03",
    title: "LLP Active-Status Verification + Catch-Up Filings",
    text: "Before URC-1 can be filed, the LLP must be ACTIVE on MCA — all Form 11 (Annual Return) + Form 8 (Statement of Account + Solvency) must be up-to-date for ALL preceding FYs. We audit your LLP filing history + file catch-up Form 11 / Form 8 (late-fee ₹100/day per form). LLPs with multi-year backlogs face ₹10,000+ catch-up cost before URC-1.",
  },
  {
    number: "04",
    title: "Capital Contribution → Share Capital Mapping",
    text: "Each partner's CAPITAL CONTRIBUTION (per LLP Agreement) is mapped to share allotment in the Pvt Ltd. Profit-sharing ratio per LLP Agreement + contribution amount drive final shareholding. We prepare the share-allotment schedule with cross-CA validation. Aligned mapping protects the interpretive Section 47(xiii) tax position.",
  },
  {
    number: "05",
    title: "SPICe+ Part A — Name Reservation",
    text: "Reserve up to 4 proposed names for the Pvt Ltd via SPICe+ Part A on the MCA portal. Approval typically in 1–2 days. Name must end with 'Private Limited'. We run a comprehensive search across MCA + TM database to avoid identical / similar / prohibited names + ensure trademark clean-up.",
  },
  {
    number: "06",
    title: "SPICe+ Part B + AGILE-PRO-S — Incorporation",
    text: "Combined incorporation form on MCA portal filed IN PARALLEL with URC-1. Covers PAN + TAN + AGILE-PRO-S (combined GST, EPFO, ESIC, Profession Tax, Bank Account application). MOA + AOA + Form INC-9 (Declaration by both directors + subscribers) attached. CIN issued under Section 367 on approval.",
  },
  {
    number: "07",
    title: "GST Migration",
    text: "LLP's GST cancellation (Form REG-16, citing 'transfer of business' as reason). Fresh GST registration under Pvt Ltd (Form REG-01, typically triggered via AGILE-PRO-S during SPICe+ filing). ITC carry-forward via Form ITC-02 (transfer of business). We handle the entire GST migration.",
  },
  {
    number: "08",
    title: "Trademark Assignment via Form TM-P",
    text: "LLP-held trademarks assigned to the Pvt Ltd via Form TM-P (Application for assignment) on the IP India portal. Maintains brand continuity + protects the Pvt Ltd's IP. Stamp duty on assignment deed at State actuals.",
  },
];

const LtopvtFeatures = () => {
  return (
    <section className="opc-features-section">
      <div className="opc-features-container">

        <h2 className="opc-features-title">Types of Converting LLP to a Pvt Ltd</h2>

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

export default LtopvtFeatures;
