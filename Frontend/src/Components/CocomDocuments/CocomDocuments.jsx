import React from "react";
import "./CocomDocuments.css";
import { FaFileSignature, FaUsers, FaIdCard, FaScroll, FaGavel, FaFileContract, FaBriefcase, FaClipboardList } from "react-icons/fa";

const companyDocs = [
  {
    icon: <FaFileSignature />,
    title: "Existing Company Records",
    note: "Current constitution",
    items: [
      "Certificate of Incorporation & CIN",
      "Existing MOA & AOA of the company",
      "PAN of the company",
    ],
  },
  {
    icon: <FaScroll />,
    title: "Proposed New Objects",
    note: "What you want to do",
    items: [
      "Description of the new business activity",
      "Draft of the new / amended object clause",
      "Reason for the change (for the explanatory statement)",
    ],
  },
  {
    icon: <FaClipboardList />,
    title: "Latest Filings",
    note: "Compliance status",
    items: [
      "Latest filed financial statements (AOC-4)",
      "Latest annual return (MGT-7)",
      "Shareholding pattern of the company",
    ],
  },
];

const approvalDocs = [
  {
    icon: <FaIdCard />,
    title: "Director KYC & DSC",
    note: "For filing the e-form",
    items: [
      "PAN & Aadhaar of directors",
      "Active DIN & DSC of the signing director",
      "Updated contact details of directors",
    ],
  },
  {
    icon: <FaGavel />,
    title: "Resolutions & Notices",
    note: "Approving the change",
    items: [
      "Board resolution approving the alteration",
      "EGM notice with explanatory statement",
      "Special resolution & EGM minutes",
    ],
  },
  {
    icon: <FaBriefcase />,
    title: "Altered MOA",
    note: "The amended memorandum",
    items: [
      "Altered Memorandum of Association (drafted by us)",
      "Stamped per state stamp duty",
      "Updated AOA cross-check (if needed)",
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

const CocomDocuments = () => {
  return (
    <section className="opcd-section" id="documents">
      <div className="opcd-container">

        <div className="opcd-header">
          <h2 className="opcd-main-title">Documents Required to Change the Object Clause</h2>
          <p className="opcd-main-subtitle">Get these ready and we'll take care of the rest</p>
        </div>

        <div className="opcd-columns">

          <div className="opcd-column">
            <div className="opcd-col-header">
              <div className="opcd-col-header-icon"><FaFileContract /></div>
              <div>
                <h3 className="opcd-col-title">Company &amp; New-Object Documents</h3>
                <p className="opcd-col-subtitle">Existing records &amp; proposed objects</p>
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
                <p className="opcd-col-subtitle">KYC, resolutions &amp; altered MOA</p>
              </div>
            </div>
            <div className="opcd-col-body">
              {approvalDocs.map((doc, i) => (
                <DocItem key={i} doc={doc} />
              ))}
            </div>
          </div>

        </div>

      </div>
    </section>
  );
};

export default CocomDocuments;
