import React from "react";
import "../CopyPvtDocument/CopyPvtDocument.css";
import { FaUser, FaBuilding, FaIdCard, FaFileAlt, FaPen, FaBolt, FaFileContract, FaShieldAlt } from "react-icons/fa";

const employerDocs = [
  {
    icon: <FaIdCard />,
    title: "Owner / Director Identity",
    note: "Mandatory for all proprietors, directors, and partners",
    items: [
      "PAN Card of Proprietor / Directors / Partners (mandatory)",
      "Aadhaar Card of Proprietor / Directors / Partners",
      "Passport-size photograph of all authorized signatories",
    ],
  },
  {
    icon: <FaFileAlt />,
    title: "Address Proof (Per Person)",
    note: "Not older than 60 days from date of filing",
    items: [
      "Bank statement, gas bill, or mobile bill — not older than 60 days from filing date",
    ],
  },
  {
    icon: <FaPen />,
    title: "Digital Signature Certificate",
    note: "Required for online EPFO portal submission",
    items: [
      "Class 2 or Class 3 DSC of the authorized signatory for online EPFO portal filing",
    ],
  },
];

const establishmentDocs = [
  {
    icon: <FaBolt />,
    title: "Business Registration Proof",
    note: "Proof of the legal existence of the establishment",
    items: [
      "Certificate of Incorporation (for companies)",
      "Partnership Deed (for partnerships / LLPs)",
      "GST Registration Certificate (if registered)",
    ],
  },
  {
    icon: <FaFileContract />,
    title: "Business Address Proof",
    note: "Utility bill not older than 2 months, or rent agreement",
    items: [
      "Electricity Bill / Water Bill / Gas Bill (not older than 2 months)",
      "Rent Agreement (if business premises is rented)",
      "NOC from property owner (if applicable)",
    ],
  },
  {
    icon: <FaShieldAlt />,
    title: "Financial & Statutory Documents",
    note: "Bank account and entity-level tax documents",
    items: [
      "Cancelled Cheque or Bank Account Statement of the establishment",
      "Entity PAN Card",
      "Salary or wage register (if employees are already on payroll)",
    ],
  },
];

const DocItem = ({ doc }) => (
  <div className="cpvd-doc-item">
    <div className="cpvd-doc-item-top">
      <div className="cpvd-doc-icon">{doc.icon}</div>
      <div className="cpvd-doc-meta">
        <h4 className="cpvd-doc-title">{doc.title}</h4>
        <span className="cpvd-doc-note">{doc.note}</span>
      </div>
    </div>
    <ul className="cpvd-doc-list">
      {doc.items.map((item, i) => (
        <li key={i} className="cpvd-doc-list-item">{item}</li>
      ))}
    </ul>
  </div>
);

const EPFRegDocuments = () => {
  return (
    <section className="cpvd-section">
      <div className="cpvd-container">

        <div className="cpvd-header">
          <h2 className="cpvd-main-title">Documents Required for EPF Registration in India</h2>
          <p className="cpvd-main-subtitle">Get these ready and we'll take care of the rest</p>
        </div>

        <div className="cpvd-columns">

          <div className="cpvd-column">
            <div className="cpvd-col-header">
              <div className="cpvd-col-header-icon"><FaUser /></div>
              <div>
                <h3 className="cpvd-col-title">Employer / Owner Documents</h3>
                <p className="cpvd-col-subtitle">Required for each proprietor, director & partner</p>
              </div>
            </div>
            <div className="cpvd-col-body">
              {employerDocs.map((doc, i) => (
                <DocItem key={i} doc={doc} />
              ))}
            </div>
          </div>

          <div className="cpvd-column">
            <div className="cpvd-col-header cpvd-col-header--office">
              <div className="cpvd-col-header-icon"><FaBuilding /></div>
              <div>
                <h3 className="cpvd-col-title">Establishment Documents</h3>
                <p className="cpvd-col-subtitle">Required for the registered business entity</p>
              </div>
            </div>
            <div className="cpvd-col-body">
              {establishmentDocs.map((doc, i) => (
                <DocItem key={i} doc={doc} />
              ))}
            </div>
          </div>

        </div>

      </div>
    </section>
  );
};

export default EPFRegDocuments;
