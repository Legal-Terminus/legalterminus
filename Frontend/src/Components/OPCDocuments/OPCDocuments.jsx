import React from "react";
import "./OPCDocuments.css";
import { FaUser, FaBuilding, FaIdCard, FaCamera, FaBolt, FaFileContract, FaShieldAlt, FaFileAlt } from "react-icons/fa";

const directorDocs = [
  {
    icon: <FaIdCard />,
    title: "Subscriber and Nominee Identity",
    note: "Mandatory for the proposed Director, Nominee & Shareholder",
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
    note: "For the proposed Director, Nominee & Shareholder",
    items: [
      "Latest Passport-size Photograph of all Proposed Directors / Shareholders and Nominee",
    ],
  },
];

const companyDocs = [
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

const OPCDocuments = () => {
  return (
    <section className="opcd-section" id="documents">
      <div className="opcd-container">

        {/* Header */}
        <div className="opcd-header">
          <h2 className="opcd-main-title">Documents Required for One Person Company Registration in India</h2>
          <p className="opcd-main-subtitle">Get these ready and we'll take care of the rest</p>
        </div>

        {/* Two columns */}
        <div className="opcd-columns">

          {/* Director / Individual Documents */}
          <div className="opcd-column">
            <div className="opcd-col-header">
              <div className="opcd-col-header-icon"><FaUser /></div>
              <div>
                <h3 className="opcd-col-title">Director / Promoter Documents</h3>
                <p className="opcd-col-subtitle">Required for the director, nominee & shareholder</p>
              </div>
            </div>
            <div className="opcd-col-body">
              {directorDocs.map((doc, i) => (
                <DocItem key={i} doc={doc} />
              ))}
            </div>
          </div>

          {/* Company / Office Documents */}
          <div className="opcd-column">
            <div className="opcd-col-header opcd-col-header--office">
              <div className="opcd-col-header-icon"><FaBuilding /></div>
              <div>
                <h3 className="opcd-col-title">Company & Registered Office Documents</h3>
                <p className="opcd-col-subtitle">Office address proof & NOC</p>
              </div>
            </div>
            <div className="opcd-col-body">
              {companyDocs.map((doc, i) => (
                <DocItem key={i} doc={doc} />
              ))}
            </div>
          </div>

        </div>


      </div>
    </section>
  );
};

export default OPCDocuments;
