import { useMemo, useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import jobOpenings from "../data/jobs";

const JobDetailPage = () => {
  const { slug } = useParams();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("overview");
  const [formData, setFormData] = useState({
    firstName: "",
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

  const job = useMemo(
    () => jobOpenings.find((j) => j.slug === slug),
    [slug],
  );

  useEffect(() => {
    if (job?.title) {
      setFormData((prev) => ({ ...prev, position: job.title }));
    }
  }, [job]);

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
            The role you’re looking for may have been filled.
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
              {job.overview.map((para) => (
                <p key={para}>{para}</p>
              ))}
            </div>
          )}

          {activeTab === "application" && (
            <form className="job-form">
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
                    <option value="Philippines">Philippines</option>
                    <option value="Singapore">Singapore</option>
                    <option value="United States">United States</option>
                    <option value="India">India</option>
                    <option value="United Kingdom">United Kingdom</option>
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
                    <input type="file" accept=".pdf" />
                    <div className="job-upload-title">Click to upload or drag and drop</div>
                    <div className="job-upload-btn">Choose File</div>
                    <div className="job-upload-hint">PDF only (max 10MB)</div>
                  </div>
                </div>
              </div>
              <div className="job-form-actions">
                <button type="submit" className="job-submit">Submit Application</button>
              </div>
            </form>
          )}
        </div>
      </div>
    </main>
  );
};

export default JobDetailPage;
