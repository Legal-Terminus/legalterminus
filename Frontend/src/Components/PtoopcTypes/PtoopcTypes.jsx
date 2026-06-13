import React from "react";
import "./PtoopcTypes.css";

const PtoopcTypes = () => {
  const types = [
    {
      form: "Form URC-2 - Newspaper Advertisement",
      badge: "All Plans",
      description: "MANDATORY notice published in TWO newspapers (one English + one vernacular language of the State / UT where the proprietorship is situated). Published AT LEAST 21 DAYS BEFORE filing URC-1. Invites objections from creditors / members / public. We draft the URC-2 text in compliant format, coordinate publication, and manage the 21-day objection window.",
    },
    {
      form: "Form URC-1 - Conversion Application",
      badge: "All Plans",
      description: "Application for registration of the proprietorship as a company under Section 366 of the Companies Act, 2013. Filed on MCA portal with: audited statement of accounts (not older than 30 days), list of members / creditors with consents, declaration of solvency, affidavits, URC-2 newspaper cuttings, proposed MOA + AOA. We curate the entire documentation pack.",
    },
    {
      form: "SPICe+ Part A - Name Reservation",
      badge: "All Plans",
      description: "Reserve up to 4 proposed names for the OPC via SPICe+ Part A on the MCA portal. Approval typically in 1-2 days. Name must end with '(OPC) Private Limited'. We run a comprehensive search across MCA + TM database to avoid identical / similar / prohibited names + ensure trademark clean-up.",
    },
    {
      form: "SPICe+ Part B + AGILE-PRO-S - Incorporation",
      badge: "All Plans",
      description: "Combined incorporation form on MCA portal filed IN PARALLEL with URC-1. Covers PAN + TAN + AGILE-PRO-S (combined GST, EPFO, ESIC, Profession Tax, Bank Account application). MOA + AOA + INC-3 (Nominee Consent) + INC-9 (Declaration) attached. CIN issued under Section 367 on approval.",
    },
    {
      form: "Form INC-3 - Nominee Consent",
      badge: "All Plans",
      description: "Mandatory under Section 3(1)(c) + Rule 3. Nominee must be Indian citizen + Indian resident + adult + must consent on Form INC-3. We co-draft the nominee declaration + secure the consent + file with SPICe+. Nominees can be changed later via Form INC-4.",
    },
    {
      form: "GST Migration",
      badge: "Enriched / Supreme / Supreme Plus",
      description: "Proprietorship GST cancellation (Form REG-16, citing 'transfer of business' as reason). Fresh GST registration under OPC (Form REG-01, typically triggered via AGILE-PRO-S during SPICe+ filing). ITC carry-forward via Form ITC-02 (transfer of business).",
    },
    {
      form: "Asset / Liability Transfer Agreement",
      badge: "Supreme / Supreme Plus",
      description: "Asset Transfer Agreement drafted for movables + fixed assets + intangibles + work-in-progress + receivables. Liabilities transferred subject to creditor consent (loan novation, vendor consent letters). Tax-efficient structuring per Section 47(xiv) / Section 49 of Income-tax Act (Supreme Plus includes structuring note).",
    },
    {
      form: "Trademark Assignment via Form TM-P",
      badge: "Supreme Plus Only",
      description: "Proprietorship-held trademarks assigned to the OPC via Form TM-P (Application for assignment) on the IP India portal. Maintains brand continuity + protects the OPC's IP. Goodwill / without-goodwill structure advised based on business model. Stamp duty on assignment deeds at State actuals.",
    },
  ];

  return (
    <section className="opctypes-section">
      <div className="opctypes-container">
        <header className="opctypes-header">
          <h2 className="opctypes-title">Types of Converting Proprietorship to an OPC</h2>
        </header>

        <div className="opctypes-grid">
          {types.map((item, index) => (
            <article key={index} className="opctypes-card">
              <div className="opctypes-card-header">
                <h3 className="opctypes-card-title">{item.form}</h3>
                <span className="opctypes-badge">{item.badge}</span>
              </div>
              <p className="opctypes-card-description">{item.description}</p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
};

export default PtoopcTypes;
