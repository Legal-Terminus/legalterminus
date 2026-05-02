import React, { useRef, useEffect } from "react";
import "./TrademarktoOppositionOurClients.css";

import { clientLogos } from "../../assets/clientLogos.js";

const TradeLicenseOurClients = () => {
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
    const card = track.querySelector(".tlcoc-card");
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
    <section className="tlcoc-root">
      <div className="tlcoc-container">
        <h2 className="tlcoc-title">OUR CLIENTS</h2>

        <div className="tlcoc-carousel">
          <button
            className="tlcoc-arrow tlcoc-arrow-left"
            onClick={() => scrollByCard("left")}
          >
            ❮
          </button>

          <div className="tlcoc-scroller">
            <ul className="tlcoc-track" ref={trackRef}>
              {logosDup.map((src, i) => (
                <li className="tlcoc-card" key={`logo-${i}`}>
                  <figure className="tlcoc-logo">
                    <img src={src} alt={`client-${i}`} className="tlcoc-img" />
                  </figure>
                </li>
              ))}
            </ul>
          </div>

          <button
            className="tlcoc-arrow tlcoc-arrow-right"
            onClick={() => scrollByCard("right")}
          >
            ❯
          </button>
        </div>
      </div>
    </section>
  );
};

export default TradeLicenseOurClients;
