import React from "react";
import "./ProDocument.css";

const docs = [
  {
    no: "1",
    title: "Proprietor Identity",
    items: [
      "PAN card (mandatory).",
      "Aadhaar card (mobile-linked + linked with PAN).",
      "Voter ID / Driving Licence / Passport as second ID.",
      "Passport-size photograph (jpeg, < 100 KB).",
    ],
  },
  {
    no: "2",
    title: "Address Proof of Proprietor",
    items: [
      "Bank statement OR utility bill OR mobile postpaid bill — not older than 60 days.",
      "Self-attested.",
      "Address must match Aadhaar.",
    ],
  },
  {
    no: "3",
    title: "Business Premises Proof",
    items: [
      "Owned: Latest property tax receipt + electricity bill.",
      "Rented: Notarised rent agreement + landlord's NoC + electricity bill.",
      "Home office: Self-declaration + utility bill in proprietor's name.",
      "Co-working: Service agreement + operator NoC.",
    ],
  },
  {
    no: "4",
    title: "Business Identity Proof (Existing or Proposed)",
    items: [
      "Trade name (proposed).",
      "Business activity description.",
      "NIC code mapping (we help).",
      "Existing licences if any (e.g., previous Shop & Est, FSSAI, etc. — for renewal / migration).",
    ],
  },
  {
    no: "5",
    title: "Bank Account Documents",
    items: [
      "Cancelled cheque OR first page of bank passbook OR bank statement with IFSC + account holder name (post-bank account opening).",
      "For pre-existing personal account migration: NoC may be required.",
    ],
  },
  {
    no: "6",
    title: "Sector-Specific Documents",
    items: [
      "For food: kitchen layout / FSSAI form.",
      "For e-commerce: business website / marketplace plan.",
      "For import-export: pro-forma invoices / IEC application.",
      "For manufacturing: factory layout / pollution NoC.",
      "For professionals: degree / professional body certificate.",
    ],
  },
];

const ProDocumentSection = () => {
  return (
    <section className="pro-doc-section">
      <div className="pro-doc-container">
        <h2 className="pro-doc-title">
          Documents Required for Proprietorship Firm Registration
        </h2>
        <p className="pro-doc-subtitle">
          Get these ready and we'll take care of the rest.
        </p>

        <div className="pro-doc-grid">
          {docs.map((doc) => (
            <article key={doc.no} className="pro-doc-card">
              <div className="pro-doc-card-header">
                <span className="pro-doc-no">{doc.no}</span>
                <h3 className="pro-doc-card-title">{doc.title}</h3>
              </div>
              <ul className="pro-doc-list">
                {doc.items.map((item, i) => (
                  <li key={i} className="pro-doc-item">{item}</li>
                ))}
              </ul>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
};

export default ProDocumentSection;
