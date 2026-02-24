import { useState, useEffect, useRef } from "react";
import {
  MapContainer,
  Marker,
  TileLayer,
  Tooltip,
  ZoomControl,
  useMap,
} from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

// ── Self-contained animated counter — no external dependency ─────────────────
const AnimatedCount = ({ to, separator = "", duration = 1400, start }) => {
  const [display, setDisplay] = useState(0);
  const frameRef = useRef(null);

  useEffect(() => {
    if (!start) return;
    let startTime = null;
    const step = (timestamp) => {
      if (!startTime) startTime = timestamp;
      const progress = Math.min((timestamp - startTime) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      const current = Math.round(eased * to);
      setDisplay(current);
      if (progress < 1) frameRef.current = requestAnimationFrame(step);
    };
    frameRef.current = requestAnimationFrame(step);
    return () => cancelAnimationFrame(frameRef.current);
  }, [start, to, duration]);

  const formatted = separator
    ? display.toLocaleString("en-US")
    : display.toString();

  return <span>{formatted}</span>;
};

// ── Fix Leaflet icon paths broken by bundlers ─────────────────────────────────
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
  iconUrl:       "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
  shadowUrl:     "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
});

// ── Custom saffron pin ────────────────────────────────────────────────────────
const markerIcon = L.divIcon({
  className: "",
  html: `
    <div style="position:relative;width:14px;height:14px;">
      <div style="
        width:14px;height:14px;border-radius:50%;
        background:#E8A020;
        border:2.5px solid rgba(255,255,255,0.95);
        box-shadow:0 0 0 3px rgba(232,160,32,0.30);
        position:relative;z-index:2;
      "></div>
      <div style="
        position:absolute;inset:-7px;border-radius:50%;
        border:1.5px solid rgba(232,160,32,0.50);
        animation:lwpin 2.2s ease-out infinite;
      "></div>
    </div>`,
  iconSize:      [14, 14],
  iconAnchor:    [7, 7],
  tooltipAnchor: [9, -4],
});

// ── Map fly-to ────────────────────────────────────────────────────────────────
const MapViewController = ({ center, zoom }) => {
  const map = useMap();
  useEffect(() => {
    map.flyTo(center, zoom, { duration: 1.0, easeLinearity: 0.3 });
  }, [center, zoom, map]);
  return null;
};

// ── Data ──────────────────────────────────────────────────────────────────────
const regions = [
  { id: "all",      label: "All Regions",   count: 20, focus: "Global",       center: [22, 60],    zoom: 2 },
  { id: "asia",     label: "Asia",          count: 12, focus: "Asia",         center: [22, 108],   zoom: 3 },
  { id: "europe",   label: "Europe",        count: 3,  focus: "Europe",       center: [52, 12],    zoom: 4 },
  { id: "americas", label: "Americas",      count: 2,  focus: "Americas",     center: [39, -110],  zoom: 4 },
  { id: "africa",   label: "Africa",        count: 2,  focus: "Africa",       center: [4, 20],     zoom: 3 },
  { id: "oceania",  label: "Oceania",       count: 1,  focus: "Oceania",      center: [-28, 134],  zoom: 4 },
  { id: "hub",      label: "Regional Hubs", count: 2,  focus: "Hub Network",  center: [15, 80],    zoom: 3 },
];

const pins = [
  // Asia — confirmed Lifewood locations
  { city: "Cebu City",      detail: "Cebu IT Park, Lahug",           country: "Philippines", region: "asia",     lat: 10.3292,  lng: 123.9054 },
  { city: "Kuala Lumpur",   detail: "KL Gateway, Kerinchi Lestari",  country: "Malaysia",    region: "asia",     lat: 3.1181,   lng: 101.6640 },
  { city: "Chittagong",     detail: "Delivery Center",               country: "Bangladesh",  region: "asia",     lat: 22.3569,  lng: 91.7832  },
  { city: "Kolkata",        detail: "West Bengal Office",            country: "India",       region: "asia",     lat: 22.5726,  lng: 88.3639  },
  { city: "Shenzhen",       detail: "Guangdong Province",            country: "China",       region: "asia",     lat: 22.5431,  lng: 114.0579 },
  { city: "Meizhou",        detail: "Delivery Center, Guangdong",    country: "China",       region: "asia",     lat: 24.2881,  lng: 116.1221 },
  { city: "Dongguan",       detail: "Delivery Center, Guangdong",    country: "China",       region: "asia",     lat: 23.0207,  lng: 113.7518 },
  { city: "Hong Kong",      detail: "Hong Kong SAR",                 country: "Hong Kong",   region: "asia",     lat: 22.3193,  lng: 114.1694 },
  { city: "Malang",         detail: "East Java Delivery Site",       country: "Indonesia",   region: "asia",     lat: -7.9666,  lng: 112.6326 },
  { city: "Bangkok",        detail: "Operations Office",             country: "Thailand",    region: "asia",     lat: 13.7563,  lng: 100.5018 },
  { city: "Tokyo",          detail: "Japan Office",                  country: "Japan",       region: "asia",     lat: 35.6762,  lng: 139.6503 },
  { city: "Seoul",          detail: "Korea Office",                  country: "South Korea", region: "asia",     lat: 37.5665,  lng: 126.9780 },
  // Hubs
  { city: "Singapore",      detail: "Regional Hub",                  country: "Singapore",   region: "hub",      lat: 1.3521,   lng: 103.8198 },
  { city: "Dubai",          detail: "Regional Hub",                  country: "UAE",         region: "hub",      lat: 25.2048,  lng: 55.2708  },
  // Europe
  { city: "Hannover",       detail: "Delivery Center, Lower Saxony", country: "Germany",     region: "europe",   lat: 52.3759,  lng: 9.7320   },
  { city: "Madrid",         detail: "Europe Office",                 country: "Spain",       region: "europe",   lat: 40.4168,  lng: -3.7038  },
  { city: "Stockholm",      detail: "Nordic Office",                 country: "Sweden",      region: "europe",   lat: 59.3293,  lng: 18.0686  },
  // Americas
  { city: "San Jose",       detail: "California — Corporate HQ",     country: "United States", region: "americas", lat: 37.3382, lng: -121.8863 },
  { city: "Salt Lake City", detail: "Utah — US Headquarters",        country: "United States", region: "americas", lat: 40.7608, lng: -111.8910 },
  // Africa
  { city: "Cairo",          detail: "Africa Office",                 country: "Egypt",       region: "africa",   lat: 30.0444,  lng: 31.2357  },
  { city: "Johannesburg",   detail: "Africa Office",                 country: "South Africa",region: "africa",   lat: -26.2041, lng: 28.0473  },
  // Oceania
  { city: "Sydney",         detail: "Pacific Office",                country: "Australia",   region: "oceania",  lat: -33.8688, lng: 151.2093 },
];

const stats = [
  { value: 56788, label: "Trained Resources", suffix: "+", separator: "," },
  { value: 30,    label: "Countries Served",  suffix: "+" },
  { value: 40,    label: "Data Centers",      suffix: "+" },
  { value: 20,    label: "Global Offices" },
];

const marqueeItems = [
  "Philippines","Malaysia","Bangladesh","India","China","Hong Kong",
  "Indonesia","Thailand","Japan","South Korea","Singapore","UAE",
  "Germany","Spain","Sweden","Egypt","South Africa","Australia",
  "United States",
];

// ── Component ─────────────────────────────────────────────────────────────────
const OfficesPage = () => {
  const [activeRegion, setActiveRegion] = useState("all");
  const [statsVisible, setStatsVisible] = useState(false);
  const statsRef = useRef(null);

  const selected    = regions.find((r) => r.id === activeRegion) || regions[0];
  const visiblePins = activeRegion === "all"
    ? pins
    : pins.filter((p) => p.region === activeRegion);

  // Trigger CountUp when stats scroll into view
  useEffect(() => {
    const el = statsRef.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) setStatsVisible(true); },
      { threshold: 0.3 }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, []);

  return (
    <main className="lw-offices">
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Manrope:wght@400;500;600;700;800&display=swap');

        @keyframes lwpin {
          0%   { transform: scale(0.7); opacity: 1; }
          100% { transform: scale(2.6); opacity: 0; }
        }

        /* ── Base ── */
        .lw-offices {
          font-family: 'Manrope', sans-serif;
          background: #ffffff;
          min-height: 100vh;
          color: #0a1a0e;
          overflow-x: hidden;
        }

        /* ── Hero ── */
        .lw-offices-hero {
          max-width: 1320px;
          margin: 0 auto;
          padding: 140px 48px 0;
        }

        .lw-offices-hero-top {
          margin-bottom: 20px;
        }

        .lw-offices-hero-body {
          display: grid;
          grid-template-columns: 1.1fr 1fr;
          column-gap: 72px;
          align-items: end;
        }

        .lw-eyebrow {
          display: inline-flex;
          align-items: center;
          gap: 10px;
          font-size: 10.5px;
          font-weight: 700;
          letter-spacing: 0.18em;
          text-transform: uppercase;
          color: rgba(10,26,14,0.32);
        }
        .lw-eyebrow-line {
          display: inline-block;
          width: 22px; height: 1px;
          background: rgba(200,130,0,0.60);
          border-radius: 2px;
        }

        .lw-offices-title {
          font-size: clamp(2.2rem, 3.8vw, 3.8rem);
          font-weight: 800;
          line-height: 1.08;
          letter-spacing: -0.025em;
          color: #0a1a0e;
          margin: 0;
        }
        .lw-offices-title em {
          font-style: italic;
          color: #133020;
        }

        .lw-offices-sub {
          font-size: 15px;
          line-height: 1.75;
          color: rgba(10,26,14,0.48);
          margin: 0;
          padding-bottom: 6px;
        }

        /* ── Stats strip ── */
        .lw-stats-strip {
          max-width: 1320px;
          margin: 52px auto 0;
          padding: 0 48px;
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          border-top: 1px solid rgba(10,26,14,0.07);
          border-bottom: 1px solid rgba(10,26,14,0.07);
        }

        .lw-stat {
          padding: 28px 0;
          text-align: center;
          border-right: 1px solid rgba(10,26,14,0.07);
          transition: background 0.2s ease;
        }
        .lw-stat:last-child { border-right: none; }
        .lw-stat:hover { background: rgba(19,48,32,0.02); }

        .lw-stat-value {
          display: flex;
          align-items: baseline;
          justify-content: center;
          gap: 1px;
          font-size: clamp(1.8rem, 2.8vw, 2.5rem);
          font-weight: 800;
          letter-spacing: -0.03em;
          color: #133020;
          line-height: 1;
          margin-bottom: 6px;
        }
        .lw-stat-suffix {
          font-size: 0.55em;
          font-weight: 700;
          color: #c47f00;
        }
        .lw-stat-label {
          font-size: 11px;
          font-weight: 600;
          letter-spacing: 0.09em;
          text-transform: uppercase;
          color: rgba(10,26,14,0.35);
        }

        /* ── Map section ── */
        .lw-map-section {
          max-width: 1320px;
          margin: 0 auto;
          padding: 48px 48px 80px;
          display: grid;
          grid-template-columns: 215px 1fr;
          gap: 28px;
          align-items: start;
        }

        /* ── Sidebar ── */
        .lw-sidebar {
          position: sticky;
          top: 96px;
          display: flex;
          flex-direction: column;
          gap: 3px;
        }

        .lw-sidebar-heading {
          font-size: 10px;
          font-weight: 700;
          letter-spacing: 0.16em;
          text-transform: uppercase;
          color: rgba(10,26,14,0.28);
          margin-bottom: 10px;
          padding-left: 2px;
        }

        .lw-region-btn {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 10px 13px;
          border-radius: 9px;
          border: 1px solid transparent;
          background: transparent;
          cursor: pointer;
          font-family: 'Manrope', sans-serif;
          font-size: 13px;
          font-weight: 600;
          color: rgba(10,26,14,0.45);
          transition: background 0.16s ease, color 0.16s ease, border-color 0.16s ease;
          text-align: left;
          width: 100%;
        }
        .lw-region-btn:hover {
          background: rgba(19,48,32,0.05);
          color: #0a1a0e;
        }
        .lw-region-btn.active {
          background: rgba(200,130,0,0.08);
          border-color: rgba(200,130,0,0.28);
          color: #c47f00;
        }

        .lw-region-pill {
          font-size: 10.5px;
          font-weight: 700;
          padding: 2px 7px;
          border-radius: 999px;
          background: rgba(10,26,14,0.06);
          color: rgba(10,26,14,0.32);
          transition: background 0.16s, color 0.16s;
        }
        .lw-region-btn.active .lw-region-pill {
          background: rgba(200,130,0,0.12);
          color: #c47f00;
        }

        /* Focus card */
        .lw-focus-card {
          margin-top: 18px;
          padding: 16px;
          border-radius: 12px;
          background: rgba(19,48,32,0.03);
          border: 1px solid rgba(19,48,32,0.08);
        }
        .lw-focus-card p {
          font-size: 9.5px;
          font-weight: 700;
          letter-spacing: 0.14em;
          text-transform: uppercase;
          color: rgba(10,26,14,0.28);
          margin: 0 0 5px;
        }
        .lw-focus-card strong {
          display: block;
          font-size: 15px;
          font-weight: 800;
          color: #0a1a0e;
          margin-bottom: 3px;
        }
        .lw-focus-card span {
          font-size: 11.5px;
          color: rgba(10,26,14,0.40);
        }
        .lw-focus-card span em {
          font-style: normal;
          color: #c47f00;
          font-weight: 700;
        }

        /* ── Map wrapper ── */
        .lw-map-wrap {
          position: relative;
          border-radius: 18px;
          overflow: hidden;
          border: 1px solid rgba(10,26,14,0.09);
          box-shadow:
            0 4px 24px rgba(10,26,14,0.07),
            0 20px 60px rgba(10,26,14,0.05);
        }

        .lw-map-top-badge {
          position: absolute;
          top: 14px; left: 14px;
          z-index: 500;
          padding: 6px 13px;
          border-radius: 8px;
          background: rgba(255,255,255,0.90);
          backdrop-filter: blur(10px);
          -webkit-backdrop-filter: blur(10px);
          border: 1px solid rgba(10,26,14,0.09);
          font-family: 'Manrope', sans-serif;
          font-size: 11.5px;
          font-weight: 700;
          color: rgba(10,26,14,0.58);
          letter-spacing: 0.05em;
          pointer-events: none;
          box-shadow: 0 2px 10px rgba(10,26,14,0.07);
        }
        .lw-map-top-badge span { color: #c47f00; margin-left: 5px; }

        .lw-map-bot-badge {
          position: absolute;
          bottom: 14px; left: 14px;
          z-index: 500;
          padding: 5px 11px;
          border-radius: 8px;
          background: rgba(200,130,0,0.09);
          border: 1px solid rgba(200,130,0,0.25);
          font-family: 'Manrope', sans-serif;
          font-size: 11px;
          font-weight: 700;
          color: #c47f00;
          pointer-events: none;
          letter-spacing: 0.04em;
        }

        .lw-leaflet-map {
          width: 100%;
          height: 520px;
          display: block;
        }

        /* Tooltip */
        .leaflet-tooltip {
          font-family: 'Manrope', sans-serif !important;
          background: rgba(255,255,255,0.97) !important;
          border: 1px solid rgba(200,130,0,0.30) !important;
          color: #0a1a0e !important;
          border-radius: 8px !important;
          padding: 7px 12px !important;
          box-shadow: 0 4px 18px rgba(10,26,14,0.12) !important;
          white-space: nowrap !important;
        }
        .leaflet-tooltip::before {
          border-top-color: rgba(200,130,0,0.30) !important;
        }
        .lw-tt-city {
          display: block;
          font-size: 12.5px;
          font-weight: 800;
          color: #0a1a0e;
        }
        .lw-tt-detail {
          display: block;
          font-size: 10.5px;
          font-weight: 500;
          color: rgba(10,26,14,0.48);
          margin-top: 1px;
        }
        .lw-tt-country {
          display: block;
          font-size: 10px;
          font-weight: 700;
          letter-spacing: 0.08em;
          text-transform: uppercase;
          color: #c47f00;
          margin-top: 3px;
        }

        /* ── Marquee ── */
        .lw-marquee {
          overflow: hidden;
          border-top: 1px solid rgba(10,26,14,0.07);
          border-bottom: 1px solid rgba(10,26,14,0.07);
          padding: 17px 0;
          background: #fafaf9;
          mask-image: linear-gradient(90deg, transparent 0%, #000 8%, #000 92%, transparent 100%);
          -webkit-mask-image: linear-gradient(90deg, transparent 0%, #000 8%, #000 92%, transparent 100%);
        }
        .lw-marquee-track {
          display: flex;
          width: max-content;
          animation: lw-scroll 32s linear infinite;
        }
        .lw-marquee-track:hover { animation-play-state: paused; }
        @keyframes lw-scroll {
          0%   { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }
        .lw-marquee-item {
          display: inline-flex;
          align-items: center;
          gap: 18px;
          padding: 0 24px;
          font-size: 12px;
          font-weight: 600;
          letter-spacing: 0.07em;
          text-transform: uppercase;
          color: rgba(10,26,14,0.28);
          white-space: nowrap;
          transition: color 0.15s;
          cursor: default;
        }
        .lw-marquee-item:hover { color: rgba(10,26,14,0.62); }
        .lw-marquee-item::after {
          content: "·";
          color: rgba(200,130,0,0.45);
        }

        /* ── Responsive ── */
        @media (max-width: 1024px) {
          .lw-stats-strip { grid-template-columns: repeat(2, 1fr); }
          .lw-stat { border-right: none; border-bottom: 1px solid rgba(10,26,14,0.07); }
          .lw-stat:nth-child(odd) { border-right: 1px solid rgba(10,26,14,0.07); }
          .lw-map-section { grid-template-columns: 1fr; padding: 32px 24px 60px; }
          .lw-sidebar {
            position: static;
            display: grid;
            grid-template-columns: repeat(auto-fill, minmax(130px, 1fr));
            gap: 6px;
          }
          .lw-sidebar-heading, .lw-focus-card { grid-column: 1 / -1; }
          .lw-offices-hero { padding: 120px 24px 0; }
          .lw-offices-hero-body { grid-template-columns: 1fr; gap: 16px; }
          .lw-stats-strip { padding: 0 24px; }
          .lw-leaflet-map { height: 400px; }
        }
        @media (max-width: 600px) {
          .lw-stats-strip { grid-template-columns: repeat(2, 1fr); }
          .lw-leaflet-map { height: 300px; }
        }
      `}</style>

      {/* ── Hero ── */}
      <section className="lw-offices-hero" aria-labelledby="offices-title">
        <div className="lw-offices-hero-top">
          <div className="lw-eyebrow">
            <span className="lw-eyebrow-line" />
            Our Offices
            <span className="lw-eyebrow-line" />
          </div>
        </div>
        <div className="lw-offices-hero-body">
          <h1 className="lw-offices-title" id="offices-title">
            The world's largest<br />
            AI data collection <em>network.</em>
          </h1>
          <p className="lw-offices-sub">
            Since 2004, Lifewood has built an unmatched global infrastructure —
            spanning 30 countries, 40 delivery centers, and over 50,000 trained
            resources across six continents.
          </p>
        </div>
      </section>

      {/* ── Stats strip ── */}
      <div className="lw-stats-strip" ref={statsRef} aria-label="Global reach statistics">
        {stats.map((s) => (
          <div key={s.label} className="lw-stat">
            <div className="lw-stat-value">
              <AnimatedCount
                to={s.value}
                separator={s.separator || ""}
                duration={1400}
                start={statsVisible}
              />
              {s.suffix && <span className="lw-stat-suffix">{s.suffix}</span>}
            </div>
            <div className="lw-stat-label">{s.label}</div>
          </div>
        ))}
      </div>

      {/* ── Map + Sidebar ── */}
      <section className="lw-map-section" aria-label="Interactive global office map">

        <nav className="lw-sidebar" aria-label="Filter offices by region">
          <p className="lw-sidebar-heading">Filter by Region</p>

          {regions.map((r) => (
            <button
              key={r.id}
              type="button"
              className={`lw-region-btn ${activeRegion === r.id ? "active" : ""}`}
              onClick={() => setActiveRegion(r.id)}
              aria-pressed={activeRegion === r.id}
            >
              <span>{r.label}</span>
              <span className="lw-region-pill">{r.count}</span>
            </button>
          ))}

          <div className="lw-focus-card" aria-live="polite">
            <p>Active Focus</p>
            <strong>{selected.focus}</strong>
            <span>
              <em>{visiblePins.length}</em> location{visiblePins.length !== 1 ? "s" : ""} shown
            </span>
          </div>
        </nav>

        <div className="lw-map-wrap" role="region" aria-label={`Map — ${selected.focus}`}>
          <div className="lw-map-top-badge" aria-hidden="true">
            Viewing <span>{selected.focus}</span>
          </div>
          <div className="lw-map-bot-badge" aria-hidden="true">
            ● {visiblePins.length} office{visiblePins.length !== 1 ? "s" : ""}
          </div>

          <MapContainer
            center={selected.center}
            zoom={selected.zoom}
            zoomControl={false}
            className="lw-leaflet-map"
            scrollWheelZoom={false}
          >
            <TileLayer
              attribution='Tiles &copy; Esri &mdash; Source: Esri, i-cubed, USDA, USGS, AEX, GeoEye'
              url="https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}"
            />
            <ZoomControl position="topright" />
            <MapViewController center={selected.center} zoom={selected.zoom} />

            {visiblePins.map((pin) => (
              <Marker
                key={`${pin.city}-${pin.lat}`}
                position={[pin.lat, pin.lng]}
                icon={markerIcon}
              >
                <Tooltip direction="top" offset={[0, -6]}>
                  <span className="lw-tt-city">{pin.city}</span>
                  <span className="lw-tt-detail">{pin.detail}</span>
                  <span className="lw-tt-country">{pin.country}</span>
                </Tooltip>
              </Marker>
            ))}
          </MapContainer>
        </div>
      </section>

      {/* ── Country marquee ── */}
      <div className="lw-marquee" aria-label="Countries where Lifewood operates">
        <div className="lw-marquee-track">
          {[...marqueeItems, ...marqueeItems].map((c, i) => (
            <span key={`${c}-${i}`} className="lw-marquee-item">{c}</span>
          ))}
        </div>
      </div>
    </main>
  );
};

export default OfficesPage;