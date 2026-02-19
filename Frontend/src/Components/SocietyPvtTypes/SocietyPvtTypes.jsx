import React from "react";
import "./SocietyPvtTypes.css";
import typesIllustration from "../../assets/pvtltd-types.png";

const SocietyPvtTypes = () => {
  return (
    <section className="society-types-section">
      <div className="society-types-container">

        {/* Illustration */}
        <div className="society-types-illustration-wrap">
          <img
            src={typesIllustration}
            alt="Types of Private Limited Company"
            className="society-types-illustration"
          />
        </div>

        {/* Content */}
        <div className="society-types-content">
          <h2 className="society-types-title">
            Types of Society Registration in India
          </h2>

          <p className="society-types-intro">
            Societies in India can be registered based on their purpose and activities:
          </p>

          {/* Type 1 */}
          <div className="society-types-block">
            <h3 className="society-types-subtitle">
              Charitable Societies:
            </h3>
            <p className="society-types-text">
              These are formed to help people in need. They work for social welfare, poverty support, medical help, and other public service activities.
            </p>
          </div>

          {/* Type 2 */}
          <div className="society-types-block">
            <h3 className="society-types-subtitle">
              Educational Societies:
            </h3>
            <p className="society-types-text">
              These societies are created to promote education. They may run schools, colleges, coaching centers, or training institutes.
            </p>
          </div>

          {/* Type 3 */}
          <div className="society-types-block">
            <h3 className="society-types-subtitle">Cultural Societies:</h3>
            <p className="society-types-text">
              These focus on promoting and protecting art, music, dance, literature, and cultural heritage.
            </p>
          </div>

          {/* Type 4 */}
          <div className="society-types-block">
            <h3 className="society-types-subtitle">Religious Societies:</h3>
            <p className="society-types-text">
              These are formed to manage religious programs, spiritual activities, or maintain places of worship.
            </p>
          </div>
        </div>

      </div>
    </section>
  );
};

export default SocietyPvtTypes;
