import React from "react";
import "../CopyPvtDocument/CopyPvtDocument.css";
import {
  FaBuilding,
  FaUser,
  FaBolt,
  FaMoneyBillWave,
  FaIdCard,
  FaFileContract,
} from "react-icons/fa";

const leftDocs = [
  {
    icon: <FaBuilding />,
    title: "Entity Identity",
    note: "Legal existence of the establishment",
    items: [
      "Entity PAN (mandatory)",
      "Certificate of Incorporation (Pvt Ltd / LLP) OR Partnership Deed (firms) OR Trade Licence / GST Certificate (proprietorship)",
      "MSME / Udyam certificate (if available)",
      "GSTIN of entity",
      "Factory Licence (if applicable)",
    ],
  },
  {
    icon: <FaUser />,
    title: "Authorised Signatory Identity",
    note: "Per signatory — Aadhaar must be mobile-linked",
    items: [
      "Aadhaar of authorised signatory (mobile-linked for OTP)",
      "PAN",
      "Photograph",
      "Designation letter / Board Resolution authorising signatory for ESIC filings",
      "Email + mobile number",
    ],
  },
  {
    icon: <FaBolt />,
    title: "Establishment Address Proof",
    note: "Utility bill not older than 60 days",
    items: [
      "Latest electricity / gas / municipal tax bill (≤ 60 days old)",
      "Property owner NoC if rented",
      "Rent agreement (notarised)",
      "Photograph of office / factory front-board",
      "Branch addresses if multi-location",
    ],
  },
];

const rightDocs = [
  {
    icon: <FaMoneyBillWave />,
    title: "Bank Account Details",
    note: "Used for ESIC challan reconciliation and (in rare cases) refunds",
    items: [
      "Cancelled cheque OR first page of bank passbook with IFSC + account holder name",
    ],
  },
  {
    icon: <FaIdCard />,
    title: "Covered Employee KYC + Family Pack",
    note: "For all covered employees earning ≤ ₹21,000/month",
    items: [
      "PAN + Aadhaar (mobile-linked) + bank account + photograph",
      "Date of joining + Designation + Monthly gross wages",
      "Family declaration: spouse, dependent parents, dependent children (with Aadhaar / birth certificate / age proof)",
    ],
  },
  {
    icon: <FaFileContract />,
    title: "Wage Structure & Statutory Forms",
    note: "Required for payroll verification and contribution calculation",
    items: [
      "Wage structure for each employee (basic + DA + HRA + allowances — the 'gross wages' figure is what counts for ESIC)",
      "Form 1 (Declaration) for establishment",
      "Form 1A (Declaration) for each covered employee",
      "Form 3 (Return of Contributions) template ready",
    ],
  },
];

const DocItem = ({ doc }) => (
  <div className="cpvd-doc-item">
    <div className="cpvd-doc-item-top">
      <div className="cpvd-doc-icon">{doc.icon}</div>
      <div className="cpvd-doc-meta">
        <h4 className="cpvd-doc-title">{doc.title}</h4>
        <span className="cpvd-doc-note">{doc.note}</span>
      </div>
    </div>
    <ul className="cpvd-doc-list">
      {doc.items.map((item, i) => (
        <li key={i} className="cpvd-doc-list-item">{item}</li>
      ))}
    </ul>
  </div>
);

const ESICRegListicles = () => {
  return (
    <section className="cpvd-section">
      <div className="cpvd-container">

        <div className="cpvd-header">
          <h2 className="cpvd-main-title">Documents Required for ESIC Registration in India</h2>
          <p className="cpvd-main-subtitle">
            Six categories. Establishment-level docs apply to the entity; per-employee docs apply to every covered employee plus their family. We send a personalised checklist after the discovery call.
          </p>
        </div>

        <div className="cpvd-columns">

          <div className="cpvd-column">
            <div className="cpvd-col-header">
              <div className="cpvd-col-header-icon"><FaBuilding /></div>
              <div>
                <h3 className="cpvd-col-title">Entity, Signatory &amp; Address Documents</h3>
                <p className="cpvd-col-subtitle">Identity, authorisations &amp; establishment proof</p>
              </div>
            </div>
            <div className="cpvd-col-body">
              {leftDocs.map((doc, i) => (
                <DocItem key={i} doc={doc} />
              ))}
            </div>
          </div>

          <div className="cpvd-column">
            <div className="cpvd-col-header cpvd-col-header--office">
              <div className="cpvd-col-header-icon"><FaIdCard /></div>
              <div>
                <h3 className="cpvd-col-title">Banking, Employee KYC &amp; Payroll Records</h3>
                <p className="cpvd-col-subtitle">Bank details, employee KYC &amp; wage structure</p>
              </div>
            </div>
            <div className="cpvd-col-body">
              {rightDocs.map((doc, i) => (
                <DocItem key={i} doc={doc} />
              ))}
            </div>
          </div>

        </div>

      </div>
    </section>
  );
};

export default ESICRegListicles;
