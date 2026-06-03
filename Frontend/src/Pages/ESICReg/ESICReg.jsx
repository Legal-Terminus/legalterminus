import React, { Suspense } from 'react'
import EsicRegBreadcrum from '../../Components/EsicRegBreadcrum/EsicRegBreadcrum'
import ESICRegTabs from '../../Components/ESICRegTabs/ESICRegTabs'

// Lazy load below-the-fold components
const ESICRegOverview = React.lazy(() => import('../../Components/ESICRegOverview/ESICRegOverview'))
const ESICRegBenefits = React.lazy(() => import('../../Components/ESICRegBenefits/ESICRegBenefits'))
const ESICRegListicles = React.lazy(() => import('../../Components/ESICRegListicles/ESICRegListicles'))
const ESICRegProcess = React.lazy(() => import('../../Components/EPFRegProcess/EPFRegProcess'))
const ESICRegPenalties = React.lazy(() => import('../../Components/ESICRegPenalties/ESICRegPenalties'))
const ESICRegWhy = React.lazy(() => import('../../Components/ESICRegWhy/ESICRegWhy'))
const ESICRegFAQ = React.lazy(() => import('../../Components/ESICRegFAQ/ESICRegFAQ'))

const ESICReg = () => {
  return (
    <div>
      <EsicRegBreadcrum />
      <ESICRegTabs />
      <Suspense fallback={<div />}>
        <ESICRegOverview />
      </Suspense>
      <Suspense fallback={<div />}>
        <ESICRegBenefits />
      </Suspense>
      <Suspense fallback={<div />}>
        <ESICRegListicles />
      </Suspense>
      <Suspense fallback={<div />}>
        <ESICRegProcess />
      </Suspense>
      <Suspense fallback={<div />}>
        <ESICRegPenalties />
      </Suspense>
      <Suspense fallback={<div />}>
        <ESICRegWhy />
      </Suspense>
      <Suspense fallback={<div />}>
        <ESICRegFAQ />
      </Suspense>
    </div>
  )
}

export default ESICReg
