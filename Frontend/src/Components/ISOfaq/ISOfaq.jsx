import React, { useState } from "react";
import "./ISOfaq.css";

const faqs = [
  {
    question: "What is ISO Certification and who issues it?",
    answer:
      "ISO Certification is a third-party certification confirming your management system conforms to a specific ISO standard (e.g., ISO 9001 for Quality, ISO 27001 for Information Security). ISO itself (International Organization for Standardization, based in Geneva) writes the standards but does NOT issue certificates — certification is done by independent Certification Bodies (CBs) accredited by national accreditation bodies (NABCB in India, UKAS in UK, ANAB in US). NABCB-accredited certificates are globally recognised under the IAF MLA framework.",
  },
  {
    question: "How is your pricing model exclusive of CB fees? What's the total cost?",
    answer:
      "Our professional fee covers consulting — gap analysis, documentation development, implementation training, internal audit, management review facilitation, and CB liaison. Certification Body (CB) fees, surveillance fees, auditor travel, and MSME subsidy reimbursement timing are billed separately at actuals. CB fees typically Rs.15K–Rs.90K depending on standard, scope, employee count, and CB accreditation. For an MSME doing ISO 9001 Elemental, gross total: Rs.13K (LT) + Rs.20K (CB) = Rs.33K. Net of MSME subsidy reimbursement: roughly Rs.8K–Rs.10K.",
  },
  {
    question: "How long does ISO Certification take?",
    answer:
      "45–60 working days end-to-end. Gap analysis: 5–7 days. Documentation: 10–15 days. Implementation + training: 12–15 days. Internal audit + management review: 5–7 days. CB Stage 1 + Stage 2 audits: 5–10 days. NC closure + certificate issuance: 5–10 days. Faster for simple single-site / single-standard / small-headcount; slower for multi-standard IMS / multi-site / large headcount.",
  },
  {
    question: "Which ISO standard should I get?",
    answer:
      "Depends on your customer and your sector. (1) Selling to government / PSU / enterprise? ISO 9001 mandatory. (2) Manufacturing / chemicals / energy? Add ISO 14001. (3) Construction / factory / mining? Add ISO 45001. (4) Food business? ISO 22000. (5) IT / SaaS / BPO? ISO 27001. (6) Medical devices? ISO 13485. (7) Most growing businesses end up with the QHSE combo (9001 + 14001 + 45001) within 2–3 years. Start with 9001 if unsure.",
  },
  {
    question: "What's the MSME subsidy and how do I claim it?",
    answer:
      "MSME-registered businesses can claim up to 75% reimbursement of ISO certification costs (capped at Rs.75,000 per certification) via the MSME Office's Quality Upgradation / ZED scheme. To qualify: valid Udyam Registration + certification by an MSME-Office-approved Certification Body + structured invoices + completion of audit cycle. We assist with the subsidy application. Reimbursement timing: typically 60–180 days post-certification, paid directly to your bank account.",
  },
  {
    question: "How long is an ISO certificate valid?",
    answer:
      "3 years. Mandatory annual Surveillance Audits by the CB in Year 1 and Year 2 (lighter than the initial audit, but still audits). Full Re-Certification Audit at the end of Year 3 to renew for another 3 years. Skipping a surveillance audit = certificate suspended / withdrawn by the CB. The 3-year cycle continues indefinitely as long as you keep up with audits.",
  },
  {
    question: "Are all CBs equal? How do I pick the right one?",
    answer:
      "No — the differences are huge. NABCB-accredited CBs (recognised under IAF MLA) issue certificates that are globally recognised, pass enterprise / export / GeM scrutiny, and qualify for MSME subsidy. Unaccredited 'paper mill' CBs (often Rs.3,000–5,000 'cheap ISO certificate' offers) issue certificates that get rejected when checked on the IAF database — and don't qualify for subsidy. We only recommend NABCB-accredited CBs — usually 2–3 options matching your budget and sector.",
  },
  {
    question: "Can I implement ISO myself without a consultant?",
    answer:
      "Yes — if you have an in-house ISO Lead Auditor and the time bandwidth. In practice, most SMEs underestimate the documentation workload (Quality Manual + 15–25 SOPs + records) and the rigour the Stage 2 auditor expects. Self-implementation typically takes 6–9 months vs 2 months with us, and has a much higher Stage 2 NC rate. The cost saving rarely compensates for the time and risk.",
  },
  {
    question: "Can I get multiple standards in a single audit?",
    answer:
      "Yes — this is called an Integrated Management System (IMS) audit. Common combinations: ISO 9001 + 14001 (Quality + Environment), 9001 + 14001 + 45001 (full QHSE), or sector-specific (9001 + 22000 for food). Single audit covers all standards simultaneously, integrated documentation, lower combined CB fee, less audit fatigue. Our Enriched (2 standards) and Supreme (3 standards) tiers are structured as IMS by default.",
  },
  {
    question: "How can Legal Terminus help me get ISO certified?",
    answer:
      "We've delivered 1,650+ ISO certifications across ISO 9001 / 14001 / 45001 / 22000 / 27001 / 13485 — for businesses ranging from 5-person consultancies to 200-employee manufacturing units. Every file is owned by a senior Lead Auditor — because the difference between a 'paper certificate' and a 'system that actually works' is in the customisation of SOPs to your processes, the NABCB-accredited CB choice, and the audit prep that makes Stage 2 a non-event. We file the MSME subsidy claim for you after certification, structure invoices for clean reimbursement, and (if you opt for Supreme) prep your Year-1 and Year-2 surveillance audits. Pricing is honest — our professional fee is upfront, CB fees are billed at actuals with no markup.",
  },
];

const FaqISO = () => {
  const [activeIndex, setActiveIndex] = useState(0);

  const toggleFaq = (index) => {
    setActiveIndex((prev) => (prev === index ? -1 : index));
  };

  return (
    <section className="isofaq-section">
      <div className="isofaq-container">

        <div className="isofaq-header">
          <h2 className="isofaq-title">ISO Certification — FAQs</h2>
          <p className="isofaq-intro">
            Got questions? We've got answers — straight, no-BS, legally accurate.
          </p>
        </div>

        <div className="isofaq-list">
          {faqs.map((item, index) => {
            const isActive = index === activeIndex;
            return (
              <div
                key={index}
                className={`isofaq-item ${isActive ? "active" : ""}`}
              >
                <button
                  type="button"
                  className="isofaq-question"
                  onClick={() => toggleFaq(index)}
                >
                  <span>{item.question}</span>
                  <span className={`isofaq-icon ${isActive ? "open" : ""}`}>▾</span>
                </button>
                <div className={`isofaq-answer ${isActive ? "open" : ""}`}>
                  <div className="isofaq-answer-content">{item.answer}</div>
                </div>
              </div>
            );
          })}
        </div>

      </div>
    </section>
  );
};

export default FaqISO;
