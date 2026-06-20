import React from "react";
import "../OPCDocuments/OPCDocuments.css";
import { FaUser, FaBuilding, FaIdCard, FaCamera, FaFileSignature, FaFileAlt, FaListUl } from "react-icons/fa";

const directorDocs = [
  {
    icon: <FaIdCard />,
    title: "Director & Shareholder Identity",
    note: "Mandatory for every director & shareholder",
    items: [
      "Self-attested PAN card of each director / shareholder (mandatory)",
      "ID proof — Passport / Voter ID / Aadhaar / Driving Licence",
      "Passport for foreign nationals / NRI: notarized + apostilled copy",
    ],
  },
  {
    icon: <FaFileAlt />,
    title: "Address Proof (Per Person)",
    note: "Not older than 2 months from filing date",
    items: [
      "Bank statement OR electricity / mobile / telephone bill",
      "Statements and utility bills must be self-signed and recent",
    ],
  },
  {
    icon: <FaCamera />,
    title: "Photographs",
    note: "For all directors & shareholders",
    items: [
      "Latest passport-size photograph of each director / shareholder",
      "Soft copy in clear, recent format for the e-forms",
    ],
  },
];

const officeDocs = [
  {
    icon: <FaBuilding />,
    title: "Registered Office Proof",
    note: "Address of the company in Odisha",
    items: [
      "Latest electricity bill of the registered office (not older than 2 months)",
      "Rent agreement, if the premises are rented",
    ],
  },
  {
    icon: <FaFileSignature />,
    title: "Owner's NOC & Consent",
    note: "Where office is rented or owned by another",
    items: [
      "No Objection Certificate (NOC) from the property owner",
      "Owner's consent to use the premises as the registered office",
    ],
  },
  {
    icon: <FaListUl />,
    title: "Capital & Object Details",
    note: "To draft the MOA & AOA",
    items: [
      "Proposed authorized & paid-up capital and shareholding pattern",
      "Main business objects / activities of the company",
      "Up to 4 proposed company names in order of preference",
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

const CroDocuments = () => {
  return (
    <section className="opcd-section" id="documents">
      <div className="opcd-container">

        {/* Header */}
        <div className="opcd-header">
          <h2 className="opcd-main-title">Documents Required for Company Registration</h2>
          <p className="opcd-main-subtitle">Keep these ready and we'll handle the name approval, DSC, and SPICe+ filing</p>
        </div>

        {/* Two columns */}
        <div className="opcd-columns">

          {/* Director / Shareholder Documents */}
          <div className="opcd-column">
            <div className="opcd-col-header">
              <div className="opcd-col-header-icon"><FaUser /></div>
              <div>
                <h3 className="opcd-col-title">Director / Shareholder Documents</h3>
                <p className="opcd-col-subtitle">For each director & shareholder (min 2)</p>
              </div>
            </div>
            <div className="opcd-col-body">
              {directorDocs.map((doc, i) => (
                <DocItem key={i} doc={doc} />
              ))}
            </div>
          </div>

          {/* Registered Office & Company Documents */}
          <div className="opcd-column">
            <div className="opcd-col-header opcd-col-header--office">
              <div className="opcd-col-header-icon"><FaBuilding /></div>
              <div>
                <h3 className="opcd-col-title">Registered Office & Company Details</h3>
                <p className="opcd-col-subtitle">Office proof, NOC & capital details</p>
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

export default CroDocuments;
