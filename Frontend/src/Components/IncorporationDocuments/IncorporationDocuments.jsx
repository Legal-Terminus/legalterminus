import React from "react";
import "./IncorporationDocuments.css";
import { FaUser, FaBuilding, FaIdCard, FaFileAlt, FaCamera, FaBolt, FaFileContract, FaShieldAlt, FaPassport, FaStamp } from "react-icons/fa";

const directorDocs = [
  {
    icon: <FaPassport />,
    title: "Identity Proof",
    note: "Mandatory for all proposed directors & shareholders",
    items: [
      "Passport (Mandatory for Foreign Nationals / NRIs)",
      "PAN Card (Mandatory for Indian Resident Director)",
      "Aadhaar Card (for Indian Resident Director)",
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
    icon: <FaStamp />,
    title: "Parent Company Documents",
    note: "Apostilled by competent authority in home country",
    items: [
      "Certificate of Incorporation of the parent/holding company",
      "Memorandum & Articles of Association (or equivalent charter document)",
      "Board Resolution authorising incorporation of WOS in India",
    ],
  },
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
  <div className="incd-doc-item">
    <div className="incd-doc-item-top">
      <div className="incd-doc-icon">{doc.icon}</div>
      <div className="incd-doc-meta">
        <h4 className="incd-doc-title">{doc.title}</h4>
        <span className="incd-doc-note">{doc.note}</span>
      </div>
    </div>
    <ul className="incd-doc-list">
      {doc.items.map((item, i) => (
        <li key={i} className="incd-doc-list-item">{item}</li>
      ))}
    </ul>
  </div>
);

const IncorporationDocuments = () => {
  return (
    <section className="incd-section">
      <div className="incd-container">

        {/* Header */}
        <div className="incd-header">
          <h2 className="incd-main-title">Documents Required for Incorporation of Wholly Owned Subsidiary in India</h2>
          <p className="incd-main-subtitle">Get these ready and we'll take care of the rest</p>
        </div>

        {/* Two columns */}
        <div className="incd-columns">

          {/* Director / Individual Documents */}
          <div className="incd-column">
            <div className="incd-col-header">
              <div className="incd-col-header-icon"><FaUser /></div>
              <div>
                <h3 className="incd-col-title">Director / Promoter Documents</h3>
                <p className="incd-col-subtitle">Required for each director & shareholder</p>
              </div>
            </div>
            <div className="incd-col-body">
              {directorDocs.map((doc, i) => (
                <DocItem key={i} doc={doc} />
              ))}
            </div>
          </div>

          {/* Company / Office Documents */}
          <div className="incd-column">
            <div className="incd-col-header incd-col-header--office">
              <div className="incd-col-header-icon"><FaBuilding /></div>
              <div>
                <h3 className="incd-col-title">Company & Registered Office Documents</h3>
                <p className="incd-col-subtitle">Parent company records & office address proof</p>
              </div>
            </div>
            <div className="incd-col-body">
              {companyDocs.map((doc, i) => (
                <DocItem key={i} doc={doc} />
              ))}
            </div>
          </div>

        </div>

        {/* Bottom note */}
        <p className="incd-bottom-note">
          All documents must be self-attested. Documents of foreign nationals and the parent company must be apostilled / notarised by the competent authority in their home country before submission.
        </p>

      </div>
    </section>
  );
};

export default IncorporationDocuments;
