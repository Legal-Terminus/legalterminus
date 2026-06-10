import React from "react";
import "./BCprocess.css";

const steps = [
  {
    title: "Discovery &amp; Product Count",
    day: "Day 0",
    text: "30-minute call to confirm: number of unique products (SKUs) you need GTINs for, whether you need EAN-13, GS1-128, ITF-14, or DataMatrix, and the correct GS1 Company Prefix tier (number of digits). We also confirm GSTIN linkage and check if your company is already registered with GS1 India.",
  },
  {
    title: "Document Collection",
    day: "Day 1",
    text: "We share a GS1-specific checklist. You submit: business owner KYC (PAN + Aadhaar), business registration (COI / GST Certificate / UDYAM), office address proof, cancelled cheque, and product list with brief descriptions. This is your only task — we handle the rest.",
  },
  {
    title: "GS1 India Application Preparation",
    day: "Day 1–2",
    text: "We prepare your GS1 India membership application with the correct Company Prefix tier based on your product count. Documents are verified against GS1 India's requirements. We also draft the request letter on company letterhead and compile the complete application package.",
  },
  {
    title: "GS1 Portal Filing &amp; Subscription Payment",
    day: "Day 2–3",
    text: "Application filed on the GS1 India portal. Annual GS1 subscription fee paid on your behalf (billed at actuals, per GS1 India's current schedule). Filing acknowledgement and payment receipt shared with you immediately after submission.",
  },
  {
    title: "GS1 India Review &amp; Company Prefix Issuance",
    day: "Day 5–10",
    text: "GS1 India reviews your application and issues your unique Company Prefix (the first 7–9 digits of all your GTINs). If GS1 raises a deficiency query, we respond within 24 hours. Most straightforward applications are processed within 7–10 working days.",
  },
  {
    title: "GTIN Generation &amp; Barcode Image Delivery",
    day: "Day 10–15",
    text: "Once the Company Prefix is issued, we generate GTINs for each of your products and create print-ready barcode image files (PNG + SVG) in EAN-13 or required format. We deliver: all barcode files, product data entry on GS1 registry, GS1 renewal calendar, and usage guide for packaging and online listing.",
  },
];

const BCProcess = () => {
  return (
    <section className="opcelg-wrapper">
      <h2 className="opcelg-heading">
        Steps for GS1 Barcode Registration in India
      </h2>
      <p className="opcelg-subheading">
        Six steps. 10–15 working days end-to-end (assuming clean documents and standard GS1 India processing).
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
                <span dangerouslySetInnerHTML={{ __html: step.title }} />
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
