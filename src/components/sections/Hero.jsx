import { motion, useScroll, useTransform } from 'framer-motion'
import Hyperspeed from '../animations/Hyperspeed'

// ─── Lifewood "Data Stream" effect options ────────────────────────────────────
const lifewoodOptions = {
  distortion: 'turbulentDistortion',
  length: 400,
  roadWidth: 20,
  islandWidth: 2,
  lanesPerRoad: 4,
  fov: 90,
  fovSpeedUp: 120,
  speedUp: 3,
  carLightsFade: 0.5,
  totalSideLightSticks: 60,
  lightPairsPerRoadWay: 50,
  shoulderLinesWidthPercentage: 0.05,
  brokenLinesWidthPercentage: 0.1,
  brokenLinesLengthPercentage: 0.5,
  lightStickWidth: [0.1, 0.3],
  lightStickHeight: [1.5, 2.5],
  movingAwaySpeed: [40, 70],
  movingCloserSpeed: [-100, -140],
  carLightsLength: [400 * 0.05, 400 * 0.2],
  carLightsRadius: [0.03, 0.1],
  carWidthPercentage: [0.2, 0.4],
  carShiftX: [-0.5, 0.5],
  carFloorSeparation: [0.0, 3],
  colors: {
    roadColor: 0x050a05,
    islandColor: 0x050a05,
    background: 0x000000,
    shoulderLines: 0x113311,
    brokenLines: 0x113311,
    leftCars:  [0xffab00, 0xffd200, 0xffe082],
    rightCars: [0x004d40, 0x00695c, 0x26a69a],
    sticks: 0xffab00,
  },
}

// ─── Hero ─────────────────────────────────────────────────────────────────────
const Hero = ({ onNavigate = () => {} }) => {
  const { scrollY } = useScroll()
  const y1 = useTransform(scrollY, [0, 500], [0, 150])
  const y2 = useTransform(scrollY, [0, 500], [0, -100])

  return (
    <>
      <style>{`
        /* ── Hero section ── */
        .hero {
          position: relative;
          width: 100%;
          height: 100vh;
          min-height: 640px;
          overflow: hidden;
          display: flex;
          align-items: center;
          justify-content: center;
          background: #000;
        }

        /* ── Force Hyperspeed canvas to fill the section ── */
        #lights,
        #lights > div,
        #lights canvas {
          position: absolute !important;
          top: 0 !important; left: 0 !important;
          width: 100% !important;
          height: 100% !important;
        }

        /* ── Edge vignette ── */
        .hero-vignette {
          position: absolute;
          inset: 0;
          z-index: 1;
          pointer-events: none;
          background: radial-gradient(
            ellipse 80% 80% at 50% 50%,
            transparent 25%,
            rgba(0,0,0,0.45) 65%,
            rgba(0,0,0,0.82) 100%
          );
        }

        .hero-bottom-fade {
          position: absolute;
          bottom: 0; left: 0; right: 0;
          height: 40%;
          z-index: 1;
          pointer-events: none;
          background: linear-gradient(to top, rgba(0,0,0,0.65) 0%, transparent 100%);
        }

        /* ── Content ── */
        .hero-content {
          position: relative;
          z-index: 2;
          text-align: center;
          padding: 0 24px;
          max-width: 820px;
          width: 100%;
        }

        /* ── Eyebrow ── */
        .hero-eyebrow {
          display: inline-flex;
          align-items: center;
          gap: 10px;
          font-size: 11px;
          font-weight: 700;
          letter-spacing: 0.14em;
          text-transform: uppercase;
          color: rgba(255,255,255,0.45);
          margin-bottom: 22px;
        }
        .hero-eyebrow-line {
          display: inline-block;
          width: 24px;
          height: 1px;
          background: rgba(255,171,0,0.6);
          border-radius: 2px;
        }

        /* ── Headline ── */
        .hero-title {
          font-size: clamp(2.6rem, 5.8vw, 4.4rem);
          font-weight: 800;
          line-height: 1.08;
          color: #fff;
          margin: 0 0 28px;
          letter-spacing: -0.025em;
        }

        /* ── GradientText — the animated saffron→white→green sweep ── */
        .hero-gradient-text {
          /* Paint a wide gradient across the text */
          background: linear-gradient(
            90deg,
            #ffffff   0%,
            #ffab00  30%,
            #ffd200  50%,
            #ffab00  70%,
            #ffffff  100%
          );
          background-size: 200% auto;
          -webkit-background-clip: text;
          background-clip: text;
          -webkit-text-fill-color: transparent;
          color: transparent;
          /* Sweep animation — plays once on load */
          animation: gradient-sweep 2.4s ease forwards;
          animation-delay: 0.6s;
          /* Start invisible until the animation kicks in */
          opacity: 0;
        }

        @keyframes gradient-sweep {
          0% {
            background-position: 200% center;
            opacity: 0;
          }
          15% {
            opacity: 1;
          }
          100% {
            background-position: 0% center;
            opacity: 1;
          }
        }

        /* ── Subtitle ── */
        .hero-subtitle {
          font-size: clamp(1rem, 1.8vw, 1.15rem);
          font-weight: 400;
          line-height: 1.78;
          color: rgba(255,255,255,0.68);
          margin: 0 auto 44px;
          max-width: 580px;
        }

        /* ── CTAs ── */
        .hero-cta {
          display: flex;
          gap: 14px;
          justify-content: center;
          flex-wrap: wrap;
        }

        .btn-ignite {
          display: inline-flex;
          align-items: center;
          gap: 10px;
          padding: 14px 34px;
          border-radius: 999px;
          border: none;
          cursor: pointer;
          font-weight: 700;
          font-size: 15px;
          background: #ffab00;
          color: #0a1a0e;
          box-shadow: 0 6px 24px rgba(255,171,0,0.32);
          transition: background 0.2s ease, box-shadow 0.2s ease, transform 0.15s ease;
        }
        .btn-ignite:hover {
          background: #ffc030;
          box-shadow: 0 10px 36px rgba(255,171,0,0.52);
          transform: translateY(-2px);
        }
        .btn-ignite:active { transform: scale(0.97); }

        .btn-edge {
          display: inline-flex;
          align-items: center;
          gap: 10px;
          padding: 14px 34px;
          border-radius: 999px;
          border: 1.5px solid rgba(255,255,255,0.38);
          cursor: pointer;
          font-weight: 700;
          font-size: 15px;
          background: transparent;
          color: rgba(255,255,255,0.88);
          transition: background 0.2s ease, border-color 0.2s ease,
                      color 0.2s ease, transform 0.15s ease;
        }
        .btn-edge:hover {
          background: rgba(255,171,0,0.10);
          border-color: #ffab00;
          color: #ffab00;
          transform: translateY(-2px);
        }
        .btn-edge:active { transform: scale(0.97); }
      `}</style>

      <section className="hero">

        {/* ── Hyperspeed canvas ── */}
        <div
          id="lights"
          role="img"
          aria-label="Visualization of global AI data flow representing Lifewood's worldwide data engineering operations"
          style={{ position: 'absolute', inset: 0, zIndex: 0 }}
        >
          {/* Hidden SEO copy */}
          <span style={{
            position: 'absolute', width: '1px', height: '1px',
            padding: 0, margin: '-1px', overflow: 'hidden',
            clip: 'rect(0,0,0,0)', whiteSpace: 'nowrap', border: 0,
          }}>
            Visualization of global data flow. Lifewood has delivered
            high-fidelity AI training data since 2004 — data labeling, multimodal
            annotation, and data engineering at global scale.
          </span>

          <Hyperspeed effectOptions={lifewoodOptions} />
        </div>

        {/* Overlays */}
        <div className="hero-vignette" />
        <div className="hero-bottom-fade" />

        {/* Parallax shapes */}
        <motion.div style={{ y: y1 }} className="hero-shape shape-1" />
        <motion.div style={{ y: y2 }} className="hero-shape shape-2" />

        {/* ── Content ── */}
        <div className="hero-content">

          {/* Eyebrow */}
          <motion.div
            className="hero-eyebrow"
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.15 }}
          >
            {/* <span className="hero-eyebrow-line" />
            Trusted since 2004
            <span className="hero-eyebrow-line" /> */}
          </motion.div>

          {/* Headline — first line fades in, second line gets the gradient sweep */}
          <motion.h1
            className="hero-title"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.75, delay: 0.25 }}
          >
            Intelligence at<br />
            {/* GradientText: saffron shimmer sweeps left→right on load */}
            <span className="hero-gradient-text">
              Hyperspeed.
            </span>
          </motion.h1>

          {/* Subtitle */}
          <motion.p
            className="hero-subtitle"
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.75, delay: 0.45 }}
          >
            Precision data for the models of tomorrow. Since 2004, we've provided
            the high-fidelity human insight that fuels the world's most powerful AI.
          </motion.p>

          {/* CTAs */}
          <motion.div
            className="hero-cta"
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.75, delay: 0.6 }}
          >
            <button
              type="button"
              className="btn-ignite"
              onClick={() => onNavigate('/data-service')}
            >
              Ignite Your Data
              <svg width="16" height="16" viewBox="0 0 20 20" fill="none">
                <path d="M4 10H16M16 10L11 5M16 10L11 15"
                  stroke="currentColor" strokeWidth="2.2"
                  strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </button>

            <button
              type="button"
              className="btn-edge"
              onClick={() => onNavigate('/about')}
            >
              See the Human Edge
            </button>
          </motion.div>

        </div>
      </section>
    </>
  )
}

export default Hero