import React from "react";
import "./TrustProcess.css";

const steps = [
  {
    title: "Discovery & Object Lock",
    day: "Day 0",
    text: "30-min call with our expert to confirm: trust purpose (charitable / private / religious / educational / medical / mixed), settlor identification, trustees (min 2), beneficiaries (specific vs public), registered office state (Maharashtra / Gujarat / MP route through Charity Commissioner; other states via Sub-Registrar), initial trust property (cash / movable / immovable).",
  },
  {
    title: "Trustees & Settlor KYC Collection",
    day: "Day 0–2",
    text: "Aadhaar + PAN + photo + address proof of each trustee + settlor. Authorised signatory designation. Resident-trustee confirmation (at least one Indian resident).",
  },
  {
    title: "Trust Deed Drafting",
    day: "Day 2–7",
    text: "Custom Trust Deed: name, registered office, object clause (charitable / educational / religious etc. - drafted precisely for 12A acceptance), trust property + corpus, powers of trustees, succession / replacement clauses, dissolution clauses, governance rules. Two rounds of revision included.",
  },
  {
    title: "Stamp Duty Calculation + Payment",
    day: "Day 6–8",
    text: "We calculate state-specific stamp duty based on Trust Deed value (property value) + your state's schedule. You buy stamp paper (or pay e-stamp duty online); we provide exact denomination.",
  },
  {
    title: "Notarisation",
    day: "Day 7–9",
    text: "Trust Deed signed by Settlor and all Trustees in presence of two witnesses. Notary public attests. We coordinate the visit.",
  },
  {
    title: "Sub-Registrar / Charity Commissioner Appointment",
    day: "Day 8–12",
    text: "Maharashtra / Gujarat / MP: appointment booked with the Charity Commissioner / Deputy Commissioner office. Other states: appointment booked with the local Sub-Registrar.",
  },
  {
    title: "Trust Registration Filing",
    day: "Day 10–15",
    text: "Settlor + Trustees appear (where required) and execute the Deed before the Sub-Registrar / Charity Commissioner. Original stamped Deed submitted for registration. Receipt issued.",
  },
  {
    title: "Registration Certificate Issuance",
    day: "Day 12–18",
    text: "Registration Certificate (Trust Registration Number) issued. PDF + physical copy delivered. Trust now has legal existence.",
  },
  {
    title: "Trust PAN + Bank Account",
    day: "Day 15–22",
    text: "Trust PAN applied via NSDL using the Registration Certificate. PAN issued in 7-10 days. Bank account opened in Trust name (we only coordinate for preparation of required Documents for opening bank account).",
  },
  {
    title: "12A + 80G Filing (Enriched / Supreme)",
    day: "Day 18–22",
    text: "Form 10A (12A registration) + Form 10AB (80G registration) filed with the Income Tax Department. Approval takes 1-3 months. Onboarding kit handed over: Trust Deed (stamped), Registration Certificate, PAN, 90-day compliance calendar, audit-readiness checklist.",
  },
];

const TrustProcess = () => {
  return (
    <section className="trust-process-section">
      <div className="trust-process-wrapper">
        <h2 className="trust-process-title">
          Steps for Trust Registration in India
        </h2>

        <p className="trust-process-subtitle">
          Ten steps. 15-20 working days for Trust registration. Add 1-3 months for 12A / 80G approval if pursued (Enriched / Supreme).
        </p>

        <div className="trust-timeline">
          <div className="trust-timeline-line" />

          {steps.map((step, index) => (
            <div
              key={index}
              className={`trust-timeline-item ${index % 2 === 0 ? "left" : "right"}`}
            >
              <div className="trust-timeline-dot">{index + 1}</div>

              <div className="trust-timeline-card">
                <h4>
                  {step.title}
                  {step.day && <span className="trust-day-tag">{step.day}</span>}
                </h4>
                <p>{step.text}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default TrustProcess;
