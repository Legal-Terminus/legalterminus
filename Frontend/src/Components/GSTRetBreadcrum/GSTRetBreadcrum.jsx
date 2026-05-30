import React from 'react';
import './GSTRetBreadcrum.css';
import bgImage from '../../assets/breadcrum.png';

import ConsultationForm from '../ConsultationForm/ConsultationForm';
const Breadcrum = () => {
  return (
    <section
      className="breadcrum"
      style={{ '--bg': `url(${bgImage})` }}
    >
      <div className="ret-breadcrum-inner">
        {/* LEFT PANEL */}
        <div className="ret-breadcrum-left-panel">
         <h1 className="ret-breadcrum-title">
              <span className="ret-breadcrum-orange">GST Return Filing</span>{' '}
              <span className="ret-breadcrum-black">in India</span>
            </h1>

          <h3 className="ret-breadcrum-subtitle">
            <strong>Save 50% Today</strong>{' '}
            <span>
              on <strong>Professional Services</strong>
            </span>
          </h3>

          <p className="ret-breadcrum-desc">
            Legal Terminus can help you with Private Limited Company registration, as and when required, in a hassle-free manner within a reasonable time span. We provide competitive professional fees starting at Rs. 3,999/- for your needs in private limited company registration in India. 
          </p>

          <h4 className="ret-breadcrum-included">What's Included?</h4>

          <div className="ret-breadcrum-features">
            <ul className="ret-breadcrum-col">
              <li>Registration in 1-2 Weeks</li>
              <li>MCA Name Approval</li>
              <li>DSC in 2-4 Days</li>
            </ul>
            <ul className="ret-breadcrum-col">
              <li>DIN, PAN, and SPICE+ Compliance</li>
              <li>MOA &amp; AOA Drafting</li>
            </ul>
          </div>

          <p className="ret-breadcrum-note">
            <span className="ret-breadcrum-star">★</span>
            Register 100+ Companies Every Month + Save 18% with GST Registration
          </p>

          <div className="ret-breadcrum-cta-row">
            <button className="ret-breadcrum-schedule-btn">Book a Schedule ➜</button>

            <div className="ret-breadcrum-reviews">
              <div className="ret-breadcrum-google">
                <img src="https://corpbiz.io/img/google.webp" alt="" />
              </div>
              <div className="ret-breadcrum-trustpilot">
                <img src="https://corpbiz.io/img/trustpilot.webp" alt="" />
                
              </div>
            </div>
          </div>
        </div>

        {/* RIGHT FORM */}
        <ConsultationForm
          source="gst-returns"
          subtitle="Talk to our expert"
        />
      </div>
    </section>
  );
};

export default Breadcrum;
