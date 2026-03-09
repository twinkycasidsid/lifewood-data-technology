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

const PartnerLogo = ({ partner }) => {
  return (
    <div className="tb-logo-wrap">
      <img
        src={partner.monoLogo}
        alt={partner.name}
        className="tb-logo tb-logo--mono"
      />
      <img
        src={partner.colorLogo}
        alt=""
        aria-hidden="true"
        className="tb-logo tb-logo--color"
      />
    </div>
  )
}

const TrustedBy = () => {
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
          gap: clamp(28px, 6vw, 80px);
          align-items: center;
          white-space: nowrap;
          animation: tb-scroll 24s linear infinite;
          will-change: transform;
        }

        .tb-track:hover .tb-inner {
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
          min-width: clamp(120px, 30vw, 200px);
          cursor: default;
          overflow: visible;
          position: relative;
        }

        .tb-logo {
          height: 52px;
          object-fit: contain;
          transition:
            opacity 0.32s cubic-bezier(0.23, 1, 0.32, 1),
            filter 0.32s cubic-bezier(0.23, 1, 0.32, 1),
            transform 0.32s cubic-bezier(0.23, 1, 0.32, 1);
        }

        .tb-logo--mono {
          filter: grayscale(100%) brightness(0.55);
          opacity: 1;
        }

        .tb-logo--color {
          position: absolute;
          inset: auto;
          opacity: 0;
          filter: grayscale(0%) brightness(1);
        }

        .tb-logo-wrap:hover .tb-logo--mono {
          opacity: 0;
        }

        .tb-logo-wrap:hover .tb-logo--color {
          opacity: 1;
        }

        .tb-logo-wrap:hover .tb-logo {
          filter: grayscale(0%) brightness(1);
          transform: scale(1.12);
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
          <div className="tb-inner">
            {[...partners, ...partners].map((partner, i) => (
              <PartnerLogo key={i} partner={partner} />
            ))}
          </div>
        </div>
      </motion.section>
    </>
  )
}

export default TrustedBy
