import React from 'react';
import {
  FaFacebookF,
  FaInstagram,
  FaWhatsapp,
  FaYoutube,
  FaEnvelope,
  FaPhone,
  FaMapMarkerAlt,
  FaArrowRight
} from 'react-icons/fa';
import './Footer.css';

import LOGO from '../../assets/legal.png';

const Footer = () => {
  return (
    <footer className="premium-footer">
      <div className="premium-footer-overlay" />
      <div className="premium-footer-inner">
        <div className="footer-columns">

          {/* Quick Links */}
          <div className="footer-col">
            <h3 className="footer-title">Quick Links</h3>
            <ul className="footer-links">
              <li>
                <a href="#about">
                  <span className="link-icon">→</span>
                  <span className="link-text">Terms & Conditions</span>
                </a>
              </li>
              <li>
                <a href="#services">
                  <span className="link-icon">→</span>
                  <span className="link-text">Privacy Policy</span>
                </a>
              </li>
              <li>
                <a href="#blog">
                  <span className="link-icon">→</span>
                  <span className="link-text">Refund Policy</span>
                </a>
              </li>
              <li>
                <a href="#contact">
                  <span className="link-icon">→</span>
                  <span className="link-text">Confidentiality Policy</span>
                </a>
              </li>
            </ul>
          </div>

          {/* Service Links */}
          <div className="footer-col">
            <h3 className="footer-title">Service Links</h3>
            <ul className="footer-links">
              <li>
                <a href="#privacy">
                  <span className="link-icon">→</span>
                  <span className="link-text">Business Registration</span>
                </a>
              </li>
              <li>
                <a href="#support">
                  <span className="link-icon">→</span>
                  <span className="link-text">Registration Srvices</span>
                </a>
              </li>
              <li>
                <a href="#disclaimer">
                  <span className="link-icon">→</span>
                  <span className="link-text">Compliances Services</span>
                </a>
              </li>
              <li>
                <a href="#faq">
                  <span className="link-icon">→</span>
                  <span className="link-text">Trademark Services</span>
                </a>
              </li>
              <li>
                <a href="#terms">
                  <span className="link-icon">→</span>
                  <span className="link-text">Licenses</span>
                </a>
              </li>
            </ul>
          </div>

          {/* Center Brand */}
          <div className="footer-col footer-center">
            <div className="footer-brand">
              <img src={LOGO} alt="Brand Logo" className="footer-logo" />
            </div>

            <p className="footer-desc">
              Sed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium doloremque laudantium, totam rem aperiam.
            </p>

            <div className="footer-socials">
              <a href="https://www.facebook.com/LegalTerminusofficial" aria-label="facebook" className="social-btn">
                <FaFacebookF className="social-icon" />
                <span className="social-tooltip">Facebook</span>
              </a>
              <a href="https://www.instagram.com/legalterminus/" aria-label="instagram" className="social-btn">
                <FaInstagram className="social-icon" />
                <span className="social-tooltip">Instagram</span>
              </a>
              <a href="#wa" aria-label="whatsapp" className="social-btn">
                <FaWhatsapp className="social-icon" />
                <span className="social-tooltip">WhatsApp</span>
              </a>
              <a href="https://www.youtube.com/@LegalTerminus" aria-label="youtube" className="social-btn">
                <FaYoutube className="social-icon" />
                <span className="social-tooltip">YouTube</span>
              </a>
            </div>
          </div>

          {/* Contact Section */}
          <div className="footer-col footer-contact">
            <h3 className="footer-title">Free Consultation</h3>



            <ul className="contact-list">
              <li>
                <div className="contact-item">
                  <span className="ci"><FaEnvelope /></span>
                  <div className="contact-info">
                    <span className="contact-label">Email Us</span>
                    <a href="mailto:sales21@legalterminus.com">sales21@legalterminus.com</a>
                  </div>
                </div>
              </li>
              <li>
                <div className="contact-item">
                  <span className="ci"><FaPhone style={{ transform: "rotate(90deg)" }}/></span>
                  <div className="contact-info">
                    <span className="contact-label">Call Us</span>
                    <a href="tel:8280093456">8280093456</a>
                  </div>
                </div>
              </li>
              <li>
                <div className="contact-item">
                  <span className="ci"><FaMapMarkerAlt /></span>
                  <div className="contact-info">
                    <span className="contact-label">Visit Us</span>
                    <span>Flat No 1B, RK Enclave, Plot No A/155, Saheed Nagar, Bhubaneswar, Odisha 751007</span>
                  </div>
                </div>
              </li>
            </ul>
          </div>
        </div>

        <div className="footer-bottom">

          <div className="footer-bottom-content">
            <div className="copyright">
              © 2023 Legal Terminus. All Rights Reserved. | Powered by Legal Terminus Developed by <a href='https://infynialabs.com/' className='pr'>AI Agents from InfyniaLabs</a>
            </div>

          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
