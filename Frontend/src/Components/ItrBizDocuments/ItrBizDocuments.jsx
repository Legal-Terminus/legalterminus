import React from "react";
import "./ItrBizDocuments.css";
import { FaUser, FaBuilding, FaIdCard, FaReceipt, FaBalanceScale, FaFileInvoiceDollar, FaUniversity, FaHistory } from "react-icons/fa";

const identityDocs = [
  {
    icon: <FaIdCard />,
    title: "Entity Identity + Tax Profile",
    text: "FOR PROPRIETOR: PAN of proprietor (= business PAN) + Aadhaar + IT portal login + GSTIN (if registered) + Udyam Registration + Trade Licence + bank account (with IFSC) + email + mobile. FOR PARTNERSHIP FIRM: PAN of firm (separate from partner PANs) + Partnership Deed (registered) + GSTIN + each Partner's PAN + Aadhaar + DSC of authorised partner + IT portal login + bank account.",
  },
  {
    icon: <FaReceipt />,
    title: "Income Tax Portal Pre-Filled Data",
    text: "FORM 26AS (TDS / TCS / advance tax credits to your PAN - including Section 194 series + new Section 194T receipts for partners) + AIS (Annual Information Statement) + TIS. For PF: separate Form 26AS for firm and for each partner. We download + reconcile.",
  },
  {
    icon: <FaBalanceScale />,
    title: "Financial Statements (Elemental - client provides ready)",
    text: "For ELEMENTAL: ready Profit & Loss + Balance Sheet + IT Computation. For PARTNERSHIP FIRM additionally: Partner Remuneration / Interest schedule under Section 40(b) (computed using Budget 2024 Rs.6L first-slab limit) + Partner Capital Account schedule + share of profit allocation. For ENRICHED / SUPREME, LT prepares these.",
  },
];

const recordDocs = [
  {
    icon: <FaFileInvoiceDollar />,
    title: "Business Records (Enriched / Supreme - we close books)",
    text: "For ENRICHED / SUPREME: All BANK STATEMENTS Apr-Mar + sales invoices + purchase invoices + expense vouchers + asset purchases + loan documents + GST returns + TDS deductions made by you (Form 26Q) + TDS certificates received + advance tax challans. For PF: Section 194T TDS challans / certificates for partner payments (Supreme tier handles).",
  },
  {
    icon: <FaUniversity />,
    title: "Partnership Firm Specific Documents",
    text: "PARTNERSHIP DEED (registered, latest amended version) + Form 9 (registration certificate from Registrar of Firms if registered) + partner contribution records + profit-sharing ratio + partner remuneration agreement (if any) + Section 194T TDS records (FY 2025-26 onwards) + AMT computation (if applicable under Section 115JC). For ENRICHED / SUPREME.",
  },
  {
    icon: <FaHistory />,
    title: "Prior Year Returns + Continuity",
    text: "Prior year ITR Acknowledgements (last 3 years) + intimation orders (Section 143(1)) + scrutiny / appellate orders + carry-forward losses (business loss) + unabsorbed depreciation + opening balances. For PF: prior year partner remuneration claimed + opening partner capital balances.",
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
    <p className="opcd-doc-text">{doc.text}</p>
  </div>
);

const ItrBizDocuments = () => {
  return (
    <section className="opcd-section" id="documents">
      <div className="opcd-container">

        <div className="opcd-header">
          <h2 className="opcd-main-title">Documents Required for ITR Filing for Business in India</h2>
          <p className="opcd-main-subtitle">Six categories. Documentation varies by entity type (proprietor vs PF) + plan tier + presumptive scheme. Personalised checklist sent after intake.</p>
        </div>

        <div className="opcd-columns">

          <div className="opcd-column">
            <div className="opcd-col-header">
              <div className="opcd-col-header-icon"><FaUser /></div>
              <div>
                <h3 className="opcd-col-title">Identity, Tax-Credit &amp; Financial Statements</h3>
                <p className="opcd-col-subtitle">Basics + statements for every return</p>
              </div>
            </div>
            <div className="opcd-col-body">
              {identityDocs.map((doc, i) => (
                <DocItem key={i} doc={doc} />
              ))}
            </div>
          </div>

          <div className="opcd-column">
            <div className="opcd-col-header opcd-col-header--office">
              <div className="opcd-col-header-icon"><FaBuilding /></div>
              <div>
                <h3 className="opcd-col-title">Business Records, Partnership &amp; Prior-Year</h3>
                <p className="opcd-col-subtitle">Books, PF documents &amp; continuity</p>
              </div>
            </div>
            <div className="opcd-col-body">
              {recordDocs.map((doc, i) => (
                <DocItem key={i} doc={doc} />
              ))}
            </div>
          </div>

        </div>

      </div>
    </section>
  );
};

export default ItrBizDocuments;
