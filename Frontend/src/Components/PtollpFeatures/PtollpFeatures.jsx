import React from "react";
import "./PtollpFeatures.css";

const types = [
  {
    number: "01",
    title: "Form RUN-LLP / FiLLiP Part A — Name Reservation",
    text: "Reserve up to 2 proposed names for the LLP via RUN-LLP or via FiLLiP Part A on the MCA portal. Name must end with 'LLP' or 'Limited Liability Partnership'. We run a comprehensive search across MCA + TM database to avoid identical / similar / prohibited names + ensure trademark clean-up. Typically approved in 1–2 days.",
  },
  {
    number: "02",
    title: "Form 17 — Conversion Application + Statement",
    text: "Application for conversion of the Partnership Firm into an LLP under Section 55 of the LLP Act, 2008. Filed on MCA portal alongside Form FiLLiP. Attachments: list of ALL partners with consents, Statement of Accounts of the firm (CA-certified, not older than 30 days), list of creditors with consents / NOCs, latest income-tax acknowledgement, Partnership Deed (original + supplementary), Firm Registration Certificate (if registered), affidavits, declaration of solvency. We curate the entire pack.",
  },
  {
    number: "03",
    title: "Form FiLLiP — LLP Incorporation Form",
    text: "Form for Incorporation of LLP. Filed IN PARALLEL with Form 17 on the MCA portal. Covers: LLP name (from RUN-LLP), registered office address, designated partner details (PAN, Aadhaar, DPIN, DSC), partner details (all firm partners as LLP partners), capital contribution amount + structure, business activity. PAN + TAN auto-generated on approval. Certificate of Incorporation as LLP issued.",
  },
  {
    number: "04",
    title: "Capital Contribution + LLP Agreement Mapping",
    text: "Each partner's CAPITAL ACCOUNT balance in the firm (as on the Statement of Accounts date) is mapped to the partner's CONTRIBUTION to the LLP. Profit-sharing ratio per Partnership Deed + capital contribution drive the LLP Agreement structure. We prepare the contribution schedule with cross-CA validation.",
  },
  {
    number: "05",
    title: "Form 14 — Notice to Registrar of Firms",
    text: "Mandatory post-CoI filing per Clause 8 of the Second Schedule. WITHIN 15 DAYS of LLP registration, Form 14 is filed with the concerned REGISTRAR OF FIRMS (under the Indian Partnership Act 1932) to formally intimate the conversion + dissolution of the firm. Without Form 14, the firm continues on the Registrar of Firms' records. Included in all plans.",
  },
  {
    number: "06",
    title: "Form 3 — LLP Agreement Filing",
    text: "Per Section 23 of LLP Act + Rule 21 of LLP Rules, the LLP Agreement must be filed in Form 3 within 30 DAYS of CoI. Drafted to reflect Partnership Deed terms + carry forward internal arrangements (capital, profit-share, decision rights, exit, dispute resolution, indemnification). Custom LLP Agreement in Enriched + Supreme; Elemental clients use our template + file Form 3 themselves.",
  },
];

const PtollpFeatures = () => {
  return (
    <section className="opc-features-section">
      <div className="opc-features-container">

        <h2 className="opc-features-title">Types of Converting Partnership Firm into an LLP</h2>

        <div className="opc-features-cards">
          {types.map((type) => (
            <div className="opc-features-card" key={type.number}>
              <div className="opc-features-number">{type.number}</div>
              <h3 className="opc-features-card-title">{type.title}</h3>
              <p className="opc-features-card-text">{type.text}</p>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
};

export default PtollpFeatures;
