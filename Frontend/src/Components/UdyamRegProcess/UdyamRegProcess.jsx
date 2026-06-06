import React from "react";
import "./UdyamRegProcess.css";

const steps = [
  {
    day: "Day 0",
    title: "Discovery & Classification Check",
    desc: "30-min call with our Expert to confirm: business activity, projected turnover + investment, sector (manufacturing / service / trading), key suppliers and buyers, scheme priorities (CGTMSE? PMEGP? GeM? Section 43B(h)?). We map the right NIC code(s).",
  },
  {
    day: "Day 0–1",
    title: "Aadhaar Mobile-Linkage Verification",
    desc: "Confirm proprietor / partner / authorised signatory's Aadhaar is linked to a working mobile number for OTP authentication. If not linked, sort that out at a UIDAI centre BEFORE we file.",
  },
  {
    day: "Day 0–1",
    title: "PAN + GSTIN Validation",
    desc: "Confirm PAN-Aadhaar linkage status (post-30 June 2023, unlinked PANs are inoperative). Validate GSTIN if applicable. Both auto-fetch from CBDT / GSTN during the Udyam form filing.",
  },
  {
    day: "Day 1",
    title: "NIC Code Mapping",
    desc: "Senior-CA reviewed NIC code selection — one primary, others secondary. The right NIC code unlocks the right schemes (PMEGP only for manufacturing; ZED Bronze/Silver/Gold based on activity).",
  },
  {
    day: "Day 1",
    title: "Investment + Turnover Declaration",
    desc: "We help you declare investment in plant & machinery / equipment (net of GST) and turnover (excluding exports per amendment notification). Based on previous year's ITR and GSTR data; current-year self-declaration if newly started.",
  },
  {
    day: "Day 1",
    title: "Form Submission + Aadhaar OTP",
    desc: "Application filed on udyamregistration.gov.in. Aadhaar OTP sent to your registered mobile — you enter it within 10 minutes.",
  },
  {
    day: "Day 1",
    title: "Udyam Number Issued & Certificate Delivered",
    desc: "Udyam Registration Number (URN) and Certificate generated INSTANTLY on submission. PDF download available immediately. Format: UDYAM-XX-NN-NNNNNNN. We download it, share it via email + WhatsApp, and send your post-registration onboarding kit.",
  },
];

const UdyamRegProcess = () => {
  return (
    <div className="pvtltd-udyam-wrapper">
      <h2 className="udyam-process-heading">Steps For Udyam / MSME Registration in India</h2>
      <p className="udyam-process-subheading">
        Eight steps. Same-day filing in most cases. Udyam Number is generated INSTANTLY on submission — the rest is post-registration onboarding and scheme matching.
      </p>
      <div className="pvtltd-timeline">
        <div className="pvtltd-timeline-line" />
        {steps.map((step, i) => {
          const isLeft = i % 2 === 0;
          const isFirst = i === 0;
          const isLast = i === steps.length - 1;
          const cls = [
            "pvtltd-timeline-item",
            isLeft ? "left" : "right",
            isFirst ? "first" : "",
            isLast ? "last" : "",
          ]
            .filter(Boolean)
            .join(" ");
          return (
            <div className={cls} key={i}>
              <div className="pvtltd-timeline-dot">{i + 1}</div>
              <div className="pvtltd-timeline-card">
                <h4>
                  {step.title}
                  <span className="pvtltd-day-tag">{step.day}</span>
                </h4>
                <p>{step.desc}</p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default UdyamRegProcess;
