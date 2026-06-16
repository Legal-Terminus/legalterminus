import React from "react";
import "./PtopvtOverview.css";
import illustration from "../../assets/whypvt-imp1.svg";

const conversionPath = [
  {
    form: "URC-2",
    purpose: "PUBLIC NOTICE / NEWSPAPER ADVERTISEMENT",
    requirements:
      "Two newspapers (1 English + 1 vernacular) | At least 21 DAYS BEFORE URC-1 filing | Invites objections from creditors / members / public | Specifies intention to register as Pvt Ltd under Section 366",
  },
  {
    form: "URC-1",
    purpose: "APPLICATION FOR REGISTRATION AS A COMPANY",
    requirements:
      "Filed on MCA portal after URC-2 21-day window | Attaches audited statement of accounts (not older than 30 days), list of members + creditors, consents, declaration of solvency, affidavits, URC-2 newspaper cuttings, proposed MOA + AOA",
  },
  {
    form: "SPICe+ Part B",
    purpose: "INCORPORATION + PAN + TAN + AGILE-PRO-S",
    requirements:
      "Filed in PARALLEL with URC-1; covers PAN + TAN + GSTIN + EPFO + ESIC + Bank Account application + min 2 directors + 2 subscribers",
  },
  {
    form: "Form INC-9",
    purpose: "DECLARATION",
    requirements:
      "Declaration by EACH director + subscriber confirming compliance with Companies Act",
  },
  {
    form: "Certificate of Incorporation (Sec 367)",
    purpose: "ISSUED BY ROC",
    requirements:
      "On approval, fresh CIN issued + PAN + TAN auto-generated + AGILE-PRO-S registrations triggered",
  },
];

const comparison = [
  { param: "Statutory Anchor", prop: "Unregistered; no Act", pvt: "Companies Act 2013" },
  { param: "Min Owners / Members", prop: "1 (proprietor)", pvt: "2 directors + 2 shareholders" },
  { param: "Max Members", prop: "1", pvt: "200 shareholders" },
  { param: "Legal Identity", prop: "Proprietor IS the business", pvt: "Separate legal person" },
  { param: "Liability", prop: "UNLIMITED — personal assets exposed", pvt: "LIMITED to unpaid share capital" },
  { param: "Perpetual Succession", prop: "Dies with proprietor", pvt: "Perpetual" },
  { param: "Income Tax", prop: "Slab rates (up to 30%)", pvt: "22% (Section 115BAA) / 25.17% / 30%" },
  { param: "AGM Requirement", prop: "Not applicable", pvt: "MANDATORY (Section 96)" },
  { param: "Statutory Audit", prop: "Only if T/O > ITR audit limit", pvt: "Mandatory regardless" },
  { param: "Cash Flow Statement", prop: "Not applicable", pvt: "Mandatory" },
  { param: "Annual Return", prop: "Personal ITR", pvt: "MGT-7 + AOC-4" },
  { param: "External VC Funding", prop: "Not feasible", pvt: "Yes (preferred)" },
  { param: "ESOPs / Sweat Equity", prop: "Not applicable", pvt: "Yes (Sec 62(1)(b), Sec 54)" },
  { param: "DPIIT Startup India", prop: "Not eligible", pvt: "Eligible (Section 80-IAC 3-year tax holiday)" },
  { param: "Conversion Route", prop: "N/A", pvt: "URC-1 + URC-2 (Section 366)" },
];

const PtopvtOverview = () => {
  return (
    <div className="opc-full-wrapper">

      <section className="opc-intro-section">
        <div className="opc-intro-container">
          <div className="opc-intro-illustration-wrap">
            <img
              src={illustration}
              alt="Proprietorship to Private Limited Conversion illustration"
              className="opc-intro-illustration"
            />
          </div>

          <div className="opc-intro-content">
            <h2 className="opc-intro-title">
              Why Convert Proprietorship to Pvt Ltd
            </h2>
            <p className="opc-intro-text">
              A Proprietorship is easy to start and manage, but as the business grows, it can create limitations. Since the owner and business are legally the same, personal assets remain exposed to business liabilities, while raising investment, building credibility, and transferring ownership can become challenging.
              <br /><br />
              Converting to a Private Limited Company under the Companies Act, 2013 provides a separate legal identity, limited liability protection, better credibility, easier fundraising, and long-term business continuity. We handle the complete conversion process through the MCA Section 366 route, including URC-1, URC-2 newspaper publication, SPICe+ filing, and support for GST, bank account, and license transitions.
            </p>
          </div>
        </div>
      </section>

      <section className="opc-urc-forms-section">
        <div className="opc-urc-forms-container">
          <h2 className="opc-urc-forms-title">
            Form URC-1 + Form URC-2: The Section 366 Conversion Path
          </h2>
          <p className="opc-urc-forms-subtitle">
            Section 366 of the Companies Act, 2013 + the Companies (Authorised to Register) Rules, 2014 lay out the conversion path. Two forms drive the process — URC-1 (the application) and URC-2 (the newspaper notice). Here's what each does:
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
                {conversionPath.map((row, i) => (
                  <tr key={i}>
                    <td className="opc-urc-forms-form">{row.form}</td>
                    <td>{row.purpose}</td>
                    <td>{row.requirements}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      <section className="opc-compare-section">
        <div className="opc-compare-container">
          <h2 className="opc-compare-title">Proprietorship vs Private Limited Company — The Comparison</h2>
          <p className="opc-compare-subtitle">
            Here's how the two compare on the parameters that actually matter:
          </p>
          <div className="opc-compare-table-wrapper">
            <table className="opc-compare-table">
              <thead>
                <tr>
                  <th>Parameter</th>
                  <th>Proprietorship</th>
                  <th>Private Limited Company</th>
                </tr>
              </thead>
              <tbody>
                {comparison.map((row, i) => (
                  <tr key={i}>
                    <td>{row.param}</td>
                    <td>{row.prop}</td>
                    <td>{row.pvt}</td>
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

export default PtopvtOverview;
