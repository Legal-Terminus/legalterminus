import React from "react";
import "../CopyPvtDocument/CopyPvtDocument.css";
import {
  FaIdCard,
  FaBuilding,
  FaUniversity,
  FaUserCheck,
  FaBolt,
  FaListUl,
} from "react-icons/fa";

const leftDocs = [
  {
    icon: <FaIdCard />,
    title: "PAN of Applicant",
    note: "Must be active — inoperative PAN blocks IEC application",
    items: [
      "PAN card of the applicant entity",
      "For proprietorship: proprietor's individual PAN (mandatory)",
      "For Partnership / LLP / Pvt Ltd / HUF / Trust / Society: entity's PAN",
      "PAN must be active (not inoperative due to PAN-Aadhaar non-linkage)",
    ],
  },
  {
    icon: <FaUserCheck />,
    title: "Authorised Signatory Identity",
    note: "Aadhaar must be mobile-linked for OTP or DSC for entities",
    items: [
      "Aadhaar of authorised signatory (mobile-linked for OTP)",
      "Signatory's PAN",
      "Passport-size photograph (jpeg, < 100 KB)",
      "Email + mobile number (used for IEC certificate delivery)",
    ],
  },
  {
    icon: <FaBuilding />,
    title: "Address Proof of Business",
    note: "Utility bill not older than 2 months",
    items: [
      "Electricity / telephone / mobile postpaid bill in business name (≤ 2 months old)",
      "For rented premises: rent agreement + landlord's NoC",
      "For owned premises: property tax receipt",
      "Address must match PAN / GSTIN where available",
    ],
  },
];

const rightDocs = [
  {
    icon: <FaUniversity />,
    title: "Bank Account Details",
    note: "Account must be in entity's name",
    items: [
      "Cancelled cheque OR first page of bank passbook OR bank certificate (Format ANF 2A Appendix) on bank's letterhead",
      "Account must be in entity's name (or proprietor's name for proprietorship)",
      "IFSC code captured for AD Code linkage",
    ],
  },
  {
    icon: <FaBolt />,
    title: "Entity-Specific Documents",
    note: "Varies by entity type",
    items: [
      "Proprietorship: nil additional",
      "Partnership: Partnership Deed",
      "LLP: LLP Agreement + COI",
      "Pvt Ltd / Public Ltd: COI + MOA + AOA + Board Resolution",
      "HUF: HUF declaration + karta details",
      "Trust / Society: registration certificate + trust deed / society bye-laws + authorising letter",
    ],
  },
  {
    icon: <FaListUl />,
    title: "Optional / Sector-Specific",
    note: "For regulated products or incentive claims",
    items: [
      "Relevant licence reference if applying for IEC for a specific product needing sectoral approval (chemicals, drugs, food, jewellery)",
      "EPC membership preference if you intend to claim export incentives",
      "Indicative HSN / SAC codes (we map)",
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
            Six categories. Documentation is deliberately light because IEC is a self-declaration-based registration with PAN-Aadhaar-bank validation. We send a personalised checklist after the discovery call.
          </p>
        </div>

        <div className="cpvd-columns">
          <div className="cpvd-column">
            <div className="cpvd-col-header">
              <div className="cpvd-col-header-icon"><FaIdCard /></div>
              <div>
                <h3 className="cpvd-col-title">Identity &amp; Signatory Documents</h3>
                <p className="cpvd-col-subtitle">PAN, Aadhaar, photograph &amp; address proof</p>
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
              <div className="cpvd-col-header-icon"><FaUniversity /></div>
              <div>
                <h3 className="cpvd-col-title">Bank, Entity &amp; Optional Documents</h3>
                <p className="cpvd-col-subtitle">Bank account, entity-specific &amp; sector docs</p>
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
