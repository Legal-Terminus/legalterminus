import React from "react";
import "./TradeLicenseFeatures.css";

const types = [
  {
    number: "01",
    title: "General Trade License",
    text:
      "For shops, retail outlets, showrooms, service offices, agencies, brokers, consultancies, and other general commercial activities not falling in special categories. The most common ask — typically the lowest fee bracket and lightest inspection routine.",
  },
  {
    number: "02",
    title: "Food Establishment License",
    text:
      "Restaurants, dhabas, cloud kitchens, bakeries, sweet shops, juice bars, cafes, tea stalls, food trucks, caterers, and any premises preparing / serving food. Often requires concurrent FSSAI Food License + Fire NOC + Health Officer inspection. Higher fee bracket; mandatory premises inspection.",
  },
  {
    number: "03",
    title: "Industrial / Manufacturing License",
    text:
      "Factories, workshops, processing units, assembly lines, micro / small / medium manufacturing units. Requires concurrent Pollution Control Board NOC, sometimes Factories Act licensing (units above scale thresholds). Inspection by Industrial Officer + Pollution Officer.",
  },
  {
    number: "04",
    title: "Hazardous / Storage License",
    text:
      "Petrol pumps, gas / cylinder storage, chemical storage, paint / solvent storage, fireworks, timber yards, scrap dealers. Requires concurrent Fire NOC + Explosives Department NOC (where applicable) + Pollution NOC. Highest fee bracket; multi-agency inspection.",
  },
  {
    number: "05",
    title: "Hospitality / Lodging License",
    text:
      "Hotels, lodges, guest houses, service apartments, bed & breakfast establishments, banquet halls. Requires concurrent Fire NOC + Health Officer inspection + (for food service) FSSAI Food License + (for liquor service) Excise license.",
  },
  {
    number: "06",
    title: "Health & Wellness License",
    text:
      "Hospitals, nursing homes, clinics, diagnostic centres, pathology labs, dental clinics, fitness centres, gymnasiums, spa / massage parlours. Requires concurrent Clinical Establishments Act registration + Biomedical Waste Authorisation (medical premises). Inspection by Municipal Health Officer.",
  },
  {
    number: "07",
    title: "Entertainment / Public Place License",
    text:
      "Cinema halls, multiplexes, video parlours, gaming arcades, cyber cafes, amusement parks, banquet halls, marriage gardens, event venues. Requires concurrent Fire NOC + Police NOC (some categories) + Entertainment Tax registration (some states).",
  },
  {
    number: "08",
    title: "Renewal / Amendment / Surrender Filings",
    text:
      "Existing licensees needing: annual renewal, address change, trade-category change, partner / proprietor change, premises area change, or voluntary surrender. Same Corporation portal, separate workflow. Late renewal recovery handled in Enriched / Supreme tiers.",
  },
];

const TradeLicenseFeatures = () => {
  return (
    <section className="trade-features-section">
      <div className="trade-features-container">

        <h2 className="trade-features-title">
          Types of Trade License Registration in India
        </h2>

        <div className="trade-features-cards">
          {types.map((type) => (
            <div className="trade-features-card" key={type.number}>
              <div className="trade-features-number">{type.number}</div>
              <h3 className="trade-features-card-title">{type.title}</h3>
              <p className="trade-features-card-text">{type.text}</p>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
};

export default TradeLicenseFeatures;
