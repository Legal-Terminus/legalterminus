import React, { useRef, useEffect } from "react";
import './OurClients.css'

import { clientLogos } from "../../assets/clientLogos.js";

const OurClients = () => {
  // only 10 logos
  const logos = clientLogos;

  // duplicate for smooth infinite scrolling
  const logosDup = [...logos, ...logos];

  const trackRef = useRef(null);
  const rafRef = useRef(null);
  const lastRef = useRef(null);
  const desiredRef = useRef(0);
  const pausedRef = useRef(false);
  const resumeTimerRef = useRef(null);

  // tuned speed for gentle scroll
  const SPEED = 120; // px per second
  const SMOOTHING = 0.12;

  useEffect(() => {
    const track = trackRef.current;
    if (!track) return;
    const scroller = track.parentElement;

    scroller.style.overflowX = "auto";
    scroller.style.scrollBehavior = "auto";
    scroller.scrollLeft = 0;
    desiredRef.current = 0;

    const loop = (t) => {
      if (pausedRef.current) {
        lastRef.current = t;
        rafRef.current = requestAnimationFrame(loop);
        return;
      }

      if (lastRef.current == null) lastRef.current = t;
      const dt = (t - lastRef.current) / 1000;
      lastRef.current = t;

      desiredRef.current += SPEED * dt;

      const half = track.scrollWidth / 2 || 1;
      if (desiredRef.current >= half) desiredRef.current -= half;

      const current = scroller.scrollLeft;
      const diff = desiredRef.current - current;
      const step = diff * SMOOTHING;

      scroller.scrollLeft = current + step;

      if (Math.abs(diff) < 0.5) scroller.scrollLeft = desiredRef.current;

      rafRef.current = requestAnimationFrame(loop);
    };

    rafRef.current = requestAnimationFrame(loop);

    return () => {
      cancelAnimationFrame(rafRef.current);
      clearTimeout(resumeTimerRef.current);
    };
  }, [SPEED, SMOOTHING]);

  const pauseAuto = (ms = 1200) => {
    pausedRef.current = true;
    clearTimeout(resumeTimerRef.current);
    if (ms !== Infinity) {
      resumeTimerRef.current = setTimeout(() => {
        const track = trackRef.current;
        if (track && track.parentElement) {
          desiredRef.current = track.parentElement.scrollLeft;
        }
        pausedRef.current = false;
      }, ms);
    }
  };

  useEffect(() => {
    const scroller = trackRef.current?.parentElement;
    if (!scroller) return;
    const onEnter = () => pauseAuto(Infinity);
    const onLeave = () => { pausedRef.current = false; lastRef.current = null; desiredRef.current = scroller.scrollLeft; };
    scroller.addEventListener("mouseenter", onEnter);
    scroller.addEventListener("mouseleave", onLeave);
    scroller.addEventListener("touchstart", onEnter, { passive: true });
    scroller.addEventListener("touchend", onLeave);

    return () => {
      scroller.removeEventListener("mouseenter", onEnter);
      scroller.removeEventListener("mouseleave", onLeave);
      scroller.removeEventListener("touchstart", onEnter);
      scroller.removeEventListener("touchend", onLeave);
    };
  }, []);

  const scrollByCard = (dir) => {
    const track = trackRef.current;
    if (!track) return;
    const scroller = track.parentElement;
    const card = track.querySelector(".ourclients-card");
    const gap = parseInt(getComputedStyle(track).gap || "24", 10) || 24;
    const cardWidth = card ? Math.round(card.getBoundingClientRect().width) : 160;
    const amount = cardWidth + gap;

    pauseAuto(900);

    if (dir === "left") desiredRef.current = Math.max(0, desiredRef.current - amount);
    else desiredRef.current = desiredRef.current + amount;

    const half = track.scrollWidth / 2 || 1;
    if (desiredRef.current >= half) desiredRef.current -= half;
    if (desiredRef.current < 0) desiredRef.current += half;

    scroller.scrollBy({ left: dir === "left" ? -amount : amount, behavior: "smooth" });

    setTimeout(() => {
      if (scroller.scrollLeft >= half) scroller.scrollLeft -= half;
      if (scroller.scrollLeft < 0) scroller.scrollLeft += half;
      desiredRef.current = scroller.scrollLeft;
    }, 500);
  };

  useEffect(() => {
    const onKey = (e) => {
      if (e.key === "ArrowLeft") { e.preventDefault(); scrollByCard("left"); }
      if (e.key === "ArrowRight") { e.preventDefault(); scrollByCard("right"); }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    if (mq.matches) pausedRef.current = true;
    const onChange = () => { pausedRef.current = mq.matches; };
    mq.addEventListener?.("change", onChange);
    return () => mq.removeEventListener?.("change", onChange);
  }, []);

  return (
    <section className="ourclients-root" aria-label="Our clients">
      <div className="ourclients-inner">
        <h2 className="ourclients-title">OUR CLIENTS</h2>

        <div className="ourclients-carousel" role="region" aria-roledescription="carousel" aria-label="Client logos carousel">
          <button className="ourclients-arrow ourclients-arrow-left" onClick={() => scrollByCard("left")} aria-label="Previous clients">
            <svg width="18" height="18" viewBox="0 0 24 24"><path d="M15 18L9 12L15 6" stroke="#fff" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/></svg>
          </button>

          <div className="ourclients-scroller" aria-hidden="false">
            <ul className="ourclients-track" ref={trackRef}>
              {logosDup.map((src, i) => (
                <li className="ourclients-card" key={i} aria-hidden={i >= logos.length ? "true" : "false"}>
                  <figure className="ourclients-logo">
                    <img src={src} alt={`client-${(i % logos.length) + 1}`} className="ourclients-logo-img" />
                  </figure>
                </li>
              ))}
            </ul>
          </div>

          <button className="ourclients-arrow ourclients-arrow-right" onClick={() => scrollByCard("right")} aria-label="Next clients">
            <svg width="18" height="18" viewBox="0 0 24 24"><path d="M9 6L15 12L9 18" stroke="#fff" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/></svg>
          </button>
        </div>
      </div>
    </section>
  );
};

export default OurClients;
