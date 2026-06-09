import React from "react";
import "../OPCDocuments/OPCDocuments.css";
import { FaUser, FaBuilding, FaIdCard, FaCamera, FaBolt, FaFileContract, FaShieldAlt, FaFileAlt } from "react-icons/fa";

const applicantDocs = [
  {
    icon: <FaIdCard />,
    title: "Proprietor / Director / Partner Identity",
    note: "Mandatory for the authorised signatory of the entity",
    items: [
      "Self-attested PAN card (mandatory)",
      "Self-attested Aadhaar card",
      "Passport / Driving Licence (for NRI authorised signatories)",
    ],
  },
  {
    icon: <FaFileAlt />,
    title: "Address Proof (Individual)",
    note: "Not older than 60 days from application date",
    items: [
      "Bank statement OR electricity bill OR mobile bill — not older than 60 days",
    ],
  },
  {
    icon: <FaCamera />,
    title: "Passport Size Photograph",
    note: "For the authorised signatory",
    items: [
      "Latest passport-size photograph of the proprietor / director / partner signing the application",
    ],
  },
];

const businessDocs = [
  {
    icon: <FaBolt />,
    title: "Business Registration Proof",
    note: "Principal registration document of the entity",
    items: [
      "Certificate of Incorporation (for companies & LLPs)",
      "Partnership Deed (for firms)",
      "GST Registration Certificate (if applicable)",
      "Udyam / MSME Registration Certificate (if applicable)",
    ],
  },
  {
    icon: <FaFileContract />,
    title: "Office / Business Address Proof",
    note: "Latest utility bill or registered lease agreement",
    items: [
      "Electricity Bill / Water Bill / Gas Bill (not older than 2 months)",
      "Registered Rent or Lease Agreement (if premises are rented)",
      "NOC from property owner (if residential address used as business address)",
    ],
  },
  {
    icon: <FaShieldAlt />,
    title: "Employee & Salary Information (for RC)",
    note: "Required only for Employer Registration Certificate",
    items: [
      "Employee count as of the registration date",
      "Salary range / band structure (for slab mapping)",
      "Payroll register or HR sheet (optional but speeds up slab configuration)",
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

const ProfTaxDocuments = () => {
  return (
    <section className="opcd-section" id="documents">
      <div className="opcd-container">

        <div className="opcd-header">
          <h2 className="opcd-main-title">Documents Required for Professional Tax Registration in India</h2>
          <p className="opcd-main-subtitle">Get these ready and we'll take care of the rest</p>
        </div>

        <div className="opcd-columns">

          {/* Applicant / Individual Documents */}
          <div className="opcd-column">
            <div className="opcd-col-header">
              <div className="opcd-col-header-icon"><FaUser /></div>
              <div>
                <h3 className="opcd-col-title">Individual / Authorised Signatory Documents</h3>
                <p className="opcd-col-subtitle">Required for the person signing the PT application</p>
              </div>
            </div>
            <div className="opcd-col-body">
              {applicantDocs.map((doc, i) => (
                <DocItem key={i} doc={doc} />
              ))}
            </div>
          </div>

          {/* Business / Office Documents */}
          <div className="opcd-column">
            <div className="opcd-col-header opcd-col-header--office">
              <div className="opcd-col-header-icon"><FaBuilding /></div>
              <div>
                <h3 className="opcd-col-title">Business &amp; Office Documents</h3>
                <p className="opcd-col-subtitle">Entity proof, address proof &amp; payroll data</p>
              </div>
            </div>
            <div className="opcd-col-body">
              {businessDocs.map((doc, i) => (
                <DocItem key={i} doc={doc} />
              ))}
            </div>
          </div>

        </div>

      </div>
    </section>
  );
};

export default ProfTaxDocuments;
