import React, { Suspense } from 'react'
import GSTRegBreadcrum from '../../Components/GSTRegBreadcrum/GSTRegBreadcrum'

// Lazy load below-fold components
const GSTRegPlans = React.lazy(() => import('../../Components/GSTRegPlans/GSTRegPlans'))
const GSTRegTabs = React.lazy(() => import('../../Components/GSTRegTabs/GSTRegTabs'))
const GSTRegOverview = React.lazy(() => import('../../Components/GSTRegOverview/GSTRegOverview'))
const GSTRegAdvantages = React.lazy(() => import('../../Components/GSTRegAdvantages/GSTRegAdvantages'))
const GSTRegEligibility = React.lazy(() => import('../../Components/GSTRegEligibility/GSTRegEligibility'))
const GSTRegDocument = React.lazy(() => import('../../Components/GSTRegDocument/GSTRegDocument'))
const GSTRegProcess = React.lazy(() => import('../../Components/GSTRegProcess/GSTRegProcess'))
const GSTRegFeatures = React.lazy(() => import('../../Components/GSTRegFeatures/GSTRegFeatures'))
const GSTRegTypes = React.lazy(() => import('../../Components/GSTRegTypes/GSTRegTypes'))
const GSTRegFAQ = React.lazy(() => import('../../Components/GSTRegFAQ/GSTRegFAQ'))

const GSTRegistration = () => {
  return (
    <div>
      <GSTRegBreadcrum />
      <Suspense fallback={<div />}>
        <GSTRegPlans />
      </Suspense>
      <Suspense fallback={<div />}>
        <GSTRegTabs />
      </Suspense>
      <Suspense fallback={<div />}>
        <GSTRegOverview />
      </Suspense>
      <Suspense fallback={<div />}>
        <GSTRegAdvantages />
      </Suspense>
      {/* <Suspense fallback={<div />}>
        <GSTRegEligibility />
      </Suspense> */}
      <Suspense fallback={<div />}>
        <GSTRegDocument />
      </Suspense>
      <Suspense fallback={<div />}>
        <GSTRegProcess />
      </Suspense>
      {/* <Suspense fallback={<div />}>
        <GSTRegFeatures />
      </Suspense> */}
      {/* <Suspense fallback={<div />}>
        <GSTRegTypes />
      </Suspense> */}
      <Suspense fallback={<div />}>
        <GSTRegFAQ />
      </Suspense>
    </div>
  )
}

export default GSTRegistration
