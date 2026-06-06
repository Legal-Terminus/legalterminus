import React from "react";
import "./UdyamRegDocuments.css";
import { FaIdCard, FaShieldAlt, FaBolt, FaBuilding, FaUniversity, FaFileContract, FaUser } from "react-icons/fa";

const identityDocs = [
  {
    icon: <FaIdCard />,
    title: "Applicant Aadhaar",
    note: "Proprietor / managing partner / karta / authorised signatory",
    items: [
      "Aadhaar of the authorised signatory — must be linked to a working mobile number for OTP",
      "Aadhaar-PAN linkage mandatory (verify at incometax.gov.in)",
    ],
  },
  {
    icon: <FaShieldAlt />,
    title: "Business PAN",
    note: "Must be operative and PAN-Aadhaar linked",
    items: [
      "Proprietorship — proprietor's individual PAN",
      "Partnership / Pvt Ltd / LLP / Trust / Society — the entity's PAN",
      "PAN must be operative (not flagged inoperative due to PAN-Aadhaar non-linkage)",
    ],
  },
  {
    icon: <FaBolt />,
    title: "GSTIN (If Applicable)",
    note: "Mandatory for Udyam if GST registration is required for your business",
    items: [
      "GSTIN is mandatory if the enterprise is otherwise required to register under GST",
      "Auto-fetch from GSTN during filing",
      "Provide all active GSTINs — all states / locations if multi-state",
    ],
  },
];

const businessDocs = [
  {
    icon: <FaBuilding />,
    title: "Business Identity",
    note: "Self-declared on the Udyam portal — no upload required",
    items: [
      "Trade name and business activity description",
      "NIC code for primary business activity (we help you identify the correct one)",
      "Date of commencement, business email + mobile",
      "Type of organisation (proprietorship / partnership / Pvt Ltd / LLP etc.)",
    ],
  },
  {
    icon: <FaUniversity />,
    title: "Bank Account Details",
    note: "Account name must match PAN holder name",
    items: [
      "Bank account number (savings or current) — name must match PAN holder",
      "IFSC code and branch name",
      "Used for receiving subsidy payments and CGTMSE / Mudra loan disbursements",
    ],
  },
  {
    icon: <FaFileContract />,
    title: "Investment + Turnover Data",
    note: "Self-declared — verified against ITR + GSTR data",
    items: [
      "Investment in plant & machinery / equipment (net of GST)",
      "Annual turnover (previous FY, exports excluded)",
      "Number of employees (male + female)",
      "For new businesses (< 1 year): self-declaration of projected figures",
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
          <h2 className="udyamd-main-title">Documents Required for Udyam / MSME Registration in India</h2>
          <p className="udyamd-main-subtitle">
            Six categories. Most data auto-fetches from PAN + Aadhaar + GSTN — so the documentation burden is deliberately light. We send a personalised checklist after the discovery call.
          </p>
        </div>

        <div className="udyamd-columns">

          <div className="udyamd-column">
            <div className="udyamd-col-header">
              <div className="udyamd-col-header-icon"><FaUser /></div>
              <div>
                <h3 className="udyamd-col-title">Identity & Registration Documents</h3>
                <p className="udyamd-col-subtitle">Aadhaar, PAN & GST details</p>
              </div>
            </div>
            <div className="udyamd-col-body">
              {identityDocs.map((doc, i) => (
                <DocItem key={i} doc={doc} />
              ))}
            </div>
          </div>

          <div className="udyamd-column">
            <div className="udyamd-col-header udyamd-col-header--office">
              <div className="udyamd-col-header-icon"><FaBuilding /></div>
              <div>
                <h3 className="udyamd-col-title">Business & Financial Details</h3>
                <p className="udyamd-col-subtitle">Entity, bank & turnover data</p>
              </div>
            </div>
            <div className="udyamd-col-body">
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

export default UdyamRegDocuments;
