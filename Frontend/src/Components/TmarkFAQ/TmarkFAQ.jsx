import React, { useState } from "react";
import "./TmarkFAQ.css";

const faqs = [
  {
    question: "Can I use the ™ symbol before registration?",
    answer:
      "Yes. You can use the ™ symbol immediately after filing your trademark application or even while claiming ownership of a brand. It indicates that you are claiming rights over the mark. However, the ® symbol can only be used after the trademark is officially registered by the Trade Marks Registry.",
  },
  {
    question: "What is the difference between ™ and ®?",
    answer:
      "™ means Temporary Mark — the mark is being claimed as a trademark, whether registered or not.\n® means Registered Mark — the trademark is officially registered under the Trade Marks Act, 1999 and enjoys statutory protection. Using ® without registration is illegal and may attract penalties.",
  },
  {
    question: "Can I trademark my business name, logo, and tagline separately?",
    answer:
      "Yes. Your business name, logo, tagline, product name, and even packaging style can be protected separately under trademark law. Many businesses file separate applications for:\n• Brand Name (Wordmark)\n• Logo Device\n• Tagline / Slogan\n• Product Names\n\nSeparate filings provide stronger and wider legal protection.",
  },
  {
    question: "Does trademark registration give protection across all India?",
    answer:
      "Yes. A registered trademark in India gives nationwide protection across all States and Union Territories, irrespective of where your business is currently operating.",
  },
  {
    question: "Can two companies have the same trademark?",
    answer:
      "Sometimes yes — but only if they operate in completely different classes or industries and there is no likelihood of consumer confusion. For example, identical names may coexist if one is in clothing and another is in software, subject to registry approval.",
  },
  {
    question: "Can an individual apply for a trademark before starting a company?",
    answer:
      "Yes. An individual can file a trademark application in their personal name even before incorporating a company or LLP. This is common for startups and founders who want to secure the brand early.",
  },
  {
    question: "What is a trademark class?",
    answer:
      "Trademark classes are categories of goods and services defined under the NICE Classification system. India follows a 45-class system:\n• Classes 1–34 = Goods\n• Class 35 = Trading\n• Classes 36–45 = Services\n\nChoosing the correct class is important because trademark protection is granted only for the class(es) filed.",
  },
  {
    question: "Can I sell on Amazon, Flipkart, or Meesho without a trademark?",
    answer:
      "Yes, but many marketplaces provide additional brand-protection tools only to trademark owners. Registered trademarks also help prevent listing hijacking, fake sellers, and brand-copying on e-commerce platforms.",
  },
  {
    question: "Can my trademark application be rejected?",
    answer:
      "Yes. Common reasons include:\n• Similar existing trademarks\n• Descriptive or generic names\n• Incorrect class selection\n• Weak distinctiveness\n• Incomplete documents\n\nA proper trademark search and correct filing strategy significantly improve approval chances.",
  },
  {
    question: "Can I transfer or sell my trademark in future?",
    answer:
      "Yes. A registered trademark is an intellectual property asset and can be:\n• Assigned / Sold\n• Licensed\n• Franchised\n• Used as a business asset during investment or acquisition\n\nThis makes trademarks commercially valuable beyond legal protection.",
  },
  {
    question: "Is trademark registration mandatory in India?",
    answer:
      "No, trademark registration is not legally mandatory. However, without registration, enforcing brand rights becomes much more difficult and expensive. Registration gives stronger legal protection and exclusive statutory rights.",
  },
  {
    question: "How long is a trademark valid in India?",
    answer:
      "A registered trademark is valid for 10 years from the application date and can be renewed indefinitely every 10 years by paying renewal fees.",
  },
  {
    question: "Can foreigners or foreign companies apply for trademarks in India?",
    answer:
      "Yes. Foreign individuals, companies, and international businesses can apply for trademark registration in India, either directly or through authorised trademark agents.",
  },
  {
    question: "Why should I file a trademark early?",
    answer:
      "Trademark rights in India are strongly linked to PRIORITY and PRIOR USE. Filing early helps:\n• Prevent others from registering similar names\n• Secure your brand identity\n• Avoid future legal disputes\n• Build long-term brand value\n\nDelaying filing increases the risk of conflict with similar marks.",
  },
  {
    question: "Can I apply for multiple trademarks for the same business?",
    answer:
      "Yes. Many businesses file separate trademarks for their company name, product lines, logos, slogans, mobile apps, and sub-brands to create stronger brand protection.",
  },
  {
    question: "What is a trademark search and why is it important?",
    answer:
      "A trademark search helps identify existing similar or identical trademarks before filing. It reduces the chances of objections, legal disputes, and rejection of the application.",
  },
  {
    question: "Can I file a trademark for a domain name?",
    answer:
      "Yes. If your domain name is being used as a brand identity and is distinctive in nature, it can also be protected through trademark registration.",
  },
  {
    question: "What is a logo trademark?",
    answer:
      "A logo trademark protects the visual design, symbol, artwork, or graphical identity of a business or brand. It is commonly called a 'Device Mark'.",
  },
  {
    question: "Can I change my logo after trademark registration?",
    answer:
      "Minor design changes may be acceptable, but substantial logo changes usually require a fresh trademark application for proper legal protection.",
  },
  {
    question: "Can startups apply for trademark registration in India?",
    answer:
      "Yes. Startups can apply for trademarks from the very beginning of their business journey. Early registration helps secure the brand before expansion or fundraising.",
  },
  {
    question: "Is trademark registration useful for social media creators and influencers?",
    answer:
      "Absolutely. Influencers, YouTubers, podcasters, and digital creators often trademark their channel names, brand names, or merchandise brands to protect their online identity.",
  },
  {
    question: "What is a trademark objection?",
    answer:
      "A trademark objection is a query raised by the Trade Marks Registry during examination. It usually relates to similarity, descriptiveness, or legal compliance of the mark.",
  },
  {
    question: "Can I file the same trademark in more than one class?",
    answer:
      "Yes. If your business operates across different categories of goods or services, the same trademark can be filed in multiple classes for wider protection.",
  },
  {
    question: "Does trademark registration increase business value?",
    answer:
      "Yes. A registered trademark becomes an intellectual property asset that adds credibility, brand value, and long-term commercial importance to the business.",
  },
  {
    question: "Can I register a trademark jointly with another person?",
    answer:
      "Yes. Two or more individuals or entities can jointly apply for and own a trademark together.",
  },
  {
    question: "What is trademark infringement?",
    answer:
      "Trademark infringement happens when someone uses a similar or identical mark without permission in a way that may confuse customers or harm the original brand owner.",
  },
  {
    question: "Can I update owner details after trademark filing?",
    answer:
      "Yes. Certain changes such as address update, name correction, or ownership assignment can be recorded with the Trade Marks Registry through prescribed procedures.",
  },
  {
    question: "Can I withdraw my trademark application after filing?",
    answer:
      "Yes. An applicant may withdraw the trademark application voluntarily if required.",
  },
  {
    question: "Can educational institutions, NGOs, and trusts apply for trademarks?",
    answer:
      "Yes. Schools, colleges, NGOs, trusts, societies, and charitable organisations can also register trademarks for their names, logos, programmes, or initiatives.",
  },
  {
    question: "What is the benefit of filing a trademark through professionals?",
    answer:
      "Professional filing helps reduce errors in class selection, documentation, and filing strategy — improving the overall quality and success chances of the application.",
  },
  {
    question: "How can Legal Terminus help with Trademark Application Filing?",
    answer:
      "Legal Terminus provides end-to-end support for Trademark Application Filing — from trademark search and class selection to application filing, objection handling, hearing support, and registration tracking. Our team helps businesses choose the right filing strategy, avoid common filing mistakes, and protect their brand professionally through the official IP India portal (ipindiaonline.gov.in).",
  },
];

const TmarkFAQ = () => {
  const [activeIndex, setActiveIndex] = useState(0);

  const toggleFaq = (index) => {
    setActiveIndex((prev) => (prev === index ? -1 : index));
  };

  return (
    <section className="opcfaq-section">
      <div className="opcfaq-container">

        <div className="opcfaq-header">
          <h2 className="opcfaq-title">Trademark Registration — FAQs</h2>
          <p className="opcfaq-intro">
            Got questions? We've got answers — straight, no-BS, legally accurate.
          </p>
        </div>

        <div className="opcfaq-list">
          {faqs.map((item, index) => {
            const isActive = index === activeIndex;
            return (
              <div
                key={index}
                className={`opcfaq-item ${isActive ? "active" : ""}`}
              >
                <button
                  type="button"
                  className="opcfaq-question"
                  onClick={() => toggleFaq(index)}
                >
                  <span>{item.question}</span>
                  <span className={`opcfaq-icon ${isActive ? "open" : ""}`}>▾</span>
                </button>
                <div className={`opcfaq-answer ${isActive ? "open" : ""}`}>
                  <div className="opcfaq-answer-content" style={{ whiteSpace: "pre-line" }}>{item.answer}</div>
                </div>
              </div>
            );
          })}
        </div>

      </div>
    </section>
  );
};

export default TmarkFAQ;
