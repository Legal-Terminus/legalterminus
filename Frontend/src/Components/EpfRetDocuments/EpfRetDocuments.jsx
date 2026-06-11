import React from "react";
import "./EpfRetDocuments.css";
import { FaBuilding, FaKey, FaIdCard, FaMoneyCheckAlt, FaUserPlus, FaUserMinus, FaFileInvoiceDollar, FaUsers } from "react-icons/fa";

const employerDocs = [
  {
    icon: <FaKey />,
    title: "Establishment & Portal Access",
    note: "For EPFO portal filing",
    items: [
      "EPF establishment code & registration certificate",
      "Employer Unified Portal login credentials",
      "DSC / e-sign of the authorised signatory",
    ],
  },
  {
    icon: <FaFileInvoiceDollar />,
    title: "Monthly Wage Data",
    note: "For ECR computation",
    items: [
      "Wage sheet (basic + DA) for the month",
      "Attendance / loss-of-pay (LOP) details",
      "Arrears & wage-revision details (if any)",
    ],
  },
  {
    icon: <FaMoneyCheckAlt />,
    title: "Payment Details",
    note: "For challan settlement",
    items: [
      "Establishment bank account for challan payment",
      "Previous month's ECR & paid challan (TRRN)",
    ],
  },
];

const memberDocs = [
  {
    icon: <FaUserPlus />,
    title: "New Joiner Details",
    note: "For UAN generation",
    items: [
      "Name, DOB, date of joining & wages",
      "Aadhaar, PAN & bank account (with IFSC)",
      "Existing UAN (if previously employed)",
    ],
  },
  {
    icon: <FaIdCard />,
    title: "KYC Documents",
    note: "For UAN seeding & approval",
    items: [
      "Aadhaar card of each member",
      "PAN card of each member",
      "Cancelled cheque / bank passbook",
    ],
  },
  {
    icon: <FaUserMinus />,
    title: "Exit & Member Updates",
    note: "For accurate member roster",
    items: [
      "Date of Exit for separated employees",
      "Reason for leaving / non-contributory periods",
      "Member-wise contribution corrections (if any)",
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

const EpfRetDocuments = () => {
  return (
    <section className="opcd-section" id="documents">
      <div className="opcd-container">

        <div className="opcd-header">
          <h2 className="opcd-main-title">Documents Required for EPF Return Filing</h2>
          <p className="opcd-main-subtitle">Share these each month and we'll handle the ECR &amp; challan</p>
        </div>

        <div className="opcd-columns">

          <div className="opcd-column">
            <div className="opcd-col-header">
              <div className="opcd-col-header-icon"><FaBuilding /></div>
              <div>
                <h3 className="opcd-col-title">Establishment &amp; Wage Documents</h3>
                <p className="opcd-col-subtitle">Portal access, wages &amp; payment</p>
              </div>
            </div>
            <div className="opcd-col-body">
              {employerDocs.map((doc, i) => (
                <DocItem key={i} doc={doc} />
              ))}
            </div>
          </div>

          <div className="opcd-column">
            <div className="opcd-col-header opcd-col-header--office">
              <div className="opcd-col-header-icon"><FaUsers /></div>
              <div>
                <h3 className="opcd-col-title">Member &amp; KYC Documents</h3>
                <p className="opcd-col-subtitle">Joiners, KYC &amp; exit updates</p>
              </div>
            </div>
            <div className="opcd-col-body">
              {memberDocs.map((doc, i) => (
                <DocItem key={i} doc={doc} />
              ))}
            </div>
          </div>

        </div>

      </div>
    </section>
  );
};

export default EpfRetDocuments;
