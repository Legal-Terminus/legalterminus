import React, { lazy, Suspense, useEffect } from "react";
import { BrowserRouter as Router, Routes, Route, useLocation, useNavigationType } from "react-router-dom";
import SeoHead from "./Components/SeoHead/SeoHead";
import "./App.css";

import Navbar from "./Components/Navbar/Navbar";
import Footer from "./Components/Footer/Footer";
import CompanyRegBottomBar from "./Components/CompanyRegBottomBar/CompanyRegBottomBar";
import RouteLoaderWrapper from "./Components/PageLoader/RouteLoaderWrapper";
import FloatIcon from "./Components/FloatIcon/FloatIcon";
import LazyServiceFooterSections from "./Components/LazyServiceFooterSections/LazyServiceFooterSections";
import ProtectedRoute from "./Components/ProtectedRoute/ProtectedRoute";
// Eager-loaded (not lazy) so its hero is in the DOM the instant we navigate —
// this prevents the empty-route gap where the footer would sit at the top and
// the browser would scroll-anchor down to it.
import PdfTools from "./Pages/PdfTools/PdfTools";

const MyProfile = lazy(() => import("./Pages/MyProfile/MyProfile"));
const PaymentResult = lazy(() => import("./Pages/PaymentResult/PaymentResult"));
const Login = lazy(() => import("./Pages/Login/Login"));
const Signup = lazy(() => import("./Pages/Signup/Signup"));
const ForgotPassword = lazy(() => import("./Pages/ForgotPassword/ForgotPassword"));

const Home = lazy(() => import("./Pages/Home/Home"));
const ContactUs = lazy(() => import("./Pages/ContactUs/ContactUs"));
const Blog = lazy(() => import("./Pages/Blog/Blog"));
const BlogDetails = lazy(() => import("./Pages/BlogDetails/BlogDetails"));
const OPC = lazy(() => import("./Pages/OPC/OPC"));
const Publicltd = lazy(() => import("./Pages/Publicltd/Publicltd"));
const IncorptionPage = lazy(() => import("./Pages/IncorptionPage/IncorptionPage"));
// #175: catch-all 404 — unknown URLs previously rendered an empty page at HTTP 200.
const NotFound = lazy(() => import("./Pages/NotFound/NotFound"));
const Trust = lazy(() => import("./Pages/Trust/Trust"));
const Society = lazy(() => import("./Pages/Society/Society"));
const Section8 = lazy(() => import("./Pages/Section8/Section8"));
const LLP = lazy(() => import("./Pages/LLP/LLP"));
const GSTRegistration = lazy(() => import("./Pages/GSTRegistration/GSTRegistration"));
const GSTReturn = lazy(() => import("./Pages/GSTReturnFiling/GSTReturnFiling"));
const EPFReg = lazy(() => import("./Pages/EPFReg/EPFReg"));
const UdyamReg = lazy(() => import("./Pages/UdyamReg/UdyamReg"));
const ESICReg = lazy(() => import("./Pages/ESICReg/ESICReg"));
const ProfessionalReg = lazy(() => import("./Pages/ProfessionalReg/ProfessionalReg"));
const ShopReg = lazy(() => import("./Pages/ShopReg/ShopReg"));
const Proprietorship = lazy(() => import("./Pages/Proprietorship/Proprietorship"));
const Parternership = lazy(() => import("./Pages/Parternership/Parternership"));
const PartnershiptoPrivate = lazy(() => import("./Pages/PartToPvtNew/PartToPvtNew"));
const LlptoPrivate = lazy(() => import("./Pages/LlpToPvtNew/LlpToPvtNew"));
const PritoLlp = lazy(() => import("./Pages/PvtToLlpNew/PvtToLlpNew"));
const IEC = lazy(() => import("./Pages/IEC/IEC"));
const FoodLicense = lazy(() => import("./Pages/FoodLicense/FoodLicense"));
const TradeLicense = lazy(() => import("./Pages/TradeLicense/TradeLicense"));
const ProprietorshipOPC = lazy(() => import("./Pages/PropToOpcNew/PropToOpcNew"));
const PropritorshipPLC = lazy(() => import("./Pages/PropToPvtNew/PropToPvtNew"));
const PartnershipLLP = lazy(() => import("./Pages/PartToLlpNew/PartToLlpNew"));
const LabourLicense = lazy(() => import("./Pages/LabourLicense/LabourLicense"));
const BCRegistration = lazy(() => import("./Pages/BCRegistration/BCRegistration"));
const ISOCertification = lazy(() => import("./Pages/ISOCertification/ISOCertification"));
const DissolveLLP = lazy(() => import("./Pages/DissolveLLPNew/DissolveLLPNew"));
const DissolvePartnership = lazy(() => import("./Pages/DissolvePartnershipNew/DissolvePartnershipNew"));
const TMRenewal = lazy(() => import("./Pages/TMRenewalNew/TMRenewalNew"));
const TMApplication = lazy(() => import("./Pages/TMApplicationNew/TMApplicationNew"));
const ReplyOfExaminationReport = lazy(() => import("./Pages/TMExamReplyNew/TMExamReplyNew"));
const ChangeInCompany = lazy(() => import("./Pages/ChangeInCompany/ChangeInCompany"));
const CIROfficeAddress = lazy(() => import("./Pages/CIROfficeAddress/CIROfficeAddress"));
const ChangeInObject = lazy(() => import("./Pages/ChangeInObject/ChangeInObject"));
const TrademarktoOpposition = lazy(() => import("./Pages/TMOppositionNew/TMOppositionNew"));
const TrademarktoHearing = lazy(() => import("./Pages/TMHearingNew/TMHearingNew"));
const WindupPLC = lazy(() => import("./Pages/WindupPLC/WindupPLC"));
const ChangeLlp = lazy(() => import("./Pages/ChangeLlpNameNew/ChangeLlpNameNew"));
const ChangeaddCom = lazy(() => import("./Pages/ChangeAddrCompanyNew/ChangeAddrCompanyNew"));
const ChangeObjectCom = lazy(() => import("./Pages/ChangeObjectCompanyNew/ChangeObjectCompanyNew"));
const Increase = lazy(() => import("./Pages/IncreaseCapitalNew/IncreaseCapitalNew"));
const Add = lazy(() => import("./Pages/Add/Add"));
const DissolvePrivate = lazy(() => import("./Pages/DissolvePrivateNew/DissolvePrivateNew"));
const PrivatetoPublic = lazy(() => import("./Pages/PvtToPublicNew/PvtToPublicNew"));
const PublictoPrivate = lazy(() => import("./Pages/PubToPvtNew/PubToPvtNew"));
const ChangetoCompany = lazy(() => import("./Pages/ChangetoCompany/ChangetoCompany"));
const ChangetoLlp = lazy(() => import("./Pages/ChangetoLlp/ChangetoLlp"));
const OLWF = lazy(() => import("./Pages/OLWF/OLWF"));
const StartupIndia = lazy(() => import("./Pages/StartupIndia/StartupIndia"));
const StartupOdisha = lazy(() => import("./Pages/StartupOdisha/StartupOdisha"));
const ITRIndividual = lazy(() => import("./Pages/ITRIndividualNew/ITRIndividualNew"));
const ITRBusiness = lazy(() => import("./Pages/ITRBusinessNew/ITRBusinessNew"));
const AnnualFilingCompany = lazy(() => import("./Pages/AnnualFilingCompanyNew/AnnualFilingCompanyNew"));
const AnnualFilingLLP = lazy(() => import("./Pages/AnnualFilingLLPNew/AnnualFilingLLPNew"));
const EPFReturn = lazy(() => import("./Pages/EPFReturnNew/EPFReturnNew"));
const ESIReturn = lazy(() => import("./Pages/ESIReturnNew/ESIReturnNew"));
const ProfessionalTaxReturn = lazy(() => import("./Pages/ProfessionalTaxReturn/ProfessionalTaxReturn"));
const About = lazy(() => import("./Pages/About/About"));
const Media = lazy(() => import("./Pages/Media/Media"));
const PrivacyPolicy = lazy(() => import("./Pages/Policies/PrivacyPolicy"));
const TermsConditions = lazy(() => import("./Pages/Policies/TermsConditions"));
const RefundPolicy = lazy(() => import("./Pages/Policies/RefundPolicy"));
const ConfidentialityPolicy = lazy(() => import("./Pages/Policies/ConfidentialityPolicy"));
const PrivateLimitedCopy2 = lazy(() => import("./Pages/PrivateLimitedCopy2/PrivateLimitedCopy2"));
const CompanyRegOdisha = lazy(() => import("./Pages/CompanyRegOdisha/CompanyRegOdisha"));
const CompanyRegistrationOdisha = lazy(() => import("./Pages/CompanyRegistrationOdisha/CompanyRegistrationOdisha"));
const CompanyRegistrationLanding = lazy(() => import("./Pages/CompanyRegistrationLanding/CompanyRegistrationLanding"));
const TrademarkLanding = lazy(() => import("./Pages/TrademarkLanding/TrademarkLanding"));
const BlogPost = lazy(() => import("./Pages/BlogPost/BlogPost"));

// Store scroll positions keyed by location.key
const scrollPositions = {};

// Disable browser's built-in scroll restoration so we fully control it
if (typeof window !== "undefined") {
  window.history.scrollRestoration = "manual";
}

function ScrollManager() {
  const { pathname, key } = useLocation();
  const navType = useNavigationType();

  useEffect(() => {
    if (navType === "POP") {
      const saved = scrollPositions[key] ?? 0;
      // Delay slightly so lazy-loaded content finishes rendering
      const id = setTimeout(() => {
        window.scrollTo({ top: saved, behavior: "instant" });
      }, 50);
      return () => clearTimeout(id);
    } else {
      window.scrollTo({ top: 0, behavior: "instant" });
    }
  }, [pathname, key, navType]);

  // Save scroll position just before leaving this entry
  useEffect(() => {
    const save = () => { scrollPositions[key] = window.scrollY; };
    window.addEventListener("scroll", save, { passive: true });
    return () => {
      save();
      window.removeEventListener("scroll", save);
    };
  }, [key]);

  return null;
}

// Routes that render as standalone landing pages (no global navbar / footer)
const STANDALONE_LANDING_ROUTES = ["/companyregistration-in-odisha", "/trademark-registration-in-odisha"];

function ConditionalNavbar() {
  const { pathname } = useLocation();
  if (STANDALONE_LANDING_ROUTES.includes(pathname)) return null;
  return <Navbar />;
}

function ConditionalFooter() {
  const { pathname } = useLocation();
  // Standalone landing page: no full footer, just the disclaimer + copyright bar
  if (STANDALONE_LANDING_ROUTES.includes(pathname)) return <CompanyRegBottomBar />;
  return <Footer />;
}

function App() {
  return (
    <Router>
      {/* #175: head-only SEO metadata (title/meta/canonical) — renders no DOM. */}
      <SeoHead />
      <ScrollManager />
      <ConditionalNavbar />

      <RouteLoaderWrapper>
        <Suspense fallback={null}>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<Signup />} />
            <Route path="/forgot-password" element={<ForgotPassword />} />
            <Route path="/contact/us" element={<ContactUs />} />
            <Route path="/blog" element={<Blog />} />
            <Route path="/blog/details" element={<BlogDetails />} />
            <Route path="/blog/:slug" element={<BlogPost />} />
            <Route path="/my-profile" element={<ProtectedRoute><MyProfile /></ProtectedRoute>} />
            <Route path="/payment/result" element={<PaymentResult />} />
            <Route path="/setting-up-a-business/profit-making-structures/one-person-company-registration-in-india" element={<OPC />} />
            <Route path="/setting-up-a-business/profit-making-structures/public-limited-company-registration-in-india" element={<Publicltd />} />
            <Route path="/setting-up-a-business/profit-making-structures/incorporation-of-wholly-owned-subsidiary-in-india" element={<IncorptionPage />} />
            <Route path="/setting-up-a-business/non-profit-making-structures/trust-registration-in-india" element={<Trust />} />
            <Route path="/setting-up-a-business/non-profit-making-structures/society-registration-in-india" element={<Society />} />
            <Route path="/setting-up-a-business/non-profit-making-structures/non-profit-company-sec-8-company-registration-in-india" element={<Section8 />} />
            <Route path="/setting-up-a-business/profit-making-structures/limited-liability-partnership-registration-in-india" element={<LLP />} />
            <Route path="/registrations-returns/registrations/gst-registration-in-india" element={<GSTRegistration />} />
            <Route path="/registrations-returns/return-filing/gst-return-filing" element={<GSTReturn />} />
            <Route path="/registrations-returns/registrations/epf-registration-in-india" element={<EPFReg />} />
            <Route path="/registrations-returns/registrations/udyam-registration-in-india" element={<UdyamReg />} />
            <Route path="/registrations-returns/registrations/esic-registration-in-india" element={<ESICReg />} />
            <Route path="/registrations-returns/registrations/professional-tax-registration" element={<ProfessionalReg />} />
            <Route path="/registrations-returns/registrations/shop-commercial-establishments-registration-in-india" element={<ShopReg />} />
            <Route path="/setting-up-a-business/profit-making-structures/proprietorship-firm-registration-in-india" element={<Proprietorship />} />
            <Route path="/registrations-returns/license-certifications/importer-exporter-code-registration" element={<IEC />} />
            <Route path="/registrations-returns/license-certifications/food-license-and-registration" element={<FoodLicense />} />
            <Route path="/registrations-returns/license-certifications/trade-license-registration" element={<TradeLicense />} />
            <Route path="/setting-up-a-business/profit-making-structures/partnership-firm-registration-in-india" element={<Parternership />} />
            <Route path="/event-based-compliances/conversion-in-form-of-business/partnership-firm-to-private-limited-company" element={<PartnershiptoPrivate />} />
            <Route path="/event-based-compliances/conversion-in-form-of-business/conversion-of-llp-into-private-limited-company" element={<LlptoPrivate />} />
            <Route path="/event-based-compliances/conversion-in-form-of-business/conversion-of-private-limited-company-into-llp" element={<PritoLlp />} />
            <Route path="/registrations-returns/license-certifications/labour-license-registration" element={<LabourLicense />} />
            <Route path="/registrations-returns/license-certifications/bar-code-registration" element={<BCRegistration />} />
            <Route path="/registrations-returns/license-certifications/iso-certification-in-india" element={<ISOCertification />} />
            <Route path="/event-based-compliances/conversion-in-form-of-business/conversion-of-proprietorship-into-opc-private-limited-company" element={<ProprietorshipOPC />} />
            <Route path="/event-based-compliances/conversion-in-form-of-business/conversion-of-proprietorship-into-private-limited-company" element={<PropritorshipPLC />} />
            <Route path="/event-based-compliances/conversion-in-form-of-business/conversion-of-partnership-into-limited-liability-partnership" element={<PartnershipLLP />} />
            <Route path="/event-based-compliances/change-company-name" element={<ChangeInCompany />} />
            <Route path="/event-based-compliances/change-in-registered-office-address-for-llp" element={<CIROfficeAddress />} />
            <Route path="/event-based-compliances/changing-the-objects-of-llp" element={<ChangeInObject />} />
            <Route path="/event-based-compliances/name-change-process-in-india-for-llp" element={<ChangeLlp />} />
            <Route path="/event-based-compliances/change-in-registered-office-address" element={<ChangeaddCom />} />
            <Route path="/event-based-compliances/change-in-object-clause-of-a-company" element={<ChangeObjectCom />} />
            <Route path="/event-based-compliances/increase-authorized-share-capital-company" element={<Increase />} />
            <Route path="/event-based-compliances/add-or-remove-a-director-company" element={<Add />} />
            <Route path="/event-based-compliances/windup-services/process-of-winding-up-of-a-company" element={<DissolvePrivate />} />
            <Route path="/event-based-compliances/windup-services/process-of-winding-up-limited-liability-partnership" element={<DissolveLLP />} />
            <Route path="/event-based-compliances/windup-services/dissolution-of-partnership-firm" element={<DissolvePartnership />} />
            <Route path="/windup/wind-up-plc" element={<WindupPLC />} />
            <Route path="/trademark/registration-and-compliance-services/trademark-opposition-in-india" element={<TrademarktoOpposition />} />
            <Route path="/trademark/registration-and-compliance-services/trademark-hearing-in-india" element={<TrademarktoHearing />} />
            <Route path="/trademark/registration-and-compliance-services/trademark-renewal-in-india" element={<TMRenewal />} />
            <Route path="/trademark/registration-and-compliance-services/trademark-registration-in-india" element={<TMApplication />} />
            <Route path="/trademark/registration-and-compliance-services/reply-to-examination-report-trademark" element={<ReplyOfExaminationReport />} />
            <Route path="/event-based-compliances/conversion-in-form-of-business/conversion-of-private-limited-company-to-public-limited-company" element={<PrivatetoPublic />} />
            <Route path="/event-based-compliances/conversion-in-form-of-business/conversion-of-public-limited-company-to-private-limited-company" element={<PublictoPrivate />} />
            <Route path="/updation/change-name-company-to-company" element={<ChangetoCompany />} />
            <Route path="/updation/change-name-llp-to-llp" element={<ChangetoLlp />} />
            <Route path="/registrations-returns/license-certifications/odisha-labour-welfare-fund-olwf-registration" element={<OLWF />} />
            <Route path="/registrations-returns/registrations/startup-india-registration" element={<StartupIndia />} />
            <Route path="/registrations-returns/registrations/startup-odisha-registration" element={<StartupOdisha />} />
            <Route path="/registrations-returns/return-filing/itr-filing-individual" element={<ITRIndividual />} />
            <Route path="/registrations-returns/return-filing/itr-filing-company" element={<ITRBusiness />} />
            <Route path="/registrations-returns/return-filing/annual-filing-company" element={<AnnualFilingCompany />} />
            <Route path="/registrations-returns/return-filing/annual-filing-llp" element={<AnnualFilingLLP />} />
            <Route path="/registrations-returns/return-filing/epf-return-filing" element={<EPFReturn />} />
            <Route path="/registrations-returns/return-filing/esi-return-filing" element={<ESIReturn />} />
            <Route path="/registrations-returns/return-filing/professional-tax-return-filing" element={<ProfessionalTaxReturn />} />
            <Route path="/about" element={<About />} />
            <Route path="/media" element={<Media />} />
            <Route path="/privacy-policy" element={<PrivacyPolicy />} />
            <Route path="/policies/privacy" element={<PrivacyPolicy />} />
            <Route path="/terms-conditions" element={<TermsConditions />} />
            <Route path="/policies/terms" element={<TermsConditions />} />
            <Route path="/refund-policy" element={<RefundPolicy />} />
            <Route path="/policies/refund" element={<RefundPolicy />} />
            <Route path="/confidentiality-policy" element={<ConfidentialityPolicy />} />
            <Route path="/policies/confidentiality" element={<ConfidentialityPolicy />} />
            <Route path="/setting-up-a-business/profit-making-structures/private-limited-company-registration-in-india" element={<PrivateLimitedCopy2 />} />
            <Route path="/company-registration-consultancy-in-odisha" element={<CompanyRegOdisha />} />
            <Route path="/company-registration-odisha" element={<CompanyRegistrationOdisha />} />
            <Route path="/companyregistration-in-odisha" element={<CompanyRegistrationLanding />} />
            <Route path="/trademark-registration-in-odisha" element={<TrademarkLanding />} />
            <Route path="/pdf-tools" element={<PdfTools />} />
            {/* #175: must stay LAST — matches only when no other route does. */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </Suspense>
      </RouteLoaderWrapper>

      <LazyServiceFooterSections />
      <FloatIcon />
      <ConditionalFooter />
    </Router>
  );
}

export default App;
