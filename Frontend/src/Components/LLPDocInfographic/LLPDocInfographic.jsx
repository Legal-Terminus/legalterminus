import React from "react";
import "./LLPDocInfographic.css";
import { FaUser, FaBuilding, FaIdCard, FaCamera, FaBolt, FaFileContract, FaShieldAlt, FaFileAlt } from "react-icons/fa";

const partnerDocs = [
  {
    icon: <FaIdCard />,
    title: "Subscriber and Nominee Identity",
    note: "Mandatory for all partners",
    items: [
      "Self-attested PAN card (mandatory)",
      "Self-attested Aadhaar",
      "Driving Licence / Passport",
      "For foreign nationals / NRI: notarized + apostilled passport copy",
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
    note: "For all proposed directors, shareholders and nominee",
    items: [
      "Latest passport-size photograph of all Proposed Directors / Shareholders and Nominee",
    ],
  },
];

const llpDocs = [
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
    title: "Rent Agreement (If Business Premises is Rented)",
    note: "Duly notarized",
    items: [
      "Duly Notarized Rent Agreement between the owner of the property and one of the director of the proposed company",
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

const DocItem = ({ doc }) => (
  <div className="llpdoc-doc-item">
    <div className="llpdoc-doc-item-top">
      <div className="llpdoc-doc-icon">{doc.icon}</div>
      <div className="llpdoc-doc-meta">
        <h4 className="llpdoc-doc-title">{doc.title}</h4>
        <span className="llpdoc-doc-note">{doc.note}</span>
      </div>
    </div>
    <ul className="llpdoc-doc-list">
      {doc.items.map((item, i) => (
        <li key={i} className="llpdoc-doc-list-item">{item}</li>
      ))}
    </ul>
  </div>
);

const DocumentsInfographic = () => {
  return (
    <section className="llpdoc-section" id="documents">
      <div className="llpdoc-container">

        {/* Header */}
        <div className="llpdoc-header">
          <h2 className="llpdoc-main-title">Documents Required for Limited Liability Partnership Registration in India</h2>
          <p className="llpdoc-main-subtitle">Get these ready and we'll take care of the rest</p>
        </div>

        {/* Two columns */}
        <div className="llpdoc-columns">

          {/* Partner Documents */}
          <div className="llpdoc-column">
            <div className="llpdoc-col-header">
              <div className="llpdoc-col-header-icon"><FaUser /></div>
              <div>
                <h3 className="llpdoc-col-title">Partner / Designated Partner Documents</h3>
                <p className="llpdoc-col-subtitle">Required for all partners and designated partners</p>
              </div>
            </div>
            <div className="llpdoc-col-body">
              {partnerDocs.map((doc, i) => (
                <DocItem key={i} doc={doc} />
              ))}
            </div>
          </div>

          {/* LLP / Office Documents */}
          <div className="llpdoc-column">
            <div className="llpdoc-col-header llpdoc-col-header--office">
              <div className="llpdoc-col-header-icon"><FaBuilding /></div>
              <div>
                <h3 className="llpdoc-col-title">LLP &amp; Registered Office Documents</h3>
                <p className="llpdoc-col-subtitle">Office address proof &amp; NOC</p>
              </div>
            </div>
            <div className="llpdoc-col-body">
              {llpDocs.map((doc, i) => (
                <DocItem key={i} doc={doc} />
              ))}
            </div>
          </div>

        </div>


      </div>
    </section>
  );
};

export default DocumentsInfographic;
