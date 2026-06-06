import React from "react";
import "./Section8PvtTypes.css";

const types = [
  {
    num: "01",
    title: "Education-Focused Section 8 Company",
    text: "Established to promote formal and informal education, skill development, literacy, or vocational training. Eligible for 12A tax exemption and CSR grants from corporates with education as a Schedule VII activity. May run schools, e-learning platforms, scholarship programs, or teacher-training initiatives.",
  },
  {
    num: "02",
    title: "Healthcare & Medical Relief",
    text: "Set up to provide medical relief, preventive healthcare, mental health services, or support for persons with disabilities. Qualifies for 12A and 80G status and is eligible for health-sector CSR funding. May operate free or subsidized clinics, blood banks, or health-awareness campaigns.",
  },
  {
    num: "03",
    title: "Environmental & Sustainability",
    text: "Focused on environmental conservation, renewable energy, waste management, clean water access, or climate action. CSR funding from large corporates is readily available for environmental activities under Schedule VII, making this a well-funded operating space with strong institutional support.",
  },
  {
    num: "04",
    title: "Arts, Culture & Heritage",
    text: "Formed to preserve cultural heritage, promote classical arts, support folk traditions, or archive historical records. With 80G registration, donor contributions become tax-deductible. Receives funding from the Ministry of Culture, state cultural departments, and corporate CSR programs.",
  },
  {
    num: "05",
    title: "Sports & Youth Development",
    text: "Dedicated to promoting sports infrastructure, training grassroots athletes, or running youth empowerment programs. Eligible for CSR funding under the 'promoting rural and nationally recognized sports' category in Schedule VII. Can partner with sports federations and government sports authorities.",
  },
  {
    num: "06",
    title: "Social Welfare & Charity",
    text: "The broadest category — set up for poverty alleviation, women empowerment, child welfare, rural development, or disaster relief. Organizations typically seek 12A, 80G, and FCRA registration to diversify funding from domestic donors, corporate CSR programs, and international foundations.",
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
