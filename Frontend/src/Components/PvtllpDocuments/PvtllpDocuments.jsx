import React from "react";
import "./PvtllpDocuments.css";
import { FaUser, FaBuilding, FaIdCard, FaCamera, FaFileSignature, FaFileContract, FaShieldAlt, FaFileAlt, FaBalanceScale, FaBolt } from "react-icons/fa";

const partnerDocs = [
  {
    icon: <FaIdCard />,
    title: "Identity Proof of All Shareholders",
    note: "Mandatory for every shareholder becoming a partner",
    items: [
      "Self-attested PAN card of each shareholder (mandatory)",
      "Self-attested Aadhaar of each shareholder",
      "Passport for foreign nationals / NRI shareholders: notarized + apostilled copy",
    ],
  },
  {
    icon: <FaFileAlt />,
    title: "Address Proof (Per Shareholder)",
    note: "Not older than 60 days from the filing date",
    items: [
      "Bank statement OR electricity bill OR mobile bill — not older than 2 months",
      "Voter ID / Driving Licence / Passport as additional address proof",
    ],
  },
  {
    icon: <FaCamera />,
    title: "DSC, DPIN & Photographs",
    note: "For all designated partners",
    items: [
      "Digital Signature Certificate (DSC) for all designated partners",
      "DPIN / DIN, where already allotted",
      "Latest passport-size photograph of each shareholder",
    ],
  },
];

const companyDocs = [
  {
    icon: <FaFileSignature />,
    title: "Company Constitution Documents",
    note: "Existing company records",
    items: [
      "Certificate of Incorporation, MOA & AOA of the company",
      "CIN and copies of recent AOC-4 & MGT-7 filings",
      "Board & shareholders' resolution approving the conversion",
    ],
  },
  {
    icon: <FaBalanceScale />,
    title: "Financials, ITR & Statement of Accounts",
    note: "Required for Form 18",
    items: [
      "Latest audited financial statements and income-tax returns",
      "Statement of assets and liabilities certified by a Chartered Accountant",
      "List of all shareholders with proposed capital contribution & profit share",
    ],
  },
  {
    icon: <FaShieldAlt />,
    title: "Consents & Charge Clearance",
    note: "Statutory approvals before filing",
    items: [
      "Written consent of all shareholders to the conversion",
      "No-Objection Certificate / consent of all secured creditors",
      "Proof that no charge / security interest subsists (or CHG-4 satisfaction)",
    ],
  },
  {
    icon: <FaBolt />,
    title: "Registered Office Proof",
    note: "Latest utility bill, not older than 2 months",
    items: [
      "Electricity / water / gas bill of the office address",
    ],
  },
  {
    icon: <FaFileContract />,
    title: "Rent Agreement & NOC",
    note: "If the office premises are rented",
    items: [
      "Notarized rent agreement between the owner and a designated partner",
      "NOC from the property owner permitting use as registered office",
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

const PvtllpDocuments = () => {
  return (
    <section className="opcd-section" id="documents">
      <div className="opcd-container">

        {/* Header */}
        <div className="opcd-header">
          <h2 className="opcd-main-title">Documents Required to Convert a Private Limited Company into an LLP</h2>
          <p className="opcd-main-subtitle">Get these ready and we'll take care of the Form 18 + FiLLiP filing</p>
        </div>

        {/* Two columns */}
        <div className="opcd-columns">

          {/* Shareholder Documents */}
          <div className="opcd-column">
            <div className="opcd-col-header">
              <div className="opcd-col-header-icon"><FaUser /></div>
              <div>
                <h3 className="opcd-col-title">Shareholder / Partner Documents</h3>
                <p className="opcd-col-subtitle">For every shareholder becoming a partner</p>
              </div>
            </div>
            <div className="opcd-col-body">
              {partnerDocs.map((doc, i) => (
                <DocItem key={i} doc={doc} />
              ))}
            </div>
          </div>

          {/* Company & Conversion Documents */}
          <div className="opcd-column">
            <div className="opcd-col-header opcd-col-header--office">
              <div className="opcd-col-header-icon"><FaBuilding /></div>
              <div>
                <h3 className="opcd-col-title">Company, Conversion & Office Documents</h3>
                <p className="opcd-col-subtitle">Section 56 records, consents & office proof</p>
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

export default PvtllpDocuments;
