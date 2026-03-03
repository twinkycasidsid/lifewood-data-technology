import { useState, useEffect } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import { Navigation, Footer } from "./layout";
import { useNavigate, useLocation } from "react-router-dom";
import NotFound from "./pages/NotFound";
import PageLayout from "./layout/PageLayout";

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
import {
  Hero,
  About,
  ImpactStats,
  ESG,
  CTA,
} from "./components/sections";
import TrustedBy from "./components/sections/TrustedBy";
import Chatbot from "./components/Chatbot";

function App() {
  return (
    <Router>
      <AppContent />
    </Router>
  );
}

export default App;
function AppContent() {
  const PageWrapper = ({ children }) => (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.25 }}
      style={{ minHeight: "100vh" }}
    >
      {children}
    </motion.div>
  );
  const location = useLocation();
  const [authMode, setAuthMode] = useState("signup");
  const navigate = useNavigate();

  const navigateTo = (path) => {
    navigate(path);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <div className="app">
      <Navigation onSetAuthMode={setAuthMode} />

      <Routes>
        {" "}
        <Route
          path="/"
          element={
            <PageLayout>
              <Hero />
              <About />
              <ImpactStats />
              <ESG />
              <CTA />
            </PageLayout>
          }
        />
        <Route path="/ai-services" element={<AIServicesPage />} />
        <Route path="/ai-projects" element={<AIProjectsPage />} />
        <Route path="/data-service" element={<DataServicePage />} />
        <Route
          path="/horizontal-llm-data"
          element={<HorizontalLLMDataPage />}
        />
        <Route path="/vertical-llm-data" element={<VerticalLLMDataPage />} />
        <Route path="/aigc" element={<AIGCPage />} />
        <Route path="/about" element={<AboutPage />} />
        <Route path="/offices" element={<OfficesPage />} />
        <Route path="/phil-impact" element={<PhilImpactPage />} />
        <Route path="/careers" element={<CareersPage />} />
        <Route path="/contact-us" element={<ContactUsPage />} />
        <Route path="/internal-news" element={<InternalNewsPage />} />
        <Route
          path="/get-started"
          element={
            <GetStartedPage
              authMode={authMode}
              onAuthModeChange={setAuthMode}
            />
          }
        />
        <Route
          path="/sign-in"
          element={
            <GetStartedPage authMode="signin" onAuthModeChange={setAuthMode} />
          }
        />
        <Route path="/dashboard" element={<DashboardPage />} />
        <Route path="/privacy-policy" element={<PrivacyPolicyPage />} />
        <Route path="/cookie-policy" element={<CookiePolicyPage />} />
        <Route path="/terms-conditions" element={<TermsConditionsPage />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
      <Footer />
      <Chatbot />
    </div>
  );
}
