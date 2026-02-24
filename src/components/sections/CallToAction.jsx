import { motion } from "framer-motion";

// CTA Section — color scheme aligned with Hero (saffron / black / dark teal-green)
const CTA = ({ onNavigate = () => {}, onSetAuthMode = () => {} }) => {
  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Manrope:wght@700;800&display=swap');

        .cta-section {
          position: relative;
          padding: 120px 0;
          overflow: hidden;
          background: #133020;
        }

        /* Gradient from #133020 — deep forest green fading to near-black */
        .cta-bg {
          position: absolute;
          inset: 0;
          z-index: 0;
          background: linear-gradient(
            135deg,
            #133020 0%,
            #0d2218 40%,
            #081510 70%,
            #030a06 100%
          );
        }

        /* Saffron glow — mirrors Hero's left-side warmth */
        .cta-glow-saffron {
          position: absolute;
          width: 480px;
          height: 480px;
          border-radius: 50%;
          background: radial-gradient(circle, rgba(255, 171, 0, 0.10) 0%, transparent 70%);
          top: -80px;
          left: -120px;
          filter: blur(90px);
          z-index: 1;
          pointer-events: none;
        }

        /* Green glow — brightens the #133020 tone at bottom-right */
        .cta-glow-green {
          position: absolute;
          width: 560px;
          height: 560px;
          border-radius: 50%;
          background: radial-gradient(circle, rgba(19, 48, 32, 0.7) 0%, transparent 70%);
          bottom: -120px;
          right: -100px;
          filter: blur(100px);
          z-index: 1;
          pointer-events: none;
        }

        .container {
          position: relative;
          z-index: 2;
          max-width: 900px;
          margin: 0 auto;
          padding: 0 24px;
        }

        .cta-content {
          text-align: center;
        }

        /* Eyebrow — saffron accent to match Hero eyebrow style */
        .cta-eyebrow {
          display: inline-flex;
          align-items: center;
          gap: 10px;
          font-size: 11px;
          font-weight: 700;
          letter-spacing: 0.16em;
          text-transform: uppercase;
          color: rgba(255, 255, 255, 0.45);
          margin-bottom: 24px;
        }
        .cta-eyebrow-line {
          display: inline-block;
          width: 24px;
          height: 1px;
          background: rgba(255, 171, 0, 0.6);
          border-radius: 2px;
        }

        /* Headline */
        .cta-content h2 {
          font-family: 'Manrope', sans-serif;
          font-size: clamp(2rem, 4.5vw, 3.4rem);
          font-weight: 800;
          line-height: 1.1;
          letter-spacing: -0.025em;
          color: #fff;
          margin: 0 0 20px;
          max-width: 780px;
          margin-left: auto;
          margin-right: auto;
        }

        /* Gradient sweep on the accent phrase — matches Hero's hero-gradient-text */
        .cta-gradient-text {
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
          font-style: italic;
          animation: cta-gradient-sweep 2.4s ease forwards;
          animation-delay: 0.4s;
          opacity: 0;
        }

        @keyframes cta-gradient-sweep {
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

        .cta-content p {
          font-size: 1.08rem;
          line-height: 1.78;
          color: rgba(255, 255, 255, 0.6);
          max-width: 560px;
          margin: 0 auto 44px;
        }

        /* Buttons */
        .cta-buttons {
          display: flex;
          gap: 14px;
          justify-content: center;
          flex-wrap: wrap;
        }

        /* Primary — saffron, matches Hero's btn-ignite */
        .btn-primary {
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
          box-shadow: 0 6px 24px rgba(255, 171, 0, 0.32);
          transition: background 0.2s ease, box-shadow 0.2s ease, transform 0.15s ease;
        }
        .btn-primary:hover {
          background: #ffc030;
          box-shadow: 0 10px 36px rgba(255, 171, 0, 0.52);
          transform: translateY(-2px);
        }
        .btn-primary:active {
          transform: scale(0.97);
        }

        /* Secondary — ghost, matches Hero's btn-edge */
        .btn-secondary {
          display: inline-flex;
          align-items: center;
          gap: 10px;
          padding: 14px 34px;
          border-radius: 999px;
          border: 1.5px solid rgba(255, 255, 255, 0.38);
          cursor: pointer;
          font-weight: 700;
          font-size: 15px;
          background: transparent;
          color: rgba(255, 255, 255, 0.88);
          transition: background 0.2s ease, border-color 0.2s ease,
                      color 0.2s ease, transform 0.15s ease;
        }
        .btn-secondary:hover {
          background: rgba(255, 171, 0, 0.10);
          border-color: #ffab00;
          color: #ffab00;
          transform: translateY(-2px);
        }
        .btn-secondary:active {
          transform: scale(0.97);
        }

        /* Top divider — saffron tint */
        .cta-divider {
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          height: 1px;
          background: linear-gradient(90deg, transparent, rgba(255, 171, 0, 0.25), transparent);
        }
      `}</style>

      <section className="cta-section">
        <div className="cta-bg" />
        <div className="cta-glow-saffron" />
        <div className="cta-glow-green" />
        <div className="cta-divider" />

        <div className="container">
          <motion.div
            className="cta-content"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
          >
            <div className="cta-eyebrow">
              <span className="cta-eyebrow-line" />
              Data Engineering for AI
              <span className="cta-eyebrow-line" />
            </div>

            <h2>
              The World's Most Ambitious AI Starts With{" "}
              <span className="cta-gradient-text">Better Data.</span>
            </h2>

            <p>
              Lifewood engineers the scalable, production-ready data
              foundations that turn AI ambition into real-world results.
            </p>

            <div className="cta-buttons">
              <button
                type="button"
                className="btn-primary"
                onClick={() => {
                  onSetAuthMode("signin");
                  onNavigate("/get-started");
                }}
              >
                Build Your Foundation
                <svg width="16" height="16" viewBox="0 0 20 20" fill="none">
                  <path
                    d="M4 10H16M16 10L11 5M16 10L11 15"
                    stroke="currentColor"
                    strokeWidth="2.2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </button>

              <button
                type="button"
                className="btn-secondary"
                onClick={() => onNavigate("/contact-us")}
              >
                See Our Impact
              </button>
            </div>
          </motion.div>
        </div>
      </section>
    </>
  );
};

export default CTA;