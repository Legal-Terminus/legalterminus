import React, { Suspense } from "react";
import ChangetoCompanyBreadcrum from "../../Components/ChangetoComapnyBreadcrum/ChangetoComapnyBreadcrum";

// Lazy load below-fold components
const ChangetoCompanyPlanandPrice = React.lazy(() => import("../../Components/ChangetoCompanyPlanandPrice/ChangetoCompanyPlanandPrice"));
const ChangetoCompanyTermandCondn = React.lazy(() => import("../../Components/ChangetoCompanyTermandCondn/ChangetoCompanyTermandCondn"));
const ChangetoCompanyZolvitPremium = React.lazy(() => import("../../Components/ChangetoCompanyZolvitPremium/ChangetoCompanyZolvitPremium"));
const ChangetoCompanyTab = React.lazy(() => import("../../Components/ChangetoCompanyTab/ChangetoCompanyTab"));
const ChangetoCompanyCompanyTab = React.lazy(() => import("../../Components/ChangetoCompanyCompanyTab/ChangetoCompanyCompanyTab"));
const ChangetoCompanyTypes = React.lazy(() => import("../../Components/ChangetoCompanyTypes/ChangetoCompanyTypes"));
const ChangetoCompanyRequirementsTab = React.lazy(() => import("../../Components/ChangetoCompanyRequirementsTab/ChangetoCompanyRequirementsTab"));
const ChangetoCompanyProcess = React.lazy(() => import("../../Components/ChangetoCompanyProcess/ChangetoCompanyProcess"));
const ChangetoCompanyDocInfographic = React.lazy(() => import("../../Components/ChangetoCompanyDocInfographic/ChangetoCompanyDocInfographic"));
const ChangetoCompanyFAQ = React.lazy(() => import("../../Components/ChangetoCompanyFAQ/ChangetoCompanyFAQ"));
const ChangetoCompanyTestimonial = React.lazy(() => import("../../Components/ChangetoCompanyTestimonial/ChangetoCompanyTestimonial"));
const ChangetoCompanyVideoTestimonial = React.lazy(() => import("../../Components/ChangetoCompanyVideoTestimonial/ChangetoCompanyVideoTestimonial"));
const ChangetoCompanyOurClients = React.lazy(() => import("../../Components/ChangetoCompanyOurClients/ChangetoCompanyOurClients"));

function LLP() {
  return (
    <div>
      {/* Breadcrumb */}
      <ChangetoCompanyBreadcrum />

      {/* Plans */}
      <div id="plans">
        <Suspense fallback={<div />}>
          <ChangetoCompanyPlanandPrice/>
        </Suspense>
      </div>

      {/* Terms & Conditions */}
      <Suspense fallback={<div />}>
        <ChangetoCompanyTermandCondn/>
      </Suspense>

      {/* Premium */}
      <div id="premium">
        <Suspense fallback={<div />}>
          <ChangetoCompanyZolvitPremium />
        </Suspense>
      </div>

      {/* Tabs */}
      <Suspense fallback={<div />}>
        <ChangetoCompanyTab />
      </Suspense>

      {/* Company */}
      <div id="company">
        <Suspense fallback={<div />}>
          <ChangetoCompanyCompanyTab/>
        </Suspense>
      </div>

      {/* Types */}
      <div id="types">
        <Suspense fallback={<div />}>
          <ChangetoCompanyTypes/>
        </Suspense>
      </div>

      {/* Requirements */}
      <div id="requirements">
        <Suspense fallback={<div />}>
          <ChangetoCompanyRequirementsTab />
        </Suspense>
      </div>

      {/* Process */}
      <div id="process">
        <Suspense fallback={<div />}>
          <ChangetoCompanyProcess />
        </Suspense>
      </div>

      {/* Documents */}
      <div id="documents">
        <Suspense fallback={<div />}>
          <ChangetoCompanyDocInfographic />
        </Suspense>
      </div>

      {/* FAQ */}
      <div id="faq">
        <Suspense fallback={<div />}>
          <ChangetoCompanyFAQ />
        </Suspense>
      </div>

      {/* Testimonials */}
      <Suspense fallback={<div />}>
        <ChangetoCompanyTestimonial />
      </Suspense>
      <Suspense fallback={<div />}>
        <ChangetoCompanyVideoTestimonial />
      </Suspense>

      {/* Our Clients */}
      <Suspense fallback={<div />}>
        <ChangetoCompanyOurClients/>
      </Suspense>
    </div>
  );
}

export default LLP;
