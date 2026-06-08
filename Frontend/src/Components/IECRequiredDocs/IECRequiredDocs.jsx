import React from "react";
import "../CopyPvtDocument/CopyPvtDocument.css";
import {
  FaIdCard,
  FaBuilding,
  FaBolt,
  FaUniversity,
  FaUserCheck,
} from "react-icons/fa";

const leftDocs = [
  {
    icon: <FaIdCard />,
    title: "Entity Identity Documents",
    note: "Legal existence of the entity applying for IEC",
    items: [
      "Entity PAN card (mandatory — IEC is PAN-based)",
      "For Pvt Ltd / LLP: Certificate of Incorporation + MOA/AOA",
      "For Partnership Firm: Registered Partnership Deed",
      "For Proprietorship: Proprietor's PAN + GST Certificate / MSME Udyam",
      "GST Registration Certificate (if GST registered)",
    ],
  },
  {
    icon: <FaUserCheck />,
    title: "Authorised Signatory Identity",
    note: "Director / Partner / Proprietor — Aadhaar must be mobile-linked",
    items: [
      "Aadhaar of authorised signatory (mobile-linked for OTP)",
      "PAN of authorised signatory",
      "Passport-size photograph (jpeg format)",
      "Board Resolution / Authorisation Letter (for companies and LLPs)",
    ],
  },
];

const rightDocs = [
  {
    icon: <FaBuilding />,
    title: "Registered Office Address Proof",
    note: "Business address — utility bill not older than 60 days",
    items: [
      "Electricity / gas / telephone bill (not older than 60 days)",
      "Owned premises: property tax receipt or sale deed",
      "Rented premises: registered rent agreement + landlord NoC",
    ],
  },
  {
    icon: <FaUniversity />,
    title: "Bank Account Details",
    note: "Current account in the entity's name",
    items: [
      "Cancelled cheque (current account in business name)",
      "OR bank certificate / passbook first page with IFSC + account number",
      "Bank account must match the entity name on the IEC application",
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

const IECRequiredDocs = () => {
  return (
    <section className="cpvd-section">
      <div className="cpvd-container">
        <div className="cpvd-header">
          <h2 className="cpvd-main-title">
            Documents Required for IEC Registration in India
          </h2>
          <p className="cpvd-main-subtitle">
            Get these ready and we'll take care of the rest. We send a personalised checklist after the consultation call.
          </p>
        </div>

        <div className="cpvd-columns">
          <div className="cpvd-column">
            <div className="cpvd-col-header">
              <div className="cpvd-col-header-icon"><FaIdCard /></div>
              <div>
                <h3 className="cpvd-col-title">Entity Identity &amp; Signatory Documents</h3>
                <p className="cpvd-col-subtitle">Legal identity &amp; authorisation proof</p>
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
              <div className="cpvd-col-header-icon"><FaBuilding /></div>
              <div>
                <h3 className="cpvd-col-title">Address &amp; Bank Account Documents</h3>
                <p className="cpvd-col-subtitle">Registered office address &amp; bank verification</p>
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

export default IECRequiredDocs;
