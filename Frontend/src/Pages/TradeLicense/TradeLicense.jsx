import React, { Suspense } from "react";

import TradeLicenseBreadcrum from "../../Components/TradeLicenseBreadcrum/TradeLicenseBreadcrum";

// Lazy load below-fold components
const TradeLicensePlans = React.lazy(() => import("../../Components/TradeLicensePlans/TradeLicensePlans"));
const TradeLicenseTermCondition = React.lazy(() => import("../../Components/TradeLicenseTermCondition/TradeLicenseTermCondition"));
const TradeLicenseZolvitPremium = React.lazy(() => import("../../Components/TradeLicenseZolvitPremium/TradeLicenseZolvitPremium"));
const TradeLicenseTabs = React.lazy(() => import("../../Components/TradeLicenseTabs/TradeLicenseTabs"));
const TradeLicenseOverview = React.lazy(() => import("../../Components/TradeLicenseOverview/TradeLicenseOverview"));
const TradeLicenseFeatures = React.lazy(() => import("../../Components/TradeLicenseFeatures/TradeLicenseFeatures"));
const TradeLicenseBenefits = React.lazy(() => import("../../Components/TradeLicenseBenefits/TradeLicenseBenefits"));
const TradeLicenseElegibility = React.lazy(() => import("../../Components/TradeLicenseElegibility/TradeLicenseElegibility"));
const TradeLicenseDocuments = React.lazy(() => import("../../Components/TradeLicenseDocuments/TradeLicenseDocuments"));
const TradeLicenseFAQ = React.lazy(() => import("../../Components/TradeLicenseFAQ/TradeLicenseFAQ"));
const TradeLicenseProcess = React.lazy(() => import("../../Components/TradeLicenseProcess/TradeLicenseProcess"));
const TradeLicenseWhy = React.lazy(() => import("../../Components/TradeLicenseWhy/TradeLicenseWhy"));
const TradeLicenseOurClients = React.lazy(() => import("../../Components/TradeLicenseOurClients/TradeLicenseOurClients"));

const TradeLicense = () => {
  return (
    <div>
      <TradeLicenseBreadcrum />

      <div id="plans">
        {/* <TradeLicensePlans /> */}
      </div>

      {/* <TradeLicenseTermCondition /> */}

      <div id="premium">
        <Suspense fallback={<div />}>
          <TradeLicenseZolvitPremium />
        </Suspense>
      </div>

      <Suspense fallback={<div />}>
        <TradeLicenseTabs />
      </Suspense>

      <div id="company">
        <Suspense fallback={<div />}>
          <TradeLicenseOverview />
        </Suspense>
      </div>

      <div id="types">
        <Suspense fallback={<div />}>
          <TradeLicenseFeatures />
        </Suspense>
      </div>

      <div id="requirements">
        <Suspense fallback={<div />}>
          <TradeLicenseBenefits />
        </Suspense>
      </div>

      <div id="process">
        {/* <TradeLicenseElegibility /> */}
      </div>

     <div id="documents">
        {/* <TradeLicenseDocuments /> */}
      </div>

      <div id="faq">
        <Suspense fallback={<div />}>
          <TradeLicenseFAQ />
        </Suspense>
      </div>

      <Suspense fallback={<div />}>
        <TradeLicenseProcess />
      </Suspense>
      <Suspense fallback={<div />}>
        <TradeLicenseWhy />
      </Suspense>
      <Suspense fallback={<div />}>
        <TradeLicenseOurClients />
      </Suspense>
    </div>
  );
};

export default TradeLicense;
