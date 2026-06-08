import React from "react";
import "../CopyPvtDocument/CopyPvtDocument.css";
import { FaUser, FaBuilding, FaIdCard, FaFileAlt, FaCamera, FaBolt, FaFileContract, FaShieldAlt } from "react-icons/fa";

const entityDocs = [
  {
    icon: <FaIdCard />,
    title: "Entity Registration Certificate",
    note: "Must show Odisha registered office address",
    items: [
      "Certificate of Incorporation with Odisha address (for Pvt Ltd / OPC)",
      "LLP Agreement + Certificate of Incorporation (for LLP)",
      "Registered Partnership Deed with Odisha address (for Partnership Firm)",
    ],
  },
  {
    icon: <FaFileAlt />,
    title: "PAN, GST & MSME Documents",
    note: "Entity PAN is mandatory",
    items: [
      "Entity PAN Card (mandatory)",
      "GSTIN Certificate (if registered)",
      "Udyam / MSME Certificate (if obtained)",
      "Shops & Establishment Certificate (if applicable)",
    ],
  },
  {
    icon: <FaBolt />,
    title: "Investment & Financial Details",
    note: "Required for capital subsidy eligibility",
    items: [
      "Fixed asset list with values (machinery, equipment, computers)",
      "Bank statements (last 3 months) showing capital investment",
      "Audited or provisional P&L and Balance Sheet (if available)",
    ],
  },
];

const founderDocs = [
  {
    icon: <FaUser />,
    title: "Authorised Signatory Identity",
    note: "For the person signing the Startup Odisha application",
    items: [
      "Aadhaar Card of Authorised Signatory (Director / Designated Partner / Partner)",
      "PAN Card of Authorised Signatory",
      "Mobile number linked to Aadhaar (for OTP verification on portal)",
    ],
  },
  {
    icon: <FaCamera />,
    title: "Business & Innovation Description",
    note: "Critical for recognition approval",
    items: [
      "Description of the innovative product, process, or service",
      "How the startup addresses a specific market or social problem",
      "Revenue model and target market description",
      "Employment details — current headcount and projected hiring",
    ],
  },
  {
    icon: <FaFileContract />,
    title: "Premises & Operations Documents",
    note: "Proof of Odisha-based operations",
    items: [
      "Registered office address proof (electricity bill / rent agreement / NOC from owner)",
      "Any incubation letter from STPI / IIT TBI / KIIT-TBI (if already incubated)",
      "IP filings or awards related to innovation (optional but strengthens application)",
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

const StartupOdishaDocuments = () => {
  return (
    <section className="cpvd-section">
      <div className="cpvd-container">

        <div className="cpvd-header">
          <h2 className="cpvd-main-title">Documents Required for Startup Odisha Registration</h2>
          <p className="cpvd-main-subtitle">Get these ready and we'll handle the rest — all online, no physical submissions required</p>
        </div>

        <div className="cpvd-columns">

          <div className="cpvd-column">
            <div className="cpvd-col-header">
              <div className="cpvd-col-header-icon"><FaBuilding /></div>
              <div>
                <h3 className="cpvd-col-title">Entity & Investment Documents</h3>
                <p className="cpvd-col-subtitle">Required for the startup entity and capital subsidy</p>
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
                <h3 className="cpvd-col-title">Founder & Operations Documents</h3>
                <p className="cpvd-col-subtitle">Required for signatory identity and business description</p>
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

export default StartupOdishaDocuments;
