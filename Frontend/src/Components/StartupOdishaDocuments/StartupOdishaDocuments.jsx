import React from "react";
import "../CopyPvtDocument/CopyPvtDocument.css";
import { FaUser, FaBuilding, FaIdCard, FaFileAlt, FaShieldAlt, FaFileContract } from "react-icons/fa";

const entityDocs = [
  {
    icon: <FaBuilding />,
    title: "Entity Identity",
    note: "Mandatory — the entity must be legally incorporated",
    items: [
      "Certificate of Incorporation (Pvt Ltd) OR LLP Agreement OR Partnership Deed",
      "MOA, AOA, Startup India recognition certificate (if any), LOGO",
      "Entity PAN",
      "GSTIN (if registered)",
      "MSME / Udyam certificate (if any)",
    ],
  },
  {
    icon: <FaUser />,
    title: "Authorised Signatory Identity",
    note: "For the person signing the Startup Odisha application",
    items: [
      "Aadhaar of authorised signatory / founder",
      "PAN",
      "Photograph",
      "Designation letter / Board Resolution (where applicable)",
      "Email + mobile (used for portal registration)",
    ],
  },
  {
    icon: <FaFileAlt />,
    title: "Innovation Pitch & Business Plan",
    note: "The heart of the application — critical for recognition approval",
    items: [
      "Brief description of business (50–500 words)",
      "Innovation thesis (300–1000 words)",
      "Scalability framework",
      "Quantified employment / wealth creation impact for Odisha",
      "Sector tagging",
      "Pitch deck / business plan (PDF)",
    ],
  },
];

const founderDocs = [
  {
    icon: <FaIdCard />,
    title: "Odisha-Presence Proof",
    note: "At least one must be substantive",
    items: [
      "Registered office address proof in Odisha (electricity bill / rent agreement / property tax)",
      "OR operations evidence (Odisha bank account statement / Odisha team payroll / Odisha-based customer evidence)",
    ],
  },
  {
    icon: <FaShieldAlt />,
    title: "Supporting Evidence (Optional but Helpful)",
    note: "Strengthens the application — not mandatory",
    items: [
      "Patents filed / granted (any)",
      "Trademarks",
      "Awards / accelerator selections",
      "Customer testimonials",
      "Media coverage",
      "Government contracts / pilots",
      "NGO / academic / corporate partnerships",
      "Funding history (if raised)",
    ],
  },
  {
    icon: <FaFileContract />,
    title: "Authorisation",
    note: "For application filing and declaration",
    items: [
      "Authorisation letter for filing professional (us)",
      "Declaration confirming all submitted information is true",
      "No specific notarisation typically required - but Startup Cell can request it",
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
          <p className="cpvd-main-subtitle">Six categories. We send a personalised checklist after the discovery call. Document burden is moderate — the innovation pitch is the heart of the application.</p>
        </div>

        <div className="cpvd-columns">

          <div className="cpvd-column">
            <div className="cpvd-col-header">
              <div className="cpvd-col-header-icon"><FaBuilding /></div>
              <div>
                <h3 className="cpvd-col-title">Entity & Innovation Documents</h3>
                <p className="cpvd-col-subtitle">Required for the startup entity and application</p>
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
              <div className="cpvd-col-header-icon"><FaIdCard /></div>
              <div>
                <h3 className="cpvd-col-title">Presence, Evidence & Authorisation</h3>
                <p className="cpvd-col-subtitle">Odisha presence proof and supporting documents</p>
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
