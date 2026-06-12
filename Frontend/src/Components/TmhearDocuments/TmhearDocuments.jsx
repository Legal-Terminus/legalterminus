import React from "react";
import "./TmhearDocuments.css";
import { FaFileAlt, FaUser, FaIdCard, FaFileSignature, FaTrademark, FaReceipt, FaGavel, FaBullhorn } from "react-icons/fa";

const caseDocs = [
  {
    icon: <FaGavel />,
    title: "Hearing Notice",
    note: "Sets the date & matter",
    items: [
      "Copy of the hearing notice from the Registry",
      "Trademark application number",
      "Hearing date & mode (video conference link)",
    ],
  },
  {
    icon: <FaFileAlt />,
    title: "Underlying Record",
    note: "What the hearing is about",
    items: [
      "Examination report & filed reply (show-cause), or",
      "Notice of opposition, counter-statement & evidence",
      "Cited prior marks / opposition grounds",
    ],
  },
  {
    icon: <FaFileSignature />,
    title: "Authorisation",
    note: "Authorising us to appear (Form TM-48)",
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
      "Email & mobile for correspondence",
    ],
  },
  {
    icon: <FaReceipt />,
    title: "Evidence of Use",
    note: "To support your arguments",
    items: [
      "Date of first use of the mark",
      "Invoices, sales figures & turnover under the mark",
      "Brochures, labels & packaging bearing the mark",
    ],
  },
  {
    icon: <FaBullhorn />,
    title: "Promotion & Distinctiveness",
    note: "To establish reputation",
    items: [
      "Advertising & marketing material / spend",
      "Website, social media & media coverage",
      "Affidavit of use, where required",
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

const TmhearDocuments = () => {
  return (
    <section className="opcd-section" id="documents">
      <div className="opcd-container">

        <div className="opcd-header">
          <h2 className="opcd-main-title">Documents Required for a Trademark Hearing</h2>
          <p className="opcd-main-subtitle">Get these ready and we'll take care of the rest</p>
        </div>

        <div className="opcd-columns">

          <div className="opcd-column">
            <div className="opcd-col-header">
              <div className="opcd-col-header-icon"><FaGavel /></div>
              <div>
                <h3 className="opcd-col-title">Case &amp; Hearing Documents</h3>
                <p className="opcd-col-subtitle">Notice, record &amp; authorisation</p>
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
              <div className="opcd-col-header-icon"><FaTrademark /></div>
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

export default TmhearDocuments;
