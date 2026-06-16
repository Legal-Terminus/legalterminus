import React from "react";
import "./PtopvtDocuments.css";
import { FaUser, FaUsers, FaIdCard, FaFileContract, FaNewspaper, FaBuilding, FaBalanceScale, FaFileAlt } from "react-icons/fa";

const applicantDocs = [
  {
    icon: <FaIdCard />,
    title: "Directors & Shareholders KYC",
    note: "For the minimum two members/directors",
    items: [
      "PAN & Aadhaar of both members/directors",
      "Passport-size photographs & contact details",
      "DSC (Class-3) & DIN of the directors",
    ],
  },
  {
    icon: <FaFileContract />,
    title: "URC-1 Statutory Pack",
    note: "Core conversion documentation",
    items: [
      "Audited statement of accounts (not older than 30 days)",
      "List of members & creditors with consent / NOC",
      "Declaration of solvency & Section 366 affidavits",
    ],
  },
  {
    icon: <FaBalanceScale />,
    title: "Proprietorship Records",
    note: "Existing business proof",
    items: [
      "Proprietorship GST / Udyam / Shop & Establishment / Trade Licence",
      "Last 2–3 years' ITRs & bank statements",
      "List of assets, liabilities & ongoing contracts",
    ],
  },
];

const officeDocs = [
  {
    icon: <FaNewspaper />,
    title: "URC-2 Advertisement Inputs",
    note: "For the mandatory newspaper notice",
    items: [
      "Proposed company name (post-reservation)",
      "Names of directors & subscribers",
      "Principal place of business & State / UT (for vernacular paper)",
    ],
  },
  {
    icon: <FaBuilding />,
    title: "Registered Office Proof",
    note: "Address of the company",
    items: [
      "Utility bill of the premises (≤ 2 months)",
      "Rent agreement (if rented)",
      "No-Objection Certificate from the owner",
    ],
  },
  {
    icon: <FaFileAlt />,
    title: "MOA, AOA & Declarations",
    note: "Incorporation documents",
    items: [
      "MOA & AOA with object & capital clauses",
      "INC-9 declarations by directors & subscribers",
      "Asset-transfer / takeover agreement (stamped)",
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

const PtopvtDocuments = () => {
  return (
    <section className="opcd-section" id="documents">
      <div className="opcd-container">

        <div className="opcd-header">
          <h2 className="opcd-main-title">Documents Required to Convert Proprietorship to Private Limited</h2>
          <p className="opcd-main-subtitle">Heavier than a fresh incorporation due to URC-1 + URC-2 — we send a personalised checklist after the call</p>
        </div>

        <div className="opcd-columns">

          <div className="opcd-column">
            <div className="opcd-col-header">
              <div className="opcd-col-header-icon"><FaUser /></div>
              <div>
                <h3 className="opcd-col-title">Applicant &amp; Statutory Documents</h3>
                <p className="opcd-col-subtitle">Directors, URC-1 pack &amp; business proof</p>
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
                <h3 className="opcd-col-title">Notice, Office &amp; Incorporation Docs</h3>
                <p className="opcd-col-subtitle">URC-2 inputs, office proof &amp; MOA/AOA</p>
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

export default PtopvtDocuments;
