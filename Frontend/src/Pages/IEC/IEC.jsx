import React, { Suspense } from 'react';
import IECBreadcrum from '../../Components/IECBreadcrum/IECBreadcrum';

// Lazy load below-fold components
const IECPlans = React.lazy(() => import('../../Components/IECPlans/IECPlans'));
const IECTermCondition = React.lazy(() => import('../../Components/IECTermCondition/IECTermCondition'));
const IECZolvitpremium = React.lazy(() => import('../../Components/IECZolvitePremium/IECZolvitPremium'));
const IECTabs = React.lazy(() => import('../../Components/IECTabs/IECTabs'));
const IECOverview = React.lazy(() => import('../../Components/IECOverview/IECOverview'));
const IECFeatures = React.lazy(() => import('../../Components/IECFeatures/IECFeatures'));
const IECBenefits = React.lazy(() => import('../../Components/IECBenefits/IECBenefits'));
const IECElegibility = React.lazy(() => import('../../Components/IECElegibility/IECElegibility'));
const IECDocuments = React.lazy(() => import('../../Components/IECDocuments/IECDocuments'));
const IECFAQ = React.lazy(() => import('../../Components/IECFAQ/IECFAQ'));
const IECProcess = React.lazy(() => import('../../Components/IECProcess/IECProcess'));
const IECWhy = React.lazy(() => import('../../Components/IECWhy/IECWhy'));
const IECOurclints = React.lazy(() => import('../../Components/IECOurclints/IECOurclints'));

const IEC = () => {
  return (
    <div>
      <IECBreadcrum />
      <div id="plans">
        <Suspense fallback={<div />}>
          <IECPlans />
        </Suspense>
      </div>
      {/* <IECTermCondition /> */}
      <div id="premium">
        <Suspense fallback={<div />}>
          <IECZolvitpremium />
        </Suspense>
      </div>
      <Suspense fallback={<div />}>
        <IECTabs />
      </Suspense>
      <div id="company">
        <Suspense fallback={<div />}>
          <IECOverview />
        </Suspense>
      </div>
      <div id="types">
        <Suspense fallback={<div />}>
          <IECFeatures />
        </Suspense>
      </div>
      <div id="requirements">
        <Suspense fallback={<div />}>
          <IECBenefits />
        </Suspense>
      </div>
      <div id="process">
        {/* <IECElegibility /> */}
      </div>
      <div id="documents">
        {/* <IECDocuments /> */}
      </div>
    <div id="faq">
        <Suspense fallback={<div />}>
          <IECFAQ />
        </Suspense>
      </div>

      <Suspense fallback={<div />}>
        <IECProcess />
      </Suspense>
      <Suspense fallback={<div />}>
        <IECWhy />
      </Suspense>
      <Suspense fallback={<div />}>
        <IECOurclints />
      </Suspense>
    </div>
  );
};

export default IEC;
