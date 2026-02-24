import { useRef, useState } from "react";
import { motion, useInView } from "framer-motion";

// ── Data ──────────────────────────────────────────────────────────────────────

const processPanels = [
  {
    index: "01",
    title: "Objective",
    icon: "◎",
    text: "Scan and preserve documents, then extract fields and structure them into usable database-ready records.",
  },
  {
    index: "02",
    title: "Key Features",
    icon: "✦",
    text: "Features include Auto Crop, Auto De-skew, Blur Detection, Foreign Object Detection, and AI Data Extraction.",
  },
  {
    index: "03",
    title: "Results",
    icon: "↗",
    text: "Validated outputs improve precision, scale quickly, support multiple languages and document formats, and provide structured data that is easier to consume in downstream AI systems.",
  },
];

const featureItems = [
  { label: "Document Capture & Preservation", sub: "Multi-format scanning at scale", dot: "amber" },
  { label: "Data Extraction & Cleaning", sub: "AI-powered field extraction pipelines", dot: "green" },
  { label: "Labeling & Annotation", sub: "Multi-language dataset preparation", dot: "amber" },
  { label: "Quality Assurance & Formatting", sub: "Validated, database-ready outputs", dot: "green" },
];

// ── Color tokens ──────────────────────────────────────────────────────────────
const C = {
  bg: "#f9f9f7",
  white: "#ffffff",
  dark: "#1a2e1e",
  green: "#046241",
  amber: "#E8A020",
  border: "rgba(26,46,30,0.085)",
  textMuted: "rgba(26,46,30,0.50)",
  textLight: "rgba(26,46,30,0.42)",
};

// ── Wavy Feature Card ─────────────────────────────────────────────────────────

const WavyFeatureCard = ({ item, i, inView }) => {
  const [hovered, setHovered] = useState(false);
  const letters = item.label.split("");

  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={inView ? { opacity: 1, x: 0 } : {}}
      transition={{ duration: 0.45, delay: 0.28 + i * 0.09, ease: [0.22, 1, 0.36, 1] }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        background: hovered
          ? item.dot === "amber" ? "rgba(232,160,32,0.05)" : "rgba(4,98,65,0.05)"
          : C.white,
        border: `1px solid ${hovered
          ? item.dot === "amber" ? "rgba(232,160,32,0.28)" : "rgba(4,98,65,0.22)"
          : C.border}`,
        borderRadius: 14,
        padding: "14px 18px",
        display: "flex",
        alignItems: "center",
        gap: 14,
        boxShadow: hovered
          ? item.dot === "amber" ? "0 6px 24px rgba(232,160,32,0.10)" : "0 6px 24px rgba(4,98,65,0.08)"
          : "0 1px 8px rgba(26,46,30,0.04)",
        transition: "background 0.22s ease, border-color 0.22s ease, box-shadow 0.22s ease, transform 0.22s ease",
        transform: hovered ? "translateY(-2px)" : "translateY(0)",
        cursor: "default",
        overflow: "hidden",
        position: "relative",
      }}
    >
      {/* Animated dot */}
      <motion.div
        animate={hovered ? { scale: [1, 1.5, 1], opacity: [1, 0.6, 1] } : { scale: 1 }}
        transition={{ duration: 0.5, ease: "easeInOut" }}
        style={{
          width: 8, height: 8, borderRadius: "50%",
          background: item.dot === "amber" ? C.amber : C.green,
          flexShrink: 0,
        }}
      />

      <div style={{ flex: 1, minWidth: 0 }}>
        {/* Wavy text */}
        <div
          style={{
            fontSize: 13, fontWeight: 700, color: C.dark,
            letterSpacing: "-0.01em", display: "flex",
            flexWrap: "wrap", lineHeight: 1.3, overflow: "hidden",
          }}
          aria-label={item.label}
        >
          {letters.map((char, idx) => (
            <motion.span
              key={idx}
              animate={hovered
                ? {
                    y: [0, -5, 0],
                    color: [C.dark, item.dot === "amber" ? C.amber : C.green, C.dark],
                  }
                : { y: 0, color: C.dark }
              }
              transition={hovered
                ? { duration: 0.5, delay: idx * 0.022, ease: [0.22, 1, 0.36, 1], repeat: Infinity, repeatDelay: 1.2 }
                : { duration: 0.2 }
              }
              style={{ display: "inline-block", whiteSpace: char === " " ? "pre" : "normal" }}
            >
              {char === " " ? "\u00A0" : char}
            </motion.span>
          ))}
        </div>

        {/* Subtitle */}
        <motion.div
          animate={{ opacity: hovered ? 1 : 0.72, y: hovered ? 0 : 1 }}
          transition={{ duration: 0.2 }}
          style={{
            fontSize: 11.5,
            color: hovered
              ? item.dot === "amber" ? "rgba(232,160,32,0.75)" : C.green
              : C.textLight,
            marginTop: 2,
            transition: "color 0.22s ease",
          }}
        >
          {item.sub}
        </motion.div>
      </div>

      {/* Shimmer sweep */}
      {hovered && (
        <motion.div
          initial={{ x: "-100%", opacity: 0.4 }}
          animate={{ x: "200%", opacity: 0 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
          style={{
            position: "absolute", inset: 0,
            background: `linear-gradient(90deg, transparent, ${item.dot === "amber" ? "rgba(232,160,32,0.12)" : "rgba(4,98,65,0.08)"}, transparent)`,
            pointerEvents: "none",
          }}
        />
      )}
    </motion.div>
  );
};

// ── Process Step Card ─────────────────────────────────────────────────────────

const ProcessStep = ({ panel, i, total }) => {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-60px" });

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 28 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.55, delay: i * 0.14, ease: [0.22, 1, 0.36, 1] }}
      style={{ position: "relative" }}
    >
      {i < total - 1 && (
        <motion.div
          initial={{ scaleY: 0 }}
          animate={inView ? { scaleY: 1 } : {}}
          transition={{ duration: 0.5, delay: i * 0.14 + 0.4, ease: [0.22, 1, 0.36, 1] }}
          style={{
            position: "absolute", left: 21, top: "100%",
            width: 1, height: 20,
            background: `linear-gradient(to bottom, ${C.border}, transparent)`,
            transformOrigin: "top", zIndex: 0,
          }}
        />
      )}

      <div
        style={{
          background: C.white, border: `1px solid ${C.border}`, borderRadius: 18,
          padding: "22px 26px", display: "flex", gap: 18, alignItems: "flex-start",
          boxShadow: "0 2px 16px rgba(26,46,30,0.045)", position: "relative",
          overflow: "hidden", transition: "border-color 0.2s ease, box-shadow 0.2s ease",
        }}
        onMouseEnter={e => { e.currentTarget.style.borderColor = "rgba(4,98,65,0.25)"; e.currentTarget.style.boxShadow = "0 6px 28px rgba(4,98,65,0.07)"; }}
        onMouseLeave={e => { e.currentTarget.style.borderColor = C.border; e.currentTarget.style.boxShadow = "0 2px 16px rgba(26,46,30,0.045)"; }}
      >
        {/* Ghost index watermark */}
        <div style={{
          position: "absolute", bottom: -10, right: 16,
          fontSize: 88, fontWeight: 900, lineHeight: 1,
          color: "rgba(26,46,30,0.035)", userSelect: "none", pointerEvents: "none",
          fontFamily: "'Manrope', sans-serif", letterSpacing: "-0.04em",
        }}>
          {panel.index}
        </div>

        {/* Icon badge */}
        <motion.div
          initial={{ scale: 0, opacity: 0 }}
          animate={inView ? { scale: 1, opacity: 1 } : {}}
          transition={{ duration: 0.38, delay: i * 0.14 + 0.2, type: "spring", stiffness: 300, damping: 22 }}
          style={{
            width: 42, height: 42, borderRadius: 12,
            background: "rgba(4,98,65,0.07)", border: "1px solid rgba(4,98,65,0.14)",
            display: "flex", alignItems: "center", justifyContent: "center",
            fontSize: 17, color: C.green, flexShrink: 0,
          }}
        >
          {panel.icon}
        </motion.div>

        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{
            fontSize: 10, fontWeight: 700, letterSpacing: "0.13em",
            textTransform: "uppercase", color: C.amber, marginBottom: 4,
            fontFamily: "'Manrope', sans-serif",
          }}>
            Step {panel.index}
          </div>
          <h3 style={{
            margin: "0 0 10px", fontFamily: "'Manrope', sans-serif",
            fontSize: 17, fontWeight: 800, color: C.dark,
            letterSpacing: "-0.02em", lineHeight: 1.2,
          }}>
            {panel.title}
          </h3>
          <motion.div
            initial={{ width: 0 }}
            animate={inView ? { width: "100%" } : {}}
            transition={{ duration: 0.55, delay: i * 0.14 + 0.3, ease: [0.22, 1, 0.36, 1] }}
            style={{ height: 1, background: "rgba(26,46,30,0.07)", marginBottom: 10 }}
          />
          <motion.p
            initial={{ opacity: 0, y: 6 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.45, delay: i * 0.14 + 0.36, ease: [0.22, 1, 0.36, 1] }}
            style={{
              margin: 0, fontFamily: "'Manrope', sans-serif",
              fontSize: 13.5, lineHeight: 1.75, color: C.textMuted, fontWeight: 400,
            }}
          >
            {panel.text}
          </motion.p>
        </div>
      </div>
    </motion.div>
  );
};

// ── Main Page ─────────────────────────────────────────────────────────────────

const DataServicePage = ({ onNavigate = () => {} }) => {
  const heroRef = useRef(null);
  const heroInView = useInView(heroRef, { once: true, margin: "-40px" });
  const processRef = useRef(null);
  const processInView = useInView(processRef, { once: true, margin: "-60px" });
  const quoteRef = useRef(null);
  const quoteInView = useInView(quoteRef, { once: true, margin: "-60px" });

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Manrope:wght@300;400;500;600;700;800;900&display=swap');
        *, *::before, *::after { box-sizing: border-box; }
        .ds-page { font-family: 'Manrope', sans-serif; background: ${C.bg}; min-height: 100vh; color: ${C.dark}; }
        .ds-hero-grid { display: grid; grid-template-columns: 1.1fr 1fr; gap: 48px; align-items: center; }
        @media (max-width: 900px) {
          .ds-hero-grid { grid-template-columns: 1fr !important; }
          .ds-process-grid { grid-template-columns: 1fr !important; }
          .ds-sticky { position: static !important; }
          .ds-hero-inner { padding: 52px 24px 48px !important; }
          .ds-process-section { padding: 52px 24px 64px !important; }
          .ds-quote-section { padding: 52px 24px 64px !important; }
        }
        @media (max-width: 540px) {
          .ds-hero-inner { padding: 40px 18px 36px !important; }
          .ds-process-section { padding: 36px 16px 52px !important; }
          .ds-quote-section { padding: 40px 16px 52px !important; }
        }
      `}</style>

      <main className="ds-page">

        {/* ── HERO ── */}
        <section style={{
          background: C.white,
          borderBottom: `1px solid ${C.border}`,
          position: "relative",
          overflow: "hidden",
        }}>
          <div style={{
            position: "absolute", inset: 0, pointerEvents: "none",
            background: `
              radial-gradient(ellipse 65% 55% at 50% 0%, rgba(4,98,65,0.055) 0%, transparent 70%),
              radial-gradient(ellipse 35% 35% at 85% 85%, rgba(232,160,32,0.045) 0%, transparent 60%)
            `,
          }} />

          <div ref={heroRef} className="ds-hero-inner" style={{
            maxWidth: 1160, margin: "0 auto",
            padding: "120px 36px 64px",
            position: "relative", zIndex: 1,
          }}>
            {/* Eyebrow */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={heroInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.4 }}
              style={{
                display: "inline-flex", alignItems: "center", gap: 8,
                background: "rgba(4,98,65,0.07)", border: "1px solid rgba(4,98,65,0.15)",
                borderRadius: 999, padding: "5px 14px",
                fontSize: 11, fontWeight: 700, letterSpacing: "0.11em",
                textTransform: "uppercase", color: C.green, marginBottom: 22,
              }}
            >
              Type A &nbsp;·&nbsp; Data Servicing
            </motion.div>

            <div className="ds-hero-grid">
              {/* Left */}
              <div>
                <motion.h1
                  initial={{ opacity: 0, y: 20 }}
                  animate={heroInView ? { opacity: 1, y: 0 } : {}}
                  transition={{ duration: 0.6, delay: 0.1, ease: [0.22, 1, 0.36, 1] }}
                  style={{
                    margin: "0 0 16px",
                    fontSize: "clamp(28px, 4vw, 52px)",
                    fontWeight: 800, lineHeight: 1.1,
                    letterSpacing: "-0.03em", color: C.dark,
                  }}
                >
                  End-to-End Data Services for{" "}
                  <span style={{ color: C.amber }}>Multi-Language</span> Datasets.
                </motion.h1>

                <motion.p
                  initial={{ opacity: 0, y: 12 }}
                  animate={heroInView ? { opacity: 1, y: 0 } : {}}
                  transition={{ duration: 0.5, delay: 0.2 }}
                  style={{
                    margin: "0 0 28px",
                    fontSize: "clamp(13px, 1.2vw, 15px)",
                    lineHeight: 1.75, color: C.textMuted, maxWidth: 480,
                  }}
                >
                  End-to-end data services specializing in multi-language datasets, including document capture, data collection and preparation, extraction, cleaning, labeling, annotation, quality assurance, and formatting.
                </motion.p>

                <motion.button
                  initial={{ opacity: 0, y: 8 }}
                  animate={heroInView ? { opacity: 1, y: 0 } : {}}
                  transition={{ duration: 0.4, delay: 0.38 }}
                  type="button"
                  onClick={() => onNavigate("/contact-us")}
                  style={{
                    fontFamily: "'Manrope', sans-serif", fontSize: 13, fontWeight: 700,
                    letterSpacing: "0.01em", color: C.dark, background: C.amber,
                    border: "none", borderRadius: 999, padding: "12px 26px",
                    cursor: "pointer", boxShadow: "0 4px 18px rgba(232,160,32,0.28)",
                    transition: "background 0.2s, box-shadow 0.2s, transform 0.2s",
                    display: "inline-flex", alignItems: "center", gap: 8,
                  }}
                  onMouseEnter={e => { e.currentTarget.style.background = "#f0b030"; e.currentTarget.style.transform = "translateY(-1px)"; e.currentTarget.style.boxShadow = "0 6px 24px rgba(232,160,32,0.40)"; }}
                  onMouseLeave={e => { e.currentTarget.style.background = C.amber; e.currentTarget.style.transform = "translateY(0)"; e.currentTarget.style.boxShadow = "0 4px 18px rgba(232,160,32,0.28)"; }}
                >
                  Get in Touch →
                </motion.button>
              </div>

              {/* Right — wavy feature cards */}
              <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                {featureItems.map((item, i) => (
                  <WavyFeatureCard key={item.label} item={item} i={i} inView={heroInView} />
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* ── PROCESS ── */}
        <section className="ds-process-section" style={{
          padding: "72px 36px 80px", position: "relative", overflow: "hidden",
        }}>
          <div style={{
            position: "absolute", inset: 0, pointerEvents: "none",
            backgroundImage: `radial-gradient(${C.border} 1px, transparent 1px)`,
            backgroundSize: "28px 28px",
          }} />

          <div ref={processRef} style={{ maxWidth: 1160, margin: "0 auto", position: "relative", zIndex: 1 }}>
            <div className="ds-process-grid" style={{
              display: "grid", gridTemplateColumns: "1fr 1.8fr",
              gap: "clamp(36px, 6vw, 80px)", alignItems: "start",
            }}>
              {/* Sticky left */}
              <div className="ds-sticky" style={{ position: "sticky", top: 88 }}>
                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  animate={processInView ? { opacity: 1, x: 0 } : {}}
                  transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
                >
                  <div style={{
                    display: "inline-flex", alignItems: "center", gap: 7,
                    fontSize: 10, fontWeight: 700, letterSpacing: "0.13em",
                    textTransform: "uppercase", color: C.amber, marginBottom: 16,
                  }}>
                    <span style={{ display: "inline-block", width: 20, height: 1.5, background: C.amber, borderRadius: 2 }} />
                    Overview
                  </div>

                  <h2 style={{
                    margin: "0 0 14px", fontSize: "clamp(22px, 3vw, 36px)",
                    fontWeight: 800, lineHeight: 1.1, color: C.dark, letterSpacing: "-0.025em",
                  }}>
                    How We <span style={{ color: C.green }}>Deliver.</span>
                  </h2>

                  <p style={{
                    fontSize: 13.5, lineHeight: 1.72, color: C.textMuted,
                    margin: "0 0 24px", fontWeight: 400,
                  }}>
                    From raw document capture through to structured, AI-ready records — here's how a Type A data servicing engagement works end to end.
                  </p>

                  {/* Outcome card */}
                  <div style={{
                    background: C.white, border: `1px solid ${C.border}`,
                    borderRadius: 16, padding: "18px 20px",
                    boxShadow: "0 2px 14px rgba(26,46,30,0.05)",
                  }}>
                    <div style={{
                      fontSize: 10, fontWeight: 700, letterSpacing: "0.13em",
                      textTransform: "uppercase", color: C.amber, marginBottom: 8,
                    }}>
                      Capability
                    </div>
                    <div style={{
                      fontSize: 20, fontWeight: 800, color: C.dark,
                      letterSpacing: "-0.02em", marginBottom: 4,
                    }}>
                      Multi-Language Support
                    </div>
                    <div style={{ fontSize: 12, color: C.textLight }}>
                      Covering diverse document formats &amp; languages
                    </div>
                  </div>
                </motion.div>
              </div>

              {/* Steps */}
              <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
                {processPanels.map((panel, i) => (
                  <ProcessStep key={panel.title} panel={panel} i={i} total={processPanels.length} />
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* ── QUOTE ── */}
        <section ref={quoteRef} className="ds-quote-section" style={{
          padding: "72px 36px 80px", background: C.dark,
          position: "relative", overflow: "hidden",
        }}>
          <div style={{
            position: "absolute", inset: 0, pointerEvents: "none",
            background: "radial-gradient(ellipse 70% 80% at 50% 50%, rgba(4,98,65,0.18) 0%, transparent 70%)",
          }} />
          <div style={{
            position: "absolute", top: 0, left: "clamp(24px, 5vw, 80px)",
            fontSize: "clamp(120px, 18vw, 200px)", fontWeight: 900, lineHeight: 0.85,
            color: "rgba(232,160,32,0.06)", pointerEvents: "none", userSelect: "none",
          }}>
            "
          </div>

          <div style={{
            maxWidth: 800, margin: "0 auto", position: "relative",
            zIndex: 1, textAlign: "center",
          }}>
            <motion.div
              initial={{ opacity: 0, y: 24 }}
              animate={quoteInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
            >
              <motion.div
                initial={{ width: 0 }}
                animate={quoteInView ? { width: 40 } : {}}
                transition={{ duration: 0.45, delay: 0.2 }}
                style={{ height: 3, background: C.amber, borderRadius: 2, margin: "0 auto 36px" }}
              />

              <blockquote style={{
                margin: "0 0 36px",
                fontSize: "clamp(16px, 2.2vw, 24px)",
                fontWeight: 600, lineHeight: 1.7,
                color: "rgba(255,255,255,0.88)",
                letterSpacing: "-0.015em", fontStyle: "italic",
              }}>
                "Great data is not just collected, it is carefully shaped: when quality, context, and clarity align, every AI decision becomes faster, smarter, and more human."
              </blockquote>

              <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 14 }}>
                <div style={{ height: 1, width: 36, background: "rgba(255,255,255,0.12)" }} />
                <span style={{
                  fontSize: 10.5, fontWeight: 700, letterSpacing: "0.15em",
                  textTransform: "uppercase", color: "rgba(255,255,255,0.30)",
                }}>
                  Lifewood Data Technology
                </span>
                <div style={{ height: 1, width: 36, background: "rgba(255,255,255,0.12)" }} />
              </div>
            </motion.div>
          </div>
        </section>

      </main>
    </>
  );
};

export default DataServicePage;