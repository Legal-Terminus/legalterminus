import React from "react";
import "./LtopvtDocuments.css";
import { FaUser, FaBuilding, FaIdCard, FaCamera, FaFileSignature, FaFileContract, FaShieldAlt, FaFileAlt, FaBalanceScale, FaBolt } from "react-icons/fa";

const partnerDocs = [
  {
    icon: <FaIdCard />,
    title: "Identity Proof of All Partners",
    note: "Mandatory for every partner becoming a shareholder/director",
    items: [
      "Self-attested PAN card of each partner (mandatory)",
      "Self-attested Aadhaar of each partner",
      "Passport for foreign nationals / NRI partners: notarized + apostilled copy",
    ],
  },
  {
    icon: <FaFileAlt />,
    title: "Address Proof (Per Partner)",
    note: "Not older than 60 days from the filing date",
    items: [
      "Bank statement OR electricity bill OR mobile bill — not older than 2 months",
      "Voter ID / Driving Licence / Passport as additional address proof",
    ],
  },
  {
    icon: <FaCamera />,
    title: "DSC, DIN & Photographs",
    note: "For all partners who will be directors",
    items: [
      "Digital Signature Certificate (DSC) for all proposed directors",
      "DIN, where already allotted",
      "Latest passport-size photograph of each partner",
    ],
  },
];

const llpDocs = [
  {
    icon: <FaFileSignature />,
    title: "LLP Constitution Documents",
    note: "Existing LLP records",
    items: [
      "Certificate of Incorporation of the LLP",
      "Latest LLP Agreement and any supplementary agreements",
      "LLPIN and copies of recent Form 8 & Form 11 filings",
    ],
  },
  {
    icon: <FaBalanceScale />,
    title: "Statement of Accounts & Creditors",
    note: "Required under Section 366 / URC-1",
    items: [
      "CA-certified statement of assets and liabilities (not older than 30 days)",
      "List of all partners, proposed shareholding and capital contribution",
      "List of creditors with their written consent / no-objection to conversion",
    ],
  },
  {
    icon: <FaShieldAlt />,
    title: "Registrar NOC & URC-2 Notice",
    note: "Statutory approvals & public notice",
    items: [
      "No-Objection Certificate from the Registrar where the LLP is registered",
      "Copy of Form URC-2 advertisement published in English and vernacular newspapers",
      "Declaration that the LLP has no pending prosecution or dues",
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
      "Notarized rent agreement between the owner and a director",
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

const LtopvtDocuments = () => {
  return (
    <section className="opcd-section" id="documents">
      <div className="opcd-container">

        {/* Header */}
        <div className="opcd-header">
          <h2 className="opcd-main-title">Documents Required to Convert an LLP into a Private Limited Company</h2>
          <p className="opcd-main-subtitle">Get these ready and we'll take care of the URC-1 + SPICe+ filing</p>
        </div>

        {/* Two columns */}
        <div className="opcd-columns">

          {/* Partner Documents */}
          <div className="opcd-column">
            <div className="opcd-col-header">
              <div className="opcd-col-header-icon"><FaUser /></div>
              <div>
                <h3 className="opcd-col-title">Partner / Director Documents</h3>
                <p className="opcd-col-subtitle">For every partner becoming a shareholder</p>
              </div>
            </div>
            <div className="opcd-col-body">
              {partnerDocs.map((doc, i) => (
                <DocItem key={i} doc={doc} />
              ))}
            </div>
          </div>

          {/* LLP & Office Documents */}
          <div className="opcd-column">
            <div className="opcd-col-header opcd-col-header--office">
              <div className="opcd-col-header-icon"><FaBuilding /></div>
              <div>
                <h3 className="opcd-col-title">LLP, Conversion & Office Documents</h3>
                <p className="opcd-col-subtitle">Section 366 records, NOC & office proof</p>
              </div>
            </div>
            <div className="opcd-col-body">
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

export default LtopvtDocuments;
