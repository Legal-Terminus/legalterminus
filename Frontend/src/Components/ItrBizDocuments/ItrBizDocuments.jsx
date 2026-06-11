import React from "react";
import "./ItrBizDocuments.css";
import { FaUser, FaBuilding, FaIdCard, FaUniversity, FaFileInvoiceDollar, FaBalanceScale, FaReceipt, FaPercent } from "react-icons/fa";

const kycDocs = [
  {
    icon: <FaIdCard />,
    title: "Identity & Registration",
    note: "Business owner / entity KYC",
    items: [
      "PAN & Aadhaar of proprietor / partners / directors",
      "Entity PAN (firm / LLP / company)",
      "Incorporation / partnership deed / registration proof",
    ],
  },
  {
    icon: <FaUniversity />,
    title: "Bank & GST Details",
    note: "For income & turnover verification",
    items: [
      "Business bank statements for the financial year",
      "GSTIN & GST returns (GSTR-1 / 3B / 9) if registered",
      "Cancelled cheque for refund credit",
    ],
  },
  {
    icon: <FaReceipt />,
    title: "Tax Credit Statements",
    note: "For TDS & income reconciliation",
    items: [
      "Form 26AS, AIS & TIS",
      "TDS certificates (Form 16A) from clients",
      "Advance tax / self-assessment tax challans",
    ],
  },
];

const financialDocs = [
  {
    icon: <FaBalanceScale />,
    title: "Financial Statements",
    note: "For ITR-3 / 5 / 6 (with books)",
    items: [
      "Profit & Loss statement and Balance Sheet",
      "Books of accounts / accounting software export",
      "Depreciation chart & fixed-asset register",
    ],
  },
  {
    icon: <FaFileInvoiceDollar />,
    title: "Income & Turnover Records",
    note: "For presumptive (ITR-4) or regular",
    items: [
      "Total turnover / gross receipts summary",
      "Sales & purchase registers",
      "Cash vs digital receipt break-up (for 44AD)",
    ],
  },
  {
    icon: <FaPercent />,
    title: "Deductions & Other Income",
    note: "To optimise tax liability",
    items: [
      "Chapter VI-A proofs (80C, 80D, 80G, etc.)",
      "Interest, capital gains & house-property income",
      "Partner remuneration / interest & loan details",
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

const ItrBizDocuments = () => {
  return (
    <section className="opcd-section" id="documents">
      <div className="opcd-container">

        <div className="opcd-header">
          <h2 className="opcd-main-title">Documents Required for Business ITR Filing</h2>
          <p className="opcd-main-subtitle">Get these ready and we'll take care of the rest</p>
        </div>

        <div className="opcd-columns">

          <div className="opcd-column">
            <div className="opcd-col-header">
              <div className="opcd-col-header-icon"><FaUser /></div>
              <div>
                <h3 className="opcd-col-title">KYC, Bank &amp; Tax-Credit Documents</h3>
                <p className="opcd-col-subtitle">Identity, GST &amp; TDS reconciliation</p>
              </div>
            </div>
            <div className="opcd-col-body">
              {kycDocs.map((doc, i) => (
                <DocItem key={i} doc={doc} />
              ))}
            </div>
          </div>

          <div className="opcd-column">
            <div className="opcd-col-header opcd-col-header--office">
              <div className="opcd-col-header-icon"><FaBuilding /></div>
              <div>
                <h3 className="opcd-col-title">Financial &amp; Income Documents</h3>
                <p className="opcd-col-subtitle">Accounts, turnover &amp; deductions</p>
              </div>
            </div>
            <div className="opcd-col-body">
              {financialDocs.map((doc, i) => (
                <DocItem key={i} doc={doc} />
              ))}
            </div>
          </div>

        </div>

      </div>
    </section>
  );
};

export default ItrBizDocuments;
