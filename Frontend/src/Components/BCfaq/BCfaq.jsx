import React, { useState } from "react";
import "./BCfaq.css";

const faqs = [
  {
    question: "What is Bar Code Registration in India?",
    answer: "Bar Code Registration in India is the process of obtaining unique GS1 barcodes (GTINs) for your products through GS1 India. These barcodes help identify your products globally and are commonly required for selling on Amazon, Flipkart, supermarkets, retail stores, and export markets. In India, only GS1 India is authorized to issue genuine GS1 barcodes.",
  },
  {
    question: "Who needs a GS1 barcode?",
    answer: "Any business selling physical products through retail stores, supermarkets, e-commerce platforms, distributors, or exports should obtain GS1 barcodes. This includes manufacturers, FMCG brands, cosmetics companies, apparel brands, food businesses, electronics sellers, pharmaceutical companies, and D2C brands. Service businesses generally do not require barcodes.",
  },
  {
    question: "Is GS1 India a government organization?",
    answer: "GS1 India is not a government department, but it is the officially authorized organization for barcode issuance in India. It was established by the Ministry of Commerce & Industry along with major industry bodies such as CII, FICCI, ASSOCHAM, and FIEO. All genuine barcode registrations in India are issued only through GS1 India.",
  },
  {
    question: "Why are GS1 barcodes important for online selling?",
    answer: "Most e-commerce platforms and retail chains require genuine GS1 barcodes to verify product authenticity. Without valid barcodes, products may face listing rejection, catalogue issues, or delisting from platforms like Amazon, Flipkart, BigBasket, Blinkit, and modern retail stores.",
  },
  {
    question: "How many barcodes do I need?",
    answer: "You need one unique barcode for every product variation. Different sizes, colours, flavours, pack quantities, or variants all require separate GTINs. For example, one T-shirt available in 5 sizes and 4 colours will require 20 separate barcodes.",
  },
  {
    question: "How long does Bar Code Registration take?",
    answer: "Usually, GS1 barcode registration takes around 7–10 working days after successful document submission and fee payment. DataKart onboarding or advanced barcode setup may take a few additional days depending on the scope.",
  },
  {
    question: "What is included in your service?",
    answer: "Our service includes barcode requirement analysis, GS1 India application filing, document preparation, portal coordination, barcode pack selection guidance, query handling, and complete support until your GS1 Company Prefix (GCP) and GTIN range are issued. Enriched and Supreme plans also include DataKart onboarding and MSME reimbursement support.",
  },
  {
    question: "What is the MSME barcode reimbursement scheme?",
    answer: "Micro manufacturing enterprises having valid Udyam Registration may claim up to 80% reimbursement of eligible GS1 India fees under the MSME support scheme, subject to government conditions and limits. We assist eligible clients with the reimbursement filing process.",
  },
  {
    question: "What is DataKart and why is it important?",
    answer: "DataKart is GS1 India's official product data platform where product details, images, and barcode information are uploaded. Many retailers and e-commerce platforms prefer or require DataKart-linked products for smoother product listing and catalogue verification.",
  },
  {
    question: "Can I buy cheap barcodes from third-party websites?",
    answer: "It is strongly recommended to avoid unofficial barcode sellers. Many low-cost barcodes sold online are not issued by GS1 India and may fail during retailer or marketplace verification. Genuine GS1 barcodes help avoid future listing, scanning, and export problems.",
  },
  {
    question: "Can I use the same barcode for multiple products?",
    answer: "No. Each unique product or product variant must have its own barcode. Using the same barcode for multiple products can create inventory, billing, and retailer compliance issues.",
  },
  {
    question: "Do barcodes expire?",
    answer: "GS1 barcode membership is generally issued for a selected subscription period and must remain active with GS1 India. Renewal requirements depend on the chosen plan and current GS1 India policy.",
  },
  {
    question: "Can I generate barcode images myself?",
    answer: "Yes. Once your GTINs are issued, barcode images can be generated using compatible barcode software or through your packaging designer / printer. We also guide clients regarding barcode size, placement, and printing standards.",
  },
  {
    question: "What additional services are useful after Bar Code Registration?",
    answer: "Many businesses also require Trademark Registration, GST Registration, FSSAI License, Import Export Code (IEC), MSME/Udyam Registration, Amazon Brand Registry, and Packaging Compliance support along with barcode registration. We can help you with these services under a single workflow.",
  },
  {
    question: "How can Legal Terminus help me with Bar Code Registration?",
    answer: "Legal Terminus provides complete support for genuine GS1 India barcode registration. We help businesses choose the correct barcode package, file applications on the official GS1 India portal, coordinate documentation, assist with MSME reimbursement eligibility, and support DataKart onboarding for smooth retail and e-commerce operations. Our goal is to make the entire process simple, accurate, and hassle-free for your business.",
  },
];

const BCFaq = () => {
  const [activeIndex, setActiveIndex] = useState(0);

  const toggleFaq = (index) => {
    setActiveIndex((prev) => (prev === index ? -1 : index));
  };

  return (
    <section className="opcfaq-section">
      <div className="opcfaq-container">

        <div className="opcfaq-header">
          <h2 className="opcfaq-title">Bar Code Registration — FAQs</h2>
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
                  <div className="opcfaq-answer-content">{item.answer}</div>
                </div>
              </div>
            );
          })}
        </div>

      </div>
    </section>
  );
};

export default BCFaq;
