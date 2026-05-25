import './RefundPolicy.css'

export default function RefundPolicy() {
  return (
    <div className="rp-page">
      <section className="rp-banner">
        <h1>Refund Policy</h1>
      </section>

      <div className="rp-container">
        <div className="rp-document">

          <p className="rp-intro">
            Legal Terminus believes in client satisfaction and values its client above all.
          </p>

          <p className="rp-intro">
            However, in case you are dissatisfied with any of our services then please inform
            us via email at <strong>admin@legalterminus.com</strong> and our senior managers
            will get back to you within 24 hours of your email. We will definitely try our
            best to resolve your issue within a reasonable time span. Still, if you are not
            satisfied and need a refund, we will process your refund as per the following
            conditions: –
          </p>

          <p className="rp-para">
            <span className="rp-num">1)</span> In case the payment of any service has already
            been made by the client and the client wishes for a refund due to the deficiency
            of our services then the client is eligible to get a full refund subject to
            following
          </p>
          <ol className="rp-sub-list">
            <li>The amount paid to the payment gateway will not be refunded by us</li>
            <li>The amount paid to any govt as fees will not be eligible for a refund</li>
            <li>The amount incurred as out of pocket expenses will not be eligible for a refund</li>
          </ol>

          <p className="rp-para">
            <span className="rp-num">2)</span> In case the payment of any services has already
            been made by the client and later on the client wishes for a refund for change of
            mind then the refund is restricted to conditions mentioned in point no 1 above and
            in addition to that a cancellation fee of 20% shall be charged.
          </p>

          <p className="rp-para">
            <span className="rp-num">3)</span> In case the payment of any services has already
            been made by the client and later on the client wishes for a change in services
            then the amount shall be adjusted to the new service subject to the conditions
            mentioned in point no 1 above and in case after adjustment any refund comes due
            then it will be refunded to the client.
          </p>

          <p className="rp-para">
            <span className="rp-num">4)</span> Further, there is a possibility of delay of
            services which are beyond our control such as a delay due to a change of policy
            by the govt or delay due to a technical glitch of govt website. In such cases,
            the refund shall not be made due to the delay factor.
          </p>

          <p className="rp-para">
            <span className="rp-num">5)</span> Refund shall be processed within 15 working
            days from the date of request of refund by the client.
          </p>

          <p className="rp-para">
            <span className="rp-num">6)</span> Please note that in all circumstances the
            refund amount shall be restricted to the amount paid by the client.
          </p>

        </div>
      </div>
    </div>
  )
}
