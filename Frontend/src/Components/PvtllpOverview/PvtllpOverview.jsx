import React from "react";
import "./PvtllpOverview.css";
import illustration from "../../assets/whypvt-imp1.svg";

const conversionPath = [
  {
    form: "Form RUN-LLP / FiLLiP Part A",
    purpose: "NAME RESERVATION for the LLP (must end with 'LLP')",
    window: "Before Form 18 + FiLLiP filing",
  },
  {
    form: "FORM 18",
    purpose: "APPLICATION + STATEMENT FOR CONVERSION of private / unlisted public company into LLP. Attachments: list of shareholders + consents, Statement of Accounts (CA-certified, not older than 30 days), list of creditors with consents, declaration of solvency, Board + Shareholders' Resolutions, MoA + AoA, latest income-tax acknowledgement, charge-register verification",
    window: "Filed alongside Form FiLLiP",
  },
  {
    form: "FORM FiLLiP",
    purpose: "FORM FOR INCORPORATION OF LLP — designated partner details + LLP name + registered office + contribution structure (mapped to shareholding proportionately)",
    window: "Filed alongside Form 18",
  },
  {
    form: "CERTIFICATE OF INCORPORATION",
    purpose: "Issued by Registrar on approval of Form 18 + FiLLiP; LLP comes into legal existence; COMPANY is DEEMED DISSOLVED + assets / liabilities AUTO-VEST in LLP",
    window: "Typically within 15–20 working days of filing",
  },
  {
    form: "FORM 14",
    purpose: "NOTICE TO REGISTRAR OF COMPANIES (ROC) about conversion + dissolution of the company",
    window: "Within 15 DAYS of CoI",
  },
  {
    form: "FORM 3",
    purpose: "LLP AGREEMENT FILING — internal arrangements between partners (contribution, profit-share, decision rights, etc.); structured to satisfy Section 47(xiiib) conditions (same-proportion mapping + 5-year profit-share lock-in)",
    window: "Within 30 DAYS of CoI",
  },
];

const comparison = [
  { param: "Statutory Anchor", pvt: "Companies Act, 2013", llp: "LLP Act, 2008" },
  { param: "Min Owners / Members", pvt: "2 directors + 2 shareholders", llp: "2 designated partners" },
  { param: "Max Members", pvt: "200 shareholders", llp: "Unlimited partners" },
  { param: "Liability", pvt: "Limited to unpaid share capital", llp: "Limited to capital contribution" },
  { param: "Perpetual Succession", pvt: "Yes", llp: "Yes" },
  { param: "Income Tax", pvt: "22% (Section 115BAA) / 25.17% / 30%", llp: "30% flat + surcharge + cess" },
  { param: "AGM Requirement", pvt: "MANDATORY (Section 96)", llp: "Not required" },
  { param: "Statutory Audit", pvt: "Mandatory regardless of T/O", llp: "Only if T/O > ₹40 L OR contribution > ₹25 L" },
  { param: "Cash Flow Statement", pvt: "Mandatory", llp: "Not required" },
  { param: "Annual Return", pvt: "MGT-7 (full) + AOC-4 + Directors' Report", llp: "Form 11 + Form 8 (simpler)" },
  { param: "External VC Funding", pvt: "Yes (preferred)", llp: "Difficult / uncommon" },
  { param: "ESOPs / Sweat Equity", pvt: "Yes (Sec 62(1)(b), Sec 54)", llp: "Not permitted" },
  { param: "Share Classes / CCD / CCPS", pvt: "Yes (preference, convertible, etc.)", llp: "Not available" },
  { param: "Annual Compliance Cost", pvt: "₹40,000 – ₹1,00,000+", llp: "₹15,000 – ₹40,000" },
  { param: "Conversion Route", pvt: "N/A", llp: "Form 18 + FiLLiP (Section 56 + Third Schedule)" },
];

const PvtllpOverview = () => {
  return (
    <div className="opc-full-wrapper">

      <section className="opc-intro-section">
        <div className="opc-intro-container">
          <div className="opc-intro-illustration-wrap">
            <img
              src={illustration}
              alt="Private Limited to LLP Conversion illustration"
              className="opc-intro-illustration"
            />
          </div>

          <div className="opc-intro-content">
            <h2 className="opc-intro-title">
              Why Convert Private Limited Company into an LLP
            </h2>
            <p className="opc-intro-text">
              A Private Limited Company offers advantages for fundraising and growth but comes with higher compliance requirements such as audits, ROC filings, annual returns, and other corporate obligations. If your business no longer requires external investment, converting to an LLP can reduce compliance costs while retaining limited liability, separate legal identity, and perpetual succession. LLPs also have simpler compliance, with no mandatory AGM or board meetings and audits applicable only beyond prescribed limits.
              <br /><br />
              Private Limited Company to LLP Conversion is governed by Section 56 and the Third Schedule of the LLP Act, 2008 and is completed through Form 18 and FiLLiP filings on the MCA portal. The process enables the transfer of assets, liabilities, contracts, and business operations to the LLP and may qualify for tax benefits under Section 47(xiiib) of the Income-tax Act, subject to eligibility conditions.
            </p>
          </div>
        </div>
      </section>

      <section className="opc-urc-forms-section">
        <div className="opc-urc-forms-container">
          <h2 className="opc-urc-forms-title">
            Form 18 + Form FiLLiP + Form 14 + Form 3: The Section 56 Conversion Path
          </h2>
          <p className="opc-urc-forms-subtitle">
            Four forms drive the Pvt Ltd to LLP conversion. Here's what each does:
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
          <h2 className="opc-compare-title">Private Limited Company vs LLP — The Comparison</h2>
          <p className="opc-compare-subtitle">
            Here's how the two structures compare on the parameters that drive the conversion decision:
          </p>
          <div className="opc-compare-table-wrapper">
            <table className="opc-compare-table">
              <thead>
                <tr>
                  <th>Parameter</th>
                  <th>Private Limited Company</th>
                  <th>Limited Liability Partnership (LLP)</th>
                </tr>
              </thead>
              <tbody>
                {comparison.map((row, i) => (
                  <tr key={i}>
                    <td>{row.param}</td>
                    <td>{row.pvt}</td>
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

export default PvtllpOverview;
