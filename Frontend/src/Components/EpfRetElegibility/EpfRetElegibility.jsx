import React from "react";
import "./EpfRetElegibility.css";

const steps = [
  {
    title: "Wage + Joinee + KYC Data Hand-Off (You → Us)",
    day: "By Day 1–3",
    text: "First 3 days of next month: share previous month's WAGE REGISTER (member name + UAN + Basic + DA + LOP days + actual wage paid). For NEW JOINEES during the month: name + DOB + Aadhaar + PAN + Bank passbook + previous UAN (if any) + Form 11 inputs. Standard formats: Excel / payroll software export (Zoho / Keka / GreytHR / Tally).",
  },
  {
    title: "Employee Addition (Form 11) + KYC Seeding",
    day: "Day 3–5",
    text: "New joinee Form 11 processed on EPF portal. New UANs allotted where needed. KYC seeding for new joinees + existing members with pending KYC: Aadhaar linkage, PAN linkage, Bank account linkage. Seeding errors / mismatches actively cleared.",
  },
  {
    title: "ECR Statement Preparation",
    day: "Day 5–7",
    text: "Member-wise wage data validated. Contribution computation: Employee 12% + Employer 12% (split EPS 8.33% capped + EPF 3.67%) + EDLI 0.5% capped + Admin charges 0.5%. ECR file generated in EPFO portal format (TXT / Excel). Internal QC + reconciliation against payroll output.",
  },
  {
    title: "eSign Approval Workflow Coordination",
    day: "Day 7–9",
    text: "ECR file routed to your authorised signatory for eSign approval (DSC or Aadhaar-based e-Sign). We coordinate signatory availability + verify DSC validity + walk through the approval if needed. eSign captured + ready for portal upload.",
  },
  {
    title: "ECR Upload on EPF Portal",
    day: "Day 9–12",
    text: "ECR file uploaded on the EPFO Unified Portal (unifiedportal-emp.epfindia.gov.in). Portal validates the file. Challan amount confirmed. TRRN (Temporary Return Reference Number) generated.",
  },
  {
    title: "TRRN Acknowledgement Delivery to Client",
    day: "Day 12",
    text: "Same day as upload: we deliver the TRRN + ECR PDF to you, along with payment instructions (bank name, beneficiary, amount, due date). Your records are updated.",
  },
  {
    title: "EPF Contribution Payment Coordination",
    day: "Day 12–14",
    text: "You make the payment via Internet Banking (SBI / HDFC / ICICI / Axis / Kotak / other empanelled banks) OR NEFT / RTGS using the TRRN. We track payment confirmation + send reminders if not paid by Day 14. Once EPFO reconciles payment, FINAL PF CHALLAN is generated + archived.",
  },
  {
    title: "Filing Closed + Annual (Form 5A) on Schedule",
    day: "By Day 15",
    text: "ECR filing + payment closed by the 15TH OF NEXT MONTH deadline. Members' EPF passbooks updated by EPFO within 7–10 days. ANNUALLY (typically April / May): Form 5A filed / amended on EPF portal confirming ownership + management structure — we file this once per FY + on any change of partner / director / signatory.",
  },
];

const EpfRetElegibility = () => {
  return (
    <section className="opcelg-wrapper">
      <h2 className="opcelg-heading">
        Steps for EPF Return Filing in India
      </h2>
      <p className="opcelg-subheading">
        This Section Is Reframed From The Standard "Step-By-Step Process" Because Epf Return Filing Is A Recurring Monthly Cycle Anchored To The 15th-Of-Next-Month Deadline. Below Is Your Monthly Epf Compliance Cycle - Calendar-Anchored To The 8 Deliverables.
      </p>

      <div className="opcelg-timeline">
        <div className="opcelg-timeline-line" />

        {steps.map((step, index) => (
          <div
            key={index}
            className={`opcelg-timeline-item ${index % 2 === 0 ? "left" : "right"} ${index === 0 ? "first" : ""} ${index === steps.length - 1 ? "last" : ""}`}
          >
            <div className="opcelg-timeline-dot">{index + 1}</div>

            <div className="opcelg-timeline-card">
              <h4>
                {step.title}
                {step.day && <span className="opcelg-day-tag">{step.day}</span>}
              </h4>
              <p>{step.text}</p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};

export default EpfRetElegibility;
