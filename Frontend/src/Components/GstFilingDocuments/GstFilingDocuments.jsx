import React from "react";
import "./GstFilingDocuments.css";
import { FaUser, FaBuilding, FaIdCard, FaFileInvoiceDollar, FaShoppingCart, FaUniversity, FaFileAlt, FaPercent } from "react-icons/fa";

const salesDocs = [
  {
    icon: <FaIdCard />,
    title: "GST Registration Details",
    note: "Required for portal access & filing",
    items: [
      "GSTIN & GST portal login credentials",
      "Registration certificate (REG-06)",
      "Filing frequency / scheme (Regular, QRMP, Composition)",
    ],
  },
  {
    icon: <FaFileInvoiceDollar />,
    title: "Outward Supply (Sales) Records",
    note: "For GSTR-1 & GSTR-3B",
    items: [
      "Sales register / invoice list (B2B & B2C)",
      "Taxable value, rate & tax (CGST / SGST / IGST / Cess)",
      "Credit & debit notes, exports & e-commerce sales",
    ],
  },
  {
    icon: <FaPercent />,
    title: "HSN / SAC Summary",
    note: "Mandatory HSN-wise reporting",
    items: [
      "HSN / SAC codes for goods & services supplied",
      "Quantity, unit & taxable value per HSN",
    ],
  },
];

const purchaseDocs = [
  {
    icon: <FaShoppingCart />,
    title: "Inward Supply (Purchase) Records",
    note: "For ITC computation",
    items: [
      "Purchase register / inward invoice list",
      "Vendor GSTINs & tax break-up",
      "Import / RCM (reverse charge) purchases",
    ],
  },
  {
    icon: <FaFileAlt />,
    title: "GSTR-2B Reconciliation Data",
    note: "Auto-drafted ITC statement",
    items: [
      "GSTR-2B for the period (downloaded from portal)",
      "Details of any ineligible / blocked credit",
    ],
  },
  {
    icon: <FaUniversity />,
    title: "Bank & Tax Payment Details",
    note: "For payment & reconciliation",
    items: [
      "Bank statement for the period",
      "Electronic cash / credit ledger balance",
      "Previous period's filed returns & challans",
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

const GstFilingDocuments = () => {
  return (
    <section className="opcd-section" id="documents">
      <div className="opcd-container">

        <div className="opcd-header">
          <h2 className="opcd-main-title">Documents Required for GST Return Filing</h2>
          <p className="opcd-main-subtitle">Share these each period and we'll take care of the filing</p>
        </div>

        <div className="opcd-columns">

          <div className="opcd-column">
            <div className="opcd-col-header">
              <div className="opcd-col-header-icon"><FaUser /></div>
              <div>
                <h3 className="opcd-col-title">Registration &amp; Sales (Outward) Data</h3>
                <p className="opcd-col-subtitle">For GSTR-1 &amp; outward liability</p>
              </div>
            </div>
            <div className="opcd-col-body">
              {salesDocs.map((doc, i) => (
                <DocItem key={i} doc={doc} />
              ))}
            </div>
          </div>

          <div className="opcd-column">
            <div className="opcd-col-header opcd-col-header--office">
              <div className="opcd-col-header-icon"><FaBuilding /></div>
              <div>
                <h3 className="opcd-col-title">Purchase (Inward) &amp; Payment Data</h3>
                <p className="opcd-col-subtitle">For ITC, GSTR-3B &amp; reconciliation</p>
              </div>
            </div>
            <div className="opcd-col-body">
              {purchaseDocs.map((doc, i) => (
                <DocItem key={i} doc={doc} />
              ))}
            </div>
          </div>

        </div>

      </div>
    </section>
  );
};

export default GstFilingDocuments;
