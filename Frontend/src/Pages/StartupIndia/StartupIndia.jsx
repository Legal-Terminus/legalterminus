import { lazy, Suspense } from 'react'
import './StartupIndia.css'

const DissolavePrivatesTestimonial = lazy(() => import('../../Components/DissolvePrivateTestimonial/DissolvePrivateTestimonial'))
const DissolveVideoTestimonial = lazy(() => import('../../Components/DissolveVideoTestimonial/DissolveVideoTestimonial'))
const DissolaveOurClients = lazy(() => import('../../Components/DissolaveOurClients/DissolaveOurClients'))

export default function StartupIndia() {
  const startupFeatures = [
    {
      title: 'Tax Benefits',
      description: 'Income tax exemptions on fund raising and business profits'
    },
    {
      title: 'Faster Patent Processing',
      description: 'Fast-track patent examination and reduced filing fees'
    },
    {
      title: 'Easy Compliance',
      description: 'Simpler compliance requirements and regulatory support'
    },
    {
      title: 'Funding Support',
      description: 'Access to government schemes and investor networks'
    }
  ]

  const startupServices = [
    {
      category: 'Registration & Recognition',
      items: [
        'Startup India Recognition Certificate',
        'Business registration assistance',
        'PAN and TAN applications',
        'Bank account setup'
      ]
    },
    {
      category: 'Compliance Services',
      items: [
        'Annual compliance and filing',
        'GST registration and filing',
        'Statutory audit arrangement',
        'Director and member management'
      ]
    },
    {
      category: 'Tax Planning',
      items: [
        'Income tax exemption planning',
        'Patent and IP tax benefits',
        'Tax-efficient structuring',
        'Financial documentation'
      ]
    }
  ]

  return (
    <div className="startup-india-page">
      <section className="startup-banner">
        <h1>Startup India Registration</h1>
        <p>Get recognized, grow faster, enjoy tax benefits</p>
      </section>

      <div className="startup-container">
        <section className="startup-intro">
          <h2>What is Startup India?</h2>
          <p>
            Startup India is a flagship initiative by the Government of India to build a strong ecosystem 
            for nurturing innovation and startups in the country. It provides recognition, tax benefits, funding 
            support, and regulatory ease for registered startups.
          </p>
        </section>

        <section className="startup-features">
          <h2>Key Benefits</h2>
          <div className="features-grid">
            {startupFeatures.map((feature, idx) => (
              <div key={idx} className="feature-card">
                <div className="feature-icon">✓</div>
                <h3>{feature.title}</h3>
                <p>{feature.description}</p>
              </div>
            ))}
          </div>
        </section>

        <section className="startup-services">
          <h2>Our Services</h2>
          <div className="services-grid">
            {startupServices.map((service, idx) => (
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

        <section className="startup-eligibility">
          <h2>Eligibility Criteria</h2>
          <div className="eligibility-content">
            <p>To be recognized as a startup under Startup India, your enterprise must:</p>
            <ul className="eligibility-list">
              <li>Be a private limited company or a partnership firm or an LLP incorporated in India</li>
              <li>Be less than 7 years old from the date of incorporation/registration</li>
              <li>Have annual turnover not exceeding ₹100 crore in any preceding financial year</li>
              <li>Work towards innovation, development, or improvement of products or processes</li>
              <li>Not be formed by splitting or reconstruction of existing entity</li>
            </ul>
          </div>
        </section>

        <Suspense fallback={<div className="loading">Loading...</div>}>
          <DissolavePrivatesTestimonial />
          <DissolveVideoTestimonial />
          <DissolaveOurClients />
        </Suspense>

        <section className="startup-cta">
          <h2>Ready to Get Your Startup Recognized?</h2>
          <p>Our team will guide you through the entire Startup India registration process.</p>
          <button className="cta-button">
            <a href="https://wa.me/918280008183" target="_blank" rel="noopener noreferrer">
              Get Started Now
            </a>
          </button>
        </section>
      </div>
    </div>
  )
}
