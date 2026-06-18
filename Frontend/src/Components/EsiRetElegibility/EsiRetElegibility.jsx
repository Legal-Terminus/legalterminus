import React from "react";
import "./EsiRetElegibility.css";

const steps = [
  {
    title: "Wage + Joinee + Exit Data Hand-Off (You → Us)",
    day: "Day 1–3",
    text: "First 3 days of next month: share previous month's WAGE REGISTER (IP name + IP Number / UAN + Gross Wages + LOP days + actual wage paid). For NEW JOINEES during the month: name + DOB + Aadhaar + PAN + Bank + Family / Nominee details + photograph + Joining Date + Designation. For EXITS during the month: IP Number + Last Working Day + Reason for Exit. Standard formats: Excel / payroll software export.",
  },
  {
    title: "Employee Addition + Exit Marking in ESI Portal",
    day: "Day 3–5",
    text: "New joinee details uploaded to the ESI portal — IP NUMBER generated for each new covered employee (gross wages ≤ ₹21,000 ceiling). Exit details marked on the ESI portal for each member who left during the month — last working day + exit reason captured. Wage-ceiling-crossing review for any IP whose wage crossed ₹21,000 mid-period (mid-period continuation rule applies).",
  },
  {
    title: "Monthly ESI Contribution Statement Preparation",
    day: "Day 5–7",
    text: "IP-wise wage data validated. Contribution computation: Employee 0.75% + Employer 3.25% = Total 4% per IP. Monthly Contribution Statement generated in ESIC portal format. Internal QC + reconciliation against payroll output. Coverage decisions verified (covered / not covered / wage-ceiling-crossed in mid-period).",
  },
  {
    title: "Monthly ESI Return Filing (Contribution Upload)",
    day: "Day 7–10",
    text: "Monthly Contribution uploaded on the ESIC portal (https://www.esic.gov.in). Portal validates the data. CHALLAN GENERATED for the total contribution amount payable. Challan reference captured.",
  },
  {
    title: "Challan Mail to Client",
    day: "Day 10",
    text: "Same day as Contribution upload: we EMAIL THE ESI CHALLAN to you with full payment instructions — bank name, beneficiary, amount, due date, payment reference. Your records are updated.",
  },
  {
    title: "ESI Contribution Payment Coordination",
    day: "Day 10–14",
    text: "You make the payment via Internet Banking (SBI / HDFC / ICICI / Axis / Kotak / other empanelled banks — SBI is the primary ESIC collection bank) OR NEFT / RTGS using the challan reference. We track payment confirmation + send reminders if not paid by Day 14. Once ESIC reconciles payment, the FINAL PAID-CHALLAN acknowledgement is generated.",
  },
  {
    title: "Filing Closed + Contribution History Mail",
    day: "By Day 15",
    text: "ESI Contribution filing + payment closed by the 15TH OF NEXT MONTH deadline. We email you the COMPLETE CONTRIBUTION HISTORY for the month — IP-wise wages + contributions + running totals for the current contribution period (April–September OR October–March) + IP-coverage status. Clean ledger, no surprises at half-year.",
  },
];

const EsiRetElegibility = () => {
  return (
    <section className="opcelg-wrapper">
      <h2 className="opcelg-heading">
        Steps for ESI Return Filing in India
      </h2>
      <p className="opcelg-subheading">
        ESI Return Filing is a recurring monthly cycle anchored to the 15th-of-next-month deadline. Below is your monthly ESI compliance cycle — calendar-anchored to the 7 deliverables.
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

export default EsiRetElegibility;
