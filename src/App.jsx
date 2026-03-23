import { useState, useEffect } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import { Navigation, Footer } from "./layout";
import { useNavigate, useLocation } from "react-router-dom";
import NotFound from "./pages/NotFound";
import PageLayout from "./layout/PageLayout";
import { getSectionTheme } from "./utils/sectionTheme";

import {
  GetStartedPage,
  AdminLoginPage,
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
  JobDetailPage,
  ContactUsPage,
  InternalNewsPage,
  PrivacyPolicyPage,
  CookiePolicyPage,
  TermsConditionsPage,
  PreScreeningPage,
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

const allowedAdminRoles = new Set([
  "super_admin",
  "hr_admin",
  "sales_client_manager",
]);

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
  const sectionTheme = getSectionTheme(location.pathname);
  const [authMode, setAuthMode] = useState("signup");
  const navigate = useNavigate();
  const hideChrome =
    (location.pathname.startsWith("/careers/") &&
      location.pathname !== "/careers") ||
    location.pathname === "/admin-login" ||
    location.pathname === "/sign-in" ||
    location.pathname === "/dashboard" ||
    location.pathname === "/pre-screening";

  const navigateTo = (path) => {
    navigate(path);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  useEffect(() => {
    if (location.pathname !== "/dashboard") return;
    const role =
      localStorage.getItem("lwAuthRole") ||
      sessionStorage.getItem("lwAuthRole");
    const token =
      localStorage.getItem("lwAuthToken") ||
      sessionStorage.getItem("lwAuthToken");
    if (!token || !allowedAdminRoles.has(role)) {
      navigate("/admin-login");
    }
  }, [location.pathname, navigate]);

  return (
    <div className={`app section-theme section-${sectionTheme}`}>
      {!hideChrome && <Navigation onSetAuthMode={setAuthMode} />}

      <Routes>
        {" "}
        <Route
          path="/"
          element={
            <PageLayout>
              <Hero onNavigate={navigateTo} />
              <TrustedBy />
              <About onNavigate={navigateTo} />
              <ImpactStats />
              <ESG />
              <CTA onNavigate={navigateTo} />
            </PageLayout>
          }
        />
        <Route path="/ai-services" element={<AIServicesPage />} />
        <Route path="/ai-projects" element={<AIProjectsPage />} />
        <Route
          path="/data-service"
          element={<DataServicePage onNavigate={navigateTo} />}
        />
        <Route
          path="/horizontal-llm-data"
          element={<HorizontalLLMDataPage onNavigate={navigateTo} />}
        />
        <Route
          path="/vertical-llm-data"
          element={<VerticalLLMDataPage onNavigate={navigateTo} />}
        />
        <Route path="/aigc" element={<AIGCPage onNavigate={navigateTo} />} />
        <Route path="/about" element={<AboutPage />} />
        <Route path="/offices" element={<OfficesPage />} />
        <Route path="/phil-impact" element={<PhilImpactPage />} />
        <Route path="/careers" element={<CareersPage />} />
        <Route path="/careers/:slug" element={<JobDetailPage />} />
        <Route path="/pre-screening" element={<PreScreeningPage />} />
        <Route
          path="/contact-us"
          element={<ContactUsPage onNavigate={navigateTo} />}
        />
        <Route path="/internal-news" element={<InternalNewsPage />} />
        <Route
          path="/get-started"
          element={
            <GetStartedPage
              authMode={authMode}
              onAuthModeChange={setAuthMode}
              onNavigate={navigateTo}
            />
          }
        />
        <Route
          path="/sign-in"
          element={
            <AdminLoginPage onNavigate={navigateTo} />
          }
        />
        <Route path="/admin-login" element={<AdminLoginPage onNavigate={navigateTo} />} />
        <Route path="/dashboard" element={<DashboardPage onNavigate={navigateTo} />} />
        <Route path="/privacy-policy" element={<PrivacyPolicyPage />} />
        <Route path="/cookie-policy" element={<CookiePolicyPage />} />
        <Route path="/terms-conditions" element={<TermsConditionsPage />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
      {!hideChrome && <Footer />}
      {!hideChrome && <Chatbot />}
    </div>
  );
}
