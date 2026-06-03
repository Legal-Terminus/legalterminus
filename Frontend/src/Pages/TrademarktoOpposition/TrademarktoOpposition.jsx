import React, { Suspense } from "react";

import TrademarktoOppositionBreadcrum from "../../Components/TrademarktoOppositionBreadcrum/TrademarktoOppositionBreadcrum";

// Lazy load below-fold components
const TrademarktoOppositionPlans = React.lazy(() => import("../../Components/TrademarktoOppositionBreadcrum/TrademarktoOppositionBreadcrum"));
const TrademarktoOppositionTermCondition = React.lazy(() => import("../../Components/TrademarktoOppositionTermCondition/TrademarktoOppositionTermCondition"));
const TrademarktoOppositionZolvitPremium = React.lazy(() => import("../../Components/TrademarktoOppositionZolvitPremium/TrademarktoOppositionZolvitPremium"));
const TrademarktoOppositionTabs = React.lazy(() => import("../../Components/TrademarktoOppositionTabs/TrademarktoOppositionTabs"));
const TrademarktoOppositionOverview = React.lazy(() => import("../../Components/TrademarktoOppositionOverview/TrademarktoOppositionOverview"));
const TrademarktoOppositionFeatures = React.lazy(() => import("../../Components/TrademarktoOppositionFeatures/TrademarktoOppositionFeatures"));
const TrademarktoOppositionBenefits = React.lazy(() => import("../../Components/TrademarktoOppositionBenefits/TrademarktoOppositionBenefits"));
const TrademarktoOppositionElegibility = React.lazy(() => import("../../Components/TrademarktoOppositionElegibility/TrademarktoOppositionElegibility"));
const TrademarktoOppositionDocuments = React.lazy(() => import("../../Components/TrademarktoOppositionDocuments/TrademarktoOppositionDocuments"));
const TrademarktoOppositionFAQ = React.lazy(() => import("../../Components/TrademarktoOppositionFAQ/TrademarktoOppositionFAQ"));
const TrademarktoOppositionProcess = React.lazy(() => import("../../Components/TrademarktoOppositionProcess/TrademarktoOppositionProcess"));
const TrademarktoOppositionWhy = React.lazy(() => import("../../Components/TrademarktoOppositionWhy/TrademarktoOppositionWhy"));
const TrademarktoOppositionOurclients = React.lazy(() => import("../../Components/TrademarktoOppositionOurclients/TrademarktoOppositionOurclients"));

const TradeLicense = () => {
  return (
    <div>
      <TrademarktoOppositionBreadcrum />

      <div id="plans">
        <Suspense fallback={<div />}>
          <TrademarktoOppositionPlans />
        </Suspense>
      </div>

      <Suspense fallback={<div />}>
        <TrademarktoOppositionTermCondition />
      </Suspense>

      <div id="premium">
        <Suspense fallback={<div />}>
          <TrademarktoOppositionZolvitPremium/>
        </Suspense>
      </div>

      <Suspense fallback={<div />}>
        <TrademarktoOppositionTabs />
      </Suspense>

      <div id="company">
        <Suspense fallback={<div />}>
          <TrademarktoOppositionOverview />
        </Suspense>
      </div>

      <div id="types">
        <Suspense fallback={<div />}>
          <TrademarktoOppositionFeatures/>
        </Suspense>
      </div>

      <div id="requirements">
        <Suspense fallback={<div />}>
          <TrademarktoOppositionBenefits/>
        </Suspense>
      </div>

      <div id="process">
        <Suspense fallback={<div />}>
          <TrademarktoOppositionElegibility />
        </Suspense>
      </div>

     <div id="documents">
        <Suspense fallback={<div />}>
          <TrademarktoOppositionDocuments/>
        </Suspense>
      </div>

      <div id="faq">
        <Suspense fallback={<div />}>
          <TrademarktoOppositionFAQ/>
        </Suspense>
      </div>

      <Suspense fallback={<div />}>
        <TrademarktoOppositionProcess />
      </Suspense>
      <Suspense fallback={<div />}>
        <TrademarktoOppositionWhy />
      </Suspense>
      <Suspense fallback={<div />}>
        <TrademarktoOppositionOurclients/>
      </Suspense>
    </div>
  );
};

export default TradeLicense;
