import React, { useState } from "react";
import "./AddFAQ.css";

const faqs = [
  {
    question: "What are the types of Directors in a Company?",
    answer:(
    <div>
      <p><strong>The following are the types of Director in Company:</strong></p>
      <ul>
        <li>1. Managing Director- A “Managing Director” means a director who is legally entrusted with substantial powers of management of affairs of the company.</li>
        <li>2. Whole-time Director or Executive Director- An Executive Director or whole-time Director is a director who is in full-time employment of the company.</li>
        <li>3. rdinary Director- An “Ordinary Director” means a simple Director who is neither a whole-time Directorn or a Managing Director.</li>
        <li>4. Additional Director- An Additional Director is appointed by the Board of Directors between two annual general meetings. Additional Directors shall hold office only up to the date of the next annual general meeting of the Company. Appointment of Additional Directors and their number/ strength is determined by the Articles of Association.</li>
        <li>5. Alternate Director- An Alternate Director is generally appointed by the Board of Directors during the absence of an “original director” for a period of not less than three months. Generally, alternate Directors are appointed for a person who is Non-Resident Indian (NRI) or for foreign collaborators of a company.</li>
        <li>6. Professional Director- Any Director possessing professional qualifications and do not have any pecuniary interest in the company are called Professional Directors. In large companies, Professionals are sometimes appointment to the Board to utilize their expertise in the management of the Company.</li>
        <li>7. Nominee Director- Banks and Private Equity investors who grant debt or equity assistance to a company generally impose a condition as to appointment of their representative on the Board of the concerned Company. These nominated persons are called as nominee Director.</li>
         <p>In a One Person Company (OPC), a nominee Director is someone nominated by the sole Director of the One Person Company to take over affairs of the OPC in case of death or incapacitation of sole Director.</p>
      </ul>
    </div>
  ),
},
  {
    question: "What are the minimum number of Directors in a Company?",
    answer:(
    <div>
      <ul>
        <li>Public Company - 3 directors</li>
        <li>Private Company - 2 directors</li>
        <li>One Person Company - 1 director</li>
      </ul>
    </div>
  ),
},
  {
    question: "What are the Key/ basic documents required for Addition/ Removal of Directors in a Company?",
    answer:(
    <div>
      <ul>
        <li>1. DIN</li>
        <li>2. One Passport size photograph</li>
        <li>3. Self-attested PAN card</li>
        <li>4. Proof of Residence (Aadhar Card/ Voter ID/ Passport/ Driving License)</li>
        <li>5. Digital Signature Certificate</li>
      </ul>
    </div>
  ),
},
  {
    question:
      "What is the Process for addition or removal of directors?",
    answer:(
    <div>
      <p><strong>Day 1</strong></p>
      <ul>
        <li>1. Discussion on requirements(say, addition/ change in directors)</li>
        <li>2. Collation of information and relevant documents</li>
        <li>3. Preparation and execution of application for DSC (for director to be appointed)</li>
      </ul>
      <p><strong>Day 2 - 4</strong></p>
      <ul>
        <li>1. Drafting necessary resolutions and documents</li>
        <li>2. Coordination for appropriate execution of documents</li>
        <li>3. Obtaining DSC</li>
      </ul>
      <p><strong>Day 5 - 7</strong></p>
      <ul>
        <li>1. Preparation and filing online application(s) with appropriate government fees</li>
        <li>2. Sharing updated master data from MCA with the client</li>
      </ul>
    </div>
  ),
},
  {
    question: "What points should be considered before changing directors in a Company?",
    answer:
      "While carrying any change in the constitution of board, the company must obtain the necessary consent from its Board by passing the appropriate resolution. Further, care must be taken that the number of directors does not fall below the statutory limit after removal or resignation.",
  },
  {
    question:
      "What should one do if number of director(s) in the company is less than 2/3?",
    answer:
      "If the total number of directors is less than the number prescribed, the company shall appoint a director(s) in the company to fulfil the requirement within 6 months from removal/resignation/death of the concerned director.",
  },
  {
    question:
      "Can a Director resign from the company?",
    answer:
      "Yes, a director can voluntarily resign. For this purpose, advance notice of resignation must be served upon the company, stating reason(s) of resignation, and necessary compliance must be made with the MCA thereafter.",
  },
  {
    question:
      "Can a Director obtain multiple DINs?",
    answer:
      "No, a director cannot obtain a multiple DINs and obtaining multiple DINs is a punishable offence as per law.",
  },
  {
    question:
      "Whether director needs to subscribe shares for his appointment?",
    answer:
      "There is no requirement to subscribe the shares by the director. However, if the Articles (AoA) of the company prescribe for any such subscription, it must be fulfilled as a condition for his appointment. ",
  },
  {
    question:
      "Can a Body Corporate be appointed as director in the company?",
    answer:
      "Only an individual can act as a director in the company. Hence, if any LLP or Company is willing to be added as a director in the company, only its representative/ nominee may act as the director.",
  },
  {
    question:
      "Whether NRIs/ Foreign Nationals are qualified for appointment of director in Private Company?",
    answer:
      "Yes. However, at least one Director on the Board of Directors must be an Indian Resident any time after company incorporation.",
  },
  {
    question:
      "How can the Board remove a Director from a company?",
    answer:
      "In order to remove a director, the Board should serve serving special notice for conducting a meeting of members and obtain their consent. The exiting director must be given an opportunity to represent his/ her grounds. ",
  },
  {
    question:
      "Do I need to sale/transfer my shares while ending my tenure as director in a company?",
    answer:
      "No, even after the end of the tenure as director, a person can hold the shares in the company. However, if the shares in the company are subscribed as a condition to appointment as provided by AoA, the shares are also required to be disposed of in the manner provided in AoA",
  },
  {
    question:
      "How Legal Terminus can help you add or remove a director?",
    answer:
      "Legal Terminus can help you add or remove a director in a hassle-free manner and within a reasonable time frame and a competitive professional fees. To know more please book a call with one of our consultants for free.",
  },
];

const AddFAQ= () => {
  const [activeIndex, setActiveIndex] = useState(0);

  const toggleFaq = (index) => {
    setActiveIndex((prev) => (prev === index ? -1 : index));
  };

  return (
    <section className="Add-section">
      <div className="Add-container">
        {/* Left side – static text */}
        <div className="Add-left">
          <h2 className="Add-title">Add Or Remove A Director (Company) FAQ's</h2>

          <p className="Add-intro">
            Here, we’ve answered the most common questions about adding or removing a director covering documents, steps, and what happens after registration. These FAQs will help you understand everything clearly and move ahead with confidence.
          </p>

          <p className="Add-intro">
            
          </p>
        </div>

        {/* Right side – scrollable Q&A list */}
        <div className="Add-right">
          <div className="Add-list">
            {faqs.map((item, index) => {
              const isActive = index === activeIndex;
              return (
                <div
                  key={index}
                  className={`Add-item ${isActive ? "active" : ""}`}
                >
                  <button
                    type="button"
                    className="Add-question"
                    onClick={() => toggleFaq(index)}
                  >
                    <span>{item.question}</span>
                    <span className={`Add-icon ${isActive ? "open" : ""}`}>
                      ▾
                    </span>
                  </button>
                  {isActive && (
                   <div className={`Add-answer ${isActive ? "open" : ""}`}>
                    <p>{item.answer}</p>
                  </div>

                  )}
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
};

export default AddFAQ;
