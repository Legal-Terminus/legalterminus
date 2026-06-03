import React, { Suspense } from "react";
import DPBreadcrum from "../../Components/DPBreadcrum/DPBreadcrum";

// Lazy load below-fold components
const DPPlanAndPricing = React.lazy(() => import("../../Components/DPPlanAndPricing/DPPlanAndPricing"));
const DPTermsCondition = React.lazy(() => import("../../Components/DPTermsCondition/DPTermsCondition"));
const DPPremium = React.lazy(() => import("../../Components/DPPremium/DPPremium"));
const DPTabs = React.lazy(() => import("../../Components/DPTabs/DPTabs"));
const DPCompanyTabs = React.lazy(() => import("../../Components/DPCompanyTabs/DPCompanyTabs"));
const DPPvtTypes = React.lazy(() => import("../../Components/DPPvtTypes/DPPvtTypes"));
const DPRequirementsTab = React.lazy(() => import("../../Components/DPRequirementsTab/DPRequirementsTab"));
const DPDocument = React.lazy(() => import("../../Components/DPDocument/DPDocument"));
const DPFAQ = React.lazy(() => import("../../Components/DPFAQ/DPFAQ"));
const DPTestimonial = React.lazy(() => import("../../Components/DPTestimonial/DPTestimonial"));
const DPVideoTestimonial = React.lazy(() => import("../../Components/DPVideoTestimonial/DPVideoTestimonial"));
const DPOurClients = React.lazy(() => import("../../Components/DPOurClients/DPOurClients"));
const DPProcess = React.lazy(() => import("../../Components/DPProcess/DPProcess"));

const DissolvePartnership = () => {
  return (
    <div>

      <DPBreadcrum />

      <div id="plans">
        {/* <DPPlanAndPricing /> */}
      </div>
      {/* <DPTermsCondition /> */}
      <div id="premium">
        <Suspense fallback={<div />}>
          <DPPremium />
        </Suspense>
      </div>

      <Suspense fallback={<div />}>
        <DPTabs />
      </Suspense>

      <div id="company">
        <Suspense fallback={<div />}>
          <DPCompanyTabs />
        </Suspense>
      </div>

      <div id="types">
        {/* <DPPvtTypes /> */}
      </div>

      <div id="requirements">
        <Suspense fallback={<div />}>
          <DPRequirementsTab />
        </Suspense>
      </div>

      <div id="process">
        {/* <DPProcess /> */}
      </div>

      <div id="documents">
        {/* <DPDocument /> */}
      </div>

      <div id="faq">
        <Suspense fallback={<div />}>
          <DPFAQ />
        </Suspense>
      </div>
      
      <Suspense fallback={<div />}>
        <DPTestimonial/>
      </Suspense>
      <Suspense fallback={<div />}>
        <DPVideoTestimonial/>
      </Suspense>
      <Suspense fallback={<div />}>
        <DPOurClients/>
      </Suspense>
    </div>
  );
};

export default DissolvePartnership;
