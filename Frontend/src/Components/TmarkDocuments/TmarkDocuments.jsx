import React from "react";
import "./TmarkDocuments.css";
import { FaUser, FaBuilding, FaIdCard, FaTrademark, FaFileSignature, FaCertificate, FaImage, FaClipboardList } from "react-icons/fa";

const applicantDocs = [
  {
    icon: <FaIdCard />,
    title: "Applicant Identity & Address",
    note: "For all applicant types",
    items: [
      "PAN card of the applicant / proprietor / company",
      "Aadhaar / address proof of the signatory",
      "Email ID & mobile number for correspondence",
    ],
  },
  {
    icon: <FaCertificate />,
    title: "MSME / Startup Proof (for lower fee)",
    note: "To claim the ₹4,500 concessional fee",
    items: [
      "Udyam (MSME) registration certificate, or",
      "DPIIT Startup recognition certificate",
      "(Individuals also qualify for the concessional fee)",
    ],
  },
  {
    icon: <FaFileSignature />,
    title: "Power of Attorney",
    note: "Authorising us to file (Form TM-48)",
    items: [
      "Signed Power of Attorney (Form TM-48) — drafted by us",
      "Authorised signatory details for companies/firms",
    ],
  },
];

const markDocs = [
  {
    icon: <FaTrademark />,
    title: "The Trademark Itself",
    note: "The brand you want to protect",
    items: [
      "Brand name / word mark to be registered",
      "Logo / device in clear image format (if applicable)",
      "Tagline or slogan (if to be included)",
    ],
  },
  {
    icon: <FaClipboardList />,
    title: "Goods / Services Details",
    note: "For class selection",
    items: [
      "Description of goods or services offered",
      "Business / industry the mark is used in",
      "Class(es) to be applied for (we advise)",
    ],
  },
  {
    icon: <FaImage />,
    title: "Proof of Use (if claiming prior use)",
    note: "Optional — strengthens the application",
    items: [
      "Date of first use of the mark",
      "Evidence — invoices, packaging, ads, brochures",
      "Affidavit of user (Form TM-U, if required)",
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

const TmarkDocuments = () => {
  return (
    <section className="opcd-section" id="documents">
      <div className="opcd-container">

        <div className="opcd-header">
          <h2 className="opcd-main-title">Documents Required for a Trademark Application</h2>
          <p className="opcd-main-subtitle">Get these ready and we'll take care of the rest</p>
        </div>

        <div className="opcd-columns">

          <div className="opcd-column">
            <div className="opcd-col-header">
              <div className="opcd-col-header-icon"><FaUser /></div>
              <div>
                <h3 className="opcd-col-title">Applicant &amp; Authorisation Documents</h3>
                <p className="opcd-col-subtitle">Identity, fee-category proof &amp; POA</p>
              </div>
            </div>
            <div className="opcd-col-body">
              {applicantDocs.map((doc, i) => (
                <DocItem key={i} doc={doc} />
              ))}
            </div>
          </div>

          <div className="opcd-column">
            <div className="opcd-col-header opcd-col-header--office">
              <div className="opcd-col-header-icon"><FaBuilding /></div>
              <div>
                <h3 className="opcd-col-title">Mark &amp; Goods/Services Documents</h3>
                <p className="opcd-col-subtitle">The mark, its class &amp; proof of use</p>
              </div>
            </div>
            <div className="opcd-col-body">
              {markDocs.map((doc, i) => (
                <DocItem key={i} doc={doc} />
              ))}
            </div>
          </div>

        </div>

      </div>
    </section>
  );
};

export default TmarkDocuments;
