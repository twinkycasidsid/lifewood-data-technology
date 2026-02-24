import { motion } from "framer-motion";

// Global Presence Section
const GlobalPresence = () => {
  const locations = [
    {
      region: "ASEAN",
      countries: ["Singapore", "Thailand", "Vietnam", "Indonesia", "Malaysia"],
      highlight: true,
    },
    {
      region: "China",
      countries: ["Shanghai", "Beijing", "Shenzhen", "Hong Kong"],
      highlight: true,
    },
    { region: "Europe", countries: ["UK", "Germany", "France", "Netherlands"] },
    { region: "Americas", countries: ["USA", "Canada", "Mexico", "Brazil"] },
  ];

  return (
    <section className="section global-section">
      <div className="container">
        <motion.div
          className="section-header text-center"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
        >
          <span className="section-label">Global Presence</span>
          <h2>
            A <span className="text-gradient">World of Opportunity</span>
          </h2>
          <p>Strategic presence across key markets, bridging East and West.</p>
        </motion.div>

        <div className="global-map">
          <div className="map-visual">
            <div className="world-map">
              <div
                className="map-region asean"
                style={{ top: "45%", left: "75%" }}
              >
                <div className="map-point highlight"></div>
                <div className="map-tooltip">ASEAN Hub</div>
              </div>
              <div
                className="map-region china"
                style={{ top: "35%", left: "82%" }}
              >
                <div className="map-point highlight"></div>
                <div className="map-tooltip">China Operations</div>
              </div>
              <div
                className="map-region europe"
                style={{ top: "25%", left: "48%" }}
              >
                <div className="map-point"></div>
                <div className="map-tooltip">Europe</div>
              </div>
              <div
                className="map-region americas"
                style={{ top: "35%", left: "15%" }}
              >
                <div className="map-point"></div>
                <div className="map-tooltip">Americas</div>
              </div>
            </div>
          </div>

          <div className="locations-list">
            {locations.map((loc, index) => (
              <motion.div
                key={index}
                className={`location-card glass-card ${loc.highlight ? "highlight" : ""}`}
                initial={{ opacity: 0, x: 30 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                viewport={{ once: true }}
              >
                <h3>{loc.region}</h3>
                <p>{loc.countries.join(" • ")}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default GlobalPresence;
