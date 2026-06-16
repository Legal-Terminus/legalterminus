import React from "react";
import "./PtopvtDocuments.css";
import { FaUser, FaUsers, FaIdCard, FaFileContract, FaNewspaper, FaBuilding, FaBalanceScale, FaFileAlt } from "react-icons/fa";

const applicantDocs = [
  {
    icon: <FaIdCard />,
    title: "Founder + 2nd Director / Shareholder Identity",
    note: "Both directors / subscribers",
    items: [
      "PAN + Aadhaar (mandatory linkage) of both directors / subscribers",
      "Latest passport-size photograph, email ID + mobile number",
      "Bank statement / utility bill (within 60 days) as residence proof",
      "DSC (Class-3 Individual, 2-year); DIR-3 KYC if existing director",
      "NRI directors: passport + overseas address proof",
    ],
  },
  {
    icon: <FaFileContract />,
    title: "URC-1 Statutory Pack",
    note: "Core conversion documentation",
    items: [
      "AUDITED Statement of Accounts (not older than 30 days from URC-1 filing)",
      "List of MEMBERS / partners with addresses + occupations + capital contribution",
      "List of CREDITORS with claim amounts + consent letters / NOCs",
      "Declaration of SOLVENCY by the proprietor (on stamp paper)",
      "Affidavits confirming compliance with Section 366 + consent resolutions",
    ],
  },
  {
    icon: <FaBalanceScale />,
    title: "Statutory Declarations + Stamp Duty + Add-Ons",
    note: "Declarations, stamp duty & optional add-ons",
    items: [
      "Form INC-9 (Declaration by each director + subscriber)",
      "Stamp duty on MOA + AOA per State rates (₹500 – ₹12,600)",
      "Stamp duty on Asset Transfer Agreement + TM-P assignment (Supreme / Supreme Plus)",
      "Section 115BAA Form 10-IC opt-in + DPIIT recognition (Supreme / Supreme Plus)",
    ],
  },
];

const officeDocs = [
  {
    icon: <FaNewspaper />,
    title: "URC-2 Advertisement Inputs",
    note: "For the mandatory newspaper notice",
    items: [
      "Proposed company name (post-name-reservation)",
      "Names of subscribers / proposed directors",
      "Principal place of business + brief business activity description",
      "State / UT where the proprietorship is situated (determines the vernacular newspaper)",
    ],
  },
  {
    icon: <FaBuilding />,
    title: "Registered Office + Proprietorship Records",
    note: "Office proof + existing registrations",
    items: [
      "Registered office proof — rent agreement OR ownership document",
      "NOC from owner (if rented) + latest utility bill (within 60 days)",
      "Proprietorship PAN, GSTIN, Udyam, Shop & Estd, Trade License, FSSAI, IEC",
      "Last 3 years' ITRs + GST returns + bank statements",
    ],
  },
  {
    icon: <FaFileAlt />,
    title: "MOA + AOA + Capital Structure Inputs",
    note: "Incorporation + capital structure",
    items: [
      "Proposed name (up to 4 options) + main object clauses",
      "Authorised + subscribed + paid-up share capital",
      "Shareholding split between proprietor + 2nd subscriber; share classes",
      "Custom AOA + SHA inputs (Supreme Plus — founder-vested, ESOP-ready)",
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
          <h2 className="opcd-main-title">Documents Required for Converting Proprietorship to a Pvt Ltd</h2>
          <p className="opcd-main-subtitle">Six categories. Documentation is heavier than a fresh Pvt Ltd incorporation because of URC-1 + URC-2 statutory requirements — audited statement, member / creditor lists with consents, declaration of solvency, multiple affidavits + 2nd-director KYC. We send a personalised checklist after the discovery call.</p>
        </div>

        <div className="opcd-columns">

          <div className="opcd-column">
            <div className="opcd-col-header">
              <div className="opcd-col-header-icon"><FaUser /></div>
              <div>
                <h3 className="opcd-col-title">Applicant &amp; Statutory Documents</h3>
                <p className="opcd-col-subtitle">Identity, URC-1 pack &amp; declarations</p>
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
                <p className="opcd-col-subtitle">URC-2 inputs, office proof &amp; MOA / AOA</p>
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
