// FILE: BannerContact.jsx
import React from "react";
import { motion } from "framer-motion";
import { FiPhoneCall } from "react-icons/fi";
import "./BannerContact.css";

const BannerContact = () => {
  return (
    <section className="contactbanner-container" aria-labelledby="contactbanner-title">
      <motion.div
        className="contactbanner-inner"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >

        <span className="contactbanner-badge">Need Assistance?</span>

        <h1 id="contactbanner-title" className="contactbanner-title">
          Contact Our Experts Today
        </h1>

        <p className="contactbanner-sub">
          Fast responses • Expert guidance • Hassle-free support
        </p>

        <a
          href="tel:+918280093456"
          className="contactbanner-btn"
          aria-label="Call our team"
        >
          <FiPhoneCall aria-hidden="true" className="contactbanner-icon" />
          Call Us Now
        </a>
      </motion.div>
    </section>
  );
};

export default BannerContact;
