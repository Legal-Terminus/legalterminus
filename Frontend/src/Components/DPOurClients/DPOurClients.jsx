import React, { useRef, useEffect } from "react";
import "./DPOurClients.css";


import { clientLogos } from "../../assets/clientLogos.js";


/* ---- assets imports stay SAME ---- */

const DPOurClients = () => {
  const logos = [
    client1, client2, client3, client4, client5, client6, client7, client8,
    client9, client10, client11, client12, client13, client14, client15,
    client16, client17, client18, client19, client20,
    /* ...rest unchanged */
    client119,
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
    const card = track.querySelector(".DP-our-clients-card");
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
    <section className="DP-our-clients-root">
      <div className="DP-our-clients-container">
        <h2 className="DP-our-clients-title">OUR CLIENTS</h2>

        <div className="DP-our-clients-carousel">
          <button
            className="DP-our-clients-arrow DP-our-clients-arrow-left"
            onClick={() => scrollByCard("left")}
          >
            ❮
          </button>

          <div className="DP-our-clients-scroller">
            <ul
              className="DP-our-clients-track"
              ref={trackRef}
            >
              {logosDup.map((src, i) => (
                <li
                  className="DP-our-clients-card"
                  key={`logo-${i}`}
                >
                  <figure className="DP-our-clients-logo">
                    <img
                      src={src}
                      alt={`client-${i}`}
                      className="DP-our-clients-img"
                    />
                  </figure>
                </li>
              ))}
            </ul>
          </div>

          <button
            className="DP-our-clients-arrow DP-our-clients-arrow-right"
            onClick={() => scrollByCard("right")}
          >
            ❯
          </button>
        </div>
      </div>
    </section>
  );
};

export default DPOurClients;
