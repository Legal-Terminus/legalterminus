import './PrivacyPolicy.css'

const sections = [
  { id: 'confidentiality', label: 'Confidentiality of Information' },
  { id: 'legal-disclosure', label: 'Legal Disclosure' },
  { id: 'contact', label: 'Contact Us' },
]

export default function PrivacyPolicy() {
  const scrollTo = (id) => {
    const el = document.getElementById(id)
    if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' })
  }

  return (
    <div className="policy-page">
      <section className="pp-banner">
        <h1>Privacy Policy</h1>
      </section>

      <div className="pp-layout">
        <aside className="pp-sidebar">
          <div className="pp-toc">
            <p className="pp-toc-title">On this page</p>
            <ul>
              {sections.map((s) => (
                <li key={s.id}>
                  <button onClick={() => scrollTo(s.id)}>{s.label}</button>
                </li>
              ))}
            </ul>
          </div>
        </aside>

        <main className="pp-content-area">
          <div className="pp-intro-box">
            <h2>Confidentiality &amp; Privacy Policy</h2>
            <p>
              At <strong>Legal Terminus</strong>, safeguarding your information is central
              to how we operate. The following policy outlines how we handle confidential
              and proprietary information shared with us during the course of our services.
            </p>
          </div>

          {/* ── Clause 1 ── */}
          <section id="confidentiality" className="pp-section">
            <div className="pp-section-header">
              <span className="pp-section-num">01</span>
              <h2>Confidentiality of Information</h2>
            </div>

            <div className="pp-clause">
              <span className="pp-clause-num">1</span>
              <div className="pp-clause-body">
                <p>
                  We understand that during the course of our agreement, we shall be privy
                  to proprietary information or general commercial information, which may or
                  may not be confidential in nature. We warrant that we shall not disclose
                  to any person or entity any information in our possession or knowledge.
                </p>
                <p>
                  However, such information may be disseminated to our employees who are
                  directly concerned with such information and then also only to such extent
                  as is necessary for each employee for the purpose of undertaking his normal
                  course of work in pursuance of this arrangement.
                </p>
                <p>
                  We shall take adequate measures to ensure that no part of the information
                  in the possession of the employees is disseminated either during the course
                  of employment or thereafter. The information shall not be discussed, or
                  otherwise communicated verbally, in an open forum where personnel or other
                  third parties, who are not entitled to the possession of such information,
                  are present.
                </p>
              </div>
            </div>
          </section>

          {/* ── Clause 2 ── */}
          <section id="legal-disclosure" className="pp-section">
            <div className="pp-section-header">
              <span className="pp-section-num">02</span>
              <h2>Legal Disclosure &amp; External Communication</h2>
            </div>

            <div className="pp-clause">
              <span className="pp-clause-num">2</span>
              <div className="pp-clause-body">
                <p>
                  In the event that we receive a validly issued administrative or judicial
                  process requiring disclosure of confidential information, we shall provide
                  prompt notice to the company of such receipt. We shall thereafter be
                  entitled to disclose any confidential information in order to comply with
                  such administrative or judicial process, to the extent required by law.
                </p>
                <p>
                  We may disclose in our external communication the fact that we have
                  rendered services to your company by identifying the name of your company,
                  reproducing your logo, and/or indicating only the general nature of
                  services rendered by us including such details as have properly entered
                  the public domain.
                </p>
              </div>
            </div>
          </section>

          {/* ── Contact ── */}
          <section id="contact" className="pp-contact">
            <h3>Questions or Concerns?</h3>
            <p>
              If you have any questions regarding our Privacy Policy or how we handle your
              information, please reach out to us:
            </p>
            <p>
              <strong>Phone:</strong>{' '}
              <a href="tel:+918280045432">+91 8280 045 432</a>
              <br />
              <strong>WhatsApp:</strong>{' '}
              <a
                href="https://wa.me/918280008183"
                target="_blank"
                rel="noopener noreferrer"
              >
                +91 8280 008 183
              </a>
            </p>
            <p className="pp-address">
              <strong>Registered Office:</strong> Flat no 1B, 1st Floor, R K Enclave,
              Plot No A/155, Sahid Nagar, Bhubaneswar– 751007, Odisha.
            </p>
          </section>
        </main>
      </div>
    </div>
  )
}
