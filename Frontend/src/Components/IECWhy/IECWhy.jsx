import React, { useRef } from "react";
import "./IECWhy.css";
import { REAL_VIDEOS_READY } from "../../utils/videoTestimonials";

const videoTestimonials = [
  {
    name: "Rohit Mehta",
    role: "Importer, Global Trade Exports",
    videoUrl: "https://www.youtube.com/embed/dQw4w9WgXcQ",
  },
  {
    name: "Priya Desai",
    role: "Founder, CraftNest Exports",
    videoUrl: "https://www.youtube.com/embed/ysz5PUM2z2A",
  },
  {
    name: "Ankit Sharma",
    role: "Director, A2 International",
    videoUrl: "https://www.youtube.com/embed/jNQXAC9IVRw",
  },
  {
    name: "Simran Kaur",
    role: "Entrepreneur",
    videoUrl: "https://www.youtube.com/embed/oHg5SJYRHA0",
  },
];

const IECWhy = () => {
  const sliderRef = useRef(null);

  const handleScroll = (direction) => {
    const container = sliderRef.current;
    if (!container) return;

    const card = container.querySelector(".iecwhy-card");
    if (!card) return;

    const gap = 24; // matches CSS gap
    const cardWidth = card.offsetWidth + gap;

    container.scrollBy({
      left: direction === "next" ? cardWidth : -cardWidth,
      behavior: "smooth",
    });
  };

  // Placeholder videos only — hidden until real ones exist (see utils/videoTestimonials).
  if (!REAL_VIDEOS_READY) return null;

  return (
    <section className="iecwhy-section">
      <div className="iecwhy-container">
        <h2 className="iecwhy-heading">Why Choose Import Export Code (IEC)?</h2>
        <p className="iecwhy-subtitle">
          Hear directly from our clients about their experience and the benefits
          of obtaining an Import Export Code (IEC) for expanding their business globally.
        </p>

        <div className="iecwhy-slider-wrapper">
          {/* Left arrow */}
          <button
            className="iecwhy-side-arrow iecwhy-left"
            aria-label="Previous video"
            onClick={() => handleScroll("prev")}
          >
            ❮
          </button>

          {/* Cards slider */}
          <div className="iecwhy-slider" ref={sliderRef}>
            {videoTestimonials.map((item, idx) => (
              <article className="iecwhy-card" key={idx}>
                <div className="iecwhy-video-wrap">
                  <div className="iecwhy-video-aspect">
                    <iframe
                      className="iecwhy-video"
                      src={item.videoUrl}
                      title={item.name}
                      frameBorder="0"
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                      allowFullScreen
                    ></iframe>
                  </div>
                </div>

                <h3 className="iecwhy-name">{item.name}</h3>
                <p className="iecwhy-role">{item.role}</p>
              </article>
            ))}
          </div>

          {/* Right arrow */}
          <button
            className="iecwhy-side-arrow iecwhy-right"
            aria-label="Next video"
            onClick={() => handleScroll("next")}
          >
            ❯
          </button>
        </div>
      </div>
    </section>
  );
};

export default IECWhy;
