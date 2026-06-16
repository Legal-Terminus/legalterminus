import React from "react";
import "./PtollpDocuments.css";
import { FaUser, FaUsers, FaIdCard, FaFileContract, FaHandshake, FaBuilding, FaBalanceScale, FaFileAlt } from "react-icons/fa";

const partnerDocs = [
  {
    icon: <FaIdCard />,
    title: "Partner KYC",
    note: "For all partners of the firm",
    items: [
      "PAN & Aadhaar of all partners",
      "Passport-size photographs & contact details",
      "DSC & DPIN of the designated partners",
    ],
  },
  {
    icon: <FaHandshake />,
    title: "Existing Partnership Records",
    note: "Constitution of the firm",
    items: [
      "Partnership deed & any amendments",
      "Firm registration certificate (if registered)",
      "PAN of the partnership firm",
    ],
  },
  {
    icon: <FaBalanceScale />,
    title: "Statement of Accounts & Consents",
    note: "Core conversion documents",
    items: [
      "Statement of assets & liabilities certified by a CA",
      "List of all creditors with consent / NOC",
      "Up-to-date income tax returns of the firm",
    ],
  },
];

const officeDocs = [
  {
    icon: <FaBuilding />,
    title: "Registered Office Proof",
    note: "Address of the LLP",
    items: [
      "Utility bill of the premises (≤ 2 months)",
      "Rent agreement (if rented)",
      "No-Objection Certificate from the owner",
    ],
  },
  {
    icon: <FaFileContract />,
    title: "Conversion Forms",
    note: "Filed with the ROC",
    items: [
      "Form 17 (application for conversion)",
      "Form FiLLiP (LLP incorporation)",
      "Consent of all partners to convert",
    ],
  },
  {
    icon: <FaFileAlt />,
    title: "LLP Agreement & Declarations",
    note: "Post-registration filing",
    items: [
      "LLP agreement (drafted by us) for Form 3",
      "Profit-sharing, capital & management terms",
      "Stamped per the applicable state stamp duty",
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

const PtollpDocuments = () => {
  return (
    <section className="opcd-section" id="documents">
      <div className="opcd-container">

        <div className="opcd-header">
          <h2 className="opcd-main-title">Documents Required to Convert Partnership to LLP</h2>
          <p className="opcd-main-subtitle">Get these ready and we'll take care of the rest</p>
        </div>

        <div className="opcd-columns">

          <div className="opcd-column">
            <div className="opcd-col-header">
              <div className="opcd-col-header-icon"><FaUsers /></div>
              <div>
                <h3 className="opcd-col-title">Partner &amp; Firm Documents</h3>
                <p className="opcd-col-subtitle">KYC, deed &amp; statement of accounts</p>
              </div>
            </div>
            <div className="opcd-col-body">
              {partnerDocs.map((doc, i) => (
                <DocItem key={i} doc={doc} />
              ))}
            </div>
          </div>

          <div className="opcd-column">
            <div className="opcd-col-header opcd-col-header--office">
              <div className="opcd-col-header-icon"><FaBuilding /></div>
              <div>
                <h3 className="opcd-col-title">Office, Forms &amp; Agreement</h3>
                <p className="opcd-col-subtitle">Office proof, Form 17/FiLLiP &amp; LLP agreement</p>
              </div>
            </div>
            <div className="opcd-col-body">
              {officeDocs.map((doc, i) => (
                <DocItem key={i} doc={doc} />
              ))}
            </div>
          </div>

        </div>

      </div>
    </section>
  );
};

export default PtollpDocuments;
