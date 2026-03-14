import React, { useRef, useEffect } from "react";
import "./AddOurclints.css";

import client1 from "../../assets/our (1).webp";
import client2 from "../../assets/our (2).webp";
import client3 from "../../assets/our (3).webp";
import client4 from "../../assets/our (4).webp";
import client5 from "../../assets/our (5).webp";
import client6 from "../../assets/our (6).webp";
import client7 from "../../assets/our (7).webp";
import client8 from "../../assets/our (8).webp";
import client9 from "../../assets/our (9).webp";
import client10 from "../../assets/our (10).webp";
import client11 from "../../assets/our (11).webp";
import client12 from "../../assets/our (12).webp";
import client13 from "../../assets/our (13).webp";
import client14 from "../../assets/our (14).webp";
import client15 from "../../assets/our (15).webp";
import client16 from "../../assets/our (16).webp";
import client17 from "../../assets/our (17).webp";
import client18 from "../../assets/our (18).webp";
import client19 from "../../assets/our (19).webp";
import client20 from "../../assets/our (20).webp";
import client21 from "../../assets/our (21).webp";
import client22 from "../../assets/our (22).webp";
import client23 from "../../assets/our (23).webp";
import client24 from "../../assets/our (24).webp";
import client25 from "../../assets/our (25).webp";
import client26 from "../../assets/our (26).webp";
import client27 from "../../assets/our (27).webp";
import client28 from "../../assets/our (28).webp";
import client29 from "../../assets/our (29).webp";
import client30 from "../../assets/our (30).webp";
import client31 from "../../assets/our (31).webp";
import client32 from "../../assets/our (32).webp";
import client33 from "../../assets/our (33).webp";
import client34 from "../../assets/our (34).webp";
import client35 from "../../assets/our (35).webp";
import client36 from "../../assets/our (36).webp";
import client37 from "../../assets/our (37).webp";
import client38 from "../../assets/our (38).webp";
import client39 from "../../assets/our (39).webp";
import client40 from "../../assets/our (40).webp";
import client41 from "../../assets/our (41).webp";
import client42 from "../../assets/our (42).webp";
import client43 from "../../assets/our (43).webp";
import client44 from "../../assets/our (44).webp";
import client45 from "../../assets/our (45).webp";
import client46 from "../../assets/our (46).webp";
import client47 from "../../assets/our (47).webp";
import client48 from "../../assets/our (48).webp";
import client49 from "../../assets/our (49).webp";
import client50 from "../../assets/our (50).webp";
import client51 from "../../assets/our (51).webp";
import client52 from "../../assets/our (52).webp";
import client53 from "../../assets/our (53).webp";
import client54 from "../../assets/our (54).webp";
import client55 from "../../assets/our (55).webp";
import client56 from "../../assets/our (56).webp";
import client57 from "../../assets/our (57).webp";
import client58 from "../../assets/our (58).webp";
import client59 from "../../assets/our (59).webp";
import client60 from "../../assets/our (60).webp";
import client61 from "../../assets/our (61).webp";
import client62 from "../../assets/our (62).webp";
import client63 from "../../assets/our (63).webp";
import client64 from "../../assets/our (64).webp";
import client65 from "../../assets/our (65).webp";
import client66 from "../../assets/our (66).webp";
import client67 from "../../assets/our (67).webp";
import client68 from "../../assets/our (68).webp";
import client69 from "../../assets/our (69).webp";
import client70 from "../../assets/our (70).webp";
import client71 from "../../assets/our (71).webp";
import client72 from "../../assets/our (72).webp";
import client73 from "../../assets/our (73).webp";
import client74 from "../../assets/our (74).webp";
import client75 from "../../assets/our (75).webp";
import client76 from "../../assets/our (76).webp";
import client77 from "../../assets/our (77).webp";
import client78 from "../../assets/our (78).webp";
import client79 from "../../assets/our (79).webp";
import client80 from "../../assets/our (80).webp";
import client81 from "../../assets/our (81).webp";
import client82 from "../../assets/our (82).webp";
import client83 from "../../assets/our (83).webp";
import client84 from "../../assets/our (84).webp";
import client85 from "../../assets/our (85).webp";
import client86 from "../../assets/our (86).webp";
import client87 from "../../assets/our (87).webp";
import client88 from "../../assets/our (88).webp";
import client89 from "../../assets/our (89).webp";
import client90 from "../../assets/our (90).webp";
import client91 from "../../assets/our (91).webp";
import client92 from "../../assets/our (92).webp";
import client93 from "../../assets/our (93).webp";
import client94 from "../../assets/our (94).webp";
import client95 from "../../assets/our (95).webp";
import client96 from "../../assets/our (96).webp";
import client97 from "../../assets/our (97).webp";
import client98 from "../../assets/our (98).webp";
import client99 from "../../assets/our (99).webp";
import client100 from "../../assets/our (100).webp";
import client101 from "../../assets/our (101).webp";
import client102 from "../../assets/our (102).webp";
import client103 from "../../assets/our (103).webp";
import client104 from "../../assets/our (104).webp";
import client105 from "../../assets/our (105).webp";
import client106 from "../../assets/our (106).webp";
import client107 from "../../assets/our (107).webp";
import client108 from "../../assets/our (108).webp";
import client109 from "../../assets/our (109).webp";
import client110 from "../../assets/our (110).webp";
import client111 from "../../assets/our (111).webp";
import client112 from "../../assets/our (112).webp";
import client113 from "../../assets/our (113).webp";
import client114 from "../../assets/our (114).webp";
import client115 from "../../assets/our (115).webp";
import client116 from "../../assets/our (116).webp";
import client117 from "../../assets/our (117).webp";
import client118 from "../../assets/our (118).webp";
import client119 from "../../assets/our (119).webp";

const AddOurclints = () => {
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
    const card = track.querySelector(".Add-Process-clients-card");
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
    <section className="Add-Process-clients-root">
      <div className="Add-Process-clients-container">
        <h2 className="Add-Process-clients-title">OUR CLIENTS</h2>

        <div className="Add-Process-clients-carousel">
          <button className="Add-Process-clients-arrow Add-Process-clients-arrow-left"
            onClick={() => scrollByCard("left")}
          >
            <svg width="18" height="18" viewBox="0 0 24 24">
              <path d="M15 18L9 12L15 6" stroke="#fff" strokeWidth="2.5"
                strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </button>

          <div className="Add-Process-clients-scroller">
            <ul className="Add-Process-clients-track" ref={trackRef}>
              {logosDup.map((src, i) => (
                <li className="Add-Process-clients-card" key={i}>
                  <figure className="Add-Process-clients-logo">
                    <img src={src} alt={`client-${i}`} className="Add-Process-clients-img" />
                  </figure>
                </li>
              ))}
            </ul>
          </div>

          <button className="Add-Process-clients-arrow Add-Process-clients-arrow-right"
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

export default AddOurclints;
