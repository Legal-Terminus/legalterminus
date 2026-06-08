import React from "react";
import "../CopyPvtDocument/CopyPvtDocument.css";
import {
  FaBuilding,
  FaClipboardList,
  FaUsers,
  FaMapMarkerAlt,
  FaHandshake,
  FaFileAlt,
} from "react-icons/fa";

const leftDocs = [
  {
    icon: <FaBuilding />,
    title: "Business Identity",
    note: "Legal existence of the establishment",
    items: [
      "Entity PAN + Certificate of Incorporation / Partnership Deed / Proprietorship proof",
      "GST Certificate",
      "MSME / Udyam Certificate (critical for subsidy eligibility)",
      "Trade Licence / Factory Licence / Shop & Establishment Certificate",
    ],
  },
  {
    icon: <FaClipboardList />,
    title: "Existing Process Documentation",
    note: "We adapt rather than replace wherever possible",
    items: [
      "Any existing SOPs, work instructions, quality manuals",
      "ISO certificates (if renewing or upgrading)",
      "Audit reports (internal or external, if any)",
      "Whatever process documentation already exists",
    ],
  },
  {
    icon: <FaUsers />,
    title: "Organisational Structure",
    note: "Identification of Management Representative (MR) required",
    items: [
      "Org chart with designations + reporting lines",
      "List of all departments / functions",
      "Total employee count + breakdown by function",
      "Identification of Management Representative (MR) — the person who will own the QMS internally",
    ],
  },
];

const rightDocs = [
  {
    icon: <FaMapMarkerAlt />,
    title: "Premises Layout & Sites",
    note: "Each site in scope requires separate audit coverage",
    items: [
      "Office / factory layout plan",
      "List of all operational sites (multiple sites = multiple audits)",
      "For manufacturing: floor plan showing process flow + storage areas + waste management",
    ],
  },
  {
    icon: <FaHandshake />,
    title: "Customer & Supplier Profile",
    note: "As on registration date",
    items: [
      "List of top 10–20 customers (sector, volume, criticality)",
      "List of top 10–20 suppliers (critical inputs)",
      "Customer complaint register (if any)",
      "Customer satisfaction tracking method (if any)",
    ],
  },
  {
    icon: <FaFileAlt />,
    title: "Quality / Statutory Declarations",
    note: "We help draft these during implementation",
    items: [
      "Quality Policy statement (we will help draft)",
      "Top management commitment letter",
      "Compliance obligations list (legal / regulatory requirements applicable to your business)",
      "Risk register (we will help populate per Clause 6.1)",
    ],
  },
];

const DocItem = ({ doc }) => (
  <div className="cpvd-doc-item">
    <div className="cpvd-doc-item-top">
      <div className="cpvd-doc-icon">{doc.icon}</div>
      <div className="cpvd-doc-meta">
        <h4 className="cpvd-doc-title">{doc.title}</h4>
        <span className="cpvd-doc-note">{doc.note}</span>
      </div>
    </div>
    <ul className="cpvd-doc-list">
      {doc.items.map((item, i) => (
        <li key={i} className="cpvd-doc-list-item">{item}</li>
      ))}
    </ul>
  </div>
);

const IsoInfographic = () => {
  return (
    <section className="cpvd-section">
      <div className="cpvd-container">
        <div className="cpvd-header">
          <h2 className="cpvd-main-title">
            Documents Required for ISO Certification in India
          </h2>
          <p className="cpvd-main-subtitle">
            Six categories. Most documents come from the implementation (Quality Manual, SOPs, records); these are the inputs we need to start. We send a personalised checklist after the discovery call.
          </p>
        </div>

        <div className="cpvd-columns">
          <div className="cpvd-column">
            <div className="cpvd-col-header">
              <div className="cpvd-col-header-icon"><FaBuilding /></div>
              <div>
                <h3 className="cpvd-col-title">Business Identity, Processes &amp; People</h3>
                <p className="cpvd-col-subtitle">Registration proof, existing documentation &amp; org structure</p>
              </div>
            </div>
            <div className="cpvd-col-body">
              {leftDocs.map((doc, i) => (
                <DocItem key={i} doc={doc} />
              ))}
            </div>
          </div>

          <div className="cpvd-column">
            <div className="cpvd-col-header cpvd-col-header--office">
              <div className="cpvd-col-header-icon"><FaHandshake /></div>
              <div>
                <h3 className="cpvd-col-title">Premises, Customer Profile &amp; Declarations</h3>
                <p className="cpvd-col-subtitle">Site layout, stakeholder info &amp; quality declarations</p>
              </div>
            </div>
            <div className="cpvd-col-body">
              {rightDocs.map((doc, i) => (
                <DocItem key={i} doc={doc} />
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default IsoInfographic;
