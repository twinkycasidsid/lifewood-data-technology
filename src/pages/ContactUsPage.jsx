import { useState } from "react";
import { motion } from "framer-motion";
import { Mail, Send, CheckCircle, ChevronDown, MapPin, ArrowRight } from "lucide-react";

const ContactUs = ({ onNavigate = () => {} }) => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    company: "",
    service: "",
    message: "",
  });
  const [submitted, setSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (e) =>
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    await new Promise((r) => setTimeout(r, 1400));
    setIsSubmitting(false);
    setSubmitted(true);
  };

  const services = [
    "Type A - Data Servicing",
    "Type B - Horizontal LLM Data",
    "Type C - Vertical LLM Data",
    "Type D - AIGC",
    "AI Services",
    "AI Projects",
    "General Inquiry",
  ];

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Manrope:wght@300;400;500;600;700;800&display=swap');

        *, *::before, *::after { box-sizing: border-box; }

        .cu-root {
          min-height: 100vh;
          background: #f9f9f7;
          font-family: 'Manrope', sans-serif;
          color: #1a2e1e;
          padding-top: 80px;
        }

        /* â”€â”€ Hero â”€â”€ */
        .cu-hero {
          position: relative;
          padding: 60px 40px 52px;
          text-align: center;
          overflow: hidden;
          background: #fff;
          border-bottom: 1px solid rgba(26,46,30,0.07);
        }
        .cu-hero::before {
          content: "";
          position: absolute;
          inset: 0;
          background:
            radial-gradient(ellipse 65% 55% at 50% 0%, rgba(4,98,65,0.055) 0%, transparent 70%),
            radial-gradient(ellipse 35% 35% at 85% 85%, rgba(232,160,32,0.045) 0%, transparent 60%);
          pointer-events: none;
        }
        .cu-hero-eyebrow {
          display: inline-flex;
          align-items: center;
          gap: 7px;
          background: rgba(4,98,65,0.07);
          border: 1px solid rgba(4,98,65,0.15);
          border-radius: 999px;
          padding: 5px 14px;
          font-size: 11px;
          font-weight: 700;
          letter-spacing: 0.11em;
          text-transform: uppercase;
          color: #046241;
          margin-bottom: 20px;
          font-family: 'Manrope', sans-serif;
        }
        .cu-hero-title {
          font-family: 'Manrope', sans-serif;
          font-size: clamp(32px, 5.5vw, 62px);
          font-weight: 800;
          line-height: 1.1;
          letter-spacing: -0.03em;
          color: #1a2e1e;
          margin: 0 0 16px;
        }
        .cu-hero-title span { color: #E8A020; }
        .cu-hero-sub {
          font-size: clamp(14px, 1.8vw, 16px);
          color: rgba(26,46,30,0.50);
          max-width: 460px;
          margin: 0 auto;
          line-height: 1.65;
          font-weight: 400;
          font-family: 'Manrope', sans-serif;
        }

        /* â”€â”€ Body grid â”€â”€ */
        .cu-body {
          max-width: 1160px;
          margin: 0 auto;
          padding: 40px 36px 80px;
          display: grid;
          grid-template-columns: 1fr 1.15fr;
          gap: 28px;
          align-items: start;
        }

        /* â”€â”€ Info panel â”€â”€ */
        .cu-info-panel {
          display: flex;
          flex-direction: column;
          gap: 14px;
        }

        /* â”€â”€ Offices redirect card â”€â”€ */
        .cu-offices-card {
          background: linear-gradient(145deg, #1a2e1e 0%, #0d3318 100%);
          border-radius: 18px;
          padding: 26px 28px;
          cursor: pointer;
          display: flex;
          flex-direction: column;
          position: relative;
          overflow: hidden;
          transition: transform 0.22s ease, box-shadow 0.22s ease;
          text-align: left;
          width: 100%;
          border: none;
          outline: none;
        }
        .cu-offices-card::before {
          content: "";
          position: absolute;
          top: -50px; right: -50px;
          width: 180px; height: 180px;
          border-radius: 50%;
          background: radial-gradient(circle, rgba(232,160,32,0.12) 0%, transparent 70%);
          pointer-events: none;
        }
        .cu-offices-card::after {
          content: "";
          position: absolute;
          bottom: -60px; left: -30px;
          width: 200px; height: 200px;
          border-radius: 50%;
          background: rgba(255,255,255,0.025);
          pointer-events: none;
        }
        .cu-offices-card:hover {
          transform: translateY(-3px);
          box-shadow: 0 16px 48px rgba(10,22,14,0.20);
        }
        .cu-offices-eyebrow {
          font-size: 10px;
          font-weight: 700;
          letter-spacing: 0.16em;
          text-transform: uppercase;
          color: rgba(232,160,32,0.75);
          margin-bottom: 10px;
          font-family: 'Manrope', sans-serif;
          position: relative; z-index: 1;
        }
        .cu-offices-title {
          font-family: 'Manrope', sans-serif;
          font-size: 20px;
          font-weight: 800;
          color: #fff;
          letter-spacing: -0.02em;
          margin-bottom: 8px;
          position: relative; z-index: 1;
        }
        .cu-offices-desc {
          font-size: 13px;
          color: rgba(255,255,255,0.44);
          line-height: 1.55;
          font-weight: 400;
          margin-bottom: 18px;
          position: relative; z-index: 1;
          font-family: 'Manrope', sans-serif;
        }
        .cu-offices-pills {
          display: flex;
          flex-wrap: wrap;
          gap: 7px;
          margin-bottom: 20px;
          position: relative; z-index: 1;
        }
        .cu-offices-pill {
          display: inline-flex;
          align-items: center;
          gap: 5px;
          background: rgba(255,255,255,0.07);
          border: 1px solid rgba(255,255,255,0.11);
          border-radius: 999px;
          padding: 4px 11px;
          font-size: 11px;
          font-weight: 600;
          color: rgba(255,255,255,0.58);
          font-family: 'Manrope', sans-serif;
        }
        .cu-offices-cta {
          display: inline-flex;
          align-items: center;
          gap: 7px;
          font-size: 12px;
          font-weight: 700;
          color: #E8A020;
          font-family: 'Manrope', sans-serif;
          letter-spacing: 0.02em;
          position: relative; z-index: 1;
          transition: gap 0.2s ease;
        }
        .cu-offices-card:hover .cu-offices-cta { gap: 11px; }

        /* â”€â”€ Shared card â”€â”€ */
        .cu-card {
          background: #fff;
          border: 1px solid rgba(26,46,30,0.085);
          border-radius: 18px;
          padding: 22px 26px;
          transition: border-color 0.2s ease, box-shadow 0.2s ease;
        }
        .cu-card:hover {
          border-color: rgba(4,98,65,0.22);
          box-shadow: 0 4px 20px rgba(4,98,65,0.05);
        }
        .cu-section-label {
          display: flex;
          align-items: center;
          gap: 7px;
          font-size: 10px;
          font-weight: 700;
          letter-spacing: 0.13em;
          text-transform: uppercase;
          color: #E8A020;
          margin-bottom: 14px;
          font-family: 'Manrope', sans-serif;
        }
        .cu-contact-row {
          display: flex;
          align-items: center;
          gap: 10px;
          font-size: 13.5px;
          color: rgba(26,46,30,0.62);
          margin-bottom: 10px;
          font-family: 'Manrope', sans-serif;
          font-weight: 500;
        }
        .cu-contact-row:last-child { margin-bottom: 0; }
        .cu-contact-row svg { color: #046241; flex-shrink: 0; }

        /* â”€â”€ Response card â”€â”€ */
        .cu-response-card {
          background: rgba(4,98,65,0.04);
          border: 1px solid rgba(4,98,65,0.11);
          border-radius: 18px;
          padding: 20px 26px;
        }
        .cu-response-card p {
          font-size: 13px;
          color: rgba(26,46,30,0.55);
          margin: 0;
          line-height: 1.65;
          font-weight: 400;
          font-family: 'Manrope', sans-serif;
        }
        .cu-response-card strong {
          color: #1a2e1e;
          font-weight: 700;
        }

        /* â”€â”€ Form card â”€â”€ */
        .cu-form-card {
          background: #fff;
          border: 1px solid rgba(26,46,30,0.085);
          border-radius: 22px;
          padding: 36px;
          position: sticky;
          top: 92px;
          box-shadow: 0 2px 18px rgba(26,46,30,0.05);
        }
        .cu-form-title {
          font-family: 'Manrope', sans-serif;
          font-size: 22px;
          font-weight: 800;
          color: #1a2e1e;
          letter-spacing: -0.02em;
          margin-bottom: 4px;
        }
        .cu-form-sub {
          font-size: 13px;
          color: rgba(26,46,30,0.42);
          margin-bottom: 24px;
          font-weight: 400;
          font-family: 'Manrope', sans-serif;
        }
        .cu-field-group {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 12px;
        }
        .cu-field {
          display: flex;
          flex-direction: column;
          gap: 6px;
          margin-bottom: 12px;
        }
        .cu-field.full { grid-column: 1 / -1; }
        .cu-label {
          font-size: 10.5px;
          font-weight: 700;
          color: rgba(26,46,30,0.45);
          letter-spacing: 0.09em;
          text-transform: uppercase;
          font-family: 'Manrope', sans-serif;
        }
        .cu-input, .cu-select, .cu-textarea {
          width: 100%;
          background: #f7f7f5;
          border: 1px solid rgba(26,46,30,0.11);
          border-radius: 11px;
          padding: 11px 14px;
          font-size: 13.5px;
          font-family: 'Manrope', sans-serif;
          font-weight: 500;
          color: #1a2e1e;
          outline: none;
          transition: border-color 0.18s ease, background 0.18s ease, box-shadow 0.18s ease;
          -webkit-appearance: none;
        }
        .cu-input::placeholder, .cu-textarea::placeholder {
          color: rgba(26,46,30,0.27);
          font-weight: 400;
        }
        .cu-input:focus, .cu-select:focus, .cu-textarea:focus {
          border-color: rgba(4,98,65,0.50);
          background: #fff;
          box-shadow: 0 0 0 3px rgba(4,98,65,0.07);
        }
        .cu-select-wrap { position: relative; }
        .cu-select-wrap svg {
          position: absolute;
          right: 12px;
          top: 50%;
          transform: translateY(-50%);
          pointer-events: none;
          color: rgba(26,46,30,0.32);
        }
        .cu-select option { background: #fff; color: #1a2e1e; }
        .cu-textarea { resize: vertical; min-height: 100px; }

        .cu-submit {
          width: 100%;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 8px;
          padding: 13px;
          border-radius: 999px;
          font-weight: 700;
          font-size: 14px;
          font-family: 'Manrope', sans-serif;
          letter-spacing: 0.01em;
          cursor: pointer;
          border: none;
          background: #E8A020;
          color: #1a2e1e;
          box-shadow: 0 4px 18px rgba(232,160,32,0.26);
          transition: all 0.2s ease;
          margin-top: 6px;
        }
        .cu-submit:hover:not(:disabled) {
          background: #f0b030;
          box-shadow: 0 6px 24px rgba(232,160,32,0.38);
          transform: translateY(-1px);
        }
        .cu-submit:disabled { opacity: 0.50; cursor: not-allowed; transform: none; }

        /* â”€â”€ Success â”€â”€ */
        .cu-success {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          text-align: center;
          padding: 44px 20px;
          gap: 14px;
        }
        .cu-success-icon {
          width: 60px; height: 60px;
          border-radius: 50%;
          background: rgba(4,98,65,0.08);
          border: 1px solid rgba(4,98,65,0.18);
          display: flex; align-items: center; justify-content: center;
          color: #046241;
        }
        .cu-success h3 {
          font-family: 'Manrope', sans-serif;
          font-size: 22px;
          font-weight: 800;
          color: #1a2e1e;
          margin: 0;
          letter-spacing: -0.02em;
        }
        .cu-success p {
          font-size: 13.5px;
          color: rgba(26,46,30,0.50);
          margin: 0;
          line-height: 1.6;
          font-family: 'Manrope', sans-serif;
        }

        /* â”€â”€ Responsive â”€â”€ */
        @media (max-width: 900px) {
          .cu-hero { padding: 48px 24px 44px; }
          .cu-body {
            grid-template-columns: 1fr;
            padding: 28px 20px 64px;
            gap: 20px;
          }
          .cu-form-card { position: static; padding: 26px 22px; }
          .cu-field-group { grid-template-columns: 1fr; }
          .cu-field.full { grid-column: auto; }
        }
        @media (max-width: 540px) {
          .cu-root { padding-top: 64px; }
          .cu-hero { padding: 40px 18px 36px; }
          .cu-body { padding: 22px 14px 52px; gap: 14px; }
          .cu-card { padding: 18px 20px; }
          .cu-form-card { padding: 22px 18px; border-radius: 18px; }
          .cu-offices-card { padding: 22px 20px; }
        }
        @keyframes spin { to { transform: rotate(360deg); } }
      `}</style>

      <div className="cu-root">
        {/* Hero */}
        <motion.div
          className="cu-hero"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
        >
          <div className="cu-hero-eyebrow">
            <Mail size={11} />
            Get in touch
          </div>
          <h1 className="cu-hero-title">
            Let's Start a <span>Conversation</span>
          </h1>
          <p className="cu-hero-sub">
            Whether you're exploring AI solutions or ready to partner, our team is here to help you navigate the right path.
          </p>
        </motion.div>

        {/* Body */}
        <div className="cu-body">
          {/* Left */}
          <motion.div
            className="cu-info-panel"
            initial={{ opacity: 0, x: -16 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.12, ease: [0.22, 1, 0.36, 1] }}
          >
            {/* Offices CTA card */}
            <button
              type="button"
              className="cu-offices-card"
              onClick={() => onNavigate("/offices")}
            >
              <div className="cu-offices-eyebrow">Our Locations</div>
              <div className="cu-offices-title">Find Our Offices</div>
              <div className="cu-offices-desc">
                We operate across 30+ countries with regional hubs spanning Asia, Europe, and beyond.
              </div>
              <div className="cu-offices-pills">
                {["Hong Kong", "Shenzhen", "Singapore", "Global"].map((loc) => (
                  <span key={loc} className="cu-offices-pill">
                    <MapPin size={9} />
                    {loc}
                  </span>
                ))}
              </div>
              <div className="cu-offices-cta">
                View all offices <ArrowRight size={13} strokeWidth={2.5} />
              </div>
            </button>
          </motion.div>

            {/* Right — form */}
          <motion.div
            className="cu-form-card"
            initial={{ opacity: 0, x: 16 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.18, ease: [0.22, 1, 0.36, 1] }}
          >
            {submitted ? (
              <div className="cu-success">
                <div className="cu-success-icon">
                  <CheckCircle size={28} />
                </div>
                <h3>Message Sent!</h3>
                <p>Thank you for reaching out. A member of our team will be in contact with you shortly.</p>
                <button
                  type="button"
                  className="cu-submit"
                  style={{ width: "auto", padding: "11px 28px", marginTop: "6px" }}
                  onClick={() => {
                    setSubmitted(false);
                    setFormData({ name: "", email: "", company: "", service: "", message: "" });
                  }}
                >
                  Send Another
                </button>
              </div>
            ) : (
              <>
                <div className="cu-form-title">Send us a message</div>
                <div className="cu-form-sub">All fields required unless marked optional.</div>

                <form onSubmit={handleSubmit} noValidate>
                  <div className="cu-field-group">
                    <div className="cu-field">
                      <label className="cu-label">Full Name</label>
                      <input className="cu-input" type="text" name="name" placeholder="Jane Smith" value={formData.name} onChange={handleChange} required />
                    </div>
                    <div className="cu-field">
                      <label className="cu-label">Email</label>
                      <input className="cu-input" type="email" name="email" placeholder="jane@company.com" value={formData.email} onChange={handleChange} required />
                    </div>
                    <div className="cu-field">
                      <label className="cu-label">
                        Company <span style={{ opacity: 0.42, fontWeight: 400, textTransform: "none", letterSpacing: 0 }}>(optional)</span>
                      </label>
                      <input className="cu-input" type="text" name="company" placeholder="Acme Corp" value={formData.company} onChange={handleChange} />
                    </div>
                    <div className="cu-field">
                      <label className="cu-label">Service Interest</label>
                      <div className="cu-select-wrap">
                        <select className="cu-select" name="service" value={formData.service} onChange={handleChange} required>
                          <option value="" disabled>Select a service...</option>
                          {services.map((s) => <option key={s} value={s}>{s}</option>)}
                        </select>
                        <ChevronDown size={13} />
                      </div>
                    </div>
                    <div className="cu-field full">
                      <label className="cu-label">Message</label>
                      <textarea className="cu-textarea" name="message" placeholder="Tell us about your project or questionâ€¦" value={formData.message} onChange={handleChange} required />
                    </div>
                  </div>

                  <button
                    type="submit"
                    className="cu-submit"
                    disabled={isSubmitting || !formData.name || !formData.email || !formData.service || !formData.message}
                  >
                    {isSubmitting ? (
                      <>
                        <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" style={{ animation: "spin 0.7s linear infinite" }}>
                          <path d="M21 12a9 9 0 1 1-6.219-8.56" />
                        </svg>
                        Sendingâ€¦
                      </>
                    ) : (
                      <>
                        <Send size={14} strokeWidth={2.5} />
                        Send Message
                      </>
                    )}
                  </button>
                </form>
              </>
            )}
          </motion.div>
        </div>
      </div>
    </>
  );
};

export default ContactUs;
