import React from "react";
import "./Section8TermsCondition.css";

const terms = [
  {
    label: "Professional Fee Only",
    text: "All quoted prices are exclusive of government fees, statutory levies, and out-of-pocket costs. Our fee covers professional services — advisory, MOA/AOA + INC-13/14/15 drafting, SPICe+ filing, Section 8 licence coordination, and post-incorporation handover.",
  },
  {
    label: "Government Fees Payable Separately",
    text: "RUN name reservation fee (Rs.1,000 per attempt), and state stamp duty on MOA / AOA (typically Rs.500 – Rs.2,000) are payable to MCA / state government and reimbursed at actuals.",
  },
  {
    label: "DSC & DIN Charges",
    text: "Class 3 DSC at Rs.1,999 + GST per person — required for both directors and any non-director subscribers. DIN auto-applied via SPICe+ for the first 3 directors.",
  },
  {
    label: "GST on Our Fee",
    text: "All quoted prices are exclusive of GST @ 18%, charged at checkout.",
  },
  {
    label: "Charitable Object Restriction",
    text: "Section 8 of the Companies Act, 2013 requires the company's object to be promotion of commerce, art, science, sports, education, research, social welfare, religion, charity, protection of environment, or any other useful object. Profits and income are to be applied for promoting the object; no dividend can be paid to members. The object cannot be amended without Central Government approval.",
  },
  {
    label: "Directors & Shareholders",
    text: "A Section 8 (Pvt Ltd) Company requires a minimum of 2 directors and 2 shareholders under the Companies Act, 2013. Section 8 (Public Ltd) variant requires 3 directors and 7 shareholders. Maximum directors: 15 (Pvt Ltd). At least one director must be resident in India (120-day stay test).",
  },
  {
    label: "12A / 80G",
    text: "These are SEPARATE registrations under the Income Tax Act, MCA CSR rules, and FCRA respectively — NOT automatic with Section 8 incorporation. The Supreme Plus tier includes 12A + 80G applications.",
  },
  {
    label: "Refund Policy",
    text: "Full refund of professional fee (less Rs.2,499 documentation handling) is available if SPICe+ Part B is not filed within 10 working days from receipt of complete documents. Government fees and DSC charges already paid are non-refundable.",
  },
  {
    label: "Out-of-Scope Items",
    text: "Trust Deed / Society Bye-laws conversion, foreign-donor compliance under FEMA, registered office shifting, alteration of MOA / AOA after incorporation (requires Central Government approval), conversion to other types of companies, and ongoing fund-raising compliance are not included and quoted separately.",
  },
  {
    label: "Post-Incorporation Compliance",
    text: "Plans do not include statutory audits, DIR-3 KYC, GSTR returns (if registered), Form 10B audit report (for 12A entities), or Form CSR-1, CSR-2 filings. These are billed separately.",
  },
];

const Section8TermsCondition = () => {
  return (
    <section className="s8-tc-section">
      <div className="s8-tc-container">

        <h2 className="s8-tc-title">TERMS &amp; CONDITIONS</h2>

        <p className="s8-tc-subtitle">
          By subscribing to the above plans, you agree to abide by our following additional terms and conditions
        </p>

        <ol className="s8-tc-list">
          {terms.map((item, i) => (
            <li key={i} className="s8-tc-item">
              {item.label}: {item.text}
            </li>
          ))}
        </ol>

      </div>
    </section>
  );
};

export default Section8TermsCondition;
