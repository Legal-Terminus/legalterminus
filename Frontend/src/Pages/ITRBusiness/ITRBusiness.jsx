import { lazy, Suspense } from 'react'
import './ITRBusiness.css'

const DissolavePrivatesTestimonial = lazy(() => import('../../Components/DissolvePrivateTestimonial/DissolvePrivateTestimonial'))
const DissolveVideoTestimonial = lazy(() => import('../../Components/DissolveVideoTestimonial/DissolveVideoTestimonial'))
const DissolaveOurClients = lazy(() => import('../../Components/DissolaveOurClients/DissolaveOurClients'))

export default function ITRBusiness() {
  const businessFeatures = [
    {
      title: 'Business Optimization',
      description: 'Identify tax-saving opportunities and optimize business structure'
    },
    {
      title: 'Compliance Assurance',
      description: 'Ensure full compliance with income tax and corporate laws'
    },
    {
      title: 'Financial Planning',
      description: 'Strategic tax planning for business growth and profitability'
    },
    {
      title: 'Expert Support',
      description: 'Dedicated support from experienced tax professionals'
    }
  ]

  const businessServices = [
    {
      category: 'Business ITR Filing',
      items: [
        'ITR-3 (Self-employed professionals)',
        'ITR-4 (Business with presumptive income)',
        'Partnership firm ITR',
        'LLP and company ITR assistance'
      ]
    },
    {
      category: 'Accounting Support',
      items: [
        'Books of accounts preparation',
        'Income and expense tracking',
        'Business profit calculation',
        'Financial statement review'
      ]
    },
    {
      category: 'Tax Planning',
      items: [
        'Business structure optimization',
        'Deduction and exemption planning',
        'GST coordination with ITR',
        'Salary and dividend planning'
      ]
    }
  ]

  return (
    <div className="itr-business-page">
      <section className="itr-banner">
        <h1>ITR Filing for Businesses</h1>
        <p>Comprehensive ITR Solutions for Your Business Growth</p>
      </section>

      <div className="itr-container">
        <section className="itr-intro">
          <h2>Business ITR Filing Made Easy</h2>
          <p>
            Filing ITR as a business owner involves complex calculations and compliance requirements. Our expert team ensures 
            accurate filing, maximizes tax benefits, and keeps your business compliant with all income tax regulations. From 
            sole proprietorship to partnerships and companies, we handle all types of business entities.
          </p>
        </section>

        <section className="itr-features">
          <h2>Key Benefits</h2>
          <div className="features-grid">
            {businessFeatures.map((feature, idx) => (
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
            {businessServices.map((service, idx) => (
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
          <h2>For Business Owners & Professionals</h2>
          <div className="eligibility-content">
            <p>We assist with ITR filing for:</p>
            <ul className="eligibility-list">
              <li>Sole proprietorship and self-employed professionals</li>
              <li>Partnership firms and LLPs</li>
              <li>Private and public limited companies</li>
              <li>E-commerce sellers and online business owners</li>
              <li>Businesses with multiple income sources</li>
              <li>Entities requiring statutory audit and compliance</li>
            </ul>
          </div>
        </section>

        <Suspense fallback={<div className="loading">Loading...</div>}>
          <DissolavePrivatesTestimonial />
          <DissolveVideoTestimonial />
          <DissolaveOurClients />
        </Suspense>

        <section className="itr-cta">
          <h2>Streamline Your Business Tax Compliance</h2>
          <p>Get expert guidance for accurate and timely ITR filing for your business entity.</p>
          <button className="cta-button">
            <a href="https://wa.me/918280008183" target="_blank" rel="noopener noreferrer">
              Get Business Support
            </a>
          </button>
        </section>
      </div>
    </div>
  )
}
