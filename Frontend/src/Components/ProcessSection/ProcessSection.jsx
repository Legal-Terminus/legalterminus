import React, { useState, useEffect, useCallback } from "react";
import "./ProcessSection.css";
import processBg from "../../assets/bg-banner.webp"; // update to your image

import { FaPlay, FaCheck, FaTimes } from "react-icons/fa";
import { REAL_PROCESS_VIDEO_READY } from "../../utils/videoTestimonials";

const steps = [
  "We Do Our Research.",
  "We Meet Our Client.",
  "We Create Ideas.",
  "We Revise or Make Changes.",
  "We Execute the Work."
];

const ProcessSection = ({ videoSrc = "https://www.youtube.com/embed/dQw4w9WgXcQ" }) => {
  const [open, setOpen] = useState(false);

  const handleKey = useCallback((e) => {
    if (e.key === "Escape") setOpen(false);
  }, []);

  useEffect(() => {
    if (open) {
      document.addEventListener("keydown", handleKey);
      document.body.style.overflow = "hidden";
    } else {
      document.removeEventListener("keydown", handleKey);
      document.body.style.overflow = "";
    }

    return () => {
      document.removeEventListener("keydown", handleKey);
      document.body.style.overflow = "";
    };
  }, [open, handleKey]);

  return (
    <section className="ProcessSection-root" aria-labelledby="process-title">
      <div className="ProcessSection-wrap">
        <div className="ProcessSection-headingWrap">
          <p className="ProcessSection-preTitle">
            A business consulting company that constitutes faith.
          </p>
          <h2 id="process-title" className="ProcessSection-title">
            Who we are
          </h2>
        </div>

        <div className="ProcessSection-hero" role="region" aria-label="Watch our process">
          <div
            className="ProcessSection-bg"
            style={{ backgroundImage: `url('${processBg}')` }}
            aria-hidden="true"
          />

          <div className="ProcessSection-overlay" aria-hidden="true" />

          {/* LEFT: card with steps */}
          <div className="ProcessSection-leftCard" role="article" aria-label="Process steps">
            <h3 className="ProcessSection-cardTitle">Watch our process</h3>

            <ul className="ProcessSection-steps" aria-live="polite">
              {steps.map((s, i) => (
                <li
                  key={i}
                  className="ProcessSection-step"
                  style={{ animationDelay: `${i * 90}ms` }}
                >
                  <span className="ProcessSection-stepIcon" aria-hidden="true">
                    <FaCheck />
                  </span>
                  <span className="ProcessSection-stepText">{s}</span>
                </li>
              ))}
            </ul>

            {/* No real video yet — the play buttons are hidden (utils/videoTestimonials). */}
            {REAL_PROCESS_VIDEO_READY && (
              <div className="ProcessSection-cardActions">
                <button
                  className="ProcessSection-cta"
                  onClick={() => setOpen(true)}
                  aria-haspopup="dialog"
                  aria-expanded={open}
                >
                  <FaPlay className="ProcessSection-ctaIcon" />
                  <span className="ProcessSection-ctaText">Watch Video</span>
                </button>
              </div>
            )}
          </div>

          {/* RIGHT: centered play button */}
          {REAL_PROCESS_VIDEO_READY && (
            <div className="ProcessSection-rightArea" aria-hidden="true">
              <button
                className="ProcessSection-play"
                aria-label="Play process video"
                onClick={() => setOpen(true)}
              >
                <span className="ProcessSection-playInner">
                  <FaPlay />
                </span>
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Modal (lazy iframe mount) */}
      {REAL_PROCESS_VIDEO_READY && open && (
        <div className="ProcessSection-modal" role="dialog" aria-modal="true" aria-label="Process video dialog">
          <div className="ProcessSection-modalBackdrop" onClick={() => setOpen(false)} />
          <div className="ProcessSection-modalInner" role="document">
            <button className="ProcessSection-modalClose" onClick={() => setOpen(false)} aria-label="Close video">
              <FaTimes />
            </button>

            <div className="ProcessSection-videoWrap">
              <iframe
                title="Process Video"
                src={videoSrc}
                frameBorder="0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              />
            </div>
          </div>
        </div>
      )}
    </section>
  );
};

export default ProcessSection;
