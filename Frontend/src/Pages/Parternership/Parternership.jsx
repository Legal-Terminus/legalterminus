import React, { Suspense } from 'react'
import "./Parternership.css";
import PRFbreadcrum from '../../Components/PFRbreadcrum/PFRbreadcrum'

// Lazy load below-fold components
const PRFlandpricing = React.lazy(() => import('../../Components/PRFlandpricing/PRFlandpricing'))
const PFRtermscondition = React.lazy(() => import('../../Components/PFRtermscondition/PFRtermscondition'))
const PFRGovtCosts = React.lazy(() => import('../../Components/PFRGovtCosts/PFRGovtCosts'))
const PFRpremium = React.lazy(() => import('../../Components/PFRpremium/PFRpremium'))
const PFRtabs = React.lazy(() => import('../../Components/PFRtabs/PFRtabs'))
const PFRcompanytab = React.lazy(() => import('../../Components/PFRcompanytab/PFRcompanytab'))
const PFRtypes = React.lazy(() => import('../../Components/PFRtypes/PFRtypes'))
const PFRrequirmentTabs = React.lazy(() => import('../../Components/PFRrequirmentTabs/PFRrequirmentTabs'))
const PFRprocess = React.lazy(() => import('../../Components/PFRprocess/PFRprocess'))
const PFRdocument = React.lazy(() => import('../../Components/PFRdocument/PFRdocument'))
const PFRfaq = React.lazy(() => import('../../Components/PFRfaq/PFRfaq'))

const PrivateLimited = () => {
  return (
    <div>
      <div className="pfr-page-hero">
        <PRFbreadcrum />
      </div>

      <div className="section-divider" />

      <div id="plans" className="pfr-page-pricing">
        <Suspense fallback={<div />}>
          <PRFlandpricing />
        </Suspense>
      </div>

      <div className="section-divider" />

      <Suspense fallback={<div />}>
        <PFRGovtCosts />
      </Suspense>

      <div className="section-divider" />

      <Suspense fallback={<div />}>
        <PFRtermscondition />
      </Suspense>

      <div className="section-divider" />

      <div id="premium">
        <Suspense fallback={<div />}>
          <PFRpremium />
        </Suspense>
      </div>

      <Suspense fallback={<div />}>
        <PFRtabs />
      </Suspense>

      <div className="section-divider" />

      <div id="company">
        <Suspense fallback={<div />}>
          <PFRcompanytab />
        </Suspense>
      </div>

      <div className="section-divider" />

      <div id="types">
        <Suspense fallback={<div />}>
          <PFRtypes />
        </Suspense>
      </div>

      <div className="section-divider" />

      <div id="requirements">
        <Suspense fallback={<div />}>
          <PFRrequirmentTabs />
        </Suspense>
      </div>

      <div className="section-divider" />

      <div id="process">
        <Suspense fallback={<div />}>
          <PFRprocess />
        </Suspense>
      </div>

      <div className="section-divider" />

      <div id="documents">
        <Suspense fallback={<div />}>
          <PFRdocument />
        </Suspense>
      </div>

      <div className="section-divider" />

      <div id="faq">
        <Suspense fallback={<div />}>
          <PFRfaq />
        </Suspense>
      </div>
    </div>
  );
};

export default PrivateLimited
