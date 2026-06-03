import React, { Suspense } from 'react'
import EPFRegBreadcrum from '../../Components/EPFRegBreadcrum/EPFRegBreadcrum'
import EPFRegTabs from '../../Components/EPFRegTabs/EPFRegTabs'

// Lazy load below-the-fold components
const EPFRegOverview = React.lazy(() => import('../../Components/EPFRegOverview/EPFRegOverview'))
const EPFRegBenefits = React.lazy(() => import('../../Components/EPFRegBenefits/EPFRegBenefits'))
const EPFRegApplicability = React.lazy(() => import('../../Components/EPFRegApplicability/EPFRegApplicability'))
const EPFRegDocuments = React.lazy(() => import('../../Components/EPFRegDocuments/EPFRegDocuments'))
const EPFRegProcess = React.lazy(() => import('../../Components/EPFRegProcess/EPFRegProcess'))
const EPFRegPenalties = React.lazy(() => import('../../Components/EPFRegPenalties/EPFRegPenalties'))
const EPFRegWhy = React.lazy(() => import('../../Components/EPFRegWhy/EPFRegWhy'))
const EPFRegFAQ = React.lazy(() => import('../../Components/EPFRegFAQ/EPFRegFAQ'))

const EPFReg = () => {
  return (
    <div>
      <EPFRegBreadcrum />
      <EPFRegTabs />
      <Suspense fallback={<div />}>
        <EPFRegOverview />
      </Suspense>
      <Suspense fallback={<div />}>
        <EPFRegBenefits />
      </Suspense>
      <Suspense fallback={<div />}>
        <EPFRegApplicability />
      </Suspense>
      <Suspense fallback={<div />}>
        <EPFRegDocuments />
      </Suspense>
      <Suspense fallback={<div />}>
        <EPFRegProcess />
      </Suspense>
      <Suspense fallback={<div />}>
        <EPFRegPenalties />
      </Suspense>
      <Suspense fallback={<div />}>
        <EPFRegWhy />
      </Suspense>
      <Suspense fallback={<div />}>
        <EPFRegFAQ />
      </Suspense>
    </div>
  )
}

export default EPFReg
