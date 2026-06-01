import React, { Suspense } from 'react'
import GSTRegBreadcrum from '../../Components/GSTRegBreadcrum/GSTRegBreadcrum'

const GSTRegPlans = React.lazy(() => import('../../Components/GSTRegPlans/GSTRegPlans'))
const GSTRegTabs = React.lazy(() => import('../../Components/GSTRegTabs/GSTRegTabs'))
const GSTRegOverview = React.lazy(() => import('../../Components/GSTRegOverview/GSTRegOverview'))
const GSTRegAdvantages = React.lazy(() => import('../../Components/GSTRegAdvantages/GSTRegAdvantages'))
const GSTRegTypes = React.lazy(() => import('../../Components/GSTRegTypes/GSTRegTypes'))
const GSTRegProcess = React.lazy(() => import('../../Components/GSTRegProcess/GSTRegProcess'))
const GSTRegTerms = React.lazy(() => import('../../Components/GSTRegTerms/GSTRegTerms'))
const GSTRegDocument = React.lazy(() => import('../../Components/GSTRegDocument/GSTRegDocument'))
const GSTRegFAQ = React.lazy(() => import('../../Components/GSTRegFAQ/GSTRegFAQ'))

const GSTRegistration = () => {
  return (
    <div>
      <GSTRegBreadcrum />

      <div id="plans">
        <Suspense fallback={<div />}>
          <GSTRegPlans />
        </Suspense>
      </div>

      <Suspense fallback={<div />}>
        <GSTRegTerms />
      </Suspense>

      <Suspense fallback={<div />}>
        <GSTRegTabs />
      </Suspense>

      <div id="overview">
        <Suspense fallback={<div />}>
          <GSTRegOverview />
        </Suspense>
      </div>

      <div id="benefits">
        <Suspense fallback={<div />}>
          <GSTRegAdvantages />
        </Suspense>
      </div>

      <div id="types">
        <Suspense fallback={<div />}>
          <GSTRegTypes />
        </Suspense>
      </div>

      <div id="process">
        <Suspense fallback={<div />}>
          <GSTRegProcess />
        </Suspense>
      </div>

      <div id="documents">
        <Suspense fallback={<div />}>
          <GSTRegDocument />
        </Suspense>
      </div>

      <div id="faq">
        <Suspense fallback={<div />}>
          <GSTRegFAQ />
        </Suspense>
      </div>
    </div>
  )
}

export default GSTRegistration
