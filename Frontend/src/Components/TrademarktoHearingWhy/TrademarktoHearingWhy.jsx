import React, { useRef } from "react";
import "./TrademarktoHearingWhy.css";
import { REAL_VIDEOS_READY } from "../../utils/videoTestimonials";

const videoTestimonials = [
  {
    name: "Kirti Ranjan Sahu",
    role: "Proprietor of Keshab Jewellers",
    videoUrl: "https://www.youtube.com/embed/dQw4w9WgXcQ",
  },
  {
    name: "Gobinda Chandra Mishra",
    role: "Influencer",
    videoUrl: "https://www.youtube.com/embed/ysz5PUM2z2A",
  },
  {
    name: "Babaji Samal",
    role: "MD, AppsSys Technosoft",
    videoUrl: "https://www.youtube.com/embed/jNQXAC9IVRw",
  },
  {
    name: "Pritam Rath",
    role: "Director, Stabdha Utility Insights",
    videoUrl: "https://www.youtube.com/embed/oHg5SJYRHA0",
  },
];

const TradeLicenseWhy = () => {
  const sliderRef = useRef(null);

  const handleScroll = (direction) => {
    const container = sliderRef.current;
    if (!container) return;

    const card = container.querySelector(".thwhy-card");
    if (!card) return;

    const gap = 24;
    const cardWidth = card.offsetWidth + gap;

    container.scrollBy({
      left: direction === "next" ? cardWidth : -cardWidth,
      behavior: "smooth",
    });
  };

  // Placeholder videos only — hidden until real ones exist (see utils/videoTestimonials).
  if (!REAL_VIDEOS_READY) return null;

  return (
    <section className="thwhy-section">
      <div className="thwhy-container">
        <h2 className="thwhy-heading">Why Choose Trade License?</h2>
        <p className="thwhy-subtitle">
          Hear directly from our clients about their experience and the benefits
          of obtaining a Trade License for smoother business operations.
        </p>

        <div className="thwhy-slider-wrapper">
          <button
            className="thwhy-side-arrow thwhy-left"
            aria-label="Previous video"
            onClick={() => handleScroll("prev")}
          >
            ❮
          </button>

          <div className="thwhy-slider" ref={sliderRef}>
            {videoTestimonials.map((item, idx) => (
              <article className="thwhy-card" key={idx}>
                <div className="thwhy-video-wrap">
                  <div className="thwhy-video-aspect">
                    <iframe
                      className="thwhy-video"
                      src={item.videoUrl}
                      title={item.name}
                      frameBorder="0"
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                      allowFullScreen
                    ></iframe>
                  </div>
                </div>

                <h3 className="thwhy-name">{item.name}</h3>
                <p className="thwhy-role">{item.role}</p>
              </article>
            ))}
          </div>

          <button
            className="thwhy-side-arrow thwhy-right"
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

export default TradeLicenseWhy;
