import React, { Suspense } from 'react'
import '../PrivateLimitedCopy/PrivateLimitedCopy.css'
import StartupOdishaBreadcrum from '../../Components/StartupOdishaBreadcrum/StartupOdishaBreadcrum'
import StartupOdishaPricing from '../../Components/StartupOdishaPricing/StartupOdishaPricing'
import StartupOdishaTnC from '../../Components/StartupOdishaTnC/StartupOdishaTnC'
import StartupOdishaGovtCosts from '../../Components/StartupOdishaGovtCosts/StartupOdishaGovtCosts'
import StartupOdishaPriority from '../../Components/StartupOdishaPriority/StartupOdishaPriority'
import StartupOdishaTabs from '../../Components/StartupOdishaTabs/StartupOdishaTabs'

const StartupOdishaOverview = React.lazy(() => import('../../Components/StartupOdishaOverview/StartupOdishaOverview'))
const StartupOdishaTypes = React.lazy(() => import('../../Components/StartupOdishaTypes/StartupOdishaTypes'))
const StartupOdishaBenefits = React.lazy(() => import('../../Components/StartupOdishaBenefits/StartupOdishaBenefits'))
const StartupOdishaProcess = React.lazy(() => import('../../Components/StartupOdishaProcess/StartupOdishaProcess'))
const StartupOdishaDocuments = React.lazy(() => import('../../Components/StartupOdishaDocuments/StartupOdishaDocuments'))
const StartupOdishaFAQ = React.lazy(() => import('../../Components/StartupOdishaFAQ/StartupOdishaFAQ'))

const StartupOdisha = () => {
  return (
    <div>
      <div className="copy-page-hero">
        <StartupOdishaBreadcrum />
      </div>

      <div className="section-divider" />

      <div id="plans" className="copy-page-pricing">
        <StartupOdishaPricing />
      </div>

      <div className="section-divider" />

      <StartupOdishaGovtCosts />

      <div className="section-divider" />

      <StartupOdishaTnC />

      <div className="section-divider" />

      <div id="premium">
        <StartupOdishaPriority />
      </div>

      <StartupOdishaTabs />

      <div id="sto-nav-sections">

      <div className="section-divider" />

      <div id="overview">
        <Suspense fallback={<div />}>
          <StartupOdishaOverview />
        </Suspense>
      </div>

      <div className="section-divider" />

      <div id="types">
        <Suspense fallback={<div />}>
          <StartupOdishaTypes />
        </Suspense>
      </div>

      <div className="section-divider" />

      <div id="benefits">
        <Suspense fallback={<div />}>
          <StartupOdishaBenefits />
        </Suspense>
      </div>

      <div className="section-divider" />

      <div id="process">
        <Suspense fallback={<div />}>
          <StartupOdishaProcess />
        </Suspense>
      </div>

      <div className="section-divider" />

      <div id="documents">
        <Suspense fallback={<div />}>
          <StartupOdishaDocuments />
        </Suspense>
      </div>

      <div className="section-divider" />

      <div id="faq">
        <Suspense fallback={<div />}>
          <StartupOdishaFAQ />
        </Suspense>
      </div>

      </div>
    </div>
  )
}

export default StartupOdisha
