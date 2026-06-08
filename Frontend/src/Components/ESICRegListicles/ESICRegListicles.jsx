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
    title: "Entity Registration Proof",
    note: "Legal existence of the establishment",
    items: [
      "Certificate of Incorporation (Pvt Ltd / LLP) OR Partnership Deed OR Trade Licence",
      "MOA & AOA (for companies)",
      "GST Registration Certificate",
      "Entity PAN Card",
    ],
  },
  {
    icon: <FaUser />,
    title: "Authorised Signatory Documents",
    note: "Per signatory — Aadhaar must be mobile-linked",
    items: [
      "Aadhaar of authorised signatory (mobile-linked for OTP / DSC)",
      "PAN Card",
      "Photograph",
      "Board Resolution or designation letter authorising signatory",
      "Email ID + mobile number",
    ],
  },
  {
    icon: <FaBolt />,
    title: "Establishment Address Proof",
    note: "Utility bill not older than 60 days",
    items: [
      "Latest electricity / gas / municipal bill (≤ 60 days old)",
      "Rent agreement (if rented)",
      "NoC from property owner",
      "Photograph of establishment front-board",
    ],
  },
];

const rightDocs = [
  {
    icon: <FaMoneyBillWave />,
    title: "Bank Account Details",
    note: "Used for ESIC refunds and challan reconciliation",
    items: [
      "Cancelled cheque OR bank passbook first page (with IFSC + account holder name)",
      "Current account preferred (savings acceptable for proprietorship)",
    ],
  },
  {
    icon: <FaIdCard />,
    title: "Employee Details (per employee)",
    note: "For all covered employees earning ≤ ₹21,000/month",
    items: [
      "Name + Father's/Husband's name + Date of Birth",
      "Aadhaar number (mobile-linked)",
      "Date of joining + Designation + Monthly gross wages",
      "Bank account with IFSC",
      "Nominee details",
      "Insurance Number (if previously registered with ESIC)",
    ],
  },
  {
    icon: <FaFileContract />,
    title: "Wage & Attendance Records",
    note: "Required for payroll verification and ECR setup",
    items: [
      "Attendance register",
      "Wage register (basic + DA + HRA + allowances)",
      "Appointment letters",
      "List of all employees with designations",
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
            Six categories. Establishment-level docs apply to the entity; per-employee docs apply to every covered employee (earning ≤ ₹21,000/month). We send a personalised checklist after the discovery call.
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
                <h3 className="cpvd-col-title">Banking, Employee &amp; Payroll Records</h3>
                <p className="cpvd-col-subtitle">Bank details, employee KYC &amp; wage records</p>
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
