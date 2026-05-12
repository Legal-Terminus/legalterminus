import React, { useRef, useEffect } from "react";
import "./TrustOurClients.css";


import { clientLogos } from "../../assets/clientLogos.js";




const TrustOurClients = () => {
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
    const card = track.querySelector(".trustest-our-clients-card");
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
    <section className="trustest-our-clients-root">
      <div className="trustest-our-clients-container">
        <h2 className="trustest-our-clients-title">OUR CLIENTS</h2>

        <div className="trustest-our-clients-carousel">
          <button
            className="trustest-our-clients-arrow trustest-our-clients-arrow-left"
            onClick={() => scrollByCard("left")}
          >
            ❮
          </button>

          <div className="trustest-our-clients-scroller">
            <ul
              className="trustest-our-clients-track"
              ref={trackRef}
            >
              {logosDup.map((src, i) => (
                <li
                  className="trustest-our-clients-card"
                  key={`logo-${i}`}
                >
                  <figure className="trustest-our-clients-logo">
                    <img
                      src={src}
                      alt={`client-${i}`}
                      className="trustest-our-clients-img"
                    />
                  </figure>
                </li>
              ))}
            </ul>
          </div>

          <button
            className="trustest-our-clients-arrow trustest-our-clients-arrow-right"
            onClick={() => scrollByCard("right")}
          >
            ❯
          </button>
        </div>
      </div>
    </section>
  );
};

export default TrustOurClients;
