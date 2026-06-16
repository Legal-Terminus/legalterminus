import React from "react";
import "./PtpvtOverview.css";
import illustration from "../../assets/whypvt-imp1.svg";

const conversionPath = [
  {
    form: "URC-2",
    purpose: "PUBLIC NOTICE / NEWSPAPER ADVERTISEMENT",
    requirements:
      "Two newspapers (1 English + 1 vernacular) | At least 21 DAYS BEFORE URC-1 filing | Invites objections from creditors / members / public | Specifies intention to register the firm as Pvt Ltd under Section 366",
  },
  {
    form: "URC-1",
    purpose: "APPLICATION FOR REGISTRATION AS A COMPANY",
    requirements:
      "Filed on MCA portal after URC-2 21-day window | Attaches audited statement (not older than 30 days), list of all partners with capital accounts + profit-sharing ratio, list of creditors, unanimous consents, declaration of solvency, affidavits, URC-2 newspaper cuttings, Partnership Deed, proposed MOA + AOA",
  },
  {
    form: "SPICe+ Part B",
    purpose: "INCORPORATION + PAN + TAN + AGILE-PRO-S",
    requirements:
      "Filed in PARALLEL with URC-1; covers PAN + TAN + GSTIN + EPFO + ESIC + Bank Account application + partner-to-director / shareholder mapping",
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
  {
    form: "Partnership Dissolution Deed",
    purpose: "POST-CoI DISSOLUTION OF FIRM",
    requirements:
      "Executed by all partners post-CoI to formally dissolve the partnership firm; Partnership Act 1932 + Partnership Deed terms apply",
  },
];

const comparison = [
  { param: "Statutory Anchor", firm: "Indian Partnership Act, 1932", pvt: "Companies Act 2013" },
  { param: "Min Owners / Members", firm: "2 partners", pvt: "2 directors + 2 shareholders" },
  { param: "Max Members", firm: "20 partners (10 for banking)", pvt: "200 shareholders" },
  { param: "Legal Identity", firm: "Limited; partners + firm intertwined", pvt: "Separate legal person" },
  { param: "Liability", firm: "UNLIMITED + JOINT-SEVERAL", pvt: "LIMITED to unpaid share capital" },
  { param: "Perpetual Succession", firm: "No — dissolves on partner exit / death", pvt: "Perpetual" },
  { param: "Income Tax", firm: "30% flat + surcharge + cess", pvt: "22% (Section 115BAA) / 25.17% / 30%" },
  { param: "AGM Requirement", firm: "Not applicable", pvt: "MANDATORY (Section 96)" },
  { param: "Statutory Audit", firm: "Only if T/O > tax-audit limit (₹1 Cr / ₹50 L)", pvt: "Mandatory regardless" },
  { param: "Cash Flow Statement", firm: "Not applicable", pvt: "Mandatory" },
  { param: "Annual Return", firm: "Personal ITRs of partners + Firm ITR-5", pvt: "MGT-7 + AOC-4 + ITR-6" },
  { param: "External VC Funding", firm: "Difficult / uncommon", pvt: "Yes (preferred)" },
  { param: "ESOPs / Sweat Equity", firm: "Not applicable", pvt: "Yes (Section 62(1)(b), Sec 54)" },
  { param: "DPIIT Startup India", firm: "Eligible", pvt: "Eligible (Section 80-IAC 3-year tax holiday)" },
  { param: "Conversion Route", firm: "N/A", pvt: "URC-1 + URC-2 (Section 366)" },
];

const PtpvtOverview = () => {
  return (
    <div className="opc-full-wrapper">

      <section className="opc-intro-section">
        <div className="opc-intro-container">
          <div className="opc-intro-illustration-wrap">
            <img
              src={illustration}
              alt="Partnership Firm to Private Limited Conversion illustration"
              className="opc-intro-illustration"
            />
          </div>

          <div className="opc-intro-content">
            <h2 className="opc-intro-title">
              Why Convert Partnership Firm to Pvt Ltd
            </h2>
            <p className="opc-intro-text">
              A Partnership Firm is a simple and flexible business structure for multiple partners, but as the business grows, it can present legal and operational challenges. Partners have unlimited personal liability for business obligations, and the firm lacks a separate legal identity, making ownership changes more complex.
              <br /><br />
              Converting a Partnership Firm into a Private Limited Company under the Companies Act, 2013 provides limited liability protection, a separate legal identity, perpetual succession, enhanced credibility, and better access to funding and growth opportunities. We manage the complete Section 366 conversion process, including URC-1 filing, URC-2 newspaper publication, and SPICe+ incorporation filing through the MCA portal.
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
          <h2 className="opc-compare-title">Partnership Firm vs Private Limited Company — The Comparison</h2>
          <p className="opc-compare-subtitle">
            Here's how the two compare on the parameters that actually matter:
          </p>
          <div className="opc-compare-table-wrapper">
            <table className="opc-compare-table">
              <thead>
                <tr>
                  <th>Parameter</th>
                  <th>Partnership Firm</th>
                  <th>Private Limited Company</th>
                </tr>
              </thead>
              <tbody>
                {comparison.map((row, i) => (
                  <tr key={i}>
                    <td>{row.param}</td>
                    <td>{row.firm}</td>
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

export default PtpvtOverview;
