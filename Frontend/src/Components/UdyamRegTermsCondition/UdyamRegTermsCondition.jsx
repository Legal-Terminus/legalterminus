import React from "react";
import "./UdyamRegTermsCondition.css";

const terms = [
  {
    label: "Government Fee",
    text: "As per the Ministry of MSME notification dated 26 June 2020, the government does not charge any fee for Udyam Registration. GST registration government fee is also NIL. Trademark government fee is payable separately at Rs.4,500 per class (MSME / individual rate, with valid Udyam) or Rs.9,000 per class (standard rate).",
  },
  {
    label: "GST on Our Fee",
    text: "All quoted prices are exclusive of GST @ 18%, charged at checkout.",
  },
  {
    label: "Scope per Udyam",
    text: "Each plan covers ONE Udyam Registration per applicant (per PAN). As per Section 8(8) of the MSMED Act read with the 26 June 2020 notification, only ONE Udyam can be filed per enterprise. Multiple Udyam filings under the same PAN are not permitted.",
  },
  {
    label: "Self-Declaration",
    text: "Udyam is a SELF-DECLARATION-based registration. Investment in plant & machinery / equipment and turnover figures provided by you are auto-verified against ITR + GSTR data from FY 2020-21 onwards. Misdeclaration triggers automatic re-classification and (in serious cases) penalties under Section 27 of the MSMED Act.",
  },
  {
    label: "MSME Classification (FY 2025-26)",
    text: "Per the Budget 2025 amendment effective 1 April 2025: Micro — Investment ≤ Rs.2.5 cr AND Turnover ≤ Rs.10 cr. Small — Investment ≤ Rs.25 cr AND Turnover ≤ Rs.100 cr. Medium — Investment ≤ Rs.125 cr AND Turnover ≤ Rs.500 cr. Both conditions must be met; crossing either pushes the enterprise into the next category.",
  },
  {
    label: "Aadhaar Requirement",
    text: "Mandatory under Rule 4(1) of the MSMED notifications. For proprietorships — proprietor's Aadhaar. For partnerships / HUF — managing partner's / karta's Aadhaar. For Pvt Ltd / LLP / Co-op / Trust / Society — authorised signatory's Aadhaar with authorisation document. Mobile must be linked to Aadhaar for OTP authentication.",
  },
  {
    label: "Refund Policy",
    text: "Full refund (less Rs.299 documentation handling) is available if the Udyam application is not filed within 3 working days from receipt of complete documents. Once Udyam Number is generated, no refund is payable as the work is substantively complete. For Enriched / Supreme: pro-rata refund on the GST / Trademark component if not filed within 7 working days.",
  },
  {
    label: "Trademark Scope (Supreme Tier)",
    text: "Includes 1 trademark application in 1 class. Examination response support, hearing representation, opposition handling, oppositions filed by third parties, and renewal of registration (every 10 years) are out of scope and quoted separately if required.",
  },
];

const UdyamRegTermsCondition = () => {
  return (
    <section className="udyam-tc-section">
      <div className="udyam-tc-container">
        <div className="udyam-tc-card">
          <h2 className="udyam-tc-title">TERMS &amp; CONDITIONS</h2>
          <p className="udyam-tc-subtitle">
            By subscribing to the above plans, you agree to abide by our following additional terms and conditions
          </p>
          <ol className="udyam-tc-list">
            {terms.map((item, i) => (
              <li className="udyam-tc-item" key={i}>
                <strong>{item.label}:</strong> {item.text}
              </li>
            ))}
          </ol>
        </div>
      </div>
    </section>
  );
};

export default UdyamRegTermsCondition;
