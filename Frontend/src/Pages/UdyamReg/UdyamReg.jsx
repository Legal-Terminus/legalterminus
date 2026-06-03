import React, { Suspense } from 'react'
import UdyamRegBreadcrum from '../../Components/UdyamRegBreadcrum/UdyamRegBreadcrum'
import UdyamRegTabs from '../../Components/UdyamRegTabs/UdyamRegTabs'

// Lazy load below-the-fold components
const UdyamRegAbout = React.lazy(() => import('../../Components/UdyamRegAbout/UdyamRegAbout'))
const UdyamRegWho = React.lazy(() => import('../../Components/UdyamRegWho/UdyamRegWho'))
const UdyamRegBenefits = React.lazy(() => import('../../Components/UdyamRegBenefits/UdyamRegBenefits'))
const UdyamRegEligibility = React.lazy(() => import('../../Components/UdyamRegEligibility/UdyamRegEligibility'))
const UdyamRegDocuments = React.lazy(() => import('../../Components/UdyamRegDocuments/UdyamRegDocuments'))
const UdyamRegProcess = React.lazy(() => import('../../Components/UdyamRegProcess/UdyamRegProcess'))
const UdyamRegWhy = React.lazy(() => import('../../Components/UdyamRegWhy/UdyamRegWhy'))
const UdyamRegFAQ = React.lazy(() => import('../../Components/UdyamRegFAQ/UdyamRegFAQ'))

const UdyamReg = () => {
  return (
    <div>
      <UdyamRegBreadcrum />
      <UdyamRegTabs />
      <Suspense fallback={<div />}>
        <UdyamRegAbout />
      </Suspense>
      <Suspense fallback={<div />}>
        <UdyamRegWho />
      </Suspense>
      <Suspense fallback={<div />}>
        <UdyamRegBenefits />
      </Suspense>
      <Suspense fallback={<div />}>
        <UdyamRegEligibility />
      </Suspense>
      <Suspense fallback={<div />}>
        <UdyamRegDocuments />
      </Suspense>
      <Suspense fallback={<div />}>
        <UdyamRegProcess />
      </Suspense>
      <Suspense fallback={<div />}>
        <UdyamRegWhy />
      </Suspense>
      <Suspense fallback={<div />}>
        <UdyamRegFAQ />
      </Suspense>
    </div>
  )
}

export default UdyamReg
