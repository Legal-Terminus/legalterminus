import React from "react";
import "./EpfRetDocuments.css";
import { FaBuilding, FaIdCard, FaUserPlus, FaUserMinus, FaFileInvoiceDollar, FaUsers } from "react-icons/fa";

const employerDocs = [
  {
    icon: <FaFileInvoiceDollar />,
    title: "1. Monthly Wage Register",
    text: "Every member's monthly payroll data: Name + UAN + Designation + Date of Joining + Days Worked + LOP Days + Basic Salary + Dearness Allowance + Actual Wage Paid. Provided in Excel / payroll software export (Zoho / Keka / GreytHR / Tally / SAP). Used for ECR preparation + member-wise contribution computation. The foundation of every month's ECR.",
  },
  {
    icon: <FaUserPlus />,
    title: "2. New Joinee Data (Monthly)",
    text: "For each new employee joining during the month: Name + Date of Birth + Father's / Spouse's name + Gender + Aadhaar Number + PAN + Bank Account Number + IFSC + Previous PF UAN (if any) + Form 11 self-declaration + Joining Date. Used for employee addition + UAN allotment + KYC seeding.",
  },
];

const memberDocs = [
  {
    icon: <FaIdCard />,
    title: "3. UAN + KYC Records (Periodic)",
    text: "Master record of all members' UANs + KYC status: Aadhaar linkage (seeded / pending / mismatch), PAN linkage, Bank account linkage with IFSC. KYC documents (Aadhaar card copy, PAN card copy, Bank passbook / cancelled cheque) for new joinees + KYC-pending existing members. Maintained as a member-master; updated each month.",
  },
  {
    icon: <FaUserMinus />,
    title: "4. Employee Exit Details (Full Settlement Pack)",
    text: "For each member exiting during the month: LAST WORKING DAY + reason for exit + designation at exit + last drawn Basic + DA + LOP days in exit month + full-and-final settlement status + leave encashment + gratuity (if applicable, separate compliance) + member's WITHDRAWAL preference (Form 19 PF withdrawal / Form 10C pension / transfer to new employer via Form 13). We mark the exit on the EPFO portal in the next ECR + member can then initiate withdrawal / transfer.",
  },
];

const DocItem = ({ doc }) => (
  <div className="opcd-doc-item">
    <div className="opcd-doc-item-top">
      <div className="opcd-doc-icon">{doc.icon}</div>
      <div className="opcd-doc-meta">
        <h4 className="opcd-doc-title">{doc.title}</h4>
      </div>
    </div>
    <p className="opcd-doc-text">{doc.text}</p>
  </div>
);

const EpfRetDocuments = () => {
  return (
    <section className="opcd-section" id="documents">
      <div className="opcd-container">

        <div className="opcd-header">
          <h2 className="opcd-main-title">Documents Required for EPF Return Filing in India</h2>
          <p className="opcd-main-subtitle">
            This Section Is Reframed From "One-Time Registration Documents" To The Recurring Monthly Data Inputs You Share With Us Each Cycle. Six Categories. We Send A Personalised Checklist + Data Template At Onboarding.
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
