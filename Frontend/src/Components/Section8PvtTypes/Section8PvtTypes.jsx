import React from "react";
import "./Section8PvtTypes.css";

const types = [
  {
    num: "01",
    title: "Education-Focused Section 8",
    text: "For educational foundations, scholarship trusts, online learning non-profits, and digital literacy initiatives. Object clause focuses on advancement of education. Pairs with 12A + 80G + Section 35AC (where applicable). Often eligible for state-level education-grant schemes.",
  },
  {
    num: "02",
    title: "Healthcare / Medical Relief Section 8",
    text: "For hospitals, dispensaries, telemedicine non-profits, mental-health foundations, and disease-research orgs. Object clause focuses on medical relief / health. Eligible for CSR funding under Schedule VII(i). Pairs cleanly with FCRA for international medical donors.",
  },
  {
    num: "03",
    title: "Environmental / Sustainability Section 8",
    text: "For climate orgs, conservation foundations, animal welfare, sustainable-agriculture non-profits. Object clause focuses on environment / animal welfare. CSR Schedule VII(iv) eligible. Often international-donor-funded — FCRA registration recommended.",
  },
  {
    num: "04",
    title: "Arts / Culture / Heritage Section 8",
    text: "For cultural foundations, heritage preservation trusts, performing-arts non-profits, and museum-style orgs. Object clause focuses on art / culture / heritage. CSR Schedule VII(v) eligible. Smaller donor base than other variants — 80G crucial for retail-donor traction.",
  },
  {
    num: "05",
    title: "Sports & Youth Development Section 8",
    text: "For sports foundations, athlete-development non-profits, youth coaching academies, rural-sports orgs. Object clause focuses on promotion of sports. CSR Schedule VII(vii) eligible. Often paired with state sports authority partnerships.",
  },
  {
    num: "06",
    title: "Social Welfare / Charity Section 8",
    text: "The broadest category — poverty alleviation, women / children / elderly welfare, disability support, livelihood orgs, food security. Object clause is general charitable. Eligible across multiple CSR Schedule VII categories. Most donor-flexible structure.",
  },
];

const Section8PvtTypes = () => {
  return (
    <section className="s8-types-section">
      <div className="s8-types-container">

        <header className="s8-types-header">
          <h2 className="s8-types-title">
            Types of Section 8 Company Registration in India
          </h2>
          <p className="s8-types-intro">
            Section 8 is one structure — but the object clause and the post-incorporation compliance stack change dramatically by activity. Six common variants we set up — pick the one that matches your mission.
          </p>
        </header>

        <div className="s8-types-grid">
          {types.map((type, i) => (
            <article key={i} className="s8-types-card">
              <span className="s8-types-num">{type.num}</span>
              <h3 className="s8-types-subtitle">{type.title}</h3>
              <p className="s8-types-text">{type.text}</p>
            </article>
          ))}
        </div>

      </div>
    </section>
  );
};

export default Section8PvtTypes;
