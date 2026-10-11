import React, { useRef } from "react";
import "./DissolveLLPVideoTestimonial.css";
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

const DissolveLLPVideoTestimonial = () => {
  const sliderRef = useRef(null);

  const handleScroll = (direction) => {
    const container = sliderRef.current;
    if (!container) return;

    const card = container.querySelector(
      ".Dissllp-video-testimonial-card"
    );
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
    <section className="Dissllp-video-testimonial-section">
      <div className="Dissllp-video-testimonial-container">
        <h2 className="Dissllp-video-testimonial-heading">
          Video Testimonials
        </h2>

        <p className="Dissllp-video-testimonial-subtitle">
          Hear directly from our clients about their experience working with us.
        </p>

        <div className="Dissllp-video-testimonial-slider-wrapper">
          {/* Left arrow */}
          <button
            className="Dissllp-video-testimonial-arrow Dissllp-video-testimonial-arrow-left"
            aria-label="Previous video"
            onClick={() => handleScroll("prev")}
          >
            ❮
          </button>

          {/* Slider */}
          <div
            className="Dissllp-video-testimonial-slider"
            ref={sliderRef}
          >
            {videoTestimonials.map((item, idx) => (
              <article
                className="Dissllp-video-testimonial-card"
                key={idx}
              >
                <div className="Dissllp-video-testimonial-video-wrap">
                  <div className="Dissllp-video-testimonial-video-aspect">
                    <iframe
                      className="Dissllp-video-testimonial-video"
                      src={item.videoUrl}
                      title={item.name}
                      frameBorder="0"
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                      allowFullScreen
                    />
                  </div>
                </div>

                <h3 className="Dissllp-video-testimonial-name">
                  {item.name}
                </h3>
                <p className="Dissllp-video-testimonial-role">
                  {item.role}
                </p>
              </article>
            ))}
          </div>

          {/* Right arrow */}
          <button
            className="Dissllp-video-testimonial-arrow Dissllp-video-testimonial-arrow-right"
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

export default DissolveLLPVideoTestimonial;
