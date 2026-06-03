import React, { Suspense } from 'react'
import ShopRegBreadcrum from '../../Components/ShopRegBreadcrum/ShopRegBreadcrum'

// Lazy load below-fold components
const ShopRegProcess = React.lazy(() => import('../../Components/ShopRegProcess/ShopRegProcess'))
const ShopRegDocuments = React.lazy(() => import('../../Components/ShopRegDocuments/ShopRegDocuments'))
const ShopRegFAQ = React.lazy(() => import('../../Components/ShopRegFAQ/ShopRegFAQ'))
const ShopRegTerms = React.lazy(() => import('../../Components/ShopRegTerms/ShopRegTerms'))

const ShopReg = () => {
  return (
    <div>
      <ShopRegBreadcrum />
      <Suspense fallback={<div />}>
        <ShopRegProcess />
      </Suspense>
      <Suspense fallback={<div />}>
        <ShopRegDocuments />
      </Suspense>
      <Suspense fallback={<div />}>
        <ShopRegFAQ />
      </Suspense>
      <Suspense fallback={<div />}>
        <ShopRegTerms />
      </Suspense>
    </div>
  )
}

export default ShopReg
