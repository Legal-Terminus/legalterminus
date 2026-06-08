import React, { Suspense } from 'react'
import "./ISOCertification.css";
import ISObreadcrum from '../../Components/ISObreadcrum/ISObreadcrum'

// Lazy load below-fold components
const ISOplan = React.lazy(() => import('../../Components/ISOplan/ISOplan'))
const ISOtermandcondition = React.lazy(() => import('../../Components/ISOtermandcondition/ISOtermandcondition'))
const ISOpremium = React.lazy(() => import('../../Components/ISOpremium/ISOpremium'))
const ISOtabs = React.lazy(() => import('../../Components/ISOtabs/ISOtabs'))
const ISOcompany = React.lazy(() => import('../../Components/ISOcompany/ISOcompany'))
const ISOtypes = React.lazy(() => import('../../Components/ISOtypes/ISOtypes'))
const ISOrequirments = React.lazy(() => import('../../Components/ISOrequirments/ISOrequirments'))
const ISOprocess = React.lazy(() => import('../../Components/ISOprocess/ISOprocess'))
const ISOdocument = React.lazy(() => import('../../Components/ISOdocument/ISOdocument'))
const ISOfaq = React.lazy(() => import('../../Components/ISOfaq/ISOfaq'))

const ISOCertification = () => {
  return (
    <div>
      <div className="iso-page-hero">
        <ISObreadcrum />
      </div>

      <div className="section-divider" />

      <div id="plans" className="iso-page-pricing">
        <Suspense fallback={<div />}>
          <ISOplan />
        </Suspense>
      </div>

      <div className="section-divider" />

      <Suspense fallback={<div />}>
        <ISOtermandcondition />
      </Suspense>

      <div className="section-divider" />

      <div id="premium">
        <Suspense fallback={<div />}>
          <ISOpremium />
        </Suspense>
      </div>

      <Suspense fallback={<div />}>
        <ISOtabs />
      </Suspense>

      <div className="section-divider" />

      <div id="company">
        <Suspense fallback={<div />}>
          <ISOcompany />
        </Suspense>
      </div>

      <div className="section-divider" />

      <div id="types">
        <Suspense fallback={<div />}>
          <ISOtypes />
        </Suspense>
      </div>

      <div className="section-divider" />

      <div id="requirements">
        <Suspense fallback={<div />}>
          <ISOrequirments />
        </Suspense>
      </div>

      <div className="section-divider" />

      <div id="process">
        <Suspense fallback={<div />}>
          <ISOprocess />
        </Suspense>
      </div>

      <div className="section-divider" />

      <div id="documents">
        <Suspense fallback={<div />}>
          <ISOdocument />
        </Suspense>
      </div>

      <div className="section-divider" />

      <div id="faq">
        <Suspense fallback={<div />}>
          <ISOfaq />
        </Suspense>
      </div>
    </div>
  );
};

export default ISOCertification
