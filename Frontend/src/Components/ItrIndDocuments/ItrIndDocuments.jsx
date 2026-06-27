import React from "react";
import "./ItrIndDocuments.css";
import { FaUser, FaUniversity, FaIdCard, FaWallet, FaFileInvoiceDollar, FaChartLine, FaHome, FaGlobe } from "react-icons/fa";

const identityDocs = [
  {
    icon: <FaIdCard />,
    title: "Identity + Tax Profile",
    text: "PAN + Aadhaar (linked) + Income Tax portal login credentials + bank account details (with IFSC) for refund + email + mobile (registered on portal). For NRIs / RNOR (Supreme+): passport + visa + days-in-India calendar for residential status determination + Tax Residency Certificate (TRC) if claiming DTAA benefit.",
  },
  {
    icon: <FaWallet />,
    title: "Income Tax Portal Pre-Filled Data",
    text: "FORM 26AS (Tax Credit Statement showing all TDS / TCS / advance tax credits) + AIS (Annual Information Statement showing share transactions, MF redemptions, dividends, property purchases / sales, large bank deposits, foreign remittances) + TIS (Taxpayer Information Summary). We download from portal + reconcile.",
  },
  {
    icon: <FaFileInvoiceDollar />,
    title: "Salary + Pension Documents",
    text: "FORM 16 (employer's TDS certificate from salary) + Salary slips for the FY + Provident Fund withdrawal statements (if any) + Gratuity / Leave Encashment (if received) + Pension certificates (for pensioners) + LIC annuity statements (if any) + ESOP / RSU exercise statements (for Plus tier).",
  },
];

const assetDocs = [
  {
    icon: <FaHome />,
    title: "House Property Documents",
    text: "Property purchase deed + Home loan interest certificate (Form 16B / provisional interest certificate from bank) + Rental income receipts (if let out) + Property tax paid receipts + Tenant agreement (if applicable) + Co-owner details (if jointly held). For multiple HPs: details for each property.",
  },
  {
    icon: <FaChartLine />,
    title: "Capital Gains + Investment Documents",
    text: "STOCK BROKER STATEMENT (Zerodha / Upstox / Groww / ICICI / HDFC etc.) showing trades + AVERAGE buy price + sell price + STT paid. MUTUAL FUND STATEMENTS (CAMS / KFin consolidated statement). PROPERTY SALE: sale deed + indexation working (if pre-Budget-2024 acquisition). Interest certificates from banks + post office.",
  },
  {
    icon: <FaGlobe />,
    title: "Foreign Assets + DTAA Documents",
    text: "For NRIs / Foreign Asset holders: passport + visa + Tax Residency Certificate (TRC) from foreign country + DTAA application support + Form 67 for Foreign Tax Credit + foreign bank statements + foreign property documents + foreign brokerage statements + foreign tax paid certificates. Schedule FA disclosure for resident with foreign holdings.",
  },
];

const DocItem = ({ doc }) => (
  <div className="opcd-doc-item">
    <div className="opcd-doc-item-top">
      <div className="opcd-doc-icon">{doc.icon}</div>
      <div className="opcd-doc-meta">
        <h4 className="opcd-doc-title">{doc.title}</h4>
      </div>
    </div>
    <p className="opcd-doc-text">{doc.text}</p>
  </div>
);

const ItrIndDocuments = () => {
  return (
    <section className="opcd-section" id="documents">
      <div className="opcd-container">

        <div className="opcd-header">
          <h2 className="opcd-main-title">Documents Required for ITR Filing for Individuals in India</h2>
          <p className="opcd-main-subtitle">Six categories. Documentation requirements vary by plan tier + income profile. Personalised checklist sent after plan confirmation.</p>
        </div>

        <div className="opcd-columns">

          <div className="opcd-column">
            <div className="opcd-col-header">
              <div className="opcd-col-header-icon"><FaUser /></div>
              <div>
                <h3 className="opcd-col-title">Identity, Income &amp; Tax-Credit Documents</h3>
                <p className="opcd-col-subtitle">Basics for every individual return</p>
              </div>
            </div>
            <div className="opcd-col-body">
              {identityDocs.map((doc, i) => (
                <DocItem key={i} doc={doc} />
              ))}
            </div>
          </div>

          <div className="opcd-column">
            <div className="opcd-col-header opcd-col-header--office">
              <div className="opcd-col-header-icon"><FaUniversity /></div>
              <div>
                <h3 className="opcd-col-title">Property, Capital Gains &amp; Foreign Asset Documents</h3>
                <p className="opcd-col-subtitle">For investments, property &amp; overseas holdings</p>
              </div>
            </div>
            <div className="opcd-col-body">
              {assetDocs.map((doc, i) => (
                <DocItem key={i} doc={doc} />
              ))}
            </div>
          </div>

        </div>

      </div>
    </section>
  );
};

export default ItrIndDocuments;
