import React from 'react'
import './About.css'
import DissolavePrivatesTestimonial from '../../Components/DissolvePrivateTestimonial/DissolvePrivateTestimonial'
import DissolveVideoTestimonial from '../../Components/DissolveVideoTestimonial/DissolveVideoTestimonial'
import DissolaveOurClients from '../../Components/DissolaveOurClients/DissolaveOurClients'

const About = () => {
  const standOutItems = [
    {
      title: 'Easy Accessibility & Cost Efficiency',
      description: 'Our online platform is especially designed to allow you quick and efficient access to specific services required by you at extremely competitive price.'
    },
    {
      title: 'Excellent Reminder Policy',
      description: 'Our Excellent reminder policy will never let you spend a single penny towards penalty or late fee for any compliance.'
    },
    {
      title: 'Easy Return and Grievance Redressal Policy',
      description: 'While we take stern steps to ensure that our clients do not face any issues while availing our services, we have set-up a Grievance Redressal Team to take care of all your grievances in a timely manner.'
    },
    {
      title: 'Highly Experienced Consultants',
      description: 'You will get tailormade advice, based on various relevant parameters, such as your industry segment, business needs, type and size of your entity, by our highly experienced consultants.'
    }
  ]

  const services = [
    {
      category: 'Setting up a Business',
      items: ['Pvt Ltd Registration', 'Public Limited Registration', 'OPC Registration', 'Limited Liability Partnership', 'Partnership Firm', 'Proprietorship Firm']
    },
    {
      category: 'Registration Services',
      items: ['GST Registration', 'Udyam MSME Support', 'PF Registration', 'ESIC Registration', 'Startup Odisha', 'Startup India']
    },
    {
      category: 'Compliance Services',
      items: ['ITR Filing', 'GST Return Filing', 'Annual Filing (LLP)', 'Annual Filing (Company)']
    },
    {
      category: 'Trade Mark Services',
      items: ['Trade Mark Application', 'Trade Mark Renewal', 'Examination Report Reply', 'Trademark Opposition', 'Trademark Hearing']
    }
  ]

  return (
    <div className="about-page">
      {/* Banner Section */}
      <section className="about-banner">
        <div className="about-banner-content">
          <h1>About Legal Terminus</h1>
          <p>Your Trusted Legal & Compliance Partner</p>
        </div>
      </section>

      {/* Introduction Section */}
      <section className="about-intro">
        <div className="about-container">
          <div className="intro-content">
            <h2>Who We Are</h2>
            <p className="intro-text">
              Legal Terminus is a professional business consultancy firm providing compliance and regulatory support services across India. We assist businesses with legal and statutory requirements in a structured and hassle-free manner.
            </p>
            <p className="intro-text">
              As a one-stop solution, our experienced consultants handle documentation, filings, and procedural support to help your business remain compliant with applicable laws. Our team focuses on accuracy, timely submission, and professional guidance throughout the process.
            </p>
            <p className="intro-disclaimer">
              Legal Terminus is a private consultancy firm and is not affiliated with any government authority.
            </p>
          </div>
        </div>
      </section>

      {/* Why We Stand Out Section */}
      <section className="about-standout">
        <div className="about-container">
          <h2>Why We Stand Out</h2>
          <div className="standout-grid">
            {standOutItems.map((item, index) => (
              <div key={index} className="standout-card">
                <div className="standout-icon">
                  <svg width="48" height="48" viewBox="0 0 48 48" fill="none">
                    <rect width="48" height="48" fill="#E8F0FF"/>
                    <circle cx="24" cy="24" r="20" fill="#0b5f3a" fillOpacity="0.1"/>
                    <path d="M20 24L22.5 26.5L28 20.5" stroke="#0b5f3a" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </div>
                <h3>{item.title}</h3>
                <p>{item.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Services Section */}
      <section className="about-services">
        <div className="about-container">
          <h2>Our Services</h2>
          <div className="services-grid">
            {services.map((service, index) => (
              <div key={index} className="service-category">
                <h3>{service.category}</h3>
                <ul className="service-list">
                  {service.items.map((item, i) => (
                    <li key={i}>
                      <span className="check-mark">✓</span>
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials Section - Reused Component */}
      <DissolavePrivatesTestimonial />

      {/* Video Testimonials Section - Reused Component */}
      <DissolveVideoTestimonial />

      {/* Our Clients Section - Reused Component */}
      <DissolaveOurClients />

      {/* CTA Section */}
      <section className="about-cta">
        <div className="about-container">
          <h2>Ready to Get Started?</h2>
          <p>Contact us today to learn how we can help your business stay compliant and grow.</p>
          <button className="cta-button">Contact Us Now</button>
        </div>
      </section>
    </div>
  )
}

export default About
