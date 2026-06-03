import React, { Suspense } from "react";
import DissolveLLPBreadcrum from "../../Components/DissolveLLPBreadcrum/DissolveLLPBreadcrum";

// Lazy load below-fold components
const DissolveLLPPlanAndPricing = React.lazy(() => import("../../Components/DissolveLLPPlanAndPricing/DissolveLLPPlanAndPricing"));
const DissolveLLPTermsCondition = React.lazy(() => import("../../Components/DissolveLLPTermsCondition/DissolveLLPTermsCondition"));
const DissolveLLPPremium = React.lazy(() => import("../../Components/DissolveLLPPremium/DissolveLLPPremium"));
const DissolveLLPTabs = React.lazy(() => import("../../Components/DissolveLLPTabs/DissolveLLPTabs"));
const DissolveLLPComapanyTabs = React.lazy(() => import("../../Components/DissolveLLPComapanyTabs/DissolveLLPComapanyTabs"));
const DissolveLLPRequiremwntsTab = React.lazy(() => import("../../Components/DissolveLLPRequiremwntsTab/DissolveLLPRequiremwntsTab"));
const DissolveLLPProcess = React.lazy(() => import("../../Components/DissolveLLPProcess/DissolveLLPProcess"));
const DissolveLLPDocuments = React.lazy(() => import("../../Components/DissolveLLPDocuments/DissolveLLPDocuments"));
const DissolveLLPFAQ = React.lazy(() => import("../../Components/DissolveLLPFAQ/DissolveLLPFAQ"));
const DissolveLLPTestimonial = React.lazy(() => import("../../Components/DissolveLLPTestimonial/DissolveLLPTestimonial"));
const DissolveLLPVideoTestimonial = React.lazy(() => import("../../Components/DissolveLLPVideoTestimonial/DissolveLLPVideoTestimonial"));
const DissolveLLPOurClients = React.lazy(() => import("../../Components/DissolveLLPOurClients/DissolveLLPOurClients"));
const DissolveLLPPvtTypes = React.lazy(() => import("../../Components/DissolveLLPPvtTypes/DissolveLLPPvtTypes"));

const DissolveLLP = () => {
  return (
    <div>
      <DissolveLLPBreadcrum />

      <div id="plans">
        <Suspense fallback={<div />}>
          <DissolveLLPPlanAndPricing />
        </Suspense>
      </div>
      <Suspense fallback={<div />}>
        <DissolveLLPTermsCondition />
      </Suspense>

      <div id="premium">
        <Suspense fallback={<div />}>
          <DissolveLLPPremium />
        </Suspense>
      </div>

      <Suspense fallback={<div />}>
        <DissolveLLPTabs />
      </Suspense>

      <div id="company">
        <Suspense fallback={<div />}>
          <DissolveLLPComapanyTabs />
        </Suspense>
      </div>

      <div id="types">
      {/* <DissolveLLPPvtTypes/> */}
      </div>

      <div id="requirements">
        <Suspense fallback={<div />}>
          <DissolveLLPRequiremwntsTab/>
        </Suspense>
      </div>

      <div id="process">
        {/* <DissolveLLPProcess/> */}
      </div>

      <div id="documents">
        {/* <DissolveLLPDocuments/> */}
      </div>

      <div id="faq">
        <Suspense fallback={<div />}>
          <DissolveLLPFAQ/>
        </Suspense>
      </div>
      <Suspense fallback={<div />}>
        <DissolveLLPTestimonial/>
      </Suspense>
      <Suspense fallback={<div />}>
        <DissolveLLPVideoTestimonial/>
      </Suspense>
      <Suspense fallback={<div />}>
        <DissolveLLPOurClients/>
      </Suspense>






    </div>
  );
};

export default DissolveLLP;
