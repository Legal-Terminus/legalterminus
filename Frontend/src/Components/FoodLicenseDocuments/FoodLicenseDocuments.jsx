import React from "react";
import "./FoodLicenseDocuments.css";
import { FaUser, FaBuilding, FaIdCard, FaCamera, FaBolt, FaFileContract, FaShieldAlt, FaFileAlt, FaList } from "react-icons/fa";

const ownerDocs = [
  {
    icon: <FaIdCard />,
    title: "Business Owner / Applicant KYC",
    note: "Mandatory for all FSSAI registration types",
    items: [
      "PAN card (self-attested)",
      "Aadhaar card (self-attested)",
      "Passport-size photograph",
    ],
  },
  {
    icon: <FaFileAlt />,
    title: "Business Registration Proof",
    note: "As applicable to your business entity type",
    items: [
      "Sole Proprietor: Shop & Establishment Certificate or GST Registration",
      "Partnership: Partnership Deed",
      "Company/LLP: Certificate of Incorporation + MOA/AOA",
      "For Basic Registration: not mandatory",
    ],
  },
  {
    icon: <FaList />,
    title: "Food Product List",
    note: "All products manufactured, processed, stored, sold, or imported",
    items: [
      "Complete list of food products/categories your business deals in",
      "For manufacturers: also include raw materials and packaging type",
    ],
  },
];

const premiseDocs = [
  {
    icon: <FaBolt />,
    title: "Business Premise Address Proof",
    note: "Latest utility bill — not older than 2 months",
    items: [
      "Electricity Bill",
      "Water Bill",
      "Gas Bill",
    ],
  },
  {
    icon: <FaFileContract />,
    title: "Rent Agreement / NOC (if rented)",
    note: "Required for State and Central licenses",
    items: [
      "Duly notarized Rent Agreement between property owner and applicant",
      "NOC from property owner permitting use of premises for food business",
    ],
  },
  {
    icon: <FaCamera />,
    title: "Premise Photos & Bank Details",
    note: "Required for State and Central license inspection",
    items: [
      "Internal photos of food processing / storage area",
      "Cancelled cheque or bank passbook (first page)",
      "For Central License: blueprint/layout plan of premises",
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

const FoodLicenseDocuments = () => {
  return (
    <section className="opcd-section" id="documents">
      <div className="opcd-container">

        <div className="opcd-header">
          <h2 className="opcd-main-title">Documents Required for FSSAI Food License Registration in India</h2>
          <p className="opcd-main-subtitle">Get these ready and we'll take care of the rest</p>
        </div>

        <div className="opcd-columns">

          <div className="opcd-column">
            <div className="opcd-col-header">
              <div className="opcd-col-header-icon"><FaUser /></div>
              <div>
                <h3 className="opcd-col-title">Applicant / Business KYC Documents</h3>
                <p className="opcd-col-subtitle">Required for all FSSAI registration types</p>
              </div>
            </div>
            <div className="opcd-col-body">
              {ownerDocs.map((doc, i) => (
                <DocItem key={i} doc={doc} />
              ))}
            </div>
          </div>

          <div className="opcd-column">
            <div className="opcd-col-header opcd-col-header--office">
              <div className="opcd-col-header-icon"><FaBuilding /></div>
              <div>
                <h3 className="opcd-col-title">Premise, Bank &amp; Compliance Documents</h3>
                <p className="opcd-col-subtitle">Office address, photos &amp; additional proofs</p>
              </div>
            </div>
            <div className="opcd-col-body">
              {premiseDocs.map((doc, i) => (
                <DocItem key={i} doc={doc} />
              ))}
            </div>
          </div>

        </div>

      </div>
    </section>
  );
};

export default FoodLicenseDocuments;
