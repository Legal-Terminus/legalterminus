import React, { Suspense } from "react";
import ChangeLlpBreadcrum from "../../Components/ChangeLlpBreadcrum/ChangeLlpBreadcrum.jsx";

// Lazy load below-fold components
const ChangeLlpPlanandPrice = React.lazy(() => import("../../Components/ChangeLlpPlanandPrice/ChangeLlpPlanandPrice"));
const ChangeLlpTermandCondn = React.lazy(() => import("../../Components/ChangeLlpTermandCondn/ChangeLlpTermandCondn"));
const ChangeLlpZolvitPremium = React.lazy(() => import("../../Components/ChangeLlpZolvitPremium/ChangeLlpZolvitPremium"));
const ChangeLlpTabs = React.lazy(() => import("../../Components/ChangeLlpTabs/ChangeLlpTabs"));
const ChangeLlpCompanyTab = React.lazy(() => import("../../Components/ChangeLlpCompanyTab/ChangeLlpCompanyTab"));
const ChangeLlpTypes = React.lazy(() => import("../../Components/ChangeLlpTypes/ChangeLlpTypes"));
const ChangeLlpRequirementsTab = React.lazy(() => import("../../Components/ChangeLlpRequirementsTab/ChangeLlpRequirementsTab"));
const ChangeLlpProcess = React.lazy(() => import("../../Components/ChangeLlpProcess/ChangeLlpProcess"));
const ChangeLlpFAQ = React.lazy(() => import("../../Components/ChangeLlpFAQ/ChangeLlpFAQ"));
const ChangeLlpTestimonial = React.lazy(() => import("../../Components/ChangeLlpTestimonial/ChangeLlpTestimonial"));
const ChangeLlpVideoTestimonial = React.lazy(() => import("../../Components/ChangeLlpVideoTestimonial/ChangeLlpVideoTestimonial"));
const ChangeLlpOurClients = React.lazy(() => import("../../Components/ChangeLlpOurClients/ChangeLlpOurClients"));
const ChangeNameInfographics = React.lazy(() => import("../../Components/ChangeNameInfographics/ChangeNameInfographics.jsx"));

function LLP() {
  return (
    <div>
      {/* Breadcrumb */}
      <ChangeLlpBreadcrum />

      {/* Plans */}
      <div id="plans">
        <Suspense fallback={<div />}>
          <ChangeLlpPlanandPrice />
        </Suspense>
      </div>

      {/* Terms & Conditions */}
      <Suspense fallback={<div />}>
        <ChangeLlpTermandCondn/>
      </Suspense>

      {/* Premium */}
      <div id="premium">
        <Suspense fallback={<div />}>
          <ChangeLlpZolvitPremium />
        </Suspense>
      </div>

      {/* Tabs */}
      <Suspense fallback={<div />}>
        <ChangeLlpTabs />
      </Suspense>

      {/* Company */}
      <div id="company">
        <Suspense fallback={<div />}>
          <ChangeLlpCompanyTab />
        </Suspense>
      </div>

      {/* Types */}
      <div id="types">
        <Suspense fallback={<div />}>
          <ChangeLlpTypes />
        </Suspense>
      </div>

      {/* Requirements */}
      <div id="requirements">
        <Suspense fallback={<div />}>
          <ChangeLlpRequirementsTab />
        </Suspense>
      </div>

      {/* Process */}
      <div id="process">
        {/* <ChangeLlpProcess /> */}
      </div>
       <div id="documents">
       <Suspense fallback={<div />}>
         <ChangeNameInfographics />
       </Suspense>
      </div>
      {/* FAQ */}
      <div id="faq">
        <Suspense fallback={<div />}>
          <ChangeLlpFAQ />
        </Suspense>
      </div>

      {/* Testimonials */}
      <Suspense fallback={<div />}>
        <ChangeLlpTestimonial />
      </Suspense>
      <Suspense fallback={<div />}>
        <ChangeLlpVideoTestimonial />
      </Suspense>

      {/* Our Clients */}
      <Suspense fallback={<div />}>
        <ChangeLlpOurClients />
      </Suspense>
    </div>
  );
}

export default LLP;
