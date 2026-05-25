import './TermsConditions.css'

const sections = [
  { id: 'welcome', label: 'Welcome & Agreement' },
  { id: 'scope', label: 'Scope Limitation' },
  { id: 'force-majeure', label: 'Force Majeure' },
  { id: 'termination', label: 'Termination' },
  { id: 'contact', label: 'Contact Us' },
]

export default function TermsConditions() {
  const scrollTo = (id) => {
    const el = document.getElementById(id)
    if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' })
  }

  return (
    <div className="policy-page">
      <section className="policy-banner">
        <h1>Terms &amp; Conditions</h1>
        <p className="tc-subtitle">
          Please read these terms carefully before using our services at{' '}
          <strong>www.legalterminus.com</strong>
        </p>
      </section>

      <div className="tc-layout">
        <aside className="tc-sidebar">
          <div className="tc-toc">
            <p className="tc-toc-title">On this page</p>
            <ul>
              {sections.map((s) => (
                <li key={s.id}>
                  <button onClick={() => scrollTo(s.id)}>{s.label}</button>
                </li>
              ))}
            </ul>
          </div>
        </aside>

        <main className="tc-content-area">
          <div className="tc-intro-box">
            <p>
              This website is solely owned and operated by{' '}
              <strong>LEGAL TERMINUS PRIVATE LIMITED</strong>, a private limited company
              registered under the Companies Act, 2013, having its registered office at Flat
              no 1B, 1st Floor, R K Enclave, Plot No A/155, Sahid Nagar, Bhubaneswar–
              751007, Odisha.
            </p>
            <p>
              Since the communications between the user of this website (referred to as
              &quot;you&quot; or &quot;user&quot;) and the owner (referred to as &quot;us&quot;,
              &quot;owner&quot;, or &quot;LEGAL TERMINUS&quot;) will be faceless, it is
              important to set out the terms and conditions clearly in advance.
            </p>
            <p>
              By visiting and accessing our website, you understand and agree to accept the
              following terms and conditions.
            </p>
          </div>

          {/* ── Welcome & User Agreement ── */}
          <section id="welcome" className="tc-section">
            <div className="tc-section-header">
              <span className="tc-section-num">01</span>
              <h2>Welcome &amp; User Agreement</h2>
            </div>
            <div className="tc-clauses">
              <div className="tc-clause">
                <span className="tc-clause-num">1</span>
                <p>This user agreement is subject to change without notice.</p>
              </div>
              <div className="tc-clause">
                <span className="tc-clause-num">2</span>
                <p>
                  The information or documents you provide to avail services as per the
                  website such as ID Proofs, Address Proofs, Mobile No, Email IDs, and any
                  other information are deemed to be true, correct, accurate, and up-to-date.
                </p>
              </div>
              <div className="tc-clause">
                <span className="tc-clause-num">3</span>
                <p>
                  We shall not be responsible for any loss or delay in services in case of
                  any misinformation, wrong information, or information which is not
                  up-to-date provided to us. Further, it is your responsibility to choose
                  the services as per your business needs, and in case otherwise, we shall
                  not be responsible for any loss to you.
                </p>
              </div>
              <div className="tc-clause">
                <span className="tc-clause-num">4</span>
                <p>
                  You shall be held liable for any loss caused to us arising out of any
                  attempt to copy or duplicate the information available on our website, or
                  any attempt to interfere with or disrupt any of our servers, networks, or
                  resources.
                </p>
              </div>
              <div className="tc-clause">
                <span className="tc-clause-num">5</span>
                <p>
                  It is agreed that you shall indemnify Legal Terminus Private Limited for
                  violation of any of the above user agreements.
                </p>
              </div>
              <div className="tc-clause">
                <span className="tc-clause-num">6</span>
                <p>
                  Neither we nor any third parties provide any warranty or guarantee as to
                  the accuracy, timeliness, performance, completeness, or suitability of the
                  information and materials found or offered on this website for any
                  particular purpose. You acknowledge that such information and materials may
                  contain inaccuracies or errors and we expressly exclude liability for any
                  such inaccuracies or errors to the fullest extent permitted by law.
                </p>
              </div>
              <div className="tc-clause">
                <span className="tc-clause-num">7</span>
                <p>
                  The creation of a link to this website from another website or document
                  without any written permission from us is strictly prohibited and can lead
                  to criminal or civil liability.
                </p>
              </div>
            </div>
          </section>

          {/* ── Scope Limitation ── */}
          <section id="scope" className="tc-section">
            <div className="tc-section-header">
              <span className="tc-section-num">02</span>
              <h2>Scope Limitation</h2>
            </div>
            <div className="tc-clauses">
              <div className="tc-clause">
                <span className="tc-clause-num">1</span>
                <p>
                  Work will be based upon and therefore affected by the information and
                  representations supplied by the directors, employees, and other agents of
                  the Company. Consequently, we shall not be responsible for any losses,
                  damages, costs, or other consequences if information material to their
                  work is withheld, concealed from, or misrepresented to us.
                </p>
              </div>
              <div className="tc-clause">
                <span className="tc-clause-num">2</span>
                <p>
                  We may supply written advice or confirm oral advice in writing or deliver
                  a final written report or make an oral presentation on the completion of
                  the services. Even prior to completion of the services we may supply oral,
                  draft, or interim advice, reports, or presentations, but our written
                  advice or final written report shall take precedence. No reliance shall be
                  placed by you on any draft or interim advice, report, or presentation.
                  Where you wish to rely on oral advice or presentations made on completion
                  of the Services, you shall inform us and we shall supply documentary
                  confirmation of the advice concerned.
                </p>
              </div>
              <div className="tc-clause">
                <span className="tc-clause-num">3</span>
                <p>
                  We shall not be under any obligation to update any advice, report, or any
                  product of the services — oral or written — for events occurring after the
                  advice, report, or product concerned has been issued in final form, except
                  where we have expressly agreed to provide such an update during the term
                  of our engagement as a result of changes to Law or Regulation.
                </p>
              </div>
              <div className="tc-clause">
                <span className="tc-clause-num">4</span>
                <p>
                  Any product of the services released to you in any form or medium shall be
                  supplied on the basis that it is for your benefit and information only, and
                  shall not be copied, referred to, or disclosed — in whole (save for your
                  own internal purposes) or in part — without our prior written consent. You
                  may disclose in whole any product of the services to your legal advisers
                  for the purposes of seeking advice, provided that you inform them that
                  further disclosure is not permitted without our prior written consent, and
                  to the fullest extent permitted by law, we accept no responsibility or
                  liability to them in connection with the services.
                </p>
              </div>
              <div className="tc-clause">
                <span className="tc-clause-num">5</span>
                <p>
                  Any advice, opinion, statement of expectation, forecast, or recommendation
                  supplied by us as part of the services shall not amount to any form of
                  guarantee that we have determined or predicted future events or
                  circumstances.
                </p>
              </div>
              <div className="tc-clause">
                <span className="tc-clause-num">6</span>
                <p>
                  We shall retain ownership of the copyright and all other intellectual
                  property rights in the product of the Services, whether oral or intangible,
                  and ownership of our working papers. You shall acquire ownership of any
                  product of the Services in its tangible form on payment of our charges
                  (fees for our services, outlays, and appropriate taxes thereon, including
                  withholding taxes). For the purposes of delivering services to you or other
                  clients, we and other persons of the firm shall be entitled to use, develop,
                  or share with each other knowledge, experience, and skills of general
                  application gained through performing the Services.
                </p>
              </div>
              <div className="tc-clause">
                <span className="tc-clause-num">7</span>
                <div>
                  <p>
                    Notwithstanding our duties and responsibilities in relation to the
                    Services, you shall retain responsibility and accountability for:
                  </p>
                  <ol className="tc-sub-list">
                    <li>the management, conduct, and operation of your business and your affairs;</li>
                    <li>
                      deciding on your use of, choosing to what extent you wish to rely on,
                      implementing advice or recommendations or other product of the Services
                      supplied by us;
                    </li>
                    <li>
                      making any decision affecting the Services, any products of the Services,
                      your interests, or your affairs;
                    </li>
                    <li>
                      the delivery, achievement, or realisation of any benefits directly or
                      indirectly related to the Services, which require implementation by you.
                    </li>
                  </ol>
                </div>
              </div>
              <div className="tc-clause">
                <span className="tc-clause-num">8</span>
                <p>
                  You shall indemnify and hold us harmless from and against (i) all loss,
                  damage, harm, or injury suffered or incurred by us and (ii) all notices,
                  claims, demands, actions, suits, or proceedings given, made, or initiated
                  against us on account of or arising out of (a) the performance by us of all
                  or any of our obligations hereunder, (b) any transaction covered by this
                  engagement, or (c) any default committed by you in the performance of all
                  or any of your obligations hereunder, as also against all costs, charges,
                  and expenses suffered or incurred by us on account of the aforesaid.
                </p>
              </div>
            </div>
          </section>

          {/* ── Force Majeure ── */}
          <section id="force-majeure" className="tc-section">
            <div className="tc-section-header">
              <span className="tc-section-num">03</span>
              <h2>Force Majeure</h2>
            </div>
            <p className="tc-plain-para">
              Neither of us shall be in breach of our contractual obligations nor shall
              either of us incur any liability to the other if we or you are unable to comply
              with the Services Contract as a result of any cause beyond our or your
              reasonable control.
            </p>
          </section>

          {/* ── Termination ── */}
          <section id="termination" className="tc-section">
            <div className="tc-section-header">
              <span className="tc-section-num">04</span>
              <h2>Termination</h2>
            </div>
            <p className="tc-plain-para">
              Each of us can terminate the Services contract or suspend its operation by
              giving notice in writing within a reasonable period of time to the other at
              any time. Termination or suspension under this clause shall not affect any
              rights that may have been acquired by either of us before termination or
              suspension, and all sums due to us as per the engagement letter shall become
              payable in full when termination or suspension takes place.
            </p>
          </section>

          {/* ── Contact ── */}
          <section id="contact" className="policy-contact">
            <h3>Questions About Our Terms?</h3>
            <p>
              If you have any questions regarding our Terms &amp; Conditions, please reach
              out to us:
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
            <p className="tc-address">
              <strong>Registered Office:</strong> Flat no 1B, 1st Floor, R K Enclave, Plot
              No A/155, Sahid Nagar, Bhubaneswar– 751007, Odisha.
            </p>
          </section>
        </main>
      </div>
    </div>
  )
}
