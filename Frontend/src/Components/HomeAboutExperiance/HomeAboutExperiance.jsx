import React, { useEffect, useRef } from "react";
import "./HomeAboutExperiance.css";
import Leftimg from "../../assets/about-5.webp";
import { THEME_C } from "../../utils/theme";
import CountUp from "../../theme/CountUp";

// Theme C (E-25, #209): the ring figures count up once on scroll-in and land on
// the exact same string. Switch off: the plain text, as before.
const figure = (to, final) => (THEME_C ? <CountUp to={to} suffix="%" final={final} /> : final);

const HomeAboutExperiance = () => {
  const sectionRef = useRef(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          sectionRef.current.classList.add("hae-visible");
        }
      },
      { threshold: 0.35 }
    );

    if (sectionRef.current) observer.observe(sectionRef.current);
    return () => observer.disconnect();
  }, []);

  return (
    <section className="hae-section" ref={sectionRef}>
      <div className="hae-container">
        {/* Left Image */}
        <div className="hae-images">
          <div className="hae-image hae-image--large">
            <img src={Leftimg} alt="Legal consultation and compliance support" />
          </div>
        </div>

        {/* Content */}
        <div className="hae-content">
          <span className="hae-subtitle">ABOUT LEGAL TERMINUS</span>

          <h2 className="hae-title">
            Your One-Stop Partner For Legal, Tax & Compliance
          </h2>

          <p className="hae-description">
            <strong>Legal Terminus</strong> is India’s one of the leading professional services company who aims at providing business services in a Professional Manner. Legal Terminus, being a one-stop solution, helps your business in meeting the legal/ statutory compliances in a hassle-free manner. The highly knowledgeable and experienced consultants of  Legal Terminus help your business grow in a smooth way.
<br/><br/>
The best part of <strong>Legal Terminus</strong> is it takes care of all your filings and lets you concentrate on your business without being worried about the legal complications. Our excellent and timely reminder policy will never let you spend a single penny towards a penalty or late fee under any law.


          </p>

          <div className="hae-stats">
            <div className="hae-stat">
              <div className="hae-circle hae-circle--green">{figure(98, "98%")}</div>
              <span>Client Satisfaction</span>
            </div>

            <div className="hae-stat">
              <div className="hae-circle hae-circle--blue">{figure(100, "100%")}</div>
              <span>Compliance Accuracy</span>
            </div>

            <div className="hae-stat">
              <div className="hae-circle hae-circle--orange">{figure(100, "100%")}</div>
              <span>Online Registration</span>
            </div>
          </div>
        </div>
      </div>

      {/* CTA */}
      <div className="hae-cta">
        <p>Need legal or compliance support?</p>
        <div className="hae-cta-divider"></div>
        <p>
          <span className="hae-phone-icon">📞</span>
          Talk to a Legal Expert Today (+91 828 009 3456)
        </p>
      </div>
    </section>
  );
};

export default HomeAboutExperiance;
