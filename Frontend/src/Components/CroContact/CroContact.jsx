import React from "react";
import "./CroContact.css";
import ConsultationForm from "../ConsultationForm/ConsultationForm";
import { FaMapMarkerAlt, FaPhoneAlt, FaWhatsapp, FaEnvelope, FaClock } from "react-icons/fa";

const TIME_SLOTS = [
  "10 AM – 11 AM", "11 AM – 12 PM", "12 PM – 1 PM", "1 PM – 2 PM",
  "2 PM – 3 PM", "3 PM – 4 PM", "4 PM – 5 PM", "5 PM – 6 PM", "6 PM – 7 PM",
];

const CroContact = () => {
  return (
    <section className="croct-section" id="contact">
      <div className="croct-container">

        <header className="croct-header">
          <span className="croct-tag">GET IN TOUCH</span>
          <h2 className="croct-title">Book Your Free Consultation</h2>
          <p className="croct-subtitle">
            Talk to our company registration experts in Bhubaneswar. Pick a convenient time slot and
            we'll call you back — by phone or WhatsApp — to understand your requirements.
          </p>
        </header>

        <div className="croct-grid">

          {/* Left — consultation form */}
          <div className="croct-form-col" id="cro-contact-form">
            <ConsultationForm
              source="company-registration-odisha"
              subtitle="Talk to our company registration expert in Odisha"
            />
          </div>

          {/* Right — contact info */}
          <div className="croct-info-col">

            <div className="croct-info-card">
              <div className="croct-info-row">
                <div className="croct-info-icon"><FaMapMarkerAlt /></div>
                <div>
                  <h4>Visit Our Office</h4>
                  <p>Flat No 1B, First Floor, R K Enclave, Plot No A/155, Saheed Nagar, Bhubaneswar, Odisha 751007</p>
                </div>
              </div>

              <div className="croct-info-row">
                <div className="croct-info-icon"><FaPhoneAlt /></div>
                <div>
                  <h4>Call Us</h4>
                  <p>
                    <a href="tel:8280093456">82800 93456</a> / <a href="tel:8280045432">82800 45432</a>
                  </p>
                </div>
              </div>

              <div className="croct-info-row">
                <div className="croct-info-icon"><FaEnvelope /></div>
                <div>
                  <h4>Email Us</h4>
                  <p><a href="mailto:sales21@legalterminus.com">sales21@legalterminus.com</a></p>
                </div>
              </div>

              <div className="croct-info-row">
                <div className="croct-info-icon"><FaClock /></div>
                <div>
                  <h4>Consultation Time Slots</h4>
                  <div className="croct-slots">
                    {TIME_SLOTS.map((slot) => (
                      <span className="croct-slot" key={slot}>{slot}</span>
                    ))}
                  </div>
                </div>
              </div>

              <div className="croct-btn-row">
                <a className="croct-btn croct-btn--call" href="tel:8280093456">
                  <FaPhoneAlt /> Call Now
                </a>
                <a
                  className="croct-btn croct-btn--wa"
                  href="https://wa.me/918280008183"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <FaWhatsapp /> WhatsApp
                </a>
              </div>
            </div>

          </div>
        </div>

        <p className="croct-disclaimer">
          Disclaimer: Legal Terminus is a privately operated consultancy service provider and is not
          affiliated with any government authority. We provide assistance in documentation, preparation,
          and filing services only. Government approvals / registrations are issued by the respective
          government departments.
        </p>

      </div>
    </section>
  );
};

export default CroContact;
