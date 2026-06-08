import React, { Suspense } from 'react';
import "./IEC.css";
import IECBreadcrum from '../../Components/IECBreadcrum/IECBreadcrum';

// Lazy load below-fold components
const IECPlans = React.lazy(() => import('../../Components/IECPlans/IECPlans'));
const IECTermCondition = React.lazy(() => import('../../Components/IECTermCondition/IECTermCondition'));
const IECZolvitpremium = React.lazy(() => import('../../Components/IECZolvitePremium/IECZolvitPremium'));
const IECTabs = React.lazy(() => import('../../Components/IECTabs/IECTabs'));
const IECOverview = React.lazy(() => import('../../Components/IECOverview/IECOverview'));
const IECFeatures = React.lazy(() => import('../../Components/IECFeatures/IECFeatures'));
const IECBenefits = React.lazy(() => import('../../Components/IECBenefits/IECBenefits'));
const IECDocuments = React.lazy(() => import('../../Components/IECDocuments/IECDocuments'));
const IECRequiredDocs = React.lazy(() => import('../../Components/IECRequiredDocs/IECRequiredDocs'));
const IECFAQ = React.lazy(() => import('../../Components/IECFAQ/IECFAQ'));

const IEC = () => {
  return (
    <div>
      <div className="iec-page-hero">
        <IECBreadcrum />
      </div>

      <div className="section-divider" />

      <div id="plans" className="iec-page-pricing">
        <Suspense fallback={<div />}>
          <IECPlans />
        </Suspense>
      </div>

      <div className="section-divider" />

      <Suspense fallback={<div />}>
        <IECTermCondition />
      </Suspense>

      <div className="section-divider" />

      <div id="premium">
        <Suspense fallback={<div />}>
          <IECZolvitpremium />
        </Suspense>
      </div>

      <Suspense fallback={<div />}>
        <IECTabs />
      </Suspense>

      <div className="section-divider" />

      <div id="company">
        <Suspense fallback={<div />}>
          <IECOverview />
        </Suspense>
      </div>

      <div className="section-divider" />

      <div id="types">
        <Suspense fallback={<div />}>
          <IECFeatures />
        </Suspense>
      </div>

      <div className="section-divider" />

      <div id="requirements">
        <Suspense fallback={<div />}>
          <IECBenefits />
        </Suspense>
      </div>

      <div className="section-divider" />

      <div id="process">
        <Suspense fallback={<div />}>
          <IECDocuments />
        </Suspense>
      </div>

      <div className="section-divider" />

      <div id="documents">
        <Suspense fallback={<div />}>
          <IECRequiredDocs />
        </Suspense>
      </div>

      <div className="section-divider" />

      <div id="faq">
        <Suspense fallback={<div />}>
          <IECFAQ />
        </Suspense>
      </div>
    </div>
  );
};

export default IEC;
