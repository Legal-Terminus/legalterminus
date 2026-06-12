import React from "react";
import "./CacomDocuments.css";
import { FaBuilding, FaUsers, FaIdCard, FaBolt, FaFileContract, FaFileSignature, FaGavel, FaNewspaper } from "react-icons/fa";

const officeDocs = [
  {
    icon: <FaBolt />,
    title: "New Office Address Proof",
    note: "Not older than 2 months",
    items: [
      "Latest electricity / utility bill of the new office",
      "Water / gas bill or property tax receipt",
      "Premises clearly in the company's or owner's name",
    ],
  },
  {
    icon: <FaFileContract />,
    title: "Tenancy / Ownership Proof",
    note: "For the new registered office",
    items: [
      "Registered rent / lease agreement (if rented), or",
      "Sale deed / ownership document (if owned)",
      "No-Objection Certificate (NOC) from the owner",
    ],
  },
  {
    icon: <FaFileSignature />,
    title: "Company Records",
    note: "Existing constitution",
    items: [
      "Certificate of Incorporation & CIN",
      "MOA & AOA of the company",
      "PAN of the company",
    ],
  },
];

const approvalDocs = [
  {
    icon: <FaIdCard />,
    title: "Director KYC & DSC",
    note: "For filing the forms",
    items: [
      "PAN & Aadhaar of directors",
      "Active DIN & DSC of the signing director",
      "Updated contact details of directors",
    ],
  },
  {
    icon: <FaGavel />,
    title: "Resolutions",
    note: "Approving the change",
    items: [
      "Board resolution for the address change",
      "Special resolution & EGM notice (beyond local limits)",
      "Altered MOA clause (for a state change)",
    ],
  },
  {
    icon: <FaNewspaper />,
    title: "State-Change Documents",
    note: "Only for state-to-state move",
    items: [
      "Newspaper advertisement (Form INC-26)",
      "List of creditors & members",
      "Regional Director order (Form INC-28)",
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

const CacomDocuments = () => {
  return (
    <section className="opcd-section" id="documents">
      <div className="opcd-container">

        <div className="opcd-header">
          <h2 className="opcd-main-title">Documents Required to Change a Company's Registered Office</h2>
          <p className="opcd-main-subtitle">Get these ready and we'll take care of the rest</p>
        </div>

        <div className="opcd-columns">

          <div className="opcd-column">
            <div className="opcd-col-header">
              <div className="opcd-col-header-icon"><FaBuilding /></div>
              <div>
                <h3 className="opcd-col-title">New Office &amp; Company Documents</h3>
                <p className="opcd-col-subtitle">Address proof, tenancy &amp; records</p>
              </div>
            </div>
            <div className="opcd-col-body">
              {officeDocs.map((doc, i) => (
                <DocItem key={i} doc={doc} />
              ))}
            </div>
          </div>

          <div className="opcd-column">
            <div className="opcd-col-header opcd-col-header--office">
              <div className="opcd-col-header-icon"><FaUsers /></div>
              <div>
                <h3 className="opcd-col-title">Director &amp; Approval Documents</h3>
                <p className="opcd-col-subtitle">KYC, resolutions &amp; RD papers</p>
              </div>
            </div>
            <div className="opcd-col-body">
              {approvalDocs.map((doc, i) => (
                <DocItem key={i} doc={doc} />
              ))}
            </div>
          </div>

        </div>

      </div>
    </section>
  );
};

export default CacomDocuments;
