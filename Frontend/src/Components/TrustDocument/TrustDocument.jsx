import React from "react";
import "./TrustDocument.css";
import { FaUser, FaBuilding, FaIdCard, FaFileAlt, FaFileContract, FaShieldAlt } from "react-icons/fa";

const leftDocs = [
  {
    icon: <FaUser />,
    title: "Settlor Identity (Author of the Trust)",
    note: "The person creating and transferring property to the Trust",
    items: [
      "Self-attested PAN card",
      "Aadhaar (mobile-linked)",
      "Voter ID / Driving Licence / Passport as second ID",
      "Passport-size photograph (jpeg, < 100 KB)",
      "Address proof (electricity bill / mobile bill <= 60 days)",
    ],
  },
  {
    icon: <FaIdCard />,
    title: "Trustees Identity (Minimum 2)",
    note: "For EACH trustee — PAN + Aadhaar + photo + address proof required",
    items: [
      "PAN + Aadhaar + photograph + address proof (per trustee)",
      "Designation (Managing Trustee / Trustee)",
      "Resident-trustee declaration (at least 1 trustee must be Indian resident)",
      "Trustee acceptance letter",
    ],
  },
  {
    icon: <FaFileAlt />,
    title: "Trust Object & Mission Details",
    note: "The heart of the application — critical for 12A acceptance",
    items: [
      "Brief description of trust purpose (charitable / educational / medical / religious / mixed)",
      "Object clause draft (we help)",
      "Activity plan for first 3 years",
      "Geographic scope of operations",
      "Target beneficiaries (specific or public)",
    ],
  },
];

const rightDocs = [
  {
    icon: <FaBuilding />,
    title: "Registered Office Proof",
    note: "Must be in the registration state (not multi-state)",
    items: [
      "Latest electricity / gas / municipal tax bill (<= 60 days old)",
      "NoC from property owner",
      "If rented: notarised rent agreement",
      "Photograph of registered office front-board",
    ],
  },
  {
    icon: <FaFileContract />,
    title: "Trust Deed + Stamp Paper",
    note: "We draft; you arrange stamp paper based on our denomination guidance",
    items: [
      "Custom Trust Deed (we draft)",
      "Stamp paper of correct denomination (state-specific)",
      "Signature pages for Settlor + Trustees + 2 Witnesses",
      "Notarisation slot booking",
    ],
  },
  {
    icon: <FaShieldAlt />,
    title: "Optional / Sector-Specific",
    note: "Not mandatory for all — strengthens the application",
    items: [
      "Trust property documents (if immovable property is being transferred to the Trust)",
      "Initial cash corpus declaration",
      "For educational trusts: prior teaching credentials",
      "For medical trusts: medical credentials",
      "For religious trusts: religious denomination + religious-object specifics",
    ],
  },
];

const DocItem = ({ doc }) => (
  <div className="trsd-doc-item">
    <div className="trsd-doc-item-top">
      <div className="trsd-doc-icon">{doc.icon}</div>
      <div className="trsd-doc-meta">
        <h4 className="trsd-doc-title">{doc.title}</h4>
        <span className="trsd-doc-note">{doc.note}</span>
      </div>
    </div>
    <ul className="trsd-doc-list">
      {doc.items.map((item, i) => (
        <li key={i} className="trsd-doc-list-item">{item}</li>
      ))}
    </ul>
  </div>
);

const TrustDocument = () => {
  return (
    <section className="trsd-section" id="documents">
      <div className="trsd-container">

        <div className="trsd-header">
          <h2 className="trsd-main-title">Documents Required for Trust Registration in India</h2>
          <p className="trsd-main-subtitle">Six categories. Per-person documents apply to Settlor + each Trustee. We send a personalised checklist after the discovery call.</p>
        </div>

        <div className="trsd-columns">

          <div className="trsd-column">
            <div className="trsd-col-header">
              <div className="trsd-col-header-icon"><FaUser /></div>
              <div>
                <h3 className="trsd-col-title">Settlor, Trustees & Object Documents</h3>
                <p className="trsd-col-subtitle">For each person and the trust mission</p>
              </div>
            </div>
            <div className="trsd-col-body">
              {leftDocs.map((doc, i) => (
                <DocItem key={i} doc={doc} />
              ))}
            </div>
          </div>

          <div className="trsd-column">
            <div className="trsd-col-header trsd-col-header--office">
              <div className="trsd-col-header-icon"><FaBuilding /></div>
              <div>
                <h3 className="trsd-col-title">Office, Deed & Sector-Specific Documents</h3>
                <p className="trsd-col-subtitle">Registered address, deed, and optional evidence</p>
              </div>
            </div>
            <div className="trsd-col-body">
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

export default TrustDocument;
