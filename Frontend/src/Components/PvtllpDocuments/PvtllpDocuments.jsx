import React from "react";
import "./PvtllpDocuments.css";
import { FaUser, FaBuilding, FaIdCard, FaFileSignature, FaFileContract, FaShieldAlt, FaBalanceScale } from "react-icons/fa";

const partnerDocs = [
  {
    icon: <FaIdCard />,
    title: "All Shareholders' KYC + Identity",
    note: "Every shareholder becoming a partner",
    items: [
      "PAN + Aadhaar (mandatory linkage) of each shareholder",
      "Latest passport-size photograph, email + mobile (for OTP)",
      "Bank statement / utility bill (within 60 days) as residence proof",
      "DSC (Class-3 Individual, 2-year) — existing director DSCs may carry over via DPIN",
      "NRI / foreign shareholders: passport + overseas address proof + FEMA compliance check",
    ],
  },
  {
    icon: <FaFileSignature />,
    title: "Company Identity + Corporate Records",
    note: "Existing company records",
    items: [
      "Company's CIN + PAN + TAN; Certificate of Incorporation + any alteration certificates",
      "Current Memorandum + Articles of Association",
      "Last 3 years' MGT-7 + audited financial statements + Directors' Report + Auditor's Report",
      "List of directors (DIN + DSC) + list of all SHAREHOLDERS with PAN + shareholding %",
      "Statutory registers (members, directors, charges, SBO, related parties) + Form CHG-7",
    ],
  },
  {
    icon: <FaFileContract />,
    title: "EGM + Resolution Pack",
    note: "Board & shareholder approvals",
    items: [
      "Notice of Board Meeting + minutes approving conversion + EGM convening",
      "Notice of EGM + Explanatory Statement (Section 102) sent to shareholders",
      "Proof of advance-notice service to shareholders + auditor + directors",
      "Attendance register + minutes of EGM",
      "SPECIAL RESOLUTION as passed + signed + UNANIMOUS shareholders' consent (Third Schedule Para 1(b))",
    ],
  },
];

const companyDocs = [
  {
    icon: <FaBalanceScale />,
    title: "Form 18 Statutory Pack",
    note: "Core conversion documentation",
    items: [
      "STATEMENT OF ACCOUNTS CERTIFIED BY A CHARTERED ACCOUNTANT (audited where applicable), not older than 30 DAYS from Form 18 filing",
      "List of ALL SHAREHOLDERS with addresses + shareholding + consent to become LLP partners",
      "List of CREDITORS with claim amounts + consent letters / NOCs",
      "Declaration of SOLVENCY by directors + affidavits + latest income-tax acknowledgement",
      "Verification of NO subsisting security interest (Form CHG-7 + CHG-1 satisfaction proof)",
    ],
  },
  {
    icon: <FaShieldAlt />,
    title: "Section 47(xiiib) Eligibility Pack",
    note: "For tax-neutral conversion",
    items: [
      "Income-tax returns for 3 PRECEDING YEARS — turnover ≤ ₹60 lakh in EACH year",
      "Total assets in books of accounts ≤ ₹5 crore in EACH of the 3 preceding years",
      "Shareholding pattern documents for SAME-PROPORTION contribution + profit-share mapping (Section 47(xiiib)(b))",
      "Declaration confirming no consideration / benefit other than profit-share + capital contribution in the LLP",
    ],
  },
  {
    icon: <FaBuilding />,
    title: "Registered Office + LLP Inputs",
    note: "Office proof & LLP structure",
    items: [
      "Address proof — rent agreement OR ownership document; NOC from owner (if rented) on stamp paper",
      "Latest electricity / utility bill (within 60 days)",
      "Proposed LLP name (up to 2 options) + designated partners (min 2, one Indian resident)",
      "Capital contribution per partner (proportionate to shareholding)",
      "LLP Agreement inputs (Enriched + Supreme): profit-share, decision rights, indemnification, exit / admission, dispute resolution",
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

const PvtllpDocuments = () => {
  return (
    <section className="opcd-section" id="documents">
      <div className="opcd-container">

        {/* Header */}
        <div className="opcd-header">
          <h2 className="opcd-main-title">Documents Required to Convert Pvt Ltd into LLP</h2>
          <p className="opcd-main-subtitle">Six categories. Documentation is heavier than Partnership-to-LLP because of Pvt Ltd's formal records (MoA + AoA + Board + Special Resolutions + statutory registers + audited financials with CFS) + charge-register check + Section 47(xiiib) eligibility verification.</p>
        </div>

        {/* Two columns */}
        <div className="opcd-columns">

          {/* Shareholder & Company Records */}
          <div className="opcd-column">
            <div className="opcd-col-header">
              <div className="opcd-col-header-icon"><FaUser /></div>
              <div>
                <h3 className="opcd-col-title">Shareholder &amp; Company Records</h3>
                <p className="opcd-col-subtitle">KYC, corporate records &amp; EGM pack</p>
              </div>
            </div>
            <div className="opcd-col-body">
              {partnerDocs.map((doc, i) => (
                <DocItem key={i} doc={doc} />
              ))}
            </div>
          </div>

          {/* Statutory, Tax & Office Documents */}
          <div className="opcd-column">
            <div className="opcd-col-header opcd-col-header--office">
              <div className="opcd-col-header-icon"><FaBuilding /></div>
              <div>
                <h3 className="opcd-col-title">Statutory, Tax &amp; Office Docs</h3>
                <p className="opcd-col-subtitle">Form 18 pack, 47(xiiib) &amp; office proof</p>
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

export default PvtllpDocuments;
