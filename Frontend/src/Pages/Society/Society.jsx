import React, { Suspense } from "react";
import "./Society.css";
import SocietyBreadcrum from "../../Components/SocietyBreadcrum/SocietyBreadcrum";

// Lazy load below-fold components
const SocietyPlanAndPricing = React.lazy(() => import("../../Components/SccietyPlanAndPricing/SccietyPlanAndPricing"));
const SocietyTermsCondition = React.lazy(() => import("../../Components/SocietyTermsCondition/SocietyTermsCondition"));
const SocietyPremium = React.lazy(() => import("../../Components/SocietyPremium/SocietyPremium"));
const SocietyTabs = React.lazy(() => import("../../Components/SocietyTabs/SocietyTabs"));
const SocietyCompanyTabs = React.lazy(() => import("../../Components/SocietyCompanyTabs/SocietyCompanyTabs"));
const SocietyPvtTypes = React.lazy(() => import("../../Components/SocietyPvtTypes/SocietyPvtTypes"));
const SocietyRequirementsTab = React.lazy(() => import("../../Components/SocietyRequirementsTab/SocietyRequirementsTab"));
const SocietyProcess = React.lazy(() => import("../../Components/SocietyProcess/SocietyProcess"));
const SocietyFAQ = React.lazy(() => import("../../Components/SocietyFAQ/SocietyFAQ"));
const SocietyTestimonial = React.lazy(() => import("../../Components/SocietyTestimonial/SocietyTestimonial"));
const SocietyVideoTestimonial = React.lazy(() => import("../../Components/SocietyVideoTestimonial/SocietyVideoTestimonial"));
const SocietyOurClients = React.lazy(() => import("../../Components/SocietyOurClients/SocietyOurClients"));
const SocietyDocument = React.lazy(() => import("../../Components/SocietyDocument/SocietyDocument"));

const Society = () => {
  return (
    <div>
      <div className="society-page-hero">
        <SocietyBreadcrum />
      </div>

      <div className="section-divider" />

      <div id="plans">
        <Suspense fallback={<div />}>
          {/* <SocietyPlanAndPricing /> */}
        </Suspense>
      </div>

      <Suspense fallback={<div />}>
        {/* <SocietyTermsCondition /> */}
      </Suspense>

      <div className="section-divider" />

      <div id="premium">
        <Suspense fallback={<div />}>
          <SocietyPremium />
        </Suspense>
      </div>

      <Suspense fallback={<div />}>
        <SocietyTabs />
      </Suspense>

      <div className="section-divider" />

      <div id="company">
        <Suspense fallback={<div />}>
          <SocietyCompanyTabs />
        </Suspense>
      </div>

      <div className="section-divider" />

      <div id="types">
        <Suspense fallback={<div />}>
          <SocietyPvtTypes />
        </Suspense>
      </div>

      <div className="section-divider" />

      <div id="requirements">
        <Suspense fallback={<div />}>
          <SocietyRequirementsTab />
        </Suspense>
      </div>

      <div className="section-divider" />

      <div id="process">
        <Suspense fallback={<div />}>
          {/* <SocietyProcess /> */}
        </Suspense>
      </div>

      <div id="documents">
        <Suspense fallback={<div />}>
          {/* <SocietyDocument /> */}
        </Suspense>
      </div>

      <div id="faq">
        <Suspense fallback={<div />}>
          <SocietyFAQ />
        </Suspense>
      </div>

      <div className="section-divider" />

      <Suspense fallback={<div />}>
        <SocietyTestimonial />
      </Suspense>

      <Suspense fallback={<div />}>
        <SocietyVideoTestimonial />
      </Suspense>

      <Suspense fallback={<div />}>
        <SocietyOurClients />
      </Suspense>
    </div>
  );
};

export default Society;
