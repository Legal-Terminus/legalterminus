import React from "react";
import "./ShopRegDocuments.css";
import { FaUser, FaBuilding, FaIdCard, FaFileAlt, FaCamera, FaBolt, FaFileContract, FaShieldAlt, FaUsers } from "react-icons/fa";

const ownerDocs = [
  {
    icon: <FaIdCard />,
    title: "Identity Proof of Owner / Partners / Directors",
    note: "Mandatory for all proprietors, partners, or directors",
    items: [
      "Self-attested PAN Card (mandatory)",
      "Self-attested Aadhaar Card",
      "Passport-size Photograph of each proprietor / partner / director",
    ],
  },
  {
    icon: <FaFileAlt />,
    title: "Organisation PAN Card",
    note: "PAN of the business entity (firm, company, LLP, etc.)",
    items: [
      "PAN Card of the Organisation (if applicable — proprietorship may use owner's PAN)",
    ],
  },
  {
    icon: <FaUsers />,
    title: "Employee Details",
    note: "Required for determining applicable government fee",
    items: [
      "Number of Employees (male and female separately, if applicable)",
      "Board Resolution for Authorised Person (for companies and LLPs)",
    ],
  },
  {
    icon: <FaCamera />,
    title: "Specimen Signature",
    note: "For the authorised signatory of the application",
    items: [
      "Specimen Signature of the Applicant / Authorised Signatory",
    ],
  },
];

const premisesDocs = [
  {
    icon: <FaBolt />,
    title: "Electricity Bill of Business Premises",
    note: "Not older than 2 months from date of application",
    items: [
      "Latest Electricity Bill of the registered office / business premises",
    ],
  },
  {
    icon: <FaFileContract />,
    title: "Rent Agreement (if Premises is Rented)",
    note: "Duly executed between property owner and applicant",
    items: [
      "Registered or notarized Rent Agreement between the property owner and the applicant",
    ],
  },
  {
    icon: <FaShieldAlt />,
    title: "Registration / Incorporation Certificate",
    note: "Proof of the organisation's legal existence",
    items: [
      "Certificate of Incorporation / Partnership Deed / GST Certificate / UDYAM Certificate (any one applicable)",
    ],
  },
  {
    icon: <FaCamera />,
    title: "Signboard Photograph",
    note: "Mandatory under Odisha S&E Rules",
    items: [
      "Photograph of the Sign Board displaying the business name and complete address in both Odia and English languages",
    ],
  },
];

const DocItem = ({ doc }) => (
  <div className="shopdoc-doc-item">
    <div className="shopdoc-doc-item-top">
      <div className="shopdoc-doc-icon">{doc.icon}</div>
      <div className="shopdoc-doc-meta">
        <h4 className="shopdoc-doc-title">{doc.title}</h4>
        <span className="shopdoc-doc-note">{doc.note}</span>
      </div>
    </div>
    <ul className="shopdoc-doc-list">
      {doc.items.map((item, i) => (
        <li key={i} className="shopdoc-doc-list-item">{item}</li>
      ))}
    </ul>
  </div>
);

const ShopDocuments = () => {
  return (
    <section className="shopdoc-section">
      <div className="shopdoc-container">

        <div className="shopdoc-header">
          <h2 className="shopdoc-main-title">Documents Required for Shop &amp; Establishment Registration in India</h2>
          <p className="shopdoc-main-subtitle">Get these ready and we'll take care of the rest. A detailed checklist will also be shared by our team.</p>
        </div>

        <div className="shopdoc-columns">

          <div className="shopdoc-column">
            <div className="shopdoc-col-header">
              <div className="shopdoc-col-header-icon"><FaUser /></div>
              <div>
                <h3 className="shopdoc-col-title">Owner / Business Documents</h3>
                <p className="shopdoc-col-subtitle">Required for the proprietor, partners, or directors</p>
              </div>
            </div>
            <div className="shopdoc-col-body">
              {ownerDocs.map((doc, i) => (
                <DocItem key={i} doc={doc} />
              ))}
            </div>
          </div>

          <div className="shopdoc-column">
            <div className="shopdoc-col-header shopdoc-col-header--office">
              <div className="shopdoc-col-header-icon"><FaBuilding /></div>
              <div>
                <h3 className="shopdoc-col-title">Premises &amp; Business Documents</h3>
                <p className="shopdoc-col-subtitle">Required for the establishment's registered address</p>
              </div>
            </div>
            <div className="shopdoc-col-body">
              {premisesDocs.map((doc, i) => (
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
