import React from 'react';
import './UdyamRegBreadcrum.css'
import bgImage from '../../assets/breadcrum.png';

import ConsultationForm from '../ConsultationForm/ConsultationForm';
const Breadcrum = () => {
  return (
    <section
      className="breadcrum"
      style={{ '--bg': `url(${bgImage})` }}
    >
      <div className="reg-breadcrum-inner">
        {/* LEFT PANEL */}
        <div className="reg-breadcrum-left-panel">
         <h1 className="reg-breadcrum-title">
              <span className="reg-breadcrum-orange">Udyam Registration Online </span>
              <span className="reg-breadcrum-black">in India</span>
            </h1>

          <h3 className="reg-breadcrum-subtitle">
            <strong>Save 50% Today</strong>{' '}
            <span>
              on <strong>Professional Services</strong>
            </span>
          </h3>

          <p className="reg-breadcrum-desc">
            Legal Terminus can help you with Private Limited Company registration, as and when required, in a hassle-free manner within a reasonable time span. We provide competitive professional fees starting at Rs. 3,999/- for your needs in private limited company registration in India. 
          </p>

          <h4 className="reg-breadcrum-included">What's Included?</h4>

          <div className="reg-breadcrum-features">
            <ul className="reg-breadcrum-col">
              <li>Registration in 1-2 Weeks</li>
              <li>MCA Name Approval</li>
              <li>DSC in 2-4 Days</li>
            </ul>
            <ul className="reg-breadcrum-col">
              <li>DIN, PAN, and SPICE+ Compliance</li>
              <li>MOA &amp; AOA Drafting</li>
            </ul>
          </div>

          <p className="reg-breadcrum-note">
            <span className="reg-breadcrum-star">★</span>
            Register 100+ Companies Every Month + Save 18% with GST Registration
          </p>

          <div className="reg-breadcrum-cta-row">
            <button className="reg-breadcrum-schedule-btn">Book a Schedule ➜</button>

            <div className="reg-breadcrum-reviews">
              <div className="reg-breadcrum-google">
                <img src="https://corpbiz.io/img/google.webp" alt="" />
              </div>
              <div className="reg-breadcrum-trustpilot">
                <img src="https://corpbiz.io/img/trustpilot.webp" alt="" />
                
              </div>
            </div>
          </div>
        </div>

        {/* RIGHT FORM */}
        <ConsultationForm
          source="udyam-registration"
          subtitle="Talk to our expert"
        />
      </div>
    </section>
  );
};

export default Breadcrum;
