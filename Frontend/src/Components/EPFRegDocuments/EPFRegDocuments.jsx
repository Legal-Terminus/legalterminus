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
    note: "Mandatory for all entity types",
    items: [
      "Entity PAN (mandatory)",
      "Certificate of Incorporation (Pvt Ltd / LLP) OR Partnership Deed (firms) OR Trade Licence / GST Certificate (proprietorship)",
      "MSME / Udyam certificate (if available)",
      "GSTIN of entity",
    ],
  },
  {
    icon: <FaUser />,
    title: "Authorised Signatory Identity",
    note: "Per signatory — mobile-linked Aadhaar required for OTP",
    items: [
      "Aadhaar of authorised signatory (mobile-linked for OTP)",
      "PAN",
      "Photograph",
      "Designation letter / Board Resolution authorizing signatory for EPF filings",
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
      "Photograph of office front-board",
      "Branch addresses if multi-location",
    ],
  },
];

const rightDocs = [
  {
    icon: <FaMoneyBillWave />,
    title: "Bank Account Details",
    note: "Current account preferred; savings acceptable for proprietorship",
    items: [
      "Cancelled cheque OR first page of bank passbook with IFSC + account holder name",
      "Current account preferred (savings account for proprietorship acceptable)",
      "Bank details used for EPFO refunds and challan reconciliation",
    ],
  },
  {
    icon: <FaIdCard />,
    title: "Employee KYC Pack",
    note: "For each covered employee",
    items: [
      "PAN + Aadhaar (mobile-linked) + bank account with IFSC",
      "Date of joining + designation + monthly basic + DA",
      "UAN (if previously employed)",
    ],
  },
  {
    icon: <FaFileContract />,
    title: "Salary Structure & Statutory Forms",
    note: "Required for payroll and ECR setup",
    items: [
      "Wage structure for each employee (Basic + DA + HRA + Allowances + Bonus)",
      "Appointment letters / wage register",
      "Form 11 (Declaration) signed by each employee at joining — declaring previous PF / EPS / IW status",
      "Form 2 (Nomination) for each employee",
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

const EPFRegDocuments = () => {
  return (
    <section className="cpvd-section">
      <div className="cpvd-container">

        <div className="cpvd-header">
          <h2 className="cpvd-main-title">Documents Required for EPF Registration in India</h2>
          <p className="cpvd-main-subtitle">
            Six categories. Establishment-level docs apply to the entity; per-employee docs apply to every covered employee. We send a personalised checklist after the discovery call.
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
                <h3 className="cpvd-col-title">Banking, Employee KYC &amp; Statutory Forms</h3>
                <p className="cpvd-col-subtitle">Bank details, employee KYC &amp; payroll forms</p>
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

export default EPFRegDocuments;
