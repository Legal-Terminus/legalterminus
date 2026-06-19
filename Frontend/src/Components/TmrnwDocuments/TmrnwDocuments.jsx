import React from "react";
import "./TmrnwDocuments.css";
import { FaUser, FaBuilding, FaIdCard, FaTrademark, FaFileSignature, FaCertificate, FaCalendarAlt, FaExchangeAlt } from "react-icons/fa";

const markDocs = [
  {
    icon: <FaCertificate />,
    title: "Existing Trademark Registration Certificate",
    text: "ORIGINAL Trademark Registration Certificate (or copy with the TM Registration Number visible). Class(es) of registration. Mark image as registered. Date of registration + date of expiry. Used for status verification + Form TM-R pre-population. The single most important document — everything starts from here.",
  },
  {
    icon: <FaIdCard />,
    title: "Applicant Identity",
    text: "For INDIVIDUAL proprietors: PAN + Aadhaar + photograph + residence address proof. For COMPANIES / LLPs / PARTNERSHIPS: entity PAN + Certificate of Incorporation / Partnership Deed / LLP Certificate + authorised signatory PAN + KYC. For sole proprietorship firms holding the mark: the proprietor's personal PAN suffices.",
  },
  {
    icon: <FaFileSignature />,
    title: "Power of Attorney (Form TM-48) + Authorisation Letter",
    text: "For AGENT CHANGE cases (Enriched / Supreme): Power of Attorney (FORM TM-48) executed by the proprietor in favour of Legal Terminus. Authorisation Letter (for entities) confirming the signatory's authority to execute POA on behalf of the company / LLP. WE DRAFT both documents; you sign on ₹100 stamp paper. We coordinate stamping. Not required for Elemental (LT already on record).",
  },
];

const applicantDocs = [
  {
    icon: <FaExchangeAlt />,
    title: "Status Documents (Recordal Update Only — No Renewal Rebate)",
    text: "GOOD TO KNOW: The 50% Govt fee rebate (₹4,500) for Individual / DPIIT Startup / Udyam MSME applicants is a FILING-STAGE benefit (Form TM-A) — it does NOT apply at renewal. Renewal Govt fee is uniform ₹9,000 per class. However, where the trademark's recordal needs updating (e.g., proprietor recently obtained Udyam registration, address has changed, entity converted), we can file Form TM-M alongside the renewal to keep the register clean. Add-on at ₹999 + GST + Form TM-M Govt fee.",
  },
  {
    icon: <FaTrademark />,
    title: "Restoration Statement of Case + Form TM-18 (Restoration cases only)",
    text: "For RESTORATION cases (within 1 year post-expiry): FORM TM-18 (Affidavit) declaring the reasons for delay in renewal + the proprietor's continued intent to use the mark. STATEMENT OF CASE explaining why restoration is warranted (e.g., genuine oversight, business circumstances, change in personnel, etc.). Supporting evidence of continuous use of the mark in commerce. We draft the affidavit + Statement of Case; you sign before a notary.",
  },
  {
    icon: <FaCalendarAlt />,
    title: "Updated Contact / Communication Details for Reminder Calendar",
    text: "Authorised contact name + email + mobile — for our LIFELONG REMINDER calendar. Multiple contacts encouraged (founder + IP-lead + admin) to ensure reminders reach the right person even after personnel changes. UPDATE PROCESS: send us updated contact details any time via email — we sync our calendar within 24 hours.",
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
    <p className="tmrnw-doc-text">{doc.text}</p>
  </div>
);

const TmrnwDocuments = () => {
  return (
    <section className="opcd-section" id="documents">
      <div className="opcd-container">

        <div className="opcd-header">
          <h2 className="opcd-main-title">Documents Required for Trademark Renewal in India</h2>
          <p className="opcd-main-subtitle">Six categories. Renewal documentation is light — mainly the existing Registration Certificate + proprietor identity. Additional POA + Authorisation Letter for Enriched (Agent Change) cases. We send a personalised checklist after the discovery call.</p>
        </div>

        <div className="opcd-columns">

          <div className="opcd-column">
            <div className="opcd-col-header">
              <div className="opcd-col-header-icon"><FaTrademark /></div>
              <div>
                <h3 className="opcd-col-title">Mark, Identity &amp; POA</h3>
                <p className="opcd-col-subtitle">Registration cert, proprietor &amp; agent change</p>
              </div>
            </div>
            <div className="opcd-col-body">
              {markDocs.map((doc, i) => (
                <DocItem key={i} doc={doc} />
              ))}
            </div>
          </div>

          <div className="opcd-column">
            <div className="opcd-col-header opcd-col-header--office">
              <div className="opcd-col-header-icon"><FaUser /></div>
              <div>
                <h3 className="opcd-col-title">Status, Restoration &amp; Reminders</h3>
                <p className="opcd-col-subtitle">Recordal, TM-18 &amp; contact details</p>
              </div>
            </div>
            <div className="opcd-col-body">
              {applicantDocs.map((doc, i) => (
                <DocItem key={i} doc={doc} />
              ))}
            </div>
          </div>

        </div>

      </div>
    </section>
  );
};

export default TmrnwDocuments;
