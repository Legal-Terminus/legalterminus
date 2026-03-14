import React, { useRef } from "react";
import "./WindupPLCVideoTestimonial.css";

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

const WindupPLCVideoTestimonial = () => {
  const sliderRef = useRef(null);

  const handleScroll = (direction) => {
    const container = sliderRef.current;
    if (!container) return;

    const card = container.querySelector(".Windup-PLC-vt--card");
    if (!card) return;

    const gap = 24; // must match CSS .Windup-PLC-vt--slider gap
    const cardWidth = card.offsetWidth + gap;

    container.scrollBy({
      left: direction === "next" ? cardWidth : -cardWidth,
      behavior: "smooth",
    });
  };

  return (
    <section className="Windup-PLC-vt--section">
      <div className="Windup-PLC-vt--container">
        <h2 className="Windup-PLC-vt--heading">Video Testimonials</h2>
        <p className="Windup-PLC-vt--subtitle">
          Hear directly from our clients about their experience working with us.
        </p>

        <div className="Windup-PLC-vt--slider-wrapper">
          {/* Left arrow */}
          <button
            className="Windup-PLC-vt--side-arrow Windup-PLC-vt--left"
            aria-label="Previous video"
            onClick={() => handleScroll("prev")}
          >
            ❮
          </button>

          {/* Cards slider */}
          <div className="Windup-PLC-vt--slider" ref={sliderRef}>
            {videoTestimonials.map((item, idx) => (
              <article className="Windup-PLC-vt--card" key={idx}>
                <div className="Windup-PLC-vt--video-wrap">
                  <div className="Windup-PLC-vt--video-aspect">
                    <iframe
                      className="Windup-PLC-vt--video"
                      src={item.videoUrl}
                      title={item.name}
                      frameBorder="0"
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                      allowFullScreen
                    ></iframe>
                  </div>
                </div>

                <h3 className="Windup-PLC-vt--name">{item.name}</h3>
                <p className="Windup-PLC-vt--role">{item.role}</p>
              </article>
            ))}
          </div>

          {/* Right arrow */}
          <button
            className="Windup-PLC-vt--side-arrow Windup-PLC-vt--right"
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

export default WindupPLCVideoTestimonial;
