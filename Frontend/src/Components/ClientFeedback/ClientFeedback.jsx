// ClientFeedback.jsx
import React, { useState, useEffect, useRef } from "react";
import "./ClientFeedback.css";
import cf1 from '../../assets/cf1.webp';
import cf2 from '../../assets/cf2.webp';
import cf4 from '../../assets/cf4.webp';
import cf5 from '../../assets/cf5.webp';
import cf6 from '../../assets/cf6.webp';


const TESTIMONIALS = [
  { id: "fannie-sanders", text: "Lorem ipsum dolor sit amet, consectetur adipiscing elit.", name: "Fannie Sanders", role: "Entrepreneur", img: cf1 },
  { id: "paddy-hardy", text: "Sed do eiusmod tempor incididunt ut labore et dolore magna.", name: "Paddy Hardy", role: "Entrepreneur", img: cf2 },
  { id: "hari-wheatley", text: "Consectetur adipiscing elit, sed do eiusmod tempor incididunt.", name: "Hari Wheatley", role: "Manager", img: cf4 },
  { id: "clara-benson", text: "Lorem ipsum dolor sit amet, consectetur adipiscing elit.", name: "Clara Benson", role: "Founder", img: cf5 },
  { id: "julian-cooper", text: "Sed do eiusmod tempor incididunt ut labore.", name: "Julian Cooper", role: "CEO", img: cf6 },
  { id: "naomi-flynn", text: "Dolore magna aliqua sed do tempor.", name: "Naomi Flynn", role: "Designer", img: cf2 },
];

const ClientFeedback = () => {
  const testimonials = TESTIMONIALS;

  // create clones for infinite effect — prefix with clone group so keys are unique
  const infinite = [
    ...testimonials.map((t) => ({ ...t, _key: `a-${t.id}` })),
    ...testimonials.map((t) => ({ ...t, _key: `b-${t.id}` })),
    ...testimonials.map((t) => ({ ...t, _key: `c-${t.id}` })),
  ];
  const START = testimonials.length; // start index in the middle clone
  const VISIBLE = 3;

  const [index, setIndex] = useState(START);
  const [isPaused, setIsPaused] = useState(false);

  const trackRef = useRef(null);
  const slideWidthRef = useRef(0);
  const intervalRef = useRef(null);
  const resizeTimerRef = useRef(null);
  const TRANS_MS = 600; // must match CSS transition duration

  // next: move by one
  const next = () => setIndex((i) => i + 1);

  // measure card width + gap (in px)
  const measure = () => {
    const track = trackRef.current;
    if (!track) return;
    const firstCard = track.querySelector(".cf-card");
    if (!firstCard) return;
    const cardRect = firstCard.getBoundingClientRect();
    const cs = getComputedStyle(track);
    // gap may be 'gap' or columnGap depending on browser
    const gap = parseFloat(cs.gap || cs.columnGap || "0");
    slideWidthRef.current = Math.round(cardRect.width + gap);
    // set initial transform according to current index
    const shiftPx = (index - START) * slideWidthRef.current;
    track.style.setProperty("--txpx", `${-shiftPx}px`);
  };

  // autoplay (keeps running infinitely)
  useEffect(() => {
    if (isPaused) return;
    intervalRef.current = setInterval(() => {
      next();
    }, 2400);
    return () => clearInterval(intervalRef.current);
  }, [isPaused]);

  // update transform when index changes
  useEffect(() => {
    const track = trackRef.current;
    if (!track) return;

    // ensure measurement exists
    if (!slideWidthRef.current) {
      measure();
      if (!slideWidthRef.current) return;
    }

    const shiftPx = (index - START) * slideWidthRef.current;
    // apply transform in pixels for exact movement
    track.style.setProperty("--txpx", `${-shiftPx}px`);
  }, [index, START]);

  // set up transitionend listener to snap instantly when reaching clones
  useEffect(() => {
    const track = trackRef.current;
    if (!track) return;

    let isSnapping = false;

    const onTransitionEnd = () => {
      // if currently snapping, ignore
      if (isSnapping) return;

      // if we've moved into the right cloned region, snap to middle (START)
      if (index >= testimonials.length * 2) {
        isSnapping = true;
        // turn off transition, snap transform and state, then re-enable transition
        track.classList.add("no-transition");
        // compute the transform for START
        const shiftPx = (START - START) * slideWidthRef.current; // 0
        track.style.setProperty("--txpx", `${-shiftPx}px`);

        // update state without visual jump (transition off)
        // use setTimeout to ensure this runs after we've set transform
        setTimeout(() => {
          setIndex(START);
          // next animation frame re-enable transition
          requestAnimationFrame(() => {
            track.classList.remove("no-transition");
            isSnapping = false;
          });
        }, 20);
      }

      // left clone (unlikely with only next autoplay, but handle anyway)
      if (index <= 0) {
        isSnapping = true;
        track.classList.add("no-transition");
        const shiftPx = (START - START) * slideWidthRef.current;
        track.style.setProperty("--txpx", `${-shiftPx}px`);
        setTimeout(() => {
          setIndex(START);
          requestAnimationFrame(() => {
            track.classList.remove("no-transition");
            isSnapping = false;
          });
        }, 20);
      }
    };

    track.addEventListener("transitionend", onTransitionEnd);
    return () => track.removeEventListener("transitionend", onTransitionEnd);
  }, [index, START, testimonials.length]);

  // measure on mount and on resize (keeps sliding accurate across sizes)
  useEffect(() => {
    measure();
    const onResize = () => {
      clearTimeout(resizeTimerRef.current);
      resizeTimerRef.current = setTimeout(measure, 90);
    };
    window.addEventListener("resize", onResize, { passive: true });
    return () => {
      window.removeEventListener("resize", onResize);
      clearTimeout(resizeTimerRef.current);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // dots navigation
  const goTo = (i) => setIndex(START + i);

  return (
    <div
      className="cf-section"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
    >
      <div className="cf-overlay" />

      <div className="cf-content">
        <p className="cf-subtitle">Clients Feedback</p>
        <h2 className="cf-title">We Always Take Care Of Clients Seriously</h2>
        <p className="cf-desc">
          Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod
          tempor incididunt ut labore et dolore magna aliqua.
        </p>

        <div className="cf-slider">
          <div className="cf-slider-viewport">
            <div className="cf-slider-track" ref={trackRef}>
              {infinite.map((item) => (
                <div className="cf-card" key={item._key}>
                  <div className="cf-card-inner">
                    <div className="cf-quote-mark">“</div>
                    <p className="cf-text">{item.text}</p>

                    <div className="cf-user">
                      <img src={item.img} alt={`${item.name} avatar`} />
                      <div>
                        <h4 className="cf-name">{item.name}</h4>
                        <p className="cf-role">{item.role}</p>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="cf-dots">
          {testimonials.map((t, i) => (
            <button
              key={t.id}
              className={`cf-dot ${index % testimonials.length === i ? "active" : ""}`}
              onClick={() => goTo(i)}
              aria-label={`Go to slide ${i + 1}`}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default ClientFeedback;
