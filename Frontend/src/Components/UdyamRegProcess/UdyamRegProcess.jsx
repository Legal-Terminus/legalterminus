import React from "react";
import "./UdyamRegProcess.css";

const steps = [
  {
    day: "Day 0–1",
    title: "Document & Information Collection",
    desc: "Share your Aadhaar number, PAN, business address, NIC code, and investment/turnover figures. Our expert reviews your details for accuracy before filing.",
  },
  {
    day: "Day 1",
    title: "Aadhaar OTP Verification",
    desc: "Login to the Udyam portal using your Aadhaar-linked mobile number. A one-time OTP is sent to authenticate your identity — no physical visit required.",
  },
  {
    day: "Day 1–2",
    title: "PAN & GST Validation",
    desc: "The portal auto-fetches your business details from the Income Tax (PAN) and GSTIN databases. We verify these are correctly mapped to your activity.",
  },
  {
    day: "Day 2",
    title: "NIC Code Mapping & Form Filing",
    desc: "We select the correct NIC code for your primary business activity and complete the Udyam registration form with all required self-declarations.",
  },
  {
    day: "Day 2–3",
    title: "Udyam Certificate Issuance",
    desc: "Upon successful submission, the Udyam Registration Number and digital certificate are issued instantly by the Ministry of MSME. No fee is charged by the government.",
  },
];

const UdyamRegProcess = () => {
  return (
    <div className="pvtltd-udyam-wrapper">
      <h2 className="udyam-process-heading">How to Get Udyam Registration</h2>
      <p className="udyam-process-subheading">
        Five steps. Typically done within 24–48 hours — end-to-end online with zero government fee.
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
