import React, { Suspense } from 'react'
import ReplyOfERBreadcrum from '../../Components/ReplyOfERBreadcrum/ReplyOfERBreadcrum'

// Lazy load below-fold components
const ReplyOfERPlanandPricing = React.lazy(() => import('../../Components/ReplyOfERPlanandPricing/ReplyOfERPlanandPricing'))
const ReplyOFERZolvitPremium = React.lazy(() => import('../../Components/ReplyOFERZolvitPremium/ReplyOFERZolvitPremium'))
const ReplyOfERTabs = React.lazy(() => import('../../Components/ReplyOfERTabs/ReplyOfERTabs'))
const ReplyOfERCompanyTab = React.lazy(() => import('../../Components/ReplyOfERCompanyTab/ReplyOfERCompanyTab'))
const ReplyOfERTypes = React.lazy(() => import('../../Components/ReplyOfERTypes/ReplyOfERTypes'))
const ReplyOfERTermsCondition = React.lazy(() => import('../../Components/ReplyOfERTermsCondition/ReplyOfERTermsCondition'))
const ReplyOfERRequirementsTab = React.lazy(() => import('../../Components/ReplyOfERRequirementsTab/ReplyOfERRequirementsTab'))
const ReplyOfERProcess = React.lazy(() => import('../../Components/ReplyOfERProcess/ReplyOfERProcess'))
const ReplyOfERDocuments = React.lazy(() => import('../../Components/ReplyOfERDocuments/ReplyOfERDocuments'))
const ReplyOfERFAQ = React.lazy(() => import('../../Components/ReplyOfERFAQ/ReplyOfERFAQ'))
const ReplyOfERTestimonial = React.lazy(() => import('../../Components/ReplyOfERTestimonial/ReplyOfERTestimonial'))
const ReplyOfERVideoTestimonial = React.lazy(() => import('../../Components/ReplyOfERVideoTestimonial/ReplyOfERVideoTestimonial'))
const ReplyOfEROurclints = React.lazy(() => import('../../Components/ReplyOfEROurclints/ReplyOfEROurclints'))

const ReplyOfExaminationReport = () => {
  return (
    <div>
      <ReplyOfERBreadcrum/>

      <div id="plans">
        <Suspense fallback={<div />}>
          <ReplyOfERPlanandPricing/>
        </Suspense>
      </div>

      <Suspense fallback={<div />}>
        <ReplyOfERTermsCondition/>
      </Suspense>

      <div id="premium">
        <Suspense fallback={<div />}>
          <ReplyOFERZolvitPremium/>
        </Suspense>
      </div>

      <Suspense fallback={<div />}>
        <ReplyOfERTabs/>
      </Suspense>

      <div id="company">
        <Suspense fallback={<div />}>
          <ReplyOfERCompanyTab/>
        </Suspense>
      </div>

      <div id="types">
        <Suspense fallback={<div />}>
          <ReplyOfERTypes/>
        </Suspense>
      </div>

      <div id="requirements">
        <Suspense fallback={<div />}>
          <ReplyOfERRequirementsTab/>
        </Suspense>
      </div>

      <div id="process">
        <Suspense fallback={<div />}>
          <ReplyOfERProcess/>
        </Suspense>
      </div>

       <div id="documents">
        <Suspense fallback={<div />}>
          <ReplyOfERDocuments/>
        </Suspense>
       </div>

      <div id="faq">
        <Suspense fallback={<div />}>
          <ReplyOfERFAQ/>
        </Suspense>
      </div>

      <Suspense fallback={<div />}>
        <ReplyOfERTestimonial/>
      </Suspense>
      <Suspense fallback={<div />}>
        <ReplyOfERVideoTestimonial/>
      </Suspense>
      <Suspense fallback={<div />}>
        <ReplyOfEROurclints/>
      </Suspense>
    </div>
  )
}

export default ReplyOfExaminationReport
