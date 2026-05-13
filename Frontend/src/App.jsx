import React, { lazy, Suspense, useEffect } from "react";
import { BrowserRouter as Router, Routes, Route, useLocation, useNavigationType } from "react-router-dom";
import "./App.css";

import Navbar from "./Components/Navbar/Navbar";
import Footer from "./Components/Footer/Footer";
import RouteLoaderWrapper from "./Components/PageLoader/RouteLoaderWrapper";
import FloatIcon from "./Components/FloatIcon/FloatIcon";

const Home = lazy(() => import("./Pages/Home/Home"));
const ContactUs = lazy(() => import("./Pages/ContactUs/ContactUs"));
const Blog = lazy(() => import("./Pages/Blog/Blog"));
const BlogDetails = lazy(() => import("./Pages/BlogDetails/BlogDetails"));
const OPC = lazy(() => import("./Pages/OPC/OPC"));
const Publicltd = lazy(() => import("./Pages/Publicltd/Publicltd"));
const PrivateLimited = lazy(() => import("./Pages/PrivateLimited/PrivateLimited"));
const IncorptionPage = lazy(() => import("./Pages/IncorptionPage/IncorptionPage"));
const Trust = lazy(() => import("./Pages/Trust/Trust"));
const Society = lazy(() => import("./Pages/Society/Society"));
const Section8 = lazy(() => import("./Pages/Section8/Section8"));
const LLP = lazy(() => import("./Pages/LLP/LLP"));
const GSTRegistration = lazy(() => import("./Pages/GSTRegistration/GSTRegistration"));
const GSTReturn = lazy(() => import("./Pages/GSTReturn/GSTReturn"));
const EPFReg = lazy(() => import("./Pages/EPFReg/EPFReg"));
const UdyamReg = lazy(() => import("./Pages/UdyamReg/UdyamReg"));
const ESICReg = lazy(() => import("./Pages/ESICReg/ESICReg"));
const ProfessionalReg = lazy(() => import("./Pages/ProfessionalReg/ProfessionalReg"));
const ShopReg = lazy(() => import("./Pages/ShopReg/ShopReg"));
const Proprietorship = lazy(() => import("./Pages/Proprietorship/Proprietorship"));
const Parternership = lazy(() => import("./Pages/Parternership/Parternership"));
const PartnershiptoPrivate = lazy(() => import("./Pages/PartnershiptoPrivate/PartnershiptoPrivate"));
const LlptoPrivate = lazy(() => import("./Pages/LlptoPrivate/LlptoPrivate"));
const PritoLlp = lazy(() => import("./Pages/PritoLlp/PritoLlp"));
const IEC = lazy(() => import("./Pages/IEC/IEC"));
const FoodLicense = lazy(() => import("./Pages/FoodLicense/FoodLicense"));
const TradeLicense = lazy(() => import("./Pages/TradeLicense/TradeLicense"));
const ProprietorshipOPC = lazy(() => import("./Pages/ProprietorshipOPC/ProprietorshipOPC"));
const PropritorshipPLC = lazy(() => import("./Pages/ProprietorshipPLC/ProprietorshipPLC"));
const PartnershipLLP = lazy(() => import("./Pages/PartnershipLLP/PartnershipLLP"));
const LLRegistration = lazy(() => import("./Pages/LLRegistration/LLRegistration"));
const BCRegistration = lazy(() => import("./Pages/BCRegistration/BCRegistration"));
const ISOCertification = lazy(() => import("./Pages/ISOCertification/ISOCertification"));
const DissolveLLP = lazy(() => import("./Pages/DissolveLLP/DissolveLLP"));
const DissolvePartnership = lazy(() => import("./Pages/DissolvePartnership/DissolvePartnership"));
const TMRenewal = lazy(() => import("./Pages/TMRenewal/TMRenewal"));
const TMApplication = lazy(() => import("./Pages/TMApplication/TMApplication"));
const ReplyOfExaminationReport = lazy(() => import("./Pages/ReplyOfExaminationReport/ReplyOfExaminationReport"));
const ChangeInCompany = lazy(() => import("./Pages/ChangeInCompany/ChangeInCompany"));
const CIROfficeAddress = lazy(() => import("./Pages/CIROfficeAddress/CIROfficeAddress"));
const ChangeInObject = lazy(() => import("./Pages/ChangeInObject/ChangeInObject"));
const TrademarktoOpposition = lazy(() => import("./Pages/TrademarktoOpposition/TrademarktoOpposition"));
const TrademarktoHearing = lazy(() => import("./Pages/TrademarktoHearing/TrademarktoHearing"));
const WindupPLC = lazy(() => import("./Pages/WindupPLC/WindupPLC"));
const ChangeLlp = lazy(() => import("./Pages/ChangeLlp/ChangeLlp"));
const ChangeaddCom = lazy(() => import("./Pages/ChangeaddCom/ChangeaddCom"));
const ChangeObjectCom = lazy(() => import("./Pages/ChangeObjectCom/ChangeObjectCom"));
const Increase = lazy(() => import("./Pages/Increase/Increase"));
const Add = lazy(() => import("./Pages/Add/Add"));
const DissolvePrivate = lazy(() => import("./Pages/DissolvePrivate/DissolvePrivate"));
const PrivatetoPublic = lazy(() => import("./Pages/PrivatetoPublic/PrivatetoPublic"));
const PublictoPrivate = lazy(() => import("./Pages/PublictoPrivate/PublictoPrivate"));
const ChangetoCompany = lazy(() => import("./Pages/ChangetoCompany/ChangetoCompany"));
const ChangetoLlp = lazy(() => import("./Pages/ChangetoLlp/ChangetoLlp"));
const OLWF = lazy(() => import("./Pages/OLWF/OLWF"));
const StartupIndia = lazy(() => import("./Pages/StartupIndia/StartupIndia"));
const StartupOdisha = lazy(() => import("./Pages/StartupOdisha/StartupOdisha"));
const ITRIndividual = lazy(() => import("./Pages/ITRIndividual/ITRIndividual"));
const ITRBusiness = lazy(() => import("./Pages/ITRBusiness/ITRBusiness"));
const AnnualFilingCompany = lazy(() => import("./Pages/AnnualFilingCompany/AnnualFilingCompany"));
const AnnualFilingLLP = lazy(() => import("./Pages/AnnualFilingLLP/AnnualFilingLLP"));
const EPFReturn = lazy(() => import("./Pages/EPFReturn/EPFReturn"));
const ESIReturn = lazy(() => import("./Pages/ESIReturn/ESIReturn"));
const ProfessionalTaxReturn = lazy(() => import("./Pages/ProfessionalTaxReturn/ProfessionalTaxReturn"));
const About = lazy(() => import("./Pages/About/About"));
const Media = lazy(() => import("./Pages/Media/Media"));
const PrivacyPolicy = lazy(() => import("./Pages/Policies/PrivacyPolicy"));
const TermsConditions = lazy(() => import("./Pages/Policies/TermsConditions"));
const RefundPolicy = lazy(() => import("./Pages/Policies/RefundPolicy"));
const ConfidentialityPolicy = lazy(() => import("./Pages/Policies/ConfidentialityPolicy"));

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

function App() {
  return (
    <Router>
      <ScrollManager />
      <Navbar />

      <RouteLoaderWrapper>
        <Suspense fallback={null}>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/contact/us" element={<ContactUs />} />
            <Route path="/blog" element={<Blog />} />
            <Route path="/blog/details" element={<BlogDetails />} />
            <Route path="/one-person-company" element={<OPC />} />
            <Route path="/public-limited-company-registration-in-india" element={<Publicltd />} />
            <Route path="/private-limited-company-registration-in-india" element={<PrivateLimited />} />
            <Route path="/incorption-registration-in-india" element={<IncorptionPage />} />
            <Route path="/trust" element={<Trust />} />
            <Route path="/society" element={<Society />} />
            <Route path="/section-8" element={<Section8 />} />
            <Route path="/llp" element={<LLP />} />
            <Route path="/gst-registration" element={<GSTRegistration />} />
            <Route path="/gst-return-filing" element={<GSTReturn />} />
            <Route path="/epf" element={<EPFReg />} />
            <Route path="/udyam" element={<UdyamReg />} />
            <Route path="/esic" element={<ESICReg />} />
            <Route path="/professional-tax" element={<ProfessionalReg />} />
            <Route path="/shop-establishment" element={<ShopReg />} />
            <Route path="/proprietorship" element={<Proprietorship />} />
            <Route path="/iec" element={<IEC />} />
            <Route path="/food-license" element={<FoodLicense />} />
            <Route path="/trade-license" element={<TradeLicense />} />
            <Route path="/partnership" element={<Parternership />} />
            <Route path="/conversion/partnership-to-private" element={<PartnershiptoPrivate />} />
            <Route path="/conversion/llp-to-private" element={<LlptoPrivate />} />
            <Route path="/conversion/private-to-llp" element={<PritoLlp />} />
            <Route path="/labour-license" element={<LLRegistration />} />
            <Route path="/bar-code" element={<BCRegistration />} />
            <Route path="/iso" element={<ISOCertification />} />
            <Route path="/conversion/proprietorship-to-opc" element={<ProprietorshipOPC />} />
            <Route path="/conversion/proprietorship-to-private" element={<PropritorshipPLC />} />
            <Route path="/conversion/partnership-to-llp" element={<PartnershipLLP />} />
            <Route path="/updation/change-name-company" element={<ChangeInCompany />} />
            <Route path="/updation/change-address-llp" element={<CIROfficeAddress />} />
            <Route path="/updation/change-object-llp" element={<ChangeInObject />} />
            <Route path="/updation/change-name-llp" element={<ChangeLlp />} />
            <Route path="/updation/change-address-company" element={<ChangeaddCom />} />
            <Route path="/updation/change-object-company" element={<ChangeObjectCom />} />
            <Route path="/updation/increase-authorised-capital" element={<Increase />} />
            <Route path="/updation/add-remove-director" element={<Add />} />
            <Route path="/windup/dissolve-private" element={<DissolvePrivate />} />
            <Route path="/windup/dissolve-llp" element={<DissolveLLP />} />
            <Route path="/windup/dissolve-partnership" element={<DissolvePartnership />} />
            <Route path="/windup/wind-up-plc" element={<WindupPLC />} />
            <Route path="/trademark/opposition" element={<TrademarktoOpposition />} />
            <Route path="/trademark/hearing" element={<TrademarktoHearing />} />
            <Route path="/trademark/renewal" element={<TMRenewal />} />
            <Route path="/trademark/application" element={<TMApplication />} />
            <Route path="/trademark/exam-reply" element={<ReplyOfExaminationReport />} />
            <Route path="/conversion/private-to-public" element={<PrivatetoPublic />} />
            <Route path="/conversion/public-to-private" element={<PublictoPrivate />} />
            <Route path="/updation/change-name-company-to-company" element={<ChangetoCompany />} />
            <Route path="/updation/change-name-llp-to-llp" element={<ChangetoLlp />} />
            <Route path="/olwf" element={<OLWF />} />
            <Route path="/startup-india" element={<StartupIndia />} />
            <Route path="/startup-odisha" element={<StartupOdisha />} />
            <Route path="/itr-individual" element={<ITRIndividual />} />
            <Route path="/itr-business" element={<ITRBusiness />} />
            <Route path="/annual-filing-company" element={<AnnualFilingCompany />} />
            <Route path="/annual-filing-llp" element={<AnnualFilingLLP />} />
            <Route path="/epf-return" element={<EPFReturn />} />
            <Route path="/esi-return" element={<ESIReturn />} />
            <Route path="/professional-tax-return" element={<ProfessionalTaxReturn />} />
            <Route path="/about" element={<About />} />
            <Route path="/media" element={<Media />} />
            <Route path="/privacy-policy" element={<PrivacyPolicy />} />
            <Route path="/terms-conditions" element={<TermsConditions />} />
            <Route path="/refund-policy" element={<RefundPolicy />} />
            <Route path="/confidentiality-policy" element={<ConfidentialityPolicy />} />
          </Routes>
        </Suspense>
      </RouteLoaderWrapper>

      <FloatIcon />
      <Footer />
    </Router>
  );
}

export default App;
