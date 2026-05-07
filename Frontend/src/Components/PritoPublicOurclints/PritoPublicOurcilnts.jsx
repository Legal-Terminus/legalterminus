import React, { useRef, useEffect } from "react";
import "./PritoPublicOurcilnts.css";

import { clientLogos } from "../../assets/clientLogos.js";

const OurClients = () => {
  const logos = clientLogos;

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

  const scrollByCard = (dir) => {
    const track = trackRef.current;
    if (!track) return;

    const scroller = track.parentElement;
    const card = track.querySelector(".prp-clients-card");
    const gap = parseInt(getComputedStyle(track).gap || "40", 10);
    const cardWidth = Math.round(card?.getBoundingClientRect().width || 160);
    const amount = cardWidth + gap;

    if (dir === "left") desiredRef.current -= amount;
    else desiredRef.current += amount;

    scroller.scrollBy({
      left: dir === "left" ? -amount : amount,
      behavior: "smooth",
    });
  };

  return (
    <section className="prp-clients-root">
      <div className="prp-clients-container">
        <h2 className="prp-clients-title">OUR CLIENTS</h2>

        <div className="prp-clients-carousel">
          <button
            className="prp-clients-arrow prp-clients-arrow-left"
            onClick={() => scrollByCard("left")}
          >
            ❮
          </button>

          <div className="prp-clients-scroller">
            <ul className="prp-clients-track" ref={trackRef}>
              {logosDup.map((src, i) => (
                <li className="prp-clients-card" key={`logo-${i}`}>
                  <figure className="prp-clients-logo">
                    <img
                      src={src}
                      alt={`client-${i}`}
                      className="prp-clients-img"
                    />
                  </figure>
                </li>
              ))}
            </ul>
          </div>

          <button
            className="prp-clients-arrow prp-clients-arrow-right"
            onClick={() => scrollByCard("right")}
          >
            ❯
          </button>
        </div>
      </div>
    </section>
  );
};

export default OurClients;
