import { useState, useEffect, useRef } from "react";
import { motion, useInView, AnimatePresence } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { supabase } from "../lib/supabaseClient";
import {
  IconMapPin,
  IconBriefcase,
  IconClock,
  IconChevronRight,
} from "@tabler/icons-react";

// ── Data ──────────────────────────────────────────────────────────────────────

const values = [
  {
    icon: "◈",
    title: "Integrity First",
    text: "We hold ourselves to the highest ethical standards — in every project, partnership, and interaction.",
  },
  {
    icon: "↗",
    title: "Global Mindset",
    text: "With teams across 30+ countries, we bring diverse perspectives to every challenge we solve.",
  },
  {
    icon: "✦",
    title: "Continuous Growth",
    text: "Learning never stops at Lifewood. We invest in our people through training, mentorship, and opportunity.",
  },
  {
    icon: "◎",
    title: "Purposeful Impact",
    text: "Our work powers the AI systems shaping industries worldwide — every role here carries real-world significance.",
  },
];

const benefits = [
  "Flexible work arrangements",
  "Career development pathways",
  "Inclusive & diverse culture",
  "Competitive compensation",
  "Global team collaboration",
  "Mentorship programs",
  "Work-life balance",
  "Purpose-driven mission",
];


const allTraits = [
  "Flexible",
  "Supportive",
  "Collaborative",
  "Innovative",
  "Transparent",
  "Reliable",
  "Trustworthy",
  "Respectful",
  "Accountable",
  "Responsible",
  "Honest",
  "Professional",
  "Ethical",
  "Adaptable",
  "Inclusive",
  "Diverse",
  "Motivated",
  "Dedicated",
  "Committed",
  "Efficient",
  "Creative",
  "Proactive",
  "Goal-oriented",
  "Results-driven",
  "Passionate",
  "Empowering",
  "Growth-focused",
  "Resilient",
  "Excellence-driven",
  "Agile",
];

// ── Color tokens ──────────────────────────────────────────────────────────────
const C = {
  bg: "#fdfefe",
  white: "#ffffff",
  dark: "#1a2e1e",
  darkDeep: "#0a1a0e",
  green: "#046241",
  amber: "#E8A020",
  amberOld: "#c47f00",
  border: "rgba(26,46,30,0.085)",
  borderDark: "rgba(255,255,255,0.07)",
  textMuted: "rgba(26,46,30,0.50)",
  textLight: "rgba(26,46,30,0.42)",
};

// ── Value Card ────────────────────────────────────────────────────────────────

const ValueCard = ({ card, i }) => {
  const [hovered, setHovered] = useState(false);
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-40px" });

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 28 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.55, delay: i * 0.1, ease: [0.22, 1, 0.36, 1] }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        padding: "28px 26px",
        borderRadius: 20,
        background: hovered ? C.darkDeep : C.white,
        border: `1px solid ${hovered ? "rgba(232,160,32,0.35)" : C.border}`,
        transition:
          "background 0.32s ease, border-color 0.32s ease, box-shadow 0.32s ease, transform 0.32s ease",
        boxShadow: hovered
          ? "0 20px 48px rgba(10,26,14,0.18)"
          : "0 2px 12px rgba(10,26,14,0.04)",
        transform: hovered ? "translateY(-4px)" : "translateY(0)",
        cursor: "default",
        position: "relative",
        overflow: "hidden",
      }}
    >
      {/* Ghost number */}
      <div
        style={{
          position: "absolute",
          bottom: -12,
          right: 14,
          fontSize: 88,
          fontWeight: 900,
          lineHeight: 1,
          color: hovered ? "rgba(255,255,255,0.03)" : "rgba(26,46,30,0.035)",
          userSelect: "none",
          pointerEvents: "none",
          fontFamily: "'Manrope', sans-serif",
          letterSpacing: "-0.04em",
          transition: "color 0.32s",
        }}
      >
        {String(i + 1).padStart(2, "0")}
      </div>

      {/* Icon badge */}
      <div
        style={{
          width: 44,
          height: 44,
          borderRadius: 13,
          background: hovered
            ? "rgba(232,160,32,0.15)"
            : "rgba(232,160,32,0.08)",
          border: "1px solid rgba(232,160,32,0.25)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          fontSize: 17,
          color: C.amber,
          marginBottom: 18,
          transition: "background 0.3s",
          flexShrink: 0,
        }}
      >
        {card.icon}
      </div>

      {/* Animated underline */}
      <motion.div
        animate={{ width: hovered ? "100%" : "28px" }}
        transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
        style={{
          height: 2,
          background: C.amber,
          borderRadius: 2,
          marginBottom: 14,
        }}
      />

      <h3
        style={{
          margin: "0 0 8px",
          fontFamily: "'Manrope', sans-serif",
          fontSize: 16,
          fontWeight: 800,
          letterSpacing: "-0.02em",
          lineHeight: 1.2,
          color: hovered ? "#fff" : C.dark,
          transition: "color 0.3s",
        }}
      >
        {card.title}
      </h3>
      <p
        style={{
          margin: 0,
          fontFamily: "'Manrope', sans-serif",
          fontSize: 13.5,
          lineHeight: 1.72,
          color: hovered ? "rgba(255,255,255,0.52)" : C.textMuted,
          transition: "color 0.3s",
        }}
      >
        {card.text}
      </p>
    </motion.div>
  );
};

// ── Trait Ticker ──────────────────────────────────────────────────────────────

const TraitTicker = () => {
  const [start, setStart] = useState(0);
  const visible = Array.from(
    { length: 6 },
    (_, i) => allTraits[(start + i) % allTraits.length],
  );

  useEffect(() => {
    const t = setInterval(
      () => setStart((p) => (p + 1) % allTraits.length),
      1800,
    );
    return () => clearInterval(t);
  }, []);

  return (
    <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
      <AnimatePresence mode="popLayout">
        {visible.map((trait) => (
          <motion.span
            key={trait}
            layout
            initial={{ opacity: 0, scale: 0.88, y: 8 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.88, y: -8 }}
            transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: 6,
              padding: "8px 14px",
              borderRadius: 999,
              background: C.white,
              border: `1px solid ${C.border}`,
              fontFamily: "'Manrope', sans-serif",
              fontSize: 12.5,
              fontWeight: 700,
              color: C.dark,
              boxShadow: "0 1px 4px rgba(10,26,14,0.06)",
            }}
          >
            <span
              style={{
                width: 5,
                height: 5,
                borderRadius: "50%",
                background: C.amber,
                flexShrink: 0,
              }}
            />
            {trait}
          </motion.span>
        ))}
      </AnimatePresence>
    </div>
  );
};

// ── Apply Button ──────────────────────────────────────────────────────────────

const ApplyButton = ({ large = false, dark = false }) => (
  <a
    href="#job-openings"
    style={{
      display: "inline-flex",
      alignItems: "center",
      gap: 8,
      padding: large ? "14px 32px" : "11px 24px",
      borderRadius: 999,
      fontFamily: "'Manrope', sans-serif",
      fontSize: large ? 14 : 13,
      fontWeight: 700,
      letterSpacing: "0.01em",
      color: C.dark,
      background: C.amber,
      border: "none",
      cursor: "pointer",
      boxShadow: "0 4px 18px rgba(232,160,32,0.30)",
      textDecoration: "none",
      transition: "background 0.2s, box-shadow 0.2s, transform 0.2s",
      whiteSpace: "nowrap",
    }}
    onMouseEnter={(e) => {
      e.currentTarget.style.background = "#f0b030";
      e.currentTarget.style.transform = "translateY(-1px)";
      e.currentTarget.style.boxShadow = "0 6px 24px rgba(232,160,32,0.42)";
    }}
    onMouseLeave={(e) => {
      e.currentTarget.style.background = C.amber;
      e.currentTarget.style.transform = "translateY(0)";
      e.currentTarget.style.boxShadow = "0 4px 18px rgba(232,160,32,0.30)";
    }}
  >
    Apply Now →
  </a>
);

// ── Main Page ─────────────────────────────────────────────────────────────────

const CareersPage = () => {
  const navigate = useNavigate();
  const heroRef = useRef(null);
  const heroInView = useInView(heroRef, { once: true });
  const normalizeJob = (data) => ({
    ...data,
    workType: data.work_type || data.workType || "",
    workplace: data.workplace || "",
    location: data.location || "",
    department: data.department || "",
    description: data.description || "",
    status: data.status || "Active",
    applicants: data.applicants_count ?? data.applicants ?? 0,
    createdAt: data.created_at || data.createdAt || "",
    slug: data.slug || data.id || "",
  });
  const [search, setSearch] = useState("");
  const [workplace, setWorkplace] = useState("");
  const [location, setLocation] = useState("");
  const [department, setDepartment] = useState("");
  const [workType, setWorkType] = useState("");
  const [jobsData, setJobsData] = useState([]);
  const [isLoadingJobs, setIsLoadingJobs] = useState(false);
  const [jobsError, setJobsError] = useState("");
  const [page, setPage] = useState(1);
  const pageSize = 9;

  useEffect(() => {
    let isMounted = true;

    const loadJobs = async () => {
      setIsLoadingJobs(true);
      setJobsError("");
      try {
        const { data, error } = await supabase
          .from("job_listings")
          .select("*")
          .order("created_at", { ascending: false });

        if (error) {
          throw error;
        }

        if (Array.isArray(data)) {
          const normalized = data
            .map(normalizeJob)
            .filter((item) => String(item?.status || "").trim().toLowerCase() !== "closed");
          if (isMounted) {
            setJobsData(normalized);
          }
        }
      } catch (err) {
        console.error(err);
        if (isMounted) {
          setJobsError("Unable to load live job listings.");
          setJobsData([]);
        }
      } finally {
        if (isMounted) {
          setIsLoadingJobs(false);
        }
      }
    };

    loadJobs();

    return () => {
      isMounted = false;
    };
  }, []);

  const workplaceOptions = Array.from(new Set(jobsData.map((j) => j.workplace))).filter(Boolean);
  const locationOptions = Array.from(new Set(jobsData.map((j) => j.location))).filter(Boolean);
  const departmentOptions = Array.from(new Set(jobsData.map((j) => j.department))).filter(Boolean);
  const workTypeOptions = Array.from(new Set(jobsData.map((j) => j.workType))).filter(Boolean);

  const filteredJobs = jobsData.filter((job) => {
    const isClosed = String(job.status || "").trim().toLowerCase() === "closed";
    const matchesSearch = job.title.toLowerCase().includes(search.toLowerCase());
    const matchesWorkplace = workplace ? job.workplace === workplace : true;
    const matchesLocation = location ? job.location === location : true;
    const matchesDepartment = department ? job.department === department : true;
    const matchesWorkType = workType ? job.workType === workType : true;
    return (
      !isClosed &&
      matchesSearch &&
      matchesWorkplace &&
      matchesLocation &&
      matchesDepartment &&
      matchesWorkType
    );
  });

  useEffect(() => {
    setPage(1);
  }, [search, workplace, location, department, workType]);

  const totalPages = Math.max(1, Math.ceil(filteredJobs.length / pageSize));
  const pagedJobs = filteredJobs.slice((page - 1) * pageSize, page * pageSize);

  useEffect(() => {
    if (window.location.hash === "#job-openings") {
      const el = document.getElementById("job-openings");
      if (el) {
        el.scrollIntoView({ block: "start" });
      }
    }
  }, []);

  const stripHtml = (text) => {
    if (!text) return "";
    return text.replace(/<[^>]*>?/gm, "");
  };

  const formatDateShort = (value) => {
    if (!value) return "";
    const parsed = new Date(value);
    if (Number.isNaN(parsed.getTime())) return "";
    return parsed.toLocaleDateString("en-US", {
      month: "2-digit",
      day: "2-digit",
      year: "2-digit",
    });
  };

  return (
    <main
      className="careers-page"
      style={{
        fontFamily: "'Manrope', sans-serif",
        background: C.bg,
        minHeight: "100vh",
        color: C.dark,
        overflowX: "hidden",
      }}
    >
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Manrope:wght@300;400;500;600;700;800;900&display=swap');
        *, *::before, *::after { box-sizing: border-box; }

        .cp-collage img {
          width: 100%; height: 100%;
          object-fit: cover; display: block;
          transition: transform 0.6s ease;
        }
        .cp-collage-main:hover img,
        .cp-collage-a:hover img,
        .cp-collage-b:hover img { transform: scale(1.05); }

        .cp-benefit:hover { border-color: rgba(232,160,32,0.30) !important; }

        @keyframes cp-pulse {
          0%,100% { box-shadow: 0 0 0 0 rgba(232,160,32,0.4); }
          50% { box-shadow: 0 0 0 5px rgba(232,160,32,0); }
        }

        .cp-jobs-shell {
          max-width: 1160px;
          margin: 0 auto;
          font-family: 'Manrope', sans-serif;
          line-height: 1.6;
          position: relative;
        }

        .cp-jobs-header {
          display: grid;
          gap: 12px;
          text-align: center;
          margin-bottom: 26px;
        }

        .cp-jobs-title {
          font-size: clamp(30px, 3.8vw, 44px);
          font-weight: 800;
          letter-spacing: -0.01em;
          margin: 0;
        }

        .cp-jobs-subtitle {
          font-size: 14px;
          color: ${C.textMuted};
          margin: 0;
        }

        .cp-jobs-toolbar {
          display: grid;
          gap: 14px;
          margin-bottom: 30px;
          background: #fff;
          border: 1px solid ${C.border};
          border-radius: 18px;
          padding: 18px;
          box-shadow: 0 20px 44px rgba(10,26,14,0.08);
        }

        .cp-job-search {
          display: flex;
          align-items: center;
          gap: 10px;
          width: 100%;
          min-width: 0;
          background: rgba(4,98,65,0.04);
          border: 1px solid rgba(4,98,65,0.12);
          border-radius: 999px;
          padding: 12px 16px;
          transition: box-shadow 0.3s ease, border-color 0.3s ease, transform 0.3s ease;
        }

        .cp-job-search:focus-within {
          border-color: rgba(4,98,65,0.35);
          box-shadow: 0 0 0 4px rgba(4,98,65,0.12);
          transform: translateY(-1px);
        }

        .cp-search-icon {
          width: 16px;
          height: 16px;
          color: ${C.textLight};
          flex-shrink: 0;
        }

        .cp-job-search input {
          border: none;
          outline: none;
          width: 100%;
          font-size: 14px;
          color: ${C.dark};
          background: transparent;
        }

        .cp-job-filters {
          display: grid;
          grid-template-columns: repeat(4, minmax(0, 1fr));
          gap: 12px;
        }

        .cp-job-filter {
          border: 1px solid ${C.border};
          background: #fff;
          border-radius: 999px;
          padding: 10px 14px;
          font-size: 13px;
          color: ${C.dark};
          box-shadow: inset 0 0 0 1px rgba(4,98,65,0.03);
          transition: box-shadow 0.25s ease, transform 0.25s ease, border-color 0.25s ease;
        }

        .cp-job-filter:focus {
          outline: none;
          border-color: rgba(4,98,65,0.35);
          box-shadow: 0 10px 20px rgba(10,26,14,0.08);
          transform: translateY(-1px);
        }

        .cp-jobs-grid {
          display: grid;
          grid-template-columns: repeat(3, minmax(0, 1fr));
          gap: 18px;
        }

        .cp-admin-card {
          background: #ffffff;
          display: flex;
          flex-direction: column;
          height: 100%;
        }

        .cp-admin-card .admin-listing-pill {
          padding: 5px 10px;
          font-size: 11px;
          gap: 5px;
        }

        .cp-admin-card .admin-listing-pill svg {
          width: 12px;
          height: 12px;
        }

        .cp-admin-card .admin-listing-metric strong {
          font-size: 16px;
        }

        .cp-admin-card .admin-listing-metric span {
          font-size: 10px;
        }

        .cp-admin-footer {
          gap: 10px;
          margin-top: auto;
        }

        .cp-pagination {
          display: flex;
          gap: 8px;
          justify-content: center;
          margin-top: 22px;
        }

        .cp-page-btn {
          border-radius: 999px;
          border: 1px solid ${C.border};
          background: #ffffff;
          color: ${C.dark};
          padding: 8px 14px;
          font-size: 12px;
          font-weight: 600;
          cursor: pointer;
          transition: transform 0.2s ease, box-shadow 0.2s ease, border-color 0.2s ease;
        }

        .cp-page-btn:hover:not(:disabled) {
          border-color: rgba(4,98,65,0.35);
          box-shadow: 0 10px 20px rgba(10,26,14,0.08);
          transform: translateY(-1px);
        }

        .cp-page-btn.is-active {
          background: ${C.green};
          border-color: ${C.green};
          color: #ffffff;
        }

        .cp-page-btn:disabled {
          cursor: not-allowed;
          opacity: 0.5;
          transform: none;
          box-shadow: none;
        }

        .cp-jobs-status {
          margin-top: 10px;
          font-size: 12px;
          color: rgba(26,46,30,0.6);
        }

        .cp-job-card {
          background: transparent;
          border: none;
          border-radius: 0;
          padding: 8px 0 18px;
          display: grid;
          gap: 12px;
          box-shadow: none;
          transition: color 0.2s ease;
          position: relative;
        }

        .cp-job-card + .cp-job-card {
          border-top: 1px solid rgba(26,46,30,0.08);
          padding-top: 18px;
        }

        .cp-job-card:hover .cp-job-title {
          text-decoration: underline;
        }

        .cp-job-title {
          font-size: 16px;
          font-weight: 800;
          color: ${C.green};
          margin: 0;
        }

        .cp-job-tags {
          display: flex;
          flex-wrap: wrap;
          gap: 10px;
        }

        .cp-job-info {
          display: flex;
          flex-wrap: wrap;
          align-items: center;
          gap: 18px;
          color: ${C.dark};
          font-size: 13px;
          font-weight: 600;
        }

        .cp-job-info-item {
          display: inline-flex;
          align-items: center;
          gap: 8px;
        }

        .cp-job-desc {
          font-size: 12.5px;
          color: ${C.textMuted};
          line-height: 1.7;
        }

        .cp-job-actions {
          display: flex;
          justify-content: flex-end;
        }

        .cp-job-btn {
          border: none;
          background: ${C.green};
          color: #ffffff;
          font-weight: 700;
          font-size: 12px;
          padding: 8px 16px;
          border-radius: 999px;
          cursor: pointer;
          transition: transform 0.2s ease, box-shadow 0.2s ease;
        }

        .cp-job-btn:hover {
          transform: translateY(-1px);
          box-shadow: 0 8px 18px rgba(4,98,65,0.30);
        }

        .cp-job-meta {
          display: flex;
          flex-wrap: wrap;
          gap: 8px;
          font-size: 12px;
          color: ${C.textMuted};
        }

        .cp-job-pill {
          padding: 5px 12px;
          border-radius: 999px;
          background: rgba(4,98,65,0.08);
          color: ${C.green};
          font-weight: 700;
          font-size: 11px;
        }

        .cp-pill-remote { background: rgba(4,98,65,0.14); color: #045a3c; }
        .cp-pill-hybrid { background: rgba(232,160,32,0.16); color: #a36a00; }
        .cp-pill-onsite { background: rgba(34,86,208,0.14); color: #1c4aa8; }
        .cp-pill-contract { background: rgba(26,46,30,0.10); color: rgba(26,46,30,0.75); }
        .cp-pill-parttime { background: rgba(255,179,71,0.16); color: #8a5a13; }
        .cp-pill-fulltime { background: rgba(4,98,65,0.20); color: #045a3c; }
        .cp-pill-dept { background: rgba(232,160,32,0.12); color: #8a5b00; }

        .cp-job-posted {
          font-size: 12px;
          color: ${C.textLight};
        }

        .cp-job-cta {
          font-size: 12.5px;
          font-weight: 600;
          color: ${C.green};
          opacity: 0;
          transform: translateY(4px);
          transition: opacity 0.25s ease, transform 0.25s ease;
        }

        .cp-job-card:hover .cp-job-cta {
          opacity: 1;
          transform: translateY(0);
        }

        .cp-jobs-count {
          font-size: 12.5px;
          color: ${C.textLight};
          text-align: right;
        }

        .cp-jobs-section {
          position: relative;
          background: #fdfefe;
        }

        .cp-jobs-section::before {
          content: "";
          position: absolute;
          inset: 0;
          pointer-events: none;
          background-image: radial-gradient(rgba(26,46,30,0.04) 1px, transparent 1px);
          background-size: 22px 22px;
          opacity: 0.5;
        }

        @media (max-width: 1024px) {
          .cp-hero-grid     { grid-template-columns: 1fr !important; gap: 28px !important; }
          .cp-values-grid   { grid-template-columns: repeat(2,1fr) !important; }
          .cp-culture-inner { grid-template-columns: 1fr !important; gap: 36px !important; }
          .cp-traits-inner  { grid-template-columns: 1fr !important; gap: 22px !important; }
          .cp-job-filters   { grid-template-columns: repeat(2, minmax(0, 1fr)) !important; }
          .cp-jobs-grid     { grid-template-columns: repeat(2, minmax(0, 1fr)) !important; }
        }
        @media (max-width: 640px) {
          .cp-jobs-toolbar { padding: 14px !important; gap: 10px !important; }
          .cp-job-search {
            border-radius: 14px !important;
            padding: 10px 12px !important;
          }
          .cp-values-grid  { grid-template-columns: 1fr !important; }
          .cp-benefits-grid{ grid-template-columns: 1fr !important; }
          .cp-collage      { grid-template-rows: 200px 150px 150px !important; grid-template-columns: 1fr !important; }
          .cp-collage-main { grid-column: 1 !important; grid-row: 1 !important; }
          .cp-collage-a    { grid-column: 1 !important; grid-row: 2 !important; }
          .cp-collage-b    { grid-column: 1 !important; grid-row: 3 !important; }
          .cp-job-filters  { grid-template-columns: 1fr !important; }
          .cp-jobs-grid    { grid-template-columns: 1fr !important; }
        }
      `}</style>

      {/* ── HERO ─────────────────────────────────────────────────────────── */}
      <section
        style={{
          position: "relative",
          background: C.darkDeep,
          overflow: "hidden",
          padding:
            "clamp(100px, 12vw, 160px) clamp(24px, 6vw, 80px) clamp(72px, 9vw, 110px)",
        }}
      >
        {/* Grid texture */}
        <div
          style={{
            position: "absolute",
            inset: 0,
            pointerEvents: "none",
            backgroundImage: `linear-gradient(rgba(255,255,255,0.025) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.025) 1px, transparent 1px)`,
            backgroundSize: "72px 72px",
          }}
        />
        {/* Amber glow */}
        <div
          style={{
            position: "absolute",
            top: "-20%",
            right: "-8%",
            width: 560,
            height: 560,
            borderRadius: "50%",
            background:
              "radial-gradient(circle, rgba(232,160,32,0.10) 0%, transparent 70%)",
            pointerEvents: "none",
          }}
        />
        {/* Green glow */}
        <div
          style={{
            position: "absolute",
            bottom: "-10%",
            left: "-5%",
            width: 400,
            height: 400,
            borderRadius: "50%",
            background:
              "radial-gradient(circle, rgba(4,98,65,0.12) 0%, transparent 70%)",
            pointerEvents: "none",
          }}
        />

        <div
          ref={heroRef}
          className="cp-hero-grid"
          style={{
            maxWidth: 1160,
            margin: "0 auto",
            position: "relative",
            zIndex: 1,
            display: "grid",
            gridTemplateColumns: "1fr 1fr",
            gap: 60,
            alignItems: "end",
          }}
        >
          {/* Left */}
          <div>
            <motion.div
              initial={{ opacity: 0, y: 14 }}
              animate={heroInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.5 }}
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: 8,
                fontSize: 10.5,
                fontWeight: 700,
                letterSpacing: "0.16em",
                textTransform: "uppercase",
                color: "rgba(255,255,255,0.30)",
                marginBottom: 22,
              }}
            >
              <span
                style={{
                  display: "inline-block",
                  width: 20,
                  height: 1,
                  background: "rgba(232,160,32,0.65)",
                  borderRadius: 2,
                }}
              />
              Join Our Team
              <span
                style={{
                  display: "inline-block",
                  width: 20,
                  height: 1,
                  background: "rgba(232,160,32,0.65)",
                  borderRadius: 2,
                }}
              />
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 28 }}
              animate={heroInView ? { opacity: 1, y: 0 } : {}}
              transition={{
                duration: 0.7,
                delay: 0.08,
                ease: [0.22, 1, 0.36, 1],
              }}
              style={{
                fontFamily: "'Manrope', sans-serif",
                fontSize: "clamp(2.4rem, 5vw, 4.2rem)",
                fontWeight: 800,
                lineHeight: 1.06,
                letterSpacing: "-0.03em",
                color: "#fff",
                margin: "0 0 32px",
              }}
            >
              Build Your Career
              <br />
              at{" "}
              <span style={{ fontStyle: "italic", color: C.amber }}>
                Lifewood.
              </span>
            </motion.h1>

            <motion.div
              initial={{ opacity: 0, y: 12 }}
              animate={heroInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.5, delay: 0.28 }}
            >
              <ApplyButton large />
            </motion.div>
          </div>

          {/* Right */}
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={heroInView ? { opacity: 1, y: 0 } : {}}
            transition={{
              duration: 0.7,
              delay: 0.18,
              ease: [0.22, 1, 0.36, 1],
            }}
            style={{
              display: "flex",
              flexDirection: "column",
              gap: 24,
              paddingBottom: 4,
            }}
          >
            <p
              style={{
                fontFamily: "'Manrope', sans-serif",
                fontSize: 15,
                lineHeight: 1.78,
                color: "rgba(255,255,255,0.50)",
                margin: 0,
              }}
            >
              Join a global team of over 56,000 specialists powering the world's
              leading AI data pipelines. At Lifewood, every role contributes to
              meaningful, real-world impact across 30+ countries.
            </p>

            {/* Inline quote */}
            <div style={{ display: "flex", gap: 16, alignItems: "flex-start" }}>
              <div
                style={{
                  width: 3,
                  minHeight: 44,
                  background: C.amber,
                  borderRadius: 2,
                  flexShrink: 0,
                  marginTop: 3,
                }}
              />
              <p
                style={{
                  fontFamily: "'Manrope', sans-serif",
                  margin: 0,
                  fontSize: 14.5,
                  fontStyle: "italic",
                  fontWeight: 600,
                  lineHeight: 1.65,
                  color: "rgba(255,255,255,0.65)",
                }}
              >
                "Excellence is built every day through integrity, discipline,
                and teamwork."
              </p>
            </div>

            {/* Quick highlights
            <div style={{ display: "flex", gap: 20 }}>
              {[
                { val: "30+",  lbl: "Countries" },
                { val: "56K+", lbl: "Specialists" },
                { val: "20+",  lbl: "Years" },
              ].map((s, i) => (
                <div key={s.lbl} style={{ borderLeft: `2px solid ${i % 2 === 0 ? C.amber : "rgba(4,98,65,0.70)"}`, paddingLeft: 14 }}>
                  <div style={{ fontSize: 20, fontWeight: 900, color: "#fff", letterSpacing: "-0.03em", lineHeight: 1 }}>{s.val}</div>
                  <div style={{ fontSize: 11, color: "rgba(255,255,255,0.38)", fontWeight: 500, marginTop: 3 }}>{s.lbl}</div>
                </div>
              ))}
            </div> */}
          </motion.div>
        </div>
      </section>

      {/* ── OUR VALUES ───────────────────────────────────────────────────── */}
      <section
        style={{
          maxWidth: 1160,
          margin: "0 auto",
          padding: "72px clamp(24px, 6vw, 80px) 80px",
        }}
      >
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          style={{ marginBottom: 40 }}
        >
          <div
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: 7,
              fontSize: 10,
              fontWeight: 700,
              letterSpacing: "0.13em",
              textTransform: "uppercase",
              color: C.amber,
              marginBottom: 12,
            }}
          >
            <span
              style={{
                display: "inline-block",
                width: 20,
                height: 1.5,
                background: C.amber,
                borderRadius: 2,
              }}
            />
            What Drives Us
          </div>
          <h2
            style={{
              fontFamily: "'Manrope', sans-serif",
              margin: 0,
              fontSize: "clamp(24px, 3.5vw, 40px)",
              fontWeight: 800,
              lineHeight: 1.1,
              color: C.dark,
              letterSpacing: "-0.025em",
            }}
          >
            Our core{" "}
            <span style={{ color: C.green, fontStyle: "italic" }}>values.</span>
          </h2>
        </motion.div>

        <div
          className="cp-values-grid"
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(4,1fr)",
            gap: 14,
          }}
        >
          {values.map((v, i) => (
            <ValueCard key={v.title} card={v} i={i} />
          ))}
        </div>
      </section>

      {/* ── CULTURE ──────────────────────────────────────────────────────── */}
      <section
        style={{
          background: C.darkDeep,
          position: "relative",
          overflow: "hidden",
        }}
      >
        {/* Grid texture */}
        <div
          style={{
            position: "absolute",
            inset: 0,
            pointerEvents: "none",
            backgroundImage: `linear-gradient(rgba(255,255,255,0.018) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.018) 1px, transparent 1px)`,
            backgroundSize: "64px 64px",
          }}
        />

        <div
          className="cp-culture-inner"
          style={{
            maxWidth: 1160,
            margin: "0 auto",
            padding: "72px clamp(24px, 6vw, 80px) 80px",
            position: "relative",
            zIndex: 1,
            display: "grid",
            gridTemplateColumns: "1fr 1fr",
            gap: 72,
            alignItems: "center",
          }}
        >
          {/* Left copy */}
          <motion.div
            initial={{ opacity: 0, x: -28 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-60px" }}
            transition={{ duration: 0.65, ease: [0.22, 1, 0.36, 1] }}
          >
            <div
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: 7,
                fontSize: 10,
                fontWeight: 700,
                letterSpacing: "0.13em",
                textTransform: "uppercase",
                color: "rgba(232,160,32,0.75)",
                marginBottom: 16,
              }}
            >
              <span
                style={{
                  display: "inline-block",
                  width: 18,
                  height: 1.5,
                  background: "rgba(232,160,32,0.65)",
                  borderRadius: 2,
                }}
              />
              Life at Lifewood
            </div>

            <h2
              style={{
                fontFamily: "'Manrope', sans-serif",
                fontSize: "clamp(22px, 3vw, 38px)",
                fontWeight: 800,
                letterSpacing: "-0.025em",
                lineHeight: 1.08,
                color: "#fff",
                margin: "0 0 14px",
              }}
            >
              A culture of{" "}
              <span style={{ fontStyle: "italic", color: C.amber }}>
                growth & belonging.
              </span>
            </h2>

            <p
              style={{
                fontFamily: "'Manrope', sans-serif",
                fontSize: 14.5,
                lineHeight: 1.78,
                color: "rgba(255,255,255,0.46)",
                margin: "0 0 32px",
              }}
            >
              We believe great work comes from great people supported by great
              environments. Lifewood fosters a workplace where ambition thrives,
              diverse perspectives are celebrated, and every team member is
              empowered to grow.
            </p>

            <div
              className="cp-benefits-grid"
              style={{
                display: "grid",
                gridTemplateColumns: "1fr 1fr",
                gap: 10,
                marginBottom: 36,
              }}
            >
              {benefits.map((b, i) => (
                <motion.div
                  key={b}
                  className="cp-benefit"
                  initial={{ opacity: 0, x: -10 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{
                    duration: 0.4,
                    delay: i * 0.055,
                    ease: [0.22, 1, 0.36, 1],
                  }}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: 10,
                    padding: "11px 14px",
                    borderRadius: 12,
                    background: "rgba(255,255,255,0.04)",
                    border: "1px solid rgba(255,255,255,0.07)",
                    fontFamily: "'Manrope', sans-serif",
                    fontSize: 13,
                    fontWeight: 600,
                    color: "rgba(255,255,255,0.78)",
                    transition: "border-color 0.2s",
                  }}
                >
                  <span
                    style={{
                      width: 6,
                      height: 6,
                      borderRadius: "50%",
                      background: C.amber,
                      flexShrink: 0,
                    }}
                  />
                  {b}
                </motion.div>
              ))}
            </div>

            {/* <ApplyButton dark /> */}
          </motion.div>

          {/* Right — collage */}
          <motion.div
            className="cp-collage"
            initial={{ opacity: 0, x: 28 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-60px" }}
            transition={{
              duration: 0.65,
              delay: 0.1,
              ease: [0.22, 1, 0.36, 1],
            }}
            style={{
              display: "grid",
              gridTemplateColumns: "1fr 1fr",
              gridTemplateRows: "220px 180px",
              gap: 10,
            }}
          >
            <div
              className="cp-collage-main"
              style={{
                gridColumn: 1,
                gridRow: "1 / 3",
                borderRadius: 18,
                overflow: "hidden",
                border: "1px solid rgba(255,255,255,0.06)",
              }}
            >
              <img
                src="https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?auto=format&fit=crop&w=1400&q=80"
                alt="Team collaborating"
                loading="lazy"
              />
            </div>
            <div
              className="cp-collage-a"
              style={{
                gridColumn: 2,
                gridRow: 1,
                borderRadius: 18,
                overflow: "hidden",
                border: "1px solid rgba(255,255,255,0.06)",
              }}
            >
              <img
                src="https://images.unsplash.com/photo-1517048676732-d65bc937f952?auto=format&fit=crop&w=1400&q=80"
                alt="Team meeting"
                loading="lazy"
              />
            </div>
            <div
              className="cp-collage-b"
              style={{
                gridColumn: 2,
                gridRow: 2,
                borderRadius: 18,
                overflow: "hidden",
                border: "1px solid rgba(255,255,255,0.06)",
              }}
            >
              <img
                src="https://images.unsplash.com/photo-1552664730-d307ca884978?auto=format&fit=crop&w=1400&q=80"
                alt="Business discussion"
                loading="lazy"
              />
            </div>
          </motion.div>
        </div>
      </section>

      {/* ── QUALITIES LABEL + WAVING TRAITS MARQUEE ───────────────────────── */}
      <section
        style={{
          background: "rgba(26,46,30,0.04)",
          borderTop: `1px solid ${C.border}`,
          borderBottom: `1px solid ${C.border}`,
          overflow: "hidden",
        }}
      >
        <style>{`
    @import url('https://fonts.googleapis.com/css2?family=Manrope:wght@600;700;800&display=swap');

    @keyframes marqueeMove {
      0% { transform: translateX(0); }
      100% { transform: translateX(-50%); }
    }

    @keyframes waveFloat {
      0%   { transform: translateY(0px); }
      50%  { transform: translateY(-10px); }
      100% { transform: translateY(0px); }
    }

    .qualities-label {
      font-family: 'Manrope', sans-serif;
      font-weight: 800;
      font-size: clamp(1.4rem, 2.5vw, 2rem);
      letter-spacing: -0.03em;
      text-align: center;
      margin-bottom: 48px;
    }

    .marquee-wrapper {
      display: flex;
      width: max-content;
      animation: marqueeMove 22s linear infinite;
    }

    .wave-trait {
      font-family: 'Manrope', sans-serif;
      font-weight: 700;
      font-size: clamp(1.1rem, 1.6vw, 1.4rem);
      letter-spacing: -0.02em;
      margin-right: 90px;
      white-space: nowrap;
      display: inline-block;
      animation: waveFloat 2.4s ease-in-out infinite;
    }

    .wave-trait:nth-child(odd) {
      animation-delay: 0.2s;
    }

    .wave-trait:nth-child(even) {
      animation-delay: 0.5s;
    }
  `}</style>

        <div style={{ padding: "70px 0" }}>
          {/* LABEL (STATIC) */}
          <div className="qualities-label" style={{ color: C.dark }}>
            The qualities we value most.
          </div>

          {/* WAVING TRAITS */}
          <div className="marquee-wrapper">
            {[
              "Optimistic",
              "Accountable",
              "Collaborative",
              "Disciplined",
              "Innovative",
              "Reliable",
              "Proactive",
              "Purpose-Driven",
              "Committed",
              "Growth-Minded",
            ]
              .concat([
                "Optimistic",
                "Accountable",
                "Collaborative",
                "Disciplined",
                "Innovative",
                "Reliable",
                "Proactive",
                "Purpose-Driven",
                "Committed",
                "Growth-Minded",
              ])
              .map((trait, i) => (
                <div key={i} className="wave-trait" style={{ color: C.green }}>
                  {trait}
                </div>
              ))}
          </div>
        </div>
      </section>

      {/* ── JOB OPENINGS ───────────────────────────────────────── */}
      <section
        id="job-openings"
        className="cp-jobs-section"
        style={{
          width: "100%",
          padding: "88px clamp(20px,6vw,80px) 96px",
        }}
      >
        <div className="cp-jobs-shell">
          <div className="cp-jobs-header">
            <h2 className="cp-jobs-title">Job Openings</h2>
            <div
              className="cp-jobs-divider"
              style={{
                width: "100%",
                height: 1,
                background: "linear-gradient(90deg, rgba(4,98,65,0.25), rgba(4,98,65,0.04))",
              }}
            />
          </div>

          <div className="cp-jobs-toolbar">
            <div className="cp-job-search">
              <svg
                className="cp-search-icon"
                viewBox="0 0 24 24"
                fill="none"
                aria-hidden="true"
              >
                <circle cx="11" cy="11" r="7" stroke="currentColor" strokeWidth="2" />
                <path d="M16.5 16.5L21 21" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
              </svg>
              <input
                type="text"
                placeholder="Search jobs..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>
            <div className="cp-job-filters">
              <select
                className="cp-job-filter"
                value={workplace}
                onChange={(e) => setWorkplace(e.target.value)}
              >
                <option value="">Workplace type</option>
                {workplaceOptions.map((opt) => (
                  <option key={opt} value={opt}>{opt}</option>
                ))}
              </select>
              <select
                className="cp-job-filter"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
              >
                <option value="">Location</option>
                {locationOptions.map((opt) => (
                  <option key={opt} value={opt}>{opt}</option>
                ))}
              </select>
              <select
                className="cp-job-filter"
                value={department}
                onChange={(e) => setDepartment(e.target.value)}
              >
                <option value="">Department</option>
                {departmentOptions.map((opt) => (
                  <option key={opt} value={opt}>{opt}</option>
                ))}
              </select>
              <select
                className="cp-job-filter"
                value={workType}
                onChange={(e) => setWorkType(e.target.value)}
              >
                <option value="">Work type</option>
                {workTypeOptions.map((opt) => (
                  <option key={opt} value={opt}>{opt}</option>
                ))}
              </select>
            </div>
          </div>

          <div className="cp-jobs-count">
            Showing {pagedJobs.length} of {filteredJobs.length} roles
          </div>
          {isLoadingJobs ? (
            <div className="cp-jobs-status">Loading job listings...</div>
          ) : jobsError ? (
            <div className="cp-jobs-status">{jobsError}</div>
          ) : null}

          <div className="cp-jobs-grid">
            {pagedJobs.map((job, index) => (
              <motion.article
                key={job.id || job.slug || job.title}
                className="admin-card-clickable admin-listing-card cp-admin-card"
                initial={{ opacity: 0, y: 14 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-40px" }}
                transition={{ duration: 0.45, delay: index * 0.08, ease: [0.22, 1, 0.36, 1] }}
                role="button"
                tabIndex={0}
                onClick={() => navigate(`/careers/${job.slug}`)}
                onKeyDown={(event) => {
                  if (event.key === "Enter" || event.key === " ") {
                    event.preventDefault();
                    navigate(`/careers/${job.slug}`);
                  }
                }}
              >
                <div className="admin-listing-head">
                  <h3 className="admin-listing-title">{job.title}</h3>
                  <span className={`status ${job.status.toLowerCase()}`}>
                    {job.status}
                  </span>
                </div>
                <div className="admin-listing-tags">
                  <span className="admin-listing-pill location">
                    <IconMapPin size={14} />
                    {job.location || "Location"}
                  </span>
                  <span className="admin-listing-pill department">
                    <IconBriefcase size={14} />
                    {job.department || "Department"}
                  </span>
                  <span className="admin-listing-pill type">
                    <IconClock size={14} />
                    {job.workType || "Work type"}
                  </span>
                </div>
                {job.description ? (
                  <p className="admin-listing-desc">{stripHtml(job.description)}</p>
                ) : null}
                <div className="admin-listing-footer cp-admin-footer">
                  <div className="admin-listing-metric">
                    <strong>{formatDateShort(job.createdAt)}</strong>
                    <span>Date Posted</span>
                  </div>
                  <button
                    type="button"
                    className="admin-listing-cta"
                    aria-label="View job details"
                    onClick={(event) => {
                      event.stopPropagation();
                      navigate(`/careers/${job.slug}`);
                    }}
                  >
                    <IconChevronRight size={20} />
                  </button>
                </div>
              </motion.article>
            ))}
          </div>

          {totalPages > 1 ? (
            <div className="cp-pagination">
              <button
                type="button"
                className="cp-page-btn"
                onClick={() => setPage((prev) => Math.max(1, prev - 1))}
                disabled={page === 1}
              >
                Prev
              </button>
              {Array.from({ length: totalPages }, (_, idx) => (
                <button
                  key={`page-${idx + 1}`}
                  type="button"
                  className={`cp-page-btn ${page === idx + 1 ? "is-active" : ""}`}
                  onClick={() => setPage(idx + 1)}
                >
                  {idx + 1}
                </button>
              ))}
              <button
                type="button"
                className="cp-page-btn"
                onClick={() => setPage((prev) => Math.min(totalPages, prev + 1))}
                disabled={page === totalPages}
              >
                Next
              </button>
            </div>
          ) : null}
        </div>
      </section>
    </main>
  );
};

export default CareersPage;
