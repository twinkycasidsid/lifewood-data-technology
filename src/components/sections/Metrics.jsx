import { useState, useRef, useEffect } from 'react'
import { motion, useInView } from 'framer-motion'

const stats = [
  {
    number: 40,
    suffix: '+',
    label: 'Secure Global Hubs',
    tag: 'Infrastructure',
    tagColor: 'saffron',
    description:
      'Lifewood operates 40+ industrialized delivery centers worldwide, providing the secure backbone for scalable AI data operations. Each facility ensures sensitive data is processed in controlled, compliant environments with precision-engineered workflows.',
  },
  {
    number: 30,
    suffix: '+',
    label: 'Nations Across All Continents',
    tag: 'Global Reach',
    tagColor: 'green',
    description:
      'Spanning 30+ countries—with deep roots in Asia, Africa, Europe, and the Americas—we deliver region-specific datasets that reflect true global diversity. This reach enables us to act as the knowledge bridge across different sites operating worldwide.',
  },
  {
    number: 50,
    suffix: '+',
    label: 'Languages & Regional Dialects',
    tag: 'Linguistic Depth',
    tagColor: 'saffron',
    description:
      'From major world languages to rare regional dialects, Lifewood builds the multilingual datasets that power LLMs and voice AI. We provide the linguistic depth needed for enterprise applications to perform with cultural accuracy.',
  },
  {
    number: 56000,
    suffix: '+',
    label: 'Skilled Global Specialists',
    tag: 'Our People',
    tagColor: 'green',
    description:
      'With a 24/7 workforce of over 56,000 specialists, Lifewood mobilizes human-in-the-loop expertise for data collection and annotation at any scale. This massive network ensures operational effectiveness and accelerated performance improvements for our clients.',
  },
]

const useCounter = (target, isInView) => {
  const [display, setDisplay] = useState(0)
  const rafRef = useRef(null)

  useEffect(() => {
    if (!isInView) return
    const start = performance.now()
    const duration = 1800
    const tick = (now) => {
      const elapsed = now - start
      const progress = Math.min(elapsed / duration, 1)
      const eased = progress === 1 ? 1 : 1 - Math.pow(2, -10 * progress)
      setDisplay(Math.floor(eased * target))
      if (progress < 1) rafRef.current = requestAnimationFrame(tick)
    }
    rafRef.current = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(rafRef.current)
  }, [isInView, target])

  return display
}

const StatCard = ({ stat, index }) => {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, margin: '-60px' })
  const [hovered, setHovered] = useState(false)
  const count = useCounter(stat.number, isInView)
  const formatted = count >= 1000 ? count.toLocaleString('en-US') : String(count)

  return (
    <motion.div
      ref={ref}
      className={`is-card is-card--${stat.tagColor} ${hovered ? 'is-card--hovered' : ''}`}
      initial={{ opacity: 0, y: 24 }}
      animate={isInView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.5, delay: index * 0.08, ease: [0.22, 1, 0.36, 1] }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      <div className="is-card__line" />

      <p className={`is-card__tag is-card__tag--${stat.tagColor}`}>{stat.tag}</p>

      <div className="is-card__number">
        {formatted}<span className="is-card__suffix">{stat.suffix}</span>
      </div>

      <p className="is-card__label">{stat.label}</p>

      <div className="is-card__divider" />

      <p className={`is-card__desc ${hovered ? 'is-card__desc--open' : ''}`}>
        {stat.description}
      </p>
    </motion.div>
  )
}

const ImpactStats = () => {
  const headerRef = useRef(null)
  const headerInView = useInView(headerRef, { once: true, margin: '-60px' })

  return (
    <>
      <style>{`
        .impact-section {
          position: relative;
          width: 100%;
          padding: clamp(64px, 10vw, 128px) 0;
          background: #fff;
          overflow: hidden;
        }

        .impact-section::after {
          content: '';
          position: absolute;
          top: 0; left: 0;
          width: 33%;
          height: 100%;
          background: rgba(4, 98, 65, 0.018);
          transform: skewX(12deg) translateX(-25%);
          pointer-events: none;
        }

        .impact-inner {
          max-width: 1440px;
          margin: 0 auto;
          padding: 0 clamp(24px, 6vw, 80px);
          position: relative;
          z-index: 1;
        }

        .impact-header {
          text-align: center;
          margin-bottom: clamp(40px, 6vw, 72px);
        }

        .impact-eyebrow {
          display: inline-flex;
          align-items: center;
          gap: 10px;
          font-size: 10px;
          font-weight: 700;
          letter-spacing: 0.18em;
          text-transform: uppercase;
          color: #ffab00;
          margin-bottom: 18px;
        }
        .impact-eyebrow-line {
          display: inline-block;
          width: 24px;
          height: 1px;
          background: rgba(255,171,0,0.5);
        }

        .impact-title {
          font-size: clamp(1.9rem, 3.2vw, 3.2rem);
          font-weight: 800;
          color: #0a1a0e;
          line-height: 1.1;
          letter-spacing: -0.022em;
          margin: 0 0 18px;
        }
        .impact-title .green { color: #046241; }

        .impact-subtitle {
          font-size: clamp(0.9rem, 1.3vw, 1.05rem);
          color: rgba(10,26,14,0.55);
          max-width: 520px;
          margin: 0 auto;
          line-height: 1.72;
        }

        /* ── Grid ── */
        .impact-grid {
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          gap: 0;
          border: 1px solid rgba(10,26,14,0.08);
          border-radius: 24px;
          overflow: hidden;
        }

        @media (max-width: 900px) {
          .impact-grid { grid-template-columns: repeat(2, 1fr); }
        }
        @media (max-width: 520px) {
          .impact-grid { grid-template-columns: 1fr; border-radius: 16px; }
        }

        /* ── Card ── */
        .is-card {
          position: relative;
          background: #fff;
          padding: 40px 28px 36px;
          cursor: default;
          border-right: 1px solid rgba(10,26,14,0.08);
          transition: background 0.2s ease;
        }
        .is-card:last-child { border-right: none; }
        .is-card--hovered { background: #f7fbf8; }

        /* top sweep line */
        .is-card__line {
          position: absolute;
          top: 0; left: 0;
          height: 2px;
          width: 0%;
          transition: width 0.4s cubic-bezier(0.22, 1, 0.36, 1);
        }
        .is-card--saffron .is-card__line { background: #ffab00; }
        .is-card--green   .is-card__line { background: #046241; }
        .is-card--hovered .is-card__line { width: 100%; }

        /* tag — same as .lw-block-label from About */
        .is-card__tag {
          font-size: 10px;
          font-weight: 700;
          letter-spacing: 0.18em;
          text-transform: uppercase;
          margin: 0 0 14px;
        }
        .is-card__tag--saffron { color: #ffab00; }
        .is-card__tag--green   { color: #046241; }

        /* number */
        .is-card__number {
          font-size: clamp(2.6rem, 4vw, 3.6rem);
          font-weight: 800;
          color: #0a1a0e;
          line-height: 1;
          margin-bottom: 10px;
          font-variant-numeric: tabular-nums;
          letter-spacing: -0.02em;
        }
        .is-card__suffix {
          font-size: 0.5em;
          font-weight: 800;
          margin-left: 2px;
        }
        .is-card--saffron .is-card__suffix { color: #ffab00; }
        .is-card--green   .is-card__suffix { color: #046241; }

        /* label */
        .is-card__label {
          font-size: clamp(0.85rem, 1.2vw, 1rem);
          font-weight: 500;
          color: rgba(10,26,14,0.70);
          line-height: 1.45;
          margin: 0 0 20px;
        }

        /* divider */
        .is-card__divider {
          width: 28px;
          height: 1px;
          opacity: 0.4;
          margin-bottom: 16px;
          transition: width 0.3s ease, opacity 0.3s ease;
        }
        .is-card--saffron .is-card__divider { background: #ffab00; }
        .is-card--green   .is-card__divider { background: #046241; }
        .is-card--hovered .is-card__divider { width: 48px; opacity: 0.7; }

        /* description — pure CSS, no JS animation */
        .is-card__desc {
          font-size: 0.83rem;
          color: transparent;
          line-height: 1.72;
          max-height: 0;
          overflow: hidden;
          margin: 0;
          transition: max-height 0.35s cubic-bezier(0.22, 1, 0.36, 1),
                      color 0.25s ease;
        }
        .is-card__desc--open {
          max-height: 220px;
          color: rgba(10,26,14,0.52);
        }
      `}</style>

      <section className="impact-section">
        <div className="impact-inner">

          <div ref={headerRef} className="impact-header">
            <motion.div
              className="impact-eyebrow"
              initial={{ opacity: 0, y: 10 }}
              animate={headerInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.45 }}
            >
              <span className="impact-eyebrow-line" />
              Our Reach
              <span className="impact-eyebrow-line" />
            </motion.div>

            <motion.h2
              className="impact-title"
              initial={{ opacity: 0, y: 18 }}
              animate={headerInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.5, delay: 0.08 }}
            >
              Global <span className="green">Scale</span>
            </motion.h2>

            <motion.p
              className="impact-subtitle"
              initial={{ opacity: 0, y: 14 }}
              animate={headerInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.5, delay: 0.15 }}
            >
              By connecting local expertise with our global AI data infrastructure,
              we create opportunities, empower communities, and drive inclusive growth worldwide.
            </motion.p>
          </div>

          <div className="impact-grid">
            {stats.map((stat, i) => (
              <StatCard key={i} stat={stat} index={i} />
            ))}
          </div>

        </div>
      </section>
    </>
  )
}

export default ImpactStats