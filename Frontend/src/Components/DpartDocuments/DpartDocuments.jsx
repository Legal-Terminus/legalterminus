import React from "react";
import "./DpartDocuments.css";
import { FaFileSignature, FaUsers, FaIdCard, FaBalanceScale, FaUniversity, FaFileContract, FaReceipt, FaHandshake } from "react-icons/fa";

const firmDocs = [
  {
    icon: <FaFileSignature />,
    title: "Firm Records",
    note: "Constitution of the firm",
    items: [
      "Original partnership deed & any amendments",
      "PAN of the partnership firm",
      "Registration certificate (if a registered firm)",
    ],
  },
  {
    icon: <FaBalanceScale />,
    title: "Financial Statements",
    note: "For settlement of accounts",
    items: [
      "Latest balance sheet & profit/loss account",
      "Partners' capital & current account balances",
      "List of assets, liabilities & outstanding loans",
    ],
  },
  {
    icon: <FaUniversity />,
    title: "Bank & Registrations",
    note: "To be closed / surrendered",
    items: [
      "Firm's bank account details",
      "GST, Udyam & Shops & Establishment certificates",
      "Any trade / industry-specific licences",
    ],
  },
];

const partnerDocs = [
  {
    icon: <FaIdCard />,
    title: "Partner KYC",
    note: "For all partners",
    items: [
      "PAN & Aadhaar of all partners",
      "Address proof of each partner",
      "Passport-size photographs (if required)",
    ],
  },
  {
    icon: <FaHandshake />,
    title: "Consent & Settlement",
    note: "Agreement to dissolve",
    items: [
      "Consent of all partners to the dissolution",
      "Agreed settlement of accounts / capital",
      "Notice of dissolution (for partnership at will)",
    ],
  },
  {
    icon: <FaReceipt />,
    title: "Other Records",
    note: "Supporting closure",
    items: [
      "Latest income tax return of the firm",
      "Details of any pending dues or contracts",
      "Records of goodwill / asset valuation (if any)",
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

const DpartDocuments = () => {
  return (
    <section className="opcd-section" id="documents">
      <div className="opcd-container">

        <div className="opcd-header">
          <h2 className="opcd-main-title">Documents Required to Dissolve a Partnership Firm</h2>
          <p className="opcd-main-subtitle">Get these ready and we'll take care of the rest</p>
        </div>

        <div className="opcd-columns">

          <div className="opcd-column">
            <div className="opcd-col-header">
              <div className="opcd-col-header-icon"><FaFileContract /></div>
              <div>
                <h3 className="opcd-col-title">Firm &amp; Financial Documents</h3>
                <p className="opcd-col-subtitle">Deed, accounts &amp; registrations</p>
              </div>
            </div>
            <div className="opcd-col-body">
              {firmDocs.map((doc, i) => (
                <DocItem key={i} doc={doc} />
              ))}
            </div>
          </div>

          <div className="opcd-column">
            <div className="opcd-col-header opcd-col-header--office">
              <div className="opcd-col-header-icon"><FaUsers /></div>
              <div>
                <h3 className="opcd-col-title">Partner &amp; Consent Documents</h3>
                <p className="opcd-col-subtitle">KYC, settlement &amp; consent</p>
              </div>
            </div>
            <div className="opcd-col-body">
              {partnerDocs.map((doc, i) => (
                <DocItem key={i} doc={doc} />
              ))}
            </div>
          </div>

        </div>

      </div>
    </section>
  );
};

export default DpartDocuments;
