import { useState, useEffect } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import { Navigation, Footer } from "./layout";
import {
  GetStartedPage,
  DashboardPage,
  AIServicesPage,
  DataServicePage,
  HorizontalLLMDataPage,
  VerticalLLMDataPage,
  AIGCPage,
  AIProjectsPage,
  AboutPage,
  OfficesPage,
  PhilImpactPage,
  CareersPage,
  ContactUsPage,
  InternalNewsPage,
  PrivacyPolicyPage,
  CookiePolicyPage,
  TermsConditionsPage,
} from "./pages";
import { Hero, About, ImpactStats, ESG, CTA } from "./components/sections";
import TrustedBy from "./components/sections/TrustedBy";
import Chatbot from "./components/Chatbot";

function App() {
  const [authMode, setAuthMode] = useState("signup");

  const navigateTo = (path) => {
    window.history.pushState({}, "", path);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <Router>
      <div className="app">
        <Navigation onSetAuthMode={setAuthMode} />
        <AnimatePresence mode="wait">
          <Routes>
            {/* Define all your routes here */}
            <Route path="/" element={<Hero onNavigate={navigateTo} />} />
            <Route path="/ai-services" element={<AIServicesPage />} />
            <Route path="/ai-projects" element={<AIProjectsPage />} />
            <Route path="/data-service" element={<DataServicePage />} />
            <Route path="/horizontal-llm-data" element={<HorizontalLLMDataPage />} />
            <Route path="/vertical-llm-data" element={<VerticalLLMDataPage />} />
            <Route path="/aigc" element={<AIGCPage />} />
            <Route path="/about" element={<AboutPage />} />
            <Route path="/offices" element={<OfficesPage />} />
            <Route path="/phil-impact" element={<PhilImpactPage />} />
            <Route path="/careers" element={<CareersPage />} />
            <Route path="/contact-us" element={<ContactUsPage />} />
            <Route path="/internal-news" element={<InternalNewsPage />} />
            <Route path="/get-started" element={<GetStartedPage authMode={authMode} onAuthModeChange={setAuthMode} />} />
            <Route path="/sign-in" element={<GetStartedPage authMode="signin" onAuthModeChange={setAuthMode} />} />
            <Route path="/dashboard" element={<DashboardPage />} />
            <Route path="/privacy-policy" element={<PrivacyPolicyPage />} />
            <Route path="/cookie-policy" element={<CookiePolicyPage />} />
            <Route path="/terms-conditions" element={<TermsConditionsPage />} />
            <Route path="*" element={<Hero onNavigate={navigateTo} />} />  {/* Default route */}
          </Routes>
        </AnimatePresence>
        <Footer />
        <Chatbot />
      </div>
    </Router>
  );
}

export default App;