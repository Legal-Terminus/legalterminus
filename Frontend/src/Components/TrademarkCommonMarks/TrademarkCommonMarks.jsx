import React from "react";
import "./TrademarkCommonMarks.css";

/* Original, generic sample logo used purely to illustrate a "logo" mark */
const SampleLogo = ({ size = 92 }) => (
  <svg viewBox="0 0 64 64" width={size} height={size} aria-hidden="true">
    <rect x="4" y="4" width="56" height="56" rx="16" fill="#FC8019" />
    <path
      d="M22 44V20h11c5.2 0 8.6 2.9 8.6 7.4 0 3.2-1.8 5.4-4.7 6.3l5.4 10.3h-6l-4.7-9.4H27.6V44H22Zm5.6-13.6h4.8c2.4 0 3.8-1.2 3.8-3.2s-1.4-3.1-3.8-3.1h-4.8v6.3Z"
      fill="#ffffff"
    />
  </svg>
);

const MARKS = [
  {
    title: "Word Mark",
    sub: "(also known as brand name)",
    example: <div className="tmcm-word">BRANDLY</div>,
    desc: "A Word Mark is a unique name for your product or service. Registering it gives you ownership of the word in plain text.",
  },
  {
    title: "Logo",
    sub: "(also known as design and device mark)",
    example: <SampleLogo size={96} />,
    desc: "A Logo refers to a unique visual symbol, artwork, or design that represents your brand.",
  },
  {
    title: "Composite Mark",
    sub: "(Word + Logo)",
    example: (
      <div className="tmcm-composite">
        <SampleLogo size={82} />
        <span className="tmcm-composite-word">BRANDLY</span>
      </div>
    ),
    desc: "A Composite Mark combines both a brand name and a logo. It includes the text (word mark) along with a unique symbol or design.",
  },
];

const TrademarkCommonMarks = () => {
  return (
    <section className="tmcm-section">
      <div className="tmcm-container">
        <h2 className="tmcm-heading">Most Commonly Filed Trademarks</h2>

        <div className="tmcm-grid">
          {MARKS.map((m) => (
            <div className="tmcm-card" key={m.title}>
              <div className="tmcm-head">
                <h3 className="tmcm-title">{m.title}</h3>
                <p className="tmcm-sub">{m.sub}</p>
              </div>

              <div className="tmcm-example">{m.example}</div>

              <p className="tmcm-desc">{m.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default TrademarkCommonMarks;
