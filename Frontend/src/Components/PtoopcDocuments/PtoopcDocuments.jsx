import React from "react";
import "./PtoopcDocuments.css";
import { FaUser, FaUserShield, FaIdCard, FaBolt, FaFileContract, FaBuilding, FaBalanceScale, FaCamera } from "react-icons/fa";

const ownerDocs = [
  {
    icon: <FaIdCard />,
    title: "Proprietor (Member) KYC",
    note: "For the single member / director",
    items: [
      "PAN & Aadhaar of the proprietor",
      "Passport-size photograph",
      "Mobile number & email ID",
    ],
  },
  {
    icon: <FaUser />,
    title: "Identity & Address Proof",
    note: "Recent supporting documents",
    items: [
      "Voter ID / passport / driving licence",
      "Latest bank statement / utility bill (≤ 2 months)",
      "Specimen signature",
    ],
  },
  {
    icon: <FaBalanceScale />,
    title: "Proprietorship Records",
    note: "For the business takeover",
    items: [
      "Existing GST / Udyam / licence registrations",
      "Latest financials / list of assets & liabilities",
      "Bank account & ITR details of the proprietorship",
    ],
  },
];

const nomineeDocs = [
  {
    icon: <FaUserShield />,
    title: "Nominee Details & Consent",
    note: "Mandatory for every OPC (INC-3)",
    items: [
      "PAN & Aadhaar of the nominee",
      "Passport-size photograph & contact details",
      "Signed consent in Form INC-3",
    ],
  },
  {
    icon: <FaBuilding />,
    title: "Registered Office Proof",
    note: "Address of the OPC",
    items: [
      "Utility bill of the premises (≤ 2 months)",
      "Rent agreement (if rented)",
      "No-Objection Certificate from the owner",
    ],
  },
  {
    icon: <FaFileContract />,
    title: "Incorporation Documents",
    note: "Prepared & filed by us",
    items: [
      "MOA & AOA of the OPC",
      "Takeover / transfer agreement (proprietorship → OPC)",
      "Declarations & DSC of the proprietor",
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

const PtoopcDocuments = () => {
  return (
    <section className="opcd-section" id="documents">
      <div className="opcd-container">

        <div className="opcd-header">
          <h2 className="opcd-main-title">Documents Required to Convert Proprietorship to OPC</h2>
          <p className="opcd-main-subtitle">Get these ready and we'll take care of the rest</p>
        </div>

        <div className="opcd-columns">

          <div className="opcd-column">
            <div className="opcd-col-header">
              <div className="opcd-col-header-icon"><FaUser /></div>
              <div>
                <h3 className="opcd-col-title">Proprietor &amp; Business Documents</h3>
                <p className="opcd-col-subtitle">Member KYC &amp; proprietorship records</p>
              </div>
            </div>
            <div className="opcd-col-body">
              {ownerDocs.map((doc, i) => (
                <DocItem key={i} doc={doc} />
              ))}
            </div>
          </div>

          <div className="opcd-column">
            <div className="opcd-col-header opcd-col-header--office">
              <div className="opcd-col-header-icon"><FaUserShield /></div>
              <div>
                <h3 className="opcd-col-title">Nominee, Office &amp; Incorporation Docs</h3>
                <p className="opcd-col-subtitle">INC-3, address proof &amp; agreements</p>
              </div>
            </div>
            <div className="opcd-col-body">
              {nomineeDocs.map((doc, i) => (
                <DocItem key={i} doc={doc} />
              ))}
            </div>
          </div>

        </div>

      </div>
    </section>
  );
};

export default PtoopcDocuments;
