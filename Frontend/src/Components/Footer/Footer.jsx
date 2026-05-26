import React from 'react';
import { Link } from 'react-router-dom';
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
                <Link to="/policies/terms">
                  <span className="link-icon">→</span>
                  <span className="link-text">Terms & Conditions</span>
                </Link>
              </li>
              <li>
                <Link to="/policies/privacy">
                  <span className="link-icon">→</span>
                  <span className="link-text">Privacy Policy</span>
                </Link>
              </li>
              <li>
                <Link to="/policies/refund">
                  <span className="link-icon">→</span>
                  <span className="link-text">Refund Policy</span>
                </Link>
              </li>
              <li>
                <Link to="/policies/confidentiality">
                  <span className="link-icon">→</span>
                  <span className="link-text">Confidentiality Policy</span>
                </Link>
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
              Legal Terminus delivers trusted legal and business solutions, simplifying compliance, documentation, and registration services for startups, businesses, and individuals.
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
              <a href="https://wa.me/918280008183" aria-label="whatsapp" className="social-btn" target="_blank" rel="noopener noreferrer">
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
                    <a href="tel:8280093456">8280093456</a> / <a href="tel:8280045432">8280045432</a>
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
          <div className="footer-disclaimer">
            <p>
              <strong>Disclaimer:</strong> This website is privately operated consultancy service provider and is not affiliated with any government authority. We provide assistance in documentation, preparation and filing services only. Government approvals / registrations are issued by the respective government departments. Fees charged on this website are professional consultancy fees only and do not include government fees. By using this website, you acknowledge that we are a private service provider.
            </p>
          </div>
          <div className="footer-bottom-content">
            <div className="copyright">
              © 2023 – 2026 Legal Terminus Private Limited. All rights reserved.
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
