import React from "react";
import "./ItrIndDocuments.css";
import { FaUser, FaWallet, FaIdCard, FaUniversity, FaFileInvoiceDollar, FaChartLine, FaHome, FaPiggyBank } from "react-icons/fa";

const basicDocs = [
  {
    icon: <FaIdCard />,
    title: "Identity & Bank Details",
    note: "Required for every return",
    items: [
      "PAN card & Aadhaar card",
      "Bank account number & IFSC (for refund)",
      "Registered mobile & email for e-verification",
    ],
  },
  {
    icon: <FaFileInvoiceDollar />,
    title: "Salary & Income Proof",
    note: "For salaried taxpayers",
    items: [
      "Form 16 from employer(s)",
      "Salary slips / pension statement",
      "Form 16A for TDS on other income",
    ],
  },
  {
    icon: <FaWallet />,
    title: "Tax Credit Statements",
    note: "For income & TDS reconciliation",
    items: [
      "Form 26AS, AIS & TIS",
      "Advance tax / self-assessment challans",
      "Interest certificates (savings / FD / RD)",
    ],
  },
];

const otherDocs = [
  {
    icon: <FaChartLine />,
    title: "Capital Gains & Investments",
    note: "For ITR-2 / ITR-3 filers",
    items: [
      "Capital-gains statement (shares, MF, property)",
      "Demat / broker P&L statement, crypto (VDA) trades",
      "Purchase & sale deeds for property",
    ],
  },
  {
    icon: <FaHome />,
    title: "House Property & Loans",
    note: "For rental / home-loan claims",
    items: [
      "Rent receipts & tenant details (let-out property)",
      "Home-loan interest certificate (Section 24)",
      "Municipal tax paid receipts",
    ],
  },
  {
    icon: <FaPiggyBank />,
    title: "Deduction Proofs (Chapter VI-A)",
    note: "To reduce taxable income",
    items: [
      "80C — LIC, PPF, ELSS, tuition, principal repayment",
      "80D — health insurance premium",
      "80G, 80E, 80TTA/TTB & NPS (80CCD) proofs",
    ],
  },
];

const DocItem = ({ doc }) => (
  <div className="opcd-doc-item">
    <div className="opcd-doc-item-top">
      <div className="opcd-doc-icon">{doc.icon}</div>
      <div className="opcd-doc-meta">
        <h4 className="opcd-doc-title">{doc.title}</h4>
        <span className="opcd-doc-note">{doc.note}</span>
      </div>
    </div>
    <ul className="opcd-doc-list">
      {doc.items.map((item, i) => (
        <li key={i} className="opcd-doc-list-item">{item}</li>
      ))}
    </ul>
  </div>
);

const ItrIndDocuments = () => {
  return (
    <section className="opcd-section" id="documents">
      <div className="opcd-container">

        <div className="opcd-header">
          <h2 className="opcd-main-title">Documents Required for Individual ITR Filing</h2>
          <p className="opcd-main-subtitle">Get these ready and we'll take care of the rest</p>
        </div>

        <div className="opcd-columns">

          <div className="opcd-column">
            <div className="opcd-col-header">
              <div className="opcd-col-header-icon"><FaUser /></div>
              <div>
                <h3 className="opcd-col-title">Identity, Salary &amp; Tax-Credit Documents</h3>
                <p className="opcd-col-subtitle">Basics for every individual return</p>
              </div>
            </div>
            <div className="opcd-col-body">
              {basicDocs.map((doc, i) => (
                <DocItem key={i} doc={doc} />
              ))}
            </div>
          </div>

          <div className="opcd-column">
            <div className="opcd-col-header opcd-col-header--office">
              <div className="opcd-col-header-icon"><FaUniversity /></div>
              <div>
                <h3 className="opcd-col-title">Investment, Property &amp; Deduction Proofs</h3>
                <p className="opcd-col-subtitle">Capital gains, house property &amp; 80C/80D</p>
              </div>
            </div>
            <div className="opcd-col-body">
              {otherDocs.map((doc, i) => (
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
