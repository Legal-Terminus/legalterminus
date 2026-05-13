import React from "react";
import "./ContactUsSection.css";
import { FaPhone, FaMapMarkerAlt, FaEnvelope } from "react-icons/fa";
import { FiClock } from "react-icons/fi";

const ContactUsSection = () => {
  return (
    <section className="contactussection-wrapper" aria-labelledby="contactus-heading">
      <div className="contactussection-left">
        <div className="contactussection-mapbox" aria-hidden="true">
          <iframe
            className="contactussection-iframe"
            title="Bhubaneswar map"
            src="https://maps.google.com/maps?q=Flat+No+1B+RK+Enclave+Plot+No+A%2F155+Saheed+Nagar+Bhubaneswar+Odisha+751007&output=embed"
            allowFullScreen
            loading="lazy"
          />
        </div>

        <div className="contactussection-eyebrow">Get In Touch</div>

        <h2 id="contactus-heading" className="contactussection-headline">
          Contact Us To Get Better Information
        </h2>

        <p className="contactussection-intro">
          Have a question or need assistance? We're happy to help. Send us a message or reach out using the contact details below.
        </p>

        <div className="contactussection-contactgrid">
          <article className="contactussection-card">
            <div className="contactussection-iconwrap" aria-hidden="true">
              <FaPhone />
            </div>
            <div className="contactussection-card-body">
              <h3 className="contactussection-card-title">Let's Talk</h3>
              <ul className="contactussection-list">
                <li><span className="contactussection-bullet" /> <strong>Phone:</strong> (+91) 8280045432 / 8280093456</li>
                <li><span className="contactussection-bullet" /> <strong>Location:</strong> Flat No 1B, RK Enclave, Plot No A/155, Saheed Nagar, Bhubaneswar, Odisha 751007</li>
                <li><span className="contactussection-bullet" /> <strong>Email:</strong> sales21@legalterminus.com</li>
              </ul>
            </div>
          </article>

          <article className="contactussection-card">
            <div className="contactussection-iconwrap" aria-hidden="true">
              <FiClock />
            </div>
            <div className="contactussection-card-body">
              <h3 className="contactussection-card-title">Open Hours</h3>
              <ul className="contactussection-list">
                <li><span className="contactussection-bullet" /> Mon – Sat: 10 AM — 7 PM</li>
                <li><span className="contactussection-bullet" /> Sunday: Closed</li>
              </ul>
            </div>
          </article>
        </div>
      </div>

      <aside className="contactussection-right" aria-labelledby="contactus-form-heading">
        <h3 id="contactus-form-heading" className="contactussection-form-heading">Request a Callback</h3>

        <form className="contactussection-form" onSubmit={(e) => e.preventDefault()} noValidate>
          <div className="contactussection-row">
            <input className="contactussection-field" type="text" placeholder="Your Name" aria-label="Your name" />
            <input className="contactussection-field" type="email" placeholder="Your Email" aria-label="Your email" />
          </div>

          <input className="contactussection-field" type="tel" placeholder="Mobile Number" aria-label="Mobile number" />
          <textarea className="contactussection-field contactussection-textarea" placeholder="Your Message" aria-label="Your message" />

          <div className="contactussection-actions">
            <button className="contactussection-button" type="submit">SEND</button>
            <button className="contactussection-ghost" type="button" onClick={() => {
              const form = document.querySelector('.contactussection-form');
              if (form) form.reset();
            }}>CLEAR</button>
          </div>
        </form>

        <div className="contactussection-mini" aria-hidden="true">
          <div className="contactussection-mini-item">
            <FaMapMarkerAlt /> <span>Bhubaneswar, Odisha</span>
          </div>
          <div className="contactussection-mini-item">
            <FaEnvelope /> <span>sales21@legalterminus.com</span>
          </div>
        </div>
      </aside>
    </section>
  );
};

export default ContactUsSection;
