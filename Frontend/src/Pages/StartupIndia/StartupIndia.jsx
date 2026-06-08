import React, { Suspense } from 'react'
import '../PrivateLimitedCopy/PrivateLimitedCopy.css'
import StartupIndiaBreadcrum from '../../Components/StartupIndiaBreadcrum/StartupIndiaBreadcrum'
import StartupIndiaPricing from '../../Components/StartupIndiaPricing/StartupIndiaPricing'
import StartupIndiaTnC from '../../Components/StartupIndiaTnC/StartupIndiaTnC'
import StartupIndiaGovtCosts from '../../Components/StartupIndiaGovtCosts/StartupIndiaGovtCosts'
import StartupIndiaPriority from '../../Components/StartupIndiaPriority/StartupIndiaPriority'
import StartupIndiaTabs from '../../Components/StartupIndiaTabs/StartupIndiaTabs'

const StartupIndiaOverview = React.lazy(() => import('../../Components/StartupIndiaOverview/StartupIndiaOverview'))
const StartupIndiaTypes = React.lazy(() => import('../../Components/StartupIndiaTypes/StartupIndiaTypes'))
const StartupIndiaBenefits = React.lazy(() => import('../../Components/StartupIndiaBenefits/StartupIndiaBenefits'))
const StartupIndiaProcess = React.lazy(() => import('../../Components/StartupIndiaProcess/StartupIndiaProcess'))
const StartupIndiaDocuments = React.lazy(() => import('../../Components/StartupIndiaDocuments/StartupIndiaDocuments'))
const StartupIndiaFAQ = React.lazy(() => import('../../Components/StartupIndiaFAQ/StartupIndiaFAQ'))

const StartupIndia = () => {
  return (
    <div>
      <div className="copy-page-hero">
        <StartupIndiaBreadcrum />
      </div>

      <div className="section-divider" />

      <div id="plans" className="copy-page-pricing">
        <StartupIndiaPricing />
      </div>

      <div className="section-divider" />

      <StartupIndiaGovtCosts />

      <div className="section-divider" />

      <StartupIndiaTnC />

      <div className="section-divider" />

      <div id="premium">
        <StartupIndiaPriority />
      </div>

      <StartupIndiaTabs />

      <div className="section-divider" />

      <div id="overview">
        <Suspense fallback={<div />}>
          <StartupIndiaOverview />
        </Suspense>
      </div>

      <div className="section-divider" />

      <div id="types">
        <Suspense fallback={<div />}>
          <StartupIndiaTypes />
        </Suspense>
      </div>

      <div className="section-divider" />

      <div id="benefits">
        <Suspense fallback={<div />}>
          <StartupIndiaBenefits />
        </Suspense>
      </div>

      <div className="section-divider" />

      <div id="process">
        <Suspense fallback={<div />}>
          <StartupIndiaProcess />
        </Suspense>
      </div>

      <div className="section-divider" />

      <div id="documents">
        <Suspense fallback={<div />}>
          <StartupIndiaDocuments />
        </Suspense>
      </div>

      <div className="section-divider" />

      <div id="faq">
        <Suspense fallback={<div />}>
          <StartupIndiaFAQ />
        </Suspense>
      </div>
    </div>
  )
}

export default StartupIndia
