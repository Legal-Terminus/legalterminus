import React from "react";
import "./PtollpOverview.css";
import illustration from "../../assets/whypvt-imp1.svg";

const conversionPath = [
  {
    form: "Form RUN-LLP / FiLLiP Part A",
    purpose: "NAME RESERVATION for the LLP (typically ending with 'LLP')",
    window: "Before Form 17 + FiLLiP filing",
  },
  {
    form: "FORM 17",
    purpose: "APPLICATION + STATEMENT FOR CONVERSION of firm into LLP — with list of partners + consents + creditors + Statement of Accounts (not older than 30 days) + Partnership Deed",
    window: "Filed alongside Form FiLLiP",
  },
  {
    form: "FORM FiLLiP",
    purpose: "FORM FOR INCORPORATION OF LLP — PAN + TAN + designated partner details + LLP name + registered office + contribution structure",
    window: "Filed alongside Form 17",
  },
  {
    form: "CERTIFICATE OF INCORPORATION",
    purpose: "Issued by Registrar on approval of Form 17 + FiLLiP; LLP comes into legal existence; firm is DEEMED DISSOLVED + assets / liabilities AUTO-VEST in LLP",
    window: "Typically within 15–20 working days of filing",
  },
  {
    form: "FORM 14",
    purpose: "NOTICE TO REGISTRAR OF FIRMS about conversion + dissolution of the firm under the Indian Partnership Act, 1932",
    window: "Within 15 DAYS of CoI",
  },
  {
    form: "FORM 3",
    purpose: "LLP AGREEMENT FILING — sets out internal arrangements between partners (contribution, profit-share, decision rights, indemnification, dispute resolution etc.)",
    window: "Within 30 DAYS of CoI",
  },
];

const comparison = [
  { param: "Statutory Anchor", firm: "Indian Partnership Act, 1932", llp: "LLP Act, 2008" },
  { param: "Min Owners / Members", firm: "2 partners", llp: "2 designated partners" },
  { param: "Max Members", firm: "20 partners (10 for banking)", llp: "Unlimited partners" },
  { param: "Legal Identity", firm: "Limited; partners + firm intertwined", llp: "Separate legal person" },
  { param: "Liability", firm: "UNLIMITED + JOINT-SEVERAL", llp: "LIMITED to capital contribution" },
  { param: "Perpetual Succession", firm: "No — dissolves on partner exit / death", llp: "Yes — perpetual" },
  { param: "Income Tax", firm: "30% flat + surcharge + cess", llp: "30% flat + surcharge + cess (same)" },
  { param: "Audit Requirement", firm: "Only if T/O > tax-audit limit", llp: "T/O > ₹40 lakh OR contribution > ₹25 lakh" },
  { param: "Annual Return", firm: "Personal ITRs of partners + Firm ITR-5", llp: "Form 11 + Form 8 + ITR-5" },
  { param: "AGM Requirement", firm: "N/A", llp: "Not required" },
  { param: "External VC Funding", firm: "Difficult / uncommon", llp: "Difficult (VCs prefer Pvt Ltd)" },
  { param: "Internal Arrangements", firm: "Partnership Deed", llp: "LLP Agreement (Form 3)" },
  { param: "Compliance Cost", firm: "Low (₹5,000–15,000/year)", llp: "Moderate (₹15,000–25,000/year)" },
  { param: "Conversion Route", firm: "N/A", llp: "Form 17 + FiLLiP (Section 55 + Second Schedule)" },
];

const PtollpOverview = () => {
  return (
    <div className="opc-full-wrapper">

      <section className="opc-intro-section">
        <div className="opc-intro-container">
          <div className="opc-intro-illustration-wrap">
            <img
              src={illustration}
              alt="Partnership to LLP Conversion illustration"
              className="opc-intro-illustration"
            />
          </div>

          <div className="opc-intro-content">
            <h2 className="opc-intro-title">
              Why Convert a Partnership Firm into an LLP
            </h2>
            <p className="opc-intro-text">
              A Partnership Firm offers a simple business structure but comes with unlimited personal liability, meaning partners may be personally responsible for business debts and obligations. It also lacks a separate legal identity, which can create challenges in business continuity, expansion, and credibility.
              <br /><br />
              Converting a Partnership Firm into an LLP under the LLP Act, 2008 provides limited liability protection, separate legal status, perpetual succession, and simpler compliance requirements. Under Section 55 and the Second Schedule of the LLP Act, the conversion process is straightforward, with no newspaper publication or objection period. After conversion, all assets, liabilities, contracts, and business operations are transferred to the LLP, and the partnership firm is dissolved following the required filings.
            </p>
          </div>
        </div>
      </section>

      <section className="opc-urc-forms-section">
        <div className="opc-urc-forms-container">
          <h2 className="opc-urc-forms-title">
            Form 17 + Form FiLLiP + Form 14 + Form 3: The Section 55 Conversion Path
          </h2>
          <p className="opc-urc-forms-subtitle">
            Four forms drive the Partnership to LLP conversion — Form 17 (Application + Statement), Form FiLLiP (Incorporation), Form 14 (Registrar of Firms intimation), Form 3 (LLP Agreement). Here's what each does:
          </p>
          <div className="opc-urc-forms-table-wrapper">
            <table className="opc-urc-forms-table">
              <thead>
                <tr>
                  <th>Form</th>
                  <th>Purpose</th>
                  <th>Filing Window</th>
                </tr>
              </thead>
              <tbody>
                {conversionPath.map((row, i) => (
                  <tr key={i}>
                    <td className="opc-urc-forms-form">{row.form}</td>
                    <td>{row.purpose}</td>
                    <td>{row.window}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      <section className="opc-compare-section">
        <div className="opc-compare-container">
          <h2 className="opc-compare-title">Partnership Firm vs LLP — The Comparison</h2>
          <p className="opc-compare-subtitle">
            Here's how the two structures compare on the parameters that actually matter:
          </p>
          <div className="opc-compare-table-wrapper">
            <table className="opc-compare-table">
              <thead>
                <tr>
                  <th>Parameter</th>
                  <th>Partnership Firm</th>
                  <th>Limited Liability Partnership (LLP)</th>
                </tr>
              </thead>
              <tbody>
                {comparison.map((row, i) => (
                  <tr key={i}>
                    <td>{row.param}</td>
                    <td>{row.firm}</td>
                    <td>{row.llp}</td>
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

export default PtollpOverview;
