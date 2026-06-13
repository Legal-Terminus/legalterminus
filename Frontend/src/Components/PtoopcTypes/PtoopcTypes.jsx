import React from "react";
import "../CopyPvtTypes/CopyPvtTypes.css";

const types = [
  {
    number: "01",
    title: "Form URC-2 - Newspaper Advertisement",
    subtitle: "All Plans",
    text: "MANDATORY notice published in TWO newspapers (one English + one vernacular language of the State / UT where the proprietorship is situated). Published AT LEAST 21 DAYS BEFORE filing URC-1. Invites objections from creditors / members / public. We draft the URC-2 text in compliant format, coordinate publication, and manage the 21-day objection window.",
  },
  {
    number: "02",
    title: "Form URC-1 - Conversion Application",
    subtitle: "All Plans",
    text: "Application for registration of the proprietorship as a company under Section 366 of the Companies Act, 2013. Filed on MCA portal with: audited statement of accounts (not older than 30 days), list of members / creditors with consents, declaration of solvency, affidavits, URC-2 newspaper cuttings, proposed MOA + AOA. We curate the entire documentation pack.",
  },
  {
    number: "03",
    title: "SPICe+ Part A - Name Reservation",
    subtitle: "All Plans",
    text: "Reserve up to 4 proposed names for the OPC via SPICe+ Part A on the MCA portal. Approval typically in 1-2 days. Name must end with '(OPC) Private Limited'. We run a comprehensive search across MCA + TM database to avoid identical / similar / prohibited names + ensure trademark clean-up.",
  },
  {
    number: "04",
    title: "SPICe+ Part B + AGILE-PRO-S - Incorporation",
    subtitle: "All Plans",
    text: "Combined incorporation form on MCA portal filed IN PARALLEL with URC-1. Covers PAN + TAN + AGILE-PRO-S (combined GST, EPFO, ESIC, Profession Tax, Bank Account application). MOA + AOA + INC-3 (Nominee Consent) + INC-9 (Declaration) attached. CIN issued under Section 367 on approval.",
  },
  {
    number: "05",
    title: "Form INC-3 - Nominee Consent",
    subtitle: "All Plans",
    text: "Mandatory under Section 3(1)(c) + Rule 3. Nominee must be Indian citizen + Indian resident + adult + must consent on Form INC-3. We co-draft the nominee declaration + secure the consent + file with SPICe+. Nominees can be changed later via Form INC-4.",
  },
  {
    number: "06",
    title: "GST Migration",
    subtitle: "Enriched / Supreme / Supreme Plus",
    text: "Proprietorship GST cancellation (Form REG-16, citing 'transfer of business' as reason). Fresh GST registration under OPC (Form REG-01, typically triggered via AGILE-PRO-S during SPICe+ filing). ITC carry-forward via Form ITC-02 (transfer of business).",
  },
  {
    number: "07",
    title: "Asset / Liability Transfer Agreement",
    subtitle: "Supreme / Supreme Plus",
    text: "Asset Transfer Agreement drafted for movables + fixed assets + intangibles + work-in-progress + receivables. Liabilities transferred subject to creditor consent (loan novation, vendor consent letters). Tax-efficient structuring per Section 47(xiv) / Section 49 of Income-tax Act (Supreme Plus includes structuring note).",
  },
  {
    number: "08",
    title: "Trademark Assignment via Form TM-P",
    subtitle: "Supreme Plus Only",
    text: "Proprietorship-held trademarks assigned to the OPC via Form TM-P (Application for assignment) on the IP India portal. Maintains brand continuity + protects the OPC's IP. Goodwill / without-goodwill structure advised based on business model. Stamp duty on assignment deeds at State actuals.",
  },
];

const PtoopcTypes = () => {
  return (
    <section className="cpvt-section">
      <div className="cpvt-container">

        <h2 className="cpvt-title">Types of Converting Proprietorship to an OPC</h2>

        <div className="cpvt-cards">
          {types.map((type) => (
            <div className="cpvt-card" key={type.number}>
              <div className="cpvt-number">{type.number}</div>
              <h3 className="cpvt-card-title">
                {type.title}
                {type.subtitle && (
                  <span className="cpvt-card-subtitle"> ({type.subtitle})</span>
                )}
              </h3>
              <p className="cpvt-card-text">{type.text}</p>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
};

export default PtoopcTypes;
