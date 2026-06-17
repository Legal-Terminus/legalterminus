import React from "react";
import "./LtopvtDocuments.css";
import { FaUser, FaBuilding, FaIdCard, FaFileSignature, FaFileContract, FaNewspaper, FaFileAlt } from "react-icons/fa";

const partnerDocs = [
  {
    icon: <FaIdCard />,
    title: "All Partners' KYC + Identity",
    note: "Every partner — designated + non-designated",
    items: [
      "PAN + Aadhaar (mandatory linkage) of each partner",
      "Latest passport-size photograph, email + mobile (for OTP)",
      "Bank statement / utility bill (within 60 days) as residence proof",
      "DSC (Class-3 Individual, 2-year) — designated partners have DPIN-linked DSC; non-DPIN partners need fresh DSC",
      "NRI partners: passport + overseas address proof; DIR-3 KYC if existing director in any company",
    ],
  },
  {
    icon: <FaFileSignature />,
    title: "LLP Records + Compliance Currency",
    note: "Existing LLP records & filing history",
    items: [
      "LLP Agreement (original + all supplementary deeds)",
      "Certificate of Incorporation of the LLP + LLPIN",
      "Form 11 (Annual Returns) for ALL preceding FYs",
      "Form 8 (Statement of Account + Solvency) for ALL preceding FYs",
      "PAN of the LLP + GSTIN, Udyam, Shop & Estd, Trade License, FSSAI, IEC (where applicable)",
      "Last 3 years' LLP ITRs (Form ITR-5) + GST returns + bank statements",
    ],
  },
  {
    icon: <FaFileContract />,
    title: "URC-1 Statutory Pack",
    note: "Core conversion documentation",
    items: [
      "AUDITED Statement of Accounts of the LLP (not older than 30 DAYS from URC-1 filing — SEPARATE from the LLP's annual Form 8)",
      "CAPITAL CONTRIBUTION STATEMENT of each partner (per LLP Agreement)",
      "List of ALL partners with addresses + occupations + capital contribution + profit-sharing ratio",
      "List of CREDITORS with claim amounts + consent letters / NOCs",
      "Declaration of SOLVENCY signed by all partners (on stamp paper)",
      "UNANIMOUS RESOLUTION of consent of all partners",
      "Affidavits by each partner",
    ],
  },
];

const llpDocs = [
  {
    icon: <FaNewspaper />,
    title: "URC-2 Advertisement Inputs",
    note: "For the mandatory newspaper notice",
    items: [
      "Proposed Pvt Ltd name (post-name-reservation)",
      "Names of all partners (becoming subscribers / directors)",
      "LLPIN + Principal place of business (LLP's registered office)",
      "Brief description of business activity",
      "State / UT where LLP's registered office is situated (determines vernacular newspaper)",
      "We draft URC-2 + coordinate publication",
    ],
  },
  {
    icon: <FaBuilding />,
    title: "Registered Office Proof",
    note: "Address of the company",
    items: [
      "Address proof — rent agreement OR ownership document",
      "NOC from owner (if rented)",
      "Latest electricity / utility bill (within 60 days)",
      "Premises must be capable of receiving statutory notices (retaining the LLP's office simplifies migration)",
    ],
  },
  {
    icon: <FaFileAlt />,
    title: "MOA + AOA + Capital Structure + Declarations",
    note: "Incorporation + capital structure",
    items: [
      "Proposed name (up to 4 options) + main object clauses",
      "Authorised + subscribed + paid-up share capital",
      "Share allotment schedule per partner (proportionate to capital contributions)",
      "Custom AOA + SHA inputs (Supreme Plus — reflecting LLP terms, ESOP-ready)",
      "Form INC-9 + stamp duty on MOA / AOA + Asset Transfer Agreement at State actuals",
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

const LtopvtDocuments = () => {
  return (
    <section className="opcd-section" id="documents">
      <div className="opcd-container">

        {/* Header */}
        <div className="opcd-header">
          <h2 className="opcd-main-title">Documents Required to Convert an LLP into a Pvt Ltd</h2>
          <p className="opcd-main-subtitle">Six categories. Documentation is heavier than a fresh Pvt Ltd incorporation because of URC-1 + URC-2 + LLP Agreement + Form 8 / Form 11 currency + capital contribution statements + all partners' KYC. We send a personalised checklist after the discovery call.</p>
        </div>

        {/* Two columns */}
        <div className="opcd-columns">

          {/* Partner & Statutory Documents */}
          <div className="opcd-column">
            <div className="opcd-col-header">
              <div className="opcd-col-header-icon"><FaUser /></div>
              <div>
                <h3 className="opcd-col-title">Partner &amp; Statutory Documents</h3>
                <p className="opcd-col-subtitle">All partners' KYC, LLP records &amp; URC-1 pack</p>
              </div>
            </div>
            <div className="opcd-col-body">
              {partnerDocs.map((doc, i) => (
                <DocItem key={i} doc={doc} />
              ))}
            </div>
          </div>

          {/* Notice, Office & Incorporation Documents */}
          <div className="opcd-column">
            <div className="opcd-col-header opcd-col-header--office">
              <div className="opcd-col-header-icon"><FaBuilding /></div>
              <div>
                <h3 className="opcd-col-title">Notice, Office &amp; Incorporation Docs</h3>
                <p className="opcd-col-subtitle">URC-2 inputs, office proof &amp; MOA / AOA</p>
              </div>
            </div>
            <div className="opcd-col-body">
              {llpDocs.map((doc, i) => (
                <DocItem key={i} doc={doc} />
              ))}
            </div>
          </div>

        </div>

      </div>
    </section>
  );
};

export default LtopvtDocuments;
