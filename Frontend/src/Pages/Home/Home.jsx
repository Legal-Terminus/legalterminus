import React, { Suspense } from 'react'
import './Home.css'
import Herosection from '../../Components/Herosection/Herosection'
import Premiumbusiness from '../../Components/Premiumbusiness/Premiumbusiness'
import HomePdfToolsCta from '../../Components/HomePdfToolsCta/HomePdfToolsCta'
import { THEME_C } from '../../utils/theme'

// Lazy load below-fold components
const Workingprocess = React.lazy(() => import('../../Components/WorkingProcessPro/WorkingProcessPro'))
const Whoweare = React.lazy(() => import('../../Components/Whoweare/Whoweare'))
const Featureslegalservice = React.lazy(() => import('../../Components/Featureslegalservice/Featureslegalservice'))
const Legalhelp = React.lazy(() => import('../../Components/Legalhelp/Legalhelp'))
const HomeCertisfiedClient = React.lazy(() => import('../../Components/HomeCertisfiedClient/HomeCertisfiedClient'))
const HomeAboutExperiance = React.lazy(() => import('../../Components/HomeAboutExperiance/HomeAboutExperiance'))
const Testimonials = React.lazy(() => import('../../Components/Testimonials/Testimonials'))
const ContactUs = React.lazy(() => import('../../Components/Contactus/Contactus'))
const HomeLatestBlog = React.lazy(() => import('../../Components/HomeLatestBlog/HomeLatestBlog'))

const Home = () => {
  return (
    <>
        <Herosection/>
        <Premiumbusiness/>
        <HomePdfToolsCta/>
        <Suspense fallback={<div />}>
          <Workingprocess/>
        </Suspense>
        <Suspense fallback={<div />}>
          <Legalhelp/>
        </Suspense>
        <Suspense fallback={<div />}>
          <HomeCertisfiedClient />
        </Suspense>
        <Suspense fallback={<div />}>
          <HomeAboutExperiance />
        </Suspense>
        <Suspense fallback={<div />}>
          <Whoweare/>
        </Suspense>
        <Suspense fallback={<div />}>
          <Featureslegalservice/>
        </Suspense>
        {/* Theme C (#209, 13 Oct): Contact Us and the blog come straight after
            "Why We Stand Out"; Testimonials, then Our Clients, then the footer
            follow as the site-wide bottom block (LazyServiceFooterSections). */}
        {!THEME_C && (
          <Suspense fallback={<div />}>
            <Testimonials />
          </Suspense>
        )}
        <Suspense fallback={<div />}>
          <ContactUs />
        </Suspense>
        <Suspense fallback={<div />}>
          <HomeLatestBlog />
        </Suspense>
    </>
  )
}

export default Home