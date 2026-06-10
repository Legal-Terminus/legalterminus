import React from "react";
import "./BCdocuments.css";
import { FaUser, FaBuilding, FaIdCard, FaFileAlt, FaCamera, FaBolt, FaFileContract, FaBoxOpen } from "react-icons/fa";

const businessDocs = [
  {
    icon: <FaIdCard />,
    title: "Business Owner / Authorised Signatory KYC",
    note: "Mandatory for Proprietor / Director / Partner",
    items: [
      "Self-attested PAN card (mandatory)",
      "Self-attested Aadhaar card",
      "Passport-size photograph",
    ],
  },
  {
    icon: <FaFileAlt />,
    title: "Business Registration Certificate",
    note: "Any one of the following",
    items: [
      "Certificate of Incorporation (COI) for companies",
      "Partnership Deed / LLP Agreement",
      "GST Registration Certificate (mandatory — GS1 is GSTIN-linked)",
      "UDYAM / Shops & Establishment Certificate",
    ],
  },
  {
    icon: <FaFileContract />,
    title: "Company Letterhead Request Letter",
    note: "On official letterhead, signed by authorised signatory",
    items: [
      "Request letter to GS1 India for Company Prefix allocation",
      "Specifying number of products and category",
    ],
  },
];

const officeDocs = [
  {
    icon: <FaBolt />,
    title: "Registered Office Address Proof",
    note: "Latest utility bill — not older than 2 months",
    items: [
      "Electricity Bill",
      "Water Bill",
      "Gas Bill",
    ],
  },
  {
    icon: <FaBuilding />,
    title: "Bank Details",
    note: "For GS1 subscription payment processing",
    items: [
      "Cancelled cheque (company account)",
      "Copy of latest bank statement (optional — some states)",
    ],
  },
  {
    icon: <FaBoxOpen />,
    title: "Product List",
    note: "For GTIN assignment — one GTIN per unique product",
    items: [
      "Product names and brief descriptions",
      "Number of distinct SKUs / product variants",
      "Product category (food, pharma, electronics, apparel, etc.)",
      "Approximate pack size / unit of measure for each product",
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

const BCDocuments = () => {
  return (
    <section className="opcd-section" id="documents">
      <div className="opcd-container">

        <div className="opcd-header">
          <h2 className="opcd-main-title">Documents Required for GS1 Barcode Registration in India</h2>
          <p className="opcd-main-subtitle">Get these ready and we'll take care of the rest</p>
        </div>

        <div className="opcd-columns">

          <div className="opcd-column">
            <div className="opcd-col-header">
              <div className="opcd-col-header-icon"><FaUser /></div>
              <div>
                <h3 className="opcd-col-title">Business &amp; KYC Documents</h3>
                <p className="opcd-col-subtitle">Required for GS1 India membership and owner verification</p>
              </div>
            </div>
            <div className="opcd-col-body">
              {businessDocs.map((doc, i) => (
                <DocItem key={i} doc={doc} />
              ))}
            </div>
          </div>

          <div className="opcd-column">
            <div className="opcd-col-header opcd-col-header--office">
              <div className="opcd-col-header-icon"><FaBuilding /></div>
              <div>
                <h3 className="opcd-col-title">Office, Bank &amp; Product Documents</h3>
                <p className="opcd-col-subtitle">Address proof, payment details, and product catalogue</p>
              </div>
            </div>
            <div className="opcd-col-body">
              {officeDocs.map((doc, i) => (
                <DocItem key={i} doc={doc} />
              ))}
            </div>
          </div>

        </div>

      </div>
    </section>
  );
};

export default BCDocuments;
