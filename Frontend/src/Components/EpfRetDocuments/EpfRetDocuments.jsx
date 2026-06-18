import React from "react";
import "./EpfRetDocuments.css";
import { FaBuilding, FaIdCard, FaUserPlus, FaUserMinus, FaFileInvoiceDollar, FaUsers } from "react-icons/fa";

const employerDocs = [
  {
    icon: <FaFileInvoiceDollar />,
    title: "Monthly Wage Register",
    note: "The foundation of every ECR",
    items: [
      "Member-wise: Name, UAN, Designation, Date of Joining",
      "Days Worked, LOP Days, Basic, DA, Actual Wage Paid",
      "Excel / payroll export (Zoho / Keka / GreytHR / Tally / SAP)",
    ],
  },
  {
    icon: <FaUserPlus />,
    title: "New Joinee Data (Monthly)",
    note: "For employee addition, UAN & KYC seeding",
    items: [
      "Name, DOB, Father's / Spouse's name, Gender",
      "Aadhaar, PAN, Bank A/c + IFSC, previous UAN (if any)",
      "Form 11 self-declaration + Joining Date",
    ],
  },
];

const memberDocs = [
  {
    icon: <FaIdCard />,
    title: "UAN + KYC Records (Periodic)",
    note: "Member-master, updated each month",
    items: [
      "UAN + KYC status: Aadhaar / PAN / Bank seeding",
      "Aadhaar copy, PAN copy, bank passbook / cancelled cheque",
      "For new joinees + KYC-pending existing members",
    ],
  },
  {
    icon: <FaUserMinus />,
    title: "Employee Exit Details (Full Settlement Pack)",
    note: "For exit marking on the EPFO portal",
    items: [
      "Last working day, reason, designation, last Basic + DA",
      "LOP days in exit month + full-and-final settlement status",
      "Withdrawal preference: Form 19 / 10C / transfer via Form 13",
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

const EpfRetDocuments = () => {
  return (
    <section className="opcd-section" id="documents">
      <div className="opcd-container">

        <div className="opcd-header">
          <h2 className="opcd-main-title">Documents Required for EPF Return Filing in India</h2>
          <p className="opcd-main-subtitle">
            The recurring monthly data inputs you share with us each cycle — we send a personalised checklist &amp; data template at onboarding
          </p>
        </div>

        <div className="opcd-columns">

          <div className="opcd-column">
            <div className="opcd-col-header">
              <div className="opcd-col-header-icon"><FaBuilding /></div>
              <div>
                <h3 className="opcd-col-title">Monthly Wage &amp; Joinee Inputs</h3>
                <p className="opcd-col-subtitle">Wage register &amp; new joiners</p>
              </div>
            </div>
            <div className="opcd-col-body">
              {employerDocs.map((doc, i) => (
                <DocItem key={i} doc={doc} />
              ))}
            </div>
          </div>

          <div className="opcd-column">
            <div className="opcd-col-header opcd-col-header--office">
              <div className="opcd-col-header-icon"><FaUsers /></div>
              <div>
                <h3 className="opcd-col-title">KYC &amp; Exit Records</h3>
                <p className="opcd-col-subtitle">Member KYC &amp; exit updates</p>
              </div>
            </div>
            <div className="opcd-col-body">
              {memberDocs.map((doc, i) => (
                <DocItem key={i} doc={doc} />
              ))}
            </div>
          </div>

        </div>

      </div>
    </section>
  );
};

export default EpfRetDocuments;
