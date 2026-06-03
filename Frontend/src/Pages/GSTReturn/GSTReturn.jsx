import React, { Suspense } from 'react'
import GSTRetBreadcrum from '../../Components/GSTRetBreadcrum/GSTRetBreadcrum'
import GSTRetTabs from '../../Components/GSTRetTabs/GSTRetTabs'

// Lazy load below-the-fold components
const GSTRetOverview = React.lazy(() => import('../../Components/GSTRetOverview/GSTRetOverview'))
const GSTRetAdvantages = React.lazy(() => import('../../Components/GSTRetAdvantages/GSTRetAdvantages'))
const GSTRetTypes = React.lazy(() => import('../../Components/GSTRetTypes/GSTRetTypes'))
const GSTRetEligibility = React.lazy(() => import('../../Components/GSTRetEligibility/GSTRetEligibility'))
const GSTRetDocuments = React.lazy(() => import('../../Components/GSTRetDocuments/GSTRetDocuments'))
const GSTRetProcess = React.lazy(() => import('../../Components/GSTRetProcess/GSTRetProcess'))
const GSTRetFAQ = React.lazy(() => import('../../Components/GSTRetFAQ/GSTRetFAQ'))

const GSTReturn = () => {
  return (
    <div>
      <GSTRetBreadcrum />
      <GSTRetTabs />
      <Suspense fallback={<div />}>
        <GSTRetOverview />
      </Suspense>
      <Suspense fallback={<div />}>
        <GSTRetAdvantages />
      </Suspense>
      <Suspense fallback={<div />}>
        <GSTRetTypes />
      </Suspense>
      <Suspense fallback={<div />}>
        <GSTRetEligibility />
      </Suspense>
      <Suspense fallback={<div />}>
        <GSTRetDocuments />
      </Suspense>
      <Suspense fallback={<div />}>
        <GSTRetProcess />
      </Suspense>
      <Suspense fallback={<div />}>
        <GSTRetFAQ />
      </Suspense>
    </div>
  )
}

export default GSTReturn
