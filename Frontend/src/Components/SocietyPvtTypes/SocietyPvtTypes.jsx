import React from "react";
import "./SocietyPvtTypes.css";

const types = [
  {
    number: "01",
    title: "Charitable Societies",
    text: "Formed to help people in need — covering social welfare, poverty alleviation, medical aid, and public service activities for the benefit of the community at large.",
  },
  {
    number: "02",
    title: "Educational Societies",
    text: "Created to promote education by running schools, colleges, coaching centers, or training institutes for students and learners across various disciplines.",
  },
  {
    number: "03",
    title: "Cultural Societies",
    text: "Focus on promoting and protecting art, music, dance, literature, and cultural heritage to preserve India's rich traditions and artistic legacy.",
  },
  {
    number: "04",
    title: "Religious Societies",
    text: "Formed to manage religious programs, spiritual activities, or maintain places of worship and conduct religious ceremonies for communities.",
  },
];

const SocietyPvtTypes = () => {
  return (
    <section className="soctyp-section">
      <div className="soctyp-container">
        <h2 className="soctyp-title">Types of Society Registration in India</h2>
        <div className="soctyp-cards">
          {types.map((type) => (
            <div className="soctyp-card" key={type.number}>
              <div className="soctyp-number">{type.number}</div>
              <h3 className="soctyp-card-title">{type.title}</h3>
              <p className="soctyp-card-text">{type.text}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default SocietyPvtTypes;
