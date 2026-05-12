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
            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3770.463426483872!2d85.82233021486082!3d20.29605938637152!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3a1908b6d7f6d4b7%3A0x9a5c2ff9b7f2a5c2!2sBhubaneswar%2C%20Odisha%20751001%2C%20India!5e0!3m2!1sen!2sus!4v1620000000000"
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
                <li><span className="contactussection-bullet" /> <strong>Phone:</strong> (+62) 81 157 5891</li>
                <li><span className="contactussection-bullet" /> <strong>Location:</strong> Bhubaneswar, Odisha</li>
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
                <li><span className="contactussection-bullet" /> Mon – Fri: 9 AM — 4 PM</li>
                <li><span className="contactussection-bullet" /> Sat: 9 AM — 2 PM</li>
                <li><span className="contactussection-bullet" /> Sunday: Closed</li>
              </ul>
            </div>
          </article>
        </div>
      </div>

      <aside className="contactussection-right" aria-labelledby="contactus-form-heading">
        <h3 id="contactus-form-heading" className="contactussection-form-heading">Send a Message</h3>

        <form className="contactussection-form" onSubmit={(e) => e.preventDefault()} noValidate>
          <div className="contactussection-row">
            <input className="contactussection-field" type="text" placeholder="Your Name" aria-label="Your name" />
            <input className="contactussection-field" type="email" placeholder="Your Email" aria-label="Your email" />
          </div>

          <input className="contactussection-field" type="text" placeholder="Subject" aria-label="Subject" />
          <textarea className="contactussection-field contactussection-textarea" placeholder="Your Message" aria-label="Your message" />

          <div className="contactussection-actions">
            <button className="contactussection-button" type="submit">SEND MESSAGE</button>
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
