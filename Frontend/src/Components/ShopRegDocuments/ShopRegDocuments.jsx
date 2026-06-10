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
      "For Pvt Ltd / LLP: COI + MOA / AOA / LLP Agreement",
      "For Partnership: Partnership Deed",
      "For Proprietorship: proprietor's PAN + GST Certificate / MSME Udyam / professional certificate (if relevant)",
      "GSTIN (if registered)",
    ],
  },
  {
    icon: <FaUser />,
    title: "Authorised Signatory / Employer Identity",
    note: "Per signatory — Aadhaar must be mobile-linked",
    items: [
      "Aadhaar of authorised signatory / employer (mobile-linked)",
      "PAN",
      "Photograph (passport-size, jpeg)",
      "Designation letter / Board Resolution authorising signatory for SHOP & ESTABLISHMENT filings",
      "Email + mobile number",
    ],
  },
  {
    icon: <FaBolt />,
    title: "Establishment Address Proof",
    note: "Utility bill not older than 60 days",
    items: [
      "Latest electricity / gas / municipal tax bill (≤ 60 days old) for the establishment",
      "Owned: property tax receipt",
      "Rented: notarised rent agreement + landlord NoC + landlord's electricity bill",
      "Photograph of establishment front-board / signage (some states require)",
    ],
  },
];

const rightDocs = [
  {
    icon: <FaMoneyBillWave />,
    title: "Bank Account Details (Where Required)",
    note: "Some states require at registration; others only at renewal",
    items: [
      "Cancelled cheque OR bank passbook page with IFSC. Some states require bank details at registration; others only at renewal",
    ],
  },
  {
    icon: <FaIdCard />,
    title: "Employee / Worker List",
    note: "As on registration date",
    items: [
      "List of all employees / workers: name, designation, date of joining, monthly wages",
      "Total count (male / female / others)",
      "Working hours schedule",
      "Weekly off day",
      "Annual holiday list",
      "National & festival holidays",
    ],
  },
  {
    icon: <FaFileContract />,
    title: "State-Specific Supporting Docs",
    note: "We send the exact state checklist after the discovery call",
    items: [
      "Maharashtra Gumasta: photo of premises with signboard",
      "Karnataka: NoC from neighbours (rare)",
      "Delhi: hard-copy attested documents",
      "Tamil Nadu: signed working-hours declaration",
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

const ShopDocuments = () => {
  return (
    <section className="cpvd-section">
      <div className="cpvd-container">

        <div className="cpvd-header">
          <h2 className="cpvd-main-title">Documents Required for Shop &amp; Establishment Registration in India</h2>
          <p className="cpvd-main-subtitle">
            Six categories. Documentation is light — this is one of the most accessible registrations. We send a state-specific personalised checklist after the discovery call.
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
                <h3 className="cpvd-col-title">Bank, Employee &amp; State-Specific Docs</h3>
                <p className="cpvd-col-subtitle">Bank details, worker list &amp; state requirements</p>
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

export default ShopDocuments;
