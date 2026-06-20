import React from "react";
import "./PubpvtDocuments.css";
import { FaUser, FaBuilding, FaIdCard, FaCamera, FaFileSignature, FaGavel, FaListUl, FaNewspaper, FaFileAlt } from "react-icons/fa";

const directorDocs = [
  {
    icon: <FaIdCard />,
    title: "Director & Member Identity",
    note: "Mandatory for all directors & members (min 2 + 2)",
    items: [
      "Self-attested PAN card of each director / member (mandatory)",
      "Self-attested Aadhaar",
      "Passport for foreign nationals / NRI: notarized + apostilled copy",
    ],
  },
  {
    icon: <FaFileAlt />,
    title: "Address Proof (Per Person)",
    note: "Not older than 60 days from filing date",
    items: [
      "Bank statement OR electricity bill OR mobile bill — not older than 2 months",
      "Voter ID / Driving Licence / Passport as additional address proof",
    ],
  },
  {
    icon: <FaCamera />,
    title: "DSC, DIN & Photographs",
    note: "For directors signing the conversion forms",
    items: [
      "Class 3 DSC for directors signing MGT-14 / RD-1 / INC-28",
      "DIN of all directors",
      "Latest passport-size photograph of each director",
    ],
  },
];

const companyDocs = [
  {
    icon: <FaFileSignature />,
    title: "Company Constitution Documents",
    note: "Existing company records",
    items: [
      "Certificate of Incorporation of the Public Limited Company",
      "Current Memorandum & Articles of Association (MOA & AOA)",
      "CIN and copies of recent AOC-4 & MGT-7 filings",
    ],
  },
  {
    icon: <FaGavel />,
    title: "Resolutions & Meeting Records",
    note: "Core conversion documentation",
    items: [
      "Board resolution approving the conversion & fixing the EGM",
      "Special resolution passed at the EGM (Section 14)",
      "Notice of EGM with explanatory statement under Section 102",
    ],
  },
  {
    icon: <FaListUl />,
    title: "Altered Charter & Member List",
    note: "Filed with MGT-14 / RD-1",
    items: [
      "Altered MOA (name clause) & AOA (private restrictions added)",
      "Updated list of members and directors (min 2 + 2)",
      "Latest audited financial statements & a declaration of no default / dues",
    ],
  },
  {
    icon: <FaNewspaper />,
    title: "RD Application & Notice Pack",
    note: "For RD-1 & INC-25A",
    items: [
      "Form RD-1 application to the Regional Director",
      "Form INC-25A newspaper advertisement copies (English + vernacular)",
      "Proof of individual notice to creditors, the ROC & the RD, with consents / NOCs",
    ],
  },
  {
    icon: <FaBuilding />,
    title: "Registered Office Proof",
    note: "Latest utility bill (not older than 2 months)",
    items: [
      "Electricity / water / gas bill of the registered office",
      "NOC from owner + rent agreement, if the premises are rented",
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

const PubpvtDocuments = () => {
  return (
    <section className="opcd-section" id="documents">
      <div className="opcd-container">

        {/* Header */}
        <div className="opcd-header">
          <h2 className="opcd-main-title">Documents Required to Convert a Public Limited into a Private Limited Company</h2>
          <p className="opcd-main-subtitle">Get these ready and we'll take care of the MGT-14 + RD-1 + INC-28 filing</p>
        </div>

        {/* Two columns */}
        <div className="opcd-columns">

          {/* Director / Member Documents */}
          <div className="opcd-column">
            <div className="opcd-col-header">
              <div className="opcd-col-header-icon"><FaUser /></div>
              <div>
                <h3 className="opcd-col-title">Director / Member Documents</h3>
                <p className="opcd-col-subtitle">For each director & member (min 2 + 2)</p>
              </div>
            </div>
            <div className="opcd-col-body">
              {directorDocs.map((doc, i) => (
                <DocItem key={i} doc={doc} />
              ))}
            </div>
          </div>

          {/* Company & Conversion Documents */}
          <div className="opcd-column">
            <div className="opcd-col-header opcd-col-header--office">
              <div className="opcd-col-header-icon"><FaBuilding /></div>
              <div>
                <h3 className="opcd-col-title">Company & Conversion Documents</h3>
                <p className="opcd-col-subtitle">Resolutions, RD application & office proof</p>
              </div>
            </div>
            <div className="opcd-col-body">
              {companyDocs.map((doc, i) => (
                <DocItem key={i} doc={doc} />
              ))}
            </div>
          </div>

        </div>

      </div>
    </section>
  );
};

export default PubpvtDocuments;
