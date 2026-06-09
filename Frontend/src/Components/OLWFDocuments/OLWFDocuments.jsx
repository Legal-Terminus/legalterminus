import React from "react";
import "../OPCDocuments/OPCDocuments.css";
import { FaUser, FaBuilding, FaIdCard, FaBolt, FaFileContract, FaShieldAlt, FaFileAlt, FaUsers } from "react-icons/fa";

const establishmentDocs = [
  {
    icon: <FaBuilding />,
    title: "Entity Identity",
    note: "Mandatory for all establishment types",
    items: [
      "Entity PAN (mandatory)",
      "Certificate of Incorporation (Pvt Ltd / LLP) OR Partnership Deed (firms) OR Trade Licence / GST Certificate (proprietorship)",
      "MSME / Udyam certificate (if any)",
      "GSTIN",
      "Factory Licence (if applicable) or Shops & Establishments Certificate (Odisha state)",
    ],
  },
  {
    icon: <FaIdCard />,
    title: "Authorised Signatory Identity",
    note: "For the person authorised to file on behalf of the establishment",
    items: [
      "Aadhaar of authorised signatory (mobile-linked for OTP where required)",
      "PAN",
      "Photograph",
      "Designation letter / Board Resolution authorising signatory for OLWF filings",
      "Email + mobile number",
    ],
  },
  {
    icon: <FaBolt />,
    title: "Establishment Address Proof — Odisha",
    note: "Not older than 60 days from filing date",
    items: [
      "Latest electricity / gas / municipal tax bill (≤ 60 days old) showing Odisha address",
      "Property owner NOC if rented",
      "Rent agreement (notarised)",
      "Photograph of establishment front-board",
      "District-wise breakdown if multi-location within Odisha",
    ],
  },
];

const complianceDocs = [
  {
    icon: <FaFileContract />,
    title: "Bank Account Details",
    note: "For OLWF challan / contribution payment reconciliation",
    items: [
      "Cancelled cheque OR first page of bank passbook with IFSC + account holder name",
    ],
  },
  {
    icon: <FaUsers />,
    title: "Worker List + Wage Register",
    note: "Covering all workers / employees at the Odisha establishment",
    items: [
      "List of all workers / employees with: name, designation, monthly wages, date of joining, category (worker / supervisory / managerial), Aadhaar (optional but helpful)",
      "Wage register / payroll summary for the immediately preceding month",
      "Worker count breakdown by category",
    ],
  },
  {
    icon: <FaShieldAlt />,
    title: "Statutory Forms + Declarations",
    note: "Drafted by us — you sign and confirm",
    items: [
      "Form A (OLWF Establishment Registration) — drafted by us",
      "Declaration of compliance with OLWF Act, 1996",
      "Self-declaration of worker count + wage structure",
      "Acknowledgement of contribution-payment cycle (Jan + Jul half-yearly)",
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

const OLWFDocuments = () => {
  return (
    <section className="opcd-section" id="documents">
      <div className="opcd-container">

        <div className="opcd-header">
          <h2 className="opcd-main-title">Documents Required for OLWF Registration</h2>
          <p className="opcd-main-subtitle">Six categories. We send a personalised checklist after the discovery call.</p>
        </div>

        <div className="opcd-columns">

          <div className="opcd-column">
            <div className="opcd-col-header">
              <div className="opcd-col-header-icon"><FaBuilding /></div>
              <div>
                <h3 className="opcd-col-title">Establishment Documents</h3>
                <p className="opcd-col-subtitle">Entity identity, signatory details & address proof</p>
              </div>
            </div>
            <div className="opcd-col-body">
              {establishmentDocs.map((doc, i) => (
                <DocItem key={i} doc={doc} />
              ))}
            </div>
          </div>

          <div className="opcd-column">
            <div className="opcd-col-header opcd-col-header--office">
              <div className="opcd-col-header-icon"><FaFileAlt /></div>
              <div>
                <h3 className="opcd-col-title">Compliance & Worker Documents</h3>
                <p className="opcd-col-subtitle">Bank details, worker list & statutory declarations</p>
              </div>
            </div>
            <div className="opcd-col-body">
              {complianceDocs.map((doc, i) => (
                <DocItem key={i} doc={doc} />
              ))}
            </div>
          </div>

        </div>

      </div>
    </section>
  );
};

export default OLWFDocuments;
