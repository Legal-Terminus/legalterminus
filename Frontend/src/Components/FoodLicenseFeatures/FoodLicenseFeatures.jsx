import React from "react";
import "./FoodLicenseFeatures.css";

const types = [
  {
    number: "01",
    title: "Petty Retailer of Snacks / Tea Shops",
    text: "Temporary or fixed stall or food premise involved in preparation, storage, distribution and sale of food products that can be served as snacks / tea / coffee and similar variants. Lightest documentation — ID + address proof + photograph + activity declaration. Government fee ₹100/year. Validity 1–5 years (renewable). Form A on FoSCoS.",
  },
  {
    number: "02",
    title: "Hawker (Itinerant / Mobile Food Vendor)",
    text: "Selling packaged or freshly prepared food by travelling (usually on foot or movable carts) from one location to other. Same Form A + ₹100/year + lightest documentation set as tea / snack stall. Both these categories share the Elemental plan because their documentation + premises-evidence asks are minimal.",
  },
  {
    number: "03",
    title: "Other Basic FBOs (T/O up to ₹1.5 Cr)",
    text: "All OTHER Basic Registration cases — home-based bakers / pickle makers / chocolate makers, small kirana food sellers, tiffin / lunch services, small caterers, small food trucks, small manufacturers, small storage operators. Form A on FoSCoS + ₹100/year + more product / premises documentation than the Elemental subset.",
  },
  {
    number: "04",
    title: "Restaurants + Mid-Size Caterers (State Licence)",
    text: "Restaurants, dhabas, clubs, mid-size caterers, cloud kitchens (single-state). T/O ₹1.5 Cr to ₹50 Cr. Government fee typically ₹2,000/year. Premises blueprint + water test report required. Most popular category for food-service businesses operating in a single state.",
  },
  {
    number: "05",
    title: "Manufacturers / Storage / Distribution (State Licence)",
    text: "Food manufacturing units in the ₹1.5 Cr to ₹50 Cr turnover band. Production thresholds apply per category (up to 2 MT/day for general manufacturers; up to 50,000 LPD for milk; up to 150 KG/day for meat). Government fee ₹3,000–₹5,000/year depending on scale. Also: cold / non-cold storage, wholesalers, distributors, retailers, marketers, transporters in this slab.",
  },
  {
    number: "06",
    title: "Importers / Exporters (Central Licence)",
    text: "Any FBO involved in import or export of food products needs Central License IRRESPECTIVE OF TURNOVER. IEC linkage mandatory. Government fee ₹7,500/year. Full FSMP + HACCP plan + recall plan required.",
  },
  {
    number: "07",
    title: "E-Commerce + Multi-State Operators (Central Licence)",
    text: "FBOs selling food via online platforms (own website, Swiggy / Zomato / Amazon Food / cloud kitchen aggregators) need Central License irrespective of turnover — per FSSAI Order 2017. Same for FBOs with operations in MORE THAN 1 STATE (head office takes Central). The 14-digit license must be displayed on the platform listing.",
  },
  {
    number: "08",
    title: "5-Star Hotels + Ports / Airports / Railways (Central Licence)",
    text: "5-star hotels, operators at seaports / airports / railway stations, Central Government / Railways / Defence caterers — all need Central License irrespective of turnover. License Modification / Renewal / Surrender across all four tiers is filed as an amendment on FoSCoS — same portal, separate workflow.",
  },
];

const FoodLicenseFeatures = () => {
  return (
    <section className="opc-features-section">
      <div className="opc-features-container">

        <h2 className="opc-features-title">Types of Food License Registration in India</h2>

        <div className="opc-features-cards">
          {types.map((type) => (
            <div className="opc-features-card" key={type.number}>
              <div className="opc-features-number">{type.number}</div>
              <h3 className="opc-features-card-title">{type.title}</h3>
              <p className="opc-features-card-text">{type.text}</p>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
};

export default FoodLicenseFeatures;
