import { lazy, Suspense } from 'react'
import './StartupOdisha.css'

const DissolavePrivatesTestimonial = lazy(() => import('../../Components/DissolvePrivateTestimonial/DissolvePrivateTestimonial'))
const DissolveVideoTestimonial = lazy(() => import('../../Components/DissolveVideoTestimonial/DissolveVideoTestimonial'))
const DissolaveOurClients = lazy(() => import('../../Components/DissolaveOurClients/DissolaveOurClients'))

export default function StartupOdisha() {
  const odishaFeatures = [
    {
      title: 'Capital Subsidy',
      description: 'Up to ₹50 lakhs subsidy for eligible startups'
    },
    {
      title: 'Mentorship Support',
      description: 'Access to experienced mentors and industry experts'
    },
    {
      title: 'Office Space',
      description: 'Subsidized office space in incubation centers'
    },
    {
      title: 'Regulatory Support',
      description: 'Fast-track approvals and regulatory assistance'
    }
  ]

  const odishaServices = [
    {
      category: 'Registration & Compliance',
      items: [
        'Business registration assistance',
        'Government scheme documentation',
        'Subsidy application management',
        'Annual compliance and filing'
      ]
    },
    {
      category: 'Funding & Financial',
      items: [
        'Startup Odisha scheme application',
        'Subsidy claim management',
        'Financial documentation',
        'Tax planning and benefits'
      ]
    },
    {
      category: 'Support Services',
      items: [
        'Business plan preparation',
        'Mentor network access',
        'Incubation center networking',
        'Ongoing regulatory support'
      ]
    }
  ]

  return (
    <div className="startup-odisha-page">
      <section className="startup-banner">
        <h1>Startup Odisha Registration</h1>
        <p>Grow your business with Odisha's startup ecosystem support</p>
      </section>

      <div className="startup-container">
        <section className="startup-intro">
          <h2>About Startup Odisha</h2>
          <p>
            Startup Odisha is the state government's flagship initiative to foster innovation and entrepreneurship. 
            It provides financial assistance, mentorship, and regulatory support to startups operating in Odisha. 
            The scheme offers capital subsidies up to ₹50 lakhs and access to world-class incubation facilities.
          </p>
        </section>

        <section className="startup-features">
          <h2>Key Benefits</h2>
          <div className="features-grid">
            {odishaFeatures.map((feature, idx) => (
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
            {odishaServices.map((service, idx) => (
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
          <h2>Eligibility for Startup Odisha</h2>
          <div className="eligibility-content">
            <p>To be eligible for Startup Odisha scheme, your business should:</p>
            <ul className="eligibility-list">
              <li>Be registered or incorporated in Odisha</li>
              <li>Be less than 3 years old from the date of incorporation</li>
              <li>Have invested minimum ₹5 lakh capital</li>
              <li>Have a clear business plan with innovation element</li>
              <li>Have at least 2 full-time founders/directors</li>
              <li>Meet industry-specific criteria as per scheme guidelines</li>
            </ul>
          </div>
        </section>

        <Suspense fallback={<div className="loading">Loading...</div>}>
          <DissolavePrivatesTestimonial />
          <DissolveVideoTestimonial />
          <DissolaveOurClients />
        </Suspense>

        <section className="startup-cta">
          <h2>Ready to Join Startup Odisha?</h2>
          <p>Let us help you access subsidies and support for your business growth.</p>
          <button className="cta-button">
            <a href="https://wa.me/918280008183" target="_blank" rel="noopener noreferrer">
              Apply Now
            </a>
          </button>
        </section>
      </div>
    </div>
  )
}
