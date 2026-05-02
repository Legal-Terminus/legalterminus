import React, { useRef, useEffect } from "react";
import "./PritoPublicOurcilnts.css";

/* imports unchanged */
import { clientLogos } from "../../assets/clientLogos.js";

const OurClients = () => {
  const logos = [
    client1, client2, client3, client4, client5, client6, client7, client8, client9, client10,
    client11, client12, client13, client14, client15, client16, client17, client18, client19, client20,
    client21, client22, client23, client24, client25, client26, client27, client28, client29, client30,
    client31, client32, client33, client34, client35, client36, client37, client38, client39, client40,
    client41, client42, client43, client44, client45, client46, client47, client48, client49, client50,
    client51, client52, client53, client54, client55, client56, client57, client58, client59, client60,
    client61, client62, client63, client64, client65, client66, client67, client68, client69, client70,
    client71, client72, client73, client74, client75, client76, client77, client78, client79, client80,
    client81, client82, client83, client84, client85, client86, client87, client88, client89, client90,
    client91, client92, client93, client94, client95, client96, client97, client98, client99, client100,
    client101, client102, client103, client104, client105, client106, client107, client108, client109, client110,
    client111, client112, client113, client114, client115, client116, client117, client118, client119
  ]
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
