import React from "react";
import "./PtoopcSteps.css";

const PtoopcSteps = () => {
  const steps = [
    {
      number: "01",
      title: "Discovery & Section 366 Eligibility Audit",
      description: "60-min call with our Company Secretary to confirm: founder's Indian-citizen + 120-day-residency status (Rule 3), nominee identification + consent, single-OPC rule check, business activity + NIC code, registered office, authorised capital, proprietorship's books-audit readiness, list of creditors, current GST / FSSAI / Shop & Estd / Trade License / Udyam / Trademarks. Day 0.",
    },
    {
      number: "02",
      title: "Documents + Audited Statement Preparation",
      description: "Personalised checklist: founder's PAN + Aadhaar + photograph, nominee's PAN + Aadhaar + INC-3 consent + photograph, registered office proof + NOC, audited statement of accounts of the proprietorship (not older than 30 days from URC-1 filing - we coordinate audit if not ready), list of members + creditors with consents, last 3 years' ITRs + GST returns. Day 1-7.",
    },
    {
      number: "03",
      title: "DSC + DIN + SPICe+ Part A Name Reservation",
      description: "DSC procured for director + nominee. DIN auto-applied via SPICe+. SPICe+ Part A filed on MCA portal with up to 4 proposed names ending with '(OPC) Private Limited'. MCA approval typically Day 7-9.",
    },
    {
      number: "04",
      title: "URC-2 NEWSPAPER ADVERTISEMENT - Publication",
      description: "Form URC-2 drafted in compliant format. Published in TWO newspapers - ONE English + ONE in the principal vernacular language of the State / UT where the proprietorship is situated. Notice of conversion + invitation for objections from creditors / members / public. Publication date is Day 0 of the statutory 21-day objection window. Day 9-10.",
    },
    {
      number: "05",
      title: "21-Day Statutory Objection Window",
      description: "Mandatory 21-day window during which creditors / members / public can object to the conversion. We monitor incoming objections, respond to legitimate concerns, and prepare an objection-handling note for URC-1. Most clean cases pass through without objections. Day 10-31.",
    },
    {
      number: "06",
      title: "URC-1 APPLICATION + SPICe+ Part B Filing",
      description: "After the 21-day window closes: Form URC-1 application + SPICe+ Part B + AGILE-PRO-S filed in parallel on MCA portal. Attachments: URC-2 newspaper cuttings, audited statement, list of members + creditors with consents, declaration of solvency, affidavits, INC-3 nominee consent, INC-9 declaration, MOA + AOA. Day 31-33.",
    },
    {
      number: "07",
      title: "ROC Scrutiny + CoI Issuance",
      description: "Registrar of Companies reviews URC-1 + SPICe+ Part B. Any queries / objections (typically: URC-2 cutting clarity, audited statement adequacy, NIC code match) addressed within 7 days. On approval: Certificate of Incorporation issued under Section 367 + PAN + TAN auto-generated + AGILE-PRO-S registrations activated. Day 33-45.",
    },
    {
      number: "08",
      title: "GST Migration + Asset Transfer + License Migration",
      description: "Enriched / Supreme / Supreme Plus: Proprietorship GST cancelled via Form REG-16; OPC's GSTIN already active via AGILE-PRO-S. ITC transferred via Form ITC-02. Corporate bank account opened. Supreme / Supreme Plus: Asset Transfer Agreement signed; FSSAI / Shop & Estd / Trade License / Udyam re-registered or amended under OPC name; proprietorship wound down. Supreme Plus: TM-P trademark assignment. Day 45-90.",
    },
  ];

  return (
    <section className="opcsteps-section" id="process">
      <div className="opcsteps-container">
        <header className="opcsteps-header">
          <h2 className="opcsteps-title">Steps for Converting Proprietorship to an OPC</h2>
          <p className="opcsteps-subtitle">
            Eight steps anchored to the URC-1 + URC-2 statutory waiting period. End-to-end timeline: 35-50 working days for clean cases (URC-2 publication + 21-day objection window + URC-1 filing + ROC scrutiny + CoI). Migration items (GST, bank, licenses) run in parallel where possible.
          </p>
        </header>

        <div className="opcsteps-timeline">
          {steps.map((step, index) => (
            <div key={index} className="opcsteps-item">
              <div className="opcsteps-marker">
                <div className="opcsteps-number">{step.number}</div>
              </div>
              <div className="opcsteps-content">
                <h3 className="opcsteps-title-text">{step.title}</h3>
                <p className="opcsteps-description">{step.description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default PtoopcSteps;
