// ContactUsBanner.jsx
import React, { useEffect, useRef } from "react";
import { motion, useSpring, useTransform, useMotionValue } from "framer-motion";
import "./ContactUsBanner.css";

const IMAGE_URL =
  "https://images.unsplash.com/photo-1521791136064-7986c2920216?auto=format&fit=crop&w=1600&q=80";

const ContactUsBanner = () => {
  const rootRef = useRef(null);
  const sweepRef = useRef(null);

  // Cursor motion values
  const px = useMotionValue(0);
  const py = useMotionValue(0);

  // Smooth cursor → movement
  const sx = useSpring(px, { stiffness: 90, damping: 20 });
  const sy = useSpring(py, { stiffness: 90, damping: 20 });

  // Parallax transforms
  const tiltX = useTransform(sy, (v) => v * -8);
  const tiltY = useTransform(sx, (v) => v * 8);
  const translateX = useTransform(sx, (v) => v * 15);
  const translateY = useTransform(sy, (v) => v * 8);

  // Throttled cursor tracking using rAF — avoids getBoundingClientRect on every mousemove
  useEffect(() => {
    const el = rootRef.current;
    if (!el) return;
    let rafId = null;
    let lastX = 0, lastY = 0;

    const move = (e) => {
      lastX = e.clientX;
      lastY = e.clientY;
      if (rafId) return;
      rafId = requestAnimationFrame(() => {
        const r = el.getBoundingClientRect();
        px.set((lastX - r.left) / r.width - 0.5);
        py.set((lastY - r.top) / r.height - 0.5);
        rafId = null;
      });
    };

    el.addEventListener("mousemove", move, { passive: true });
    return () => {
      el.removeEventListener("mousemove", move);
      if (rafId) cancelAnimationFrame(rafId);
    };
  }, [px, py]);

  // Entrance sweep — pure DOM, no React state
  useEffect(() => {
    const sweep = sweepRef.current;
    if (!sweep) return;
    sweep.style.transform = "translateX(-120%)";
    sweep.style.opacity = "0";
    const t1 = setTimeout(() => {
      sweep.style.transition = "1.1s cubic-bezier(.22,.9,.36,1)";
      sweep.style.transform = "translateX(120%)";
      sweep.style.opacity = "0.35";
      const t2 = setTimeout(() => { sweep.style.opacity = "0"; }, 900);
      return () => clearTimeout(t2);
    }, 100);
    return () => clearTimeout(t1);
  }, []);

  return (
    <section
      className="contactusbanner-root"
      ref={rootRef}
      aria-label="Hero section for Notary service"
    >
      <motion.div
        className="hero-img-wrap"
        style={{
          rotateX: tiltX,
          rotateY: tiltY,
          x: translateX,
          y: translateY,
        }}
        aria-hidden="true"
      >
        {/* breathing idle motion handled by CSS animation — no rAF loop */}
        <div
          className="hero-img hero-img--breathing"
          style={{ backgroundImage: `url(${IMAGE_URL})` }}
        />
        <div className="hero-img-glass" aria-hidden="true" />
        <div className="hero-img-sweep" ref={sweepRef} aria-hidden="true" />
      </motion.div>

      <div className="contactusbanner-overlay" aria-hidden="true" />

      <div className="contactusbanner-container">
        <div className="contactusbanner-left">
          <h1 className="contactusbanner-title">
            Professional and <br />
            Reliable <span className="highlight-wrap">Legal Terminus</span> Service
            <br />
            That You Can Trust
          </h1>

          <p className="contactusbanner-desc">
            Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do
            eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim
            ad minim veniam quis nostrud
          </p>

          <div className="contactusbanner-cta">
            <button className="btn-get" aria-label="Get started">
              GET STARTED
            </button>
          </div>
        </div>

        <div style={{ flex: 1 }} />
      </div>
    </section>
  );
};

export default ContactUsBanner;
