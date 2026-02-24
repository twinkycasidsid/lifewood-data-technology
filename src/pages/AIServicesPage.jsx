import { useState, useRef } from 'react'
import { motion, useInView, AnimatePresence } from 'framer-motion'

// ── Data ──────────────────────────────────────────────────────────────────────

const modalities = [
  {
    index: '01',
    title: 'Text',
    icon: '¶',
    accent: '#F5A623',
    tagline: 'Language at scale',
    services: ['Text Collection & Transcription', 'Utterance Collection', 'Sentiment Analysis', 'Content Labelling'],
    description: 'From raw utterances to structured sentiment datasets, our linguists and annotators handle every text modality across 50+ languages — enabling NLP models that actually understand context.',
    image: 'https://images.unsplash.com/photo-1519791883288-dc8bd696e667?auto=format&fit=crop&w=1200&q=80',
  },
  {
    index: '02',
    title: 'Video',
    icon: '▶',
    accent: '#046241',
    tagline: 'Frame-level precision',
    services: ['Video Collection & Labelling', 'Quality Audit', 'Live Broadcast Annotation', 'Subtitle Generation'],
    description: 'We process, label, and validate video datasets at volume — from dashcam footage to broadcast streams — with temporal accuracy that keeps computer vision pipelines on track.',
    image: 'https://images.unsplash.com/photo-1574717024653-61fd2cf4d44d?auto=format&fit=crop&w=1200&q=80',
  },
  {
    index: '03',
    title: 'Image',
    icon: '◧',
    accent: '#F5A623',
    tagline: 'Visual intelligence',
    services: ['Image Collection & Classification', 'Object Detection & Tagging', 'Content Audit', 'Bounding Box Annotation'],
    description: 'Our annotators apply pixel-level precision across object detection, segmentation, and classification tasks — delivering clean, structured image datasets ready for model training.',
    image: 'https://images.unsplash.com/photo-1576444356170-66073046b1bc?auto=format&fit=crop&w=1200&q=80',
  },
  {
    index: '04',
    title: 'Audio',
    icon: '◉',
    accent: '#046241',
    tagline: 'Sound that speaks data',
    services: ['Audio Collection & Labelling', 'Voice Categorization', 'Music Categorization', 'Conversational AI Support'],
    description: 'We collect, clean, and annotate audio across accents, environments, and use cases — from ASR training corpora to emotion-tagged conversational datasets for voice AI.',
    image: 'https://images.unsplash.com/photo-1598488035139-bdbb2231ce04?auto=format&fit=crop&w=1200&q=80',
  },
]

const dataServices = [
  {
    index: '01',
    title: 'Data Validation',
    icon: '◈',
    accent: '#F5A623',
    description: 'The goal is to create data that is consistent, accurate and complete, preventing data loss or errors in transfer, code or configuration. We verify that data conforms to predefined standards, rules or constraints, ensuring the information is trustworthy and fit for its intended purpose.',
  },
  {
    index: '02',
    title: 'Data Collection',
    icon: '◎',
    accent: '#046241',
    description: 'Lifewood delivers multi-modal data collection across text, audio, image, and video, supported by advanced workflows for categorization, labeling, tagging, transcription, sentiment analysis, and subtitle generation. Our scalable processes ensure accuracy and cultural nuance across 30+ languages and regions.',
  },
  {
    index: '03',
    title: 'Data Acquisition',
    icon: '↗',
    accent: '#F5A623',
    description: 'We provide end-to-end data acquisition solutions — capturing, processing, and managing large-scale, diverse datasets tailored for domain-specific AI applications, optimized for quality and throughput.',
  },
  {
    index: '04',
    title: 'Data Curation',
    icon: '✦',
    accent: '#046241',
    description: 'We sift, select and index data to ensure reliability, accessibility and ease of classification. Data can be curated to support business decisions, academic research, genealogies, scientific research and more.',
  },
  {
    index: '05',
    title: 'Data Annotation',
    icon: '⟷',
    accent: '#F5A623',
    description: 'In the age of AI, data is the fuel for all analytic and machine learning. Lifewood provides high quality annotation services for a wide range of mediums including text, image, audio and video for both computer vision and natural language processing.',
  },
]

// ── Modality Card ─────────────────────────────────────────────────────────────

const ModalityCard = ({ card, i }) => {
  const [hovered, setHovered] = useState(false)
  const ref = useRef(null)
  const inView = useInView(ref, { once: true, margin: '-60px' })

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 48 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.65, delay: i * 0.12, ease: [0.22, 1, 0.36, 1] }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        position: 'relative',
        borderRadius: 24,
        overflow: 'hidden',
        height: 440,
        cursor: 'default',
        border: `1px solid ${hovered ? card.accent : 'rgba(255,255,255,0.07)'}`,
        transition: 'border-color 0.4s ease, box-shadow 0.4s ease',
        boxShadow: hovered ? `0 24px 60px rgba(0,0,0,0.5), 0 0 0 1px ${card.accent}40` : '0 8px 24px rgba(0,0,0,0.3)',
      }}
    >
      <img
        src={card.image}
        alt={card.title}
        style={{
          position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover',
          transform: hovered ? 'scale(1.1)' : 'scale(1)',
          transition: 'transform 0.9s cubic-bezier(0.22, 1, 0.36, 1)',
        }}
        loading="lazy"
      />
      <div style={{
        position: 'absolute', inset: 0,
        background: hovered
          ? 'rgba(10,26,14,0.94)'
          : 'linear-gradient(to top, rgba(10,26,14,0.92) 0%, rgba(10,26,14,0.45) 55%, rgba(10,26,14,0.1) 100%)',
        transition: 'background 0.5s ease',
      }} />

      {/* Badge */}
      <div style={{ position: 'absolute', top: 22, left: 22, display: 'flex', alignItems: 'center', gap: 10 }}>
        <motion.div
          animate={{ background: hovered ? card.accent : `${card.accent}22` }}
          transition={{ duration: 0.35 }}
          style={{
            width: 44, height: 44, borderRadius: 13,
            border: `1px solid ${card.accent}55`,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: 17, color: hovered ? '#fff' : card.accent,
            transition: 'color 0.35s',
            fontFamily: "'Manrope', sans-serif",
          }}>
          {card.icon}
        </motion.div>
        <span style={{ fontFamily: "'Manrope', sans-serif", fontSize: 10, fontWeight: 800, letterSpacing: '0.14em', color: 'rgba(255,255,255,0.3)' }}>
          {card.index}
        </span>
      </div>

      {/* Idle content */}
      <AnimatePresence>
        {!hovered && (
          <motion.div
            key="idle"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 6 }}
            transition={{ duration: 0.25 }}
            style={{ position: 'absolute', bottom: 0, left: 0, right: 0, padding: '28px 24px' }}
          >
            <motion.div
              animate={{ width: '28px' }}
              style={{ height: 2, background: card.accent, borderRadius: 2, marginBottom: 12 }}
            />
            <p style={{ margin: '0 0 4px', fontFamily: "'Manrope', sans-serif", fontSize: 11, fontWeight: 700, letterSpacing: '0.14em', textTransform: 'uppercase', color: card.accent }}>
              {card.tagline}
            </p>
            <h3 style={{ margin: 0, fontFamily: "'Manrope', sans-serif", fontSize: 30, fontWeight: 900, color: '#fff', letterSpacing: '-0.02em' }}>
              {card.title}
            </h3>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Hovered content */}
      <AnimatePresence>
        {hovered && (
          <motion.div
            key="hover"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
            style={{ position: 'absolute', inset: 0, padding: '80px 26px 26px', display: 'flex', flexDirection: 'column', justifyContent: 'flex-end' }}
          >
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: '100%' }}
              transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
              style={{ height: 2, background: card.accent, borderRadius: 2, marginBottom: 18 }}
            />
            <h3 style={{ margin: '0 0 10px', fontFamily: "'Manrope', sans-serif", fontSize: 26, fontWeight: 900, color: '#fff', letterSpacing: '-0.02em' }}>
              {card.title}
            </h3>
            <p style={{ margin: '0 0 20px', fontFamily: "'Manrope', sans-serif", fontSize: 13.5, lineHeight: 1.75, color: 'rgba(255,255,255,0.62)' }}>
              {card.description}
            </p>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 7 }}>
              {card.services.map((s, si) => (
                <motion.div
                  key={si}
                  initial={{ opacity: 0, x: -8 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.25, delay: si * 0.06 }}
                  style={{ display: 'flex', alignItems: 'center', gap: 10, fontFamily: "'Manrope', sans-serif", fontSize: 13, fontWeight: 600, color: 'rgba(255,255,255,0.82)' }}
                >
                  <div style={{ width: 5, height: 5, borderRadius: '50%', background: card.accent, flexShrink: 0 }} />
                  {s}
                </motion.div>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  )
}

// ── Data Service Card (grid layout) ──────────────────────────────────────────

const ServiceCard = ({ card, i }) => {
  const [hovered, setHovered] = useState(false)
  const ref = useRef(null)
  const inView = useInView(ref, { once: true, margin: '-40px' })

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 32 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.55, delay: i * 0.1, ease: [0.22, 1, 0.36, 1] }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        position: 'relative',
        borderRadius: 20,
        padding: '36px 32px',
        background: hovered ? '#0a1a0e' : '#fafaf8',
        border: `1px solid ${hovered ? card.accent : 'rgba(10,26,14,0.09)'}`,
        transition: 'background 0.35s ease, border-color 0.35s ease, box-shadow 0.35s ease',
        boxShadow: hovered ? `0 20px 48px rgba(10,26,14,0.2), 0 0 0 1px ${card.accent}33` : '0 2px 12px rgba(10,26,14,0.04)',
        cursor: 'default',
        overflow: 'hidden',
      }}
    >
      {/* Ghost index */}
      <div style={{
        position: 'absolute', top: -12, right: 16,
        fontFamily: "'Manrope', sans-serif", fontSize: 110, fontWeight: 900, lineHeight: 1,
        color: hovered ? 'rgba(255,255,255,0.03)' : 'rgba(10,26,14,0.035)',
        pointerEvents: 'none', userSelect: 'none',
        transition: 'color 0.35s',
      }}>
        {card.index}
      </div>

      {/* Icon */}
      <motion.div
        animate={{ background: hovered ? card.accent : `${card.accent}14` }}
        transition={{ duration: 0.3 }}
        style={{
          width: 52, height: 52, borderRadius: 16,
          border: `1px solid ${card.accent}33`,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          fontSize: 20, color: hovered ? '#fff' : card.accent,
          transition: 'color 0.3s',
          marginBottom: 24,
          fontFamily: "'Manrope', sans-serif",
        }}
      >
        {card.icon}
      </motion.div>

      {/* Accent line */}
      <motion.div
        animate={{ width: hovered ? '100%' : '32px' }}
        transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
        style={{ height: 2, background: card.accent, borderRadius: 2, marginBottom: 18 }}
      />

      <h3 style={{
        margin: '0 0 12px',
        fontFamily: "'Manrope', sans-serif",
        fontSize: 'clamp(18px, 1.8vw, 22px)',
        fontWeight: 800, lineHeight: 1.2,
        color: hovered ? '#fff' : '#0a1a0e',
        letterSpacing: '-0.02em',
        transition: 'color 0.3s',
      }}>
        {card.title}
      </h3>
      <p style={{
        margin: 0,
        fontFamily: "'Manrope', sans-serif",
        fontSize: 14.5, lineHeight: 1.78,
        color: hovered ? 'rgba(255,255,255,0.58)' : 'rgba(10,26,14,0.54)',
        transition: 'color 0.3s',
      }}>
        {card.description}
      </p>
    </motion.div>
  )
}

// ── Marquee ───────────────────────────────────────────────────────────────────

const Marquee = () => {
  const items = Array(8).fill('Precision Data. Global Scale.')
  return (
    <section style={{ background: '#0a1a0e', overflow: 'hidden', borderTop: '1px solid rgba(255,255,255,0.05)', borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
      <style>{`
        @keyframes mq-l2 { 0% { transform: translateX(0) } 100% { transform: translateX(-50%) } }
        @keyframes mq-r2 { 0% { transform: translateX(-50%) } 100% { transform: translateX(0) } }
        .mqL2 { animation: mq-l2 40s linear infinite; }
        .mqR2 { animation: mq-r2 45s linear infinite; }
        .mqL2:hover, .mqR2:hover { animation-play-state: paused; }
      `}</style>
      <div style={{ overflow: 'hidden', padding: '24px 0 0' }}>
        <div className="mqL2" style={{ display: 'flex', whiteSpace: 'nowrap', width: 'max-content' }}>
          {[...items, ...items].map((text, i) => (
            <span key={i} style={{ display: 'inline-flex', alignItems: 'center', gap: 28, paddingRight: 40 }}>
              <span style={{ fontFamily: "'Manrope', sans-serif", fontSize: 'clamp(32px, 4.5vw, 60px)', fontWeight: 900, fontStyle: i % 2 === 0 ? 'normal' : 'italic', color: i % 2 === 0 ? '#fff' : 'transparent', WebkitTextStroke: i % 2 === 0 ? 'none' : '1px rgba(255,255,255,0.25)', letterSpacing: '-0.03em', lineHeight: 1 }}>{text}</span>
              <span style={{ width: 8, height: 8, borderRadius: '50%', background: '#F5A623', display: 'inline-block', flexShrink: 0 }} />
            </span>
          ))}
        </div>
      </div>
      <div style={{ overflow: 'hidden', padding: '0 0 24px' }}>
        <div className="mqR2" style={{ display: 'flex', whiteSpace: 'nowrap', width: 'max-content' }}>
          {[...items, ...items].map((text, i) => (
            <span key={i} style={{ display: 'inline-flex', alignItems: 'center', gap: 28, paddingRight: 40 }}>
              <span style={{ fontFamily: "'Manrope', sans-serif", fontSize: 'clamp(10px, 1.2vw, 14px)', fontWeight: 800, letterSpacing: '0.22em', textTransform: 'uppercase', color: i % 3 === 0 ? '#F5A623' : 'rgba(255,255,255,0.18)', lineHeight: 1 }}>{text}</span>
              <span style={{ width: 4, height: 4, borderRadius: '50%', background: 'rgba(245,166,35,0.35)', display: 'inline-block', flexShrink: 0 }} />
            </span>
          ))}
        </div>
      </div>
    </section>
  )
}

// ── Main ──────────────────────────────────────────────────────────────────────

const AIServicesPage = ({ onNavigate = () => {} }) => {
  const headerRef = useRef(null)
  const headerInView = useInView(headerRef, { once: true, margin: '-40px' })

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Manrope:wght@400;500;600;700;800;900&display=swap');
        .ai-svc-page, .ai-svc-page * { font-family: 'Manrope', 'Segoe UI', sans-serif !important; box-sizing: border-box; }
        @media (max-width: 960px) {
          .mod-grid-4 { grid-template-columns: repeat(2, 1fr) !important; }
          .svc-grid-5 { grid-template-columns: repeat(2, 1fr) !important; }
          .hdr-grid { grid-template-columns: 1fr !important; gap: 20px !important; }
        }
        @media (max-width: 640px) {
          .mod-grid-4 { grid-template-columns: 1fr !important; }
          .svc-grid-5 { grid-template-columns: 1fr !important; }
          .hdr-grid { grid-template-columns: 1fr !important; }
          .video-grid { grid-template-columns: 1fr !important; }
        }
      `}</style>

      <main className="ai-svc-page" style={{ background: '#fff', minHeight: '100vh' }}>

        {/* ── Header — matches AI Projects hero style ── */}
        <section ref={headerRef} style={{ maxWidth: 1280, margin: '0 auto', padding: 'clamp(100px, 10vw, 140px) clamp(24px, 6vw, 80px) 0' }}>

          {/* Eyebrow */}
          <motion.div
            initial={{ opacity: 0, y: 16 }} animate={headerInView ? { opacity: 1, y: 0 } : {}} transition={{ duration: 0.5 }}
            style={{ display: 'inline-flex', alignItems: 'center', gap: 10, marginBottom: 20 }}
          >
            <span style={{ display: 'inline-block', width: 22, height: 1, background: 'rgba(200,130,0,0.60)', borderRadius: 2 }} />
            <span style={{ fontSize: 10.5, fontWeight: 700, letterSpacing: '0.18em', textTransform: 'uppercase', color: 'rgba(10,26,14,0.32)' }}>
              What We Offer
            </span>
            <span style={{ display: 'inline-block', width: 22, height: 1, background: 'rgba(200,130,0,0.60)', borderRadius: 2 }} />
          </motion.div>

          {/* Two-column: large title left, description right */}
          <div className="hdr-grid" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 60, alignItems: 'end' }}>
            <motion.h1
              initial={{ opacity: 0, y: 24 }} animate={headerInView ? { opacity: 1, y: 0 } : {}} transition={{ duration: 0.65, delay: 0.08, ease: [0.22, 1, 0.36, 1] }}
              style={{ margin: 0, fontSize: 'clamp(2.4rem, 4.5vw, 4rem)', fontWeight: 800, lineHeight: 1.06, letterSpacing: '-0.028em', color: '#0a1a0e' }}
            >
              AI Data<br />
              Services <br />
              {/* <em style={{ fontStyle: 'italic', color: '#133020' }}>We Deliver.</em> */}
            </motion.h1>
            <motion.p
              initial={{ opacity: 0, y: 20 }} animate={headerInView ? { opacity: 1, y: 0 } : {}} transition={{ duration: 0.65, delay: 0.2 }}
              style={{ margin: 0, fontSize: 15, lineHeight: 1.75, color: 'rgba(10,26,14,0.48)', paddingBottom: 6 }}
            >
              Lifewood delivers end-to-end AI data solutions — from multi-language data collection and annotation to model training and generative AI content. Leveraging our global workforce, industrialized methodology, and proprietary LiFT platform, we enable organizations to scale efficiently and accelerate decision-making with high-quality, domain-specific datasets.
            </motion.p>
          </div>
        </section>

        {/* Divider */}
        <div style={{ maxWidth: 1280, margin: '48px auto 0', padding: '0 clamp(24px, 6vw, 80px)', height: 1, background: 'rgba(10,26,14,0.07)' }} />

        {/* ── Modalities ── */}
        <section style={{ padding: 'clamp(56px, 9vw, 96px) clamp(24px, 6vw, 80px)', background: '#fff' }}>
          <div style={{ maxWidth: 1280, margin: '0 auto' }}>
            <motion.div
              initial={{ opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, margin: '-40px' }} transition={{ duration: 0.5 }}
              style={{ marginBottom: 36 }}
            >
              <p style={{ fontSize: 11, fontWeight: 700, letterSpacing: '0.2em', textTransform: 'uppercase', color: '#F5A623', marginBottom: 10 }}>
                Data Modalities
              </p>
              <h2 style={{ margin: 0, fontSize: 'clamp(22px, 2.8vw, 38px)', fontWeight: 900, lineHeight: 1.1, color: '#0a1a0e', letterSpacing: '-0.03em' }}>
                Hover a card to explore
              </h2>
            </motion.div>
            <div className="mod-grid-4" style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 16 }}>
              {modalities.map((card, i) => <ModalityCard key={card.title} card={card} i={i} />)}
            </div>
          </div>
        </section>

        {/* ── Marquee ── */}
        <Marquee />

        {/* ── Video Section ── */}
        <section style={{ padding: 'clamp(56px, 9vw, 96px) clamp(24px, 6vw, 80px)', background: '#fff', position: 'relative', overflow: 'hidden' }}>
          <div style={{ position: 'absolute', inset: 0, pointerEvents: 'none', backgroundImage: 'radial-gradient(rgba(4,98,65,0.04) 1px, transparent 1px)', backgroundSize: '32px 32px' }} />
          <div style={{ maxWidth: 1280, margin: '0 auto', position: 'relative', zIndex: 1 }}>
            <div className="video-grid" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 'clamp(40px, 6vw, 80px)', alignItems: 'center' }}>

              {/* Left copy */}
              <motion.div
                initial={{ opacity: 0, x: -28 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true, margin: '-60px' }} transition={{ duration: 0.65 }}
              >
                <div style={{ display: 'inline-flex', alignItems: 'center', gap: 10, background: 'rgba(245,166,35,0.08)', border: '1px solid rgba(245,166,35,0.2)', borderRadius: 100, padding: '6px 16px', marginBottom: 24 }}>
                  <div style={{ width: 6, height: 6, borderRadius: '50%', background: '#F5A623' }} />
                  <span style={{ fontSize: 11, fontWeight: 700, letterSpacing: '0.16em', color: '#F5A623', textTransform: 'uppercase' }}>
                    See Us In Action
                  </span>
                </div>
                <h2 style={{ margin: '0 0 20px', fontSize: 'clamp(26px, 3.5vw, 44px)', fontWeight: 900, lineHeight: 1.1, color: '#0a1a0e', letterSpacing: '-0.03em' }}>
                  How Lifewood{' '}
                  <span style={{ color: '#046241' }}>Delivers</span>
                </h2>
                <p style={{ margin: '0 0 28px', fontSize: 15.5, lineHeight: 1.82, color: 'rgba(10,26,14,0.58)' }}>
                  From intake to training-ready output, our workflows are built for speed, accuracy, and scale. Watch how our global team operates across modalities, languages, and time zones — always switched on, 24/7.
                </p>
                <div style={{ borderLeft: '3px solid #F5A623', paddingLeft: 20, fontSize: 16, fontStyle: 'italic', fontWeight: 600, color: '#0a1a0e', lineHeight: 1.65 }}>
                  "40+ global delivery centers. 56,000+ specialists. Always on."
                </div>
              </motion.div>

              {/* Right: video */}
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }} whileInView={{ opacity: 1, scale: 1 }} viewport={{ once: true, margin: '-60px' }} transition={{ duration: 0.65, ease: [0.22, 1, 0.36, 1] }}
                style={{ borderRadius: 24, overflow: 'hidden', boxShadow: '0 32px 64px rgba(10,26,14,0.14)', aspectRatio: '16/10', position: 'relative', border: '1px solid rgba(10,26,14,0.08)' }}
              >
                <div style={{ position: 'absolute', top: 0, left: 0, width: 80, height: 80, zIndex: 2, pointerEvents: 'none', background: 'linear-gradient(135deg, rgba(245,166,35,0.4), transparent)', borderRadius: '24px 0 80px 0' }} />
                <iframe
                  src="https://www.youtube.com/embed/g_JvAVL0WY4"
                  title="Lifewood AI Services"
                  loading="lazy"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                  referrerPolicy="strict-origin-when-cross-origin"
                  allowFullScreen
                  style={{ width: '100%', height: '100%', border: 'none', display: 'block' }}
                />
              </motion.div>
            </div>
          </div>
        </section>

        {/* ── Data Solutions Grid ── */}
        <section style={{ padding: 'clamp(56px, 9vw, 96px) clamp(24px, 6vw, 80px)', background: '#f4f5f0', position: 'relative', overflow: 'hidden' }}>
          <div style={{ maxWidth: 1280, margin: '0 auto', position: 'relative', zIndex: 1 }}>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 48, marginBottom: 'clamp(40px, 6vw, 64px)', alignItems: 'end' }}>
              <motion.div
                initial={{ opacity: 0, x: -24 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true, margin: '-40px' }} transition={{ duration: 0.6 }}
              >
                <p style={{ fontSize: 11, fontWeight: 700, letterSpacing: '0.2em', textTransform: 'uppercase', color: '#F5A623', marginBottom: 14 }}>
                  Our Capabilities
                </p>
                <h2 style={{ margin: 0, fontSize: 'clamp(26px, 3.5vw, 48px)', fontWeight: 900, lineHeight: 1.08, color: '#0a1a0e', letterSpacing: '-0.03em' }}>
                  Comprehensive{' '}
                  <span style={{ color: '#046241' }}>Data Solutions</span>
                </h2>
              </motion.div>
              <motion.p
                initial={{ opacity: 0, x: 24 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true, margin: '-40px' }} transition={{ duration: 0.6, delay: 0.1 }}
                style={{ margin: 0, fontSize: 15, lineHeight: 1.82, color: 'rgba(10,26,14,0.55)', paddingBottom: 4 }}
              >
                From raw intake to training-ready output — every stage of the AI data lifecycle covered with quality checkpoints at every step. Hover each card to learn more.
              </motion.p>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
              <div className="svc-grid-5" style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 16 }}>
                {dataServices.slice(0, 3).map((card, i) => <ServiceCard key={card.title} card={card} i={i} />)}
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 16, maxWidth: 'calc(66.66% + 8px)' }}>
                {dataServices.slice(3).map((card, i) => <ServiceCard key={card.title} card={card} i={i + 3} />)}
              </div>
            </div>
          </div>
        </section>

        {/* ── CTA ── */}
        <section style={{ background: '#0a1a0e', padding: 'clamp(56px, 9vw, 96px) clamp(24px, 6vw, 80px)', position: 'relative', overflow: 'hidden', textAlign: 'center' }}>
          <div style={{ position: 'absolute', inset: 0, pointerEvents: 'none', backgroundImage: 'linear-gradient(rgba(255,255,255,0.025) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.025) 1px, transparent 1px)', backgroundSize: '80px 80px' }} />
          <div style={{ position: 'absolute', bottom: '-20%', right: '-10%', width: 500, height: 500, borderRadius: '50%', background: 'radial-gradient(circle, rgba(245,166,35,0.07) 0%, transparent 70%)', pointerEvents: 'none' }} />
          <motion.div
            initial={{ opacity: 0, y: 28 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, margin: '-40px' }} transition={{ duration: 0.65, ease: [0.22, 1, 0.36, 1] }}
            style={{ maxWidth: 1280, margin: '0 auto', position: 'relative', zIndex: 1 }}
          >
            <p style={{ fontSize: 11, fontWeight: 700, letterSpacing: '0.2em', textTransform: 'uppercase', color: '#F5A623', marginBottom: 18 }}>
              Get Started
            </p>
            <h2 style={{ margin: '0 auto 20px', fontSize: 'clamp(28px, 4.5vw, 58px)', fontWeight: 900, lineHeight: 1.08, letterSpacing: '-0.035em', color: '#fff', maxWidth: 640 }}>
              Ready to Build Better{' '}
              <span style={{ color: '#F5A623', fontStyle: 'italic' }}>AI?</span>
            </h2>
            <p style={{ margin: '0 auto 36px', maxWidth: 440, fontSize: 16, lineHeight: 1.75, color: 'rgba(255,255,255,0.5)' }}>
              Let's talk about your data needs. Our team is ready to design a pipeline built for your scale.
            </p>
            <button
              type="button"
              onClick={() => onNavigate('/contact-us')}
              style={{ fontSize: 14, fontWeight: 700, letterSpacing: '0.04em', color: '#0a1a0e', background: '#F5A623', border: 'none', borderRadius: 100, padding: '15px 40px', cursor: 'pointer', transition: 'opacity 0.2s ease, transform 0.2s ease' }}
              onMouseEnter={e => { e.currentTarget.style.opacity = '0.88'; e.currentTarget.style.transform = 'scale(1.02)' }}
              onMouseLeave={e => { e.currentTarget.style.opacity = '1'; e.currentTarget.style.transform = 'scale(1)' }}
            >
              Contact Us
            </button>
          </motion.div>
        </section>

      </main>
    </>
  )
}

export default AIServicesPage