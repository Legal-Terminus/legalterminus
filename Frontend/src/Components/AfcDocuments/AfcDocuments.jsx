import React from "react";
import "./AfcDocuments.css";
import { FaBuilding, FaFileSignature, FaIdCard, FaBalanceScale, FaUsers, FaFileContract, FaStamp, FaBook } from "react-icons/fa";

const companyDocs = [
  {
    icon: <FaFileSignature />,
    title: "Incorporation & Registration",
    note: "Core company records",
    items: [
      "Certificate of Incorporation (COI)",
      "MOA & AOA of the company",
      "PAN of the company",
    ],
  },
  {
    icon: <FaBalanceScale />,
    title: "Audited Financial Statements",
    note: "For AOC-4 filing",
    items: [
      "Audited Balance Sheet & Profit and Loss account",
      "Auditor's Report & Notes to Accounts",
      "Director's Report for the financial year",
    ],
  },
  {
    icon: <FaBook />,
    title: "Statutory Registers & Minutes",
    note: "Corporate governance records",
    items: [
      "Board meeting & AGM minutes",
      "Registers of members, directors & charges",
      "Shareholding pattern & changes during the year",
    ],
  },
];

const directorDocs = [
  {
    icon: <FaIdCard />,
    title: "Director Details & KYC",
    note: "For MGT-7 & DIR-3 KYC",
    items: [
      "DIN, PAN & Aadhaar of all directors",
      "Updated mobile & email of directors",
      "Passport-size photographs (if required)",
    ],
  },
  {
    icon: <FaStamp />,
    title: "Digital Signatures (DSC)",
    note: "For MCA e-filing",
    items: [
      "Active DSC of authorised director(s)",
      "DSC of practising professional (where required)",
    ],
  },
  {
    icon: <FaFileContract />,
    title: "Auditor & Other Filings",
    note: "For ADT-1, DPT-3 & MSME-1",
    items: [
      "Auditor's appointment letter & consent (Form ADT-1)",
      "Details of deposits / loans (for DPT-3)",
      "Outstanding dues to MSME vendors (for MSME-1)",
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

const AfcDocuments = () => {
  return (
    <section className="opcd-section" id="documents">
      <div className="opcd-container">

        <div className="opcd-header">
          <h2 className="opcd-main-title">Documents Required for Company Annual Filing</h2>
          <p className="opcd-main-subtitle">Get these ready and we'll take care of the rest</p>
        </div>

        <div className="opcd-columns">

          <div className="opcd-column">
            <div className="opcd-col-header">
              <div className="opcd-col-header-icon"><FaBuilding /></div>
              <div>
                <h3 className="opcd-col-title">Company &amp; Financial Documents</h3>
                <p className="opcd-col-subtitle">Incorporation, accounts &amp; registers</p>
              </div>
            </div>
            <div className="opcd-col-body">
              {companyDocs.map((doc, i) => (
                <DocItem key={i} doc={doc} />
              ))}
            </div>
          </div>

          <div className="opcd-column">
            <div className="opcd-col-header opcd-col-header--office">
              <div className="opcd-col-header-icon"><FaUsers /></div>
              <div>
                <h3 className="opcd-col-title">Director, DSC &amp; Auditor Documents</h3>
                <p className="opcd-col-subtitle">KYC, signatures &amp; auditor details</p>
              </div>
            </div>
            <div className="opcd-col-body">
              {directorDocs.map((doc, i) => (
                <DocItem key={i} doc={doc} />
              ))}
            </div>
          </div>

        </div>

      </div>
    </section>
  );
};

export default AfcDocuments;
