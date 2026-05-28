import React from "react";
import "./OPCDocuments.css";
import { FaUser, FaBuilding, FaIdCard, FaCamera, FaBolt, FaFileContract, FaShieldAlt, FaFileAlt } from "react-icons/fa";

const directorDocs = [
  {
    icon: <FaIdCard />,
    title: "Identity Proof",
    note: "Mandatory for the proposed Director, Nominee & Shareholder",
    items: [
      "PAN Card (Mandatory)",
      "Aadhaar Card",
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
    note: "For the proposed Director, Nominee & Shareholder",
    items: [
      "Latest passport-size photograph of the proposed Director / Nominee / Shareholder",
    ],
  },
];

const companyDocs = [
  {
    icon: <FaBolt />,
    title: "Registered Office — Utility Bill",
    note: "Not older than 2 months",
    items: [
      "Electricity Bill corresponding to the registered office address",
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
      "NOC from the owner permitting use of premises as Registered Office of the proposed company",
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

        {/* Bottom note */}
        <p className="opcd-bottom-note">
          All documents must be self-attested. If you need help with document preparation or have any queries, our team at Legal Terminus is available to assist you at every step.
        </p>

      </div>
    </section>
  );
};

export default OPCDocuments;
