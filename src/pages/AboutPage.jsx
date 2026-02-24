import { useState, useRef } from "react";
import { motion, useInView, useScroll, useTransform } from "framer-motion";
import { AnimatePresence } from "framer-motion";
// ── Data ──────────────────────────────────────────────────────────────────────

const coreValues = [
  {
    index: "01",
    title: "Diversity",
    text: "Lifewood thrives on the richness of different backgrounds, beliefs, and worldviews. Diverse perspectives aren't just welcomed — they are the engine behind every breakthrough we achieve together.",
    accent: "#F5A623",
  },
  {
    index: "02",
    title: "Caring",
    text: "Every individual within our ecosystem matters. We invest in people with genuine commitment because meaningful work is only possible when people feel genuinely valued.",
    accent: "#046241",
  },
  {
    index: "03",
    title: "Innovation",
    text: "We treat curiosity as infrastructure. By embedding innovation into our daily practice, we continuously raise the ceiling on what AI data solutions can accomplish.",
    accent: "#F5A623",
  },
  {
    index: "04",
    title: "Integrity",
    text: "Ethical conduct and sustainability aren't compliance checkboxes for us — they are foundational to why Lifewood exists and how we operate at every level of the business.",
    accent: "#046241",
  },
];

const tabs = {
  mission: {
    label: "Mission",
    eyebrow: "Why We Exist",
    title: "Turning AI Potential Into Real-World Progress",
    text: "Lifewood exists to build the data infrastructure that gives AI genuine purpose...",
    stat: { value: "56K+", label: "Global Specialists" },
    video:
      "https://www.pexels.com/download/video/5439017/", // teamwork / collaboration
  },
  vision: {
    label: "Vision",
    eyebrow: "Where We're Headed",
    title: "The World's Most Trusted AI Data Partner",
    text: "We are building toward a future where Lifewood is synonymous with trustworthy, inclusive AI data...",
    stat: { value: "30+", label: "Nations Served" },
    video:
      "https://www.pexels.com/download/video/7844951/", // city / global scale
  },
};

const identityPillars = [
  {
    index: "01",
    label: "The Bridge",
    headline: "Connecting East & West",
    body: "Headquartered in Malaysia, Lifewood is uniquely positioned as a super-bridge linking China, ASEAN, and the wider world. We translate not just language, but culture, context, and commercial intent — enabling trust across borders that others struggle to cross.",
    accent: "#F5A623",
    icon: "⟷",
  },
  {
    index: "02",
    label: "The People",
    headline: "Diversity as Infrastructure",
    body: "From Bangladesh to Singapore, our workforce reflects the world we serve. Our Pottya team in Bangladesh actively employs women and people with disabilities — not as a metric, but as a mission. Inclusion is how we build better data, and better companies.",
    accent: "#046241",
    icon: "◎",
  },
  {
    index: "03",
    label: "The Scale",
    headline: "Speed Without Compromise",
    body: "We deliver high-volume, multilingual data projects for some of the world's largest organizations — at a pace that others can't match. Our 40+ global delivery centers operate 24/7, turning ambitious AI timelines into reliable production schedules.",
    accent: "#F5A623",
    icon: "↗",
  },
  {
    index: "04",
    label: "The Responsibility",
    headline: "ESG Runs Through Everything",
    body: "Environmental, Social, and Governance principles aren't a section in our annual report — they shape our HR policies, our partnerships, and how we expand into new markets. We measure success by the communities we strengthen, not just the contracts we close.",
    accent: "#046241",
    icon: "✦",
  },
];

// ── Sub-components ─────────────────────────────────────────────────────────────

const ValueCard = ({ value, index: i }) => {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-60px" });
  const [hovered, setHovered] = useState(false);

  return (
    <motion.article
      ref={ref}
      initial={{ opacity: 0, x: i % 2 === 0 ? -40 : 40 }}
      animate={inView ? { opacity: 1, x: 0 } : {}}
      transition={{ duration: 0.6, delay: i * 0.1, ease: [0.22, 1, 0.36, 1] }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        position: "relative",
        padding: "40px 36px",
        borderRadius: 20,
        background: hovered ? "#0a1a0e" : "#fff",
        border: `1px solid ${hovered ? value.accent : "rgba(10,26,14,0.09)"}`,
        overflow: "hidden",
        cursor: "default",
        transition: "background 0.35s ease, border-color 0.35s ease",
      }}
    >
      <div
        style={{
          position: "absolute",
          top: -10,
          right: 20,
          fontSize: 120,
          fontWeight: 900,
          lineHeight: 1,
          color: hovered ? "rgba(255,255,255,0.04)" : "rgba(10,26,14,0.04)",
          fontFamily: "'Manrope', sans-serif",
          pointerEvents: "none",
          userSelect: "none",
          transition: "color 0.35s ease",
        }}
      >
        {value.index}
      </div>
      <motion.div
        animate={{ width: hovered ? "100%" : "36px" }}
        transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
        style={{
          height: 3,
          background: value.accent,
          borderRadius: 2,
          marginBottom: 28,
        }}
      />
      <h3
        style={{
          margin: "0 0 14px",
          fontFamily: "'Manrope', sans-serif",
          fontSize: "clamp(20px, 2vw, 26px)",
          fontWeight: 800,
          color: hovered ? "#fff" : "#0a1a0e",
          letterSpacing: "-0.02em",
          transition: "color 0.3s ease",
        }}
      >
        {value.title}
      </h3>
      <p
        style={{
          margin: 0,
          fontFamily: "'Manrope', sans-serif",
          fontSize: 15,
          lineHeight: 1.78,
          color: hovered ? "rgba(255,255,255,0.65)" : "rgba(10,26,14,0.58)",
          transition: "color 0.3s ease",
        }}
      >
        {value.text}
      </p>
    </motion.article>
  );
};

const PillarCard = ({ pillar, i }) => {
  const cardRef = useRef(null);
  const cardInView = useInView(cardRef, { once: true, margin: "-40px" });
  const [hovered, setHovered] = useState(false);

  return (
    <motion.div
      ref={cardRef}
      initial={{ opacity: 0, x: i % 2 === 0 ? -32 : 32 }}
      animate={cardInView ? { opacity: 1, x: 0 } : {}}
      transition={{ duration: 0.55, delay: i * 0.09, ease: [0.22, 1, 0.36, 1] }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      className="pillar-card"
      style={{
        display: "grid",
        gridTemplateColumns: "80px 1fr",
        gap: 32,
        padding: "36px 40px",
        borderRadius: 20,
        background: hovered ? "#0a1a0e" : "#fafaf8",
        border: `1px solid ${hovered ? pillar.accent : "rgba(10,26,14,0.08)"}`,
        transition: "background 0.35s ease, border-color 0.35s ease",
        cursor: "default",
        alignItems: "center",
      }}
    >
      <div style={{ textAlign: "center" }}>
        <div
          style={{
            width: 56,
            height: 56,
            borderRadius: 16,
            background: hovered ? pillar.accent : `${pillar.accent}14`,
            border: `1px solid ${pillar.accent}33`,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontSize: 22,
            marginBottom: 10,
            transition: "background 0.3s ease",
            color: hovered ? "#fff" : pillar.accent,
          }}
        >
          {pillar.icon}
        </div>
        <div
          style={{
            fontFamily: "'Manrope', sans-serif",
            fontSize: 10,
            fontWeight: 800,
            letterSpacing: "0.12em",
            color: hovered ? "rgba(255,255,255,0.3)" : "rgba(10,26,14,0.25)",
            transition: "color 0.3s",
          }}
        >
          {pillar.index}
        </div>
      </div>
      <div>
        <div
          style={{
            fontFamily: "'Manrope', sans-serif",
            fontSize: 10,
            fontWeight: 800,
            letterSpacing: "0.18em",
            textTransform: "uppercase",
            color: hovered ? pillar.accent : `${pillar.accent}99`,
            marginBottom: 10,
            transition: "color 0.3s",
          }}
        >
          {pillar.label}
        </div>
        <h3
          style={{
            margin: "0 0 12px",
            fontFamily: "'Manrope', sans-serif",
            fontSize: "clamp(17px, 1.8vw, 22px)",
            fontWeight: 800,
            lineHeight: 1.2,
            color: hovered ? "#fff" : "#0a1a0e",
            letterSpacing: "-0.02em",
            transition: "color 0.3s",
          }}
        >
          {pillar.headline}
        </h3>
        <p
          style={{
            margin: 0,
            fontFamily: "'Manrope', sans-serif",
            fontSize: 15,
            lineHeight: 1.78,
            color: hovered ? "rgba(255,255,255,0.6)" : "rgba(10,26,14,0.56)",
            transition: "color 0.3s",
          }}
        >
          {pillar.body}
        </p>
      </div>
    </motion.div>
  );
};

const MissionVision = () => {
  const [active, setActive] = useState("mission");
  const tab = tabs[active];
  const ref = useRef(null);

  return (
    <section
      ref={ref}
      style={{
        background: "#0a1a0e",
        padding: "clamp(48px, 6vw, 80px) clamp(24px, 6vw, 80px)",
        position: "relative",
        overflow: "hidden",
      }}
    >
      <div
        style={{
          position: "absolute",
          inset: 0,
          pointerEvents: "none",
          backgroundImage: `linear-gradient(rgba(255,255,255,0.025) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.025) 1px, transparent 1px)`,
          backgroundSize: "80px 80px",
        }}
      />
      <div
        style={{
          position: "absolute",
          top: "-20%",
          right: "-10%",
          width: 600,
          height: 600,
          borderRadius: "50%",
          background:
            "radial-gradient(circle, rgba(4,98,65,0.18) 0%, transparent 70%)",
          pointerEvents: "none",
        }}
      />

      <div
        style={{
          maxWidth: 1280,
          margin: "0 auto",
          position: "relative",
          zIndex: 1,
        }}
      >
        <div
          className="mv-grid"
          style={{
            display: "grid",
            gridTemplateColumns: "1fr 1fr",
            gap: "clamp(40px, 6vw, 96px)",
            alignItems: "center",
          }}
        >
          <div>
            <div
              style={{
                display: "inline-flex",
                background: "rgba(255,255,255,0.05)",
                border: "1px solid rgba(255,255,255,0.1)",
                borderRadius: 100,
                padding: 4,
                marginBottom: 40,
              }}
            >
              {Object.values(tabs).map((t) => (
                <button
                  key={t.label}
                  type="button"
                  onClick={() => setActive(t.label.toLowerCase())}
                  style={{
                    padding: "8px 24px",
                    borderRadius: 100,
                    border: "none",
                    cursor: "pointer",
                    fontSize: 13,
                    fontWeight: 700,
                    letterSpacing: "0.04em",
                    fontFamily: "'Manrope', sans-serif",
                    background:
                      active === t.label.toLowerCase()
                        ? "#046241"
                        : "transparent",
                    color:
                      active === t.label.toLowerCase()
                        ? "#fff"
                        : "rgba(255,255,255,0.45)",
                    transition: "all 0.25s ease",
                  }}
                >
                  {t.label}
                </button>
              ))}
            </div>

            <motion.div
              key={active}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
            >
              <p
                style={{
                  fontFamily: "'Manrope', sans-serif",
                  fontSize: 11,
                  fontWeight: 700,
                  letterSpacing: "0.18em",
                  textTransform: "uppercase",
                  color: "#F5A623",
                  marginBottom: 16,
                }}
              >
                {tab.eyebrow}
              </p>
              <h2
                style={{
                  margin: "0 0 24px",
                  fontFamily: "'Manrope', sans-serif",
                  fontSize: "clamp(26px, 3vw, 40px)",
                  fontWeight: 800,
                  lineHeight: 1.15,
                  color: "#fff",
                  letterSpacing: "-0.03em",
                }}
              >
                {tab.title}
              </h2>
              <p
                style={{
                  margin: "0 0 36px",
                  fontFamily: "'Manrope', sans-serif",
                  fontSize: 16,
                  lineHeight: 1.8,
                  color: "rgba(255,255,255,0.58)",
                }}
              >
                {tab.text}
              </p>
              <div
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: 12,
                  background: "rgba(245,166,35,0.08)",
                  border: "1px solid rgba(245,166,35,0.2)",
                  borderRadius: 100,
                  padding: "12px 20px",
                }}
              >
                <span
                  style={{
                    fontFamily: "'Manrope', sans-serif",
                    fontSize: 26,
                    fontWeight: 900,
                    color: "#F5A623",
                    letterSpacing: "-0.03em",
                  }}
                >
                  {tab.stat.value}
                </span>
                <span
                  style={{
                    fontFamily: "'Manrope', sans-serif",
                    fontSize: 13,
                    color: "rgba(255,255,255,0.5)",
                    fontWeight: 500,
                  }}
                >
                  {tab.stat.label}
                </span>
              </div>
            </motion.div>
          </div>

          <motion.div
            key={active + "-video"}
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
            style={{
              position: "relative",
              borderRadius: 28,
              overflow: "hidden",
              aspectRatio: "4/5",
              boxShadow: "0 40px 80px rgba(0,0,0,0.5)",
            }}
          >
            <div
              style={{
                position: "absolute",
                top: 0,
                left: 0,
                width: 80,
                height: 80,
                zIndex: 2,
                pointerEvents: "none",
                background:
                  "linear-gradient(135deg, rgba(245,166,35,0.5), transparent)",
                borderRadius: "28px 0 80px 0",
              }}
            />
            <AnimatePresence mode="wait">
              <motion.video
                key={active}
                src={tab.video}
                autoPlay
                muted
                loop
                playsInline
                preload="metadata"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.6 }}
                style={{
                  width: "100%",
                  height: "100%",
                  objectFit: "cover",
                  animation: "slowZoom 20s ease-in-out infinite alternate",
                }}
              />
            </AnimatePresence>
            <div
              style={{
                position: "absolute",
                inset: 0,
                background: `
    linear-gradient(to top, rgba(10,26,14,0.75) 0%, rgba(10,26,14,0.3) 40%, transparent 70%),
    linear-gradient(to right, rgba(10,26,14,0.4) 0%, transparent 60%)
  `,
              }}
            />
          </motion.div>
        </div>
      </div>
    </section>
  );
};

const LifewoodIdentity = () => {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });

  return (
    <section
      ref={ref}
      style={{
        padding: "clamp(80px, 12vw, 140px) clamp(24px, 6vw, 80px)",
        background: "#fff",
        position: "relative",
        overflow: "hidden",
      }}
    >
      <div
        style={{
          position: "absolute",
          inset: 0,
          pointerEvents: "none",
          backgroundImage:
            "radial-gradient(rgba(4,98,65,0.035) 1px, transparent 1px)",
          backgroundSize: "32px 32px",
        }}
      />

      <div
        style={{
          maxWidth: 1280,
          margin: "0 auto",
          position: "relative",
          zIndex: 1,
        }}
      >
        <div
          className="split-grid"
          style={{
            display: "grid",
            gridTemplateColumns: "1fr 1fr",
            gap: 64,
            marginBottom: "clamp(56px, 8vw, 96px)",
            alignItems: "end",
          }}
        >
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6 }}
          >
            <div
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: 10,
                background: "rgba(245,166,35,0.08)",
                border: "1px solid rgba(245,166,35,0.2)",
                borderRadius: 100,
                padding: "6px 16px",
                marginBottom: 24,
              }}
            >
              <div
                style={{
                  width: 6,
                  height: 6,
                  borderRadius: "50%",
                  background: "#F5A623",
                }}
              />
              <span
                style={{
                  fontFamily: "'Manrope', sans-serif",
                  fontSize: 11,
                  fontWeight: 700,
                  letterSpacing: "0.16em",
                  color: "#F5A623",
                  textTransform: "uppercase",
                }}
              >
                Our Identity
              </span>
            </div>
            <h2
              style={{
                margin: 0,
                fontFamily: "'Manrope', sans-serif",
                fontSize: "clamp(30px, 4vw, 52px)",
                fontWeight: 900,
                lineHeight: 1.08,
                color: "#0a1a0e",
                letterSpacing: "-0.03em",
              }}
            >
              What Makes Lifewood{" "}
              <span style={{ color: "#046241" }}>Lifewood?</span>
            </h2>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.12 }}
          >
            <p
              style={{
                margin: "0 0 28px",
                fontFamily: "'Manrope', sans-serif",
                fontSize: 16,
                lineHeight: 1.82,
                color: "rgba(10,26,14,0.58)",
              }}
            >
              Lifewood is more than a data company. We process at scale, deliver
              at speed, and operate in dozens of languages for the world's
              largest organizations — but that's only the surface. Our identity
              runs deeper: we are a bridge between cultures, a champion of
              inclusion, and a force for sustainable progress in every market we
              enter.
            </p>
            <div
              style={{
                borderLeft: "3px solid #F5A623",
                paddingLeft: 20,
                fontFamily: "'Manrope', sans-serif",
                fontSize: 17,
                fontStyle: "italic",
                fontWeight: 600,
                color: "#0a1a0e",
                lineHeight: 1.65,
              }}
            >
              "A conduit to bring diverse people and interests together —
              fostering new ventures and possibilities."
            </div>
          </motion.div>
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
          {identityPillars.map((pillar, i) => (
            <PillarCard key={pillar.index} pillar={pillar} i={i} />
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={inView ? { opacity: 1 } : {}}
          transition={{ duration: 0.6, delay: 0.9 }}
          style={{ textAlign: "center", marginTop: 20 }}
        ></motion.div>
      </div>
    </section>
  );
};

const Marquee = () => {
  const items = Array(8).fill("Always Switch On, Never Off");
  return (
    <section
      style={{
        background: "#0a1a0e",
        overflow: "hidden",
        borderTop: "1px solid rgba(255,255,255,0.05)",
        borderBottom: "1px solid rgba(255,255,255,0.05)",
      }}
    >
      <style>{`
  @keyframes mq-left  { 
    0% { transform: translateX(0) }    
    100% { transform: translateX(-50%) } 
  }

  @keyframes mq-right { 
    0% { transform: translateX(-50%) }  
    100% { transform: translateX(0) } 
  }

  .mq-l { animation: mq-left  40s linear infinite; }
  .mq-r { animation: mq-right 45s linear infinite; }

  .mq-l:hover,
  .mq-r:hover { 
    animation-play-state: paused; 
  }
`}</style>
      <div style={{ overflow: "hidden", padding: "28px 0 0" }}>
        <div
          className="mq-l"
          style={{
            display: "flex",
            whiteSpace: "nowrap",
            width: "max-content",
          }}
        >
          {[...items, ...items].map((text, i) => (
            <span
              key={i}
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: 28,
                paddingRight: 40,
              }}
            >
              <span
                style={{
                  fontFamily: "'Manrope', sans-serif",
                  fontSize: "clamp(36px, 5vw, 68px)",
                  fontWeight: 900,
                  fontStyle: i % 2 === 0 ? "normal" : "italic",
                  color: i % 2 === 0 ? "#fff" : "transparent",
                  WebkitTextStroke:
                    i % 2 === 0 ? "none" : "1px rgba(255,255,255,0.25)",
                  letterSpacing: "-0.03em",
                  lineHeight: 1,
                }}
              >
                {text}
              </span>
              <span
                style={{
                  width: 8,
                  height: 8,
                  borderRadius: "50%",
                  background: "#F5A623",
                  display: "inline-block",
                  flexShrink: 0,
                }}
              />
            </span>
          ))}
        </div>
      </div>
      <div style={{ overflow: "hidden", padding: "0 0 28px" }}>
        <div
          className="mq-r"
          style={{
            display: "flex",
            whiteSpace: "nowrap",
            width: "max-content",
          }}
        >
          {[...items, ...items].map((text, i) => (
            <span
              key={i}
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: 28,
                paddingRight: 40,
              }}
            >
              <span
                style={{
                  fontFamily: "'Manrope', sans-serif",
                  fontSize: "clamp(11px, 1.3vw, 16px)",
                  fontWeight: 800,
                  letterSpacing: "0.22em",
                  textTransform: "uppercase",
                  color: i % 3 === 0 ? "#F5A623" : "rgba(255,255,255,0.18)",
                  lineHeight: 1,
                }}
              >
                {text}
              </span>
              <span
                style={{
                  width: 4,
                  height: 4,
                  borderRadius: "50%",
                  background: "rgba(245,166,35,0.35)",
                  display: "inline-block",
                  flexShrink: 0,
                }}
              />
            </span>
          ))}
        </div>
      </div>
    </section>
  );
};

// ── Main Page ──────────────────────────────────────────────────────────────────

const AboutPage = () => {
  const heroRef = useRef(null);
  const { scrollYProgress: heroScroll } = useScroll({
    target: heroRef,
    offset: ["start start", "end start"],
  });
  const heroImgY = useTransform(heroScroll, [0, 1], ["0%", "25%"]);
  const heroOpacity = useTransform(heroScroll, [0, 0.6], [1, 0]);

  const valuesRef = useRef(null);
  const valuesInView = useInView(valuesRef, { once: true, margin: "-60px" });

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Manrope:wght@400;500;600;700;800;900&display=swap');
        .about-page, .about-page * {
          font-family: 'Manrope', 'Segoe UI', sans-serif !important;
          box-sizing: border-box;
        }
        @media (max-width: 768px) {
          .mv-grid, .split-grid { grid-template-columns: 1fr !important; }
          .values-grid { grid-template-columns: 1fr !important; }
          .pillar-card { grid-template-columns: 1fr !important; }
        }
      `}</style>

      <main className="about-page">
        {/* ── Hero ── */}
        <section
          ref={heroRef}
          style={{
            position: "relative",
            height: "92vh",
            minHeight: 600,
            overflow: "hidden",
            display: "flex",
            alignItems: "flex-end",
          }}
        >
          <motion.div
            style={{ position: "absolute", inset: "-10% 0", y: heroImgY }}
          >
            <img
              src="https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&w=2200&q=80"
              alt="Lifewood's diverse global team collaborating on AI data solutions"
              style={{
                width: "100%",
                height: "100%",
                objectFit: "cover",
                display: "block",
              }}
            />
            <div
              style={{
                position: "absolute",
                inset: 0,
                background:
                  "linear-gradient(to top, rgba(10,26,14,0.94) 0%, rgba(10,26,14,0.45) 55%, rgba(10,26,14,0.12) 100%)",
              }}
            />
          </motion.div>

          <motion.div
            style={{
              opacity: heroOpacity,
              position: "relative",
              zIndex: 2,
              width: "100%",
            }}
          >
            <div
              style={{
                maxWidth: 1280,
                margin: "0 auto",
                padding: "clamp(40px, 8vw, 80px) clamp(24px, 6vw, 80px)",
              }}
            >
              <motion.p
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.1 }}
                style={{
                  fontFamily: "'Manrope', sans-serif",
                  fontSize: 11,
                  fontWeight: 700,
                  letterSpacing: "0.2em",
                  textTransform: "uppercase",
                  color: "#F5A623",
                  marginBottom: 20,
                }}
              >
                About Lifewood
              </motion.p>
              <motion.h1
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{
                  duration: 0.7,
                  delay: 0.2,
                  ease: [0.22, 1, 0.36, 1],
                }}
                style={{
                  margin: "0 0 28px",
                  fontFamily: "'Manrope', sans-serif",
                  fontSize: "clamp(40px, 6vw, 86px)",
                  fontWeight: 900,
                  lineHeight: 1.04,
                  letterSpacing: "-0.035em",
                  color: "#fff",
                  maxWidth: 820,
                }}
              >
                Built on Purpose.{" "}
                <span style={{ color: "#F5A623", fontStyle: "italic" }}>
                  Powered
                </span>{" "}
                by People.
              </motion.h1>
              <motion.p
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.35 }}
                style={{
                  margin: 0,
                  maxWidth: 560,
                  fontFamily: "'Manrope', sans-serif",
                  fontSize: "clamp(15px, 1.5vw, 18px)",
                  lineHeight: 1.75,
                  color: "rgba(255,255,255,0.65)",
                }}
              >
                At Lifewood, commercial ambition and human values coexist. We
                hold ourselves to a higher standard — one that shapes how we
                treat people, build technology, and engage with the world.
              </motion.p>
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 1, duration: 0.6 }}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 10,
                  marginTop: 48,
                  color: "rgba(255,255,255,0.35)",
                  fontFamily: "'Manrope', sans-serif",
                  fontSize: 12,
                  fontWeight: 600,
                  letterSpacing: "0.1em",
                  textTransform: "uppercase",
                }}
              >
                <motion.div
                  animate={{ y: [0, 6, 0] }}
                  transition={{
                    duration: 1.6,
                    repeat: Infinity,
                    ease: "easeInOut",
                  }}
                  style={{ fontSize: 18 }}
                >
                  ↓
                </motion.div>
                Scroll to explore
              </motion.div>
            </div>
          </motion.div>
        </section>

        {/* ── Core Values ── */}
        <section
          ref={valuesRef}
          style={{
            padding: "clamp(80px, 12vw, 140px) clamp(24px, 6vw, 80px)",
            background: "#fff",
          }}
        >
          <div style={{ maxWidth: 1280, margin: "0 auto" }}>
            <div
              className="split-grid"
              style={{
                display: "grid",
                gridTemplateColumns: "1fr 1fr",
                gap: 48,
                marginBottom: "clamp(48px, 7vw, 80px)",
                alignItems: "end",
              }}
            >
              <motion.div
                initial={{ opacity: 0, x: -30 }}
                animate={valuesInView ? { opacity: 1, x: 0 } : {}}
                transition={{ duration: 0.6 }}
              >
                <p
                  style={{
                    fontFamily: "'Manrope', sans-serif",
                    fontSize: 11,
                    fontWeight: 700,
                    letterSpacing: "0.18em",
                    textTransform: "uppercase",
                    color: "#F5A623",
                    marginBottom: 16,
                  }}
                >
                  Our Principles
                </p>
                <h2
                  style={{
                    margin: 0,
                    fontFamily: "'Manrope', sans-serif",
                    fontSize: "clamp(30px, 4vw, 52px)",
                    fontWeight: 900,
                    lineHeight: 1.08,
                    color: "#0a1a0e",
                    letterSpacing: "-0.03em",
                  }}
                >
                  The Values That{" "}
                  <span style={{ color: "#046241" }}>Drive Us</span>
                </h2>
              </motion.div>
              <motion.p
                initial={{ opacity: 0, x: 30 }}
                animate={valuesInView ? { opacity: 1, x: 0 } : {}}
                transition={{ duration: 0.6, delay: 0.1 }}
                style={{
                  margin: 0,
                  fontFamily: "'Manrope', sans-serif",
                  fontSize: 16,
                  lineHeight: 1.8,
                  color: "rgba(10,26,14,0.55)",
                  paddingBottom: 4,
                }}
              >
                Lifewood's culture is built on values that guide every decision
                — from how we hire and collaborate to how we serve clients and
                build the AI data ecosystem of the future.
              </motion.p>
            </div>
            <div
              className="values-grid"
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(2, 1fr)",
                gap: 20,
              }}
            >
              {coreValues.map((v, i) => (
                <ValueCard key={v.title} value={v} index={i} />
              ))}
            </div>
          </div>
        </section>

        {/* ── Mission / Vision ── */}
        <MissionVision />

        {/* ── What Makes Lifewood ── */}
        <LifewoodIdentity />

        {/* ── Marquee ── */}
        <Marquee />
      </main>
    </>
  );
};

export default AboutPage;
<style>{`
@keyframes slowZoom {
  0% { transform: scale(1); }
  100% { transform: scale(1.08); }
}
`}</style>;
