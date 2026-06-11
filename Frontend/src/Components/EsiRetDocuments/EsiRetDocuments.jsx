import React from "react";
import "./EsiRetDocuments.css";
import { FaBuilding, FaKey, FaIdCard, FaMoneyCheckAlt, FaUserPlus, FaUserMinus, FaFileInvoiceDollar, FaUsers } from "react-icons/fa";

const employerDocs = [
  {
    icon: <FaKey />,
    title: "Establishment & Portal Access",
    note: "For ESIC portal filing",
    items: [
      "ESI registration code (Code No. 17 digit)",
      "Employer ESIC portal login credentials",
      "Registration certificate (Form C-11)",
    ],
  },
  {
    icon: <FaFileInvoiceDollar />,
    title: "Monthly Wage Data",
    note: "For contribution computation",
    items: [
      "Gross wage sheet for the month",
      "Attendance / loss-of-pay (LOP) details",
      "List of employees above / below ₹21,000 ceiling",
    ],
  },
  {
    icon: <FaMoneyCheckAlt />,
    title: "Payment Details",
    note: "For challan settlement",
    items: [
      "Establishment bank account for challan payment",
      "Previous month's contribution challan & receipt",
    ],
  },
];

const memberDocs = [
  {
    icon: <FaUserPlus />,
    title: "New Joiner Details",
    note: "For IP registration",
    items: [
      "Name, DOB, date of joining & gross wages",
      "Aadhaar, mobile number & bank account",
      "Existing ESIC Insurance Number (if any)",
    ],
  },
  {
    icon: <FaIdCard />,
    title: "Dependant & KYC Details",
    note: "For e-Pehchaan card",
    items: [
      "Family / dependant details (name, relation, DOB)",
      "Aadhaar of insured person",
      "Photograph for e-Pehchaan card",
    ],
  },
  {
    icon: <FaUserMinus />,
    title: "Exit & Member Updates",
    note: "For accurate IP roster",
    items: [
      "Date of Leaving for separated employees",
      "Reason for leaving / non-working periods",
      "Wage-revision or correction details (if any)",
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

const EsiRetDocuments = () => {
  return (
    <section className="opcd-section" id="documents">
      <div className="opcd-container">

        <div className="opcd-header">
          <h2 className="opcd-main-title">Documents Required for ESI Return Filing</h2>
          <p className="opcd-main-subtitle">Share these each month and we'll handle the return &amp; challan</p>
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
                <h3 className="opcd-col-title">Insured Person &amp; KYC Documents</h3>
                <p className="opcd-col-subtitle">Joiners, dependants &amp; exit updates</p>
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

export default EsiRetDocuments;
