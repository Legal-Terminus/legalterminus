import React, { Suspense } from "react";
import DissolvePrivateBreadcrum from "../../Components/DissolvePrivateBreadcrum/DissolvePrivateBreadcrum";

// Lazy load below-fold components
const DissolvePrivatePlanAndPricing = React.lazy(() => import("../../Components/DissolvePrivatePlanAndPricing/DissolvePrivatePlanAndPricing"));
const DissolvePrivateTermsCondition = React.lazy(() => import("../../Components/DissolvePrivateTermsCondition/DissolvePrivateTermsCondition"));
const DissolvePrivatePremium = React.lazy(() => import("../../Components/DissolvePrivatePremium/DissolvePrivatePremium"));
const DissolvePrivateTabs = React.lazy(() => import("../../Components/DissolavePrivateTabs/DissolavePrivateTabs"));
const DissolvePrivateCompanyTabs = React.lazy(() => import("../../Components/DissolvePrivateCompanyTabs/DissolvePrivateCompanyTabs"));
const DissolavePrivateTypesTabs = React.lazy(() => import("../../Components/DissolvePrivatePvtTypes/DissolvePrivatePvtTypes"));
const DissolvePrivateRequirementsTab = React.lazy(() => import("../../Components/DissolvePrivateRequirementsTab/DissolvePrivateRequirementsTab"));
const DissolvePrivateProcess = React.lazy(() => import("../../Components/DissolvePrivateProcess/DissolvePrivateProcess"));
const DissolvePrivateDocument = React.lazy(() => import("../../Components/DissolvePrivateDocument/DissolvePrivateDocument"));
const DissolvePrivateFAQ = React.lazy(() => import("../../Components/DissolvePrivateFAQ/DissolvePrivateFAQ"));
const DissolavePrivatesTestimonial = React.lazy(() => import("../../Components/DissolvePrivateTestimonial/DissolvePrivateTestimonial"));
const DissolveVideoTestimonial = React.lazy(() => import("../../Components/DissolveVideoTestimonial/DissolveVideoTestimonial"));
const DissolaveOurClients = React.lazy(() => import("../../Components/DissolaveOurClients/DissolaveOurClients"));


const DissolvePrivate = () => {
  return (
    <div>
      <DissolvePrivateBreadcrum />
      <div id="plans">
        <Suspense fallback={<div />}>
          <DissolvePrivatePlanAndPricing />
        </Suspense>
      </div>
      <Suspense fallback={<div />}>
        <DissolvePrivateTermsCondition />
      </Suspense>

      <div id="premium">
        <Suspense fallback={<div />}>
          <DissolvePrivatePremium />
        </Suspense>
      </div>

      <Suspense fallback={<div />}>
        <DissolvePrivateTabs />
      </Suspense>
      
      <div id="company">
        <Suspense fallback={<div />}>
          <DissolvePrivateCompanyTabs />
        </Suspense>
      </div>

      <div id="types">
        {/* <DissolavePrivateTypesTabs /> */}
      </div>

      <div id="requirements">
        <Suspense fallback={<div />}>
          <DissolvePrivateRequirementsTab />
        </Suspense>
      </div>
      <div id="process">
        {/* <DissolvePrivateProcess /> */}
      </div>

      <div id="documents">
        {/* <DissolvePrivateDocument/> */}
      </div>
      <div id="faq">
        <Suspense fallback={<div />}>
          <DissolvePrivateFAQ/>
        </Suspense>
      </div>
      <Suspense fallback={<div />}>
        <DissolavePrivatesTestimonial />
      </Suspense>
      <Suspense fallback={<div />}>
        <DissolveVideoTestimonial/>
      </Suspense>
      <Suspense fallback={<div />}>
        <DissolaveOurClients/>
      </Suspense>
      

    </div>
  );
};

export default DissolvePrivate;
