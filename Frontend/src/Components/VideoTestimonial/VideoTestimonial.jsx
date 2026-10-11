import React from "react";
import "./VideoTestimonial.css";
import { REAL_VIDEOS_READY } from "../../utils/videoTestimonials";

const VideoTestimonial = () => {
  // Replace the src IDs below with the actual YouTube video ids you want to show.
  const videos = [
    "dQw4w9WgXcQ",
    "3JZ_D3ELwOQ"
  ];

  // Placeholder videos only — hidden until real ones exist (see utils/videoTestimonials).
  if (!REAL_VIDEOS_READY) return null;

  return (
    <section className="vt-root" aria-labelledby="vt-title">
      <div className="vt-inner">
        <h2 id="vt-title" className="vt-title">Video Testimonial</h2>

        <div className="vt-grid" role="list">
          {videos.map((id, idx) => (
            <article className="vt-card" role="listitem" key={id + idx}>
              <div className="vt-embed">
                <iframe
                  className="vt-iframe"
                  src={`https://www.youtube.com/embed/${id}`}
                  title={`Video testimonial ${idx + 1}`}
                  frameBorder="0"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                  loading="lazy"
                />
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
};

export default VideoTestimonial;
