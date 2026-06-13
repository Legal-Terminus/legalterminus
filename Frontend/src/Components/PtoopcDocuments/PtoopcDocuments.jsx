import React from "react";
import "./PtoopcDocuments.css";
import { FaUser, FaUserShield, FaIdCard, FaBolt, FaFileContract, FaBuilding, FaBalanceScale, FaCamera } from "react-icons/fa";

const documentCategories = [
  {
    number: "1",
    title: "Founder / Sole Member Identity",
    items: [
      "Founder's PAN + Aadhaar (mandatory linkage)",
      "Latest passport-size photograph",
      "Email ID + mobile number (for OTP)",
      "Bank statement / utility bill (within 60 days) as residence proof",
      "For NRI Indian citizens: passport + 120-day residency evidence + overseas address proof",
      "DSC (Class-3 Individual, 2-year) for digital signing",
      "DIR-3 KYC if existing director",
    ],
  },
  {
    number: "2",
    title: "Nominee Documents (Form INC-3)",
    items: [
      "Nominee's PAN + Aadhaar + photograph + DSC",
      "Form INC-3 (Nominee Consent) signed by nominee on appropriate stamp paper",
      "Nominee must be: Indian citizen + Indian resident + adult (18+) + NOT already a nominee in another OPC",
    ],
  },
  {
    number: "3",
    title: "URC-1 Statutory Pack",
    items: [
      "AUDITED Statement of Accounts of the proprietorship (not older than 30 DAYS from URC-1 filing)",
      "List of MEMBERS / partners with addresses + occupations + capital contribution",
      "List of CREDITORS with claim amounts + consent letters / NOCs",
      "Declaration of SOLVENCY by the proprietor (on stamp paper – format will be given by us)",
      "Affidavits confirming compliance with Section 366",
      "Resolution of consent (where applicable)",
    ],
  },
  {
    number: "4",
    title: "URC-2 Advertisement Inputs",
    items: [
      "Proposed company name (post-name-reservation)",
      "Names of subscribers / proposed director + nominee",
      "Principal place of business",
      "Brief description of the business activity to be carried on by the company",
      "State / UT where the proprietorship is situated (determines the vernacular newspaper)",
    ],
  },
  {
    number: "5",
    title: "Registered Office + Proprietorship Records",
    items: [
      "Address proof of registered office (rent agreement OR ownership document)",
      "NOC from owner (if rented)",
      "Latest electricity bill / utility bill (within 60 days)",
      "Existing proprietorship's PAN + GSTIN + Udyam Certificate + Shop & Establishment Certificate + Trade License + FSSAI License (if applicable) + IEC + any other registrations",
      "Last 3 years' ITRs + bank statements",
    ],
  },
  {
    number: "6",
    title: "MOA + AOA + Statutory Declarations",
    items: [
      "Proposed OPC name (up to 4 options for SPICe+ Part A)",
      "Main object clauses",
      "Authorised + subscribed share capital",
      "Number + value of subscribed shares",
      "Other object clauses (incidental + ancillary)",
      "Custom AOA inputs (Supreme Plus only)",
      "Form INC-9 (Declaration by Director + Member)",
      "Stamp duty on MOA + AOA per State rate",
      "Stamp duty on Asset Transfer Agreement (Supreme / Supreme Plus)",
    ],
  },
];

const PtoopcDocuments = () => {
  return (
    <section className="opcd-section" id="documents">
      <div className="opcd-container">

        <div className="opcd-header">
          <h2 className="opcd-main-title">Documents Required for Converting Proprietorship to an OPC</h2>
          <p className="opcd-main-subtitle">Six categories. Documentation is heavier than a fresh OPC incorporation because of URC-1 + URC-2 statutory requirements: audited statement, member / creditor lists with consents, declaration of solvency, multiple affidavits. We send a personalised checklist after the discovery call.</p>
        </div>

        <div className="opcd-categories">
          {documentCategories.map((category, index) => (
            <div key={index} className="opcd-category">
              <div className="opcd-category-header">
                <span className="opcd-category-number">{category.number}</span>
                <h3 className="opcd-category-title">{category.title}</h3>
              </div>
              <ul className="opcd-category-list">
                {category.items.map((item, i) => (
                  <li key={i} className="opcd-category-item">{item}</li>
                ))}
              </ul>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
};

export default PtoopcDocuments;
