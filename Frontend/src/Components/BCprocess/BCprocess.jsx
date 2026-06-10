import React from "react";
import "./BCprocess.css";

const steps = [
  {
    title: "Discovery & Pack-Size Sizing",
    day: "Day 0",
    text: "30-min call with our GS1 specialist to confirm: current SKU count + 3-year SKU expansion plan, business turnover (for slab), Udyam status (for MSME 80% claim), channel mix (e-commerce / modern trade / export / institutional), tenure preference (1–10 years). Output: right pack size (100/1000/10000/100000) + tenure + total cost estimate.",
  },
  {
    title: "Document Collection",
    day: "Day 1–2",
    text: "Personalised checklist: business PAN, GSTIN, address proof, Certificate of Incorporation / Partnership Deed / Trust Deed, authorised signatory KYC, turnover proof (audited financials / GST returns / CA certificate), Udyam Certificate (for MSME claim), product list / SKU sheet, brand logo.",
  },
  {
    title: "GS1 India Application Drafting",
    day: "Day 2–3",
    text: "Online membership application drafted on the GS1 India portal with KOB / industry classification, selected pack size, selected tenure, turnover slab, and applicant entity details. Cross-verified before submission.",
  },
  {
    title: "Fee Computation + Payment Coordination",
    day: "Day 3",
    text: "Total fee computed per the GS1 India GCP Fee Structure: Registration Fee + Annual Subscription + 18% GST + Rs.3,000 Security Deposit (Nil for 10-yr). You make the payment via GS1 India portal payment gateway.",
  },
  {
    title: "Application Submission on GS1 India Portal",
    day: "Day 3–4",
    text: "Application + supporting documents uploaded on www.gs1india.org. Payment receipt attached. Acknowledgement + reference number captured.",
  },
  {
    title: "GS1 India Processing + Query Reply",
    day: "Day 4–7",
    text: "GS1 India verifies documents, validates turnover slab, and processes the membership. Any queries (often turnover proof or KOB mismatch) responded to within 24–48 hours.",
  },
  {
    title: "GCP + GTIN Range Issuance",
    day: "Day 7–10",
    text: "GS1 India issues the GS1 Company Prefix (GCP) — your unique 6–10 digit prefix — along with the GTIN range allocated under it (100 / 1,000 / 10,000 / 1,00,000 numbers). Membership certificate + GCP allocation letter delivered digitally.",
  },
];

const BCProcess = () => {
  return (
    <section className="opcelg-wrapper">
      <h2 className="opcelg-heading">
        Steps for GS1 Barcode Registration in India
      </h2>
      <p className="opcelg-subheading">
        Seven steps. 7–10 working days end-to-end from kick-off to GCP + GTIN delivery (subject to GS1 India processing). DataKart onboarding adds 5–7 days for product upload + verification.
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

export default BCProcess;
