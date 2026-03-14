import React from "react";
import "./TMApplicaTypes.css";
import typesIllustration from "../../assets/pvtltd-types.png"


const PvtTypes = () => {
  return (
    <section className="Tm-Application-types-section">
      <div className="Tm-Application-types-container">
        {/* Left graphic */}
        <div className="Tm-Application-types-illustration-wrap">
          <img
            src={typesIllustration}
            alt="Types of Private Limited Company"
            className="Tm-Application-types-illustration"
          />
        </div>

        {/* Right content */}
        <div className="Tm-Application-types-content">
          <h2 className="Tm-Application-types-title">
            Types of Trademarks You Can Register in India
          </h2>

          { <p className="Tm-Application-types-intro">
            Under the Trade Marks Act, 1999, a trademark can take many forms. Here's what you can protect:
          </p> }

          {/* Type 1 */}
          <div className="Tm-Application-types-block">
            <h3 className="Tm-Application-types-subtitle">Word Mark</h3>
            <p className="Tm-Application-types-text">
             Protect a brand name, a person's name, or any combination of letters and numbers. Think: TATA, ZOMATO, BYJU'S. If your brand name is the hero — file for a word mark.</p>
          </div>

          {/* Type 2 */}
          <div className="Tm-Application-types-block">
            <h3 className="Tm-Application-types-subtitle">Logo / Device Mark</h3>
            <p className="Tm-Application-types-text">
            Protect a distinctive design, symbol, or logo — with or without text. Example: the Nike swoosh, the Amul girl. This covers the visual identity of your brand.</p>
          </div>

          {/* Type 3 */}
          <div className="Tm-Application-types-block">
            <h3 className="Tm-Application-types-subtitle">Composite Mark</h3>
            <p className="Tm-Application-types-text">
             A combination of words and a logo filed together as a single mark. Most modern brands register composite marks to get full coverage — name + look together.</p>
          </div>

          {/* Type 4 */}
          <div className="Tm-Application-types-block">
            <h3 className="Tm-Application-types-subtitle">Certification Mark</h3>
            <p className="Tm-Application-types-text">
             Awarded by a certifying authority to indicate that goods/services meet a certain standard. Example: ISI, Agmark, Hallmark for gold. Filed under Section 69 of the Trade Marks Act, 1999.</p>
          </div>

          {/* Type 5 */}
          <div className="Tm-Application-types-block">
            <h3 className="Tm-Application-types-subtitle">Collective Mark</h3>
            <p className="Tm-Application-types-text">
             Used by members of an association to indicate their collective identity. Example: 'CA' mark used by members of the Institute of Chartered Accountants of India (ICAI).</p>
          </div>

          {/* Type 6 */}
          <div className="Tm-Application-types-block">
            <h3 className="Tm-Application-types-subtitle">Series Mark</h3>
            <p className="Tm-Application-types-text">
             A group of trademarks with common elements filed under a single application. Useful for brands with product variants — e.g., MAGGI 2-Minute Noodles, MAGGI Masala, MAGGI Hot & Sweet.</p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default PvtTypes;
