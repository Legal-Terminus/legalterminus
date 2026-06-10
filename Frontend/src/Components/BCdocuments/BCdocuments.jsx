import React from "react";
import "./BCdocuments.css";
import { FaUser, FaBuilding, FaIdCard, FaFileAlt, FaBolt, FaShieldAlt, FaBoxOpen, FaCamera } from "react-icons/fa";

const entityDocs = [
  {
    icon: <FaIdCard />,
    title: "Applicant / Entity Identity",
    note: "Mandatory for all entity types",
    items: [
      "Entity PAN",
      "Certificate of Incorporation (Companies / LLPs)",
      "Partnership Deed (Partnerships)",
      "Proprietor's PAN + Aadhaar (Proprietorships)",
      "Trust Deed / Society Registration Certificate (Trust / Society)",
      "Authorised signatory's KYC + photograph + designation letter",
    ],
  },
  {
    icon: <FaBolt />,
    title: "Business Premises Proof",
    note: "Not older than 90 days",
    items: [
      "Registered office address proof — electricity bill / rent agreement / ownership document (within 90 days)",
      "For multiple manufacturing units / warehouses (for GLN setup in Supreme tier): list of locations with addresses",
    ],
  },
  {
    icon: <FaFileAlt />,
    title: "Turnover Proof + Slab Mapping",
    note: "To map the correct GS1 India turnover slab",
    items: [
      "Audited financials of the latest financial year — to map you to the correct GS1 India turnover slab",
      "Alternatively: GST returns / CA certificate of turnover",
      "For new entities: self-declaration with projected turnover",
      "Wrong slab declaration triggers GS1 India recovery + interest",
    ],
  },
];

const complianceDocs = [
  {
    icon: <FaShieldAlt />,
    title: "Tax & Statutory Registrations",
    note: "Required for GST invoicing and MSME claim",
    items: [
      "GSTIN (required for GST invoicing of GS1 fees)",
      "For MSME 80% reimbursement claim: valid UDYAM REGISTRATION CERTIFICATE confirming Micro Manufacturing Enterprise status",
      "For exporters / importers: IEC linkage helpful for downstream SSCC / export advisory",
    ],
  },
  {
    icon: <FaBoxOpen />,
    title: "Product / SKU List",
    note: "One GTIN required per unique product variant",
    items: [
      "List of products / SKUs to be assigned GTINs",
      "For each SKU: product name, brand, category, variant (size / colour / flavour), packaging (consumer unit / case / multi-pack)",
      "For pharma: brand name + dosage + pack count",
      "Used for: right pack-size sizing + DataKart onboarding template",
    ],
  },
  {
    icon: <FaCamera />,
    title: "Brand Assets (for DataKart)",
    note: "Required for Enriched / Supreme — optional for Elemental",
    items: [
      "Brand logo (vector / high-res)",
      "Product photographs (front / back / side per SKU)",
      "Product description, ingredients (food), composition (cosmetics / pharma), nutritional information (food), MRP, manufacturing details",
      "Required for DataKart upload in Enriched / Supreme. Optional but increasingly expected by modern trade chains",
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
          <p className="opcd-main-subtitle">Six categories. Documentation is moderate — mostly identity + turnover + product details. We send a personalised checklist after the discovery call.</p>
        </div>

        <div className="opcd-columns">

          <div className="opcd-column">
            <div className="opcd-col-header">
              <div className="opcd-col-header-icon"><FaUser /></div>
              <div>
                <h3 className="opcd-col-title">Entity &amp; Compliance Documents</h3>
                <p className="opcd-col-subtitle">Identity, address proof &amp; turnover slab mapping</p>
              </div>
            </div>
            <div className="opcd-col-body">
              {entityDocs.map((doc, i) => (
                <DocItem key={i} doc={doc} />
              ))}
            </div>
          </div>

          <div className="opcd-column">
            <div className="opcd-col-header opcd-col-header--office">
              <div className="opcd-col-header-icon"><FaBuilding /></div>
              <div>
                <h3 className="opcd-col-title">Tax, Product &amp; Brand Documents</h3>
                <p className="opcd-col-subtitle">GST, SKU list &amp; DataKart assets</p>
              </div>
            </div>
            <div className="opcd-col-body">
              {complianceDocs.map((doc, i) => (
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
