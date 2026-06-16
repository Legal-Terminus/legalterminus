import React from "react";
import "./LtopvtOverview.css";
import illustration from "../../assets/whypvt-imp1.svg";

const conversionPath = [
  {
    form: "URC-2",
    purpose: "PUBLIC NOTICE / NEWSPAPER ADVERTISEMENT",
    requirements:
      "Two newspapers (1 English + 1 vernacular) | At least 21 DAYS BEFORE URC-1 filing | Invites objections from creditors / members / public | Specifies intention to register the LLP as Pvt Ltd under Section 366",
  },
  {
    form: "URC-1",
    purpose: "APPLICATION FOR REGISTRATION AS A COMPANY",
    requirements:
      "Filed on MCA portal after URC-2 21-day window | Attaches audited statement (not older than 30 days), list of all partners with capital contribution + profit-sharing ratio, list of creditors, unanimous consents, declaration of solvency, affidavits, URC-2 cuttings, LLP Agreement, LLPIN + CoI of LLP, proposed MOA + AOA",
  },
  {
    form: "SPICe+ Part B",
    purpose: "INCORPORATION + PAN + TAN + AGILE-PRO-S",
    requirements:
      "Filed in PARALLEL with URC-1; covers PAN + TAN + GSTIN + EPFO + ESIC + Bank Account application + partner-to-director / shareholder mapping; existing DPINs carry over as DINs",
  },
  {
    form: "Form INC-9",
    purpose: "DECLARATION",
    requirements:
      "Declaration by EACH partner-director + subscriber confirming compliance with Companies Act",
  },
  {
    form: "Certificate of Incorporation (Sec 367)",
    purpose: "ISSUED BY ROC",
    requirements:
      "On approval, fresh CIN issued + PAN + TAN auto-generated + AGILE-PRO-S registrations triggered",
  },
];

const comparison = [
  { param: "Statutory Anchor", llp: "LLP Act, 2008", pvt: "Companies Act, 2013" },
  { param: "Min Owners / Members", llp: "2 designated partners", pvt: "2 directors + 2 shareholders" },
  { param: "Max Members", llp: "Unlimited partners", pvt: "200 shareholders" },
  { param: "Legal Identity", llp: "Separate legal person", pvt: "Separate legal person" },
  { param: "Liability", llp: "LIMITED to capital contribution", pvt: "LIMITED to unpaid share capital" },
  { param: "Perpetual Succession", llp: "Yes", pvt: "Yes" },
  { param: "Income Tax", llp: "30% flat + surcharge + cess", pvt: "22% (Section 115BAA) / 25.17% / 30%" },
  { param: "AGM Requirement", llp: "Not applicable", pvt: "MANDATORY (Section 96)" },
  { param: "Statutory Audit", llp: "Only if T/O > ₹40 L or contribution > ₹25 L", pvt: "Mandatory regardless" },
  { param: "Cash Flow Statement", llp: "Not required", pvt: "Mandatory" },
  { param: "Annual Return", llp: "Form 11 + Form 8", pvt: "MGT-7 + AOC-4" },
  { param: "External VC Funding", llp: "Not feasible", pvt: "Yes (preferred)" },
  { param: "ESOPs / Sweat Equity", llp: "NOT permitted", pvt: "Yes (Sec 62(1)(b), Sec 54)" },
  { param: "Share Classes / CCD / CCPS", llp: "Not available", pvt: "Yes (Sec 42, 43, 62)" },
  { param: "DPIIT Startup India", llp: "Eligible", pvt: "Eligible (Section 80-IAC 3-year tax holiday)" },
  { param: "Conversion Route", llp: "N/A", pvt: "URC-1 + URC-2 (Section 366)" },
];

const LtopvtOverview = () => {
  return (
    <div className="opc-full-wrapper">

      <section className="opc-intro-section">
        <div className="opc-intro-container">
          <div className="opc-intro-illustration-wrap">
            <img
              src={illustration}
              alt="LLP to Private Limited Conversion illustration"
              className="opc-intro-illustration"
            />
          </div>

          <div className="opc-intro-content">
            <h2 className="opc-intro-title">
              Why Convert an LLP into a Pvt Ltd Company
            </h2>
            <p className="opc-intro-text">
              A Limited Liability Partnership (LLP) offers limited liability, flexible management, and simpler compliance, making it a popular choice for professionals and growing businesses. However, as the business expands, raising investment, issuing ESOPs, or attracting institutional investors can become difficult, as most investors and startup accelerators prefer the Private Limited Company structure for equity-based funding and long-term scalability.
              <br /><br />
              LLP to Pvt Ltd Company Conversion is carried out under Sections 366–374 of the Companies Act, 2013 through the URC-1 process. We manage the complete conversion, including partner approvals, document preparation, URC-1 and URC-2 filings, SPICe+ incorporation, and post-conversion compliance support. A Private Limited Company also provides stronger credibility, better fundraising opportunities, and eligibility for the concessional 22% corporate tax rate under Section 115BAA, subject to applicable conditions.
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
            Section 366 of the Companies Act, 2013 + the Companies (Authorised to Register) Rules, 2014 lay out the conversion path. Two forms drive the process — URC-1 (the application) and URC-2 (the newspaper notice). Here's what each does for an LLP:
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
          <h2 className="opc-compare-title">LLP vs Private Limited Company — The Comparison</h2>
          <p className="opc-compare-subtitle">
            Here's how the two compare on the parameters that actually matter:
          </p>
          <div className="opc-compare-table-wrapper">
            <table className="opc-compare-table">
              <thead>
                <tr>
                  <th>Parameter</th>
                  <th>LLP</th>
                  <th>Private Limited Company</th>
                </tr>
              </thead>
              <tbody>
                {comparison.map((row, i) => (
                  <tr key={i}>
                    <td>{row.param}</td>
                    <td>{row.llp}</td>
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

export default LtopvtOverview;
