import { lazy, Suspense } from 'react'
import './OLWF.css'

const DissolavePrivatesTestimonial = lazy(() => import('../../Components/DissolvePrivateTestimonial/DissolvePrivateTestimonial'))
const DissolveVideoTestimonial = lazy(() => import('../../Components/DissolveVideoTestimonial/DissolveVideoTestimonial'))
const DissolaveOurClients = lazy(() => import('../../Components/DissolaveOurClients/DissolaveOurClients'))

const olwfFeatures = [
  {
    title: 'Single Ownership Structure',
    description: 'Perfect for solo entrepreneurs who want to establish a formal business entity with minimal compliance requirements'
  },
  {
    title: 'Limited Liability Protection',
    description: 'Your personal assets are protected from business liabilities, providing security and peace of mind'
  },
  {
    title: 'Tax Efficiency',
    description: 'Enjoy favorable tax treatment while maintaining the credibility of a registered company structure'
  },
  {
    title: 'Easy Compliance',
    description: 'Simplified regulatory requirements and minimal ongoing compliance obligations compared to other structures'
  }
]

const olwfServices = [
  {
    category: 'Documentation',
    items: [
      'PAN and Aadhar Verification',
      'Address Proof Verification',
      'Business Description Documentation',
      'Financial Projections Preparation'
    ]
  },
  {
    category: 'Registration Process',
    items: [
      'MCA Portal Registration',
      'Digital Signature Procurement',
      'SPICe+ Form Filing',
      'Certificate Issuance'
    ]
  },
  {
    category: 'Post-Registration',
    items: [
      'Bank Account Opening Assistance',
      'GST Registration Support',
      'PF and ESIC Registration',
      'Registered Office Documentation'
    ]
  }
]

export default function OLWF() {
  return (
    <div className="olwf-page">
      {/* Banner Section */}
      <section className="olwf-banner">
        <h1>One Person Company (OPC)</h1>
        <p>Establish Your Solo Business with Full Legal Protection</p>
      </section>

      {/* Introduction */}
      <section className="olwf-container">
        <section className="olwf-intro">
          <h2>What is a One Person Company?</h2>
          <p>
            A One Person Company (OPC) is a private company with only one member. It's the ideal business structure for solo 
            entrepreneurs who want the benefits of a registered company while maintaining simplicity in management and operations.
          </p>
          <p>
            An OPC provides limited liability protection, tax efficiency, and enhanced credibility without the complexity of 
            managing multiple stakeholders. It's perfect for freelancers, consultants, and small business owners.
          </p>
        </section>

        {/* Features */}
        <section className="olwf-features">
          <h2>Why Choose an OPC?</h2>
          <div className="features-grid">
            {olwfFeatures.map((feature, idx) => (
              <div key={idx} className="feature-card">
                <div className="feature-icon">✓</div>
                <h3>{feature.title}</h3>
                <p>{feature.description}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Services */}
        <section className="olwf-services">
          <h2>Our OPC Registration Services</h2>
          <div className="services-grid">
            {olwfServices.map((service, idx) => (
              <div key={idx} className="service-category">
                <h3 className="category-title">{service.category}</h3>
                <ul className="service-list">
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

        {/* Eligibility */}
        <section className="olwf-eligibility">
          <h2>Eligibility Criteria for OPC</h2>
          <div className="eligibility-content">
            <div className="eligibility-column">
              <h3>Who Can Form an OPC?</h3>
              <ul>
                <li>Any Indian citizen (individual)</li>
                <li>Resident of India</li>
                <li>18 years or above</li>
                <li>No criminal conviction</li>
              </ul>
            </div>
            <div className="eligibility-column">
              <h3>OPC Restrictions</h3>
              <ul>
                <li>Only one member allowed</li>
                <li>Cannot convert to partnership firm</li>
                <li>Cannot have a subsidiary company</li>
                <li>Cannot be a subsidiary of another company</li>
              </ul>
            </div>
          </div>
        </section>

        {/* Reusable Components */}
        <Suspense fallback={<div>Loading...</div>}>
          <section className="reusable-section">
            <DissolavePrivatesTestimonial />
          </section>

          <section className="reusable-section">
            <DissolveVideoTestimonial />
          </section>

          <section className="reusable-section">
            <DissolaveOurClients />
          </section>
        </Suspense>

        {/* CTA Section */}
        <section className="olwf-cta">
          <h2>Ready to Register Your OPC?</h2>
          <p>
            We'll guide you through every step of the OPC registration process with our expert team
          </p>
          <button className="cta-button">Get Started Now</button>
        </section>
      </section>
    </div>
  )
}
