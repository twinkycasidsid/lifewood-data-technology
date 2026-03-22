import { useMemo, useState, useEffect } from "react";
import {
  ArrowLeft,
  CalendarDays,
  CheckCircle,
  MessageCircle,
  Send,
} from "lucide-react";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL?.replace(/\/$/, "") || "";

const partners = [
  { name: "Ancestry", logo: "/partners/ancestry-1.png" },
  { name: "Apple", logo: "/partners/apple-1.png" },
  { name: "BYU Pathway", logo: "/partners/byu-1.png" },
  { name: "FamilySearch", logo: "/partners/familysearch-1.png" },
  { name: "Google", logo: "/partners/google-1.png" },
  { name: "Microsoft", logo: "/partners/microsoft-1.png" },
  { name: "Moore Foundation", logo: "/partners/moore-1.png" },
];

const stepLabels = [
  {
    title: "Step 1",
    subtitle: "Company Info",
  },
  {
    title: "Step 2",
    subtitle: "Project Overview",
  },
  {
    title: "Step 3",
    subtitle: "Schedule Demo",
  },
];

const StepIndicator = ({ step }) => {
  return (
    <div className="bd-step-indicator">
      <div className="bd-step-row">
        {stepLabels.map((label, index) => {
          const isActive = step === index + 1;
          const isComplete = step > index + 1;
          return (
            <div key={label.title} className="bd-step-item">
              <span
                className={`bd-step-title ${
                  isActive || isComplete ? "active" : ""
                }`}
              >
                {label.title}
              </span>
              {index < stepLabels.length - 1 && (
                <span className="bd-step-sep">-&gt;</span>
              )}
            </div>
          );
        })}
      </div>
      <div className="bd-step-row bd-step-sub">
        {stepLabels.map((label, index) => {
          const isActive = step === index + 1;
          const isComplete = step > index + 1;
          return (
            <div key={label.subtitle} className="bd-step-item">
              <span
                className={`bd-step-subtitle ${
                  isActive || isComplete ? "active" : ""
                }`}
              >
                {label.subtitle}
              </span>
              {index < stepLabels.length - 1 && (
                <span className="bd-step-subsep">|</span>
              )}
            </div>
          );
        })}
      </div>
      <div className="bd-progress">
        <div
          className="bd-progress-fill"
          style={{ width: `${(step / stepLabels.length) * 100}%` }}
        />
      </div>
    </div>
  );
};

const DemoStep1 = ({ formData, setField, fieldErrors }) => {
  return (
    <div className="bd-grid">
      <div className="bd-field">
        <label className="bd-label">Full Name</label>
        <input
          className={`bd-input ${fieldErrors.fullName ? "error" : ""}`}
          type="text"
          value={formData.fullName}
          onChange={(event) => setField("fullName", event.target.value)}
          placeholder="Avery Chen"
          required
        />
        {fieldErrors.fullName && (
          <span className="bd-field-error">{fieldErrors.fullName}</span>
        )}
      </div>
      <div className="bd-field">
        <label className="bd-label">Work Email</label>
        <input
          className={`bd-input ${fieldErrors.workEmail ? "error" : ""}`}
          type="email"
          value={formData.workEmail}
          onChange={(event) => setField("workEmail", event.target.value)}
          placeholder="name@company.com"
          required
        />
        {fieldErrors.workEmail && (
          <span className="bd-field-error">{fieldErrors.workEmail}</span>
        )}
      </div>
      <div className="bd-field">
        <label className="bd-label">Company Name</label>
        <input
          className={`bd-input ${fieldErrors.companyName ? "error" : ""}`}
          type="text"
          value={formData.companyName}
          onChange={(event) => setField("companyName", event.target.value)}
          placeholder="Lifewood"
          required
        />
        {fieldErrors.companyName && (
          <span className="bd-field-error">{fieldErrors.companyName}</span>
        )}
      </div>
      <div className="bd-field">
        <label className="bd-label">Company Website</label>
        <input
          className={`bd-input ${fieldErrors.companyWebsite ? "error" : ""}`}
          type="url"
          value={formData.companyWebsite}
          onChange={(event) => setField("companyWebsite", event.target.value)}
          placeholder="https://www.lifewood.com"
          required
        />
        {fieldErrors.companyWebsite && (
          <span className="bd-field-error">{fieldErrors.companyWebsite}</span>
        )}
      </div>
      <div className="bd-field">
        <label className="bd-label">Industry</label>
        <select
          className={`bd-input ${fieldErrors.industry ? "error" : ""}`}
          value={formData.industry}
          onChange={(event) => setField("industry", event.target.value)}
          required
        >
          <option value="">Select an industry</option>
          <option value="AI / ML">AI / ML</option>
          <option value="Healthcare">Healthcare</option>
          <option value="Finance">Finance</option>
          <option value="E-commerce">E-commerce</option>
          <option value="Retail">Retail</option>
          <option value="Other">Other</option>
        </select>
        {fieldErrors.industry && (
          <span className="bd-field-error">{fieldErrors.industry}</span>
        )}
      </div>
      <div className="bd-field">
        <label className="bd-label">Company Size</label>
        <select
          className={`bd-input ${fieldErrors.companySize ? "error" : ""}`}
          value={formData.companySize}
          onChange={(event) => setField("companySize", event.target.value)}
          required
        >
          <option value="">Select company size</option>
          <option value="1-10">1-10</option>
          <option value="11-50">11-50</option>
          <option value="51-200">51-200</option>
          <option value="200+">200+</option>
        </select>
        {fieldErrors.companySize && (
          <span className="bd-field-error">{fieldErrors.companySize}</span>
        )}
      </div>
    </div>
  );
};

const DemoStep2 = ({ formData, setField, fieldErrors }) => {
  return (
    <div className="bd-grid">
      <div className="bd-field">
        <label className="bd-label">Project Type</label>
        <select
          className={`bd-input ${fieldErrors.projectType ? "error" : ""}`}
          value={formData.projectType}
          onChange={(event) => setField("projectType", event.target.value)}
          required
        >
          <option value="">Select project type</option>
          <option value="Data Annotation">Data Annotation</option>
          <option value="Data Collection">Data Collection</option>
          <option value="Data Validation">Data Validation</option>
          <option value="AI Model Training">AI Model Training</option>
          <option value="Custom AI Project">Custom AI Project</option>
        </select>
        {fieldErrors.projectType && (
          <span className="bd-field-error">{fieldErrors.projectType}</span>
        )}
      </div>
      <div className="bd-field">
        <label className="bd-label">Data Type</label>
        <select
          className={`bd-input ${fieldErrors.dataType ? "error" : ""}`}
          value={formData.dataType}
          onChange={(event) => setField("dataType", event.target.value)}
          required
        >
          <option value="">Select data type</option>
          <option value="Image">Image</option>
          <option value="Text">Text</option>
          <option value="Audio">Audio</option>
          <option value="Video">Video</option>
          <option value="Multimodal">Multimodal</option>
        </select>
        {fieldErrors.dataType && (
          <span className="bd-field-error">{fieldErrors.dataType}</span>
        )}
      </div>
      <div className="bd-field">
        <label className="bd-label">Estimated Dataset Size</label>
        <input
          className={`bd-input ${fieldErrors.datasetSize ? "error" : ""}`}
          type="text"
          value={formData.datasetSize}
          onChange={(event) => setField("datasetSize", event.target.value)}
          placeholder="e.g. 1M+ samples"
          required
        />
        {fieldErrors.datasetSize && (
          <span className="bd-field-error">{fieldErrors.datasetSize}</span>
        )}
      </div>
      <div className="bd-field">
        <label className="bd-label">Timeline</label>
        <select
          className={`bd-input ${fieldErrors.timeline ? "error" : ""}`}
          value={formData.timeline}
          onChange={(event) => setField("timeline", event.target.value)}
          required
        >
          <option value="">Select timeline</option>
          <option value="ASAP">ASAP</option>
          <option value="1-3 months">1-3 months</option>
          <option value="3-6 months">3-6 months</option>
          <option value="6+ months">6+ months</option>
        </select>
        {fieldErrors.timeline && (
          <span className="bd-field-error">{fieldErrors.timeline}</span>
        )}
      </div>
      <div className="bd-field full">
        <label className="bd-label">Project Description</label>
        <textarea
          className={`bd-textarea ${fieldErrors.projectDescription ? "error" : ""}`}
          value={formData.projectDescription}
          onChange={(event) => setField("projectDescription", event.target.value)}
          placeholder="Tell us about your goals, current workflow, and success criteria."
          required
        />
        {fieldErrors.projectDescription && (
          <span className="bd-field-error">{fieldErrors.projectDescription}</span>
        )}
      </div>
    </div>
  );
};

const DemoStep3 = () => {
  return (
    <div className="bd-step3">
      <div className="bd-step3-head">
        <h2>Choose a time for your demo</h2>
        <p>
          Select a time that works for your team. We will review your project details before the call.
        </p>
      </div>
      <div className="bd-calendly">
        <div className="bd-calendly-toolbar">
          <span>Demo Calendar</span>
          <small>30 mins · Live walkthrough</small>
        </div>
        <iframe
          title="Calendly Demo Booking"
          src="https://calendly.com/twinkycasidsidx/30min"
          className="bd-calendly-frame"
        />
      </div>
    </div>
  );
};

const modeOptions = [
  {
    id: "demo",
    icon: CalendarDays,
    title: "Continue with Book a Demo",
    description:
      "Talk to our team and explore how Lifewood can support your AI data pipeline.",
  },
  {
    id: "contact",
    icon: MessageCircle,
    title: "Not ready to book a demo?",
    description:
      "Send us an inquiry instead and we’ll get back to you within 24 hours.",
  },
];

const ContactUs = () => {
  const [mode, setMode] = useState(null);
  const [step, setStep] = useState(1);
  const [submitted, setSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState("");
  const [fieldErrors, setFieldErrors] = useState({});
  const [lastSubmitAt, setLastSubmitAt] = useState(0);
  const [contactSubmitted, setContactSubmitted] = useState(false);
  const [contactErrors, setContactErrors] = useState({});
  const [contactSubmitError, setContactSubmitError] = useState("");
  const [contactIsSubmitting, setContactIsSubmitting] = useState(false);
  const [contactForm, setContactForm] = useState({
    fullName: "",
    email: "",
    inquiryType: "",
    message: "",
  });
  const [formData, setFormData] = useState({
    fullName: "",
    workEmail: "",
    companyName: "",
    companyWebsite: "",
    industry: "",
    companySize: "",
    projectType: "",
    dataType: "",
    datasetSize: "",
    timeline: "",
    projectDescription: "",
    trapField: "",
  });

  const allowedIndustries = [
    "AI / ML",
    "Healthcare",
    "Finance",
    "E-commerce",
    "Retail",
    "Other",
  ];
  const allowedCompanySizes = ["1-10", "11-50", "51-200", "200+"];
  const allowedProjectTypes = [
    "Data Annotation",
    "Data Collection",
    "Data Validation",
    "AI Model Training",
    "Custom AI Project",
  ];
  const allowedDataTypes = ["Image", "Text", "Audio", "Video", "Multimodal"];
  const allowedTimelines = ["ASAP", "1-3 months", "3-6 months", "6+ months"];
  const allowedInquiryTypes = [
    "General Inquiry",
    "Partnership",
    "Support",
    "Sales Question",
  ];

  const sanitizeText = (value) => {
    if (!value) return "";
    const cleaned = String(value)
      .replace(/<script.*?>.*?<\/script>/gi, "")
      .replace(/javascript:/gi, "")
      .replace(/onerror=|onload=/gi, "")
      .replace(/[<>]/g, "");
    return cleaned.trim();
  };

  const normalizeName = (value) =>
    sanitizeText(value).replace(/[^a-zA-Z\s]/g, "").replace(/\s+/g, " ").trim();

  const normalizeCompany = (value) => sanitizeText(value).slice(0, 120);

  const normalizeDataset = (value) =>
    sanitizeText(value).replace(/[^a-zA-Z0-9+.\s]/g, "").slice(0, 50).trim();

  const normalizeDescription = (value) => sanitizeText(value).slice(0, 1000);

  const normalizeEmail = (value) => sanitizeText(value).toLowerCase().slice(0, 254);

  const normalizeUrl = (value) => {
    const raw = sanitizeText(value);
    if (!raw) return "";
    if (!/^https?:\/\//i.test(raw)) return `https://${raw}`;
    return raw;
  };

  const isValidEmail = (email) =>
    /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) &&
    !/[<>"'`]/.test(email) &&
    !/javascript:|onerror=|onload=|<script/gi.test(email);

  const isValidUrl = (value) => {
    if (!value) return false;
    try {
      const url = new URL(value);
      return ["http:", "https:"].includes(url.protocol);
    } catch {
      return false;
    }
  };

  const validateStep1 = (data) => {
    const errors = {};
    const fullName = normalizeName(data.fullName);
    if (!fullName || fullName.length < 2 || fullName.length > 80) {
      errors.fullName = "Enter a valid full name (2-80 letters).";
    }
    const email = normalizeEmail(data.workEmail);
    if (!email || !isValidEmail(email)) {
      errors.workEmail = "Enter a valid work email.";
    }
    const company = normalizeCompany(data.companyName);
    if (!company || company.length < 2) {
      errors.companyName = "Enter a valid company name (2-120 chars).";
    }
    const website = normalizeUrl(data.companyWebsite);
    if (!isValidUrl(website)) {
      errors.companyWebsite = "Enter a valid company website URL.";
    }
    if (!allowedIndustries.includes(data.industry)) {
      errors.industry = "Select a valid industry.";
    }
    if (!allowedCompanySizes.includes(data.companySize)) {
      errors.companySize = "Select a valid company size.";
    }
    return errors;
  };

  const validateStep2 = (data) => {
    const errors = {};
    if (!allowedProjectTypes.includes(data.projectType)) {
      errors.projectType = "Select a valid project type.";
    }
    if (!allowedDataTypes.includes(data.dataType)) {
      errors.dataType = "Select a valid data type.";
    }
    const dataset = normalizeDataset(data.datasetSize);
    if (!dataset) {
      errors.datasetSize = "Enter an estimated dataset size.";
    }
    if (!allowedTimelines.includes(data.timeline)) {
      errors.timeline = "Select a valid timeline.";
    }
    const desc = normalizeDescription(data.projectDescription);
    if (!desc || desc.length < 20) {
      errors.projectDescription = "Provide at least 20 characters.";
    }
    return errors;
  };

  const setField = (name, value) => {
    setFormData((prev) => {
      const next = { ...prev };
      if (name === "fullName") next.fullName = normalizeName(value);
      else if (name === "workEmail") next.workEmail = normalizeEmail(value);
      else if (name === "companyName") next.companyName = normalizeCompany(value);
      else if (name === "companyWebsite") next.companyWebsite = normalizeUrl(value);
      else if (name === "datasetSize") next.datasetSize = normalizeDataset(value);
      else if (name === "projectDescription") next.projectDescription = normalizeDescription(value);
      else if (name === "trapField") next.trapField = value;
      else next[name] = sanitizeText(value);
      return next;
    });
  };

  const setModeWithUrl = (nextMode) => {
    setMode(nextMode);
    const nextUrl = nextMode ? `/contact-us?mode=${nextMode}` : "/contact-us";
    window.history.replaceState({}, "", nextUrl);
  };

  const validateContactForm = (data) => {
    const errors = {};
    const fullName = normalizeName(data.fullName);
    if (!fullName || fullName.length < 2 || fullName.length > 80) {
      errors.fullName = "Enter a valid full name (2-80 letters).";
    }
    const email = normalizeEmail(data.email);
    if (!email || !isValidEmail(email)) {
      errors.email = "Enter a valid email address.";
    }
    if (!allowedInquiryTypes.includes(data.inquiryType)) {
      errors.inquiryType = "Select a valid inquiry type.";
    }
    const message = normalizeDescription(data.message);
    if (!message || message.length < 20) {
      errors.message = "Provide at least 20 characters.";
    }
    return errors;
  };

  const setContactField = (name, value) => {
    setContactForm((prev) => {
      const next = { ...prev };
      if (name === "fullName") next.fullName = normalizeName(value);
      else if (name === "email") next.email = normalizeEmail(value);
      else if (name === "message") next.message = normalizeDescription(value);
      else next[name] = sanitizeText(value);
      return next;
    });
  };

  const stepValidity = useMemo(() => {
    const hasEmail = formData.workEmail.includes("@");
    return {
      1:
        formData.fullName.trim() &&
        hasEmail &&
        formData.companyName.trim() &&
        formData.companyWebsite.trim() &&
        formData.industry &&
        formData.companySize,
      2:
        formData.projectType &&
        formData.dataType &&
        formData.datasetSize.trim() &&
        formData.timeline &&
        formData.projectDescription.trim(),
      3: true,
    };
  }, [formData]);

  const canAdvance = stepValidity[step];

  const handleNext = () => {
    const errors = step === 1 ? validateStep1(formData) : validateStep2(formData);
    setFieldErrors(errors);
    if (Object.keys(errors).length > 0) return;
    setStep((prev) => Math.min(prev + 1, 3));
  };

  const handleBack = () => {
    setStep((prev) => Math.max(prev - 1, 1));
  };

  useEffect(() => {
    setFieldErrors({});
  }, [step]);

  const handleConfirm = async () => {
    if (isSubmitting) return;
    const now = Date.now();
    if (now - lastSubmitAt < 8000) {
      setSubmitError("Please wait a moment before submitting again.");
      return;
    }
    if (formData.trapField) {
      setSubmitError("Submission blocked.");
      return;
    }
    const errors = { ...validateStep1(formData), ...validateStep2(formData) };
    setFieldErrors(errors);
    if (Object.keys(errors).length > 0) return;
    setSubmitError("");
    setIsSubmitting(true);
    setLastSubmitAt(now);
    try {
      const response = await fetch(`${API_BASE_URL}/api/contact-submissions`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          fullName: normalizeName(formData.fullName),
          workEmail: normalizeEmail(formData.workEmail),
          companyName: normalizeCompany(formData.companyName),
          companyWebsite: normalizeUrl(formData.companyWebsite),
          industry: formData.industry,
          companySize: formData.companySize,
          projectType: formData.projectType,
          dataType: formData.dataType,
          datasetSize: normalizeDataset(formData.datasetSize),
          timeline: formData.timeline,
          projectDescription: normalizeDescription(formData.projectDescription),
        }),
      });

      const result = await response.json().catch(() => ({}));
      if (!response.ok) {
        setSubmitError(result?.error || "Something went wrong. Please try again.");
        setIsSubmitting(false);
        return;
      }
    } catch (_error) {
      setSubmitError("Something went wrong. Please try again.");
      setIsSubmitting(false);
      return;
    }
    setSubmitted(true);
    setIsSubmitting(false);
  };

  const handleContactSubmit = async (event) => {
    event.preventDefault();
    if (contactIsSubmitting) return;
    const errors = validateContactForm(contactForm);
    setContactErrors(errors);
    if (Object.keys(errors).length > 0) return;
    setContactSubmitError("");
    setContactIsSubmitting(true);
    try {
      const response = await fetch(`${API_BASE_URL}/api/inquiries`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          fullName: normalizeName(contactForm.fullName),
          email: normalizeEmail(contactForm.email),
          inquiryType: contactForm.inquiryType,
          message: normalizeDescription(contactForm.message),
        }),
      });

      const result = await response.json().catch(() => ({}));
      if (!response.ok) {
        setContactSubmitError(result?.error || "Something went wrong. Please try again.");
        setContactIsSubmitting(false);
        return;
      }

      setContactSubmitted(true);
      setContactIsSubmitting(false);
    } catch (_error) {
      setContactSubmitError("Something went wrong. Please try again.");
      setContactIsSubmitting(false);
    }
  };

  return (
    <main className={`bd-root${!mode ? " bd-root-compact" : ""}`}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Manrope:wght@400;500;600;700&display=swap');

        .bd-root {
          min-height: 100vh;
          background: radial-gradient(circle at top, rgba(244, 163, 0, 0.08), transparent 55%),
            #f4f6f4;
          color: #122620;
          font-family: 'Manrope', sans-serif;
          padding-top: 72px;
          padding-bottom: 48px;
        }

        .bd-root.bd-root-compact {
          min-height: calc(100vh - 72px);
          display: flex;
          align-items: center;
          padding-top: 48px;
          padding-bottom: 48px;
        }

        .bd-shell {
          max-width: 1180px;
          margin: 0 auto;
          padding: 32px 24px 40px;
        }

        .bd-mode-shell {
          max-width: 1180px;
          width: 100%;
          margin: 0 auto;
          padding: 0 24px;
        }

        .bd-mode-header {
          display: grid;
          gap: 10px;
          justify-items: start;
          text-align: left;
        }

        .bd-mode-header h1 {
          margin: 0;
          font-size: clamp(2rem, 4vw, 3.4rem);
          line-height: 0.95;
          letter-spacing: -0.03em;
          color: #f5faf8;
        }

        .bd-mode-header p {
          margin: 0;
          max-width: 46ch;
          font-size: 15px;
          line-height: 1.6;
          color: rgba(244, 250, 247, 0.82);
        }

        .bd-choice-stack {
          display: grid;
          gap: 14px;
        }

        .bd-choice-layout {
          align-items: start;
        }

        .bd-choice-layout .bd-panel,
        .bd-choice-layout .bd-form-card {
          min-height: auto;
        }

        .bd-choice-card {
          width: 100%;
          border: 1px solid rgba(18, 38, 32, 0.08);
          border-radius: 24px;
          padding: 0;
          background:
            linear-gradient(90deg, rgba(255, 179, 71, 0.16) 0, rgba(255, 179, 71, 0.16) 10px, transparent 10px),
            linear-gradient(145deg, rgba(255, 255, 255, 0.96) 0%, rgba(246, 249, 247, 0.92) 100%);
          cursor: pointer;
          transition: transform 0.25s ease, box-shadow 0.25s ease, border-color 0.25s ease;
          box-shadow: 0 16px 34px rgba(12, 29, 20, 0.08);
          text-align: left;
          overflow: hidden;
        }

        .bd-choice-card:hover,
        .bd-choice-card:focus-visible {
          transform: translateY(-3px);
          border-color: rgba(255, 179, 71, 0.45);
          box-shadow: 0 24px 44px rgba(12, 29, 20, 0.14);
          outline: none;
        }

        .bd-choice-card-head {
          display: flex;
          align-items: flex-start;
          gap: 16px;
          padding: 18px 20px 18px 24px;
        }

        .bd-mode-icon {
          width: 46px;
          height: 46px;
          border-radius: 14px;
          display: inline-flex;
          align-items: center;
          justify-content: center;
          background: linear-gradient(145deg, rgba(28, 61, 43, 0.1), rgba(28, 61, 43, 0.18));
          color: #1c3d2b;
          flex-shrink: 0;
          box-shadow: inset 0 1px 0 rgba(255, 255, 255, 0.65);
        }

        .bd-mode-icon svg {
          width: 24px;
          height: 24px;
        }

        .bd-choice-copy {
          display: grid;
          gap: 6px;
          width: 100%;
        }

        .bd-choice-card h2 {
          margin: 0;
          font-size: 1.125rem;
          font-weight: 600;
          color: #122620;
        }

        .bd-choice-card p {
          margin: 0;
          font-size: 0.95rem;
          line-height: 1.6;
          color: rgba(18, 38, 32, 0.72);
        }

        .bd-choice-link {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          margin-top: 8px;
          font-size: 13px;
          font-weight: 700;
          color: #1c3d2b;
          text-transform: uppercase;
          letter-spacing: 0.06em;
        }

        .bd-choice-meta {
          display: inline-flex;
          align-items: center;
          width: fit-content;
          border-radius: 999px;
          padding: 5px 10px;
          font-size: 11px;
          font-weight: 700;
          letter-spacing: 0.08em;
          text-transform: uppercase;
          background: rgba(28, 61, 43, 0.08);
          color: rgba(28, 61, 43, 0.74);
        }

        .bd-topbar {
          display: flex;
          align-items: center;
          justify-content: flex-start;
          margin-bottom: 14px;
        }

        .bd-back-link {
          border: 0;
          background: transparent;
          color: rgba(244, 250, 247, 0.86);
          display: inline-flex;
          align-items: center;
          gap: 8px;
          cursor: pointer;
          font-size: 14px;
          font-weight: 600;
          padding: 0;
        }

        .bd-back-link svg {
          width: 16px;
          height: 16px;
        }

        .bd-layout {
          display: grid;
          grid-template-columns: minmax(0, 1fr) minmax(0, 1fr);
          gap: 20px;
          align-items: stretch;
          animation: bdFadeIn 0.7s ease both;
        }

        .bd-panel {
          position: relative;
          border-radius: 28px;
          padding: 28px;
          background: linear-gradient(145deg, #0f2519 0%, #1c3d2b 48%, #0d1e15 100%);
          color: #ffffff;
          overflow: hidden;
          box-shadow: 0 24px 60px rgba(12, 29, 20, 0.35);
          align-self: stretch;
          min-height: 100%;
        }

        .bd-panel::after {
          content: "";
          position: absolute;
          inset: 0;
          background: radial-gradient(circle at 15% 15%, rgba(244, 163, 0, 0.25), transparent 40%),
            radial-gradient(circle at 85% 20%, rgba(255, 255, 255, 0.12), transparent 45%);
          pointer-events: none;
        }

        .bd-glow {
          position: absolute;
          border-radius: 999px;
          filter: blur(0px);
          opacity: 0.65;
          animation: bdFloat 8s ease-in-out infinite;
          mix-blend-mode: screen;
        }

        .bd-glow.one {
          width: 180px;
          height: 180px;
          background: rgba(244, 163, 0, 0.2);
          top: 24px;
          left: 24px;
        }

        .bd-glow.two {
          width: 220px;
          height: 220px;
          background: rgba(255, 255, 255, 0.12);
          bottom: -40px;
          right: 40px;
          animation-delay: -2s;
        }

        .bd-panel-content {
          position: relative;
          display: grid;
          gap: 20px;
          z-index: 1;
          width: 100%;
          align-items: stretch;
          justify-items: stretch;
        }

        .bd-panel h1 {
          font-size: clamp(1.35rem, 2.15vw, 1.95rem);
          line-height: 1.1;
          font-weight: 600;
          letter-spacing: -0.015em;
          white-space: nowrap;
          max-width: 100%;
        }

        .bd-panel p {
          font-size: 15px;
          color: rgba(255, 255, 255, 0.78);
          max-width: 480px;
        }

        .bd-feature-list {
          display: grid;
          gap: 10px;
          margin-top: 8px;
          width: 100%;
          align-items: stretch;
          justify-items: stretch;
          max-width: 100%;
        }

        .bd-feature {
          display: flex;
          gap: 14px;
          align-items: flex-start;
          padding: 12px 16px;
          border-radius: 18px;
          background: rgba(255, 255, 255, 0.07);
          border: 1px solid rgba(255, 255, 255, 0.12);
          backdrop-filter: blur(8px);
          animation: bdFeatureIn 0.6s ease both;
          opacity: 1;
          box-sizing: border-box;
          width: 100%;
          min-width: 0;
          transition:
            transform 0.35s cubic-bezier(0.22, 1, 0.36, 1),
            box-shadow 0.35s cubic-bezier(0.22, 1, 0.36, 1),
            border-color 0.35s ease,
            background 0.35s ease;
        }

        .bd-feature:hover {
          transform: translateY(-2px) scale(1.01);
          box-shadow: 0 16px 28px rgba(8, 20, 14, 0.35);
          border-color: rgba(244, 163, 0, 0.35);
          background: rgba(255, 255, 255, 0.1);
        }

        .bd-feature > div {
          min-width: 0;
        }

        .bd-feature-icon {
          width: 26px;
          height: 26px;
          color: #f4a300;
          flex-shrink: 0;
          margin-top: 2px;
        }

        .bd-feature h3,
        .bd-feature span {
          word-break: break-word;
        }

        .bd-feature:nth-child(2) {
          animation-delay: 0.12s;
        }

        .bd-feature:nth-child(3) {
          animation-delay: 0.24s;
        }

        .bd-feature:nth-child(4) {
          animation-delay: 0.36s;
        }

        .bd-feature h3 {
          margin: 0;
          font-size: 14px;
          font-weight: 600;
          color: #ffffff;
        }

        .bd-feature span {
          display: block;
          font-size: 12px;
          color: rgba(255, 255, 255, 0.68);
          margin-top: 4px;
        }

        .bd-trust {
          margin-top: 6px;
          display: grid;
          gap: 12px;
          font-size: 13px;
          color: rgba(255, 255, 255, 0.7);
        }

        .bd-marquee {
          overflow: hidden;
          position: relative;
          -webkit-mask-image: linear-gradient(
            to right,
            transparent 0%,
            black 8%,
            black 92%,
            transparent 100%
          );
          mask-image: linear-gradient(
            to right,
            transparent 0%,
            black 8%,
            black 92%,
            transparent 100%
          );
        }

        .bd-marquee-track {
          display: flex;
          align-items: center;
          white-space: nowrap;
          animation: bdMarquee 14s linear infinite;
          will-change: transform;
          gap: clamp(8px, 2.2vw, 22px);
        }

        .bd-marquee:hover .bd-marquee-track {
          animation-play-state: paused;
        }

        .bd-logo-wrap {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          min-width: clamp(120px, 26vw, 180px);
          cursor: default;
          overflow: visible;
          position: relative;
        }

        .bd-logo-img {
          height: 42px;
          width: auto;
          object-fit: contain;
          filter: grayscale(100%) brightness(2.6);
          opacity: 0.95;
        }

        .bd-form-card {
          background: rgba(255, 255, 255, 0.9);
          border: 1px solid rgba(18, 38, 32, 0.08);
          border-radius: 24px;
          padding: 22px;
          box-shadow: 0 24px 50px rgba(12, 29, 20, 0.12);
          backdrop-filter: blur(14px);
          transition: transform 0.3s ease, box-shadow 0.3s ease;
          align-self: stretch;
          min-height: 100%;
        }

        .bd-form-card:hover {
          transform: translateY(-4px);
          box-shadow: 0 28px 60px rgba(12, 29, 20, 0.16);
        }

        .bd-contact-card {
          width: min(100%, 720px);
          margin: 0 auto;
        }

        .bd-form-header {
          display: grid;
          gap: 8px;
          margin-bottom: 14px;
        }

        .bd-form-header h2 {
          font-size: 22px;
          font-weight: 600;
          color: #122620;
        }

        .bd-form-header p {
          font-size: 13px;
          color: rgba(18, 38, 32, 0.7);
        }

        .bd-flow {
          display: grid;
          gap: 18px;
        }

        .bd-step-content {
          transition: all 0.3s ease;
        }

        .bd-contact-note {
          font-size: 13px;
          color: rgba(18, 38, 32, 0.62);
          line-height: 1.6;
        }

        .bd-contact-success {
          border-radius: 18px;
          border: 1px solid rgba(28, 61, 43, 0.12);
          background: rgba(28, 61, 43, 0.06);
          padding: 16px 18px;
          color: #163020;
          display: grid;
          gap: 6px;
        }

        .bd-contact-success strong {
          font-size: 15px;
        }

        .bd-step-indicator {
          display: grid;
          gap: 10px;
        }

        .bd-step-row {
          display: flex;
          align-items: center;
          justify-content: space-between;
          flex-wrap: wrap;
          gap: 10px;
          font-size: 12px;
          text-transform: uppercase;
          letter-spacing: 0.18em;
          color: rgba(18, 38, 32, 0.6);
          font-weight: 600;
        }

        .bd-step-item {
          display: flex;
          align-items: center;
          gap: 10px;
          flex: 1 1 0;
          min-width: 140px;
        }

        .bd-step-title,
        .bd-step-subtitle {
          transition: all 0.3s ease;
          color: rgba(18, 38, 32, 0.5);
        }

        .bd-step-title.active,
        .bd-step-subtitle.active {
          color: #1c3d2b;
        }

        .bd-step-sep {
          color: rgba(18, 38, 32, 0.35);
          font-weight: 700;
        }

        .bd-step-sub {
          font-size: 13px;
          text-transform: none;
          letter-spacing: 0;
          color: #122620;
        }

        .bd-step-subsep {
          color: rgba(18, 38, 32, 0.25);
        }

        .bd-progress {
          height: 6px;
          border-radius: 999px;
          background: rgba(18, 38, 32, 0.12);
          overflow: hidden;
        }

        .bd-progress-fill {
          height: 100%;
          border-radius: 999px;
          background: #1c3d2b;
          transition: width 0.3s ease;
        }

        .bd-grid {
          display: grid;
          grid-template-columns: repeat(2, minmax(0, 1fr));
          gap: 14px;
        }

        .bd-field {
          display: flex;
          flex-direction: column;
          gap: 8px;
        }

        .bd-field.full {
          grid-column: 1 / -1;
        }

        .bd-label {
          font-size: 12px;
          font-weight: 600;
          color: #122620;
        }

        .bd-input,
        .bd-textarea {
          width: 100%;
          border-radius: 12px;
          border: 1px solid rgba(18, 38, 32, 0.14);
          padding: 10px 12px;
          font-size: 13px;
          font-family: inherit;
          color: #122620;
          background: rgba(255, 255, 255, 0.95);
          transition: border-color 0.3s ease, box-shadow 0.3s ease, transform 0.3s ease;
        }

        .bd-input:focus,
        .bd-textarea:focus {
          outline: none;
          border-color: #f4a300;
          box-shadow: 0 0 0 3px rgba(244, 163, 0, 0.25);
        }

        .bd-textarea {
          min-height: 96px;
          resize: vertical;
        }

        .bd-step3 {
          display: grid;
          gap: 12px;
        }

        .bd-step3-head h2 {
          font-size: 18px;
          font-weight: 600;
          margin-bottom: 6px;
        }

        .bd-step3-head p {
          font-size: 13px;
          color: rgba(18, 38, 32, 0.7);
        }

        .bd-calendly {
          border-radius: 18px;
          border: 1px solid rgba(18, 38, 32, 0.12);
          overflow: hidden;
          background: #fff;
          box-shadow: 0 18px 36px rgba(12, 29, 20, 0.12);
        }

        .bd-calendly-toolbar {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 10px 14px;
          border-bottom: 1px solid rgba(18, 38, 32, 0.08);
          background: linear-gradient(90deg, rgba(244, 163, 0, 0.12), rgba(255, 255, 255, 0));
        }

        .bd-calendly-toolbar span {
          font-size: 12px;
          font-weight: 600;
          color: #1c3d2b;
          letter-spacing: 0.06em;
          text-transform: uppercase;
        }

        .bd-calendly-toolbar small {
          font-size: 12px;
          color: rgba(18, 38, 32, 0.6);
        }

        .bd-calendly-frame {
          width: 100%;
          height: 520px;
          border: none;
        }

        .bd-actions {
          margin-top: 16px;
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 12px;
          flex-wrap: wrap;
        }

        .bd-submit-error {
          font-size: 12px;
          color: #b42318;
        }
        .bd-field-error {
          font-size: 11px;
          color: #b42318;
        }
        .bd-input.error,
        .bd-textarea.error {
          border-color: #f04438;
          box-shadow: 0 0 0 3px rgba(240,68,56,0.12);
        }
        .bd-hp {
          position: absolute;
          left: -9999px;
          width: 1px;
          height: 1px;
          opacity: 0;
          pointer-events: none;
        }

        .bd-btn {
          border-radius: 12px;
          padding: 10px 18px;
          min-height: 48px;
          font-size: 13px;
          font-weight: 500;
          border: 1px solid transparent;
          cursor: pointer;
          display: inline-flex;
          align-items: center;
          justify-content: center;
          gap: 10px;
          line-height: 1;
          white-space: nowrap;
          transition: transform 0.3s ease, box-shadow 0.3s ease, background 0.3s ease;
        }

        .bd-btn svg {
          width: 18px;
          height: 18px;
          flex-shrink: 0;
        }

        .bd-btn.primary {
          background: #1c3d2b;
          color: #ffffff;
          box-shadow: 0 12px 24px rgba(12, 29, 20, 0.2);
        }

        .bd-btn.primary:hover:enabled {
          background: #163020;
          transform: translateY(-2px);
        }

        .bd-btn.primary:disabled {
          opacity: 0.5;
          cursor: not-allowed;
        }

        .bd-btn.secondary {
          background: #ffffff;
          border-color: rgba(18, 38, 32, 0.16);
          color: #122620;
        }

        .bd-btn.secondary:hover:enabled {
          transform: translateY(-2px);
          box-shadow: 0 10px 20px rgba(12, 29, 20, 0.12);
        }

        .bd-btn.secondary:disabled {
          opacity: 0.5;
          cursor: not-allowed;
        }

        .bd-success {
          text-align: center;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          gap: 14px;
          padding: 16px 10px;
          min-height: 100%;
        }

        .bd-success h2 {
          font-size: 22px;
          font-weight: 600;
        }

        .bd-success p {
          color: rgba(18, 38, 32, 0.7);
          font-size: 13px;
          max-width: 360px;
        }

        .bd-success-icon {
          width: 84px;
          height: 84px;
          border-radius: 26px;
          display: grid;
          place-items: center;
          background:
            radial-gradient(circle at 30% 20%, rgba(244, 163, 0, 0.22), transparent 55%),
            linear-gradient(135deg, rgba(28, 61, 43, 0.1), rgba(15, 37, 25, 0.05));
          border: 1px solid rgba(28, 61, 43, 0.18);
          box-shadow:
            inset 0 0 0 1px rgba(255, 255, 255, 0.75),
            0 14px 28px rgba(12, 29, 20, 0.16);
        }

        .bd-success-ring {
          width: 54px;
          height: 54px;
          border-radius: 50%;
          display: grid;
          place-items: center;
          background: #ffffff;
          border: 2px solid rgba(28, 61, 43, 0.12);
          box-shadow: 0 8px 16px rgba(12, 29, 20, 0.12);
        }

        .bd-success .bd-btn {
          width: min(320px, 100%);
        }

        .bd-modal-overlay {
          position: fixed;
          inset: 0;
          background: rgba(10, 20, 14, 0.45);
          display: grid;
          place-items: center;
          padding: 20px;
          z-index: 50;
          animation: bdModalFade 0.2s ease both;
        }

        .bd-modal {
          width: min(520px, 94vw);
          border-radius: 22px;
          background: #ffffff;
          border: 1px solid rgba(18, 38, 32, 0.12);
          box-shadow: 0 28px 60px rgba(12, 29, 20, 0.3);
          padding: 22px 24px 24px;
          display: grid;
          gap: 16px;
          text-align: center;
          position: relative;
          animation: bdModalPop 0.25s ease both;
        }

        .bd-modal-close {
          position: absolute;
          top: 12px;
          right: 12px;
          width: 32px;
          height: 32px;
          border-radius: 50%;
          border: 1px solid rgba(18, 38, 32, 0.12);
          background: rgba(255, 255, 255, 0.9);
          color: #1c3d2b;
          display: grid;
          place-items: center;
          cursor: pointer;
          transition: transform 0.2s ease, box-shadow 0.2s ease;
        }

        .bd-modal-close:hover {
          transform: scale(1.05);
          box-shadow: 0 8px 16px rgba(12, 29, 20, 0.15);
        }

        .bd-modal-header {
          display: grid;
          gap: 8px;
          justify-items: center;
        }

        .bd-modal-title {
          font-size: 20px;
          font-weight: 600;
          color: #122620;
          margin: 0;
        }

        .bd-modal-subtitle {
          font-size: 13px;
          color: rgba(18, 38, 32, 0.7);
          margin: 0;
        }

        .bd-modal-highlight {
          font-size: 14px;
          font-weight: 600;
          color: #1c3d2b;
        }

        .bd-modal-time {
          font-size: 13px;
          color: rgba(18, 38, 32, 0.8);
        }

        .bd-modal-actions {
          display: grid;
          justify-items: center;
          margin-top: 8px;
        }

        @keyframes bdModalFade {
          from { opacity: 0; }
          to { opacity: 1; }
        }

        @keyframes bdModalPop {
          from { opacity: 0; transform: translateY(10px) scale(0.98); }
          to { opacity: 1; transform: translateY(0) scale(1); }
        }

        @keyframes bdFadeIn {
          from {
            opacity: 0;
            transform: translateY(12px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes bdFloat {
          0%,
          100% {
            transform: translateY(0);
          }
          50% {
            transform: translateY(-14px);
          }
        }

        @keyframes bdPulse {
          0%,
          100% {
            opacity: 0.7;
          }
          50% {
            opacity: 1;
          }
        }

        @keyframes bdMarquee {
          0% {
            transform: translateX(0);
          }
          100% {
            transform: translateX(-50%);
          }
        }

        @keyframes bdFeatureIn {
          0% {
            opacity: 0;
            transform: translateY(10px) scale(0.98);
          }
          100% {
            opacity: 1;
            transform: translateY(0) scale(1);
          }
        }

        @media (max-width: 980px) {
          .bd-layout {
            grid-template-columns: 1fr;
          }

          .bd-panel {
            padding: 32px;
          }

          .bd-panel h1 {
            white-space: normal;
          }
        }

        @media (max-width: 720px) {
          .bd-mode-shell,
          .bd-shell {
            padding: 32px 18px 40px;
          }

          .bd-root.bd-root-compact {
            min-height: auto;
            display: block;
            padding-top: 56px;
            padding-bottom: 32px;
          }

          .bd-mode-shell {
            padding: 0 18px;
          }

          .bd-grid {
            grid-template-columns: 1fr;
          }

          .bd-panel,
          .bd-form-card {
            padding: 20px;
          }

          .bd-choice-card {
            padding: 0;
          }

          .bd-choice-card-head {
            padding: 18px 18px 18px 22px;
          }

          .bd-actions {
            flex-direction: column-reverse;
            align-items: stretch;
          }

          .bd-btn {
            width: 100%;
          }
        }
      `}</style>

      {!mode ? (
        <div className="bd-mode-shell">
          <div className="bd-layout bd-choice-layout">
            <section className="bd-panel">
              <span className="bd-glow one" />
              <span className="bd-glow two" />
              <div className="bd-panel-content">
                <div className="bd-mode-header">
                  <span className="contact-chip">Book a Demo</span>
                  <h1>What do you need?</h1>
                  <p>
                    Continue to book a live walkthrough with our team, or send an
                    inquiry first if you are still exploring.
                  </p>
                </div>

                <div className="bd-feature-list">
                  <div className="bd-feature">
                    <CheckCircle className="bd-feature-icon" strokeWidth={2.4} />
                    <div>
                      <h3>Live product walkthrough</h3>
                      <span>See how Lifewood supports AI data pipelines from collection to quality control.</span>
                    </div>
                  </div>
                  <div className="bd-feature">
                    <CheckCircle className="bd-feature-icon" strokeWidth={2.4} />
                    <div>
                      <h3>Flexible first contact</h3>
                      <span>Ask a question first if you are still validating fit, scope, or timing.</span>
                    </div>
                  </div>
                </div>
              </div>
            </section>

            <section className="bd-form-card">
              <div className="bd-form-header">
                <h2>Choose how you want to continue</h2>
                <p>
                  Pick the path that matches your current stage. You can switch later.
                </p>
              </div>

              <div className="bd-choice-stack">
                {modeOptions.map((option) => {
                  const Icon = option.icon;
                  return (
                    <button
                      key={option.id}
                      type="button"
                      className="bd-choice-card"
                      onClick={() => setModeWithUrl(option.id)}
                    >
                      <div className="bd-choice-card-head">
                        <span className="bd-mode-icon">
                          <Icon strokeWidth={2.1} />
                        </span>
                        <div className="bd-choice-copy">
                          <span className="bd-choice-meta">
                            {option.id === "demo" ? "High intent" : "Low friction"}
                          </span>
                          <h2>{option.title}</h2>
                          <p>{option.description}</p>
                          <span className="bd-choice-link">
                            {option.id === "demo" ? "Continue with book a demo" : "Send us an inquiry"}
                          </span>
                        </div>
                      </div>
                    </button>
                  );
                })}
              </div>
            </section>
          </div>
        </div>
      ) : mode === "demo" ? (
        <div className="bd-shell">
          <div className="bd-topbar">
            <button type="button" className="bd-back-link" onClick={() => setModeWithUrl(null)}>
              <ArrowLeft strokeWidth={2.2} />
              <span>Back to options</span>
            </button>
          </div>
          <div className="bd-layout">
            <input
              type="text"
              className="bd-hp"
              name="website"
              tabIndex="-1"
              autoComplete="off"
              value={formData.trapField}
              onChange={(event) => setField("trapField", event.target.value)}
            />
            <section className="bd-panel">
              <span className="bd-glow one" />
              <span className="bd-glow two" />
              <div className="bd-panel-content">
                <h1>AI Data Services That Power Real AI</h1>
                <p>
                  Work with Lifewood Data Technology to build high-quality datasets,
                  scale AI training pipelines, and accelerate production-ready models.
                </p>

                <div className="bd-feature-list">
                  <div className="bd-feature">
                    <CheckCircle className="bd-feature-icon" strokeWidth={2.4} />
                    <div>
                      <h3>Scalable AI Data Pipelines</h3>
                      <span>Annotation, validation, and data collection at enterprise scale.</span>
                    </div>
                  </div>
                  <div className="bd-feature">
                    <CheckCircle className="bd-feature-icon" strokeWidth={2.4} />
                    <div>
                      <h3>Human-in-the-Loop Quality</h3>
                      <span>Multi-layer validation ensures high accuracy datasets.</span>
                    </div>
                  </div>
                  <div className="bd-feature">
                    <CheckCircle className="bd-feature-icon" strokeWidth={2.4} />
                    <div>
                      <h3>Global Workforce</h3>
                      <span>Distributed teams supporting multilingual and multimodal AI.</span>
                    </div>
                  </div>
                  <div className="bd-feature">
                    <CheckCircle className="bd-feature-icon" strokeWidth={2.4} />
                    <div>
                      <h3>Secure and Compliant</h3>
                      <span>Enterprise-grade data handling and privacy standards.</span>
                    </div>
                  </div>
                </div>

                <div className="bd-trust">
                  <span>Trusted by global AI teams building next-generation systems.</span>
                  <div className="bd-marquee" aria-label="Partner logos">
                    <div className="bd-marquee-track">
                      {[...partners, ...partners].map((partner, index) => (
                        <div key={`${partner.name}-${index}`} className="bd-logo-wrap">
                          <img
                            className="bd-logo-img"
                            src={partner.logo}
                            alt={partner.name}
                            loading="lazy"
                          />
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </section>

            <section className="bd-form-card">
              <div className="bd-form-header">
                <h2>Schedule a Demo</h2>
                <p>
                  Tell us about your AI project and our team will walk you through how Lifewood can support your data pipeline.
                </p>
              </div>

              <div className="bd-flow">
                <StepIndicator step={step} />

                <div className="bd-step-content">
                  {step === 1 && (
                    <DemoStep1 formData={formData} setField={setField} fieldErrors={fieldErrors} />
                  )}
                  {step === 2 && (
                    <DemoStep2 formData={formData} setField={setField} fieldErrors={fieldErrors} />
                  )}
                  {step === 3 && <DemoStep3 />}
                </div>

                <div className="bd-actions">
                  <button
                    type="button"
                    className="bd-btn secondary"
                    onClick={handleBack}
                    disabled={step === 1}
                  >
                    Back
                  </button>

                  {step < 3 ? (
                    <button
                      type="button"
                      className="bd-btn primary"
                      onClick={handleNext}
                      disabled={!canAdvance}
                    >
                      {step === 1
                        ? "Next -> Project Overview"
                        : "Next -> Schedule Demo"}
                    </button>
                  ) : (
                    <button
                      type="button"
                      className="bd-btn primary"
                      onClick={handleConfirm}
                      disabled={isSubmitting}
                    >
                      {isSubmitting ? "Submitting..." : "Complete Booking"}
                    </button>
                  )}
                </div>
                {submitError && <div className="bd-submit-error">{submitError}</div>}
              </div>
            </section>
          </div>
        </div>
      ) : (
        <div className="bd-mode-shell">
          <div className="bd-topbar">
            <button type="button" className="bd-back-link" onClick={() => setModeWithUrl(null)}>
              <ArrowLeft strokeWidth={2.2} />
              <span>Back to options</span>
            </button>
          </div>
          <div className="bd-layout">
            <section className="bd-panel">
              <span className="bd-glow one" />
              <span className="bd-glow two" />
              <div className="bd-panel-content">
                <h1>Ask our team before you book.</h1>
                <p>
                  Share your goals, questions, or blockers and we will route your
                  inquiry to the right team for a direct response.
                </p>

                <div className="bd-feature-list">
                  <div className="bd-feature">
                    <MessageCircle className="bd-feature-icon" strokeWidth={2.4} />
                    <div>
                      <h3>Human follow-up within 24 hours</h3>
                      <span>Reach sales, partnerships, or support without committing to a demo yet.</span>
                    </div>
                  </div>
                  <div className="bd-feature">
                    <CheckCircle className="bd-feature-icon" strokeWidth={2.4} />
                    <div>
                      <h3>Fast routing to the right team</h3>
                      <span>Tell us your inquiry type so we can reply with the right context immediately.</span>
                    </div>
                  </div>
                  <div className="bd-feature">
                    <Send className="bd-feature-icon" strokeWidth={2.4} />
                    <div>
                      <h3>Low-friction first step</h3>
                      <span>Ask about scope, pricing, partnerships, or support before scheduling time.</span>
                    </div>
                  </div>
                </div>
              </div>
            </section>

            <section className="bd-form-card bd-contact-card">
            <div className="bd-form-header">
              <h2>
                <MessageCircle strokeWidth={2.1} />
                Ask a Question
              </h2>
              <p>
                Send your inquiry and our team will get back to you within 24 hours.
              </p>
            </div>

            {contactSubmitted ? (
              <div className="bd-contact-success" role="status" aria-live="polite">
                <strong>Inquiry received.</strong>
                <span>
                  We’ll review your message and follow up using {contactForm.email || "your email"}.
                </span>
              </div>
            ) : (
              <form className="bd-flow" onSubmit={handleContactSubmit}>
                <div className="bd-grid">
                  <div className="bd-field">
                    <label className="bd-label">Full Name</label>
                    <input
                      className={`bd-input ${contactErrors.fullName ? "error" : ""}`}
                      type="text"
                      value={contactForm.fullName}
                      onChange={(event) => setContactField("fullName", event.target.value)}
                      placeholder="Avery Chen"
                      required
                    />
                    {contactErrors.fullName && (
                      <span className="bd-field-error">{contactErrors.fullName}</span>
                    )}
                  </div>

                  <div className="bd-field">
                    <label className="bd-label">Email</label>
                    <input
                      className={`bd-input ${contactErrors.email ? "error" : ""}`}
                      type="email"
                      value={contactForm.email}
                      onChange={(event) => setContactField("email", event.target.value)}
                      placeholder="name@company.com"
                      required
                    />
                    {contactErrors.email && (
                      <span className="bd-field-error">{contactErrors.email}</span>
                    )}
                  </div>

                  <div className="bd-field full">
                    <label className="bd-label">Inquiry Type</label>
                    <select
                      className={`bd-input ${contactErrors.inquiryType ? "error" : ""}`}
                      value={contactForm.inquiryType}
                      onChange={(event) => setContactField("inquiryType", event.target.value)}
                      required
                    >
                      <option value="">Select inquiry type</option>
                      {allowedInquiryTypes.map((option) => (
                        <option key={option} value={option}>
                          {option}
                        </option>
                      ))}
                    </select>
                    {contactErrors.inquiryType && (
                      <span className="bd-field-error">{contactErrors.inquiryType}</span>
                    )}
                  </div>

                  <div className="bd-field full">
                    <label className="bd-label">Message</label>
                    <textarea
                      className={`bd-textarea ${contactErrors.message ? "error" : ""}`}
                      value={contactForm.message}
                      onChange={(event) => setContactField("message", event.target.value)}
                      placeholder="Tell us what you need help with."
                      required
                    />
                    {contactErrors.message && (
                      <span className="bd-field-error">{contactErrors.message}</span>
                    )}
                  </div>
                </div>

                <p className="bd-contact-note">
                  We’ll capture your inquiry through the existing contact submission flow and route it to the right team.
                </p>

                <div className="bd-actions">
                  <button type="button" className="bd-btn secondary" onClick={() => setModeWithUrl(null)}>
                    Back
                  </button>
                  <button type="submit" className="bd-btn primary" disabled={contactIsSubmitting}>
                    <Send strokeWidth={2.1} />
                    <span>{contactIsSubmitting ? "Sending..." : "Send Inquiry"}</span>
                  </button>
                </div>
                {contactSubmitError && <div className="bd-submit-error">{contactSubmitError}</div>}
              </form>
            )}
            </section>
          </div>
        </div>
      )}
      {submitted && (
        <div
          className="bd-modal-overlay"
          role="dialog"
          aria-modal="true"
          aria-labelledby="demo-success-title"
          onClick={(event) => {
            if (event.target === event.currentTarget) {
              setSubmitted(false);
            }
          }}
        >
          <div className="bd-modal">
            <button
              type="button"
              className="bd-modal-close"
              aria-label="Close"
              onClick={() => setSubmitted(false)}
            >
              ×
            </button>
            <div className="bd-modal-header">
              <div className="bd-success-icon">
                <div className="bd-success-ring">
                  <CheckCircle size={28} color="#1C3D2B" strokeWidth={2.6} />
                </div>
              </div>
              <h2 className="bd-modal-title" id="demo-success-title">
                You’re all set for your Lifewood Demo!
              </h2>
              <p className="bd-modal-subtitle">
                A calendar invitation has been sent to {formData.workEmail || "name@email.com"}.
              </p>
              <p className="bd-modal-highlight">Monday, March 23rd @ 10:00 AM EST</p>
              <p className="bd-modal-subtitle">
                We can’t wait to discuss how we can help you achieve your goal.
              </p>
            </div>
            <div className="bd-modal-actions">
              <button
                type="button"
                className="bd-btn primary"
                onClick={() => (window.location.href = "/")}
              >
                Back to Home
              </button>
            </div>
          </div>
        </div>
      )}
    </main>
  );
};

export default ContactUs;
