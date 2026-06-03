import React, { Suspense } from 'react'
import ProfessionalRegBreadcrum from '../../Components/ProfessionalRegBreadcrum/ProfessionalRegBreadcrum'

// Lazy load below-the-fold components
const ProffesionalRegProcess = React.lazy(() => import('../../Components/ProffesionalRegProcess/ProffesionalRegProcess'))
const ProfessionalRegDocuments = React.lazy(() => import('../../Components/ProfessionalRegDocuments/ProfessionalRegDocuments'))
const ProfessionalRegFAQ = React.lazy(() => import('../../Components/ProfessionalRegFAQ/ProfessionalRegFAQ'))
const ProfessionalRegTerms = React.lazy(() => import('../../Components/ProfessionalRegTerms/ProfessionalRegTerms'))

const ProfessionalReg = () => {
  return (
    <div>
      <ProfessionalRegBreadcrum />
      <Suspense fallback={<div />}>
        <ProffesionalRegProcess />
      </Suspense>
      <Suspense fallback={<div />}>
        <ProfessionalRegDocuments />
      </Suspense>
      <Suspense fallback={<div />}>
        <ProfessionalRegFAQ />
      </Suspense>
      <Suspense fallback={<div />}>
        <ProfessionalRegTerms />
      </Suspense>
    </div>
  )
}

export default ProfessionalReg
