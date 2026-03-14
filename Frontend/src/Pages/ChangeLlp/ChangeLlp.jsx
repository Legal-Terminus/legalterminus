import React from "react";
import ChangeLlpBreadcrum from "../../Components/ChangeLlpBreadcrum/ChangeLlpBreadcrum.jsx";
import ChangeLlpPlanandPrice from "../../Components/ChangeLlpPlanandPrice/ChangeLlpPlanandPrice";
import ChangeLlpTermandCondn from "../../Components/ChangeLlpTermandCondn/ChangeLlpTermandCondn";
import ChangeLlpZolvitPremium from "../../Components/ChangeLlpZolvitPremium/ChangeLlpZolvitPremium";
import ChangeLlpTabs from "../../Components/ChangeLlpTabs/ChangeLlpTabs";
import ChangeLlpCompanyTab from "../../Components/ChangeLlpCompanyTab/ChangeLlpCompanyTab";
import ChangeLlpTypes from "../../Components/ChangeLlpTypes/ChangeLlpTypes";
import ChangeLlpRequirementsTab from "../../Components/ChangeLlpRequirementsTab/ChangeLlpRequirementsTab";
import ChangeLlpProcess from "../../Components/ChangeLlpProcess/ChangeLlpProcess";
import ChangeLlpFAQ from "../../Components/ChangeLlpFAQ/ChangeLlpFAQ";
import ChangeLlpTestimonial from "../../Components/ChangeLlpTestimonial/changeLlpTestimonial";
import ChangeLlpVideoTestimonial from "../../Components/ChangeLlpVideoTestimonial/ChangeLlpVideoTestimonial";
import ChangeLlpOurClients from "../../Components/ChangeLlpOurClients/ChangeLlpOurClients";

function LLP() {
  return (
    <div>
      {/* Breadcrumb */}
      <ChangeLlpBreadcrum />

      {/* Plans */}
      <div id="plans">
        <ChangeLlpPlanandPrice />
      </div>

      {/* Terms & Conditions */}
      <ChangeLlpTermandCondn/>

      {/* Premium */}
      <div id="premium">
        <ChangeLlpZolvitPremium />
      </div>

      {/* Tabs */}
      <ChangeLlpTabs />

      {/* Company */}
      <div id="company">
        <ChangeLlpCompanyTab />
      </div>

      {/* Types */}
      <div id="types">
        <ChangeLlpTypes />
      </div>

      {/* Requirements */}
      <div id="requirements">
        <ChangeLlpRequirementsTab />
      </div>

      {/* Process */}
      <div id="process">
        {/* <ChangeLlpProcess /> */}
      </div>

      {/* FAQ */}
      <div id="faq">
        <ChangeLlpFAQ />
      </div>

      {/* Testimonials */}
      <ChangeLlpTestimonial />
      <ChangeLlpVideoTestimonial />

      {/* Our Clients */}
      <ChangeLlpOurClients />
    </div>
  );
}

export default LLP;
