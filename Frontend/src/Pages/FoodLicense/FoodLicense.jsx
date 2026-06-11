import React, { Suspense } from 'react'
import "./FoodLicense.css";
import FoodLicenseBreadcrum from '../../Components/FoodLicenseBreadcrum/FoodLicenseBreadcrum'

const FoodLicensePlans = React.lazy(() => import('../../Components/FoodLicensePlans/FoodLicensePlans'))
const FoodLicenseGovtCosts = React.lazy(() => import('../../Components/FoodLicenseGovtCosts/FoodLicenseGovtCosts'))
const FoodLicenseTermCondition = React.lazy(() => import('../../Components/FoodLicenseTermCondition/FoodLicenseTermCondition'))
const FoodlicenseZolvitPremium = React.lazy(() => import('../../Components/FoodlicenseZolvitPremium/FoodlicenseZolvitPremium'))
const FoodLicenseTabs = React.lazy(() => import('../../Components/FoodLicenseTabs/FoodLicenseTabs'))
const FoodLicenseOverview = React.lazy(() => import('../../Components/FoodLicenseOverview/FoodLicenseOverview'))
const FoodLicenseFeatures = React.lazy(() => import('../../Components/FoodLicenseFeatures/FoodLicenseFeatures'))
const FoodLicenseBenefits = React.lazy(() => import('../../Components/FoodLicenseBenefits/FoodLicenseBenefits'))
const FoodLicenseElegibility = React.lazy(() => import('../../Components/FoodLicenseElegibility/FoodLicenseElegibility'))
const FoodLicenseDocuments = React.lazy(() => import('../../Components/FoodLicenseDocuments/FoodLicenseDocuments'))
const FoodLicenseFAQ = React.lazy(() => import('../../Components/FoodLicenseFAQ/FoodLicenseFAQ'))

const FoodLicense = () => {
  return (
    <div>
      <div className="opc-page-hero">
        <FoodLicenseBreadcrum />
      </div>

      <div className="section-divider" />

      <div id="plans" className="opc-page-pricing">
        <Suspense fallback={<div />}>
          <FoodLicensePlans />
        </Suspense>
      </div>

      <div className="section-divider" />

      <Suspense fallback={<div />}>
        <FoodLicenseGovtCosts />
      </Suspense>

      <div className="section-divider" />

      <Suspense fallback={<div />}>
        <FoodLicenseTermCondition />
      </Suspense>

      <div className="section-divider" />

      <div id="premium">
        <Suspense fallback={<div />}>
          <FoodlicenseZolvitPremium />
        </Suspense>
      </div>

      <Suspense fallback={<div />}>
        <FoodLicenseTabs />
      </Suspense>

      <div id="food-nav-sections">

      <div className="section-divider" />

      <div id="company">
        <Suspense fallback={<div />}>
          <FoodLicenseOverview />
        </Suspense>
      </div>

      <div className="section-divider" />

      <div id="types">
        <Suspense fallback={<div />}>
          <FoodLicenseFeatures />
        </Suspense>
      </div>

      <div className="section-divider" />

      <div id="requirements">
        <Suspense fallback={<div />}>
          <FoodLicenseBenefits />
        </Suspense>
      </div>

      <div className="section-divider" />

      <div id="process">
        <Suspense fallback={<div />}>
          <FoodLicenseElegibility />
        </Suspense>
      </div>

      <div className="section-divider" />

      <div id="documents">
        <Suspense fallback={<div />}>
          <FoodLicenseDocuments />
        </Suspense>
      </div>

      <div className="section-divider" />

      <div id="faq">
        <Suspense fallback={<div />}>
          <FoodLicenseFAQ />
        </Suspense>
      </div>

      </div>
    </div>
  )
}

export default FoodLicense
