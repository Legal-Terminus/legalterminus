import React from "react";
import "./AflDocuments.css";
import { FaBuilding, FaFileSignature, FaIdCard, FaBalanceScale, FaUsers, FaFileContract, FaStamp, FaHandshake } from "react-icons/fa";

const llpDocs = [
  {
    icon: <FaFileSignature />,
    title: "Incorporation & Agreement",
    note: "Core LLP records",
    items: [
      "Certificate of Incorporation of the LLP",
      "LLP Agreement & any supplementary agreements",
      "PAN of the LLP",
    ],
  },
  {
    icon: <FaBalanceScale />,
    title: "Financial Records",
    note: "For Form 8 & ITR-5",
    items: [
      "Statement of Account & Solvency details",
      "Books of accounts — assets, liabilities, income, expenditure",
      "Bank statements for the financial year",
    ],
  },
  {
    icon: <FaHandshake />,
    title: "Contribution Details",
    note: "For Form 11",
    items: [
      "Total contribution received by the LLP",
      "Partner-wise contribution & profit-sharing ratio",
      "Details of any changes during the year",
    ],
  },
];

const partnerDocs = [
  {
    icon: <FaIdCard />,
    title: "Partner Details & KYC",
    note: "For Form 11 & DIR-3 KYC",
    items: [
      "DPIN/DIN, PAN & Aadhaar of all partners",
      "Updated mobile & email of designated partners",
      "List of partners & designated partners",
    ],
  },
  {
    icon: <FaStamp />,
    title: "Digital Signatures (DSC)",
    note: "For MCA e-filing",
    items: [
      "Active DSC of designated partner(s)",
      "DSC / certification of practising professional",
    ],
  },
  {
    icon: <FaFileContract />,
    title: "Other Filing Details",
    note: "For audit & event-based forms",
    items: [
      "Tax audit report (if turnover/contribution threshold crossed)",
      "Details of changes in partners or contribution (Form 3 / Form 4)",
      "Previous year's filed forms & acknowledgements",
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

const AflDocuments = () => {
  return (
    <section className="opcd-section" id="documents">
      <div className="opcd-container">

        <div className="opcd-header">
          <h2 className="opcd-main-title">Documents Required for LLP Annual Filing</h2>
          <p className="opcd-main-subtitle">Get these ready and we'll take care of the rest</p>
        </div>

        <div className="opcd-columns">

          <div className="opcd-column">
            <div className="opcd-col-header">
              <div className="opcd-col-header-icon"><FaBuilding /></div>
              <div>
                <h3 className="opcd-col-title">LLP &amp; Financial Documents</h3>
                <p className="opcd-col-subtitle">Incorporation, accounts &amp; contribution</p>
              </div>
            </div>
            <div className="opcd-col-body">
              {llpDocs.map((doc, i) => (
                <DocItem key={i} doc={doc} />
              ))}
            </div>
          </div>

          <div className="opcd-column">
            <div className="opcd-col-header opcd-col-header--office">
              <div className="opcd-col-header-icon"><FaUsers /></div>
              <div>
                <h3 className="opcd-col-title">Partner, DSC &amp; Other Documents</h3>
                <p className="opcd-col-subtitle">KYC, signatures &amp; audit details</p>
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

export default AflDocuments;
