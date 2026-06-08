import React, { Suspense } from 'react'
import './ShopReg.css'
import ShopRegBreadcrum from '../../Components/ShopRegBreadcrum/ShopRegBreadcrum'
import ShopRegPlanandPricing from '../../Components/ShopRegPlanandPricing/ShopRegPlanandPricing'
import ShopGovtCosts from '../../Components/ShopGovtCosts/ShopGovtCosts'

// Lazy load below-fold components
const ShopRegTerms = React.lazy(() => import('../../Components/ShopRegTerms/ShopRegTerms'))
const ShopRegPriority = React.lazy(() => import('../../Components/ShopRegPriority/ShopRegPriority'))
const ShopRegTabs = React.lazy(() => import('../../Components/ShopRegTabs/ShopRegTabs'))
const ShopRegOverview = React.lazy(() => import('../../Components/ShopRegOverview/ShopRegOverview'))
const ShopRegTypes = React.lazy(() => import('../../Components/ShopRegTypes/ShopRegTypes'))
const ShopRegBenefits = React.lazy(() => import('../../Components/ShopRegBenefits/ShopRegBenefits'))
const ShopRegProcess = React.lazy(() => import('../../Components/ShopRegProcess/ShopRegProcess'))
const ShopRegDocuments = React.lazy(() => import('../../Components/ShopRegDocuments/ShopRegDocuments'))
const ShopRegFAQ = React.lazy(() => import('../../Components/ShopRegFAQ/ShopRegFAQ'))

const ShopReg = () => {
  return (
    <div>
      <div className="shop-page-hero">
        <ShopRegBreadcrum />
      </div>

      <div className="section-divider" />

      <div id="shop-plans" className="shop-page-pricing">
        <ShopRegPlanandPricing />
      </div>

      <div className="section-divider" />

      <ShopGovtCosts />

      <div className="section-divider" />

      <Suspense fallback={<div />}>
        <ShopRegTerms />
      </Suspense>

      <div className="section-divider" />

      <Suspense fallback={<div />}>
        <div id="shop-premium">
          <ShopRegPriority />
        </div>
      </Suspense>

      <Suspense fallback={<div />}>
        <ShopRegTabs />
      </Suspense>

      <div className="section-divider" />

      <Suspense fallback={<div />}>
        <div id="shop-company">
          <ShopRegOverview />
        </div>
      </Suspense>

      <div className="section-divider" />

      <Suspense fallback={<div />}>
        <div id="shop-types">
          <ShopRegTypes />
        </div>
      </Suspense>

      <div className="section-divider" />

      <Suspense fallback={<div />}>
        <div id="shop-requirements">
          <ShopRegBenefits />
        </div>
      </Suspense>

      <div className="section-divider" />

      <Suspense fallback={<div />}>
        <div id="shop-process">
          <ShopRegProcess />
        </div>
      </Suspense>

      <div className="section-divider" />

      <Suspense fallback={<div />}>
        <div id="shop-documents">
          <ShopRegDocuments />
        </div>
      </Suspense>

      <div className="section-divider" />

      <Suspense fallback={<div />}>
        <div id="shop-faq">
          <ShopRegFAQ />
        </div>
      </Suspense>

    </div>
  )
}

export default ShopReg
