import React from "react";
import "./TmoppDocuments.css";
import { FaFileAlt, FaUser, FaIdCard, FaFileSignature, FaReceipt, FaBalanceScale, FaBullhorn } from "react-icons/fa";

const pleadingDocs = [
  {
    icon: <FaFileAlt />,
    title: "Subject Matter Documents (Scenario-Specific)",
    text: "SCENARIO A (Opposing other's TM): copy of the published Journal entry for the impugned application + screenshot of the IP India portal record + your own earlier trademark registration / pending application / well-known mark evidence as basis for opposition. SCENARIO B (Counter Statement): the OPPOSITION NOTICE received from the Registrar (download from portal) + your pending TM application + acknowledgement.",
  },
  {
    icon: <FaIdCard />,
    title: "Client Identity + Authority",
    text: "For INDIVIDUAL opposers / applicants: PAN + Aadhaar + photograph. For COMPANIES / LLPs / PARTNERSHIPS: entity PAN + Certificate of Incorporation / Partnership Deed + authorised signatory PAN + DSC (Class 3). Board resolution authorising the opposition / counter statement (for entities). Used for verification of pleadings + affidavit signing.",
  },
  {
    icon: <FaFileSignature />,
    title: "Power of Attorney (Form TM-48) + Authorisation Letter",
    text: "Power of Attorney (FORM TM-48) executed by the client in favour of LT's associated Attorney + Authorisation Letter (for entity clients) confirming signatory authority. We DRAFT both documents; you sign on ₹100 stamp paper. Required across all plan tiers + both scenarios.",
  },
];

const evidenceDocs = [
  {
    icon: <FaBalanceScale />,
    title: "Grounds + Supporting Legal Material",
    text: "Drafted notes on opposition grounds (we draft these; client provides factual inputs). Supporting case-law citations relevant to your grounds (we research + cite). Prior decisions of the Registrar / High Court on similar matters (we identify). Up to 25 grounds covered; beyond 25 mutually quoted.",
  },
  {
    icon: <FaReceipt />,
    title: "Use Evidence + Documentary Proof",
    text: "For EVIDENCE STAGE filings: invoices / advertising material / social media presence / website screenshots / sales data / GST returns / customer testimonials / market presence proof / brand recognition surveys. Strength of evidence drives the strength of the opposition / counter. Notarised affidavit drafted by LT; you provide factual inputs.",
  },
  {
    icon: <FaBullhorn />,
    title: "Hearing Preparation Documents (for Rule 50 hearing)",
    text: "Final HEARING BRIEF (drafted by LT — summary of pleadings + evidence highlights + case-law digest). Paper-book of pleadings + evidence + Registrar's interlocutory orders. Authorised representative confirmation. Pre-hearing notes from client on factual context. Hearing typically online video conference.",
  },
];

const DocItem = ({ doc }) => (
  <div className="opcd-doc-item">
    <div className="opcd-doc-item-top">
      <div className="opcd-doc-icon">{doc.icon}</div>
      <div className="opcd-doc-meta">
        <h4 className="opcd-doc-title">{doc.title}</h4>
      </div>
    </div>
    <p className="tmopp-doc-text">{doc.text}</p>
  </div>
);

const TmoppDocuments = () => {
  return (
    <section className="opcd-section" id="documents">
      <div className="opcd-container">

        <div className="opcd-header">
          <h2 className="opcd-main-title">Documents Required for Trademark Opposition in India</h2>
          <p className="opcd-main-subtitle">Six categories. Opposition documentation depends on scenario (A vs B) + plan tier (pleading only vs evidence vs hearing). Personalised checklist after discovery call.</p>
        </div>

        <div className="opcd-columns">

          <div className="opcd-column">
            <div className="opcd-col-header">
              <div className="opcd-col-header-icon"><FaFileAlt /></div>
              <div>
                <h3 className="opcd-col-title">Subject, Identity &amp; Authority</h3>
                <p className="opcd-col-subtitle">The matter, the party &amp; the POA</p>
              </div>
            </div>
            <div className="opcd-col-body">
              {pleadingDocs.map((doc, i) => (
                <DocItem key={i} doc={doc} />
              ))}
            </div>
          </div>

          <div className="opcd-column">
            <div className="opcd-col-header opcd-col-header--office">
              <div className="opcd-col-header-icon"><FaUser /></div>
              <div>
                <h3 className="opcd-col-title">Grounds, Evidence &amp; Hearing</h3>
                <p className="opcd-col-subtitle">Legal material, proof &amp; hearing docs</p>
              </div>
            </div>
            <div className="opcd-col-body">
              {evidenceDocs.map((doc, i) => (
                <DocItem key={i} doc={doc} />
              ))}
            </div>
          </div>

        </div>

      </div>
    </section>
  );
};

export default TmoppDocuments;
