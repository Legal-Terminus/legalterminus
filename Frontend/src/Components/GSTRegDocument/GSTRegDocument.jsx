import React from "react";
import "./GSTRegDocument.css";
import { FaUser, FaBuilding, FaIdCard, FaFileContract, FaShieldAlt, FaBolt, FaFileAlt, FaPhone } from "react-icons/fa";

const col1Docs = [
  {
    icon: <FaIdCard />,
    title: "Applicant Identity",
    note: "Required for all promoters / partners / directors",
    items: [
      "PAN card of all promoters / partners / directors",
      "Aadhaar card of all promoters / partners / directors",
      "Passport-size photo (jpeg, < 100 KB)",
    ],
  },
  {
    icon: <FaBuilding />,
    title: "Business Entity Proof",
    note: "Depends on your business structure",
    items: [
      "Certificate of Incorporation (companies / LLPs)",
      "Partnership Deed (firms)",
      "Trust Deed / Society Registration",
      "Sole proprietor: PAN + address proof of proprietor",
    ],
  },
  {
    icon: <FaBolt />,
    title: "Principal Place of Business",
    note: "Address proof for your registered office",
    items: [
      "Owned: Latest electricity bill",
      "Rented: Notarised rent agreement + landlord's NoC + electricity bill",
      "Shared / co-working: Service agreement + landlord NoC",
    ],
  },
];

const col2Docs = [
  {
    icon: <FaPhone />,
    title: "Contact Details",
    note: "For all individuals and the authorised signatory",
    items: [
      "Mobile No. and eMail ID of each individual",
      "Authorised Mobile No. and eMail ID to be registered with GST",
    ],
  },
  {
    icon: <FaShieldAlt />,
    title: "Authorization Document",
    note: "Appointing the authorised signatory",
    items: [
      "Board Resolution / Letter of Authorisation appointing authorised signatory",
    ],
  },
  {
    icon: <FaFileContract />,
    title: "Bank Account Details",
    note: "Mandatory within 30 days post-registration",
    items: [
      "Cancelled cheque OR first page of bank passbook OR bank statement (last 3 months) showing Account No. + IFSC + account holder name",
      "Mandatory within 30 days post-registration",
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

const GSTRegDocument = () => {
  return (
    <section className="opcd-section" id="documents">
      <div className="opcd-container">

        <div className="opcd-header">
          <h2 className="opcd-main-title">Documents Required for GST Registration in India</h2>
          <p className="opcd-main-subtitle">
            Six categories. The exact list per category depends on your entity type — we send a customised checklist after the discovery call.
          </p>
        </div>

        <div className="opcd-columns">

          <div className="opcd-column">
            <div className="opcd-col-header">
              <div className="opcd-col-header-icon"><FaBuilding /></div>
              <div>
                <h3 className="opcd-col-title">Business &amp; Office Documents</h3>
                <p className="opcd-col-subtitle">Entity proof, address &amp; contact details</p>
              </div>
            </div>
            <div className="opcd-col-body">
              {col1Docs.map((doc, i) => <DocItem key={i} doc={doc} />)}
            </div>
          </div>

          <div className="opcd-column">
            <div className="opcd-col-header opcd-col-header--office">
              <div className="opcd-col-header-icon"><FaUser /></div>
              <div>
                <h3 className="opcd-col-title">Authorization &amp; Banking Documents</h3>
                <p className="opcd-col-subtitle">Signatory authorisation &amp; bank proof</p>
              </div>
            </div>
            <div className="opcd-col-body">
              {col2Docs.map((doc, i) => <DocItem key={i} doc={doc} />)}
            </div>
          </div>

        </div>

      </div>
    </section>
  );
};

export default GSTRegDocument;
