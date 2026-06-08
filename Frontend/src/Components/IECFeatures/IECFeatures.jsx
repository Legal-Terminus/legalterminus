import React from "react";
import "../CopyPvtTypes/CopyPvtTypes.css";

const types = [
  {
    number: "01",
    title: "Proprietorship IEC",
    text: "Most common variant. PAN + Aadhaar of proprietor, address proof, bank account, photograph. Can be filed via Aadhaar OTP without DSC. Fastest path - typically 1 working day. Suitable for freelancers exporting services, solo traders, online sellers shipping to foreign customers.",
  },
  {
    number: "02",
    title: "Partnership / LLP IEC",
    text: "Requires partnership deed / LLP Agreement + authorised signatory's DSC. Authorised signatory's PAN + Aadhaar. Bank account in firm's name. Slightly more documentation, same timeline. Standard for two-or-more partner trading firms and professional service exporters.",
  },
  {
    number: "03",
    title: "Pvt Ltd / Public Ltd IEC",
    text: "Requires Certificate of Incorporation + Board Resolution authorising the signatory + signatory's DSC. Bank account in company's name. Most common for established exporters / importers - the DGFT verification is tighter, expect 1-2 days. Standard for IT services, manufacturers, e-commerce.",
  },
  {
    number: "04",
    title: "HUF (Hindu Undivided Family) IEC",
    text: "Requires HUF PAN + karta's Aadhaar + karta's PAN + bank account in HUF name + HUF declaration. Less common; typically used by family-owned trading businesses. Karta acts as the authorised signatory.",
  },
  {
    number: "05",
    title: "Trust / Society IEC",
    text: "For registered trusts and societies engaged in import / export (typically NGOs importing relief material, educational trusts importing equipment, religious bodies importing artefacts). Requires trust deed / society registration + signatory authorisation + tightly-scoped object clause.",
  },
  {
    number: "06",
    title: "Government Entity IEC",
    text: "For government departments, PSUs, government-owned undertakings importing / exporting on government account. Requires GoI / state government notification + authorising letter. Filed by the designated department officer, not commercial.",
  },
];

const IECFeatures = () => {
  return (
    <section className="cpvt-section">
      <div className="cpvt-container">
        <h2 className="cpvt-title">Types of IEC Registration in India</h2>
        <div className="cpvt-cards">
          {types.map((type) => (
            <div className="cpvt-card" key={type.number}>
              <div className="cpvt-number">{type.number}</div>
              <h3 className="cpvt-card-title">{type.title}</h3>
              <p className="cpvt-card-text">{type.text}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default IECFeatures;
