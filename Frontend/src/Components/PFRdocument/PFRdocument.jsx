import React from "react";
import "./PFRdocument.css";
import {
  FaUser, FaBuilding, FaIdCard, FaFileAlt,
  FaBolt, FaFileContract, FaShieldAlt,
} from "react-icons/fa";

const partnerDocs = [
  {
    icon: <FaIdCard />,
    title: "Partner Identity",
    note: "Mandatory for all proposed partners",
    items: [
      "Self-attested PAN card of each partner",
      "Self-attested Aadhaar card of each partner",
      "Passport-size photograph of each partner",
      "For NRI / foreign partner: notarised + apostilled passport copy",
    ],
  },
  {
    icon: <FaFileAlt />,
    title: "Partnership Deed",
    note: "Drafted by us",
    items: [
      "Printed on stamp paper of correct denomination",
      "Signed by all partners + two witnesses",
      "Notarised",
      "The Deed is the firm's constitution — every clause matters",
    ],
  },
];

const firmDocs = [
  {
    icon: <FaBolt />,
    title: "Firm's Registered Office Proof",
    note: "Not older than 60 days",
    items: [
      "Latest electricity / Municipal tax bill (≤ 60 days old)",
      "NoC from the property owner",
      "If rented: notarised rent agreement",
      "If co-working: service agreement + operator NoC",
      "Photograph of office front-board (some states require)",
    ],
  },
  {
    icon: <FaShieldAlt />,
    title: "RoF Form 1 + Affidavit (Registered Firms Only)",
    note: "Required for RoF registration",
    items: [
      "Application for Registration in Form 1 (state-specific format)",
      "Affidavit on stamp paper certifying all particulars in the Deed are correct",
      "Signed by all partners or authorized agent",
    ],
  },
];

const DocItem = ({ doc }) => (
  <div className="pfrd-doc-item">
    <div className="pfrd-doc-item-top">
      <div className="pfrd-doc-icon">{doc.icon}</div>
      <div className="pfrd-doc-meta">
        <h4 className="pfrd-doc-title">{doc.title}</h4>
        <span className="pfrd-doc-note">{doc.note}</span>
      </div>
    </div>
    <ul className="pfrd-doc-list">
      {doc.items.map((item, i) => (
        <li key={i} className="pfrd-doc-list-item">{item}</li>
      ))}
    </ul>
  </div>
);

const PFRdocument = () => {
  return (
    <section className="pfrd-section">
      <div className="pfrd-container">

        {/* Header */}
        <div className="pfrd-header">
          <h2 className="pfrd-main-title">Documents Required for Partnership Firm Registration in India</h2>
          <p className="pfrd-main-subtitle">Get these ready and we'll take care of the rest</p>
        </div>

        {/* Two columns */}
        <div className="pfrd-columns">

          {/* Partner Documents */}
          <div className="pfrd-column">
            <div className="pfrd-col-header">
              <div className="pfrd-col-header-icon"><FaUser /></div>
              <div>
                <h3 className="pfrd-col-title">Partner Documents</h3>
                <p className="pfrd-col-subtitle">Required for each proposed partner</p>
              </div>
            </div>
            <div className="pfrd-col-body">
              {partnerDocs.map((doc, i) => (
                <DocItem key={i} doc={doc} />
              ))}
            </div>
          </div>

          {/* Firm / Office Documents */}
          <div className="pfrd-column">
            <div className="pfrd-col-header pfrd-col-header--office">
              <div className="pfrd-col-header-icon"><FaBuilding /></div>
              <div>
                <h3 className="pfrd-col-title">Firm &amp; Office Documents</h3>
                <p className="pfrd-col-subtitle">Required for the firm's registered address</p>
              </div>
            </div>
            <div className="pfrd-col-body">
              {firmDocs.map((doc, i) => (
                <DocItem key={i} doc={doc} />
              ))}
            </div>
          </div>

        </div>

      </div>
    </section>
  );
};

export default PFRdocument;
