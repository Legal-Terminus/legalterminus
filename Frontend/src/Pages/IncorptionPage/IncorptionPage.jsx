import React, { Suspense } from "react";
import "./IncorptionPage.css";
import IncorptionBreadcrum from "../../Components/IncorptionBreadcrum/IncorptionBreadcrum";

// Lazy load below-fold components
const IncorporationPlanAndPricing = React.lazy(() => import("../../Components/IncorptionPlanedPriceing/IncorptionPlanedPriceing"));
const IncorporationGovtCosts = React.lazy(() => import("../../Components/IncorporationGovtCosts/IncorporationGovtCosts"));
const IncorporationTermsCondition = React.lazy(() => import("../../Components/IncorptionTermsCondition/IncorptionTermsCondition"));
const IncorporationPremium = React.lazy(() => import("../../Components/IncorporationPremium/IncorporationPremium"));
const IncorporationTabs = React.lazy(() => import("../../Components/IncorporationTabs/IncorporationTabs"));
const IncorporationCompanyTabs = React.lazy(() => import("../../Components/IncorporationCompanyTabs/IncorporationCompanyTabs"));
const IncorporationPvtTypes = React.lazy(() => import("../../Components/IncorporationPvtTypes/IncorporationPvtTypes"));
const IncorporationRequirementsTab = React.lazy(() => import("../../Components/IncorporationRequirementsTab/IncorporationRequirementsTab"));
const IncorporationProcess = React.lazy(() => import("../../Components/IncorporationProcess/IncorporationProcess"));
const IncorporationDocuments = React.lazy(() => import("../../Components/IncorporationDocuments/IncorporationDocuments"));
const IncorporationFAQ = React.lazy(() => import("../../Components/IncorporationFAQ/IncorporationFAQ"));

const IncorptionPage = () => {
  return (
    <div>
      <div className="incorp-page-hero">
        <IncorptionBreadcrum />
      </div>

      <div className="section-divider" />

      <div id="plans" className="incorp-page-pricing">
        <Suspense fallback={<div />}>
          <IncorporationPlanAndPricing />
        </Suspense>
      </div>

      <div className="section-divider" />

      <Suspense fallback={<div />}>
        <IncorporationGovtCosts />
      </Suspense>

      <div className="section-divider" />

      <Suspense fallback={<div />}>
        <IncorporationTermsCondition />
      </Suspense>

      <div className="section-divider" />

      <div id="premium">
        <Suspense fallback={<div />}>
          <IncorporationPremium />
        </Suspense>
      </div>

      <Suspense fallback={<div />}>
        <IncorporationTabs />
      </Suspense>

      <div id="incorp-nav-sections">

      <div className="section-divider" />

      <div id="company">
        <Suspense fallback={<div />}>
          <IncorporationCompanyTabs />
        </Suspense>
      </div>

      <div className="section-divider" />

      <div id="types">
        <Suspense fallback={<div />}>
          <IncorporationPvtTypes />
        </Suspense>
      </div>

      <div className="section-divider" />

      <div id="requirements">
        <Suspense fallback={<div />}>
          <IncorporationRequirementsTab />
        </Suspense>
      </div>

      <div className="section-divider" />

      <div id="process">
        <Suspense fallback={<div />}>
          <IncorporationProcess />
        </Suspense>
      </div>

      <div className="section-divider" />

      <div id="documents">
        <Suspense fallback={<div />}>
          <IncorporationDocuments />
        </Suspense>
      </div>

      <div className="section-divider" />

      <div id="faq">
        <Suspense fallback={<div />}>
          <IncorporationFAQ />
        </Suspense>
      </div>

      </div>
    </div>
  );
};

export default IncorptionPage;
