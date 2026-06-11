import React from "react";
import "./TmrnwDocuments.css";
import { FaUser, FaBuilding, FaIdCard, FaTrademark, FaFileSignature, FaCertificate, FaCalendarAlt, FaExchangeAlt } from "react-icons/fa";

const markDocs = [
  {
    icon: <FaCertificate />,
    title: "Trademark Registration Proof",
    note: "Identifies the mark to be renewed",
    items: [
      "Trademark Registration Certificate, or",
      "Trademark application / registration number",
      "Class(es) in which the mark is registered",
    ],
  },
  {
    icon: <FaTrademark />,
    title: "The Mark Details",
    note: "For verification against the register",
    items: [
      "Brand name / word mark as registered",
      "Logo / device as registered (if applicable)",
      "Original date of registration",
    ],
  },
  {
    icon: <FaCalendarAlt />,
    title: "Expiry / Renewal Date",
    note: "To determine the renewal route",
    items: [
      "Current expiry date of the registration",
      "Confirmation of any prior renewals",
    ],
  },
];

const applicantDocs = [
  {
    icon: <FaIdCard />,
    title: "Proprietor Identity",
    note: "For the registered owner",
    items: [
      "PAN of the proprietor / company / firm",
      "Address proof of the registered proprietor",
      "Email & mobile for correspondence",
    ],
  },
  {
    icon: <FaFileSignature />,
    title: "Power of Attorney",
    note: "Authorising us to file (Form TM-48)",
    items: [
      "Signed Power of Attorney (Form TM-48) — drafted by us",
      "Authorised signatory details for companies/firms",
    ],
  },
  {
    icon: <FaExchangeAlt />,
    title: "Change Details (if any)",
    note: "If proprietor name/address has changed",
    items: [
      "Updated name / address of the proprietor",
      "Supporting proof of the change (if applicable)",
      "Details of any assignment since registration",
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

const TmrnwDocuments = () => {
  return (
    <section className="opcd-section" id="documents">
      <div className="opcd-container">

        <div className="opcd-header">
          <h2 className="opcd-main-title">Documents Required for Trademark Renewal</h2>
          <p className="opcd-main-subtitle">Get these ready and we'll take care of the rest</p>
        </div>

        <div className="opcd-columns">

          <div className="opcd-column">
            <div className="opcd-col-header">
              <div className="opcd-col-header-icon"><FaTrademark /></div>
              <div>
                <h3 className="opcd-col-title">Trademark &amp; Registration Documents</h3>
                <p className="opcd-col-subtitle">The mark, its number &amp; expiry</p>
              </div>
            </div>
            <div className="opcd-col-body">
              {markDocs.map((doc, i) => (
                <DocItem key={i} doc={doc} />
              ))}
            </div>
          </div>

          <div className="opcd-column">
            <div className="opcd-col-header opcd-col-header--office">
              <div className="opcd-col-header-icon"><FaUser /></div>
              <div>
                <h3 className="opcd-col-title">Proprietor &amp; Authorisation Documents</h3>
                <p className="opcd-col-subtitle">Owner identity, POA &amp; changes</p>
              </div>
            </div>
            <div className="opcd-col-body">
              {applicantDocs.map((doc, i) => (
                <DocItem key={i} doc={doc} />
              ))}
            </div>
          </div>

        </div>

      </div>
    </section>
  );
};

export default TmrnwDocuments;
