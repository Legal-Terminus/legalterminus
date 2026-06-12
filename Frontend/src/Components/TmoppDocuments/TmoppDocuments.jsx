import React from "react";
import "./TmoppDocuments.css";
import { FaFileAlt, FaUser, FaIdCard, FaFileSignature, FaTrademark, FaReceipt, FaBalanceScale, FaBullhorn } from "react-icons/fa";

const caseDocs = [
  {
    icon: <FaTrademark />,
    title: "Mark & Application Details",
    note: "The marks in dispute",
    items: [
      "Your trademark (number / certificate, if registered)",
      "The opposed / opposing mark & application number",
      "Class(es) and goods/services involved",
    ],
  },
  {
    icon: <FaFileAlt />,
    title: "Opposition Papers",
    note: "Depending on your side",
    items: [
      "Notice of Opposition received (if defending), or",
      "Journal page of the mark to be opposed (if opposing)",
      "Date of receipt / publication (for the deadline)",
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
    title: "Party Identity",
    note: "For opponent / applicant on record",
    items: [
      "PAN & address proof of the party",
      "Entity registration proof (company/firm)",
      "Email & mobile for correspondence",
    ],
  },
  {
    icon: <FaReceipt />,
    title: "Evidence of Use & Reputation",
    note: "The core of the case",
    items: [
      "Date of first use of your mark",
      "Invoices, sales figures & turnover under the mark",
      "Advertising spend, brochures & media coverage",
    ],
  },
  {
    icon: <FaBalanceScale />,
    title: "Supporting Legal Documents",
    note: "Filed by affidavit",
    items: [
      "Affidavit deposing to use & reputation",
      "Prior registrations / applications relied upon",
      "Any cease-and-desist or coexistence correspondence",
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

const TmoppDocuments = () => {
  return (
    <section className="opcd-section" id="documents">
      <div className="opcd-container">

        <div className="opcd-header">
          <h2 className="opcd-main-title">Documents Required for a Trademark Opposition</h2>
          <p className="opcd-main-subtitle">Get these ready and we'll take care of the rest</p>
        </div>

        <div className="opcd-columns">

          <div className="opcd-column">
            <div className="opcd-col-header">
              <div className="opcd-col-header-icon"><FaFileAlt /></div>
              <div>
                <h3 className="opcd-col-title">Case &amp; Mark Documents</h3>
                <p className="opcd-col-subtitle">The marks, papers &amp; authorisation</p>
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
              <div className="opcd-col-header-icon"><FaBullhorn /></div>
              <div>
                <h3 className="opcd-col-title">Identity &amp; Evidence Documents</h3>
                <p className="opcd-col-subtitle">Use, reputation &amp; affidavits</p>
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

export default TmoppDocuments;
