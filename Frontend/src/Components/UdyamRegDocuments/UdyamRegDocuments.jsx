import React from "react";
import "./UdyamRegDocuments.css";

const col1 = [
  {
    icon: "👤",
    title: "Applicant Identity",
    items: ["Aadhaar Card of the Proprietor / Partner / Director", "PAN Card"],
  },
  {
    icon: "🏢",
    title: "Business Entity Proof",
    items: [
      "GST Registration Certificate (if registered)",
      "Certificate of Incorporation / Partnership Deed / LLP Agreement",
      "Shop & Establishment Certificate (for Proprietorships)",
    ],
  },
  {
    icon: "📍",
    title: "Business Address Proof",
    items: [
      "Electricity Bill / Rent Agreement (for owned / rented premises)",
      "No Objection Certificate (NOC) from property owner if using shared premises",
    ],
  },
];

const col2 = [
  {
    icon: "📞",
    title: "Contact Details",
    items: ["Mobile number linked to Aadhaar (for OTP verification)", "Business email address"],
  },
  {
    icon: "🏦",
    title: "Bank Account Details",
    items: ["Bank account number in the name of the business or proprietor", "IFSC code of the branch"],
  },
  {
    icon: "💼",
    title: "Business Activity Details",
    items: [
      "NIC Code (National Industrial Classification) for your primary activity",
      "Number of employees",
      "Investment in plant & machinery (self-declared)",
      "Annual turnover (self-declared)",
    ],
  },
];

const DocColumn = ({ docs }) =>
  docs.map((doc, i) => (
    <div className="udyam-doc-card" key={i}>
      <div className="udyam-doc-icon">{doc.icon}</div>
      <div>
        <h3 className="udyam-doc-card-title">{doc.title}</h3>
        <ul className="udyam-doc-list">
          {doc.items.map((item, j) => (
            <li key={j}>{item}</li>
          ))}
        </ul>
      </div>
    </div>
  ));

const UdyamRegDocuments = () => {
  return (
    <section className="udyam-docs-section">
      <div className="udyam-docs-container">
        <header className="udyam-docs-header">
          <h2 className="udyam-docs-title">Documents Required for Udyam Registration</h2>
          <p className="udyam-docs-subtitle">
            Udyam Registration is largely self-declaratory — no upload is mandatory on the portal. However, keep the following documents ready for verification.
          </p>
        </header>
        <div className="udyam-docs-grid">
          <div className="udyam-docs-col">
            <DocColumn docs={col1} />
          </div>
          <div className="udyam-docs-col">
            <DocColumn docs={col2} />
          </div>
        </div>
        <div className="udyam-docs-note">
          <strong>Important:</strong> For OTP-based Aadhaar verification, the mobile number must be registered with UIDAI.
          If not, you will need to visit an Aadhaar Seva Kendra to update it before proceeding.
        </div>
      </div>
    </section>
  );
};

export default UdyamRegDocuments;
