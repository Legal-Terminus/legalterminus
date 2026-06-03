import React, { Suspense } from 'react'
import "./PrivateLimited.css";
import Breadcrum from '../../Components/Breadcrum/Breadcrum'

// Lazy load below-fold components
const PvtltdPlanandPricing = React.lazy(() => import('../../Components/PvtltdPlanandPricing/PvtltdPlanandPricing'))
const PvtltdZolvitPremium = React.lazy(() => import('../../Components/PvtltdZolvitPremium/PvtltdZolvitPremium'))
const PvtltdTabs = React.lazy(() => import('../../Components/PvtltdTabs/PvtltdTabs'))
const PvtltdCompanyTab = React.lazy(() => import('../../Components/PvtltdCompanyTab/PvtltdCompanyTab'))
const PvtltdPvtTypes = React.lazy(() => import('../../Components/PvtltdPvtTypes/PvtltdPvtTypes'))
const PvtltdRequirementsTab = React.lazy(() => import('../../Components/PvtltdRequirementsTab/PvtltdRequirementsTab'))
const PvtltdProcess = React.lazy(() => import('../../Components/PvtltdProcess/PvtltdProcess'))
const PvtltdDocument = React.lazy(() => import('../../Components/PvtltdDocument/PvtltdDocument'))
const PvtltdFAQ = React.lazy(() => import('../../Components/PvtltdFAQ/PvtltdFAQ'))
const PvtltdTermsCondition = React.lazy(() => import('../../Components/PvtltdTermsCondition/PvtltdTermsCondition'))
const PvtltdGovtCosts = React.lazy(() => import('../../Components/PvtltdGovtCosts/PvtltdGovtCosts'))

const PrivateLimited = () => {
  return (
    <div>
      <div className="pvtltd-page-hero">
        <Breadcrum />
      </div>

      <div className="section-divider" />

      <div id="plans" className="pvtltd-page-pricing">
        <Suspense fallback={<div />}>
          <PvtltdPlanandPricing />
        </Suspense>
      </div>

      <div className="section-divider" />

      <Suspense fallback={<div />}>
        <PvtltdGovtCosts />
      </Suspense>

      <div className="section-divider" />

      <Suspense fallback={<div />}>
        <PvtltdTermsCondition />
      </Suspense>

      <div className="section-divider" />

      <div id="premium">
        <Suspense fallback={<div />}>
          <PvtltdZolvitPremium />
        </Suspense>
      </div>

      <Suspense fallback={<div />}>
        <PvtltdTabs />
      </Suspense>

      <div className="section-divider" />

      <div id="company">
        <Suspense fallback={<div />}>
          <PvtltdCompanyTab />
        </Suspense>
      </div>

      <div className="section-divider" />

      <div id="types">
        <Suspense fallback={<div />}>
          <PvtltdPvtTypes />
        </Suspense>
      </div>

      <div className="section-divider" />

      <div id="requirements">
        <Suspense fallback={<div />}>
          <PvtltdRequirementsTab />
        </Suspense>
      </div>

      <div className="section-divider" />

      <div id="process">
        <Suspense fallback={<div />}>
          <PvtltdProcess />
        </Suspense>
      </div>

      <div className="section-divider" />

      <div id="documents">
        <Suspense fallback={<div />}>
          <PvtltdDocument />
        </Suspense>
      </div>

      <div className="section-divider" />

      <div id="faq">
        <Suspense fallback={<div />}>
          <PvtltdFAQ />
        </Suspense>
      </div>
    </div>
  );
};

export default PrivateLimited
