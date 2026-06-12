import React from "react";
import "./DpvtDocuments.css";
import { FaBuilding, FaUsers, FaFileSignature, FaBalanceScale, FaUniversity, FaFileContract, FaIdCard, FaGavel } from "react-icons/fa";

const companyDocs = [
  {
    icon: <FaFileSignature />,
    title: "Company Records",
    note: "Core incorporation documents",
    items: [
      "Certificate of Incorporation (COI)",
      "MOA & AOA of the company",
      "PAN of the company",
    ],
  },
  {
    icon: <FaBalanceScale />,
    title: "Statement of Accounts (STK-8)",
    note: "Nil assets & liabilities",
    items: [
      "Statement of accounts dated within 30 days of filing",
      "Certified by a practising Chartered Accountant",
      "Confirmation of nil assets and nil liabilities",
    ],
  },
  {
    icon: <FaUniversity />,
    title: "Bank Closure Proof",
    note: "Company accounts must be closed",
    items: [
      "Bank account closure certificate",
      "Final bank statement showing nil balance",
    ],
  },
];

const directorDocs = [
  {
    icon: <FaIdCard />,
    title: "Director KYC",
    note: "For all directors",
    items: [
      "PAN & Aadhaar of all directors",
      "Active DIN & DSC of the signing director",
      "Updated mobile & email of directors",
    ],
  },
  {
    icon: <FaFileContract />,
    title: "Indemnity & Affidavit",
    note: "Signed by each director",
    items: [
      "Indemnity bond (Form STK-3) — drafted by us",
      "Affidavit (Form STK-4) — drafted by us",
      "Notarised on stamp paper",
    ],
  },
  {
    icon: <FaGavel />,
    title: "Resolutions & Consents",
    note: "Approving the closure",
    items: [
      "Board resolution approving strike-off",
      "Special resolution / consent of 75% members",
      "NOC from regulatory authority (if applicable)",
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

const DpvtDocuments = () => {
  return (
    <section className="opcd-section" id="documents">
      <div className="opcd-container">

        <div className="opcd-header">
          <h2 className="opcd-main-title">Documents Required to Dissolve a Private Limited Company</h2>
          <p className="opcd-main-subtitle">Get these ready and we'll take care of the rest</p>
        </div>

        <div className="opcd-columns">

          <div className="opcd-column">
            <div className="opcd-col-header">
              <div className="opcd-col-header-icon"><FaBuilding /></div>
              <div>
                <h3 className="opcd-col-title">Company &amp; Financial Documents</h3>
                <p className="opcd-col-subtitle">Incorporation, accounts &amp; bank closure</p>
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
                <h3 className="opcd-col-title">Director &amp; Approval Documents</h3>
                <p className="opcd-col-subtitle">KYC, indemnity &amp; resolutions</p>
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

export default DpvtDocuments;
