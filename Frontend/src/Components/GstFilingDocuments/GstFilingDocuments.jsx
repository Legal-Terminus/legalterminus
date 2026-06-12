import React from "react";
import "./GstFilingDocuments.css";
import { FaUser, FaBuilding, FaIdCard, FaFileInvoiceDollar, FaShoppingCart, FaUniversity, FaFileAlt, FaPercent } from "react-icons/fa";

const salesDocs = [
  {
    icon: <FaFileInvoiceDollar />,
    title: "Outward Supplies Register (Sales)",
    note: "Every outward invoice issued during the month",
    items: [
      "Invoice number, date, customer name + GSTIN, place of supply, HSN / SAC code, taxable value, tax rate (CGST / SGST / IGST / Cess)",
      "Invoice type (B2B / B2C / Export / SEZ / Deemed Export / Nil-rated / Exempt)",
      "Credit notes + debit notes with linked original invoice",
      "Export invoices with shipping bill / LUT details",
    ],
  },
  {
    icon: <FaFileAlt />,
    title: "E-Way Bill Register",
    note: "For goods movements above Rs.50,000",
    items: [
      "List of e-way bills generated during the month",
      "Inward + outward e-way bills with invoice linkage",
      "Cancellation / rejection records",
      "Used for reconciliation against GSTR-1 outward supplies (a key audit-trigger area)",
    ],
  },
  {
    icon: <FaPercent />,
    title: "E-Invoice (IRN) Register",
    note: "For taxpayers with turnover above Rs.5 crore",
    items: [
      "List of e-invoices generated (IRN + QR code) for B2B / export supplies",
      "Auto-flows into GSTR-1 - but we cross-verify for completeness",
      "E-invoice non-generation under Rule 48(4) attracts penalty under Section 122",
    ],
  },
];

const purchaseDocs = [
  {
    icon: <FaShoppingCart />,
    title: "Inward Supplies Register (Purchases)",
    note: "Every purchase invoice received during the month",
    items: [
      "Supplier GSTIN, invoice number + date, taxable value, tax rate",
      "ITC eligibility classification (eligible / blocked under Section 17(5))",
      "Capital goods vs inputs vs input services",
      "Import bill of entry (for imports); reverse charge invoices separately tagged",
    ],
  },
  {
    icon: <FaUniversity />,
    title: "Bank Statement + Expense Vouchers",
    note: "For matching against booked revenue + expenses",
    items: [
      "Monthly bank statement",
      "Expense vouchers above Rs.50,000 with vendor GSTIN where applicable",
      "ITC voucher review for blocked-credit items (Section 17(5) - motor vehicles, food, club membership, etc.)",
      "Cash payment register (Rule 36(4) supporting documentation)",
    ],
  },
  {
    icon: <FaIdCard />,
    title: "Compliance Inputs + Notice Tray",
    note: "Scheme preferences, LUT, RCM & notices",
    items: [
      "QRMP scheme opt-in / opt-out preference (if applicable)",
      "LUT (Letter of Undertaking) status for exporters; RCM liability list",
      "Pending refund applications",
      "GST notices / orders / queries received via portal notice-tray (DRC-01A, DRC-01, ASMT-10, RFD-08, audit notices)",
      "Composition scheme conversion preference (annual)",
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
          <h2 className="opcd-main-title">Documents Required for GST Return Filing in India</h2>
          <p className="opcd-main-subtitle">These are the recurring monthly data inputs you share with us each filing cycle. Six categories - we send a personalised checklist + data template at onboarding.</p>
        </div>

        <div className="opcd-columns">

          <div className="opcd-column">
            <div className="opcd-col-header">
              <div className="opcd-col-header-icon"><FaUser /></div>
              <div>
                <h3 className="opcd-col-title">Sales, E-Way &amp; E-Invoice Data</h3>
                <p className="opcd-col-subtitle">Outward supplies, e-way bills &amp; IRN</p>
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
                <h3 className="opcd-col-title">Purchases, Bank &amp; Compliance</h3>
                <p className="opcd-col-subtitle">ITC, payments &amp; notice tray</p>
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
