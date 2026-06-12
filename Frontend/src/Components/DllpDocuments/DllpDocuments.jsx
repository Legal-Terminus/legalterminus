import React from "react";
import "./DllpDocuments.css";
import { FaBuilding, FaUsers, FaFileSignature, FaBalanceScale, FaUniversity, FaFileContract, FaIdCard, FaHandshake } from "react-icons/fa";

const llpDocs = [
  {
    icon: <FaFileSignature />,
    title: "LLP Records",
    note: "Core incorporation documents",
    items: [
      "Certificate of Incorporation of the LLP",
      "LLP Agreement & any supplementary agreements",
      "PAN of the LLP",
    ],
  },
  {
    icon: <FaBalanceScale />,
    title: "Statement of Accounts",
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
    note: "LLP account must be closed",
    items: [
      "Bank account closure certificate",
      "Final bank statement showing nil balance",
      "Copy of the latest income tax return (ITR-5)",
    ],
  },
];

const partnerDocs = [
  {
    icon: <FaIdCard />,
    title: "Partner KYC",
    note: "For all designated partners",
    items: [
      "PAN & Aadhaar of all partners",
      "Active DPIN/DIN & DSC of the signing partner",
      "Updated mobile & email of partners",
    ],
  },
  {
    icon: <FaFileContract />,
    title: "Affidavit & Indemnity",
    note: "Signed by each designated partner",
    items: [
      "Affidavit declaring liabilities are settled",
      "Indemnity bond by designated partners",
      "Notarised on stamp paper",
    ],
  },
  {
    icon: <FaHandshake />,
    title: "Consent & Approvals",
    note: "Approving the closure",
    items: [
      "Consent of all partners to the strike-off",
      "Resolution / authority to file Form 24",
      "NOC / consent from creditors (if applicable)",
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

const DllpDocuments = () => {
  return (
    <section className="opcd-section" id="documents">
      <div className="opcd-container">

        <div className="opcd-header">
          <h2 className="opcd-main-title">Documents Required to Dissolve an LLP</h2>
          <p className="opcd-main-subtitle">Get these ready and we'll take care of the rest</p>
        </div>

        <div className="opcd-columns">

          <div className="opcd-column">
            <div className="opcd-col-header">
              <div className="opcd-col-header-icon"><FaBuilding /></div>
              <div>
                <h3 className="opcd-col-title">LLP &amp; Financial Documents</h3>
                <p className="opcd-col-subtitle">Incorporation, accounts &amp; bank closure</p>
              </div>
            </div>
            <div className="opcd-col-body">
              {llpDocs.map((doc, i) => (
                <DocItem key={i} doc={doc} />
              ))}
            </div>
          </div>

          <div className="opcd-column">
            <div className="opcd-col-header opcd-col-header--office">
              <div className="opcd-col-header-icon"><FaUsers /></div>
              <div>
                <h3 className="opcd-col-title">Partner &amp; Approval Documents</h3>
                <p className="opcd-col-subtitle">KYC, affidavit &amp; consent</p>
              </div>
            </div>
            <div className="opcd-col-body">
              {partnerDocs.map((doc, i) => (
                <DocItem key={i} doc={doc} />
              ))}
            </div>
          </div>

        </div>

      </div>
    </section>
  );
};

export default DllpDocuments;
