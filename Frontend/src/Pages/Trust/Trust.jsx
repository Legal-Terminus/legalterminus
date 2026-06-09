import React, { Suspense } from "react";
import "./Trust.css";
import TrustBreadcrum from "../../Components/TrustBreadcrum/TrustBreadcrum";

const TrustTabs = React.lazy(() => import("../../Components/TrustTabs/TrustTabs"));
const TrustPlanAndPricing = React.lazy(() => import("../../Components/TrustPlanAndPricing/TrustPlanAndPricing"));
const TrustTermsCondition = React.lazy(() => import("../../Components/TrustTermsCondition/TrustTermsCondition"));
const TrustPremium = React.lazy(() => import("../../Components/TrustPremium/TrustPremium"));
const TrustCompanyTabs = React.lazy(() => import("../../Components/TrustCompanyTabs/TrustCompanyTabs"));
const TrustPvtTypes = React.lazy(() => import("../../Components/TrustPvtTypes/TrustPvtTypes"));
const TrustRequirementsTab = React.lazy(() => import("../../Components/TrustRequirementsTab/TrustRequirementsTab"));
const TrustProcess = React.lazy(() => import("../../Components/TrustProcess/TrustProcess"));
const TrustDocument = React.lazy(() => import("../../Components/TrustDocument/TrustDocument"));
const TrustFAQ = React.lazy(() => import("../../Components/TrustFAQ/TrustFAQ"));

const Trust = () => {
  return (
    <div>
      <div className="trust-page-hero">
        <TrustBreadcrum />
      </div>

      <div className="section-divider" />

      <div id="plans" className="trust-page-pricing">
        <Suspense fallback={<div />}>
          <TrustPlanAndPricing />
        </Suspense>
      </div>

      <Suspense fallback={<div />}>
        <TrustTermsCondition />
      </Suspense>

      <div className="section-divider" />

      <div id="premium">
        <Suspense fallback={<div />}>
          <TrustPremium />
        </Suspense>
      </div>

      <Suspense fallback={<div />}>
        <TrustTabs />
      </Suspense>

      <div className="section-divider" />

      <div id="company">
        <Suspense fallback={<div />}>
          <TrustCompanyTabs />
        </Suspense>
      </div>

      <div className="section-divider" />

      <div id="types">
        <Suspense fallback={<div />}>
          <TrustPvtTypes />
        </Suspense>
      </div>

      <div className="section-divider" />

      <div id="requirements">
        <Suspense fallback={<div />}>
          <TrustRequirementsTab />
        </Suspense>
      </div>

      <div className="section-divider" />

      <div id="process">
        <Suspense fallback={<div />}>
          <TrustProcess />
        </Suspense>
      </div>

      <div className="section-divider" />

      <div id="documents">
        <Suspense fallback={<div />}>
          <TrustDocument />
        </Suspense>
      </div>

      <div className="section-divider" />

      <div id="faq">
        <Suspense fallback={<div />}>
          <TrustFAQ />
        </Suspense>
      </div>

    </div>
  );
};

export default Trust;
