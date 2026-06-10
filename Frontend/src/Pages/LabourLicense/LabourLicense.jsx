import React, { Suspense } from 'react'
import "./LabourLicense.css";
import LabourLicenseBreadcrum from '../../Components/LabourLicenseBreadcrum/LabourLicenseBreadcrum'

const LabourLicensePlans = React.lazy(() => import('../../Components/LabourLicensePlans/LabourLicensePlans'))
const LabourLicenseGovtCosts = React.lazy(() => import('../../Components/LabourLicenseGovtCosts/LabourLicenseGovtCosts'))
const LabourLicenseTermCondition = React.lazy(() => import('../../Components/LabourLicenseTermCondition/LabourLicenseTermCondition'))
const LabourlicenseZolvitPremium = React.lazy(() => import('../../Components/LabourlicenseZolvitPremium/LabourlicenseZolvitPremium'))
const LabourLicenseTabs = React.lazy(() => import('../../Components/LabourLicenseTabs/LabourLicenseTabs'))
const LabourLicenseOverview = React.lazy(() => import('../../Components/LabourLicenseOverview/LabourLicenseOverview'))
const LabourLicenseFeatures = React.lazy(() => import('../../Components/LabourLicenseFeatures/LabourLicenseFeatures'))
const LabourLicenseBenefits = React.lazy(() => import('../../Components/LabourLicenseBenefits/LabourLicenseBenefits'))
const LabourLicenseElegibility = React.lazy(() => import('../../Components/LabourLicenseElegibility/LabourLicenseElegibility'))
const LabourLicenseDocuments = React.lazy(() => import('../../Components/LabourLicenseDocuments/LabourLicenseDocuments'))
const LabourLicenseFAQ = React.lazy(() => import('../../Components/LabourLicenseFAQ/LabourLicenseFAQ'))

const LabourLicense = () => {
  return (
    <div>
      <div className="opc-page-hero">
        <LabourLicenseBreadcrum />
      </div>

      <div className="section-divider" />

      <div id="plans" className="opc-page-pricing">
        <Suspense fallback={<div />}>
          <LabourLicensePlans />
        </Suspense>
      </div>

      <div className="section-divider" />

      <Suspense fallback={<div />}>
        <LabourLicenseGovtCosts />
      </Suspense>

      <div className="section-divider" />

      <Suspense fallback={<div />}>
        <LabourLicenseTermCondition />
      </Suspense>

      <div className="section-divider" />

      <div id="premium">
        <Suspense fallback={<div />}>
          <LabourlicenseZolvitPremium />
        </Suspense>
      </div>

      <Suspense fallback={<div />}>
        <LabourLicenseTabs />
      </Suspense>

      <div className="section-divider" />

      <div id="company">
        <Suspense fallback={<div />}>
          <LabourLicenseOverview />
        </Suspense>
      </div>

      <div className="section-divider" />

      <div id="types">
        <Suspense fallback={<div />}>
          <LabourLicenseFeatures />
        </Suspense>
      </div>

      <div className="section-divider" />

      <div id="requirements">
        <Suspense fallback={<div />}>
          <LabourLicenseBenefits />
        </Suspense>
      </div>

      <div className="section-divider" />

      <div id="process">
        <Suspense fallback={<div />}>
          <LabourLicenseElegibility />
        </Suspense>
      </div>

      <div className="section-divider" />

      <div id="documents">
        <Suspense fallback={<div />}>
          <LabourLicenseDocuments />
        </Suspense>
      </div>

      <div className="section-divider" />

      <div id="faq">
        <Suspense fallback={<div />}>
          <LabourLicenseFAQ />
        </Suspense>
      </div>
    </div>
  )
}

export default LabourLicense
