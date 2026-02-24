import { useRef, useState, useEffect } from "react";
import { motion, useInView, AnimatePresence } from "framer-motion";

// ── Color tokens (mirrors VerticalLLMDataPage) ────────────────────────────────
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

// ── Card Swap (reactbits-inspired) ────────────────────────────────────────────
const cardData = [
  {
    label: "Text Generation",
    sub: "Brand voice, scripts & copy",
    img: "https://images.unsplash.com/photo-1499750310107-5fef28a66643?auto=format&fit=crop&w=900&q=80",
    tag: "Text",
    accent: C.amber,
  },
  {
    label: "AI Voice & Audio",
    sub: "Multilingual narration & voice synthesis",
    img: "https://images.unsplash.com/photo-1590602847861-f357a9332bbc?auto=format&fit=crop&w=900&q=80",
    tag: "Voice",
    accent: C.green,
  },
  {
    label: "Image Generation",
    sub: "Concept art, visuals & brand imagery",
    img: "https://images.unsplash.com/photo-1547658719-da2b51169166?auto=format&fit=crop&w=900&q=80",
    tag: "Image",
    accent: C.amber,
  },
  {
    label: "Video Production",
    sub: "AI-powered storytelling & motion",
    img: "https://images.unsplash.com/photo-1492691527719-9d1e07e534b4?auto=format&fit=crop&w=900&q=80",
    tag: "Video",
    accent: C.green,
  },
];

const CardSwap = () => {
  const [active, setActive] = useState(0);
  const [animating, setAnimating] = useState(false);
  const timerRef = useRef(null);

  const next = () => {
    if (animating) return;
    setAnimating(true);
    setTimeout(() => {
      setActive((p) => (p + 1) % cardData.length);
      setAnimating(false);
    }, 380);
  };

  useEffect(() => {
    timerRef.current = setInterval(next, 3200);
    return () => clearInterval(timerRef.current);
  }, [animating]);

  const getCard = (offset) => cardData[(active + offset) % cardData.length];

  const stack = [
    { offset: 2, scale: 0.88, y: -28, zIndex: 1, opacity: 0.45 },
    { offset: 1, scale: 0.94, y: -14, zIndex: 2, opacity: 0.70 },
    { offset: 0, scale: 1.00, y: 0,   zIndex: 3, opacity: 1.00 },
  ];

  return (
    <div style={{ position: "relative", width: "100%", maxWidth: 420, margin: "0 auto" }}>
      {/* Stack */}
      <div style={{ position: "relative", height: 320 }}>
        {stack.map(({ offset, scale, y, zIndex, opacity }) => {
          const card = getCard(offset);
          const isFront = offset === 0;
          return (
            <motion.div
              key={`${active}-${offset}`}
              animate={{ scale, y, opacity }}
              transition={{ duration: 0.42, ease: [0.22, 1, 0.36, 1] }}
              onClick={isFront ? next : undefined}
              style={{
                position: "absolute",
                inset: 0,
                zIndex,
                borderRadius: 22,
                overflow: "hidden",
                cursor: isFront ? "pointer" : "default",
                boxShadow: isFront
                  ? "0 20px 60px rgba(26,46,30,0.18)"
                  : "0 8px 24px rgba(26,46,30,0.08)",
              }}
            >
              {/* Image */}
              <img
                src={card.img}
                alt={card.label}
                style={{
                  width: "100%", height: "100%",
                  objectFit: "cover",
                  display: "block",
                  transition: "transform 0.6s ease",
                  transform: isFront ? "scale(1.04)" : "scale(1)",
                }}
              />
              {/* Overlay */}
              <div style={{
                position: "absolute", inset: 0,
                background: isFront
                  ? "linear-gradient(160deg, rgba(26,46,30,0.08) 0%, rgba(26,46,30,0.72) 100%)"
                  : "rgba(26,46,30,0.35)",
              }} />

              {/* Front card content */}
              {isFront && (
                <div style={{
                  position: "absolute", inset: 0, padding: "24px 26px",
                  display: "flex", flexDirection: "column", justifyContent: "space-between",
                }}>
                  {/* Tag */}
                  <div style={{
                    alignSelf: "flex-start",
                    background: card.accent,
                    color: C.dark,
                    borderRadius: 999,
                    padding: "4px 12px",
                    fontSize: 10,
                    fontWeight: 800,
                    letterSpacing: "0.12em",
                    textTransform: "uppercase",
                    fontFamily: "'Manrope', sans-serif",
                  }}>
                    {card.tag}
                  </div>

                  {/* Bottom label */}
                  <div>
                    <div style={{
                      fontSize: 22, fontWeight: 800, color: "#fff",
                      letterSpacing: "-0.02em", lineHeight: 1.2,
                      fontFamily: "'Manrope', sans-serif",
                      marginBottom: 4,
                      textShadow: "0 2px 12px rgba(0,0,0,0.3)",
                    }}>
                      {card.label}
                    </div>
                    <div style={{
                      fontSize: 12.5, color: "rgba(255,255,255,0.62)",
                      fontFamily: "'Manrope', sans-serif", fontWeight: 500,
                    }}>
                      {card.sub}
                    </div>
                  </div>
                </div>
              )}

              {/* Tap hint on front */}
              {isFront && (
                <div style={{
                  position: "absolute", bottom: 24, right: 22,
                  width: 32, height: 32, borderRadius: "50%",
                  background: "rgba(255,255,255,0.18)",
                  backdropFilter: "blur(8px)",
                  display: "flex", alignItems: "center", justifyContent: "center",
                  fontSize: 14, color: "#fff",
                }}>
                  →
                </div>
              )}
            </motion.div>
          );
        })}
      </div>

      {/* Dots */}
      <div style={{
        display: "flex", justifyContent: "center", gap: 6, marginTop: 20,
      }}>
        {cardData.map((_, i) => (
          <button
            key={i}
            type="button"
            onClick={() => { if (!animating) { setAnimating(true); setTimeout(() => { setActive(i); setAnimating(false); }, 300); } }}
            style={{
              width: i === active ? 22 : 6,
              height: 6, borderRadius: 999,
              background: i === active ? C.amber : C.border,
              border: "none", cursor: "pointer", padding: 0,
              transition: "width 0.3s ease, background 0.3s ease",
            }}
          />
        ))}
      </div>
    </div>
  );
};

// ── Approach Item ─────────────────────────────────────────────────────────────
const approachItems = [
  {
    num: "01",
    title: "Story-Driven Content",
    text: "We build around your brand's core narrative — finding the single most important message before crafting anything visual or verbal.",
  },
  {
    num: "02",
    title: "Multi-Modal Production",
    text: "Text, voice, image, and video are orchestrated together, creating cohesive content that works across every channel.",
  },
  {
    num: "03",
    title: "Brand Personality First",
    text: "Every piece is shaped to express your brand's personality in a compelling and distinctive way — surprise and originality are non-negotiable.",
  },
];

// ── Stat ticker ───────────────────────────────────────────────────────────────
const stats = [
  { value: "100+", label: "Countries Reached" },
  { value: "4",    label: "Content Modalities" },
  { value: "∞",    label: "Stories to Tell" },
];

// ── Main Page ─────────────────────────────────────────────────────────────────
const AIGCPage = ({ onNavigate = () => {} }) => {
  const heroRef    = useRef(null);
  const heroInView = useInView(heroRef,    { once: true, margin: "-40px" });
  const approachRef    = useRef(null);
  const approachInView = useInView(approachRef, { once: true, margin: "-60px" });
  const swapRef    = useRef(null);
  const swapInView = useInView(swapRef,    { once: true, margin: "-60px" });
  const quoteRef   = useRef(null);
  const quoteInView = useInView(quoteRef,  { once: true, margin: "-60px" });

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Manrope:wght@300;400;500;600;700;800;900&display=swap');
        *, *::before, *::after { box-sizing: border-box; }
        .aigc-page {
          font-family: 'Manrope', sans-serif;
          background: ${C.bg};
          min-height: 100vh;
          color: ${C.dark};
        }
        @media (max-width: 900px) {
          .aigc-hero-grid     { grid-template-columns: 1fr !important; }
          .aigc-approach-grid { grid-template-columns: 1fr !important; }
          .aigc-swap-grid     { grid-template-columns: 1fr !important; }
          .aigc-hero-inner    { padding: 52px 24px 48px !important; }
          .aigc-approach-sec  { padding: 52px 24px 64px !important; }
          .aigc-swap-sec      { padding: 52px 24px 64px !important; }
          .aigc-quote-sec     { padding: 52px 24px 64px !important; }
          .aigc-stats-bar     { gap: 24px !important; flex-wrap: wrap; justify-content: center; }
        }
        @media (max-width: 540px) {
          .aigc-hero-inner   { padding: 40px 18px 36px !important; }
          .aigc-approach-sec { padding: 36px 16px 52px !important; }
          .aigc-swap-sec     { padding: 36px 16px 52px !important; }
          .aigc-quote-sec    { padding: 40px 16px 52px !important; }
        }
      `}</style>

      <main className="aigc-page">

        {/* ── HERO ─────────────────────────────────────────────────────── */}
        <section style={{
          background: C.white,
          borderBottom: `1px solid ${C.border}`,
          position: "relative", overflow: "hidden",
        }}>
          {/* bg tints */}
          <div style={{
            position: "absolute", inset: 0, pointerEvents: "none",
            background: `
              radial-gradient(ellipse 65% 55% at 50% 0%, rgba(4,98,65,0.055) 0%, transparent 70%),
              radial-gradient(ellipse 35% 35% at 85% 85%, rgba(232,160,32,0.045) 0%, transparent 60%)
            `,
          }} />

          <div ref={heroRef} className="aigc-hero-inner" style={{
            maxWidth: 1160, margin: "0 auto",
            padding: "120px 36px 64px", position: "relative", zIndex: 1,
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
              Type D &nbsp;·&nbsp; AIGC
            </motion.div>

            <div className="aigc-hero-grid" style={{
              display: "grid", gridTemplateColumns: "1.15fr 1fr", gap: 48, alignItems: "center",
            }}>
              {/* Left */}
              <div>
                <motion.h1
                  initial={{ opacity: 0, y: 20 }}
                  animate={heroInView ? { opacity: 1, y: 0 } : {}}
                  transition={{ duration: 0.6, delay: 0.1, ease: [0.22, 1, 0.36, 1] }}
                  style={{
                    margin: "0 0 16px",
                    fontSize: "clamp(28px, 4vw, 54px)",
                    fontWeight: 800, lineHeight: 1.08, letterSpacing: "-0.03em", color: C.dark,
                  }}
                >
                  AI Generated Content
                  <br />
                  <span style={{ color: C.amber }}>that Tells Your Story.</span>
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
                  Lifewood's early adoption of AI tools has rapidly evolved its use of AI-generated content — integrating text, voice, image, and video into powerful brand storytelling. Now available to other companies seeking to join the communication revolution.
                </motion.p>

                {/* Stats row */}
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={heroInView ? { opacity: 1, y: 0 } : {}}
                  transition={{ duration: 0.4, delay: 0.32 }}
                  className="aigc-stats-bar"
                  style={{ display: "flex", gap: 32, marginBottom: 32 }}
                >
                  {stats.map((s, i) => (
                    <div key={s.label} style={{ borderLeft: `2px solid ${i % 2 === 0 ? C.amber : C.green}`, paddingLeft: 14 }}>
                      <div style={{ fontSize: 22, fontWeight: 900, color: C.dark, letterSpacing: "-0.03em", lineHeight: 1 }}>
                        {s.value}
                      </div>
                      <div style={{ fontSize: 11, color: C.textLight, fontWeight: 500, marginTop: 3 }}>
                        {s.label}
                      </div>
                    </div>
                  ))}
                </motion.div>

                <motion.button
                  initial={{ opacity: 0, y: 8 }}
                  animate={heroInView ? { opacity: 1, y: 0 } : {}}
                  transition={{ duration: 0.4, delay: 0.42 }}
                  type="button"
                  onClick={() => onNavigate("/contact-us")}
                  style={{
                    fontFamily: "'Manrope', sans-serif", fontSize: 13, fontWeight: 700,
                    color: C.dark, background: C.amber, border: "none",
                    borderRadius: 999, padding: "12px 26px", cursor: "pointer",
                    boxShadow: "0 4px 18px rgba(232,160,32,0.28)",
                    transition: "background 0.2s, box-shadow 0.2s, transform 0.2s",
                    display: "inline-flex", alignItems: "center", gap: 8,
                  }}
                  onMouseEnter={e => { e.currentTarget.style.background = "#f0b030"; e.currentTarget.style.transform = "translateY(-1px)"; e.currentTarget.style.boxShadow = "0 6px 24px rgba(232,160,32,0.40)"; }}
                  onMouseLeave={e => { e.currentTarget.style.background = C.amber; e.currentTarget.style.transform = "translateY(0)"; e.currentTarget.style.boxShadow = "0 4px 18px rgba(232,160,32,0.28)"; }}
                >
                  Get in Touch →
                </motion.button>
              </div>

              {/* Right — hero visual collage */}
              <motion.div
                initial={{ opacity: 0, x: 24 }}
                animate={heroInView ? { opacity: 1, x: 0 } : {}}
                transition={{ duration: 0.65, delay: 0.18, ease: [0.22, 1, 0.36, 1] }}
                style={{ position: "relative", height: 400 }}
              >
                {/* Back image */}
                <div style={{
                  position: "absolute",
                  top: 0, right: 0,
                  width: "85%", height: "75%",
                  borderRadius: 20,
                  overflow: "hidden",
                  boxShadow: "0 12px 48px rgba(26,46,30,0.14)",
                }}>
                  <img
                    src="https://images.unsplash.com/photo-1516321497487-e288fb19713f?auto=format&fit=crop&w=900&q=80"
                    alt="AI content studio"
                    style={{ width: "100%", height: "100%", objectFit: "cover" }}
                  />
                  <div style={{ position: "absolute", inset: 0, background: "rgba(26,46,30,0.12)" }} />
                </div>
                {/* Front image */}
                <div style={{
                  position: "absolute",
                  bottom: 0, left: 0,
                  width: "62%", height: "55%",
                  borderRadius: 18,
                  overflow: "hidden",
                  border: `3px solid ${C.white}`,
                  boxShadow: "0 16px 52px rgba(26,46,30,0.18)",
                }}>
                  <img
                    src="https://images.unsplash.com/photo-1633355444132-695d5876cd00?auto=format&fit=crop&w=700&q=80"
                    alt="AI generated visual"
                    style={{ width: "100%", height: "100%", objectFit: "cover" }}
                  />
                  <div style={{ position: "absolute", inset: 0, background: "rgba(26,46,30,0.08)" }} />
                </div>
                {/* Floating badge */}
                <div style={{
                  position: "absolute",
                  top: "38%", left: "30%",
                  background: C.white,
                  border: `1px solid ${C.border}`,
                  borderRadius: 14,
                  padding: "10px 16px",
                  boxShadow: "0 8px 28px rgba(26,46,30,0.12)",
                  zIndex: 4,
                  display: "flex", alignItems: "center", gap: 10,
                }}>
                  <div style={{
                    width: 32, height: 32, borderRadius: 10,
                    background: "rgba(232,160,32,0.12)",
                    border: "1px solid rgba(232,160,32,0.22)",
                    display: "flex", alignItems: "center", justifyContent: "center",
                    fontSize: 14, flexShrink: 0,
                  }}>✦</div>
                  <div>
                    <div style={{ fontSize: 11, fontWeight: 800, color: C.dark, letterSpacing: "-0.01em" }}>AIGC Production</div>
                    <div style={{ fontSize: 10, color: C.textLight }}>Text · Voice · Image · Video</div>
                  </div>
                </div>
              </motion.div>
            </div>
          </div>
        </section>

        {/* ── APPROACH ─────────────────────────────────────────────────── */}
        <section
          className="aigc-approach-sec"
          ref={approachRef}
          style={{ padding: "72px 36px 80px", position: "relative", overflow: "hidden" }}
        >
          {/* Dot grid */}
          <div style={{
            position: "absolute", inset: 0, pointerEvents: "none",
            backgroundImage: `radial-gradient(${C.border} 1px, transparent 1px)`,
            backgroundSize: "28px 28px",
          }} />

          <div style={{ maxWidth: 1160, margin: "0 auto", position: "relative", zIndex: 1 }}>
            {/* Section header */}
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={approachInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
              style={{ marginBottom: 48 }}
            >
              <div style={{
                display: "inline-flex", alignItems: "center", gap: 7,
                fontSize: 10, fontWeight: 700, letterSpacing: "0.13em",
                textTransform: "uppercase", color: C.amber, marginBottom: 12,
              }}>
                <span style={{ display: "inline-block", width: 20, height: 1.5, background: C.amber, borderRadius: 2 }} />
                Our Approach
              </div>
              <h2 style={{
                margin: 0, fontSize: "clamp(24px, 3.5vw, 40px)",
                fontWeight: 800, lineHeight: 1.1, color: C.dark, letterSpacing: "-0.025em",
              }}>
                Story-first. <span style={{ color: C.green }}>Always.</span>
              </h2>
            </motion.div>

            <div className="aigc-approach-grid" style={{
              display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 20,
            }}>
              {approachItems.map((item, i) => (
                <motion.div
                  key={item.num}
                  initial={{ opacity: 0, y: 24 }}
                  animate={approachInView ? { opacity: 1, y: 0 } : {}}
                  transition={{ duration: 0.5, delay: i * 0.12, ease: [0.22, 1, 0.36, 1] }}
                  style={{
                    background: C.white,
                    border: `1px solid ${C.border}`,
                    borderRadius: 18,
                    padding: "26px 26px",
                    position: "relative",
                    overflow: "hidden",
                    boxShadow: "0 2px 16px rgba(26,46,30,0.045)",
                    transition: "border-color 0.2s, box-shadow 0.2s",
                  }}
                  onMouseEnter={e => { e.currentTarget.style.borderColor = "rgba(4,98,65,0.25)"; e.currentTarget.style.boxShadow = "0 6px 28px rgba(4,98,65,0.07)"; }}
                  onMouseLeave={e => { e.currentTarget.style.borderColor = C.border; e.currentTarget.style.boxShadow = "0 2px 16px rgba(26,46,30,0.045)"; }}
                >
                  {/* Ghost number */}
                  <div style={{
                    position: "absolute", bottom: -16, right: 12,
                    fontSize: 80, fontWeight: 900, lineHeight: 1,
                    color: "rgba(26,46,30,0.035)",
                    userSelect: "none", pointerEvents: "none",
                    fontFamily: "'Manrope', sans-serif", letterSpacing: "-0.04em",
                  }}>
                    {item.num}
                  </div>

                  <div style={{
                    fontSize: 10, fontWeight: 700, letterSpacing: "0.13em",
                    textTransform: "uppercase", color: C.amber, marginBottom: 12,
                  }}>
                    Step {item.num}
                  </div>
                  <h3 style={{
                    margin: "0 0 10px", fontSize: 17, fontWeight: 800,
                    color: C.dark, letterSpacing: "-0.02em", lineHeight: 1.2,
                  }}>
                    {item.title}
                  </h3>
                  <div style={{ height: 1, background: "rgba(26,46,30,0.07)", marginBottom: 10 }} />
                  <p style={{
                    margin: 0, fontSize: 13.5, lineHeight: 1.75,
                    color: C.textMuted, fontWeight: 400,
                  }}>
                    {item.text}
                  </p>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* ── CARD SWAP ─────────────────────────────────────────────────── */}
        <section
          className="aigc-swap-sec"
          ref={swapRef}
          style={{
            padding: "72px 36px 80px",
            background: C.white,
            borderTop: `1px solid ${C.border}`,
            position: "relative", overflow: "hidden",
          }}
        >
          <div style={{
            position: "absolute", inset: 0, pointerEvents: "none",
            background: `radial-gradient(ellipse 60% 50% at 70% 50%, rgba(4,98,65,0.04) 0%, transparent 70%)`,
          }} />

          <div style={{ maxWidth: 1160, margin: "0 auto", position: "relative", zIndex: 1 }}>
            <div className="aigc-swap-grid" style={{
              display: "grid", gridTemplateColumns: "1fr 1fr", gap: 60, alignItems: "center",
            }}>
              {/* Left — copy */}
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={swapInView ? { opacity: 1, x: 0 } : {}}
                transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
              >
                <div style={{
                  display: "inline-flex", alignItems: "center", gap: 7,
                  fontSize: 10, fontWeight: 700, letterSpacing: "0.13em",
                  textTransform: "uppercase", color: C.amber, marginBottom: 16,
                }}>
                  <span style={{ display: "inline-block", width: 20, height: 1.5, background: C.amber, borderRadius: 2 }} />
                  Content Modalities
                </div>

                <h2 style={{
                  margin: "0 0 16px", fontSize: "clamp(22px, 3vw, 38px)",
                  fontWeight: 800, lineHeight: 1.1, color: C.dark, letterSpacing: "-0.025em",
                }}>
                  Four Pillars of{" "}
                  <span style={{ color: C.green }}>AIGC.</span>
                </h2>

                <p style={{
                  fontSize: 13.5, lineHeight: 1.75, color: C.textMuted,
                  margin: "0 0 28px", fontWeight: 400, maxWidth: 420,
                }}>
                  Text, voice, image, and video — Lifewood's AIGC capabilities span the full content spectrum. Each modality is crafted with editorial precision and brand-alignment at its core.
                </p>

                {/* Modality pills */}
                <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
                  {cardData.map((c, i) => (
                    <div key={c.tag} style={{
                      display: "inline-flex", alignItems: "center", gap: 7,
                      background: "rgba(26,46,30,0.04)",
                      border: `1px solid ${C.border}`,
                      borderRadius: 999, padding: "6px 14px",
                      fontSize: 12, fontWeight: 600, color: C.dark,
                    }}>
                      <span style={{
                        width: 7, height: 7, borderRadius: "50%",
                        background: i % 2 === 0 ? C.amber : C.green,
                        display: "inline-block", flexShrink: 0,
                      }} />
                      {c.label}
                    </div>
                  ))}
                </div>
              </motion.div>

              {/* Right — Card Swap */}
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={swapInView ? { opacity: 1, x: 0 } : {}}
                transition={{ duration: 0.6, delay: 0.14, ease: [0.22, 1, 0.36, 1] }}
              >
                <CardSwap />
              </motion.div>
            </div>
          </div>
        </section>

        {/* ── QUOTE ─────────────────────────────────────────────────────── */}
        <section ref={quoteRef} className="aigc-quote-sec" style={{
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
            fontFamily: "'Manrope', sans-serif",
          }}>
            "
          </div>

          <div style={{ maxWidth: 800, margin: "0 auto", position: "relative", zIndex: 1, textAlign: "center" }}>
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
                fontFamily: "'Manrope', sans-serif",
              }}>
                "We understand that your customers spend hours looking at screens: so finding the one, most important thing, on which to build your message is integral to our approach, as we seek to deliver surprise and originality."
              </blockquote>
              <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 14 }}>
                <div style={{ height: 1, width: 36, background: "rgba(255,255,255,0.12)" }} />
                <span style={{
                  fontSize: 10.5, fontWeight: 700, letterSpacing: "0.15em",
                  textTransform: "uppercase", color: "rgba(255,255,255,0.30)",
                  fontFamily: "'Manrope', sans-serif",
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

export default AIGCPage;