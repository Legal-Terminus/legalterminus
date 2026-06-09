import React from "react";
import "./TrustDocument.css";
import { FaUser, FaBuilding, FaIdCard, FaCamera, FaBolt, FaFileContract, FaShieldAlt, FaFileAlt } from "react-icons/fa";

const trusteeDocs = [
  {
    icon: <FaIdCard />,
    title: "Identity Proof (All Trustees & Settlor)",
    note: "Mandatory for settlor and all trustees",
    items: [
      "Self-attested PAN card (mandatory for all)",
      "Self-attested Aadhaar card",
      "Driving Licence / Passport / Voter ID as secondary ID proof",
    ],
  },
  {
    icon: <FaFileAlt />,
    title: "Address Proof (Per Person)",
    note: "Not older than 60 days from filing date",
    items: [
      "Bank statement OR electricity bill OR mobile bill — not older than 60 days from filing date",
    ],
  },
  {
    icon: <FaCamera />,
    title: "Passport Size Photograph (Per Person)",
    note: "For settlor and all trustees",
    items: [
      "Latest passport-size photographs of the settlor and all proposed trustees",
    ],
  },
];

const trustDocs = [
  {
    icon: <FaFileContract />,
    title: "Trust Deed",
    note: "Drafted on appropriate stamp paper as per state law",
    items: [
      "Trust Deed on stamp paper specifying name, objects, settlor, trustees, and beneficiaries",
      "Signed by settlor and trustees in presence of two witnesses",
    ],
  },
  {
    icon: <FaBolt />,
    title: "Registered Office Address Proof",
    note: "Latest utility bill for trust address (not older than 2 months)",
    items: [
      "Electricity Bill",
      "Water Bill",
      "Gas Bill",
    ],
  },
  {
    icon: <FaShieldAlt />,
    title: "No Objection Certificate (NOC)",
    note: "From property owner if office is rented or borrowed",
    items: [
      "NOC from the property owner permitting use of premises as the trust's registered address",
      "Rent Agreement (if applicable) — duly notarized",
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
          <p className="trsd-main-subtitle">Get these ready and we'll take care of the rest</p>
        </div>

        <div className="trsd-columns">

          <div className="trsd-column">
            <div className="trsd-col-header">
              <div className="trsd-col-header-icon"><FaUser /></div>
              <div>
                <h3 className="trsd-col-title">Trustee / Settlor Documents</h3>
                <p className="trsd-col-subtitle">Required for settlor and all trustees</p>
              </div>
            </div>
            <div className="trsd-col-body">
              {trusteeDocs.map((doc, i) => (
                <DocItem key={i} doc={doc} />
              ))}
            </div>
          </div>

          <div className="trsd-column">
            <div className="trsd-col-header trsd-col-header--office">
              <div className="trsd-col-header-icon"><FaBuilding /></div>
              <div>
                <h3 className="trsd-col-title">Trust Deed & Office Documents</h3>
                <p className="trsd-col-subtitle">Trust deed, registered address proof & NOC</p>
              </div>
            </div>
            <div className="trsd-col-body">
              {trustDocs.map((doc, i) => (
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
