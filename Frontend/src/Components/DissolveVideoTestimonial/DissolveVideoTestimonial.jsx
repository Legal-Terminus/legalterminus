import React, { useRef, useState, useEffect } from "react";
import "./DissolveVideoTestimonial.css";

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

/**
 * LazyIframe — Loads iframe only when visible to reduce initial load time
 */
const LazyIframe = ({ src, title }) => {
  const [isVisible, setIsVisible] = useState(false);
  const iframeRef = useRef(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.unobserve(entry.target);
        }
      },
      { rootMargin: "50px" }
    );

    if (iframeRef.current) {
      observer.observe(iframeRef.current);
    }

    return () => {
      if (iframeRef.current) {
        observer.unobserve(iframeRef.current);
      }
    };
  }, []);

  return (
    <div ref={iframeRef} className="Dissolve-video-testimonial-video-aspect">
      {isVisible ? (
        <iframe
          className="Dissolve-video-testimonial-video"
          src={src}
          title={title}
          frameBorder="0"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
          allowFullScreen
        />
      ) : (
        <div style={{ width: "100%", paddingBottom: "56.25%", backgroundColor: "#f0f0f0" }} />
      )}
    </div>
  );
};

const DissolveVideoTestimonial = () => {
  const sliderRef = useRef(null);

  const handleScroll = (direction) => {
    const container = sliderRef.current;
    if (!container) return;

    const card = container.querySelector(
      ".Dissolve-video-testimonial-card"
    );
    if (!card) return;

    const gap = 24;
    const cardWidth = card.offsetWidth + gap;

    container.scrollBy({
      left: direction === "next" ? cardWidth : -cardWidth,
      behavior: "smooth",
    });
  };

  return (
    <section className="Dissolve-video-testimonial-section">
      <div className="Dissolve-video-testimonial-container">
        <h2 className="Dissolve-video-testimonial-heading">
          Video Testimonials
        </h2>

        <p className="Dissolve-video-testimonial-subtitle">
          Hear directly from our clients about their experience working with us.
        </p>

        <div className="Dissolve-video-testimonial-slider-wrapper">
          {/* Left arrow */}
          <button
            className="Dissolve-video-testimonial-arrow Dissolve-video-testimonial-arrow-left"
            aria-label="Previous video"
            onClick={() => handleScroll("prev")}
          >
            ❮
          </button>

          {/* Slider */}
          <div
            className="Dissolve-video-testimonial-slider"
            ref={sliderRef}
          >
            {videoTestimonials.map((item, idx) => (
              <article
                className="Dissolve-video-testimonial-card"
                key={idx}
              >
                <div className="Dissolve-video-testimonial-video-wrap">
                  <LazyIframe src={item.videoUrl} title={item.name} />
                </div>

                <h3 className="Dissolve-video-testimonial-name">
                  {item.name}
                </h3>
                <p className="Dissolve-video-testimonial-role">
                  {item.role}
                </p>
              </article>
            ))}
          </div>

          {/* Right arrow */}
          <button
            className="Dissolve-video-testimonial-arrow Dissolve-video-testimonial-arrow-right"
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

export default DissolveVideoTestimonial;
