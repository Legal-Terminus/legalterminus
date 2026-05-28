import React from "react";
import "./LLPDocInfographic.css";
import { FaUser, FaBuilding, FaIdCard, FaCamera, FaBolt, FaFileContract, FaShieldAlt, FaFileAlt } from "react-icons/fa";

const partnerDocs = [
  {
    icon: <FaIdCard />,
    title: "Identity Proof",
    note: "Mandatory for all Proposed Designated Partners & Partners",
    items: [
      "PAN Card (Mandatory)",
      "Aadhaar Card / Passport / Voter ID / Driving License",
    ],
  },
  {
    icon: <FaFileAlt />,
    title: "Address Proof",
    note: "Not older than 2 months",
    items: [
      "Telephone Bill / Mobile Bill",
      "Savings Bank Statement",
    ],
  },
  {
    icon: <FaCamera />,
    title: "Passport Size Photograph",
    note: "For all Proposed Designated Partners & Partners",
    items: [
      "Latest passport-size photograph of each proposed Designated Partner / Partner",
    ],
  },
];

const llpDocs = [
  {
    icon: <FaBolt />,
    title: "Registered Office — Utility Bill",
    note: "Not older than 2 months",
    items: [
      "Electricity Bill corresponding to the registered office address of the proposed LLP",
    ],
  },
  {
    icon: <FaFileContract />,
    title: "Registered Office — Ownership / Rental",
    note: "As applicable",
    items: [
      "Duly Notarised Rent Agreement (if on rent)",
      "Sale Deed / Property ownership document (if owned)",
    ],
  },
  {
    icon: <FaShieldAlt />,
    title: "No Objection Certificate (NOC)",
    note: "From property owner",
    items: [
      "NOC from the owner permitting use of premises as Registered Office of the proposed LLP",
    ],
  },
  {
    icon: <FaFileAlt />,
    title: "Other Documents",
    note: "Prepared and provided by our team",
    items: [
      "All additional incorporation documents shall be prepared and provided by the Legal Terminus team",
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
                <h3 className="llpdoc-col-title">LLP & Registered Office Documents</h3>
                <p className="llpdoc-col-subtitle">Office address proof & NOC</p>
              </div>
            </div>
            <div className="llpdoc-col-body">
              {llpDocs.map((doc, i) => (
                <DocItem key={i} doc={doc} />
              ))}
            </div>
          </div>

        </div>

        {/* Bottom note */}
        <p className="llpdoc-bottom-note">
          All documents must be self-attested. If you need help with document preparation or have any queries, our team at Legal Terminus is available to assist you at every step.
        </p>

      </div>
    </section>
  );
};

export default DocumentsInfographic;
