import React from "react";
import "./PtpubDocument.css";
import {
  FaUser,
  FaBuilding,
  FaIdCard,
  FaFileAlt,
  FaCamera,
  FaFileSignature,
  FaGavel,
  FaListUl,
} from "react-icons/fa";

const directorDocs = [
  {
    icon: <FaIdCard />,
    title: "Director & Member Identity",
    note: "Mandatory for all directors & members (min 3 + 7)",
    items: [
      "Self-attested PAN card (mandatory)",
      "Self-attested Aadhaar",
      "Passport as ID for foreign nationals / NRI: notarized + apostilled copy",
    ],
  },
  {
    icon: <FaFileAlt />,
    title: "Address Proof (Per Person)",
    note: "Not older than 60 days from filing date",
    items: [
      "Self-attested bank statement OR gas bill OR mobile bill — not older than 60 days",
    ],
  },
  {
    icon: <FaCamera />,
    title: "DSC, DIN & Photographs",
    note: "For directors signing the conversion forms",
    items: [
      "Class 3 DSC for directors signing MGT-14 / INC-27",
      "DIN of existing directors; fresh DIN for any new director",
      "Latest passport-size photograph of each director / new member",
    ],
  },
];

const companyDocs = [
  {
    icon: <FaFileSignature />,
    title: "Company Constitution Documents",
    note: "Existing company records",
    items: [
      "Certificate of Incorporation of the Private Limited Company",
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
    note: "Filed with MGT-14 / INC-27",
    items: [
      "Altered MOA (name clause) & AOA (restrictions removed)",
      "Updated list of members and directors meeting the 7 / 3 minimum",
      "Latest audited financial statements, if required by the ROC",
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
  <div className="pubdoc-item">
    <div className="pubdoc-item-top">
      <div className="pubdoc-icon">{doc.icon}</div>
      <div className="pubdoc-meta">
        <h4 className="pubdoc-title">{doc.title}</h4>
        <span className="pubdoc-note">{doc.note}</span>
      </div>
    </div>
    <ul className="pubdoc-list">
      {doc.items.map((item, i) => (
        <li key={i} className="pubdoc-list-item">{item}</li>
      ))}
    </ul>
  </div>
);

const PtpubDocument = () => {
  return (
    <section className="pubdoc-section">
      <div className="pubdoc-container">

        {/* Header */}
        <div className="pubdoc-header">
          <h2 className="pubdoc-main-title">
            Documents Required to Convert a Private Limited into a Public Limited Company
          </h2>
          <p className="pubdoc-main-subtitle">Get these ready and we'll take care of the MGT-14 + INC-27 filing</p>
        </div>

        {/* Two columns */}
        <div className="pubdoc-columns">

          {/* Director / Member Documents */}
          <div className="pubdoc-column">
            <div className="pubdoc-col-header">
              <div className="pubdoc-col-header-icon"><FaUser /></div>
              <div>
                <h3 className="pubdoc-col-title">Director / Member Documents</h3>
                <p className="pubdoc-col-subtitle">For each director & member (min 3 + 7)</p>
              </div>
            </div>
            <div className="pubdoc-col-body">
              {directorDocs.map((doc, i) => (
                <DocItem key={i} doc={doc} />
              ))}
            </div>
          </div>

          {/* Company & Conversion Documents */}
          <div className="pubdoc-column">
            <div className="pubdoc-col-header pubdoc-col-header--office">
              <div className="pubdoc-col-header-icon"><FaBuilding /></div>
              <div>
                <h3 className="pubdoc-col-title">Company & Conversion Documents</h3>
                <p className="pubdoc-col-subtitle">Resolutions, altered charter & office proof</p>
              </div>
            </div>
            <div className="pubdoc-col-body">
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

export default PtpubDocument;
