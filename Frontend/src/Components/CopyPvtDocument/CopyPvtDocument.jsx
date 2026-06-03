import React from "react";
import "./CopyPvtDocument.css";
import { FaUser, FaBuilding, FaIdCard, FaFileAlt, FaCamera, FaBolt, FaFileContract, FaShieldAlt } from "react-icons/fa";

const individualDocs = [
  {
    icon: <FaIdCard />,
    title: "Director & Subscriber Identity",
    note: "Mandatory for all directors & shareholders",
    items: [
      "Self-attested PAN card (mandatory)",
      "Self-attested Aadhaar",
      "Driving Licence / Passport as ID for foreign nationals/NRI: notarized + apostilled passport copy",
    ],
  },
  {
    icon: <FaFileAlt />,
    title: "Address Proof (Per Person)",
    note: "Not older than 60 days from filing date",
    items: [
      "Self-attested Bank statement OR Gas bill OR Mobile bill — not older than 60 days from filing date",
    ],
  },
  {
    icon: <FaCamera />,
    title: "Passport Size Photograph (Per Person)",
    note: "For all proposed directors & shareholders",
    items: [
      "Latest Passport-size Photograph of all Proposed Directors / Shareholders",
    ],
  },
];

const officeDocs = [
  {
    icon: <FaBolt />,
    title: "Registered Office Proof",
    note: "Latest Utility Bill for Office Address (Not Older Than 2 Months)",
    items: [
      "Electricity Bill",
      "Water Bill",
      "Gas Bill",
    ],
  },
  {
    icon: <FaFileContract />,
    title: "Rent Agreement (If Business Premises is Rented)",
    note: "Duly notarized between property owner and a director",
    items: [
      "Duly Notarized Rent Agreement between the owner of the property and one of the directors of the proposed company",
    ],
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


      </div>
    </section>
  );
};

export default CopyPvtDocument;
