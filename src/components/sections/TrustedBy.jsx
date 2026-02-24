import { useState } from 'react'
import { motion } from 'framer-motion'

const partners = [
  { name: 'Ancestry',         colorLogo: '/partners/ancestry-1.png',      monoLogo: '/partners/ancestry-2.png' },
  { name: 'Apple',            colorLogo: '/partners/apple-1.png',          monoLogo: '/partners/apple-2.png' },
  { name: 'BYU Pathway',      colorLogo: '/partners/byu-1.png',            monoLogo: '/partners/byu-2.png' },
  { name: 'FamilySearch',     colorLogo: '/partners/familysearch-1.png',   monoLogo: '/partners/familysearch-2.png' },
  { name: 'Google',           colorLogo: '/partners/google-1.png',         monoLogo: '/partners/google-2.png' },
  { name: 'Microsoft',        colorLogo: '/partners/microsoft-1.png',      monoLogo: '/partners/microsoft-2.png' },
  { name: 'Moore Foundation', colorLogo: '/partners/moore-1.png',          monoLogo: '/partners/moore-2.png' },
]

const PartnerLogo = ({ partner, onHoverStart, onHoverEnd }) => {
  const [hovered, setHovered] = useState(false)

  return (
    <div
      className="tb-logo-wrap"
      onMouseEnter={() => { setHovered(true); onHoverStart() }}
      onMouseLeave={() => { setHovered(false); onHoverEnd() }}
    >
      <img
        src={hovered ? partner.colorLogo : partner.monoLogo}
        alt={partner.name}
        className={`tb-logo ${hovered ? 'tb-logo--hovered' : ''}`}
      />
    </div>
  )
}

const TrustedBy = () => {
  const [marqueePaused, setMarqueePaused] = useState(false)

  return (
    <>
      <style>{`
        .trusted-by {
          width: 100%;
          background: #ffffff;
          padding: 56px 0 60px;
          border-top: 1px solid rgba(0,0,0,0.06);
          border-bottom: 1px solid rgba(0,0,0,0.06);
        }

        .tb-label {
          text-align: center;
          font-size: 10px;
          font-weight: 700;
          letter-spacing: 0.22em;
          text-transform: uppercase;
          color: rgba(0,0,0,0.35);
          margin-bottom: 36px;
        }

        .tb-track {
          overflow: hidden;
          -webkit-mask-image: linear-gradient(
            to right,
            transparent 0%,
            black 8%,
            black 92%,
            transparent 100%
          );
          mask-image: linear-gradient(
            to right,
            transparent 0%,
            black 8%,
            black 92%,
            transparent 100%
          );
        }

        .tb-inner {
          display: flex;
          gap: 80px;
          align-items: center;
          white-space: nowrap;
          animation: tb-scroll 24s linear infinite;
          will-change: transform;
        }

        .tb-inner.paused {
          animation-play-state: paused;
        }

        @keyframes tb-scroll {
          0%   { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }

        .tb-logo-wrap {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          min-width: 200px;
          cursor: default;
          overflow: visible;
        }

        .tb-logo {
          height: 52px;
          object-fit: contain;
          filter: grayscale(100%) brightness(0.55);
          transition:
            filter 0.4s cubic-bezier(0.23, 1, 0.32, 1),
            transform 0.4s cubic-bezier(0.23, 1, 0.32, 1);
        }

        .tb-logo--hovered {
          filter: grayscale(0%) brightness(1);
          transform: scale(1.18);
        }
      `}</style>

      <motion.section
        className="trusted-by"
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.3 }}
        transition={{ duration: 0.7, ease: 'easeOut' }}
      >
        <p className="tb-label">Trusted by global AI innovators</p>

        <div className="tb-track">
          <div className={`tb-inner ${marqueePaused ? 'paused' : ''}`}>
            {[...partners, ...partners].map((partner, i) => (
              <PartnerLogo
                key={i}
                partner={partner}
                onHoverStart={() => setMarqueePaused(true)}
                onHoverEnd={() => setMarqueePaused(false)}
              />
            ))}
          </div>
        </div>
      </motion.section>
    </>
  )
}

export default TrustedBy