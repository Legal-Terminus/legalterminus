import React, { Suspense } from 'react'
import FoodLicenseBreadcrum from '../../Components/FoodLicenseBreadcrum/FoodLicenseBreadcrum'

// Lazy load below-fold components
const FoodLicensePlans = React.lazy(() => import('../../Components/FoodLicensePlans/FoodLicensePlans'))
const FoodLicenseTermCondition = React.lazy(() => import('../../Components/FoodLicenseTermCondition/FoodLicenseTermCondition'))
const FoodlicenseZolvitPremium = React.lazy(() => import('../../Components/FoodlicenseZolvitPremium/FoodlicenseZolvitPremium'))
const FoodLicenseTabs = React.lazy(() => import('../../Components/FoodLicenseTabs/FoodLicenseTabs'))
const FoodLicenseOverview = React.lazy(() => import('../../Components/FoodLicenseOverview/FoodLicenseOverview'))
const FoodLicenseFeatures = React.lazy(() => import('../../Components/FoodLicenseFeatures/FoodLicenseFeatures'))
const FoodLicenseBenefits = React.lazy(() => import('../../Components/FoodLicenseBenefits/FoodLicenseBenefits'))
const FoodLicenseElegibility = React.lazy(() => import('../../Components/FoodLicenseElegibility/FoodLicenseElegibility'))
const FoodLicenseDocuments = React.lazy(() => import('../../Components/FoodLicenseDocuments/FoodLicenseDocuments'))
const FoodLicenseFAQ = React.lazy(() => import('../../Components/FoodLicenseFAQ/FoodLicenseFAQ'))
const FoodLicenseProcess = React.lazy(() => import('../../Components/FoodLicenseProcess/FoodLicenseProcess'))
const FoodLicenseWhy = React.lazy(() => import('../../Components/FoodLicenseWhy/FoodLicenseWhy'))
const FoodLicenseOurClints = React.lazy(() => import('../../Components/FoodLicenseOurClints/FoodLicenseOurClints'))

const FoodLicense = () => {
  return (
    <div>
      <FoodLicenseBreadcrum />

      <div id="plans">
        <Suspense fallback={<div />}>
          <FoodLicensePlans />
        </Suspense>
      </div>

      <Suspense fallback={<div />}>
        <FoodLicenseTermCondition />
      </Suspense>

      <div id="premium">
        <Suspense fallback={<div />}>
          <FoodlicenseZolvitPremium />
        </Suspense>
      </div>

      <Suspense fallback={<div />}>
        <FoodLicenseTabs />
      </Suspense>

      <div id="company">
        <Suspense fallback={<div />}>
          <FoodLicenseOverview />
        </Suspense>
      </div>

      <div id="types">
        <Suspense fallback={<div />}>
          <FoodLicenseFeatures />
        </Suspense>
      </div>

      <div id="requirements">
        <Suspense fallback={<div />}>
          <FoodLicenseBenefits />
        </Suspense>
      </div>

      <div id="process">
        {/* <FoodLicenseElegibility /> */}
      </div>

      <div id="documents">
        {/* <FoodLicenseDocuments /> */}
      </div>

      <div id="faq">
        <Suspense fallback={<div />}>
          <FoodLicenseFAQ />
        </Suspense>
      </div>

      <Suspense fallback={<div />}>
        <FoodLicenseProcess />
      </Suspense>
      <Suspense fallback={<div />}>
        <FoodLicenseWhy />
      </Suspense>
      <Suspense fallback={<div />}>
        <FoodLicenseOurClints />
      </Suspense>
     
    </div>
  )
}

export default FoodLicense
