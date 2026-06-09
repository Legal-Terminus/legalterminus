import React from "react";
import "./SocietyDocument.css";
import { FaUser, FaBuilding, FaIdCard, FaCamera, FaBolt, FaFileContract, FaShieldAlt, FaFileAlt } from "react-icons/fa";

const memberDocs = [
  {
    icon: <FaIdCard />,
    title: "Identity Proof (All Members)",
    note: "Mandatory for all governing body members",
    items: [
      "Self-attested PAN card (mandatory for all)",
      "Self-attested Aadhaar card",
      "Driving Licence / Passport / Voter ID as secondary ID proof",
    ],
  },
  {
    icon: <FaFileAlt />,
    title: "Address Proof (Per Member)",
    note: "Not older than 60 days from filing date",
    items: [
      "Bank statement OR electricity bill OR mobile bill — not older than 60 days",
    ],
  },
  {
    icon: <FaCamera />,
    title: "Passport Size Photograph (Per Member)",
    note: "For all governing body members",
    items: [
      "Latest passport-size photograph of all proposed governing body members",
    ],
  },
];

const societyDocs = [
  {
    icon: <FaFileContract />,
    title: "Memorandum of Association (MOA)",
    note: "Describes the name, objectives, and rules of the society",
    items: [
      "Memorandum of Association stating name, objectives, and address of the society",
      "Rules & Regulations of the society (governing its management)",
    ],
  },
  {
    icon: <FaBolt />,
    title: "Registered Office Address Proof",
    note: "Latest utility bill for office address (not older than 2 months)",
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
      "NOC from the property owner permitting use of premises as society's registered address",
      "Rent Agreement (if applicable) — duly notarized",
    ],
  },
];

const DocItem = ({ doc }) => (
  <div className="socd-doc-item">
    <div className="socd-doc-item-top">
      <div className="socd-doc-icon">{doc.icon}</div>
      <div className="socd-doc-meta">
        <h4 className="socd-doc-title">{doc.title}</h4>
        <span className="socd-doc-note">{doc.note}</span>
      </div>
    </div>
    <ul className="socd-doc-list">
      {doc.items.map((item, i) => (
        <li key={i} className="socd-doc-list-item">{item}</li>
      ))}
    </ul>
  </div>
);

const SocietyDocument = () => {
  return (
    <section className="socd-section" id="documents">
      <div className="socd-container">

        <div className="socd-header">
          <h2 className="socd-main-title">Documents Required for Society Registration in India</h2>
          <p className="socd-main-subtitle">Get these ready and we'll take care of the rest</p>
        </div>

        <div className="socd-columns">

          <div className="socd-column">
            <div className="socd-col-header">
              <div className="socd-col-header-icon"><FaUser /></div>
              <div>
                <h3 className="socd-col-title">Member / Governing Body Documents</h3>
                <p className="socd-col-subtitle">Required for all governing body members</p>
              </div>
            </div>
            <div className="socd-col-body">
              {memberDocs.map((doc, i) => (
                <DocItem key={i} doc={doc} />
              ))}
            </div>
          </div>

          <div className="socd-column">
            <div className="socd-col-header socd-col-header--office">
              <div className="socd-col-header-icon"><FaBuilding /></div>
              <div>
                <h3 className="socd-col-title">Society Registration Documents</h3>
                <p className="socd-col-subtitle">MOA, registered address proof & NOC</p>
              </div>
            </div>
            <div className="socd-col-body">
              {societyDocs.map((doc, i) => (
                <DocItem key={i} doc={doc} />
              ))}
            </div>
          </div>

        </div>

      </div>
    </section>
  );
};

export default SocietyDocument;
