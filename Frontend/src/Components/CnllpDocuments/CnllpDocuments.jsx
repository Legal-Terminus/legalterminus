import React from "react";
import "./CnllpDocuments.css";
import { FaFileSignature, FaUsers, FaIdCard, FaStamp, FaTrademark, FaFileContract, FaCheckCircle, FaPenFancy } from "react-icons/fa";

const llpDocs = [
  {
    icon: <FaFileSignature />,
    title: "Existing LLP Records",
    note: "Current constitution",
    items: [
      "Certificate of Incorporation of the LLP",
      "Existing LLP agreement & any amendments",
      "LLPIN & PAN of the LLP",
    ],
  },
  {
    icon: <FaCheckCircle />,
    title: "New Name Details",
    note: "For reservation & approval",
    items: [
      "1–2 proposed new names (in order of preference)",
      "Significance / meaning of the proposed name",
      "Objects / business activity (for guideline check)",
    ],
  },
  {
    icon: <FaTrademark />,
    title: "Trademark Proof (if applicable)",
    note: "Where the name is based on a mark",
    items: [
      "Trademark registration / application, if any",
      "Trademark owner's NOC (if name uses a registered mark)",
    ],
  },
];

const partnerDocs = [
  {
    icon: <FaIdCard />,
    title: "Partner KYC",
    note: "For all designated partners",
    items: [
      "PAN & Aadhaar of all partners",
      "DPIN/DIN & DSC of the signing partner",
      "Updated mobile & email of partners",
    ],
  },
  {
    icon: <FaPenFancy />,
    title: "Consent & Resolution",
    note: "Approving the change",
    items: [
      "Consent of all partners to the name change",
      "Resolution authorising the filing",
      "Authority to the signing designated partner",
    ],
  },
  {
    icon: <FaStamp />,
    title: "Supplementary Agreement",
    note: "Recording the new name",
    items: [
      "Supplementary LLP agreement (drafted by us)",
      "Executed on stamp paper per state stamp duty",
      "Signed by all partners",
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

const CnllpDocuments = () => {
  return (
    <section className="opcd-section" id="documents">
      <div className="opcd-container">

        <div className="opcd-header">
          <h2 className="opcd-main-title">Documents Required to Change an LLP's Name</h2>
          <p className="opcd-main-subtitle">Get these ready and we'll take care of the rest</p>
        </div>

        <div className="opcd-columns">

          <div className="opcd-column">
            <div className="opcd-col-header">
              <div className="opcd-col-header-icon"><FaFileContract /></div>
              <div>
                <h3 className="opcd-col-title">LLP &amp; New-Name Documents</h3>
                <p className="opcd-col-subtitle">Existing records &amp; the proposed name</p>
              </div>
            </div>
            <div className="opcd-col-body">
              {llpDocs.map((doc, i) => (
                <DocItem key={i} doc={doc} />
              ))}
            </div>
          </div>

          <div className="opcd-column">
            <div className="opcd-col-header opcd-col-header--office">
              <div className="opcd-col-header-icon"><FaUsers /></div>
              <div>
                <h3 className="opcd-col-title">Partner &amp; Approval Documents</h3>
                <p className="opcd-col-subtitle">KYC, consent &amp; agreement</p>
              </div>
            </div>
            <div className="opcd-col-body">
              {partnerDocs.map((doc, i) => (
                <DocItem key={i} doc={doc} />
              ))}
            </div>
          </div>

        </div>

      </div>
    </section>
  );
};

export default CnllpDocuments;
