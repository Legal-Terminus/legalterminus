import React from "react";
import "./PtoopcOverview.css";
import illustration from "../../assets/whypvt-imp1.svg";

const PtoopcOverview = () => {
  const urcForms = [
    {
      form: "URC-2",
      purpose: "PUBLIC NOTICE / NEWSPAPER ADVERTISEMENT",
      requirements: "Two newspapers (1 English + 1 vernacular) | At least 21 DAYS BEFORE URC-1 filing | Invites objections from creditors / members / public | Specifies intention to register as company under Section 366",
    },
    {
      form: "URC-1",
      purpose: "APPLICATION FOR CONVERSION AS A COMPANY",
      requirements: "Filed on MCA portal after URC-2 21-day window | Attaches audited statement of accounts (not older than 30 days), list of members + creditors, consents, declaration of solvency, affidavits, URC-2 newspaper cuttings, proposed MOA + AOA",
    },
    {
      form: "SPICe+ Part B",
      purpose: "INCORPORATION + PAN + TAN + AGILE-PRO-S",
      requirements: "Filed in PARALLEL with URC-1, covers PAN + TAN + GSTIN + EPFO + ESIC + Bank Account application",
    },
    {
      form: "Form INC-3",
      purpose: "NOMINEE CONSENT",
      requirements: "Mandatory for OPC - nominates becomes member on original member's death / incapacity",
    },
    {
      form: "Form INC-9",
      purpose: "DECLARATION",
      requirements: "Declaration by director + member confirming compliance with Companies Act",
    },
    {
      form: "Certificate of Incorporation (Sec 367)",
      purpose: "ISSUED BY ROC",
      requirements: "On approval, fresh CIN issued + PAN + TAN auto-generated + AGILE-PRO-S registrations triggered",
    },
  ];

  const comparison = [
    {
      parameter: "Statutory Anchor",
      proprietorship: "Unregistered, no Act",
      opc: "Companies Act 2013, Section 2(62)",
    },
    {
      parameter: "Legal Identity",
      proprietorship: "Proprietor/Member is the business",
      opc: "Separate legal person (distinct from member)",
    },
    {
      parameter: "Liability",
      proprietorship: "UNLIMITED - personal assets exposed",
      opc: "LIMITED to unpaid share capital",
    },
    {
      parameter: "Ownership",
      proprietorship: "100% with proprietor",
      opc: "100% with sole member",
    },
    {
      parameter: "Perpetual Succession",
      proprietorship: "Dies with proprietor",
      opc: "Continues - nominee inherits on death / incapacity",
    },
    {
      parameter: "Min Capital",
      proprietorship: "No minimum",
      opc: "No minimum (any amount works)",
    },
    {
      parameter: "Annual Compliance",
      proprietorship: "Personal ITR + GST returns",
      opc: "AOC-4 + MGT-7A (ITR + GST lighter than Pvt Ltd)",
    },
    {
      parameter: "AGM Requirement",
      proprietorship: "Not applicable",
      opc: "NOT MANDATORY for OPC (Section 96(1) carve-out)",
    },
    {
      parameter: "Statutory Audit",
      proprietorship: "Only if turnover > ITR audit limit",
      opc: "Mandatory if turnover > Rs 2 crore OR PUC > Rs 50 lakh",
    },
    {
      parameter: "Cash Flow Statement",
      proprietorship: "Not applicable",
      opc: "NOT MANDATORY for OPC",
    },
    {
      parameter: "Fundraising",
      proprietorship: "Limited to bank credit + personal loans",
      opc: "Bank credit + investor-ready + convertible debentures",
    },
    {
      parameter: "Conversion Route",
      proprietorship: "N/A - just open the business",
      opc: "URC-1 + URC-2 (Section 366) for existing proprietorship",
    },
  ];

  return (
    <div className="opc-full-wrapper">

      <section className="opc-why-convert-section">
        <div className="opc-why-convert-container">
          <h2 className="opc-why-convert-title">Why Convert Your Proprietorship to a OPC</h2>
          <p className="opc-why-convert-text">
            A Proprietorship is one of the simplest ways to start a business, but it has certain limitations as it grows. Since the owner and the business are legally the same, the proprietor is personally liable for all business debts and obligations. It can also be challenging to build credibility, raise funds, or ensure long-term business continuity.
          </p>
          <p className="opc-why-convert-text">
            Converting a Proprietorship into a One Person Company (OPC) provides the benefits of a separate legal entity and limited liability while allowing the founder to retain complete ownership and control. Recognized under the Companies Act, 2013, an OPC enhances business credibility, supports corporate banking and tender participation, and ensures better continuity. The conversion is completed through MCA filings, including URC-1 and SPICe+ forms, with recent legal amendments making OPC registration more flexible and founder-friendly.
          </p>
        </div>
      </section>

      <section className="opc-urc-forms-section">
        <div className="opc-urc-forms-container">
          <h2 className="opc-urc-forms-title">Form URC-1 + Form URC-2: The Section 366 Conversion Path</h2>
          <p className="opc-urc-forms-subtitle">
            Section 366 of the Companies Act, 2013 + the Companies (Authorised to Register) Rules, 2014 lay out the conversion path. Two forms drive the process - URC-1 (the application) and URC-2 (the newspaper notice). Here's what each does:
          </p>
          <div className="opc-urc-forms-table-wrapper">
            <table className="opc-urc-forms-table">
              <thead>
                <tr>
                  <th>Form</th>
                  <th>Purpose</th>
                  <th>Key Requirements</th>
                </tr>
              </thead>
              <tbody>
                {urcForms.map((item, i) => (
                  <tr key={i}>
                    <td className="opc-urc-forms-form">{item.form}</td>
                    <td>{item.purpose}</td>
                    <td>{item.requirements}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      <section className="opc-intro-section">
        <div className="opc-intro-container">
          <div className="opc-intro-illustration-wrap">
            <img
              src={illustration}
              alt="Proprietorship to OPC Conversion illustration"
              className="opc-intro-illustration"
            />
          </div>

          <div className="opc-intro-content">
            <h2 className="opc-intro-title">
              Why Convert a Proprietorship into an OPC
            </h2>
            <p className="opc-intro-text">
              A sole proprietorship is the simplest way to do business, but it has one big weakness — the proprietor and the business are legally the same person. Your personal assets are fully exposed to business debts, the business cannot raise equity, and it ends with you. A One Person Company (OPC), introduced by the Companies Act, 2013, was designed exactly for solo entrepreneurs who want the simplicity of running a business alone but with the protection of a corporate structure. You remain the single owner and decision-maker, while the company becomes a separate legal entity with limited liability.
              <br /><br />
              Because a proprietorship has no separate legal identity, the change is done by incorporating a fresh OPC and transferring the existing business — its assets, liabilities, and contracts — into the new company through a takeover agreement. You name a nominee who would step in if anything happens to you, and the proprietorship's registrations (GST, bank, licences) are migrated to the OPC. The result is the same business you've built, now ring-fenced behind limited liability, with perpetual succession and far better standing with banks, customers, and investors.
            </p>
          </div>
        </div>
      </section>

      <section className="opc-compare-section">
        <div className="opc-compare-container">
          <h2 className="opc-compare-title">Proprietorship vs One Person Company (OPC) - The Comparison</h2>
          <p className="opc-compare-subtitle">
            Here's how the two compare on the parameters that actually matter:
          </p>
          <div className="opc-compare-table-wrapper">
            <table className="opc-compare-table">
              <thead>
                <tr>
                  <th>Parameter</th>
                  <th>Proprietorship</th>
                  <th>One Person Company (OPC)</th>
                </tr>
              </thead>
              <tbody>
                {comparison.map((row, i) => (
                  <tr key={i}>
                    <td className="opc-compare-param"><strong>{row.parameter}</strong></td>
                    <td>{row.proprietorship}</td>
                    <td>{row.opc}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>

    </div>
  );
};

export default PtoopcOverview;
