import React, { useRef, useEffect } from "react";
import "./DissolaveOurClients.css";


import { clientLogos } from "../../assets/clientLogos.js";




const DissolaveOurClients = () => {
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
      scroller.scrollLeft = current + diff * SMOOTHING;

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
    const card = track.querySelector(".Dissolve-our-clients-card");
    const gap = parseInt(getComputedStyle(track).gap || "40", 10);
    const cardWidth = Math.round(card?.getBoundingClientRect().width || 160);
    const amount = cardWidth + gap;

    pauseAuto(900);

    desiredRef.current += dir === "left" ? -amount : amount;

    const half = track.scrollWidth / 2;
    if (desiredRef.current >= half) desiredRef.current -= half;
    if (desiredRef.current < 0) desiredRef.current += half;

    scroller.scrollBy({
      left: dir === "left" ? -amount : amount,
      behavior: "smooth",
    });
  };

  return (
    <section className="Dissolve-our-clients-root">
      <div className="Dissolve-our-clients-container">
        <h2 className="Dissolve-our-clients-title">OUR CLIENTS</h2>

        <div className="Dissolve-our-clients-carousel">
          <button
            className="Dissolve-our-clients-arrow Dissolve-our-clients-arrow-left"
            onClick={() => scrollByCard("left")}
          >
            ❮
          </button>

          <div className="Dissolve-our-clients-scroller">
            <ul
              className="Dissolve-our-clients-track"
              ref={trackRef}
            >
              {logosDup.map((src, i) => (
                <li
                  className="Dissolve-our-clients-card"
                  key={`logo-${i}`}
                >
                  <figure className="Dissolve-our-clients-logo">
                    <img
                      src={src}
                      alt={`client-${i}`}
                      className="Dissolve-our-clients-img"
                    />
                  </figure>
                </li>
              ))}
            </ul>
          </div>

          <button
            className="Dissolve-our-clients-arrow Dissolve-our-clients-arrow-right"
            onClick={() => scrollByCard("right")}
          >
            ❯
          </button>
        </div>
      </div>
    </section>
  );
};

export default DissolaveOurClients;
