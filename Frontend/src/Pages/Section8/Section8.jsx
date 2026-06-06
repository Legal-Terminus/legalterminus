import React, { Suspense } from 'react'
import Section8Breadcrum from '../../Components/Section8Breadcrum/Section8Breadcrum'

// Lazy load below-fold components
const Section8FAQ = React.lazy(() => import('../../Components/Section8FAQ/Section8FAQ'))
const Section8PlanAndPricing = React.lazy(() => import('../../Components/Secton8PlanAndPricing/Secton8PlanAndPricing'))
const Section8GovtCosts = React.lazy(() => import('../../Components/Section8GovtCosts/Section8GovtCosts'))
const Section8TermsCondition = React.lazy(() => import('../../Components/Section8TermsCondition/Section8TermsCondition'))
const Section8Premium = React.lazy(() => import('../../Components/Section8Premium/Section8Premium'))
const Section8Tabs = React.lazy(() => import('../../Components/Section8Tabs/Section8Tabs'))
const Section8CompanyTabs = React.lazy(() => import('../../Components/Section8CompanyTabs/Section8CompanyTabs'))
const Section8PvtTypes = React.lazy(() => import('../../Components/Section8PvtTypes/Section8PvtTypes'))
const Section8RequirementsTab = React.lazy(() => import('../../Components/Section8RequirementsTab/Section8RequirementsTab'))
const Section8Process = React.lazy(() => import('../../Components/Section8Process/Section8Process'))
const Section8Document = React.lazy(() => import('../../Components/Section8Document/Section8Document'))

const Section8 = () => {
  return (
    <div>
      <Section8Breadcrum />
      <div id="plans">
        <Suspense fallback={<div />}>
          <Section8PlanAndPricing/>
        </Suspense>
      </div>
      <div className="section-divider" />

      <Suspense fallback={<div />}>
        <Section8GovtCosts/>
      </Suspense>

      <div className="section-divider" />

      <Suspense fallback={<div />}>
        <Section8TermsCondition/>
      </Suspense>

      <div id="premium">
        <Suspense fallback={<div />}>
          <Section8Premium/>
        </Suspense>
      </div>
      <Suspense fallback={<div />}>
        <Section8Tabs/>
      </Suspense>
      <div id="company">
        <Suspense fallback={<div />}>
          <Section8CompanyTabs/>
        </Suspense>
      </div>
      <div id="types">
        <Suspense fallback={<div />}>
          <Section8PvtTypes/>
        </Suspense>
      </div>
      <div id="requirements">
        <Suspense fallback={<div />}>
          <Section8RequirementsTab/>
        </Suspense>
      </div>
      <div id="process">
        <Suspense fallback={<div />}>
          <Section8Process/>
        </Suspense>
      </div>
      <div id="documents">
        <Suspense fallback={<div />}>
          <Section8Document/>
        </Suspense>
      </div>
      <div id="faq">
        <Suspense fallback={<div />}>
          <Section8FAQ/>
        </Suspense>
      </div>

    </div>
  )
}

export default Section8
