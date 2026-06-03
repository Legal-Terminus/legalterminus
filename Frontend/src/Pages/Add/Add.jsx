import React, { Suspense } from 'react'
import AddBreadcrum from '../../Components/AddBreadcrum/AddBreadcrum'

// Lazy load below-fold components
const AddPlanandPricing = React.lazy(() => import('../../Components/AddPlanandPricing/AddPlanandPricing'))
const AddZolvitPremium = React.lazy(() => import('../../Components/AddZolvitPremium/AddZolvitPremium'))
const AddTabs = React.lazy(() => import('../../Components/AddTabs/AddTabs'))
const AddCompanyTab = React.lazy(() => import('../../Components/AddCompanyTab/AddCompanyTab'))
const AddTypes = React.lazy(() => import('../../Components/AddTypes/AddTypes'))
const AddRequirementsTab = React.lazy(() => import('../../Components/AddRequirementsTab/AddRequirementsTab'))
const AddProcess = React.lazy(() => import('../../Components/AddProcess/AddProcess'))
const PvtltdDocument = React.lazy(() => import('../../Components/PvtltdDocument/PvtltdDocument'))
const AddFAQ = React.lazy(() => import('../../Components/AddFAQ/AddFAQ'))
const AddTermsCondition = React.lazy(() => import('../../Components/AddTermsCondition/AddTermsCondition'))
const AddTestimonial = React.lazy(() => import('../../Components/AddTestimonial/AddTestimonial'))
const AddVideoTestimonial = React.lazy(() => import('../../Components/AddVideoTestimonial/AddVideoTestimonial'))
const AddOurclints = React.lazy(() => import('../../Components/AddOurclints/AddOurClints'))

const PrivateLimited = () => {
  return (
    <div>
      <AddBreadcrum />

      <div id="plans">
        <Suspense fallback={<div />}>
          <AddPlanandPricing />
        </Suspense>
      </div>

      <Suspense fallback={<div />}>
        <AddTermsCondition/>
      </Suspense>


      <div id="premium">
        <Suspense fallback={<div />}>
          <AddZolvitPremium />
        </Suspense>
      </div>

      <Suspense fallback={<div />}>
        <AddTabs/>
      </Suspense>

      <div id="company">
        <Suspense fallback={<div />}>
          <AddCompanyTab />
        </Suspense>
      </div>

      <div id="types">
        <Suspense fallback={<div />}>
          <AddTypes />
        </Suspense>
      </div>

      <div id="requirements">
        <Suspense fallback={<div />}>
          <AddRequirementsTab />
        </Suspense>
      </div>

      <div id="process">
        {/* <AddProcess /> */}
      </div>

      <div id="documents">
        {/* <PvtltdDocument /> */}
      </div>

      <div id="faq">
        <Suspense fallback={<div />}>
          <AddFAQ/>
        </Suspense>
      </div>

      <Suspense fallback={<div />}>
        <AddTestimonial />
      </Suspense>
      <Suspense fallback={<div />}>
        <AddVideoTestimonial />
      </Suspense>
      <Suspense fallback={<div />}>
        <AddOurclints />
      </Suspense>
      
    </div>
  );
};

export default PrivateLimited