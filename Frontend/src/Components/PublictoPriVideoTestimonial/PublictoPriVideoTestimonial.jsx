import React, { useRef } from "react";
import "../ProFOPCVideoTestimonial/ProFOPCVideoTestimonial.css";

const videoTestimonials = [
  {
    name: "Rajeev Menon",
    role: "Director, Northbridge Industries",
    videoUrl: "https://www.youtube.com/embed/dQw4w9WgXcQ",
  },
  {
    name: "Sunita Agarwal",
    role: "Promoter, Agarwal Steels",
    videoUrl: "https://www.youtube.com/embed/ysz5PUM2z2A",
  },
  {
    name: "Imran Sheikh",
    role: "MD, Crescent Traders",
    videoUrl: "https://www.youtube.com/embed/jNQXAC9IVRw",
  },
  {
    name: "Pooja Reddy",
    role: "Director, Reddy Infra",
    videoUrl: "https://www.youtube.com/embed/oHg5SJYRHA0",
  },
];

const VideoTestimonials = () => {
  const sliderRef = useRef(null);

  const handleScroll = (direction) => {
    const container = sliderRef.current;
    if (!container) return;

    const card = container.querySelector(
      ".profopc-video-testimonial-card"
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
    <section className="profopc-video-testimonial-section">
      <div className="profopc-video-testimonial-container">
        <h2 className="profopc-video-testimonial-heading">
          Video Testimonials
        </h2>
        <p className="profopc-video-testimonial-subtitle">
          Hear directly from our clients about their experience working with us.
        </p>

        <div className="profopc-video-testimonial-slider-wrapper">
          {/* Left arrow */}
          <button
            className="profopc-video-testimonial-arrow profopc-video-testimonial-left"
            aria-label="Previous video"
            onClick={() => handleScroll("prev")}
          >
            ❮
          </button>

          {/* Cards slider */}
          <div
            className="profopc-video-testimonial-slider"
            ref={sliderRef}
          >
            {videoTestimonials.map((item, idx) => (
              <article
                className="profopc-video-testimonial-card"
                key={idx}
              >
                <div className="profopc-video-testimonial-video-wrap">
                  <div className="profopc-video-testimonial-video-aspect">
                    <iframe
                      className="profopc-video-testimonial-video"
                      src={item.videoUrl}
                      title={item.name}
                      frameBorder="0"
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                      allowFullScreen
                    ></iframe>
                  </div>
                </div>

                <h3 className="profopc-video-testimonial-name">
                  {item.name}
                </h3>
                <p className="profopc-video-testimonial-role">
                  {item.role}
                </p>
              </article>
            ))}
          </div>

          {/* Right arrow */}
          <button
            className="profopc-video-testimonial-arrow profopc-video-testimonial-right"
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
