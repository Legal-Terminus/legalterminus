import React from "react";
import "./TmarkDocuments.css";
import { FaUser, FaBuilding, FaIdCard, FaTrademark, FaFileSignature, FaCertificate, FaImage, FaClipboardList } from "react-icons/fa";

const applicantDocs = [
  {
    icon: <FaIdCard />,
    title: "Applicant Identity",
    note: "Varies by applicant type",
    items: [
      "INDIVIDUALS (sole proprietors, in personal name — 50% rebate): PAN + Aadhaar + photograph + residence address proof",
      "COMPANIES / LLPs / PARTNERSHIPS: entity PAN + Certificate of Incorporation / Partnership Deed + authorised signatory PAN + KYC + DSC (Class 3) + authorisation letter / Board Resolution",
      "STARTUPS (DPIIT-recognised — 50% rebate): DPIIT Startup India Recognition Certificate",
    ],
  },
  {
    icon: <FaTrademark />,
    title: "Brand / Mark Details",
    note: "The mark you want to protect",
    items: [
      "MARK image in JPG / PNG (high resolution; transparent background preferred)",
      "WORDMARK: exact spelling + font / typeface; LOGO: design / device file; COMBINATION: text + image as one composite",
      "Tagline (if part of mark); Colour scheme (if mark is colour-claimed)",
      "Any special characteristics (3D mark, sound mark, motion mark — rare)",
    ],
  },
  {
    icon: <FaClipboardList />,
    title: "Goods / Services + Class Identification",
    note: "Determines protection scope",
    items: [
      "Detailed list of GOODS and / or SERVICES for which the mark will be registered",
      "Each item mapped to the correct Nice Class (1–34 goods / 35–45 services)",
      "The goods / services description determines your protection scope — we draft it carefully",
      "Multi-class applications listed separately",
    ],
  },
];

const markDocs = [
  {
    icon: <FaFileSignature />,
    title: "Power of Attorney (Form TM-48)",
    note: "Authorising us to file + prosecute",
    items: [
      "POWER OF ATTORNEY in favour of our trademark agent / firm — authorising us to file + prosecute the application",
      "Format shared by us; signed by the applicant (or authorised signatory for entities) on appropriate stamp paper (typically ₹100)",
      "We draft + provide for signature",
    ],
  },
  {
    icon: <FaImage />,
    title: "Prior-Use Evidence Pack",
    note: "Required where claiming prior use",
    items: [
      "USER AFFIDAVIT (sworn statement) declaring date of first use + goods / services + extent of use",
      "EVIDENCE: invoices, advertisements, social media handles + post screenshots, website domain + WHOIS records, GST returns + commercial records, packaging samples, third-party endorsements / news coverage, e-commerce listings",
      "We coordinate; you provide source documents",
    ],
  },
  {
    icon: <FaCertificate />,
    title: "MSME / DPIIT / Individual Status (Fee Rebate)",
    note: "For the 50% government-fee rebate",
    items: [
      "UDYAM REGISTRATION CERTIFICATE (for MSMEs — any size: Micro / Small / Medium)",
      "OR DPIIT STARTUP INDIA RECOGNITION CERTIFICATE (for startups)",
      "OR for individuals filing in personal name — PAN + Aadhaar as evidence",
      "Supreme tier helps with Udyam application / renewal where you don't have one. Material saving: ₹4,500 vs ₹9,000 per class",
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

const TmarkDocuments = () => {
  return (
    <section className="opcd-section" id="documents">
      <div className="opcd-container">

        <div className="opcd-header">
          <h2 className="opcd-main-title">Documents Required for Trademark Registration in India</h2>
          <p className="opcd-main-subtitle">Six categories. Documentation is moderate — applicant identity + mark details + class + POA + (if prior-use) user affidavit + evidence + (if MSME / Startup) Udyam / DPIIT certificate. We send a personalised checklist after the discovery call.</p>
        </div>

        <div className="opcd-columns">

          <div className="opcd-column">
            <div className="opcd-col-header">
              <div className="opcd-col-header-icon"><FaUser /></div>
              <div>
                <h3 className="opcd-col-title">Applicant, Mark &amp; Class</h3>
                <p className="opcd-col-subtitle">Identity, brand details &amp; goods / services</p>
              </div>
            </div>
            <div className="opcd-col-body">
              {applicantDocs.map((doc, i) => (
                <DocItem key={i} doc={doc} />
              ))}
            </div>
          </div>

          <div className="opcd-column">
            <div className="opcd-col-header opcd-col-header--office">
              <div className="opcd-col-header-icon"><FaBuilding /></div>
              <div>
                <h3 className="opcd-col-title">POA, Evidence &amp; Fee Rebate</h3>
                <p className="opcd-col-subtitle">TM-48, prior-use proof &amp; MSME / DPIIT</p>
              </div>
            </div>
            <div className="opcd-col-body">
              {markDocs.map((doc, i) => (
                <DocItem key={i} doc={doc} />
              ))}
            </div>
          </div>

        </div>

      </div>
    </section>
  );
};

export default TmarkDocuments;
