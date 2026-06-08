import React from "react";
import "../CopyPvtDocument/CopyPvtDocument.css";
import { FaUser, FaBuilding, FaIdCard, FaFileAlt, FaBolt, FaFileContract, FaShieldAlt, FaHandshake } from "react-icons/fa";

const entityDocs = [
  {
    icon: <FaBuilding />,
    title: "Entity Identity",
    note: "Mandatory — the entity must be legally incorporated",
    items: [
      "Certificate of Incorporation (Pvt Ltd) OR LLP Agreement (LLP) OR Partnership Deed (Registered Firm)",
      "Entity PAN",
      "GSTIN (if registered)",
      "MSME / Udyam certificate (helps with credibility)",
      "Latest MoA / AoA / LLP Agreement amendments",
    ],
  },
  {
    icon: <FaUser />,
    title: "Authorised Signatory Identity",
    note: "For the person signing the DPIIT application",
    items: [
      "Aadhaar (mobile-linked) of authorised signatory",
      "PAN",
      "Class 3 DSC",
      "Designation letter / Board Resolution authorising signatory for DPIIT filings",
      "Email + mobile (used for portal registration)",
    ],
  },
  {
    icon: <FaFileAlt />,
    title: "Innovation Narrative & Business Plan",
    note: "The most critical document — generic write-ups get rejected",
    items: [
      "Brief description of business (50–500 words) + innovation thesis (300–1000 words)",
      "Pitch deck / business plan / problem-solution framework",
      "Scalability framework",
      "Quantified employment / wealth creation impact",
      "Customer validation / traction evidence",
    ],
  },
];

const founderDocs = [
  {
    icon: <FaShieldAlt />,
    title: "IP & Innovation Evidence",
    note: "Strengthens the application — not mandatory but recommended",
    items: [
      "Patents filed / granted (any)",
      "Trademarks filed / registered (any)",
      "Copyrights / design registrations",
      "Proprietary technology documentation",
      "Research publications / white papers",
      "Awards / accelerator selections / hackathon wins",
    ],
  },
  {
    icon: <FaBolt />,
    title: "Financial & Funding Profile",
    note: "Declared in the application — turnover must not exceed Rs.200 cr",
    items: [
      "Last 1–3 years' P&L + Balance Sheet (audited where applicable)",
      "Bank statements showing inward investment",
      "Term sheets / convertible notes / SAFE / SHA from prior fundraises",
      "Capitalisation table (current)",
      "Projected revenue + employment for next 3–5 years",
    ],
  },
  {
    icon: <FaHandshake />,
    title: "Authorisation & Customer Validation",
    note: "Supports application credibility and filing authority",
    items: [
      "Authorisation letter for DPIIT filing",
      "Customer testimonials / case studies / LOIs",
      "PO copies from large customers (if any)",
      "Media coverage / industry recognition",
      "Government contracts / pilots (if any)",
      "NGO / academic / corporate partnerships",
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

const StartupIndiaDocuments = () => {
  return (
    <section className="cpvd-section">
      <div className="cpvd-container">

        <div className="cpvd-header">
          <h2 className="cpvd-main-title">Documents Required for Startup India Registration</h2>
          <p className="cpvd-main-subtitle">Six categories. The innovation narrative is the most important deliverable — everything else is supporting documentation. We send a personalised checklist after the discovery call.</p>
        </div>

        <div className="cpvd-columns">

          <div className="cpvd-column">
            <div className="cpvd-col-header">
              <div className="cpvd-col-header-icon"><FaBuilding /></div>
              <div>
                <h3 className="cpvd-col-title">Entity & Innovation Documents</h3>
                <p className="cpvd-col-subtitle">Required for the startup entity and application</p>
              </div>
            </div>
            <div className="cpvd-col-body">
              {entityDocs.map((doc, i) => (
                <DocItem key={i} doc={doc} />
              ))}
            </div>
          </div>

          <div className="cpvd-column">
            <div className="cpvd-col-header cpvd-col-header--office">
              <div className="cpvd-col-header-icon"><FaIdCard /></div>
              <div>
                <h3 className="cpvd-col-title">IP, Financial & Validation Documents</h3>
                <p className="cpvd-col-subtitle">Supporting documents to strengthen the application</p>
              </div>
            </div>
            <div className="cpvd-col-body">
              {founderDocs.map((doc, i) => (
                <DocItem key={i} doc={doc} />
              ))}
            </div>
          </div>

        </div>

      </div>
    </section>
  );
};

export default StartupIndiaDocuments;
