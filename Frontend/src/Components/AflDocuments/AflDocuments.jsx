import React from "react";
import "./AflDocuments.css";
import { FaBuilding, FaFileSignature, FaIdCard, FaBalanceScale, FaUsers, FaFileContract, FaStamp } from "react-icons/fa";

const llpDocs = [
  {
    icon: <FaBuilding />,
    title: "LLP Identity + Master Data",
    text: "LLP Incorporation Certificate (FiLLiP) + LLP Identification Number (LLPIN) + PAN of LLP + LLP Agreement (latest amended version) + Registered office address proof. Used to pre-populate Form LLP-11 + LLP-8 + ITR-5. Required across all plan tiers.",
  },
  {
    icon: <FaIdCard />,
    title: "Designated Partners + Partners Details",
    text: "All Partners + Designated Partners: PAN + Aadhaar + DPIN (Designated Partner Identification Number) + KYC + photograph + address + email + mobile + valid DSC (Class 3 — for Supreme up to 2 DSCs can be procured). Partner contribution details + profit-sharing ratio. Body corporate partner details (if any).",
  },
  {
    icon: <FaBalanceScale />,
    title: "Year's Financial Data (Elemental — client provides ready)",
    text: "For ELEMENTAL clients (client maintains books): Year's Profit & Loss Account + Balance Sheet + Trial Balance + Income Tax Computation in ready format. Bank statements (all accounts, April-March) for reconciliation. Major transaction records. If not provided in proper format, Enriched / Supreme tier is recommended.",
  },
];

const partnerDocs = [
  {
    icon: <FaFileContract />,
    title: "Bank Statements + Transaction Records (Enriched / Supreme — we close books)",
    text: "For ENRICHED / SUPREME clients: All bank statements April-March + sales invoices + purchase invoices + expense vouchers + Partner contribution + drawing records + loan documents + GST returns (if applicable) + TDS deductions + TDS certificates (Form 16A) received. We close the books from these inputs.",
  },
  {
    icon: <FaStamp />,
    title: "DSC Coordination for Designated Partners",
    text: "For all LLP annual filing plans, valid DSCs of the Designated Partners are mandatory for filing Forms LLP-11, LLP-8, and Income Tax Return. If any DSC is expired, inactive, or unavailable, Legal Terminus can also coordinate the DSC procurement / renewal process through authorised DSC service providers for smooth and timely compliance filing.",
  },
  {
    icon: <FaFileSignature />,
    title: "Prior Year Filings + Notices (Continuity)",
    text: "Prior year's Form 11 + Form 8 + ITR-5 + Income Tax intimation orders + any notices from MCA / IT Department + outstanding tax demands / refunds + DIN-KYC status of Designated Partners. Used for opening balances + carry-forward losses + continuity across filing cycles.",
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
    <p className="afl-doc-text">{doc.text}</p>
  </div>
);

const AflDocuments = () => {
  return (
    <section className="opcd-section" id="documents">
      <div className="opcd-container">

        <div className="opcd-header">
          <h2 className="opcd-main-title">Documents Required for LLP in India</h2>
          <p className="opcd-main-subtitle">Six categories. Documentation requirements vary by plan tier + audit applicability. We send a personalised checklist after the discovery call.</p>
        </div>

        <div className="opcd-columns">

          <div className="opcd-column">
            <div className="opcd-col-header">
              <div className="opcd-col-header-icon"><FaBuilding /></div>
              <div>
                <h3 className="opcd-col-title">LLP, Partners &amp; Financials</h3>
                <p className="opcd-col-subtitle">Identity, partners &amp; ready financials</p>
              </div>
            </div>
            <div className="opcd-col-body">
              {llpDocs.map((doc, i) => (
                <DocItem key={i} doc={doc} />
              ))}
            </div>
          </div>

          <div className="opcd-column">
            <div className="opcd-col-header opcd-col-header--office">
              <div className="opcd-col-header-icon"><FaUsers /></div>
              <div>
                <h3 className="opcd-col-title">Books, DSC &amp; Continuity</h3>
                <p className="opcd-col-subtitle">Transactions, signatures &amp; prior filings</p>
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

export default AflDocuments;
