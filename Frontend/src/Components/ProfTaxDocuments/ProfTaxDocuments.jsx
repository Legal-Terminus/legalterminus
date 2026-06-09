import React from "react";
import "./ProfTaxDocuments.css";
import { FaUser, FaBuilding, FaIdCard, FaFileAlt, FaCamera, FaBolt, FaFileContract, FaUsers } from "react-icons/fa";

const employerDocs = [
  {
    icon: <FaIdCard />,
    title: "Business Owner / Authorized Signatory Identity",
    note: "Mandatory for all Directors / Partners / Proprietors",
    items: [
      "Self-attested PAN card (mandatory)",
      "Self-attested Aadhaar card",
      "Passport / Driving Licence (for foreign nationals — notarised + apostilled)",
    ],
  },
  {
    icon: <FaFileAlt />,
    title: "Business Registration Certificate",
    note: "Any one of the following",
    items: [
      "Certificate of Incorporation (COI) for companies",
      "Partnership Deed / LLP Agreement",
      "GST Registration Certificate",
      "UDYAM / Shop & Establishment Certificate",
    ],
  },
  {
    icon: <FaCamera />,
    title: "Passport Size Photograph",
    note: "For the authorised signatory",
    items: [
      "Latest passport-size photograph of proprietor / director / partner",
    ],
  },
];

const officeDocs = [
  {
    icon: <FaBolt />,
    title: "Registered Office Proof",
    note: "Latest utility bill — not older than 2 months",
    items: [
      "Electricity Bill",
      "Water Bill",
      "Gas Bill",
    ],
  },
  {
    icon: <FaFileContract />,
    title: "Rent Agreement (if office is rented)",
    note: "Duly notarised rent agreement",
    items: [
      "Notarised Rent Agreement between property owner and the company / employer",
      "NOC from property owner permitting commercial use",
    ],
  },
  {
    icon: <FaUsers />,
    title: "Employee Details",
    note: "For Employee Certificate (RC)",
    items: [
      "Number of employees on rolls",
      "Monthly salary range / slab breakdown",
      "State(s) where employees work",
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

const ProfTaxDocuments = () => {
  return (
    <section className="opcd-section" id="documents">
      <div className="opcd-container">

        <div className="opcd-header">
          <h2 className="opcd-main-title">Documents Required for Professional Tax Registration in India</h2>
          <p className="opcd-main-subtitle">Get these ready and we'll take care of the rest</p>
        </div>

        <div className="opcd-columns">

          <div className="opcd-column">
            <div className="opcd-col-header">
              <div className="opcd-col-header-icon"><FaUser /></div>
              <div>
                <h3 className="opcd-col-title">Employer / Business Documents</h3>
                <p className="opcd-col-subtitle">Required for EC and owner KYC</p>
              </div>
            </div>
            <div className="opcd-col-body">
              {employerDocs.map((doc, i) => (
                <DocItem key={i} doc={doc} />
              ))}
            </div>
          </div>

          <div className="opcd-column">
            <div className="opcd-col-header opcd-col-header--office">
              <div className="opcd-col-header-icon"><FaBuilding /></div>
              <div>
                <h3 className="opcd-col-title">Office &amp; Employee Documents</h3>
                <p className="opcd-col-subtitle">Office address proof and employee slab details</p>
              </div>
            </div>
            <div className="opcd-col-body">
              {officeDocs.map((doc, i) => (
                <DocItem key={i} doc={doc} />
              ))}
            </div>
          </div>

        </div>

      </div>
    </section>
  );
};

export default ProfTaxDocuments;
