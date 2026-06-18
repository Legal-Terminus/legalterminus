import React from "react";
import "./EsiRetDocuments.css";
import { FaBuilding, FaKey, FaIdCard, FaMoneyCheckAlt, FaUserPlus, FaUserMinus, FaFileInvoiceDollar, FaUsers } from "react-icons/fa";

const employerDocs = [
  {
    icon: <FaFileInvoiceDollar />,
    title: "Monthly Wage Register",
    text: "Every IP's monthly payroll data: Name + IP Number + Designation + Date of Joining + Days Worked + LOP Days + Gross Wages (Basic + DA + HRA + other allowances forming part of 'wages' under Section 2(22) ESI Act) + Actual Wage Paid. Provided in Excel / payroll software export (Zoho / Keka / GreytHR / Tally / SAP). The foundation of every month's Contribution upload.",
  },
  {
    icon: <FaUserPlus />,
    title: "New Joinee (Monthly)",
    text: "NEW JOINEES during the month (gross wages ≤ ₹21,000 covered): Name + DOB + Father's / Spouse's name + Gender + Aadhaar + PAN + Bank Account + IFSC + Family / Nominee details + Photograph + Joining Date + Designation. Used for IP creation in ESIC portal.",
  },
];

const memberDocs = [
  {
    icon: <FaIdCard />,
    title: "IP / ESI Number Records (Periodic)",
    text: "Master record of all IPs with their IP Numbers (allotted by ESIC portal), Aadhaar, PAN, Bank account, family / nominee details. IP photograph (mandatory for benefit claims). For existing IPs from previous employers: previous IP Number for transfer of insurance. We maintain this master in the portal.",
  },
  {
    icon: <FaUserMinus />,
    title: "Employee Exit Details (Full Settlement Pack)",
    text: "For each member exiting during the month: LAST WORKING DAY + reason for exit + designation at exit + last drawn gross wages + LOP days in exit month + full-and-final settlement status + member's preference (continued ESI coverage via new employer / no further coverage). We mark the exit on ESIC portal in the next Contribution upload.",
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
    <p className="esiret-doc-text">{doc.text}</p>
  </div>
);

const EsiRetDocuments = () => {
  return (
    <section className="opcd-section" id="documents">
      <div className="opcd-container">

        <div className="opcd-header">
          <h2 className="opcd-main-title">Documents Required for ESI Return Filing in India</h2>
          <p className="opcd-main-subtitle">These are the recurring monthly data inputs you share with us each cycle. We send a personalised checklist + data template at onboarding.</p>
        </div>

        <div className="opcd-columns">

          <div className="opcd-column">
            <div className="opcd-col-header">
              <div className="opcd-col-header-icon"><FaBuilding /></div>
              <div>
                <h3 className="opcd-col-title">Wage &amp; Joinee Data</h3>
                <p className="opcd-col-subtitle">Monthly payroll &amp; new IP creation</p>
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
                <h3 className="opcd-col-title">IP Records &amp; Exit Updates</h3>
                <p className="opcd-col-subtitle">IP master &amp; member exits</p>
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

export default EsiRetDocuments;
