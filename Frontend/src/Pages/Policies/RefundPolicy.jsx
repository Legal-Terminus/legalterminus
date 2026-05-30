import './RefundPolicy.css'

export default function RefundPolicy() {
  return (
    <div className="policy-page">
      <section className="policy-banner">
        <h1>Refund Policy</h1>
      </section>

      <div className="policy-container">
        <section className="policy-content">
          <h2>Our Refund & Satisfaction Guarantee</h2>
          
          <div className="policy-intro">
            <p>
              Legal Terminus believes in client satisfaction and values its client above all. However, in case you are 
              dissatisfied with any of our services then please inform us via email at <strong>admin@legalterminus.com</strong> 
              and our senior managers will get back to you within 24 hours of your email. We will definitely try our best 
              to resolve your issue within a reasonable time span.
            </p>
          </div>

          <div className="policy-section">
            <h3>1. Full Refund for Service Deficiency</h3>
            <p>
              In case the payment of any service has already been made by the client and the client wishes for a refund 
              due to the deficiency of our services, then the client is eligible to get a full refund subject to following conditions:
            </p>
            <ul>
              <li>The amount paid to the payment gateway will not be refunded by us</li>
              <li>The amount paid to any government as fees will not be eligible for a refund</li>
              <li>The amount incurred as out of pocket expenses will not be eligible for a refund</li>
            </ul>
          </div>

          <div className="policy-section">
            <h3>2. Refund for Change of Mind</h3>
            <p>
              In case the payment of any services has already been made by the client and later on the client wishes for 
              a refund for change of mind, then the refund is restricted to conditions mentioned in point no 1 above and 
              in addition to that a <strong>cancellation fee of 20%</strong> shall be charged.
            </p>
          </div>

          <div className="policy-section">
            <h3>3. Service Modification and Adjustment</h3>
            <p>
              In case the payment of any services has already been made by the client and later on the client wishes for 
              a change in services, then the amount shall be adjusted to the new service subject to the conditions mentioned 
              in point no 1 above. In case after adjustment any refund comes due, then it will be refunded to the client.
            </p>
          </div>

          <div className="policy-section">
            <h3>4. Delays Beyond Our Control</h3>
            <p>
              There is a possibility of delay of services which are beyond our control such as a delay due to a change of 
              policy by the government or delay due to a technical glitch of government website. In such cases, the refund 
              shall not be made due to the delay factor. We will instead work towards resolving the issue at no additional cost.
            </p>
          </div>

          <div className="policy-section">
            <h3>5. Refund Processing Timeline</h3>
            <p>
              Refund shall be processed within <strong>15 working days</strong> from the date of request of refund by the client. 
              The refund will be credited to the original payment method used for the transaction.
            </p>
          </div>

          <div className="policy-section">
            <h3>6. Maximum Refund Amount</h3>
            <p>
              Please note that in all circumstances the refund amount shall be restricted to the amount paid by the client. 
              We cannot refund amounts exceeding the original payment made.
            </p>
          </div>

          <div className="refund-process">
            <h3>How to Request a Refund</h3>
            <ol>
              <li>Contact us via email at <a href="mailto:admin@legalterminus.com">admin@legalterminus.com</a></li>
              <li>Provide your Order ID and reason for refund request</li>
              <li>Our team will review within 24 hours</li>
              <li>If approved, refund will be processed within 15 working days</li>
              <li>You will receive confirmation via email</li>
            </ol>
          </div>

          <div className="policy-contact">
            <h3>Need Assistance?</h3>
            <p>
              For any questions about our refund policy or to request a refund, please reach out to us:
            </p>
            <p>
              <strong>Email:</strong> <a href="mailto:admin@legalterminus.com">admin@legalterminus.com</a><br/>
              <strong>Phone:</strong> <a href="tel:+918280045432">+91 8280 045 432</a><br/>
              <strong>WhatsApp:</strong> <a href="https://wa.me/918280008183" target="_blank" rel="noopener noreferrer">+91 8280 008 183</a>
            </p>
          </div>
        </section>
      </div>
    </div>
  )
}
