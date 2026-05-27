import React from "react";
import "./PublicltdDocument.css";
import {
  FaUser,
  FaBuilding,
  FaIdCard,
  FaFileAlt,
  FaCamera,
  FaBolt,
  FaFileContract,
  FaShieldAlt,
} from "react-icons/fa";

const directorDocs = [
  {
    icon: <FaIdCard />,
    title: "Identity Proof",
    note: "Mandatory for all proposed directors & shareholders",
    items: [
      "PAN Card (Mandatory for all Directors & Shareholders)",
      "Aadhaar Card",
      "Passport / Voter ID / Driving License",
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

const companyDocs = [
  {
    icon: <FaBolt />,
    title: "Registered Office — Utility Bill",
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
    title: "Registered Office — Ownership / Rental",
    note: "As applicable",
    items: [
      "Duly Notarised Rent Agreement (if rented)",
      "Sale Deed / Property ownership document (if owned)",
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
  <div className="pubdoc-item">
    <div className="pubdoc-item-top">
      <div className="pubdoc-icon">{doc.icon}</div>
      <div className="pubdoc-meta">
        <h4 className="pubdoc-title">{doc.title}</h4>
        <span className="pubdoc-note">{doc.note}</span>
      </div>
    </div>
    <ul className="pubdoc-list">
      {doc.items.map((item, i) => (
        <li key={i} className="pubdoc-list-item">{item}</li>
      ))}
    </ul>
  </div>
);

const PublicltdDocument = () => {
  return (
    <section className="pubdoc-section">
      <div className="pubdoc-container">

        {/* Header */}
        <div className="pubdoc-header">
          <h2 className="pubdoc-main-title">
            Documents Required for Public Limited Company Registration in India
          </h2>
          <p className="pubdoc-main-subtitle">Get these ready and we'll take care of the rest</p>
        </div>

        {/* Two columns */}
        <div className="pubdoc-columns">

          {/* Director / Shareholder Documents */}
          <div className="pubdoc-column">
            <div className="pubdoc-col-header">
              <div className="pubdoc-col-header-icon"><FaUser /></div>
              <div>
                <h3 className="pubdoc-col-title">Director / Shareholder Documents</h3>
                <p className="pubdoc-col-subtitle">Required for each director & shareholder</p>
              </div>
            </div>
            <div className="pubdoc-col-body">
              {directorDocs.map((doc, i) => (
                <DocItem key={i} doc={doc} />
              ))}
            </div>
          </div>

          {/* Company / Office Documents */}
          <div className="pubdoc-column">
            <div className="pubdoc-col-header pubdoc-col-header--office">
              <div className="pubdoc-col-header-icon"><FaBuilding /></div>
              <div>
                <h3 className="pubdoc-col-title">Company & Registered Office Documents</h3>
                <p className="pubdoc-col-subtitle">Office address proof & ownership records</p>
              </div>
            </div>
            <div className="pubdoc-col-body">
              {companyDocs.map((doc, i) => (
                <DocItem key={i} doc={doc} />
              ))}
            </div>
          </div>

        </div>

        {/* Bottom note */}
        <p className="pubdoc-bottom-note">
          All documents must be self-attested by the respective proposed directors / shareholders. All utility bills or bank statements must not be older than 2 months.
        </p>

      </div>
    </section>
  );
};

export default PublicltdDocument;
