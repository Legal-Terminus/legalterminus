import React from "react";
import "./ProDocument.css";
import {
  FaUser, FaMapMarkerAlt, FaBuilding,
  FaFileAlt, FaUniversity, FaCertificate,
} from "react-icons/fa";

const proprietorDocs = [
  {
    icon: <FaUser />,
    title: "Proprietor Identity",
    note: "Mandatory for the proprietor",
    items: [
      "PAN card (mandatory)",
      "Aadhaar card (mobile-linked + linked with PAN)",
      "Voter ID / Driving Licence / Passport as second ID",
      "Passport-size photograph (jpeg, < 100 KB)",
    ],
  },
  {
    icon: <FaMapMarkerAlt />,
    title: "Address Proof of Proprietor",
    note: "Not older than 60 days. Address must match Aadhaar",
    items: [
      "Bank statement OR utility bill OR mobile postpaid bill — not older than 60 days",
      "Self-attested",
    ],
  },
  {
    icon: <FaBuilding />,
    title: "Business Premises Proof",
    note: "Owned / rented / home office / co-working",
    items: [
      "Owned: Latest property tax receipt + electricity bill",
      "Rented: Notarised rent agreement + landlord's NoC + electricity bill",
      "Home office: Self-declaration + utility bill in proprietor's name",
      "Co-working: Service agreement + operator NoC",
    ],
  },
];

const businessDocs = [
  {
    icon: <FaFileAlt />,
    title: "Business Identity Proof",
    note: "Existing or proposed trade name & activity",
    items: [
      "Trade name (proposed)",
      "Business activity description + NIC code mapping",
      "Existing licences if any (Shop & Est, FSSAI, etc.)",
    ],
  },
  {
    icon: <FaUniversity />,
    title: "Bank Account Documents",
    note: "Post bank account opening",
    items: [
      "Cancelled cheque OR bank passbook first page OR bank statement with IFSC",
      "For personal account migration: NoC may be required",
    ],
  },
  {
    icon: <FaCertificate />,
    title: "Sector-Specific Documents",
    note: "Depending on business type",
    items: [
      "Food: kitchen layout / FSSAI form",
      "E-commerce: business website / marketplace plan",
      "Import-export: pro-forma invoices / IEC application",
      "Manufacturing: factory layout / pollution NoC",
      "Professionals: degree / professional body certificate",
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

const ProDocumentSection = () => {
  return (
    <section className="opcd-section" id="documents">
      <div className="opcd-container">

        <div className="opcd-header">
          <h2 className="opcd-main-title">Documents Required for Proprietorship Firm Registration in India</h2>
          <p className="opcd-main-subtitle">Get these ready and we'll take care of the rest</p>
        </div>

        <div className="opcd-columns">

          <div className="opcd-column">
            <div className="opcd-col-header">
              <div className="opcd-col-header-icon"><FaUser /></div>
              <div>
                <h3 className="opcd-col-title">Proprietor Documents</h3>
                <p className="opcd-col-subtitle">Identity, address & premises proof</p>
              </div>
            </div>
            <div className="opcd-col-body">
              {proprietorDocs.map((doc, i) => (
                <DocItem key={i} doc={doc} />
              ))}
            </div>
          </div>

          <div className="opcd-column">
            <div className="opcd-col-header opcd-col-header--office">
              <div className="opcd-col-header-icon"><FaBuilding /></div>
              <div>
                <h3 className="opcd-col-title">Business &amp; Licence Documents</h3>
                <p className="opcd-col-subtitle">Business proof, bank & sector licences</p>
              </div>
            </div>
            <div className="opcd-col-body">
              {businessDocs.map((doc, i) => (
                <DocItem key={i} doc={doc} />
              ))}
            </div>
          </div>

        </div>

      </div>
    </section>
  );
};

export default ProDocumentSection;
