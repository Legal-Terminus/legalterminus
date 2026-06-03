import React, { Suspense } from "react";
import ChangetoLlpBreadcrum from "../../Components/ChangetoLlpBreadcrum/ChangetoLlpBreadcrum";

// Lazy load below-fold components
const ChangetoLlpPlanandPrice = React.lazy(() => import("../../Components/ChangetoLlpPlanandPrice/ChangetoLlpPlanandPrice"));
const ChangetoLlpTermandCondn = React.lazy(() => import("../../Components/ChangetoLlpTermandCondn/ChangetoLlpTermandCondn"));
const ChangetoLlpZolvitPremium = React.lazy(() => import("../../Components/ChangetoLlpZolvitPremium/ChangetoLlpZolvitPremium"));
const ChangetoLlPTabs = React.lazy(() => import("../../Components/ChangetoLlpTabs/ChangetoLlpTabs"));
const ChangetoLlpCompanyTab = React.lazy(() => import("../../Components/ChangetoLlpCompanyTab/ChangetoLlpCompanyTab"));
const ChangetoLlpTypes = React.lazy(() => import("../../Components/ChangetoLlpTypes/ChangetoLlpTypes"));
const ChangetoLlpRequirementsTab = React.lazy(() => import("../../Components/ChangetoLlpRequirementsTab/ChangetoLlpRequirementsTab"));
const ChangetoLlpProcess = React.lazy(() => import("../../Components/ChangetoLlpProcess/ChangetoLlpProcess"));
const ChangetoLlpDocInfographic = React.lazy(() => import("../../Components/ChangetoLlpDocInfographic/ChangetoLlpDocInfographic"));
const ChangetoLlpFAQ = React.lazy(() => import("../../Components/ChangetoLlpFAQ/ChangetoLlpFAQ"));
const ChangetoLlpTestimonial = React.lazy(() => import("../../Components/ChangetoLlpTestimonial/ChangetoLlpTestimonial"));
const ChangetoLlpVideoTestimonial = React.lazy(() => import("../../Components/ChangetoLlpVideoTestimonial/ChangetoLlpVideoTestimonial"));
const ChangetoLlpOurClients = React.lazy(() => import("../../Components/ChangetoLlpOurClients/ChangetoLlpOurClients"));

function LLP() {
  return (
    <div>
      {/* Breadcrumb */}
      <ChangetoLlpBreadcrum />

      {/* Plans */}
      <div id="plans">
        <Suspense fallback={<div />}>
          <ChangetoLlpPlanandPrice />
        </Suspense>
      </div>

      {/* Terms & Conditions */}
      <Suspense fallback={<div />}>
        <ChangetoLlpTermandCondn/>
      </Suspense>

      {/* Premium */}
      <div id="premium">
        <Suspense fallback={<div />}>
          <ChangetoLlpZolvitPremium />
        </Suspense>
      </div>

      {/* Tabs */}
      <Suspense fallback={<div />}>
        <ChangetoLlPTabs />
      </Suspense>

      {/* Company */}
      <div id="company">
        <Suspense fallback={<div />}>
          <ChangetoLlpCompanyTab/>
        </Suspense>
      </div>

      {/* Types */}
      <div id="types">
        <Suspense fallback={<div />}>
          <ChangetoLlpTypes />
        </Suspense>
      </div>

      {/* Requirements */}
      <div id="requirements">
        <Suspense fallback={<div />}>
          <ChangetoLlpRequirementsTab />
        </Suspense>
      </div>

      {/* Process */}
      <div id="process">
        <Suspense fallback={<div />}>
          <ChangetoLlpProcess />
        </Suspense>
      </div>

      {/* Documents */}
      <div id="documents">
        <Suspense fallback={<div />}>
          <ChangetoLlpDocInfographic />
        </Suspense>
      </div>

      {/* FAQ */}
      <div id="faq">
        <Suspense fallback={<div />}>
          <ChangetoLlpFAQ />
        </Suspense>
      </div>

      {/* Testimonials */}
      <Suspense fallback={<div />}>
        <ChangetoLlpTestimonial />
      </Suspense>
      <Suspense fallback={<div />}>
        <ChangetoLlpVideoTestimonial />
      </Suspense>

      {/* Our Clients */}
      <Suspense fallback={<div />}>
        <ChangetoLlpOurClients/>
      </Suspense>
    </div>
  );
}

export default LLP;
