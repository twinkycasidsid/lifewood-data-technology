import { useState, useEffect, useRef } from 'react'
import { motion } from 'framer-motion'

// ─── Photos for the carousel (replace with real Lifewood images) ──────────────
const PHOTOS = [
  {
    src: 'https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&w=1200&q=80',
    label: 'Our Global Team',
  },
  {
    src: 'https://images.unsplash.com/photo-1600880292203-757bb62b4baf?auto=format&fit=crop&w=1200&q=80',
    label: 'Data Operations Center',
  },
  {
    src: 'https://images.unsplash.com/photo-1573164713988-8665fc963095?auto=format&fit=crop&w=1200&q=80',
    label: 'Annotation Specialists',
  },
  {
    src: 'https://images.unsplash.com/photo-1552664730-d307ca884978?auto=format&fit=crop&w=1200&q=80',
    label: 'Strategy & Innovation',
  },
  {
    src: 'https://images.unsplash.com/photo-1531482615713-2afd69097998?auto=format&fit=crop&w=1200&q=80',
    label: 'Community Impact',
  },
]

const About = ({ onNavigate = () => {} }) => {
  const [activeSlide, setActiveSlide] = useState(0)
  const timerRef = useRef(null)

  const startTimer = () => {
    clearInterval(timerRef.current)
    timerRef.current = setInterval(
      () => setActiveSlide((p) => (p + 1) % PHOTOS.length),
      4000
    )
  }

  useEffect(() => {
    startTimer()
    return () => clearInterval(timerRef.current)
  }, [])

  const goTo = (i) => { setActiveSlide(i); startTimer() }
  const prev = () => goTo((activeSlide - 1 + PHOTOS.length) % PHOTOS.length)
  const next = () => goTo((activeSlide + 1) % PHOTOS.length)

  return (
    <>
      <style>{`
        /* ── Section ── */
        .lw-about {
          position: relative;
          width: 100%;
          padding: clamp(76px, 9vw, 132px) 0 clamp(68px, 8vw, 112px);
          background: linear-gradient(180deg, #ffffff 0%, #fbfdfc 100%);
          overflow: hidden;
          border-bottom: 1px solid rgba(4, 98, 65, 0.08);
        }

        /* Subtle skewed background accent */
        .lw-about-bg {
          position: absolute;
          top: 0; right: 0;
          width: 33%;
          height: 100%;
          background: rgba(4, 98, 65, 0.018);
          transform: skewX(-12deg) translateX(25%);
          pointer-events: none;
        }

        /* ── Container ── */
        .lw-about-container {
          max-width: 1280px;
          margin: 0 auto;
          padding: 0 clamp(24px, 6vw, 80px);
        }

        /* ── Two-column flex ── */
        .lw-about-grid {
          display: flex;
          flex-direction: row;
          align-items: center;
          gap: clamp(32px, 5vw, 80px);
        }

        /* ════════════════════════════════
           LEFT — image / carousel
        ════════════════════════════════ */
        .lw-about-visual {
          flex: 0 0 55%;
          position: relative;
          order: 1;
        }

        /* Rounded image frame */
        .lw-about-frame {
          position: relative;
          aspect-ratio: 4 / 3;
          border-radius: 40px;
          overflow: hidden;
          background: #0a1a0e;
          box-shadow: 0 32px 80px -20px rgba(0,0,0,0.18);
          cursor: pointer;
        }

        /* Carousel slides */
        .lw-slide {
          position: absolute;
          inset: 0;
          opacity: 0;
          transition: opacity 0.75s ease;
        }
        .lw-slide.active { opacity: 1; }
        .lw-slide img {
          width: 100%; height: 100%;
          object-fit: cover;
          display: block;
          opacity: 0.82;
          transition: transform 1s ease;
        }
        .lw-about-frame:hover .lw-slide.active img {
          transform: scale(1.04);
        }

        /* Bottom gradient on image */
        .lw-slide-overlay {
          position: absolute;
          inset: 0;
          background: linear-gradient(
            to top,
            rgba(10,26,14,0.65) 0%,
            transparent 55%
          );
        }

        /* Slide label bottom-left */
        .lw-slide-label {
          position: absolute;
          bottom: 28px;
          left: 32px;
          z-index: 2;
        }
        .lw-slide-label span {
          display: block;
          font-size: 10px;
          font-weight: 700;
          letter-spacing: 0.18em;
          text-transform: uppercase;
          color: rgba(255,255,255,0.55);
          margin-bottom: 4px;
        }
        .lw-slide-label strong {
          font-size: 17px;
          font-weight: 700;
          color: #fff;
        }

        /* ── Dot controls ── */
        .lw-carousel-controls {
          position: absolute;
          bottom: 28px;
          right: 28px;
          z-index: 3;
          display: flex;
          align-items: center;
          gap: 6px;
        }
        .lw-dot {
          width: 6px; height: 6px;
          border-radius: 50%;
          border: none;
          background: rgba(255,255,255,0.30);
          cursor: pointer;
          padding: 0;
          transition: background 0.25s ease, width 0.25s ease;
        }
        .lw-dot.active {
          background: #ffab00;
          width: 20px;
          border-radius: 3px;
        }

        /* Prev / Next arrow buttons */
        .lw-arrow {
          position: absolute;
          top: 50%;
          transform: translateY(-50%);
          width: 38px; height: 38px;
          border-radius: 50%;
          border: 1px solid rgba(255,255,255,0.22);
          background: rgba(10,26,14,0.45);
          backdrop-filter: blur(8px);
          color: rgba(255,255,255,0.80);
          cursor: pointer;
          display: flex; align-items: center; justify-content: center;
          transition: border-color 0.2s, background 0.2s, color 0.2s;
          z-index: 3;
        }
        .lw-arrow:hover {
          border-color: #ffab00;
          color: #ffab00;
          background: rgba(10,26,14,0.70);
        }
        .lw-arrow-prev { left: 16px; }
        .lw-arrow-next { right: 16px; }

        /* Decorative blur blob */
        .lw-about-blob {
          position: absolute;
          top: -40px; left: -40px;
          width: 160px; height: 160px;
          border-radius: 50%;
          background: rgba(4,98,65,0.06);
          filter: blur(40px);
          pointer-events: none;
        }

        /* ════════════════════════════════
           RIGHT — copy
        ════════════════════════════════ */
        .lw-about-copy {
          flex: 1;
          order: 2;
          display: flex;
          flex-direction: column;
          gap: 0;
        }

        .lw-about-h2 {
          font-size: clamp(1.9rem, 3.2vw, 3.2rem);
          font-weight: 800;
          color: #0a1a0e;
          line-height: 1.1;
          letter-spacing: -0.022em;
          margin: 0 0 clamp(28px, 4vw, 48px);
        }
        .lw-about-h2 .green {
          color: #046241;
        }

        /* Content blocks */
        .lw-about-blocks {
          display: flex;
          flex-direction: column;
          gap: clamp(24px, 3.5vw, 40px);
        }

        .lw-about-block {}
        .lw-block-label {
          font-size: 10px;
          font-weight: 700;
          letter-spacing: 0.18em;
          text-transform: uppercase;
          margin-bottom: 10px;
        }
        .lw-block-label.saffron { color: #ffab00; }
        .lw-block-label.green   { color: #046241; }
        .lw-block-label.muted   { color: rgba(10,26,14,0.38); }

        .lw-block-text-lg {
          font-size: clamp(1rem, 1.6vw, 1.3rem);
          font-weight: 500;
          color: rgba(10,26,14,0.78);
          line-height: 1.6;
          margin: 0;
        }
        .lw-block-text-lg .bold-underline {
          color: #0a1a0e;
          font-weight: 700;
          text-decoration: underline;
          text-decoration-color: rgba(255,171,0,0.35);
          text-decoration-thickness: 3px;
          text-underline-offset: 4px;
        }

        .lw-block-text-sm {
          font-size: clamp(0.9rem, 1.3vw, 1.05rem);
          color: rgba(10,26,14,0.55);
          line-height: 1.72;
          margin: 0;
        }
        .lw-block-text-sm .bold {
          color: #0a1a0e;
          font-weight: 600;
        }

        .lw-block-quote {
          font-size: clamp(0.88rem, 1.3vw, 1rem);
          color: rgba(10,26,14,0.52);
          line-height: 1.72;
          font-style: italic;
          margin: 0;
          padding-left: 20px;
          border-left: 2px solid rgba(255,171,0,0.28);
        }

        /* CTA */
        .lw-about-cta {
          margin-top: clamp(28px, 4vw, 44px);
        }
        .lw-about-btn {
          display: inline-flex;
          align-items: center;
          gap: 10px;
          padding: 13px 30px;
          border-radius: 999px;
          border: 1.5px solid rgba(10,26,14,0.20);
          background: transparent;
          color: rgba(10,26,14,0.75);
          font-weight: 700;
          font-size: 14px;
          cursor: pointer;
          transition: background 0.2s ease, border-color 0.2s ease,
                      color 0.2s ease, transform 0.15s ease;
        }
        .lw-about-btn:hover {
          background: rgba(4,98,65,0.06);
          border-color: #046241;
          color: #046241;
          transform: translateY(-2px);
        }
        .lw-about-btn:active { transform: scale(0.97); }

        /* ════════════════════════════════
           RESPONSIVE
        ════════════════════════════════ */
        @media (max-width: 1024px) {
          .lw-about-grid {
            flex-direction: column;
          }
          .lw-about-visual {
            flex: none;
            width: 100%;
            order: 2;
          }
          .lw-about-copy {
            order: 1;
          }
        }

        @media (max-width: 560px) {
          .lw-about-frame {
            border-radius: 24px;
          }
          .lw-slide-label {
            bottom: 20px; left: 20px;
          }
          .lw-arrow { display: none; }
        }
      `}</style>

      <section className="lw-about">
        <div className="lw-about-bg" />

        <div className="lw-about-container">
          <div className="lw-about-grid">

            {/* ══ LEFT — Carousel ══ */}
            <motion.div
              className="lw-about-visual"
              initial={{ opacity: 0, x: -48 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
              viewport={{ once: true }}
            >
              <div className="lw-about-blob" />

              <div className="lw-about-frame">
                {/* Slides */}
                {PHOTOS.map((photo, i) => (
                  <div key={i} className={`lw-slide ${i === activeSlide ? 'active' : ''}`}>
                    <img src={photo.src} alt={photo.label} loading="lazy" />
                    <div className="lw-slide-overlay" />
                    <div className="lw-slide-label">
                      <span>Watch the Story</span>
                      <strong>{photo.label}</strong>
                    </div>
                  </div>
                ))}

                {/* Prev / Next */}
                <button className="lw-arrow lw-arrow-prev" onClick={prev} aria-label="Previous">
                  <svg width="14" height="14" viewBox="0 0 20 20" fill="none">
                    <path d="M13 5L7 10L13 15" stroke="currentColor" strokeWidth="2.2"
                      strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </button>
                <button className="lw-arrow lw-arrow-next" onClick={next} aria-label="Next">
                  <svg width="14" height="14" viewBox="0 0 20 20" fill="none">
                    <path d="M7 5L13 10L7 15" stroke="currentColor" strokeWidth="2.2"
                      strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </button>

                {/* Dot indicators */}
                <div className="lw-carousel-controls">
                  {PHOTOS.map((_, i) => (
                    <button
                      key={i}
                      className={`lw-dot ${i === activeSlide ? 'active' : ''}`}
                      onClick={() => goTo(i)}
                      aria-label={`Slide ${i + 1}`}
                    />
                  ))}
                </div>
              </div>
            </motion.div>

            {/* ══ RIGHT — Copy ══ */}
            <motion.div
              className="lw-about-copy"
              initial={{ opacity: 0, x: 48 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.7, delay: 0.15, ease: [0.22, 1, 0.36, 1] }}
              viewport={{ once: true }}
            >
              <h2 className="lw-about-h2">
                Two Decades of<br />
                <span className="green">AI Excellence</span>
              </h2>

              <div className="lw-about-blocks">

                {/* Block 1 — Foundation */}
                <div className="lw-about-block">
                  <p className="lw-block-label saffron">The Foundation</p>
                  <p className="lw-block-text-lg">
                    Since 2004, we've combined{' '}
                    <span className="bold-underline">human expertise</span>{' '}
                    with advanced technology to build the world's most reliable AI training data.
                  </p>
                </div>

                {/* Block 2 — Global Reach */}
                <div className="lw-about-block">
                  <p className="lw-block-label green">Global Reach</p>
                  <p className="lw-block-text-sm">
                    Serving leaders in tech, finance, and e-commerce across{' '}
                    <span className="bold">30+ countries</span> with end-to-end data engineering,
                    annotation, and labeling solutions.
                  </p>
                </div>

                {/* Block 3 — Mission */}
                <div className="lw-about-block">
                  <p className="lw-block-label muted">The Mission</p>
                  <p className="lw-block-quote">
                    "We don't just process data. We empower communities and drive inclusive
                    growth — for the good of humankind."
                  </p>
                </div>

              </div>

              <div className="lw-about-cta">
                <button
                  type="button"
                  className="lw-about-btn"
                  onClick={() => onNavigate('/about')}
                >
                  Know Us Better
                  <svg width="14" height="14" viewBox="0 0 20 20" fill="none">
                    <path d="M4 10H16M16 10L11 5M16 10L11 15"
                      stroke="currentColor" strokeWidth="2.2"
                      strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </button>
              </div>
            </motion.div>

          </div>
        </div>
      </section>
    </>
  )
}

export default About
