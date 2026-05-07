import React from "react";
import LlptoPrivateBreadcrum from "../../Components/LlptoPrivateBreadcrum/LlptoPrivateBreadcrum";
import LlptoPrivatePlanandPrice from "../../Components/LlptoPrivatePlanandPrice/LlptoPrivatePlanandPrice";
import LlptoPriTermandcondn from "../../Components/LlptoPriTermandcondn/LlptoPriTermandcondn";
import LlptoPriZolvitPremium from "../../Components/LlptoPriZolvitPremium/LlptoPriZolvitPremium";
import LlptoPriTabs from "../../Components/LlptoPriTabs/LlptoPriTabs";
import LlptoPriCompanyTab from "../../Components/LlptoPriCompanyTab/LlptoPriCompanyTab";
import LlptoPriTypes from "../../Components/LlptoPriTypes/LlptoPriTypes";
import LlptoPriRequirementsTab from "../../Components/LlptoPriRequirementsTab/LlptoPriRequirementsTab";
import LlptoPriProcess from "../../Components/LlptoPriProcess/LlptoPriProcess";
import LlptoPriDocInfographic from "../../Components/LlptoPriDocInfographic/LlptoPriDocInfographic";
import LlptoPriFAQ from "../../Components/LlptoPriFAQ/LlptoPriFAQ";
import LlptoPriTestimonial from "../../Components/LlptoPriTestimonial/LlptoPriTestimonial";
import LlptoPriVideoTestimonial from "../../Components/LlptoPriVideoTestimonial/LlptoPriVideoTestimonial";
import LlptoPriOurclients from "../../Components/LlptoPriOurclients/LlptoPriOurclients";

function LLP() {
  return (
    <div>
      {/* Breadcrumb */}
      <LlptoPrivateBreadcrum/>

      {/* Plans */}
      <div id="plans">
        {/* <LlptoPrivatePlanandPrice /> */}
      </div>

      {/* Terms & Conditions */}
      {/* <LlptoPriTermandcondn/> */}

      {/* Premium */}
      <div id="premium">
        <LlptoPriZolvitPremium />
      </div>

      {/* Tabs */}
      <LlptoPriTabs/>

      {/* Company */}
      <div id="company">
        <LlptoPriCompanyTab/>
      </div>

      {/* Types */}
      <div id="types">
        {/* <LlptoPriTypes /> */}
      </div>

      {/* Requirements */}
      <div id="requirements">
        <LlptoPriRequirementsTab/>
      </div>

      {/* Process */}
      <div id="process">
        {/* <LlptoPriProcess /> */}
      </div>

      {/* Documents */}
      <div id="documents">
        {/* <LlptoPriDocInfographic /> */}
      </div>

      {/* FAQ */}
      <div id="faq">
        <LlptoPriFAQ />
      </div>

      {/* Testimonials */}
      <LlptoPriTestimonial />
      <LlptoPriVideoTestimonial />

      {/* Our Clients */}
      <LlptoPriOurclients />
    </div>
  );
}

export default LLP;
