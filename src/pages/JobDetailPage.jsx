import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import jobs from "../data/jobs";
import { supabase } from "../lib/supabaseClient";
import emailjs from "@emailjs/browser";
import { buildScreeningLink } from "../utils/screeningLink";
import { COUNTRIES } from "../constants/countries";

const resumeBucket = import.meta.env.VITE_SUPABASE_RESUME_BUCKET || "resumes";

const safeName = (value = "") =>
  String(value || "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");

const JobDetailPage = () => {
  const { slug } = useParams();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("overview");
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState("");
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const [isResultModalOpen, setIsResultModalOpen] = useState(false);
  const [resultModalTitle, setResultModalTitle] = useState("");
  const [resultModalMessage, setResultModalMessage] = useState("");
  const [resultModalKind, setResultModalKind] = useState("success");
  const [cvFileName, setCvFileName] = useState("");
  const [cvFile, setCvFile] = useState(null);
  const [formData, setFormData] = useState({
    firstName: "",
    middleName: "",
    lastName: "",
    gender: "",
    age: "",
    phone: "",
    email: "",
    position: "",
    country: "",
    address: "",
  });

  const setField = (name, value) => {
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (isSubmitting) return;

    setIsSubmitting(true);
    setSubmitError("");
    setSubmitSuccess(false);

    const emailTo = (formData.email || "").trim();
    if (!emailTo) {
      setSubmitError("Email is required.");
      setIsSubmitting(false);
      return;
    }
    if (!cvFile) {
      setSubmitError("CV upload is required.");
      setIsSubmitting(false);
      return;
    }

    try {
      const fileExt = (cvFile.name.split(".").pop() || "pdf").toLowerCase();
      const fileKey = `${Date.now()}-${safeName(formData.firstName)}-${safeName(formData.middleName)}-${safeName(formData.lastName)}.${fileExt}`;
      const filePath = `applications/${fileKey}`;

      const { error: uploadError } = await supabase.storage
        .from(resumeBucket)
        .upload(filePath, cvFile, {
          cacheControl: "3600",
          upsert: false,
          contentType: cvFile.type || "application/pdf",
        });

      if (uploadError) {
        throw new Error(`CV upload failed: ${uploadError.message}`);
      }

      const { data: publicResumeData } = supabase.storage.from(resumeBucket).getPublicUrl(filePath);
      const cvUrl = publicResumeData?.publicUrl || null;

      const payload = {
        first_name: formData.firstName,
        middle_name: formData.middleName,
        last_name: formData.lastName,
        gender: formData.gender,
        age: formData.age ? Number(formData.age) : null,
        phone: formData.phone,
        email: emailTo,
        position_applied: job?.title || formData.position,
        country: formData.country,
        current_address: formData.address,
        job_id: job?.id || null,
        status: "Pre-screening Sent",
        stage: "Applied",
        cv_url: cvUrl,
      };

      const submitUrl = apiBaseUrl ? `${apiBaseUrl}/api/applications` : "/api/applications";
      const submitResponse = await fetch(submitUrl, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const submitJson = await submitResponse.json().catch(() => ({}));
      if (!submitResponse.ok) {
        if (submitResponse.status === 409 || submitJson?.code === "DUPLICATE_APPLICATION") {
          setResultModalKind("warning");
          setResultModalTitle("Application Already Exists");
          setResultModalMessage(
            "You already have an existing application for this job listing. Please wait for an update via email."
          );
          setIsResultModalOpen(true);
          setIsSubmitting(false);
          return;
        }
        throw new Error(submitJson?.error || "Application submit failed.");
      }
      const insertedData = submitJson?.data || null;

      const applicantName = `${formData.firstName} ${formData.middleName} ${formData.lastName}`.replace(/\s+/g, " ").trim();
      const screeningLink = buildScreeningLink({
        screeningUrl,
        applicationId: insertedData?.id,
        email: emailTo,
        applicantName,
      });
      const baseUrl = window.location.origin;
      const emailHtml = `
        <div style="font-family: Arial, sans-serif; background:#f7f3ea; padding:32px 18px;">
          <div style="max-width:540px; margin:0 auto; text-align:center;">
            <img src="${baseUrl}/lifewood-logo-v2.png" alt="Lifewood" style="height:48px; margin-bottom:18px;" />
          </div>
          <div style="max-width:540px; margin:0 auto; background:#f3eddc; border-radius:18px; padding:26px; color:#1f2b22;">
            <p style="font-size:16px; margin:0 0 12px;">Hi, <strong>${applicantName || 'Applicant'}</strong>!</p>
            <p style="font-size:14px; line-height:1.6; margin:0 0 12px;">
              Thank you for applying for the <strong>${job?.title || formData.position}</strong> at Lifewood! We're excited to move you forward in the process.
            </p>
            <p style="font-size:14px; line-height:1.6; margin:0 0 18px;">
              As the next step, we'd like you to complete a short AI-powered screening interview. It should take approximately 10 minutes and can be done at your convenience.
            </p>
            <div style="text-align:center; margin:18px 0 16px;">
              <a href="${screeningLink}" style="display:inline-block; background:#f2a74b; color:#0f2c1f; text-decoration:none; padding:12px 22px; border-radius:999px; font-weight:700;">Start your screening here</a>
            </div>
            <p style="font-size:13px; line-height:1.6; margin:0 0 12px;">
              Please complete it as soon as possible. Once we've reviewed your responses, we'll be in touch regarding the next steps.
            </p>
            <p style="font-size:13px; line-height:1.6; margin:0 0 12px;">
              If you have any questions, feel free to contact us at hr.lifewood@gmail.com.
            </p>
            <p style="font-size:13px; margin:0;">Best regards,</p>
            <p style="font-size:13px; margin:4px 0 0;">HR Team | Lifewood</p>
          </div>
          <div style="max-width:540px; margin:16px auto 0; text-align:center; font-size:12px; color:#5a6b60;">
            <div style="margin-bottom:8px;">Follow us:</div>
            <div>
              <a href="https://www.instagram.com/" style="margin:0 6px;"><img src="${baseUrl}/instagram-logo.png" alt="Instagram" style="height:18px;" /></a>
              <a href="https://www.facebook.com/" style="margin:0 6px;"><img src="${baseUrl}/facebook-logo.png" alt="Facebook" style="height:18px;" /></a>
              <a href="https://www.youtube.com/" style="margin:0 6px;"><img src="${baseUrl}/youtube-logo.png" alt="YouTube" style="height:18px;" /></a>
              <a href="https://www.linkedin.com/" style="margin:0 6px;"><img src="${baseUrl}/linkedin-logo.png" alt="LinkedIn" style="height:18px;" /></a>
            </div>
            <div style="margin-top:10px; font-size:11px;">(c) 2026 Lifewood - All Rights Reserved</div>
          </div>
        </div>
      `;

      if (emailServiceId && emailTemplateId && emailPublicKey) {
        try {
          await emailjs.send(
          emailServiceId,
          emailTemplateId,
          {
            to_email: emailTo,
            applicant_name: applicantName,
            position_name: job?.title || formData.position,
            subject_content: `Complete Your AI Screening for ${job?.title || formData.position} role at Lifewood`,
            email_intro: `Thank you for applying for the ${job?.title || formData.position} role at Lifewood! We're excited to move you forward in the process.`,
            email_body: "As the next step, we'd like you to complete a short AI-powered screening interview. It should take approximately 10 minutes and can be done at your convenience.",
            cta_text: 'Start your screening here',
            email_footer: "Please complete it as soon as possible. Once we've reviewed your responses, we'll be in touch regarding the next steps.",
            signoff_name: 'The Lifewood Team',
            screening_link: screeningLink,
            html_content: emailHtml,
          },
          emailPublicKey
        );
        } catch (emailError) {
          console.error(emailError);
          throw new Error("EmailJS send failed. Check template variables and API keys.");
        }
      } else {
        throw new Error("EmailJS keys are missing. Check VITE_EMAILJS_SERVICE_ID, VITE_EMAILJS_TEMPLATE_ID_PRESCREENING_FOLLOWUP, and VITE_EMAILJS_PUBLIC_KEY.");
      }

      setSubmitSuccess(true);
      setFormData((prev) => ({
        ...prev,
        firstName: "",
        middleName: "",
        lastName: "",
        gender: "",
        age: "",
        phone: "",
        email: "",
        country: "",
        address: "",
      }));
      setCvFile(null);
      setCvFileName("");
      setResultModalKind("success");
      setResultModalTitle("Application Submitted");
      setResultModalMessage(
        "Your application has been submitted successfully. Please check your email for updates and pre-screening instructions."
      );
      setIsResultModalOpen(true);
    } catch (error) {
      console.error(error);
      const message = String(error?.message || "");
      if (message.toLowerCase().includes("bucket")) {
        setSubmitError(`Resume upload failed. Please create Supabase storage bucket "${resumeBucket}" and retry.`);
      } else {
        setSubmitError(message || "Unable to submit application. Please try again.");
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const renderDescription = (text) => {
    if (!text) return null;
    return <div dangerouslySetInnerHTML={{ __html: text }} />;
  };

  const [job, setJob] = useState(null);
  const apiBaseUrl = import.meta.env.VITE_API_BASE_URL || "";
  const emailServiceId = import.meta.env.VITE_EMAILJS_SERVICE_ID || "";
  const emailTemplateId =
    import.meta.env.VITE_EMAILJS_TEMPLATE_ID_PRESCREENING_FOLLOWUP || "";
  const emailPublicKey = import.meta.env.VITE_EMAILJS_PUBLIC_KEY || "";
  const screeningUrl = import.meta.env.VITE_SCREENING_URL || "";

  const normalizeJob = (data) => {
    if (!data) return null;
    return {
      ...data,
      workType: data.work_type || data.workType || "",
      overview: Array.isArray(data.overview) ? data.overview : [],
      description: data.description || "",
    };
  };

  useEffect(() => {
    const loadJob = async () => {
      setIsLoading(true);
      let data = null;

      if (apiBaseUrl) {
        try {
          const response = await fetch(`${apiBaseUrl}/api/jobs/${slug}`);
          if (response.ok) {
            const payload = await response.json();
            data = payload?.data || payload || null;
          }
        } catch (error) {
          console.error(error);
        }
      }
      if (!data) {
        try {
          const { data: supaData, error } = await supabase
            .from("job_listings")
            .select("*")
            .eq("slug", slug)
            .maybeSingle();

          if (!error && supaData) {
            data = supaData;
          }
        } catch (error) {
          console.error(error);
        }
      }

      if (!data) {
        try {
          const { data: supaDataById, error } = await supabase
            .from("job_listings")
            .select("*")
            .eq("id", slug)
            .maybeSingle();

          if (!error && supaDataById) {
            data = supaDataById;
          }
        } catch (error) {
          console.error(error);
        }
      }

      if (!data) {
        data = jobs.find((item) => item.slug === slug) || null;
      }

      setJob(normalizeJob(data));
      setIsLoading(false);
    };

    if (slug) {
      loadJob();
    }
  }, [apiBaseUrl, slug]);

  useEffect(() => {
    if (job?.title) {
      setFormData((prev) => ({ ...prev, position: job.title }));
    }
  }, [job]);

  if (isLoading) {
    return (
      <main
        style={{
          minHeight: "100vh",
          display: "grid",
          placeItems: "center",
          padding: "40px 20px",
          fontFamily: "'Manrope', sans-serif",
          background: "#fdfefe",
          color: "#1a2e1e",
        }}
      >
        <div style={{ textAlign: "center" }}>
          <h1 style={{ fontSize: 22, marginBottom: 8 }}>Loading job...</h1>
          <p style={{ color: "rgba(26,46,30,0.6)" }}>Please wait a moment.</p>
        </div>
      </main>
    );
  }

  if (!job) {
    return (
      <main
        style={{
          minHeight: "100vh",
          display: "grid",
          placeItems: "center",
          padding: "40px 20px",
          fontFamily: "'Manrope', sans-serif",
          background: "#fdfefe",
          color: "#1a2e1e",
        }}
      >
        <div style={{ textAlign: "center" }}>
          <h1 style={{ fontSize: 26, marginBottom: 10 }}>Job not found</h1>
          <p style={{ color: "rgba(26,46,30,0.6)" }}>
            The role youre looking for may have been filled.
          </p>
          <button
            type="button"
            onClick={() => navigate("/careers")}
            style={{
              marginTop: 18,
              border: "none",
              background: "#046241",
              color: "#fff",
              padding: "10px 18px",
              borderRadius: 999,
              cursor: "pointer",
              fontWeight: 700,
            }}
          >
            Back to Careers
          </button>
        </div>
      </main>
    );
  }

  return (
    <main
      style={{
        minHeight: "100vh",
        background: "#fdfefe",
        color: "#1a2e1e",
        fontFamily: "'Manrope', sans-serif",
      }}
    >
      <style>{`
        .job-detail-shell {
          max-width: 1120px;
          margin: 0 auto;
          padding: 64px 24px 96px;
          position: relative;
          z-index: 1;
        }
        .job-hero {
          position: relative;
          border-radius: 18px;
          padding: 22px 26px;
          background: linear-gradient(90deg, rgba(232,160,32,0.22), rgba(4,98,65,0.22));
          border: 1px solid rgba(26,46,30,0.08);
          box-shadow: 0 18px 40px rgba(10,26,14,0.1);
          margin-bottom: 18px;
          transition: transform 0.25s ease, box-shadow 0.25s ease;
        }
        .job-hero:hover {
          transform: translateY(-2px);
          box-shadow: 0 26px 60px rgba(10,26,14,0.12);
        }
        .job-hero::after {
          content: "";
          position: absolute;
          inset: 0;
          pointer-events: none;
          border-radius: 24px;
          background:
            radial-gradient(circle at 20% 10%, rgba(232,160,32,0.35), transparent 50%),
            radial-gradient(circle at 80% 25%, rgba(4,98,65,0.30), transparent 55%),
            radial-gradient(circle at 40% 80%, rgba(232,160,32,0.20), transparent 60%);
          opacity: 0.9;
          mix-blend-mode: multiply;
        }
        .job-hero::before {
          content: "";
          position: absolute;
          inset: -20%;
          background:
            radial-gradient(circle at 30% 30%, rgba(232,160,32,0.18), transparent 55%),
            radial-gradient(circle at 70% 40%, rgba(4,98,65,0.16), transparent 60%);
          filter: blur(18px);
          opacity: 0.7;
          animation: jobLiquid 12s ease-in-out infinite;
          pointer-events: none;
        }
        @keyframes jobLiquid {
          0% { transform: translate3d(0, 0, 0) scale(1); }
          50% { transform: translate3d(-2%, 1%, 0) scale(1.03); }
          100% { transform: translate3d(0, 0, 0) scale(1); }
        }
        .job-topbar {
          display: flex;
          align-items: center;
          justify-content: space-between;
          margin-bottom: 10px;
          position: relative;
          z-index: 1;
        }
        .job-brand {
          display: inline-flex;
          align-items: center;
          gap: 10px;
        }
        .job-brand img { height: 22px; }
        .job-back {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          font-size: 11.5px;
          font-weight: 700;
          color: #046241;
          text-decoration: none;
          cursor: pointer;
          padding: 6px 12px;
          border-radius: 999px;
          border: 1px solid rgba(4,98,65,0.2);
          background: rgba(4,98,65,0.08);
          transition: transform 0.2s ease, box-shadow 0.2s ease, background 0.2s ease;
        }
        .job-back-icon {
          width: 22px;
          height: 22px;
          border-radius: 999px;
          display: grid;
          place-items: center;
          background: rgba(4,98,65,0.12);
          border: 1px solid rgba(4,98,65,0.2);
          font-size: 12px;
        }
        .job-back:hover {
          transform: translateY(-1px);
          box-shadow: 0 10px 20px rgba(4,98,65,0.18);
          background: rgba(4,98,65,0.12);
        }
        .job-title {
          text-align: center;
          font-size: clamp(20px, 2.6vw, 26px);
          font-weight: 800;
          margin: 6px 0 4px;
          position: relative;
          z-index: 1;
        }
        .job-meta {
          text-align: center;
          color: rgba(26,46,30,0.55);
          font-size: 12px;
          margin-bottom: 0;
          position: relative;
          z-index: 1;
        }
        .job-tabs {
          display: flex;
          justify-content: center;
          gap: 22px;
          border-bottom: 1px solid rgba(26,46,30,0.08);
          margin: 10px auto 22px;
          max-width: 520px;
        }
        .job-tab {
          padding: 12px 2px;
          font-size: 12px;
          font-weight: 700;
          letter-spacing: 0.08em;
          text-transform: uppercase;
          color: rgba(26,46,30,0.45);
          border-bottom: 2px solid transparent;
        }
        .job-tab.active {
          color: #046241;
          border-color: #046241;
        }
        .job-tab-btn {
          border: none;
          background: transparent;
          cursor: pointer;
        }
        .job-content {
          display: grid;
          grid-template-columns: 1fr;
          gap: 18px;
          width: 100%;
        }
        .job-section {
          width: 100%;
        }
        .job-section h3 {
          margin: 0 0 10px;
          font-size: 16px;
          font-weight: 800;
        }
        .job-section p {
          margin: 0 0 10px;
          color: rgba(26,46,30,0.65);
          line-height: 1.7;
          font-size: 13.5px;
          max-width: none;
        }
        .job-form {
          display: grid;
          gap: 16px;
          background: #ffffff;
          border: 1px solid rgba(26,46,30,0.08);
          border-radius: 18px;
          padding: 24px;
          box-shadow: 0 24px 48px rgba(10,26,14,0.1);
        }
        .job-form-grid {
          display: grid;
          grid-template-columns: repeat(2, minmax(0, 1fr));
          gap: 14px;
        }
        .job-field {
          display: grid;
          gap: 8px;
        }
        .job-field.full {
          grid-column: 1 / -1;
        }
        .job-label {
          font-size: 12px;
          font-weight: 700;
          color: #1a2e1e;
        }
        .job-input,
        .job-select,
        .job-textarea {
          border: 1px solid rgba(26,46,30,0.12);
          border-radius: 12px;
          padding: 11px 12px;
          font-size: 13px;
          font-family: 'Manrope', sans-serif;
          color: #1a2e1e;
          background: #ffffff;
          outline: none;
          transition: box-shadow 0.25s ease, border-color 0.25s ease, transform 0.25s ease;
        }
        .job-input:focus,
        .job-select:focus,
        .job-textarea:focus {
          border-color: rgba(4,98,65,0.35);
          box-shadow: 0 0 0 3px rgba(4,98,65,0.12);
        }
        .job-textarea {
          min-height: 120px;
          resize: vertical;
        }
        .job-upload {
          border: 1px dashed rgba(26,46,30,0.2);
          border-radius: 14px;
          padding: 16px;
          background: rgba(4,98,65,0.05);
          font-size: 12.5px;
          color: rgba(26,46,30,0.65);
          display: grid;
          gap: 6px;
          text-align: center;
          position: relative;
          overflow: hidden;
        }
        .job-upload input[type="file"] {
          opacity: 0;
          position: absolute;
          inset: 0;
          width: 100%;
          height: 100%;
          cursor: pointer;
        }
        .job-upload-title {
          font-weight: 700;
          color: #1a2e1e;
        }
        .job-upload-hint {
          font-size: 12px;
          color: rgba(26,46,30,0.55);
        }
        .job-upload-btn {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          gap: 8px;
          padding: 8px 14px;
          border-radius: 999px;
          background: rgba(4,98,65,0.12);
          color: #046241;
          font-weight: 700;
          font-size: 12px;
          margin: 0 auto;
        }
        .job-note {
          font-size: 12px;
          color: rgba(26,46,30,0.6);
        }
        .job-form-actions {
          display: flex;
          justify-content: flex-end;
        }
        .job-submit {
          border: none;
          background: #046241;
          color: #ffffff;
          font-weight: 700;
          font-size: 13px;
          padding: 11px 20px;
          border-radius: 999px;
          cursor: pointer;
          box-shadow: 0 10px 22px rgba(4,98,65,0.28);
          transition: transform 0.2s ease, box-shadow 0.2s ease;
        }
        .job-submit:hover {
          transform: translateY(-1px);
          box-shadow: 0 12px 24px rgba(4,98,65,0.35);
        }
        .job-result-modal-overlay {
          position: fixed;
          inset: 0;
          background: rgba(8, 14, 11, 0.48);
          display: grid;
          place-items: center;
          z-index: 1000;
          padding: 16px;
        }
        .job-result-modal {
          width: min(480px, 100%);
          background: #ffffff;
          border-radius: 16px;
          border: 1px solid rgba(26,46,30,0.12);
          box-shadow: 0 26px 44px rgba(10,26,14,0.24);
          padding: 18px;
          display: grid;
          gap: 10px;
        }
        .job-result-modal.success {
          padding: 24px;
          gap: 14px;
        }
        .job-result-icon {
          width: 54px;
          height: 54px;
          border-radius: 50%;
          display: grid;
          place-items: center;
          background: linear-gradient(135deg, rgba(4,98,65,0.14), rgba(242,167,75,0.22));
          color: #046241;
          font-size: 24px;
          font-weight: 800;
        }
        .job-result-title-wrap {
          display: grid;
          gap: 6px;
        }
        .job-result-caption {
          font-size: 12px;
          font-weight: 800;
          letter-spacing: 0.12em;
          text-transform: uppercase;
          color: #046241;
        }
        .job-result-modal h3 {
          margin: 0;
          font-size: 20px;
          color: #112b1d;
        }
        .job-result-modal p {
          margin: 0;
          font-size: 14px;
          color: rgba(26,46,30,0.75);
          line-height: 1.6;
        }
        .job-result-modal.warning h3 {
          color: #8a4a0d;
        }
        .job-result-actions {
          display: flex;
          justify-content: flex-end;
          margin-top: 8px;
        }
        .job-result-actions button {
          border: none;
          border-radius: 999px;
          padding: 10px 16px;
          font-weight: 700;
          cursor: pointer;
          background: #046241;
          color: #fff;
        }
        .job-result-actions button:hover {
          opacity: 0.96;
        }
        @media (max-width: 700px) {
          .job-form-grid { grid-template-columns: 1fr; }
        }
      `}</style>

      <div className="job-detail-shell">
        <div className="job-hero">
          <div className="job-topbar">
            <button
              type="button"
              className="job-back"
              onClick={() => navigate("/careers#job-openings")}
            >
              <span className="job-back-icon">{"\u2190"}</span>
              Back to Job Listings
            </button>
            <div className="job-brand">
              <img src="/lifewood-logo-dark.png" alt="Lifewood" />
            </div>
          </div>

          <h1 className="job-title">
            {job.title} - {job.workType}
          </h1>
          <div className="job-meta">
            {job.location} | {job.department} | {job.workplace} | {job.workType}
          </div>
        </div>

        <div className="job-tabs">
          <button
            type="button"
            className={`job-tab job-tab-btn ${activeTab === "overview" ? "active" : ""}`}
            onClick={() => setActiveTab("overview")}
          >
            Overview
          </button>
          <button
            type="button"
            className={`job-tab job-tab-btn ${activeTab === "application" ? "active" : ""}`}
            onClick={() => setActiveTab("application")}
          >
            Application
          </button>
        </div>

        <div className="job-content">
          {activeTab === "overview" && (
            <div className="job-section">
              <h3>Description</h3>
            {Array.isArray(job.overview) && job.overview.length > 0
              ? job.overview.map((para) => <p key={para}>{para}</p>)
              : renderDescription(job.description)}
            </div>
          )}

          {activeTab === "application" && (
            <form className="job-form" onSubmit={handleSubmit}>
              <div className="job-form-grid">
                <div className="job-field">
                  <label className="job-label">First Name</label>
                  <input
                    className="job-input"
                    type="text"
                    value={formData.firstName}
                    onChange={(e) => setField("firstName", e.target.value)}
                    placeholder="e.g. Michael"
                    required
                  />
                </div>
                <div className="job-field">
                  <label className="job-label">Last Name</label>
                  <input
                    className="job-input"
                    type="text"
                    value={formData.lastName}
                    onChange={(e) => setField("lastName", e.target.value)}
                    placeholder="e.g. Chen"
                    required
                  />
                </div>
                <div className="job-field">
                  <label className="job-label">Middle Name</label>
                  <input
                    className="job-input"
                    type="text"
                    value={formData.middleName}
                    onChange={(e) => setField("middleName", e.target.value)}
                    placeholder="e.g. Santos"
                  />
                </div>
                <div className="job-field">
                  <label className="job-label">Gender</label>
                  <select
                    className="job-select"
                    value={formData.gender}
                    onChange={(e) => setField("gender", e.target.value)}
                  >
                    <option value="">Select gender</option>
                    <option value="female">Female</option>
                    <option value="male">Male</option>
                    <option value="nonbinary">Non-binary</option>
                    <option value="prefer-not">Prefer not to say</option>
                  </select>
                </div>
                <div className="job-field">
                  <label className="job-label">Age</label>
                  <input
                    className="job-input"
                    type="number"
                    value={formData.age}
                    onChange={(e) => setField("age", e.target.value)}
                    placeholder="e.g. 24"
                  />
                </div>
                <div className="job-field">
                  <label className="job-label">Phone Number</label>
                  <input
                    className="job-input"
                    type="tel"
                    value={formData.phone}
                    onChange={(e) => setField("phone", e.target.value)}
                    placeholder="+63 (Philippines) 912345678"
                  />
                </div>
                <div className="job-field">
                  <label className="job-label">Email Address</label>
                  <input
                    className="job-input"
                    type="email"
                    value={formData.email}
                    onChange={(e) => setField("email", e.target.value)}
                    placeholder="michael@example.com"
                    required
                  />
                  <div className="job-note">
                    Note: Please check your email and continue with the AI pre-screening.
                  </div>
                </div>
                <div className="job-field">
                  <label className="job-label">Position Applied</label>
                  <input
                    className="job-input"
                    type="text"
                    value={job?.title || ""}
                    disabled
                  />
                </div>
                <div className="job-field">
                  <label className="job-label">Country</label>
                  <select
                    className="job-select"
                    value={formData.country}
                    onChange={(e) => setField("country", e.target.value)}
                  >
                    <option value="">Select country</option>
                    {COUNTRIES.map((country) => (
                      <option key={country} value={country}>{country}</option>
                    ))}
                  </select>
                </div>
                <div className="job-field full">
                  <label className="job-label">Current Address</label>
                  <input
                    className="job-input"
                    type="text"
                    value={formData.address}
                    onChange={(e) => setField("address", e.target.value)}
                    placeholder="e.g. Quezon City, Metro Manila"
                  />
                </div>
                <div className="job-field full">
                  <label className="job-label">Upload CV (PDF)</label>
                  <div className="job-upload">
                    <input
                      type="file"
                      accept=".pdf"
                      required
                      onChange={(e) => {
                        const file = e.target.files?.[0] || null;
                        setCvFile(file);
                        setCvFileName(file ? file.name : "");
                      }}
                    />
                    <div className="job-upload-title">Click to upload or drag and drop</div>
                    <div className="job-upload-btn">Choose File</div>
                    <div className="job-upload-hint">PDF only (max 10MB)</div>
                    <div className="job-upload-filename">{cvFileName ? `Selected: ${cvFileName}` : "No file selected"}</div>
                  </div>
                </div>
              </div>
              <div className="job-form-actions">
                {submitError ? <div className="job-note" style={{ color: "#b42318" }}>{submitError}</div> : null}
                {submitSuccess ? <div className="job-note" style={{ color: "#0f6d4f" }}>Application submitted.</div> : null}
                <button type="submit" className="job-submit" disabled={isSubmitting}>{isSubmitting ? "Submitting..." : "Submit Application"}</button>
              </div>
            </form>
          )}
        </div>
      </div>
      {isResultModalOpen ? (
        <div className="job-result-modal-overlay" onClick={() => setIsResultModalOpen(false)}>
          <div
            className={`job-result-modal ${resultModalKind === "warning" ? "warning" : "success"}`}
            onClick={(event) => event.stopPropagation()}
          >
            {resultModalKind === "success" ? <div className="job-result-icon">✓</div> : null}
            <div className="job-result-title-wrap">
              {resultModalKind === "success" ? <div className="job-result-caption">Application Received</div> : null}
            <h3>{resultModalTitle}</h3>
            <p>{resultModalMessage}</p>
            </div>
            <div className="job-result-actions">
              <button type="button" onClick={() => setIsResultModalOpen(false)}>
                {resultModalKind === "success" ? "Done" : "Close"}
              </button>
            </div>
          </div>
        </div>
      ) : null}
    </main>
  );
};

export default JobDetailPage;

























