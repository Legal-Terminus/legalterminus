import React, { useRef, useEffect } from "react";
import "./ReplyOfEROurclints.css";

import { clientLogos } from "../../assets/clientLogos.js";

const OurClients = () => {
  const logos = clientLogos;


  const logosDup = [...logos, ...logos];

  const trackRef = useRef(null);
  const rafRef = useRef(null);
  const lastRef = useRef(null);
  const desiredRef = useRef(0);
  const pausedRef = useRef(false);
  const resumeTimerRef = useRef(null);

  const SPEED = 60;
  const SMOOTHING = 0.12;

  // ------------------------------------
  // Auto-scroll logic remains unchanged
  // ------------------------------------
  useEffect(() => {
    const track = trackRef.current;
    if (!track) return;
    const scroller = track.parentElement;

    scroller.style.overflowX = "auto";
    scroller.style.scrollBehavior = "auto";

    const loop = (t) => {
      if (pausedRef.current) {
        lastRef.current = t;
        rafRef.current = requestAnimationFrame(loop);
        return;
      }

      if (!lastRef.current) lastRef.current = t;
      const dt = (t - lastRef.current) / 1000;
      lastRef.current = t;

      desiredRef.current += SPEED * dt;

      const half = track.scrollWidth / 2;
      if (desiredRef.current >= half) desiredRef.current -= half;

      const current = scroller.scrollLeft;
      const diff = desiredRef.current - current;
      const step = diff * SMOOTHING;

      scroller.scrollLeft = current + step;

      rafRef.current = requestAnimationFrame(loop);
    };

    rafRef.current = requestAnimationFrame(loop);

    return () => {
      cancelAnimationFrame(rafRef.current);
      clearTimeout(resumeTimerRef.current);
    };
  }, []);

  const pauseAuto = (ms = 1200) => {
    pausedRef.current = true;
    clearTimeout(resumeTimerRef.current);

    if (ms !== Infinity) {
      resumeTimerRef.current = setTimeout(() => {
        const track = trackRef.current;
        if (track?.parentElement) {
          desiredRef.current = track.parentElement.scrollLeft;
        }
        pausedRef.current = false;
      }, ms);
    }
  };

  const scrollByCard = (dir) => {
    const track = trackRef.current;
    if (!track) return;

    const scroller = track.parentElement;
    const card = track.querySelector(".Rf-ER-clients-card");
    const gap = parseInt(getComputedStyle(track).gap || "40", 10);
    const cardWidth = Math.round(card?.getBoundingClientRect().width || 160);
    const amount = cardWidth + gap;

    pauseAuto(900);

    if (dir === "left") desiredRef.current -= amount;
    else desiredRef.current += amount;

    const half = track.scrollWidth / 2;
    if (desiredRef.current >= half) desiredRef.current -= half;
    if (desiredRef.current < 0) desiredRef.current += half;

    scroller.scrollBy({
      left: dir === "left" ? -amount : amount,
      behavior: "smooth",
    });

    setTimeout(() => {
      if (scroller.scrollLeft >= half) scroller.scrollLeft -= half;
      desiredRef.current = scroller.scrollLeft;
    }, 950);
  };

  // --------------------------------------------
  // Updated clean class names applied below
  // --------------------------------------------

  return (
    <section className="Rf-ER-clients-root">
      <div className="Rf-ER-clients-container">
        <h2 className="Rf-ER-clients-title">OUR CLIENTS</h2>

        <div className="Rf-ER-clients-carousel">
          <button className="Rf-ER-clients-arrow Rf-ER-clients-arrow-left"
            onClick={() => scrollByCard("left")}
          >
            <svg width="18" height="18" viewBox="0 0 24 24">
              <path d="M15 18L9 12L15 6" stroke="#fff" strokeWidth="2.5"
                strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </button>

          <div className="Rf-ER-clients-scroller">
            <ul className="Rf-ER-clients-track" ref={trackRef}>
              {logosDup.map((src, i) => (
                <li className="Rf-ER-clients-card" key={`logo-${i}`}>
                  <figure className="Rf-ER-clients-logo">
                    <img src={src} alt={`client-${i}`} className="Rf-ER-clients-img" />
                  </figure>
                </li>
              ))}
            </ul>
          </div>

          <button className="Rf-ER-clients-arrow Rf-ER-clients-arrow-right"
            onClick={() => scrollByCard("right")}
          >
            <svg width="18" height="18" viewBox="0 0 24 24">
              <path d="M9 6L15 12L9 18" stroke="#fff" strokeWidth="2.5"
                strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </button>
        </div>
      </div>
    </section>
  );
};

export default OurClients;
