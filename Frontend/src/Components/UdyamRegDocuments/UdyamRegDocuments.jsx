import React from "react";
import "./UdyamRegDocuments.css";
import { FaUser, FaBuilding, FaIdCard, FaPhone, FaFileContract, FaShieldAlt, FaBolt, FaUniversity } from "react-icons/fa";

const applicantDocs = [
  {
    icon: <FaIdCard />,
    title: "Applicant Identity",
    note: "Mandatory for the proprietor / managing partner / authorised signatory",
    items: [
      "Aadhaar Card of the Proprietor / Partner / Director (Aadhaar-linked mobile required for OTP)",
      "PAN Card of the Applicant",
    ],
  },
  {
    icon: <FaPhone />,
    title: "Contact & Communication Details",
    note: "Used for portal login and certificate delivery",
    items: [
      "Mobile number linked to Aadhaar (mandatory for OTP-based verification)",
      "Active business email address",
    ],
  },
  {
    icon: <FaShieldAlt />,
    title: "Authorization Document",
    note: "Required for companies, LLPs, trusts & societies",
    items: [
      "Board Resolution / Partnership Authorization authorising the signatory to file Udyam",
      "Not required for sole proprietorships",
    ],
  },
];

const businessDocs = [
  {
    icon: <FaBuilding />,
    title: "Business Entity Proof",
    note: "Depends on your entity type",
    items: [
      "GST Registration Certificate (if already registered)",
      "Certificate of Incorporation / Partnership Deed / LLP Agreement (as applicable)",
      "Shop & Establishment Certificate (for proprietorships)",
    ],
  },
  {
    icon: <FaBolt />,
    title: "Business Address Proof",
    note: "For owned or rented business premises",
    items: [
      "Electricity Bill / Property Tax Receipt (for owned premises)",
      "Rent Agreement (for rented premises)",
      "NOC from property owner if using shared / residential premises",
    ],
  },
  {
    icon: <FaUniversity />,
    title: "Bank Account Details",
    note: "Bank account in the name of the business or proprietor",
    items: [
      "Bank account number (savings or current) in the applicant's or business name",
      "IFSC code of the branch",
    ],
  },
  {
    icon: <FaFileContract />,
    title: "Business Activity Details",
    note: "Self-declared — no upload required at filing",
    items: [
      "NIC Code for primary business activity (we will identify the correct code)",
      "Number of employees",
      "Investment in plant & machinery / equipment (self-declared)",
      "Annual turnover (self-declared, verified against ITR + GSTR)",
    ],
  },
];

const DocItem = ({ doc }) => (
  <div className="udyamd-doc-item">
    <div className="udyamd-doc-item-top">
      <div className="udyamd-doc-icon">{doc.icon}</div>
      <div className="udyamd-doc-meta">
        <h4 className="udyamd-doc-title">{doc.title}</h4>
        <span className="udyamd-doc-note">{doc.note}</span>
      </div>
    </div>
    <ul className="udyamd-doc-list">
      {doc.items.map((item, i) => (
        <li key={i} className="udyamd-doc-list-item">{item}</li>
      ))}
    </ul>
  </div>
);

const UdyamRegDocuments = () => {
  return (
    <section className="udyamd-section">
      <div className="udyamd-container">

        <div className="udyamd-header">
          <h2 className="udyamd-main-title">Documents Required for Udyam Registration in India</h2>
          <p className="udyamd-main-subtitle">
            Udyam is largely self-declaratory — no upload is mandatory on the portal. Keep these documents ready for verification.
          </p>
        </div>

        <div className="udyamd-columns">

          <div className="udyamd-column">
            <div className="udyamd-col-header">
              <div className="udyamd-col-header-icon"><FaUser /></div>
              <div>
                <h3 className="udyamd-col-title">Applicant / Promoter Documents</h3>
                <p className="udyamd-col-subtitle">Identity, contact & authorization details</p>
              </div>
            </div>
            <div className="udyamd-col-body">
              {applicantDocs.map((doc, i) => (
                <DocItem key={i} doc={doc} />
              ))}
            </div>
          </div>

          <div className="udyamd-column">
            <div className="udyamd-col-header udyamd-col-header--office">
              <div className="udyamd-col-header-icon"><FaBuilding /></div>
              <div>
                <h3 className="udyamd-col-title">Business & Bank Documents</h3>
                <p className="udyamd-col-subtitle">Entity proof, address & account details</p>
              </div>
            </div>
            <div className="udyamd-col-body">
              {businessDocs.map((doc, i) => (
                <DocItem key={i} doc={doc} />
              ))}
            </div>
          </div>

        </div>

        <p className="udyamd-bottom-note">
          <strong>Important:</strong> For OTP-based Aadhaar verification, the mobile number must be registered with UIDAI. If not updated, visit an Aadhaar Seva Kendra before applying — update takes 7–10 days.
        </p>

      </div>
    </section>
  );
};

export default UdyamRegDocuments;
