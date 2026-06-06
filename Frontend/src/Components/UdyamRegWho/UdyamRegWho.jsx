import React from "react";
import "./UdyamRegWho.css";

const whoNeedsList = [
  {
    title: "Startups & New Businesses",
    desc: "Need a current bank account for your business or want to register for GST? Udyam Registration is often a basic requirement and helps establish your business identity.",
  },
  {
    title: "MSMEs Eyeing Government Tenders",
    desc: "Want to bid for government projects? Udyam Certification is a must to qualify and compete effectively in public procurement.",
  },
  {
    title: "Manufacturers & Traders",
    desc: "Udyam status helps you access schemes, subsidies, and compliance benefits, while also protecting your payments under the 45-day delayed payment rule.",
  },
  {
    title: "Service Providers & Freelancers",
    desc: "If you're offering design, marketing, IT, or consultancy services, Udyam recognition boosts your legitimacy and enables easier access to government support.",
  },
  {
    title: "Loan Seekers & Finance Applicants",
    desc: "Planning to apply under schemes like PMEGP or Mudra Loan? Udyam Registration helps you qualify for subsidized interest rates and easy approvals.",
  },
  {
    title: "IP & Trademark Owners",
    desc: "MSMEs can claim up to 50% waiver on trademark registration fees, helping protect your brand affordably.",
  },
  {
    title: "Business Owners Needing Ratings",
    desc: "Udyam Registered firms benefit from credit rating fee reductions and lower government deposit requirements.",
  },
  {
    title: "Exhibitors & Exporters",
    desc: "Want to participate in government-backed exhibitions or apply for export incentives? Udyam simplifies qualification and access.",
  },
];

const UdyamRegWho = () => {
  return (
    <section className="opc-features-section">
      <div className="opc-features-container">
        <h2 className="opc-features-title">Who Needs Udyam (MSME) Registration Certificate?</h2>
        <div className="opc-features-cards">
          {whoNeedsList.map((item, index) => (
            <div className="opc-features-card" key={index}>
              <div className="opc-features-number">{String(index + 1).padStart(2, "0")}</div>
              <h3 className="opc-features-card-title">{item.title}</h3>
              <p className="opc-features-card-text">{item.desc}</p>
            </div>
          ))}
        </div>
        <p className="udyam-who-footer">
          In short, any business planning to work with the government, apply for MSME schemes, or seek business loans should consider Udyam MSME registration.
        </p>
      </div>
    </section>
  );
};

export default UdyamRegWho;
