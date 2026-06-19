import React from "react";
import "./TmexrDocuments.css";
import { FaFileAlt, FaUser, FaIdCard, FaFileSignature, FaTrademark, FaReceipt, FaBullhorn } from "react-icons/fa";

const caseDocs = [
  {
    icon: <FaFileAlt />,
    title: "Examination Report + Original Application",
    text: "ORIGINAL Examination Report PDF (downloaded from IP India portal). Date of receipt of the ER (critical for 30-day deadline tracking). Original TM Application (Form TM-A as filed) + acknowledgement + class(es) applied + mark image as filed. Used as the foundation for the reply.",
  },
  {
    icon: <FaIdCard />,
    title: "Applicant Identity + Existing Authorisation",
    text: "For INDIVIDUAL applicants: PAN + Aadhaar + photograph. For COMPANIES / LLPs / PARTNERSHIPS: entity PAN + Certificate of Incorporation + authorised signatory PAN + DSC (Class 3). Existing Power of Attorney with current attorney (if Elemental — we verify LT is on record).",
  },
  {
    icon: <FaFileSignature />,
    title: "Power of Attorney (Form TM-48) + Authorization Letter",
    text: "For ATTORNEY CHANGE cases: Power of Attorney (FORM TM-48) executed by the applicant in favour of LT's associated Attorney. Authorisation Letter (for entity applicants) confirming the signatory's authority to execute POA. WE DRAFT both documents; you sign on ₹100 stamp paper. We coordinate stamping. Not required for Elemental.",
  },
];

const evidenceDocs = [
  {
    icon: <FaReceipt />,
    title: "Use Evidence (For Section 9 Replies)",
    text: "Where the objection is on absolute grounds (Section 9 — distinctiveness): EVIDENCE OF USE — invoices showing the mark in commerce, advertising / marketing collateral, social media presence, website screenshots, market presence statements, sales data / GST returns showing brand revenue, customer testimonials. The stronger the use evidence, the stronger the acquired distinctiveness argument.",
  },
  {
    icon: <FaTrademark />,
    title: "Distinguishing Evidence + Co-existence (For Section 11 Replies)",
    text: "Where the objection cites earlier marks (Section 11 — similarity): COMPARATIVE ANALYSIS of the cited marks (phonetic / visual / structural / conceptual differences), class / goods / market difference analysis, co-existence agreements with prior mark holders (if obtainable), evidence of peaceful market co-existence, consumer-confusion analysis (if any market research done).",
  },
  {
    icon: <FaBullhorn />,
    title: "Hearing Preparation Documents",
    text: "For SHOW CAUSE HEARING preparation: written submissions / brief, evidence compilation in bound paper-book format, case-law citations with relevant paragraphs marked, prior decisions from the same Hearing Officer (if available), authorised representative confirmation. We prepare all of these; the client provides the underlying evidence inputs.",
  },
];

const DocItem = ({ doc }) => (
  <div className="opcd-doc-item">
    <div className="opcd-doc-item-top">
      <div className="opcd-doc-icon">{doc.icon}</div>
      <div className="opcd-doc-meta">
        <h4 className="opcd-doc-title">{doc.title}</h4>
      </div>
    </div>
    <p className="tmexr-doc-text">{doc.text}</p>
  </div>
);

const TmexrDocuments = () => {
  return (
    <section className="opcd-section" id="documents">
      <div className="opcd-container">

        <div className="opcd-header">
          <h2 className="opcd-main-title">Documents Required for Reply of Examination Report in India</h2>
          <p className="opcd-main-subtitle">Six categories. The reply documentation depends on the type of objection raised. We send a personalised checklist after the discovery call once we've analysed your ER.</p>
        </div>

        <div className="opcd-columns">

          <div className="opcd-column">
            <div className="opcd-col-header">
              <div className="opcd-col-header-icon"><FaFileAlt /></div>
              <div>
                <h3 className="opcd-col-title">Report, Identity &amp; POA</h3>
                <p className="opcd-col-subtitle">The ER, applicant &amp; authorisation</p>
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
              <div className="opcd-col-header-icon"><FaUser /></div>
              <div>
                <h3 className="opcd-col-title">Evidence &amp; Hearing Prep</h3>
                <p className="opcd-col-subtitle">Section 9 / 11 evidence &amp; hearing docs</p>
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
