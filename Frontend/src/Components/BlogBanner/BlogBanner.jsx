import React from "react";
import "./BlogBanner.css";


const BlogBanner = ({ onNavigate }) => {
  const handleNavigate = (key) => {
    if (typeof onNavigate === "function") onNavigate({ key });
    else {
      if (key === "home") window.location.href = "/";
    }
  };

  return (
    <section className="blogpage-banner" aria-label="Blog banner">
      {/* Inline SVG background (same as before) */}
      <svg
        className="blogpage-banner-svg"
        viewBox="0 0 900 360"
        preserveAspectRatio="xMidYMid slice"
        role="img"
        aria-hidden="true"
      >
        <defs>
          <linearGradient id="bgGrad" x1="0" x2="1" y1="0" y2="1">
            <stop offset="0%" stopColor="#cbeed0" />
            <stop offset="50%" stopColor="#f6f2ef" />
            <stop offset="100%" stopColor="#d9f2dd" />
          </linearGradient>

          <linearGradient id="softGrad" x1="0" x2="1" y1="0" y2="1">
            <stop offset="0%" stopColor="#ffffff" stopOpacity="0.15" />
            <stop offset="100%" stopColor="#ffffff" stopOpacity="0" />
          </linearGradient>

          <filter id="blurMe" x="-50%" y="-50%" width="200%" height="200%">
            <feGaussianBlur stdDeviation="18" />
          </filter>
        </defs>

        <rect width="100%" height="100%" fill="url(#bgGrad)" />
        <rect width="100%" height="100%" fill="url(#softGrad)" opacity="0.6" />

        <g filter="url(#blurMe)" opacity="0.9">
          <circle className="svg-bubble svg-bubble-a" cx="180" cy="90" r="140" fill="#cbeed0" />
          <circle className="svg-bubble svg-bubble-b" cx="520" cy="120" r="100" fill="#45A049" opacity="0.12" />
          <circle className="svg-bubble svg-bubble-c" cx="360" cy="260" r="180" fill="#45A049" opacity="0.08" />
        </g>

        <path
          className="svg-wave"
          d="M0,240 C120,200 240,280 360,260 C480,240 600,300 720,260 C840,220 900,260 900,260 L900,360 L0,360 Z"
          fill="#ffffff"
          opacity="0.06"
        />
      </svg>

      {/* floating blurred bubbles (DOM) */}
      <div className="blogpage-banner-art" aria-hidden="true">
        <span className="blogpage-banner-bubble bubble-1" />
        <span className="blogpage-banner-bubble bubble-2" />
        <span className="blogpage-banner-bubble bubble-3" />
      </div>

      {/* Breadcrumb (functional) */}
      <nav className="blogpage-banner-breadcrumb" aria-label="Breadcrumb">
        <button
          type="button"
          className="blogpage-banner-breadcrumb-item"
          onClick={() => handleNavigate("home")}
        >
          {/* simple house icon (inline SVG) */}
          <svg width="14" height="14" viewBox="0 0 24 24" aria-hidden="true" focusable="false" className="blogpage-bc-icon">
            <path fill="#45A049" d="M12 3l8 7h-3v8h-10v-8H4z" />
          </svg>
          <span className="blogpage-bc-text">Home</span>
        </button>

        <svg className="blogpage-bc-sep" width="14" height="14" viewBox="0 0 24 24" aria-hidden="true" focusable="false">
          <path fill="#6b6f6b" d="M8.59 16.59L13.17 12 8.59 7.41 10 6l6 6-6 6z"/>
        </svg>

        <button
          type="button"
          className="blogpage-banner-breadcrumb-item active"
          onClick={() => handleNavigate("blog")}
        >
          <span className="blogpage-bc-text">Blog &amp; News</span>
        </button>
      </nav>

      {/* Foreground content */}
      <div className="blogpage-banner-content">
        <h1 className="blogpage-banner-heading">Discover Our Articles &amp; News</h1>

        <p className="blogpage-banner-sub">
          Explore well-curated blogs and the latest updates from Legal Terminus.
        </p>
      </div>
    </section>
  );
};

export default BlogBanner;
