import React from "react";
import "./TrademarkSymbols.css";

/* Original, generic brand emblem + magnifier showing the TM / R symbol */
const SymbolMark = ({ color, symbol }) => (
  <svg viewBox="0 0 150 140" width="160" height="150" aria-hidden="true">
    <circle cx="60" cy="56" r="44" fill={color} />
    <g transform="translate(36,32) scale(2)">
      <path
        d="M12 2l2.9 6.9 7.5.6-5.7 4.9 1.8 7.3L12 17.8 5.5 21.7l1.8-7.3L1.6 9.5l7.5-.6z"
        fill="#ffffff"
      />
    </g>
    <line x1="106" y1="100" x2="130" y2="128" stroke="#374151" strokeWidth="8" strokeLinecap="round" />
    <circle cx="101" cy="95" r="22" fill="#ffffff" stroke={color} strokeWidth="3.5" />
    <text
      x="101"
      y="101"
      textAnchor="middle"
      fontSize="15"
      fontWeight="800"
      fill={color}
      fontFamily="Poppins, sans-serif"
    >
      {symbol}
    </text>
  </svg>
);

const SYMBOLS = [
  {
    graphic: <SymbolMark color="#1f9d4a" symbol="TM" />,
    title: "TM Symbol (™)",
    desc: "The TM symbol shows that a brand is claimed by its owner, even if the trademark is not officially registered yet. It offers some level of protection, especially in case of brand disputes or misuse.",
  },
  {
    graphic: <SymbolMark color="#f0a500" symbol="®" />,
    title: "R Symbol (®)",
    desc: "The R symbol means the trademark is officially registered with the authorities. It gives full legal protection and ensures only the owner can use the brand for specific goods or services.",
  },
];

const TrademarkSymbols = () => {
  return (
    <section className="tmsym-section">
      <div className="tmsym-container">
        <h2 className="tmsym-heading">Types of Trademark Symbols</h2>

        <div className="tmsym-grid">
          {SYMBOLS.map((s) => (
            <div className="tmsym-card" key={s.title}>
              <div className="tmsym-graphic">{s.graphic}</div>
              <h3 className="tmsym-title">{s.title}</h3>
              <p className="tmsym-desc">{s.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default TrademarkSymbols;
