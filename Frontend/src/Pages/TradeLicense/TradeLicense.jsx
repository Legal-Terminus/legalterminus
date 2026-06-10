import React, { Suspense } from "react";
import "./TradeLicense.css";
import TradeLicenseBreadcrum from "../../Components/TradeLicenseBreadcrum/TradeLicenseBreadcrum";

// Lazy load below-fold components
const TradeLicensePlans = React.lazy(() => import("../../Components/TradeLicensePlans/TradeLicensePlans"));
const TradeLicenseMunicipalFees = React.lazy(() => import("../../Components/TradeLicenseMunicipalFees/TradeLicenseMunicipalFees"));
const TradeLicenseArchitecture = React.lazy(() => import("../../Components/TradeLicenseArchitecture/TradeLicenseArchitecture"));
const TradeLicenseTermCondition = React.lazy(() => import("../../Components/TradeLicenseTermCondition/TradeLicenseTermCondition"));
const TradeLicenseZolvitPremium = React.lazy(() => import("../../Components/TradeLicenseZolvitPremium/TradeLicenseZolvitPremium"));
const TradeLicenseTabs = React.lazy(() => import("../../Components/TradeLicenseTabs/TradeLicenseTabs"));
const TradeLicenseOverview = React.lazy(() => import("../../Components/TradeLicenseOverview/TradeLicenseOverview"));
const TradeLicenseFeatures = React.lazy(() => import("../../Components/TradeLicenseFeatures/TradeLicenseFeatures"));
const TradeLicenseBenefits = React.lazy(() => import("../../Components/TradeLicenseBenefits/TradeLicenseBenefits"));
const TradeLicenseElegibility = React.lazy(() => import("../../Components/TradeLicenseElegibility/TradeLicenseElegibility"));
const TradeLicenseDocuments = React.lazy(() => import("../../Components/TradeLicenseDocuments/TradeLicenseDocuments"));
const TradeLicenseFAQ = React.lazy(() => import("../../Components/TradeLicenseFAQ/TradeLicenseFAQ"));

const TradeLicense = () => {
  return (
    <div>
      <div className="trade-page-hero">
        <TradeLicenseBreadcrum />
      </div>

      <div className="section-divider" />

      <div id="plans" className="trade-page-pricing">
        <Suspense fallback={<div />}>
          <TradeLicensePlans />
        </Suspense>
      </div>

      <div className="section-divider" />

      <Suspense fallback={<div />}>
        <TradeLicenseMunicipalFees />
      </Suspense>

      <div className="section-divider" />

      <Suspense fallback={<div />}>
        <TradeLicenseTermCondition />
      </Suspense>

      <div className="section-divider" />

      <div id="premium">
        <Suspense fallback={<div />}>
          <TradeLicenseZolvitPremium />
        </Suspense>
      </div>

      <Suspense fallback={<div />}>
        <TradeLicenseTabs />
      </Suspense>

      <div id="trade-nav-sections">

      <div className="section-divider" />

      <div id="company">
        <Suspense fallback={<div />}>
          <TradeLicenseOverview />
        </Suspense>
      </div>

      <div className="section-divider" />

      <Suspense fallback={<div />}>
        <TradeLicenseArchitecture />
      </Suspense>

      <div className="section-divider" />

      <div id="types">
        <Suspense fallback={<div />}>
          <TradeLicenseFeatures />
        </Suspense>
      </div>

      <div className="section-divider" />

      <div id="requirements">
        <Suspense fallback={<div />}>
          <TradeLicenseBenefits />
        </Suspense>
      </div>

      <div className="section-divider" />

      <div id="process">
        <Suspense fallback={<div />}>
          <TradeLicenseElegibility />
        </Suspense>
      </div>

      <div className="section-divider" />

      <div id="documents">
        <Suspense fallback={<div />}>
          <TradeLicenseDocuments />
        </Suspense>
      </div>

      <div className="section-divider" />

      <div id="faq">
        <Suspense fallback={<div />}>
          <TradeLicenseFAQ />
        </Suspense>
      </div>

      </div>

    </div>
  );
};

export default TradeLicense;
