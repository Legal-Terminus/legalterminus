import { lazy, Suspense } from 'react'
import './ITRIndividual.css'

const DissolavePrivatesTestimonial = lazy(() => import('../../Components/DissolvePrivateTestimonial/DissolvePrivateTestimonial'))
const DissolveVideoTestimonial = lazy(() => import('../../Components/DissolveVideoTestimonial/DissolveVideoTestimonial'))
const DissolaveOurClients = lazy(() => import('../../Components/DissolaveOurClients/DissolaveOurClients'))

export default function ITRIndividual() {
  const itrFeatures = [
    {
      title: 'Quick Processing',
      description: 'Fast refund processing and immediate ITR acknowledgment'
    },
    {
      title: 'Tax Benefits',
      description: 'Maximize deductions and get rightful tax benefits'
    },
    {
      title: 'Compliance',
      description: 'Stay compliant with income tax laws and avoid penalties'
    },
    {
      title: 'Professional Help',
      description: 'Expert guidance on tax-saving strategies'
    }
  ]

  const filingServices = [
    {
      category: 'Filing Services',
      items: [
        'ITR-1 Filing (Salary, Interest Income)',
        'ITR-2 Filing (Capital Gains, Foreign Assets)',
        'ITR-3 Filing (Self-Employment Income)',
        'ITR-4 Filing (Presumptive Income)'
      ]
    },
    {
      category: 'Documentation',
      items: [
        'Document collection and organization',
        'Income verification and calculation',
        'Deduction consolidation',
        'E-verification support'
      ]
    },
    {
      category: 'Compliance',
      items: [
        'Timely filing of returns',
        'Penalty avoidance guidance',
        'ITR correction filing',
        'Refund tracking'
      ]
    }
  ]

  return (
    <div className="itr-individual-page">
      <section className="itr-banner">
        <h1>ITR Filing for Individuals</h1>
        <p>Simple, Fast, and Professional Income Tax Return Filing</p>
      </section>

      <div className="itr-container">
        <section className="itr-intro">
          <h2>Why File ITR?</h2>
          <p>
            Filing Income Tax Return (ITR) is not just a legal requirement but also helps in building financial credibility. 
            It enables you to claim refunds, get loans easily, and ensures complete compliance with tax laws. Our team helps 
            you file accurate and timely ITR returns.
          </p>
        </section>

        <section className="itr-features">
          <h2>Key Benefits</h2>
          <div className="features-grid">
            {itrFeatures.map((feature, idx) => (
              <div key={idx} className="feature-card">
                <div className="feature-icon">✓</div>
                <h3>{feature.title}</h3>
                <p>{feature.description}</p>
              </div>
            ))}
          </div>
        </section>

        <section className="itr-services">
          <h2>Our Services</h2>
          <div className="services-grid">
            {filingServices.map((service, idx) => (
              <div key={idx} className="service-category">
                <h3>{service.category}</h3>
                <ul>
                  {service.items.map((item, itemIdx) => (
                    <li key={itemIdx}>
                      <span className="check-mark">✓</span>
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </section>

        <section className="itr-eligibility">
          <h2>Who Should File ITR?</h2>
          <div className="eligibility-content">
            <p>You must file ITR if:</p>
            <ul className="eligibility-list">
              <li>Your annual income exceeds the basic exemption limit</li>
              <li>You have income from multiple sources (salary, business, investments)</li>
              <li>You want to claim refund of tax deducted at source (TDS)</li>
              <li>You want to claim loss from business or property</li>
              <li>You have foreign assets or foreign income</li>
              <li>You are applying for loan or credit facilities</li>
            </ul>
          </div>
        </section>

        <Suspense fallback={<div className="loading">Loading...</div>}>
          <DissolavePrivatesTestimonial />
          <DissolveVideoTestimonial />
          <DissolaveOurClients />
        </Suspense>

        <section className="itr-cta">
          <h2>Ready to File Your ITR?</h2>
          <p>Let our experts handle your income tax return filing with complete accuracy and compliance.</p>
          <button className="cta-button">
            <a href="https://wa.me/918280008183" target="_blank" rel="noopener noreferrer">
              File Your ITR Now
            </a>
          </button>
        </section>
      </div>
    </div>
  )
}
