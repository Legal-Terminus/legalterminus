import React, { Suspense } from "react";
import LlptoPrivateBreadcrum from "../../Components/LlptoPrivateBreadcrum/LlptoPrivateBreadcrum";

// Lazy load below-fold components
const LlptoPrivatePlanandPrice = React.lazy(() => import("../../Components/LlptoPrivatePlanandPrice/LlptoPrivatePlanandPrice"));
const LlptoPriTermandcondn = React.lazy(() => import("../../Components/LlptoPriTermandcondn/LlptoPriTermandcondn"));
const LlptoPriZolvitPremium = React.lazy(() => import("../../Components/LlptoPriZolvitPremium/LlptoPriZolvitPremium"));
const LlptoPriTabs = React.lazy(() => import("../../Components/LlptoPriTabs/LlptoPriTabs"));
const LlptoPriCompanyTab = React.lazy(() => import("../../Components/LlptoPriCompanyTab/LlptoPriCompanyTab"));
const LlptoPriTypes = React.lazy(() => import("../../Components/LlptoPriTypes/LlptoPriTypes"));
const LlptoPriRequirementsTab = React.lazy(() => import("../../Components/LlptoPriRequirementsTab/LlptoPriRequirementsTab"));
const LlptoPriProcess = React.lazy(() => import("../../Components/LlptoPriProcess/LlptoPriProcess"));
const LlptoPriDocInfographic = React.lazy(() => import("../../Components/LlptoPriDocInfographic/LlptoPriDocInfographic"));
const LlptoPriFAQ = React.lazy(() => import("../../Components/LlptoPriFAQ/LlptoPriFAQ"));
const LlptoPriTestimonial = React.lazy(() => import("../../Components/LlptoPriTestimonial/LlptoPriTestimonial"));
const LlptoPriVideoTestimonial = React.lazy(() => import("../../Components/LlptoPriVideoTestimonial/LlptoPriVideoTestimonial"));
const LlptoPriOurclients = React.lazy(() => import("../../Components/LlptoPriOurclients/LlptoPriOurclients"));

function LLP() {
  return (
    <div>
      {/* Breadcrumb */}
      <LlptoPrivateBreadcrum/>

      {/* Plans */}
      <div id="plans">
        {/* <LlptoPrivatePlanandPrice /> */}
      </div>

      {/* Terms & Conditions */}
      {/* <LlptoPriTermandcondn/> */}

      {/* Premium */}
      <div id="premium">
        <Suspense fallback={<div />}>
          <LlptoPriZolvitPremium />
        </Suspense>
      </div>

      {/* Tabs */}
      <Suspense fallback={<div />}>
        <LlptoPriTabs/>
      </Suspense>

      {/* Company */}
      <div id="company">
        <Suspense fallback={<div />}>
          <LlptoPriCompanyTab/>
        </Suspense>
      </div>

      {/* Types */}
      <div id="types">
        {/* <LlptoPriTypes /> */}
      </div>

      {/* Requirements */}
      <div id="requirements">
        <Suspense fallback={<div />}>
          <LlptoPriRequirementsTab/>
        </Suspense>
      </div>

      {/* Process */}
      <div id="process">
        {/* <LlptoPriProcess /> */}
      </div>

      {/* Documents */}
      <div id="documents">
        {/* <LlptoPriDocInfographic /> */}
      </div>

      {/* FAQ */}
      <div id="faq">
        <Suspense fallback={<div />}>
          <LlptoPriFAQ />
        </Suspense>
      </div>

      {/* Testimonials */}
      <Suspense fallback={<div />}>
        <LlptoPriTestimonial />
      </Suspense>
      <Suspense fallback={<div />}>
        <LlptoPriVideoTestimonial />
      </Suspense>

      {/* Our Clients */}
      <Suspense fallback={<div />}>
        <LlptoPriOurclients />
      </Suspense>
    </div>
  );
}

export default LLP;
