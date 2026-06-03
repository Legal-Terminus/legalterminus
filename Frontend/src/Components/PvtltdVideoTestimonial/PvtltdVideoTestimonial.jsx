import React, { useRef, useState, useEffect } from "react";
import "./PvtltdVideoTestimonial.css";

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
  // add more items as needed
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
    <div ref={iframeRef} className="vt-video-aspect">
      {isVisible ? (
        <iframe
          className="vt-video"
          src={src}
          title={title}
          frameBorder="0"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
          allowFullScreen
        ></iframe>
      ) : (
        <div style={{ width: "100%", paddingBottom: "56.25%", backgroundColor: "#f0f0f0" }} />
      )}
    </div>
  );
};

const VideoTestimonials = () => {
  const sliderRef = useRef(null);

  const handleScroll = (direction) => {
    const container = sliderRef.current;
    if (!container) return;

    const card = container.querySelector(".vt-card");
    if (!card) return;

    const gap = 24; // must match CSS .vt-slider gap
    const cardWidth = card.offsetWidth + gap;

    container.scrollBy({
      left: direction === "next" ? cardWidth : -cardWidth,
      behavior: "smooth",
    });
  };

  return (
    <section className="vt-section">
      <div className="vt-container">
        <h2 className="vt-heading">Video Testimonials</h2>
        <p className="vt-subtitle">
          Hear directly from our clients about their experience working with us.
        </p>

        <div className="vt-slider-wrapper">
          {/* Left arrow */}
          <button
            className="vt-side-arrow vt-left"
            aria-label="Previous video"
            onClick={() => handleScroll("prev")}
          >
            ❮
          </button>

          {/* Cards slider */}
          <div className="vt-slider" ref={sliderRef}>
            {videoTestimonials.map((item, idx) => (
              <article className="vt-card" key={idx}>
                <div className="vt-video-wrap">
                  <LazyIframe src={item.videoUrl} title={item.name} />
                </div>

                <h3 className="vt-name">{item.name}</h3>
                <p className="vt-role">{item.role}</p>
              </article>
            ))}
          </div>

          {/* Right arrow */}
          <button
            className="vt-side-arrow vt-right"
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

export default VideoTestimonials;
