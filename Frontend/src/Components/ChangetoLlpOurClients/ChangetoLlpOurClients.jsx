import React, { useRef, useEffect } from "react";
import "./ChangetoLlpOurClients.css";

import { clientLogos } from "../../assets/clientLogos.js";
/* … all imports unchanged … */
import { clientLogos } from "../../assets/clientLogos.js";

const LlpOurClients = () => {
  const logos = [
    client1, client2, /* … unchanged … */ client119
  ];

  const logosDup = [...logos, ...logos];

  const trackRef = useRef(null);
  const rafRef = useRef(null);
  const lastRef = useRef(null);
  const desiredRef = useRef(0);
  const pausedRef = useRef(false);
  const resumeTimerRef = useRef(null);

  const SPEED = 60;
  const SMOOTHING = 0.12;

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
    const card = track.querySelector(".llpoc-card");
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

  return (
    <section className="llpoc-root">
      <div className="llpoc-container">
        <h2 className="llpoc-title">OUR CLIENTS</h2>

        <div className="llpoc-carousel">
          <button
            className="llpoc-arrow llpoc-arrow-left"
            onClick={() => scrollByCard("left")}
          >
            ‹
          </button>

          <div className="llpoc-scroller">
            <ul className="llpoc-track" ref={trackRef}>
              {logosDup.map((src, i) => (
                <li className="llpoc-card" key={`logo-${i}`}>
                  <figure className="llpoc-logo">
                    <img src={src} alt={`client-${i}`} className="llpoc-img" />
                  </figure>
                </li>
              ))}
            </ul>
          </div>

          <button
            className="llpoc-arrow llpoc-arrow-right"
            onClick={() => scrollByCard("right")}
          >
            ›
          </button>
        </div>
      </div>
    </section>
  );
};

export default LlpOurClients;
