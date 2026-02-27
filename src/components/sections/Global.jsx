import { motion } from "framer-motion";

const locations = [
  {
    region: "ASEAN",
    countries: ["Singapore", "Thailand", "Vietnam", "Indonesia", "Malaysia"],
    highlight: true,
    label: "Primary Hub",
  },
  {
    region: "China",
    countries: ["Shanghai", "Beijing", "Shenzhen", "Hong Kong"],
    highlight: true,
    label: "China Operations",
  },
  {
    region: "Europe",
    countries: ["UK", "Germany", "France", "Netherlands"],
    highlight: false,
    label: "European Network",
  },
  {
    region: "Americas",
    countries: ["USA", "Canada", "Mexico", "Brazil"],
    highlight: false,
    label: "Americas Region",
  },
];

const stats = [
  { value: "20+", label: "Years of Excellence" },
  { value: "30+", label: "Countries Served" },
  { value: "4", label: "Global Regions" },
];

const GlobalPresence = () => {
  return (
    <>
      <style>{`
        .gp-section {
          position: relative;
          width: 100%;
          padding: clamp(64px, 10vw, 128px) 0;
          background: #fff;
          overflow: hidden;
        }

        .gp-bg-accent {
          position: absolute;
          top: 0; right: 0;
          width: 33%;
          height: 100%;
          background: rgba(4, 98, 65, 0.018);
          transform: skewX(-12deg) translateX(25%);
          pointer-events: none;
        }

        .gp-container {
          max-width: 1440px;
          margin: 0 auto;
          padding: 0 clamp(24px, 6vw, 80px);
        }

        .gp-header {
          margin-bottom: clamp(40px, 6vw, 72px);
        }

        .gp-label {
          display: inline-flex;
          align-items: center;
          gap: 10px;
          font-size: 10px;
          font-weight: 700;
          letter-spacing: 0.18em;
          text-transform: uppercase;
          color: #ffab00;
          margin-bottom: 16px;
        }

        .gp-label::before {
          content: '';
          display: block;
          width: 20px;
          height: 2px;
          background: #ffab00;
          border-radius: 2px;
        }

        .gp-title {
          font-size: clamp(1.9rem, 3.2vw, 3.2rem);
          font-weight: 800;
          color: #0a1a0e;
          line-height: 1.1;
          letter-spacing: -0.022em;
          margin: 0 0 16px;
        }

        .gp-title .green { color: #046241; }

        .gp-subtitle {
          font-size: clamp(0.9rem, 1.3vw, 1.05rem);
          color: rgba(10, 26, 14, 0.55);
          line-height: 1.72;
          max-width: 520px;
          margin: 0;
        }

        .gp-grid {
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          gap: 1.5px;
          background: rgba(10, 26, 14, 0.08);
          border: 1.5px solid rgba(10, 26, 14, 0.08);
          border-radius: 20px;
          overflow: hidden;
          margin-bottom: clamp(32px, 5vw, 56px);
        }

        @media (max-width: 900px) {
          .gp-grid { grid-template-columns: repeat(2, 1fr); }
        }
        @media (max-width: 560px) {
          .gp-grid { grid-template-columns: 1fr; }
        }

        .gp-card {
          background: #fff;
          padding: clamp(24px, 3vw, 40px);
          display: flex;
          flex-direction: column;
          gap: 12px;
          position: relative;
          overflow: hidden;
          transition: background 0.2s ease;
        }

        .gp-card:hover {
          background: rgba(4, 98, 65, 0.025);
        }

        .gp-card-top {
          display: flex;
          align-items: flex-start;
          justify-content: space-between;
          gap: 8px;
        }

        .gp-card-region {
          font-size: clamp(1.15rem, 1.8vw, 1.4rem);
          font-weight: 800;
          color: #0a1a0e;
          line-height: 1.1;
          letter-spacing: -0.01em;
          margin: 0;
        }

        .gp-card-badge {
          flex-shrink: 0;
          font-size: 9px;
          font-weight: 700;
          letter-spacing: 0.14em;
          text-transform: uppercase;
          color: #046241;
          background: rgba(4, 98, 65, 0.08);
          padding: 3px 8px;
          border-radius: 999px;
        }

        .gp-card-label {
          font-size: 10px;
          font-weight: 700;
          letter-spacing: 0.15em;
          text-transform: uppercase;
          color: rgba(10, 26, 14, 0.35);
          margin: 0;
        }

        .gp-card-countries {
          font-size: clamp(0.82rem, 1.1vw, 0.92rem);
          color: rgba(10, 26, 14, 0.55);
          line-height: 1.7;
          margin: 0;
        }

        .gp-card-dot {
          position: absolute;
          bottom: 20px;
          right: 20px;
          width: 8px;
          height: 8px;
          border-radius: 50%;
          background: rgba(10, 26, 14, 0.12);
        }

        .gp-card.primary .gp-card-dot {
          background: #046241;
          box-shadow: 0 0 0 4px rgba(4, 98, 65, 0.12);
        }

        .gp-stats {
          display: flex;
          align-items: center;
          gap: clamp(24px, 5vw, 64px);
          flex-wrap: wrap;
        }

        .gp-stat-divider {
          width: 1px;
          height: 36px;
          background: rgba(10, 26, 14, 0.1);
          flex-shrink: 0;
        }

        @media (max-width: 560px) {
          .gp-stat-divider { display: none; }
        }

        .gp-stat-value {
          font-size: clamp(1.6rem, 3vw, 2.4rem);
          font-weight: 800;
          color: #0a1a0e;
          line-height: 1;
          letter-spacing: -0.02em;
        }

        .gp-stat-value .green { color: #046241; }

        .gp-stat-label {
          font-size: 10px;
          font-weight: 700;
          letter-spacing: 0.15em;
          text-transform: uppercase;
          color: rgba(10, 26, 14, 0.40);
          margin-top: 6px;
        }
      `}</style>

      <section className="gp-section">
        <div className="gp-bg-accent" />

        <div className="gp-container">

          {/* Header */}
          <motion.div
            className="gp-header"
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
            viewport={{ once: true }}
          >
            <p className="gp-label">Global Presence</p>
            <h2 className="gp-title">
              A World of <span className="green">Opportunity</span>
            </h2>
            <p className="gp-subtitle">
              Strategic presence across key markets, bridging East and West with precision and depth.
            </p>
          </motion.div>

          {/* Cards */}
          <motion.div
            className="gp-grid"
            initial={{ opacity: 0, y: 32 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1, ease: [0.22, 1, 0.36, 1] }}
            viewport={{ once: true }}
          >
            {locations.map((loc, i) => (
              <motion.div
                key={loc.region}
                className={`gp-card ${loc.highlight ? "primary" : ""}`}
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.15 + i * 0.07, ease: [0.22, 1, 0.36, 1] }}
                viewport={{ once: true }}
              >
                <p className="gp-card-label">{loc.label}</p>
                <div className="gp-card-top">
                  <p className="gp-card-region">{loc.region}</p>
                  {loc.highlight && <span className="gp-card-badge">Primary</span>}
                </div>
                <p className="gp-card-countries">{loc.countries.join(" · ")}</p>
                <div className="gp-card-dot" />
              </motion.div>
            ))}
          </motion.div>

          {/* Stats */}
          <motion.div
            className="gp-stats"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            viewport={{ once: true }}
          >
            {stats.map((stat, i) => (
              <div key={stat.label} style={{ display: "contents" }}>
                {i > 0 && <div className="gp-stat-divider" />}
                <div>
                  <div className="gp-stat-value">
                    {stat.value.replace("+", "")}<span className="green">+</span>
                  </div>
                  <div className="gp-stat-label">{stat.label}</div>
                </div>
              </div>
            ))}
          </motion.div>

        </div>
      </section>
    </>
  );
};

export default GlobalPresence;