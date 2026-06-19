import React, { useState } from "react";
import "./TmrnwFAQ.css";

const faqs = [
  {
    question: "How long is a registered trademark valid in India?",
    answer:
      "A registered trademark in India is valid for 10 years from the date of registration under the Trade Marks Act, 1999. It can be renewed indefinitely for further 10-year periods by filing Form TM-R through the official IP India portal (ipindiaonline.gov.in). There is no limit on the number of renewals, which means your brand can remain protected for decades if renewed on time.",
  },
  {
    question: "Which Trademark Renewal plan is right for me?",
    answer:
      "Elemental (₹1,999) – Suitable for standard trademark renewal where no agent change is required.\nEnriched (₹3,499) – Best if you want to shift your trademark records or authorised agent to Legal Terminus.\nSupreme (₹9,999) – Ideal for businesses looking for complete brand protection support, including trademark watch and monitoring services after renewal.\n\nAll plans include our reminder support for future renewal cycles.",
  },
  {
    question: "What is the Lifelong Reminder Policy?",
    answer:
      "Trademark renewal comes only once every 10 years, and many businesses unintentionally forget the deadline. To avoid this, Legal Terminus maintains a structured reminder system and sends renewal alerts before every future expiry cycle. This helps ensure your trademark remains protected without interruption.",
  },
  {
    question: "What is included in the Trademark Watch service?",
    answer:
      "Our Trademark Watch service helps monitor similar or potentially conflicting trademark applications filed after your renewal. It also includes alerts for similar marks published in the Trademark Journal and basic brand monitoring support for online marketplaces and domains.",
  },
  {
    question: "What if I want to change my trademark agent during renewal?",
    answer:
      "If your previous trademark agent is inactive or you want Legal Terminus to manage your trademark portfolio, we can assist with the change of agent process along with renewal filing. We prepare the required authorisation documents and complete the transition smoothly.",
  },
  {
    question: "When should I renew my trademark?",
    answer:
      "Trademark renewal can be filed before the expiry date of the registration. It is always recommended to renew the trademark well before expiry to avoid additional fees, delays, or restoration procedures.",
  },
  {
    question: "What is the government fee for Trademark Renewal?",
    answer:
      "The government fee for trademark renewal is charged per class and is payable separately from the professional fee. Late renewal or restoration may attract additional government charges.",
  },
  {
    question: "What happens if I miss the trademark renewal deadline?",
    answer:
      "If the renewal deadline is missed, additional late fees may apply. After a certain period, restoration procedures become necessary. If the trademark is not restored within the prescribed timeline, it may be removed from the Trademark Register permanently.",
  },
  {
    question: "Is Trademark Renewal done online or physically?",
    answer:
      "Trademark Renewal is primarily filed online through the official IP India portal, which is the standard and recommended process for faster acknowledgement and tracking.",
  },
  {
    question: "Will my trademark automatically renew after payment?",
    answer:
      "No. Trademark Renewal requires proper filing of Form TM-R and processing by the Trade Marks Registry. Simply making payment without correct filing does not complete the renewal process.",
  },
  {
    question: "Can I renew multiple trademark classes together?",
    answer:
      "Yes. If your trademark is registered in multiple classes, each class can be renewed. Government fees are applicable separately for every class.",
  },
  {
    question: "Can a removed trademark be restored?",
    answer:
      "Yes, in certain cases a removed trademark may be restored by filing the prescribed restoration application within the permitted timeline, subject to approval by the Trade Marks Registry.",
  },
  {
    question: "Will I receive a certificate after Trademark Renewal?",
    answer:
      "Yes. After successful processing, the Trade Marks Registry issues an updated Renewal Certificate confirming the continuation of trademark protection.",
  },
  {
    question: "Why is timely Trademark Renewal important for businesses?",
    answer:
      "A trademark is a long-term business asset. Timely renewal helps maintain exclusive legal rights over the brand name, logo, or slogan and avoids the risk of losing brand protection due to expiry.",
  },
  {
    question: "Can Trademark Renewal be filed by an individual or only by companies?",
    answer:
      "Trademark Renewal can be filed by any registered proprietor, including individuals, startups, companies, LLPs, partnerships, trusts, and NGOs.",
  },
  {
    question: "Does Trademark Renewal protect my brand internationally?",
    answer:
      "No. Indian Trademark Renewal protects the mark only within India. Separate filings or renewals are required for international trademark protection in other countries.",
  },
  {
    question: "Can I update my address or proprietor details during renewal?",
    answer:
      "Yes. Certain changes relating to proprietor details, address, or authorised agent can also be updated during the renewal process, subject to applicable procedures.",
  },
  {
    question: "Do I need to renew a trademark even if I am not actively using it?",
    answer:
      "Yes. If you want to continue retaining legal ownership and future rights over the trademark, renewal should still be completed on time.",
  },
  {
    question: "Can Trademark Renewal increase my brand value?",
    answer:
      "Yes. Continuously renewed trademarks strengthen brand credibility, improve intellectual property value, and support future investment, franchise, licensing, and expansion opportunities.",
  },
  {
    question: "How can Legal Terminus help with Trademark Renewal?",
    answer:
      "Legal Terminus provides end-to-end support for Trademark Renewal, including trademark status verification, Form TM-R filing, Attorney change support, renewal tracking, reminder management, and post-renewal monitoring support through the official IP India portal.",
  },
];

const TmrnwFAQ = () => {
  const [activeIndex, setActiveIndex] = useState(0);

  const toggleFaq = (index) => {
    setActiveIndex((prev) => (prev === index ? -1 : index));
  };

  return (
    <section className="opcfaq-section">
      <div className="opcfaq-container">

        <div className="opcfaq-header">
          <h2 className="opcfaq-title">Trademark Renewal — FAQs</h2>
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

export default TmrnwFAQ;
