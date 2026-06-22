import React from "react";
import "./AfcDocuments.css";
import { FaBuilding, FaFileSignature, FaIdCard, FaBalanceScale, FaUsers, FaFileContract, FaBook } from "react-icons/fa";

const companyDocs = [
  {
    icon: <FaBuilding />,
    title: "Company Identity + Master Data",
    text: "Certificate of Incorporation (COI) + CIN + PAN + TAN of the Company + MOA + AOA (latest amended versions) + Registered office address proof. Used to pre-populate AOC-4 + MGT-7 + ITR-6 + ADT-1. Required across all plan tiers.",
  },
  {
    icon: <FaIdCard />,
    title: "Directors + KMP Details",
    text: "All Directors + Key Managerial Personnel: PAN + Aadhaar + DIN + DSC (Class 3 — for Supreme up to 2 DSCs can be procured) + KYC + photograph + address + email + mobile + DIR-3 KYC status. Director Identification Numbers + dates of appointment + cessation (if any). Auditor's CA membership + ICAI MRN.",
  },
  {
    icon: <FaBalanceScale />,
    title: "Audited Financials + Secretarial Documents (Elemental — client provides)",
    text: "For ELEMENTAL clients: AUDITED Balance Sheet + Profit & Loss + Cash Flow + Notes to Accounts + Board's Report + Auditor's Report (CARO 2020 / non-CARO) + AGM Notice + Directors / Shareholders Lists + Minutes + Resolutions. Bank statements for reconciliation. Tax computation. If you don't have secretarial documents ready, choose Enriched. If you don't have books or auditor, choose Supreme.",
  },
];

const partnerDocs = [
  {
    icon: <FaFileContract />,
    title: "Audited Financials Only (Enriched — client provides; LT drafts secretarial)",
    text: "For ENRICHED clients: AUDITED Balance Sheet + Profit & Loss + Cash Flow + Notes to Accounts + Auditor's Report. LT will draft the secretarial documents (Board Report + AGM Notice + Directors / Shareholders Lists + Auditor Appointment documents + minutes + resolutions) — you confirm + sign. Available for companies of ANY turnover size.",
  },
  {
    icon: <FaBook />,
    title: "Bank Statements + Transaction Records (Supreme — we close books + coordinate audit)",
    text: "For SUPREME clients (T/o < ₹1 Cr): All bank statements (all company accounts) April-March + sales invoices + purchase invoices + expense vouchers + share capital records + loan documents + GST returns + TDS deductions + TDS certificates (Form 16 / 16A) + statutory dues records. We close the books + draft Schedule III financials + coordinate the statutory audit. Audit engagement letter + management representation letter direct between client + CA.",
  },
  {
    icon: <FaFileSignature />,
    title: "Prior Year Filings + Notices + Resolutions (Continuity)",
    text: "Prior year's AOC-4 + MGT-7 + ITR-6 + Audit Report + Income Tax intimation orders + MCA / IT notices received + outstanding tax demands + DIN-KYC status of all Directors + Board Resolutions + AGM Resolutions + Shareholders' Register. Used for opening balances + carry-forward + continuity.",
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
    <p className="afc-doc-text">{doc.text}</p>
  </div>
);

const AfcDocuments = () => {
  return (
    <section className="opcd-section" id="documents">
      <div className="opcd-container">

        <div className="opcd-header">
          <h2 className="opcd-main-title">Documents Required for Annual Filing of Company in India</h2>
          <p className="opcd-main-subtitle">Six categories. Documentation requirements vary by plan tier + audit applicability. We send a personalised checklist after the discovery call.</p>
        </div>

        <div className="opcd-columns">

          <div className="opcd-column">
            <div className="opcd-col-header">
              <div className="opcd-col-header-icon"><FaBuilding /></div>
              <div>
                <h3 className="opcd-col-title">Identity, Directors &amp; Financials</h3>
                <p className="opcd-col-subtitle">Company data, directors &amp; Elemental financials</p>
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
                <h3 className="opcd-col-title">Books, Audit &amp; Continuity</h3>
                <p className="opcd-col-subtitle">Enriched / Supreme financials &amp; prior filings</p>
              </div>
            </div>
            <div className="opcd-col-body">
              {partnerDocs.map((doc, i) => (
                <DocItem key={i} doc={doc} />
              ))}
            </div>
          </div>

        </div>

      </div>
    </section>
  );
};

export default AfcDocuments;
