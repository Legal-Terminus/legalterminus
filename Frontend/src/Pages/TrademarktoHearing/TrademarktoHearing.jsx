import React, { Suspense } from "react";

import TrademarktoHearingBreadcrum from "../../Components/TrademarktoHearingBreadcrum/TrademarktoHearingBreadcrum";

// Lazy load below-fold components
const TrademarktoHearingPlans = React.lazy(() => import("../../Components/TrademarktoHearingPlans/TrademarktoHearingPlans"));
const TrademarktoHearingTermCondition = React.lazy(() => import("../../Components/TrademarktoHearingTermCondition/TrademarktoHearingTermCondition"));
const TrademarktoHearingZolvitPremium = React.lazy(() => import("../../Components/TrademarktoHearingZolvitPremium/TrademarktoHearingZolvitPremium"));
const TrademarktoHearingTabs = React.lazy(() => import("../../Components/TrademarktoHearingTabs/TrademarktoHearingTabs"));
const TrademarktoHearingOverview = React.lazy(() => import("../../Components/TrademarktoHearingOverview/TrademarktoHearingOverview"));
const TrademarktoHearingFeatures = React.lazy(() => import("../../Components/TrademarktoHearingFeatures/TrademarktoHearingFeatures"));
const TrademarktoHearingBenefits = React.lazy(() => import("../../Components/TrademarktoHearingBenefits/TrademarktoHearingBenefits"));
const TrademarktoHearingElegibility = React.lazy(() => import("../../Components/TrademarktoHearingElegibility/TrademarktoHearingElegibility"));
const TrademarktoHearingDocuments = React.lazy(() => import("../../Components/TrademarktoHearingDocuments/TrademarktoHearingDocuments"));
const TrademarktoHearingFAQ = React.lazy(() => import("../../Components/TrademarktoHearingFAQ/TrademarktoHearingFAQ"));
const TrademarktoHearingProcess = React.lazy(() => import("../../Components/TrademarktoHearingProcess/TrademarktoHearingProcess"));
const TrademarktoHearingWhy = React.lazy(() => import("../../Components/TrademarktoHearingWhy/TrademarktoHearingWhy"));
const TrademarktoHearingOurClients = React.lazy(() => import("../../Components/TrademarktoHearingOurClients/TrademarktoHearingOurClients"));

const TradeLicense = () => {
  return (
    <div>
      <TrademarktoHearingBreadcrum />

      <div id="plans">
        <Suspense fallback={<div />}>
          <TrademarktoHearingPlans/>
        </Suspense>
      </div>

      <Suspense fallback={<div />}>
        <TrademarktoHearingTermCondition/>
      </Suspense>

      <div id="premium">
        <Suspense fallback={<div />}>
          <TrademarktoHearingZolvitPremium/>
        </Suspense>
      </div>

      <Suspense fallback={<div />}>
        <TrademarktoHearingTabs />
      </Suspense>

      <div id="company">
        <Suspense fallback={<div />}>
          <TrademarktoHearingOverview/>
        </Suspense>
      </div>

      <div id="types">
        <Suspense fallback={<div />}>
          <TrademarktoHearingFeatures />
        </Suspense>
      </div>

      <div id="requirements">
        <Suspense fallback={<div />}>
          <TrademarktoHearingBenefits/>
        </Suspense>
      </div>

      <div id="process">
        <Suspense fallback={<div />}>
          <TrademarktoHearingElegibility />
        </Suspense>
      </div>

     <div id="documents">
        <Suspense fallback={<div />}>
          <TrademarktoHearingDocuments/>
        </Suspense>
      </div>

      <div id="faq">
        <Suspense fallback={<div />}>
          <TrademarktoHearingFAQ />
        </Suspense>
      </div>

      <Suspense fallback={<div />}>
        <TrademarktoHearingProcess />
      </Suspense>
      <Suspense fallback={<div />}>
        <TrademarktoHearingWhy />
      </Suspense>
      <Suspense fallback={<div />}>
        <TrademarktoHearingOurClients />
      </Suspense>
    </div>
  );
};

export default TradeLicense;
