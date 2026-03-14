import { useMemo, useState } from "react";
import { CheckCircle } from "lucide-react";

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

const DemoStep1 = ({ formData, setField }) => {
  return (
    <div className="bd-grid">
      <div className="bd-field">
        <label className="bd-label">Full Name</label>
        <input
          className="bd-input"
          type="text"
          value={formData.fullName}
          onChange={(event) => setField("fullName", event.target.value)}
          placeholder="Avery Chen"
          required
        />
      </div>
      <div className="bd-field">
        <label className="bd-label">Work Email</label>
        <input
          className="bd-input"
          type="email"
          value={formData.workEmail}
          onChange={(event) => setField("workEmail", event.target.value)}
          placeholder="name@company.com"
          required
        />
      </div>
      <div className="bd-field">
        <label className="bd-label">Company Name</label>
        <input
          className="bd-input"
          type="text"
          value={formData.companyName}
          onChange={(event) => setField("companyName", event.target.value)}
          placeholder="Lifewood"
          required
        />
      </div>
      <div className="bd-field">
        <label className="bd-label">Company Website</label>
        <input
          className="bd-input"
          type="url"
          value={formData.companyWebsite}
          onChange={(event) => setField("companyWebsite", event.target.value)}
          placeholder="https://www.lifewood.com"
          required
        />
      </div>
      <div className="bd-field">
        <label className="bd-label">Industry</label>
        <select
          className="bd-input"
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
      </div>
      <div className="bd-field">
        <label className="bd-label">Company Size</label>
        <select
          className="bd-input"
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
      </div>
    </div>
  );
};

const DemoStep2 = ({ formData, setField }) => {
  return (
    <div className="bd-grid">
      <div className="bd-field">
        <label className="bd-label">Project Type</label>
        <select
          className="bd-input"
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
      </div>
      <div className="bd-field">
        <label className="bd-label">Data Type</label>
        <select
          className="bd-input"
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
      </div>
      <div className="bd-field">
        <label className="bd-label">Estimated Dataset Size</label>
        <input
          className="bd-input"
          type="text"
          value={formData.datasetSize}
          onChange={(event) => setField("datasetSize", event.target.value)}
          placeholder="e.g. 1M+ samples"
          required
        />
      </div>
      <div className="bd-field">
        <label className="bd-label">Timeline</label>
        <select
          className="bd-input"
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
      </div>
      <div className="bd-field full">
        <label className="bd-label">Project Description</label>
        <textarea
          className="bd-textarea"
          value={formData.projectDescription}
          onChange={(event) => setField("projectDescription", event.target.value)}
          placeholder="Tell us about your goals, current workflow, and success criteria."
          required
        />
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
        <iframe
          title="Calendly Demo Booking"
          src="https://calendly.com/twinkycasidsidx/30min"
          className="bd-calendly-frame"
        />
      </div>
      <div className="bd-confirm">
        <p>
          Once you schedule your demo, you will receive a confirmation email with the meeting details.
          Our team will review your project before the call.
        </p>
      </div>
    </div>
  );
};

const ContactUs = () => {
  const [step, setStep] = useState(1);
  const [submitted, setSubmitted] = useState(false);
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
  });

  const setField = (name, value) => {
    setFormData((prev) => ({ ...prev, [name]: value }));
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
    if (!canAdvance) return;
    setStep((prev) => Math.min(prev + 1, 3));
  };

  const handleBack = () => {
    setStep((prev) => Math.max(prev - 1, 1));
  };

  const handleConfirm = () => {
    setSubmitted(true);
  };

  return (
    <main className="bd-root">
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Manrope:wght@400;500;600;700&display=swap');

        .bd-root {
          min-height: 100vh;
          background: #f9f9f9;
          color: #122620;
          font-family: 'Manrope', sans-serif;
        }

        .bd-shell {
          max-width: 920px;
          margin: 0 auto;
          padding: 96px 24px 64px;
        }

        .bd-header {
          text-align: center;
          display: grid;
          gap: 12px;
        }

        .bd-header h1 {
          font-size: clamp(2rem, 3.6vw, 2.6rem);
          font-weight: 600;
        }

        .bd-header p {
          font-size: 16px;
          font-weight: 400;
          color: rgba(18, 38, 32, 0.7);
        }

        .bd-card {
          margin-top: 28px;
          background: #ffffff;
          border: 1px solid rgba(18, 38, 32, 0.1);
          border-radius: 20px;
          padding: 28px;
          box-shadow: 0 18px 40px rgba(18, 38, 32, 0.08);
        }

        .bd-flow {
          display: grid;
          gap: 24px;
        }

        .bd-step-content {
          transition: all 0.3s ease;
        }

        .bd-step-indicator {
          display: grid;
          gap: 12px;
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
          font-size: 14px;
          text-transform: none;
          letter-spacing: 0;
          color: #122620;
        }

        .bd-step-subsep {
          color: rgba(18, 38, 32, 0.25);
        }

        .bd-progress {
          height: 8px;
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
          gap: 18px;
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
          font-size: 13px;
          font-weight: 600;
          color: #122620;
        }

        .bd-input,
        .bd-textarea {
          width: 100%;
          border-radius: 12px;
          border: 1px solid #d1d5db;
          padding: 12px 14px;
          font-size: 14px;
          font-family: inherit;
          color: #122620;
          transition: border-color 0.3s ease, box-shadow 0.3s ease;
        }

        .bd-input:focus,
        .bd-textarea:focus {
          outline: none;
          border-color: #f4a300;
          box-shadow: 0 0 0 3px rgba(244, 163, 0, 0.25);
        }

        .bd-textarea {
          min-height: 120px;
          resize: vertical;
        }

        .bd-step3 {
          display: grid;
          gap: 16px;
        }

        .bd-step3-head h2 {
          font-size: 20px;
          font-weight: 600;
          margin-bottom: 6px;
        }

        .bd-step3-head p {
          font-size: 14px;
          color: rgba(18, 38, 32, 0.7);
        }

        .bd-calendly {
          border-radius: 18px;
          border: 1px solid rgba(18, 38, 32, 0.12);
          overflow: hidden;
          background: #fff;
        }

        .bd-calendly-frame {
          width: 100%;
          height: 620px;
          border: none;
        }

        .bd-confirm {
          background: #f9f9f9;
          border: 1px solid rgba(18, 38, 32, 0.12);
          border-radius: 14px;
          padding: 14px 16px;
          font-size: 14px;
          color: rgba(18, 38, 32, 0.7);
        }

        .bd-actions {
          margin-top: 24px;
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 12px;
          flex-wrap: wrap;
        }

        .bd-btn {
          border-radius: 12px;
          padding: 12px 22px;
          font-size: 14px;
          font-weight: 500;
          border: 1px solid transparent;
          cursor: pointer;
          transition: all 0.3s ease;
        }

        .bd-btn.primary {
          background: #1c3d2b;
          color: #ffffff;
        }

        .bd-btn.primary:hover:enabled {
          background: #163020;
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

        .bd-btn.secondary:disabled {
          opacity: 0.5;
          cursor: not-allowed;
        }

        .bd-success {
          text-align: center;
          display: grid;
          gap: 14px;
          padding: 10px 6px;
        }

        .bd-success h2 {
          font-size: 24px;
          font-weight: 600;
        }

        .bd-success p {
          color: rgba(18, 38, 32, 0.7);
        }

        @media (max-width: 720px) {
          .bd-shell {
            padding: 72px 18px 56px;
          }

          .bd-card {
            padding: 20px;
          }

          .bd-grid {
            grid-template-columns: 1fr;
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

      <div className="bd-shell">
        <div className="bd-header">
          <h1>Book a Demo</h1>
          <p>Tell us about your project and schedule a call with our team.</p>
        </div>

        <div className="bd-card">
          {submitted ? (
            <div className="bd-success">
              <CheckCircle size={56} color="#1C3D2B" />
              <h2>Demo Scheduled Successfully</h2>
              <p>
                Thank you for booking a demo with Lifewood.
                A confirmation email with the meeting link has been sent to you.
              </p>
              <button
                type="button"
                className="bd-btn primary"
                onClick={() => (window.location.href = "/")}
              >
                Back to Home
              </button>
            </div>
          ) : (
            <div className="bd-flow">
              <StepIndicator step={step} />

              <div className="bd-step-content">
                {step === 1 && (
                  <DemoStep1 formData={formData} setField={setField} />
                )}
                {step === 2 && (
                  <DemoStep2 formData={formData} setField={setField} />
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
                  >
                    Complete Booking
                  </button>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </main>
  );
};

export default ContactUs;
