import React, { Suspense } from 'react'
import EsicRegBreadcrum from '../../Components/EsicRegBreadcrum/EsicRegBreadcrum'
import ESICRegPricing from '../../Components/ESICRegPricing/ESICRegPricing'
import ESICGovtCosts from '../../Components/ESICGovtCosts/ESICGovtCosts'
import ESICRegTermsCondition from '../../Components/ESICRegTermsCondition/ESICRegTermsCondition'
import ESICRegPriority from '../../Components/ESICRegPriority/ESICRegPriority'
import ESICRegTabs from '../../Components/ESICRegTabs/ESICRegTabs'

const ESICRegOverview = React.lazy(() => import('../../Components/ESICRegOverview/ESICRegOverview'))
const ESICRegBenefits = React.lazy(() => import('../../Components/ESICRegBenefits/ESICRegBenefits'))
const ESICRegProcess = React.lazy(() => import('../../Components/ESICRegProcess/ESICRegProcess'))
const ESICRegListicles = React.lazy(() => import('../../Components/ESICRegListicles/ESICRegListicles'))
const ESICRegPenalties = React.lazy(() => import('../../Components/ESICRegPenalties/ESICRegPenalties'))
const ESICRegFAQ = React.lazy(() => import('../../Components/ESICRegFAQ/ESICRegFAQ'))

const ESICReg = () => {
  return (
    <div>
      <div className="copy-page-hero">
        <EsicRegBreadcrum />
      </div>

      <div className="section-divider" />

      <div id="plans" className="copy-page-pricing">
        <ESICRegPricing />
      </div>

      <div className="section-divider" />

      <ESICGovtCosts />

      <div className="section-divider" />

      <ESICRegTermsCondition />

      <div className="section-divider" />

      <div id="premium">
        <ESICRegPriority />
      </div>

      <ESICRegTabs />

      <div className="section-divider" />

      <div id="overview">
        <Suspense fallback={<div />}>
          <ESICRegOverview />
        </Suspense>
      </div>

      <div className="section-divider" />

      <div id="benefits">
        <Suspense fallback={<div />}>
          <ESICRegBenefits />
        </Suspense>
      </div>

      <div className="section-divider" />

      <div id="process">
        <Suspense fallback={<div />}>
          <ESICRegProcess />
        </Suspense>
      </div>

      <div className="section-divider" />

      <div id="documents">
        <Suspense fallback={<div />}>
          <ESICRegListicles />
        </Suspense>
      </div>

      <div className="section-divider" />

      <div id="penalties">
        <Suspense fallback={<div />}>
          <ESICRegPenalties />
        </Suspense>
      </div>

      <div className="section-divider" />

      <div id="faq">
        <Suspense fallback={<div />}>
          <ESICRegFAQ />
        </Suspense>
      </div>
    </div>
  )
}

export default ESICReg
