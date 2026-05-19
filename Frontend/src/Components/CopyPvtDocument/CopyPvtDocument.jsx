import React from "react";
import "./CopyPvtDocument.css";
import { FaUser, FaBuilding, FaIdCard, FaFileAlt, FaCamera, FaBolt, FaFileContract, FaShieldAlt } from "react-icons/fa";

const individualDocs = [
  {
    icon: <FaIdCard />,
    title: "Identity Proof",
    note: "Mandatory for all directors & shareholders",
    items: [
      "PAN Card (Mandatory for Indian Nationals)",
      "Aadhaar Card (Indian Nationals)",
      "Passport (Mandatory for Foreign Nationals / NRIs)",
    ],
  },
  {
    icon: <FaFileAlt />,
    title: "Address Proof",
    note: "Not older than 2 months",
    items: [
      "Bank Statement",
      "Mobile Bill",
      "Electricity Bill",
      "Water Bill",
    ],
  },
  {
    icon: <FaCamera />,
    title: "Passport Size Photograph",
    note: "For all proposed directors & shareholders",
    items: [
      "Latest passport-size photograph of all Proposed Directors / Shareholders",
    ],
  },
];

const officeDocs = [
  {
    icon: <FaBolt />,
    title: "Utility Bill for Office Address",
    note: "Not older than 2 months",
    items: [
      "Electricity Bill",
      "Water Bill",
      "Gas Bill",
      "Property Tax Receipt",
    ],
  },
  {
    icon: <FaFileContract />,
    title: "Rent Agreement",
    note: "If premises is rented",
    items: ["Duly Notarised Rent Agreement"],
  },
  {
    icon: <FaShieldAlt />,
    title: "No Objection Certificate (NOC)",
    note: "From property owner",
    items: [
      "NOC from Property Owner permitting use of premises as Registered Office",
      "Note: Residential property is permissible as Registered Office under MCA guidelines",
    ],
  },
];

const DocItem = ({ doc, index }) => (
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

const CopyPvtDocument = () => {
  return (
    <section className="cpvd-section">
      <div className="cpvd-container">

        {/* Header */}
        <div className="cpvd-header">
          <h2 className="cpvd-main-title">Documents Required for Private Limited Company Registration in India</h2>
          <p className="cpvd-main-subtitle">Get these ready and we'll take care of the rest</p>
        </div>

        {/* Two columns */}
        <div className="cpvd-columns">

          {/* Individual Documents */}
          <div className="cpvd-column">
            <div className="cpvd-col-header">
              <div className="cpvd-col-header-icon"><FaUser /></div>
              <div>
                <h3 className="cpvd-col-title">Individual Documents</h3>
                <p className="cpvd-col-subtitle">Required for each director & shareholder</p>
              </div>
            </div>
            <div className="cpvd-col-body">
              {individualDocs.map((doc, i) => (
                <DocItem key={i} doc={doc} index={i} />
              ))}
            </div>
          </div>

          {/* Office Documents */}
          <div className="cpvd-column">
            <div className="cpvd-col-header cpvd-col-header--office">
              <div className="cpvd-col-header-icon"><FaBuilding /></div>
              <div>
                <h3 className="cpvd-col-title">Registered Office Documents</h3>
                <p className="cpvd-col-subtitle">Required for the company's registered address</p>
              </div>
            </div>
            <div className="cpvd-col-body">
              {officeDocs.map((doc, i) => (
                <DocItem key={i} doc={doc} index={i} />
              ))}
            </div>
          </div>

        </div>

        {/* Bottom note */}
        <p className="cpvd-bottom-note">
          All documents should be self-attested. Foreign nationals must get documents apostilled from the competent authority.
        </p>

      </div>
    </section>
  );
};

export default CopyPvtDocument;
