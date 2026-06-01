import React from "react";
import "./GSTRegDocument.css";
import { FaUser, FaBuilding, FaIdCard, FaCamera, FaFileContract, FaShieldAlt, FaBolt, FaFileAlt } from "react-icons/fa";

const businessDocs = [
  {
    icon: <FaIdCard />,
    title: "Business Registration Proof",
    note: "Any valid registration certificate of the organisation",
    items: [
      "Certificate of Incorporation / Partnership Deed / Trade Licence",
      "For Proprietorship: MSME (Udyam) certificate or Shop & Est certificate",
    ],
  },
  {
    icon: <FaBuilding />,
    title: "Registered Office Proof",
    note: "Address proof for the principal place of business",
    items: [
      "Rent agreement + electricity bill (if rented)",
      "Property tax receipt + electricity bill (if owned)",
      "NOC from property owner",
    ],
  },
  {
    icon: <FaFileContract />,
    title: "Bank Account Documents",
    note: "Proof of active bank account",
    items: [
      "Cancelled cheque (with pre-printed name & account number)",
      "Bank statement (latest 3 months, with current transactions)",
    ],
  },
];

const personDocs = [
  {
    icon: <FaUser />,
    title: "PAN &amp; Aadhaar of Directors / Partners / Proprietor",
    note: "Mandatory for all key persons of the organisation",
    items: [
      "Self-attested PAN card",
      "Self-attested Aadhaar card (mobile-linked for OTP authentication)",
      "Passport-size photograph",
    ],
  },
  {
    icon: <FaCamera />,
    title: "Authorised Signatory Identity",
    note: "Person responsible for GST filings",
    items: [
      "PAN + Aadhaar of the authorised signatory",
      "Board Resolution / Authorisation Letter appointing the signatory",
      "Digital Signature (DSC) if applicable",
    ],
  },
  {
    icon: <FaShieldAlt />,
    title: "Additional Documents",
    note: "Activity-specific or additional proofs",
    items: [
      "Head office and branch office details (if applicable)",
      "Nature of business activity (HSN / SAC code mapping)",
      "LUT Bond (for zero-rated exporters claiming refund without IGST)",
    ],
  },
];

const DocItem = ({ doc }) => (
  <div className="opcd-doc-item">
    <div className="opcd-doc-item-top">
      <div className="opcd-doc-icon">{doc.icon}</div>
      <div className="opcd-doc-meta">
        <h4 className="opcd-doc-title" dangerouslySetInnerHTML={{ __html: doc.title }} />
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

const GSTRegDocument = () => {
  return (
    <section className="opcd-section" id="documents">
      <div className="opcd-container">

        <div className="opcd-header">
          <h2 className="opcd-main-title">Documents Required for GST Registration in India</h2>
          <p className="opcd-main-subtitle">Get these ready and we'll take care of the rest</p>
        </div>

        <div className="opcd-columns">

          <div className="opcd-column">
            <div className="opcd-col-header">
              <div className="opcd-col-header-icon"><FaBuilding /></div>
              <div>
                <h3 className="opcd-col-title">Business &amp; Office Documents</h3>
                <p className="opcd-col-subtitle">Registration proof, address &amp; bank details</p>
              </div>
            </div>
            <div className="opcd-col-body">
              {businessDocs.map((doc, i) => <DocItem key={i} doc={doc} />)}
            </div>
          </div>

          <div className="opcd-column">
            <div className="opcd-col-header opcd-col-header--office">
              <div className="opcd-col-header-icon"><FaUser /></div>
              <div>
                <h3 className="opcd-col-title">Person &amp; Authorisation Documents</h3>
                <p className="opcd-col-subtitle">Identity, signatory &amp; activity proofs</p>
              </div>
            </div>
            <div className="opcd-col-body">
              {personDocs.map((doc, i) => <DocItem key={i} doc={doc} />)}
            </div>
          </div>

        </div>

      </div>
    </section>
  );
};

export default GSTRegDocument;
