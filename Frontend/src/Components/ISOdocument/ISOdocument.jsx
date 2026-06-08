import React from "react";
import "../CopyPvtDocument/CopyPvtDocument.css";
import {
  FaBuilding,
  FaClipboardList,
  FaIdCard,
  FaBolt,
} from "react-icons/fa";

const leftDocs = [
  {
    icon: <FaBuilding />,
    title: "Business Registration Documents",
    note: "Legal existence of the organisation",
    items: [
      "Entity PAN card (mandatory)",
      "Certificate of Incorporation / Partnership Deed / Proprietorship proof",
      "GST Registration Certificate (if GST registered)",
      "MSME Udyam Certificate (if applicable)",
      "Scope of certification: description of products / services / processes",
    ],
  },
  {
    icon: <FaClipboardList />,
    title: "Management System Documents",
    note: "Specific to the ISO standard being applied for",
    items: [
      "Quality / Environmental / ISMS Manual",
      "Standard Operating Procedures (SOPs) & Work Instructions",
      "Process flow charts and risk assessment / treatment records",
      "Internal audit reports and corrective action records",
      "Management review meeting minutes",
    ],
  },
];

const rightDocs = [
  {
    icon: <FaIdCard />,
    title: "Applicant Identity & Signatory Proof",
    note: "Management representative / authorised signatory",
    items: [
      "Aadhaar and PAN of authorised signatory",
      "Passport-size photograph (jpeg format)",
      "Designation letter / Board Resolution authorising signatory",
      "Email ID + mobile number (OTP-linked)",
    ],
  },
  {
    icon: <FaBolt />,
    title: "Establishment Address Proof",
    note: "Office / factory / facility address — not older than 60 days",
    items: [
      "Latest electricity / gas / utility bill (≤ 60 days old)",
      "Owned premises: property tax receipt or sale deed",
      "Rented premises: registered rent agreement + landlord NoC",
      "Photograph of premises / facility for on-site audit",
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

const IsoInfographic = () => {
  return (
    <section className="cpvd-section">
      <div className="cpvd-container">
        <div className="cpvd-header">
          <h2 className="cpvd-main-title">
            Documents Required for ISO Certification in India
          </h2>
          <p className="cpvd-main-subtitle">
            Get these ready and we'll take care of the rest. We send a standard-specific personalised checklist after the gap analysis call.
          </p>
        </div>

        <div className="cpvd-columns">
          <div className="cpvd-column">
            <div className="cpvd-col-header">
              <div className="cpvd-col-header-icon"><FaBuilding /></div>
              <div>
                <h3 className="cpvd-col-title">Business &amp; Management System Documents</h3>
                <p className="cpvd-col-subtitle">Registration proof &amp; ISO-standard-specific documentation</p>
              </div>
            </div>
            <div className="cpvd-col-body">
              {leftDocs.map((doc, i) => (
                <DocItem key={i} doc={doc} />
              ))}
            </div>
          </div>

          <div className="cpvd-column">
            <div className="cpvd-col-header cpvd-col-header--office">
              <div className="cpvd-col-header-icon"><FaIdCard /></div>
              <div>
                <h3 className="cpvd-col-title">Applicant Identity &amp; Address Documents</h3>
                <p className="cpvd-col-subtitle">Signatory proof &amp; establishment address documents</p>
              </div>
            </div>
            <div className="cpvd-col-body">
              {rightDocs.map((doc, i) => (
                <DocItem key={i} doc={doc} />
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default IsoInfographic;
