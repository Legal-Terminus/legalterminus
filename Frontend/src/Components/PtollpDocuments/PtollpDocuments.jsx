import React from "react";
import "./PtollpDocuments.css";
import { FaUser, FaUsers, FaIdCard, FaFileContract, FaHandshake, FaBuilding, FaBalanceScale, FaFileAlt } from "react-icons/fa";

const partnerDocs = [
  {
    icon: <FaIdCard />,
    title: "All Partners' KYC + Identity",
    note: "For every partner of the firm",
    items: [
      "PAN + Aadhaar (mandatory linkage) of each partner",
      "Latest passport-size photograph, email + mobile (for OTP)",
      "Bank statement / utility bill (within 60 days) as residence proof",
      "DSC (Class-3 Individual, 2-year); designated partners: DPIN (via FiLLiP if not existing)",
      "NRI / foreign partners: passport + overseas address proof + FEMA compliance check",
    ],
  },
  {
    icon: <FaHandshake />,
    title: "Partnership Deed + Firm Records",
    note: "Constitution & filing history of the firm",
    items: [
      "Original Partnership Deed + all supplementary / amendment deeds",
      "Firm Registration Certificate (Indian Partnership Act, 1932) if registered",
      "PAN of the firm",
      "Firm's GSTIN + Udyam + Shop & Estd + Trade License + IEC (where applicable)",
      "Last 3 years' firm ITRs (Form ITR-5) + GST returns + bank statements",
    ],
  },
  {
    icon: <FaBalanceScale />,
    title: "Statement of Accounts + Capital Schedule",
    note: "Core conversion documents",
    items: [
      "Statement of Accounts of the firm CERTIFIED BY A CHARTERED ACCOUNTANT (not older than 30 DAYS from Form 17 filing)",
      "Capital Account statement of each partner (per Partnership Deed — drives LLP contribution mapping)",
      "Firms subject to audit (IT Act / LLP Act thresholds): AUDITED Statement of Accounts",
      "List of CREDITORS with claim amounts + consent letters / NOCs",
    ],
  },
];

const officeDocs = [
  {
    icon: <FaFileContract />,
    title: "Form 17 / Form FiLLiP Inputs",
    note: "Conversion + incorporation details",
    items: [
      "Proposed LLP name (post-name-reservation)",
      "Names of all partners (becoming LLP partners) + designated partners (min 2, one Indian resident)",
      "Registered office address + business activity + NIC code",
      "Capital contribution structure (per partner, per Statement of Accounts)",
      "Unanimous resolution + consent of all partners + affidavits + declaration of solvency",
    ],
  },
  {
    icon: <FaBuilding />,
    title: "Registered Office + Premises Proof",
    note: "Address of the LLP",
    items: [
      "Address proof — rent agreement OR ownership document",
      "NOC from owner (if rented) on stamp paper",
      "Latest electricity / utility bill (within 60 days)",
      "Premises must be capable of receiving statutory notices",
    ],
  },
  {
    icon: <FaFileAlt />,
    title: "LLP Agreement Inputs + Declarations",
    note: "Form 3 & stamp duty",
    items: [
      "Custom LLP Agreement terms (Enriched + Supreme): capital, profit-share, decision rights, designated-partner roles, indemnification, exit + admission, dispute resolution, dissolution",
      "Stamp duty on LLP Agreement payable at State rates",
      "Stamp duty on Asset Transfer Agreement (Supreme tier) if applicable",
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

const PtollpDocuments = () => {
  return (
    <section className="opcd-section" id="documents">
      <div className="opcd-container">

        <div className="opcd-header">
          <h2 className="opcd-main-title">Documents Required to Convert a Partnership Firm into an LLP</h2>
          <p className="opcd-main-subtitle">Six categories. Documentation is moderate — Partnership Deed + all partners' KYC + Statement of Accounts + creditor consents + LLP Agreement inputs. We send a personalised checklist after the discovery call.</p>
        </div>

        <div className="opcd-columns">

          <div className="opcd-column">
            <div className="opcd-col-header">
              <div className="opcd-col-header-icon"><FaUsers /></div>
              <div>
                <h3 className="opcd-col-title">Partner &amp; Firm Documents</h3>
                <p className="opcd-col-subtitle">KYC, deed, accounts &amp; creditor consents</p>
              </div>
            </div>
            <div className="opcd-col-body">
              {partnerDocs.map((doc, i) => (
                <DocItem key={i} doc={doc} />
              ))}
            </div>
          </div>

          <div className="opcd-column">
            <div className="opcd-col-header opcd-col-header--office">
              <div className="opcd-col-header-icon"><FaBuilding /></div>
              <div>
                <h3 className="opcd-col-title">Forms, Office &amp; Agreement</h3>
                <p className="opcd-col-subtitle">Form 17/FiLLiP, office proof &amp; LLP agreement</p>
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

export default PtollpDocuments;
