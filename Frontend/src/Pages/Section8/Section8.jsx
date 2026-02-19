import React from 'react'
import Section8Breadcrum from '../../Components/Section8Breadcrum/Section8Breadcrum'

import Section8FAQ from '../../Components/Section8FAQ/Section8FAQ'
import Section8PlanAndPricing from '../../Components/Secton8PlanAndPricing/Secton8PlanAndPricing'
import Section8TermsCondition from '../../Components/Section8TermsCondition/Section8TermsCondition'
import Section8Premium from '../../Components/Section8Premium/Section8Premium'
import Section8Tabs from '../../Components/Section8Tabs/Section8Tabs'
import Section8CompanyTabs from '../../Components/Section8CompanyTabs/Section8CompanyTabs'
import Section8PvtTypes from '../../Components/Section8PvtTypes/Section8PvtTypes'
import Section8RequirementsTab from '../../Components/Section8RequirementsTab/Section8RequirementsTab'
import Section8Process from '../../Components/Section8Process/Section8Process'
import Section8Testimonial from '../../Components/Section8Testimonial/Section8Testimonial'
import Section8VideoTestimonial from '../../Components/Section8VideoTestimonial/Section8VideoTestimonial'
import Section8OurClients from '../../Components/Section8OurClients/Section8OurClients'
import Section8Document from '../../Components/Section8Document/Section8Document'

const Section8 = () => {
  return (
    <div>
      <Section8Breadcrum />
      <div id="plans">
      <Section8PlanAndPricing/>
      </div>
      <Section8TermsCondition/>

      <div id="premium">
      <Section8Premium/>
      </div>
      <Section8Tabs/>
      <div id="company">
      <Section8CompanyTabs/>
      </div>
      <div id="types">
      {/* <Section8PvtTypes/> */}
      </div>
      <div id="requirements">
      <Section8RequirementsTab/>
      </div>
      <div id="process">
      <Section8Process/>
      </div>
      <div id="documents">
      <Section8Document/>
      </div>
      <div id="faq">
      <Section8FAQ/>
      </div>

      <Section8Testimonial/>
      <Section8VideoTestimonial/>
      <Section8OurClients/>
     
      

      
      

    </div>
  )
}

export default Section8
