import React from "react";
import "./LabourLicenseDocuments.css";
import { FaUser, FaBuilding, FaIdCard, FaUsers, FaBolt, FaFileContract, FaFileSignature, FaFileAlt, FaList } from "react-icons/fa";

const ownerDocs = [
  {
    icon: <FaFileAlt />,
    title: "Entity Registration Proof",
    note: "Any one, as applicable to your business type",
    items: [
      "Certificate of Incorporation (Company / LLP) + MOA/AOA",
      "Partnership Deed (Partnership firm)",
      "GST Registration / Trade Licence (Proprietorship)",
    ],
  },
  {
    icon: <FaIdCard />,
    title: "Promoter / Authorised Person KYC",
    note: "For all Directors / Partners / Proprietor",
    items: [
      "PAN card (self-attested)",
      "Aadhaar card (self-attested)",
      "Passport-size photograph",
    ],
  },
  {
    icon: <FaFileSignature />,
    title: "Authorisation & Digital Signature",
    note: "For the signatory filing the application",
    items: [
      "Board Resolution / Authorisation letter (provided by us)",
      "Digital Signature (DSC) of the authorised signatory",
    ],
  },
];

const premiseDocs = [
  {
    icon: <FaBolt />,
    title: "Establishment Address Proof",
    note: "Registered office / worksite address",
    items: [
      "Latest Electricity / Utility bill (not older than 2 months)",
      "Rent agreement (if premises are rented)",
    ],
  },
  {
    icon: <FaUsers />,
    title: "Workforce & Wage Details",
    note: "Required to fix the licensed workmen count",
    items: [
      "Total contract-workmen strength (maximum on any day)",
      "Workmen details — Aadhaar, name, father's name, DOB, address",
      "Salary break-up (basic + other components) & holiday list",
    ],
  },
  {
    icon: <FaFileContract />,
    title: "Contract & Principal-Employer Documents",
    note: "Core to the CLRA licence application",
    items: [
      "Work Order from the Principal Employer",
      "Form V (certificate from Principal Employer) for contractor licence",
      "Bank statement with current transactions + 1 cancelled cheque",
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

const LabourLicenseDocuments = () => {
  return (
    <section className="opcd-section" id="documents">
      <div className="opcd-container">

        <div className="opcd-header">
          <h2 className="opcd-main-title">Documents Required for Labour Licence (CLRA) Registration in India</h2>
          <p className="opcd-main-subtitle">Get these ready and we'll take care of the rest</p>
        </div>

        <div className="opcd-columns">

          <div className="opcd-column">
            <div className="opcd-col-header">
              <div className="opcd-col-header-icon"><FaUser /></div>
              <div>
                <h3 className="opcd-col-title">Entity &amp; Applicant KYC Documents</h3>
                <p className="opcd-col-subtitle">Required for principal employer &amp; contractor</p>
              </div>
            </div>
            <div className="opcd-col-body">
              {ownerDocs.map((doc, i) => (
                <DocItem key={i} doc={doc} />
              ))}
            </div>
          </div>

          <div className="opcd-column">
            <div className="opcd-col-header opcd-col-header--office">
              <div className="opcd-col-header-icon"><FaBuilding /></div>
              <div>
                <h3 className="opcd-col-title">Premise, Workforce &amp; Contract Documents</h3>
                <p className="opcd-col-subtitle">Address, workmen &amp; principal-employer proofs</p>
              </div>
            </div>
            <div className="opcd-col-body">
              {premiseDocs.map((doc, i) => (
                <DocItem key={i} doc={doc} />
              ))}
            </div>
          </div>

        </div>

      </div>
    </section>
  );
};

export default LabourLicenseDocuments;
