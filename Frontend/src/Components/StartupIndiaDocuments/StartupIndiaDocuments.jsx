import React from "react";
import "../CopyPvtDocument/CopyPvtDocument.css";
import { FaUser, FaBuilding, FaIdCard, FaFileAlt, FaCamera, FaBolt, FaFileContract, FaShieldAlt } from "react-icons/fa";

const entityDocs = [
  {
    icon: <FaIdCard />,
    title: "Entity Registration Certificate",
    note: "Mandatory — the entity must be legally incorporated",
    items: [
      "Certificate of Incorporation (for Private Limited / OPC)",
      "LLP Agreement + Certificate of Incorporation (for LLP)",
      "Registered Partnership Deed (for Partnership Firm)",
    ],
  },
  {
    icon: <FaFileAlt />,
    title: "PAN & Tax Documents",
    note: "Entity PAN is mandatory",
    items: [
      "Entity PAN Card (mandatory)",
      "GSTIN Certificate (if registered — not mandatory for recognition)",
      "Udyam / MSME Certificate (if obtained — helps with category)",
    ],
  },
  {
    icon: <FaBolt />,
    title: "Innovation & Business Description",
    note: "The most critical document for recognition approval",
    items: [
      "Written description of the innovative product, process, or service",
      "Description of how the business is different from existing solutions",
      "Industry / sector classification (Technology / Non-Technology / Others)",
    ],
  },
];

const founderDocs = [
  {
    icon: <FaUser />,
    title: "Authorised Signatory Identity",
    note: "For the person signing the DPIIT application",
    items: [
      "Aadhaar Card of Authorised Signatory (Director / Designated Partner / Partner)",
      "PAN Card of Authorised Signatory",
      "Mobile number linked to Aadhaar (for OTP verification on portal)",
    ],
  },
  {
    icon: <FaCamera />,
    title: "Revenue & Funding Details",
    note: "Declared in the application — must not exceed ₹100 crore",
    items: [
      "Annual revenue / turnover of the entity (self-declared — audited P&L if available)",
      "Total funding raised to date (if any) — amount and funding stage",
    ],
  },
  {
    icon: <FaFileContract />,
    title: "IP & Other Optional Documents",
    note: "Strengthens the application — not mandatory but recommended",
    items: [
      "Patent filing receipt / patent application number (if any)",
      "Trademark registration certificate (if applicable)",
      "Awards, recognitions, or grant letters related to innovation (if applicable)",
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

const StartupIndiaDocuments = () => {
  return (
    <section className="cpvd-section">
      <div className="cpvd-container">

        <div className="cpvd-header">
          <h2 className="cpvd-main-title">Documents Required for Startup India (DPIIT) Recognition</h2>
          <p className="cpvd-main-subtitle">Get these ready and we'll handle the rest — all online, no physical submissions required</p>
        </div>

        <div className="cpvd-columns">

          <div className="cpvd-column">
            <div className="cpvd-col-header">
              <div className="cpvd-col-header-icon"><FaBuilding /></div>
              <div>
                <h3 className="cpvd-col-title">Entity Documents</h3>
                <p className="cpvd-col-subtitle">Required for the startup entity</p>
              </div>
            </div>
            <div className="cpvd-col-body">
              {entityDocs.map((doc, i) => (
                <DocItem key={i} doc={doc} />
              ))}
            </div>
          </div>

          <div className="cpvd-column">
            <div className="cpvd-col-header cpvd-col-header--office">
              <div className="cpvd-col-header-icon"><FaUser /></div>
              <div>
                <h3 className="cpvd-col-title">Founder / Signatory Documents</h3>
                <p className="cpvd-col-subtitle">Required for the authorised signatory and application details</p>
              </div>
            </div>
            <div className="cpvd-col-body">
              {founderDocs.map((doc, i) => (
                <DocItem key={i} doc={doc} />
              ))}
            </div>
          </div>

        </div>

      </div>
    </section>
  );
};

export default StartupIndiaDocuments;
