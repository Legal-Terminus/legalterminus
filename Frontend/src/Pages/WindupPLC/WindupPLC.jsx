import React, { Suspense } from 'react'
import WindupPLCBreadcrum from '../../Components/WindupPLCBreadcrum/WindupPLCBreadcrum';

// Lazy load below-fold components
const WindupPLCPP = React.lazy(() => import('../../Components/WindupPLCPP/WindupPLCPP'));
const WindupTC = React.lazy(() => import('../../Components/WindupTC/WindupTC'));
const WindupZolvitPremium = React.lazy(() => import('../../Components/WindupZolvitPremium/WindupZolvitPremium'));
const WindupPLCTabs = React.lazy(() => import('../../Components/WindupPLCTabs/WindupPLCTabs'));
const WindupCompanyTab = React.lazy(() => import('../../Components/WindupCompanyTab/WindupCompanyTab'));
const WindupTypes = React.lazy(() => import('../../Components/WindupTypes/WindupTypes'));
const WindupPLCRequirements = React.lazy(() => import('../../Components/WindupPLCRequirements/WindupPLCRequirements'));
const WindupPLCProcess = React.lazy(() => import('../../Components/WindupPLCProcess/WindupPLCProcess'));
const WindupPLCFAQ = React.lazy(() => import('../../Components/WindupPLCFAQ/WindupPLCFAQ'));
const WindupPLCTestimonial = React.lazy(() => import('../../Components/WindupPLCTestimonial/WindupPLCTestimonial'));
const WindupPLCVideoTestimonial = React.lazy(() => import('../../Components/WindupPLCVideoTestimonial/WindupPLCVideoTestimonial'));
const WindupPLCOurclints = React.lazy(() => import('../../Components/WindupPLCOurclints/WindupPLCOurclints'));
const WindupPLCDocument = React.lazy(() => import('../../Components/WindupPLCDocument/WindupPLCDocument'));

const WindupPLC = () => {
  return (
    <div>

        <WindupPLCBreadcrum/>

        <div id="plans">
            <Suspense fallback={<div />}>
              <WindupPLCPP/>
            </Suspense>
        </div>

        <Suspense fallback={<div />}>
          <WindupTC/>
        </Suspense>

        <div id="premium">
            <Suspense fallback={<div />}>
              <WindupZolvitPremium/>
            </Suspense>
        </div>

        <Suspense fallback={<div />}>
          <WindupPLCTabs/>
        </Suspense>

        <div id="company">
            <Suspense fallback={<div />}>
              <WindupCompanyTab/>
            </Suspense>
        </div>

        <div id="types">
            <Suspense fallback={<div />}>
              <WindupTypes/>
            </Suspense>
        </div>

        <div id="requirements">
            <Suspense fallback={<div />}>
              <WindupPLCRequirements/>
            </Suspense>
        </div>

        <div id="process">
            <Suspense fallback={<div />}>
              <WindupPLCProcess/>
            </Suspense>
        </div>

        <div id="documents">
            <Suspense fallback={<div />}>
              <WindupPLCDocument/>
            </Suspense>
        </div>
        

        <div id="faq">
            <Suspense fallback={<div />}>
              <WindupPLCFAQ/>
            </Suspense>
        </div>

        <Suspense fallback={<div />}>
          <WindupPLCTestimonial/>
        </Suspense>
        <Suspense fallback={<div />}>
          <WindupPLCVideoTestimonial/>
        </Suspense>
        <Suspense fallback={<div />}>
          <WindupPLCOurclints/>
        </Suspense>
        
      
    </div>
  )
}

export default WindupPLC
