import React from "react";
import "./TmhearDocuments.css";
import { FaFileAlt, FaUser, FaIdCard, FaFileSignature, FaReceipt, FaGavel, FaBullhorn } from "react-icons/fa";

const caseDocs = [
  {
    icon: <FaGavel />,
    title: "Hearing Notice + Original Application",
    text: "Hearing notice / scheduling order from the Registry (download from IP India portal). Show Cause notice (Rule 33) / Opposition hearing notice (Rule 50) / Rectification hearing scheduling. Original trademark application (Form TM-A) + acknowledgement + class(es) + mark image. Used as foundation for hearing prep.",
  },
  {
    icon: <FaFileAlt />,
    title: "Prior Pleadings + Evidence on Record",
    text: "All pleadings + responses filed in the matter to date: Examination Report + Reply (for Show Cause hearings); Notice of Opposition + Counter Statement + Evidence affidavits (for Opposition hearings); Rectification petition + responses (for Rectification hearings); Renewal / Restoration application (for Renewal hearings). The complete case file as it stands at hearing-day.",
  },
  {
    icon: <FaIdCard />,
    title: "Client Identity + Authority",
    text: "For INDIVIDUAL clients: PAN + Aadhaar + photograph + DSC (Class 3). For COMPANIES / LLPs / PARTNERSHIPS: entity PAN + Certificate of Incorporation / Partnership Deed + authorised signatory PAN + DSC + Board resolution authorising hearing representation.",
  },
];

const evidenceDocs = [
  {
    icon: <FaFileSignature />,
    title: "Power of Attorney (Form TM-48) + Authorisation Letter (if LT's associate is new attorney)",
    text: "Where LT was not the prior attorney on record: Form TM-48 POA drafted in LT's associated Attorney's name + Authorisation Letter (for entities) confirming signatory authority. We DRAFT both documents; you sign on ₹100 stamp paper. Additional ₹999 + GST charge for POA drafting + filing. Required for our online attendance to be recorded as authorised representative.",
  },
  {
    icon: <FaReceipt />,
    title: "Supporting Evidence + Documentary Material",
    text: "Additional documentary support that strengthens hearing arguments: market evidence + use evidence (for distinctiveness arguments) / comparative trademark analyses (for distinguishing arguments) / co-existence agreements / prior settled disputes / case-law that the Hearing Officer typically follows / brand recognition material. Client provides; LT compiles into paper-book.",
  },
  {
    icon: <FaBullhorn />,
    title: "Pre-Hearing Briefing Notes",
    text: "Notes on factual context / commercial background / brand history / use timeline — inputs from client used to ground LT's arguments in real business facts. Helps the Hearing Officer understand the practical impact of any adverse order. Provided in the discovery call + strategy call.",
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
    <p className="tmhear-doc-text">{doc.text}</p>
  </div>
);

const TmhearDocuments = () => {
  return (
    <section className="opcd-section" id="documents">
      <div className="opcd-container">

        <div className="opcd-header">
          <h2 className="opcd-main-title">Documents Required for Trademark Hearing in India</h2>
          <p className="opcd-main-subtitle">Six categories. Hearing documentation depends on hearing type + plan tier. Personalised checklist sent after the discovery call once we've reviewed your hearing notice + prior case file.</p>
        </div>

        <div className="opcd-columns">

          <div className="opcd-column">
            <div className="opcd-col-header">
              <div className="opcd-col-header-icon"><FaGavel /></div>
              <div>
                <h3 className="opcd-col-title">Notice, Pleadings &amp; Identity</h3>
                <p className="opcd-col-subtitle">The notice, the record &amp; the party</p>
              </div>
            </div>
            <div className="opcd-col-body">
              {caseDocs.map((doc, i) => (
                <DocItem key={i} doc={doc} />
              ))}
            </div>
          </div>

          <div className="opcd-column">
            <div className="opcd-col-header opcd-col-header--office">
              <div className="opcd-col-header-icon"><FaUser /></div>
              <div>
                <h3 className="opcd-col-title">POA, Evidence &amp; Briefing</h3>
                <p className="opcd-col-subtitle">Authority, proof &amp; hearing inputs</p>
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

export default TmhearDocuments;
