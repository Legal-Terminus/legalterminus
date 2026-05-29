import React from "react";
import "./PFRdocument.css";
import {
  FaUser, FaBuilding, FaIdCard, FaFileAlt, FaCamera,
  FaBolt, FaFileContract, FaStamp,
} from "react-icons/fa";

const partnerDocs = [
  {
    icon: <FaIdCard />,
    title: "Identity Proof",
    note: "Mandatory for all proposed partners",
    items: [
      "PAN Card (Mandatory)",
      "Aadhaar Card",
      "Passport (for Foreign Nationals / NRIs)",
    ],
  },
  {
    icon: <FaFileAlt />,
    title: "Address Proof",
    note: "Not older than 2 months",
    items: [
      "Bank Statement",
      "Electricity Bill",
      "Mobile Bill",
      "Water Bill",
    ],
  },
  {
    icon: <FaCamera />,
    title: "Passport Size Photograph",
    note: "For all proposed partners",
    items: [
      "Latest passport-size photograph of all Proposed Partners",
    ],
  },
];

const firmDocs = [
  {
    icon: <FaStamp />,
    title: "Stamp Paper",
    note: "For Partnership Deed execution",
    items: [
      "Rs. 200/- stamp paper in the name of any proposed Partner (denomination may vary by state)",
    ],
  },
  {
    icon: <FaBolt />,
    title: "Office Address Proof",
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
                <h3 className="pfrd-col-title">Firm & Office Documents</h3>
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

        {/* Bottom note */}
        <p className="pfrd-bottom-note">
          All documents should be self-attested. Stamp paper denomination may vary by state — our team will confirm the exact requirement for your state.
        </p>

      </div>
    </section>
  );
};

export default PFRdocument;
