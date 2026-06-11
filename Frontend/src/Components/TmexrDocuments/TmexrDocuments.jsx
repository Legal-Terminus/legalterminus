import React from "react";
import "./TmexrDocuments.css";
import { FaFileAlt, FaUser, FaIdCard, FaFileSignature, FaTrademark, FaReceipt, FaBullhorn, FaCertificate } from "react-icons/fa";

const caseDocs = [
  {
    icon: <FaFileAlt />,
    title: "Examination Report",
    note: "The objection to be answered",
    items: [
      "Copy of the trademark examination report",
      "Trademark application number",
      "Date of receipt of the report (for the 30-day clock)",
    ],
  },
  {
    icon: <FaTrademark />,
    title: "Application & Mark Details",
    note: "What is on record",
    items: [
      "The mark as filed (word / logo)",
      "Class(es) and specification of goods/services",
      "Cited prior marks listed in the report (if any)",
    ],
  },
  {
    icon: <FaFileSignature />,
    title: "Authorisation",
    note: "Authorising us to act (Form TM-48)",
    items: [
      "Signed Power of Attorney (Form TM-48) — drafted by us",
      "Authorised signatory details for companies/firms",
    ],
  },
];

const evidenceDocs = [
  {
    icon: <FaIdCard />,
    title: "Applicant Identity",
    note: "For the proprietor on record",
    items: [
      "PAN of the applicant / proprietor / company",
      "Address proof of the applicant",
    ],
  },
  {
    icon: <FaReceipt />,
    title: "Evidence of Use",
    note: "For Section 9 (descriptiveness) replies",
    items: [
      "Date of first use of the mark",
      "Invoices, bills & sales figures showing the mark",
      "Brochures, labels & packaging bearing the mark",
    ],
  },
  {
    icon: <FaBullhorn />,
    title: "Promotion & Distinctiveness",
    note: "To prove acquired distinctiveness",
    items: [
      "Advertising & marketing material / spend",
      "Website, social media & media coverage",
      "Affidavit of use (Form TM-U), where required",
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

const TmexrDocuments = () => {
  return (
    <section className="opcd-section" id="documents">
      <div className="opcd-container">

        <div className="opcd-header">
          <h2 className="opcd-main-title">Documents Required for the Examination Reply</h2>
          <p className="opcd-main-subtitle">Get these ready and we'll take care of the rest</p>
        </div>

        <div className="opcd-columns">

          <div className="opcd-column">
            <div className="opcd-col-header">
              <div className="opcd-col-header-icon"><FaFileAlt /></div>
              <div>
                <h3 className="opcd-col-title">Case &amp; Application Documents</h3>
                <p className="opcd-col-subtitle">The report, the mark &amp; authorisation</p>
              </div>
            </div>
            <div className="opcd-col-body">
              {caseDocs.map((doc, i) => (
                <DocItem key={i} doc={doc} />
              ))}
            </div>
          </div>

          <div className="opcd-column">
            <div className="opcd-col-header opcd-col-header--office">
              <div className="opcd-col-header-icon"><FaCertificate /></div>
              <div>
                <h3 className="opcd-col-title">Identity &amp; Evidence Documents</h3>
                <p className="opcd-col-subtitle">Proof of use &amp; distinctiveness</p>
              </div>
            </div>
            <div className="opcd-col-body">
              {evidenceDocs.map((doc, i) => (
                <DocItem key={i} doc={doc} />
              ))}
            </div>
          </div>

        </div>

      </div>
    </section>
  );
};

export default TmexrDocuments;
