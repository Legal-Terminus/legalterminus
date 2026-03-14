import React from "react";
import "./ReplyOfERBreadcrum.css";

const Breadcrum = () => {
  return (
    <section className="Replyof-ER-public-hero">
      <div className="Replyof-ER-public-container">

        {/* LEFT CONTENT */}
        <div className="Replyof-ER-public-content">

          <span className="Replyof-ER-public-tag">
            Reply Of Examination Report
          </span>

          <h1 className="Replyof-ER-public-title">
            Reply Of Examination Report
          </h1>

          <p className="Replyof-ER-public-description">
            Legal Terminus can help you with filing a reply to examination report trademark for your organization, as and when required, in a hassle-free manner within a reasonable time span and for a competitive professional fee which starts from Rs. 2,999/-.
          </p>

          <div className="Replyof-ER-public-features">
            <div className="Replyof-ER-feature-item"> Expert Drafting of Legal Reply</div>
            <div className="Replyof-ER-feature-item"> Objection Handling Under Trademark Act</div>
            <div className="Replyof-ER-feature-item"> Timely & Accurate Response Filing</div>
            <div className="Replyof-ER-feature-item"> Higher Chances of Trademark Approval</div>
          </div>

          <div className="Replyof-ER-public-highlights">
            <div>
              <h3>1,000+</h3>
              <p>Companies Registered</p>
            </div>
            <div>
              <h3>100%</h3>
              <p>Online Process</p>
            </div>
            <div>
              <h3>5+</h3>
              <p>Years of Legal Expertise</p>
            </div>
          </div>

        </div>

        {/* RIGHT FORM */}
        <aside className="Replyof-ER-public-form-wrapper">
          <div className="Replyof-ER-public-form-card">

            <h3 className="Replyof-ER-form-title">
              Get Expert Assistance
            </h3>

            <p className="Replyof-ER-form-subtitle">
              Talk to our Expert
            </p>

            <form
              className="Replyof-ER-public-form"
              onSubmit={(e) => e.preventDefault()}
            >
              <input type="text" placeholder="Full Name" required />
              <input type="email" placeholder="Email Address" required />
              <input type="tel" placeholder="Mobile Number" required />

              <select required>
                <option value="">Select Your State</option>
                <option>Maharashtra</option>
                <option>Delhi</option>
                <option>Karnataka</option>
                <option>Tamil Nadu</option>
                <option>Other</option>
              </select>

              <select>
                <option value="">Preferred Call Time</option>
                <option>10:00 AM – 12:00 PM</option>
                <option>12:00 PM – 2:00 PM</option>
                <option>2:00 PM – 4:00 PM</option>
                <option>4:00 PM – 6:00 PM</option>
              </select>

              <div className="Replyof-ER-whatsapp-row">
                <label className="Replyof-ER-whatsapp-label">
                  <input type="checkbox" defaultChecked />
                  <span className="Replyof-ER-custom-checkbox"></span>
                  <span className="Replyof-ER-whatsapp-text">
                    Receive updates on <strong>WhatsApp</strong>
                  </span>
                </label>
              </div>

              <button type="submit">
                Book Free Consultation
              </button>
            </form>

            <p className="Replyof-ER-form-note">
              🔒 100% Confidential • No Spam • No Hidden Charges
            </p>

          </div>
        </aside>

      </div>
    </section>
  );
};

export default Breadcrum;
