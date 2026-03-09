import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  MapContainer,
  Marker,
  TileLayer,
  Tooltip,
  useMap,
} from "react-leaflet";
import L from "leaflet";

const STYLES = `
  @import url('https://fonts.googleapis.com/css2?family=Manrope:wght@300;400;500;600;700;800;900&display=swap');

  *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

  :root {
    --amber:        #c47f00;
    --amber-light:  #e8a800;
    --amber-bg:     rgba(200,130,0,0.07);
    --amber-border: rgba(200,130,0,0.20);
    --green-deep:   #0a1a0e;
    --green-dark:   #133020;
    --white:        #ffffff;
    --off-white:    #f7f6f3;
    --text-main:    #0a1a0e;
    --text-mid:     rgba(10,26,14,0.48);
    --text-dim:     rgba(10,26,14,0.28);
    --border:       rgba(10,26,14,0.08);
    --font:         'Manrope', sans-serif;
    --nav-h:        72px;
  }

  body {
    font-family: var(--font);
    background: var(--white);
    color: var(--text-main);
    overflow-x: hidden;
  }

  /* ANIMATIONS */
  @keyframes fadeUp {
    from { opacity: 0; transform: translateY(30px); }
    to   { opacity: 1; transform: translateY(0); }
  }
  @keyframes fadeIn {
    from { opacity: 0; } to { opacity: 1; }
  }
  @keyframes marqueeScroll {
    from { transform: translateX(0); }
    to   { transform: translateX(-50%); }
  }
  @keyframes pulseRing {
    0%   { transform: scale(1);   opacity: 0.6; }
    100% { transform: scale(2.8); opacity: 0; }
  }
  @keyframes scrollLine {
    0%   { transform: scaleY(0); transform-origin: top; }
    50%  { transform: scaleY(1); transform-origin: top; }
    51%  { transform: scaleY(1); transform-origin: bottom; }
    100% { transform: scaleY(0); transform-origin: bottom; }
  }
  @keyframes gradientShift {
    0%, 100% { background-position: 0% 50%; }
    50%       { background-position: 100% 50%; }
  }

  .reveal {
    opacity: 0; transform: translateY(28px);
    transition: opacity 0.75s cubic-bezier(.22,1,.36,1), transform 0.75s cubic-bezier(.22,1,.36,1);
  }
  .reveal.visible { opacity: 1; transform: translateY(0); }
  .reveal-d1 { transition-delay: 0.1s; }
  .reveal-d2 { transition-delay: 0.2s; }
  .reveal-d3 { transition-delay: 0.3s; }

  /* PAGE */
  .phil-page { font-family: var(--font); background: var(--white); min-height: 100vh; }

  /* ── NAV ── */
  .phil-nav {
    position: fixed; top: 0; left: 0; right: 0; z-index: 100;
    display: flex; align-items: center; justify-content: space-between;
    height: var(--nav-h);
    padding: 0 48px;
    background: rgba(255,255,255,0);
    backdrop-filter: blur(0px);
    border-bottom: 1px solid transparent;
    transition: background 0.4s, backdrop-filter 0.4s, border-color 0.4s;
  }
  .phil-nav.scrolled {
    background: rgba(255,255,255,0.92);
    backdrop-filter: blur(14px);
    border-color: var(--border);
  }
  .phil-nav-logo {
    font-family: var(--font); font-weight: 800; font-size: 17px;
    letter-spacing: -0.03em; color: var(--green-deep);
  }
  .phil-nav-logo span { color: var(--amber); }
  .phil-nav-right { display: flex; align-items: center; gap: 32px; }
  .phil-nav-link {
    font-family: var(--font); font-size: 11.5px; font-weight: 600;
    letter-spacing: 0.12em; text-transform: uppercase;
    color: var(--text-mid); text-decoration: none; transition: color 0.2s;
  }
  .phil-nav-link:hover { color: var(--green-deep); }
  .phil-nav-btn {
    font-family: var(--font); font-size: 15px; font-weight: 700;
    letter-spacing: 0.01em;
    padding: 12px 28px;
    background: #ffab00; color: #0a1a0e;
    border: none; cursor: pointer;
    border-radius: 999px;
    box-shadow: 0 6px 24px rgba(255,171,0,0.32);
    transition: background 0.2s, box-shadow 0.2s, transform 0.15s;
  }
  .phil-nav-btn:hover {
    background: #ffc030;
    box-shadow: 0 10px 36px rgba(255,171,0,0.52);
    transform: translateY(-2px);
  }


  /* ── HERO ── */
  .phil-hero-section {
  position: relative;
  max-width: 1320px;
  margin: 0 auto;
  padding: 30px 48px 60px;
  display: grid;
  grid-template-columns: 1.2fr 0.8fr;
  align-items: end;
  gap: 80px;
}
  .phil-hero-left {
  grid-column: 1;
}

.phil-hero-right {
  grid-column: 2;
  display: flex;
  justify-content: flex-start;
}

.phil-hero-desc {
  font-size: 15px;
  line-height: 1.75;
  color: rgba(10,26,14,0.48);
  max-width: 420px;
}
  .phil-eyebrow {
    display: inline-flex;
    align-items: center;
    gap: 10px;
    font-size: 10.5px;
    font-weight: 700;
    letter-spacing: 0.18em;
    text-transform: uppercase;
    color: rgba(10,26,14,0.32);
    margin-bottom: 20px;
    grid-column: 1 / -1;
  }
  .phil-eyebrow-line {
    display: inline-block;
    width: 22px; height: 1px;
    background: rgba(200,130,0,0.60);
    border-radius: 2px;
  }
  .phil-hero-title-wrap { grid-column: 1; }
  .phil-hero-h1 {
    font-size: clamp(2.4rem, 4.5vw, 4rem);
    font-weight: 800;
    line-height: 1.06;
    letter-spacing: -0.028em;
    color: #0a1a0e;
    margin: 0 0 14px;
  }
  .phil-hero-h1 em {
    font-style: italic;
    color: #133020;
  }
  .phil-hero-desc {
    font-size: 15px;
    line-height: 1.75;
    color: rgba(10,26,14,0.48);
    max-width: 460px;
    margin: 0;
  }

  @media (max-width: 1024px) {
    .phil-hero-section { padding: 120px 24px 0; grid-template-columns: 1fr; }
  }


  /* ── DIVIDER ── */
  .phil-divider {
    max-width: 1320px; margin: 0 auto; padding: 0 48px;
    height: 1px; background: var(--border);
  }

  /* ── MAP SECTION ── */
  .phil-map-section { padding: 80px 0 72px; background: var(--white); }
  .container { max-width: 1320px; margin: 0 auto; padding: 0 48px; width: 100%; }

  .phil-section-tag {
    font-family: var(--font); font-size: 10px; font-weight: 700;
    letter-spacing: 0.18em; text-transform: uppercase; color: var(--text-dim);
    display: inline-flex; align-items: center; gap: 10px; margin-bottom: 14px;
  }
  .phil-section-tag-line {
    display: inline-block; width: 22px; height: 1px;
    background: rgba(200,130,0,0.6);
  }
  .phil-section-h2 {
    font-family: var(--font); font-size: clamp(28px, 3.5vw, 46px);
    font-weight: 800; letter-spacing: -0.028em; line-height: 1.08;
    color: var(--green-deep); margin-bottom: 40px; max-width: 560px;
  }
  .phil-section-h2 em { font-style: italic; color: var(--green-dark); }

  .phil-map-frame {
    height: 460px; overflow: hidden;
    border-radius: 18px; border: 1px solid var(--border);
    box-shadow: 0 4px 24px rgba(10,26,14,0.07), 0 20px 60px rgba(10,26,14,0.04);
  }
  .phil-map-leaflet { width: 100%; height: 100%; }
  .leaflet-container { font-family: var(--font) !important; }
  .leaflet-tooltip {
    font-family: var(--font) !important; font-size: 11px !important; font-weight: 700 !important;
    letter-spacing: 0.1em !important;
    background: rgba(10,26,14,0.95) !important;
    border: 1px solid rgba(200,130,0,0.45) !important;
    color: #e8a800 !important; border-radius: 6px !important;
    padding: 5px 12px !important; box-shadow: none !important;
  }
  .leaflet-tooltip-top::before { display: none !important; }
  .leaflet-control-attribution { display: none !important; }

  .phil-cities-marquee {
    overflow: hidden; border-top: 1px solid var(--border);
    padding: 14px 0; margin-top: 24px; position: relative;
  }
  .phil-cities-marquee::before, .phil-cities-marquee::after {
    content: ''; position: absolute; top: 0; bottom: 0; width: 80px; z-index: 2;
  }
  .phil-cities-marquee::before { left: 0; background: linear-gradient(to right, var(--white), transparent); }
  .phil-cities-marquee::after  { right: 0; background: linear-gradient(to left, var(--white), transparent); }
  .phil-cities-track {
    display: flex; width: max-content;
    animation: marqueeScroll 28s linear infinite;
  }
  .phil-cities-item {
    font-family: var(--font); font-size: 10px; font-weight: 700;
    letter-spacing: 0.18em; text-transform: uppercase;
    color: var(--text-dim); padding: 0 22px;
    border-right: 1px solid var(--border); white-space: nowrap;
  }

  /* ── IMPACT SECTION ── */
  .phil-impact-section { padding: 80px 0 120px; background: var(--off-white); }

  .phil-impact-intro {
    display: grid; grid-template-columns: 1fr 1fr; gap: 60px;
    align-items: flex-end; margin-bottom: 60px;
  }
  .phil-impact-intro-right {
    font-family: var(--font); font-size: 14.5px; font-weight: 400;
    line-height: 1.8; color: var(--text-mid); padding-bottom: 4px;
  }
  .phil-impact-intro-right strong { color: var(--text-main); font-weight: 700; }

  /* Cards */
  .phil-card {
    display: grid; grid-template-columns: 1fr 1fr;
    margin-bottom: 2px; overflow: hidden;
    background: var(--white);
    border: 1px solid var(--border);
    border-radius: 18px;
    margin-bottom: 16px;
    box-shadow: 0 2px 12px rgba(10,26,14,0.05);
    transition: box-shadow 0.35s, border-color 0.35s;
  }
  .phil-card:hover {
    box-shadow: 0 8px 40px rgba(10,26,14,0.1);
    border-color: rgba(196,127,0,0.22);
  }
  .phil-card.flipped { direction: rtl; }
  .phil-card.flipped > * { direction: ltr; }

  .phil-card-body {
    padding: 60px 52px; display: flex; flex-direction: column;
    justify-content: center; position: relative;
  }
  .phil-card-body::after {
    content: ''; position: absolute; top: 32px; right: 0; bottom: 32px;
    width: 1px;
    background: linear-gradient(to bottom, transparent, var(--border), transparent);
  }
  .phil-card.flipped .phil-card-body::after { right: auto; left: 0; }

  .phil-card-tag {
    display: inline-flex; align-items: center; gap: 6px;
    font-family: var(--font); font-size: 10px; font-weight: 700;
    letter-spacing: 0.14em; text-transform: uppercase;
    color: var(--amber);
    background: var(--amber-bg); border: 1px solid var(--amber-border);
    padding: 4px 10px; border-radius: 999px;
    margin-bottom: 20px; width: fit-content;
  }
  .phil-card-tag-dot { width: 5px; height: 5px; border-radius: 50%; background: var(--amber); }

  .phil-card-h3 {
    font-family: var(--font); font-size: clamp(24px, 2.6vw, 36px);
    font-weight: 800; letter-spacing: -0.028em; line-height: 1.12;
    color: var(--green-deep); margin-bottom: 16px;
  }
  .phil-card-p {
    font-family: var(--font); font-size: 14px; font-weight: 400;
    line-height: 1.8; color: var(--text-mid); max-width: 380px;
  }
  .phil-card-sub {
    font-family: var(--font); font-size: 13px; font-weight: 400;
    line-height: 1.8; color: var(--text-dim);
    margin-top: 14px; max-width: 380px;
    border-top: 1px solid var(--border); padding-top: 14px;
  }

  .phil-card-img {
    position: relative; overflow: hidden;
    height: 420px; border-radius: 0;
  }
  .phil-card img {
    width: 100%; height: 100%; object-fit: cover;
    transition: transform 0.8s cubic-bezier(.22,1,.36,1), filter 0.5s;
    filter: brightness(0.82) saturate(0.9);
  }
  .phil-card:hover .phil-card-img img { transform: scale(1.06); filter: brightness(0.92) saturate(1.05); }
  .phil-card-img-glow {
    position: absolute; inset: 0;
    background: linear-gradient(135deg, rgba(196,127,0,0.08) 0%, transparent 55%);
    opacity: 0; transition: opacity 0.4s; pointer-events: none;
  }
  .phil-card:hover .phil-card-img-glow { opacity: 1; }

  /* ── RESPONSIVE ── */
  @media (max-width: 1024px) {
    .phil-divider { padding: 0 24px; }
    .container { padding: 0 24px; }
    .phil-impact-intro { grid-template-columns: 1fr; gap: 24px; }
    .phil-card { grid-template-columns: 1fr; }
    .phil-card.flipped { direction: ltr; }
    .phil-card-img { height: 260px; }
    .phil-card-body::after { display: none; }
  }
  @media (max-width: 640px) {
    :root { --nav-h: 64px; }
    .phil-nav { padding: 0 20px; }
  }
`;

if (
  typeof document !== "undefined" &&
  !document.getElementById("phil-styles-v3")
) {
  const s = document.createElement("style");
  s.id = "phil-styles-v3";
  s.textContent = STYLES;
  document.head.appendChild(s);
}

function useReveal() {
  useEffect(() => {
    const els = document.querySelectorAll(".reveal");
    const obs = new IntersectionObserver(
      (entries) =>
        entries.forEach((e) => {
          if (e.isIntersecting) e.target.classList.add("visible");
        }),
      { threshold: 0.1 },
    );
    els.forEach((el) => obs.observe(el));
    return () => obs.disconnect();
  }, []);
}

const MapViewport = ({ center, zoom }) => {
  const map = useMap();
  useEffect(() => {
    const refresh = () => map.invalidateSize({ pan: false });
    map.setView(center, zoom, { animate: false });
    refresh();
    const frame = requestAnimationFrame(refresh);
    const timer = setTimeout(refresh, 180);
    window.addEventListener("resize", refresh);
    return () => {
      cancelAnimationFrame(frame);
      clearTimeout(timer);
      window.removeEventListener("resize", refresh);
    };
  }, [center, zoom, map]);
  return null;
};

const PhilantrophyPage = () => {
  useReveal();
  const navigate = useNavigate();
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const markerIcon = L.divIcon({
    className: "",
    html: `
      <div style="position:relative;width:24px;height:36px;">
        <div style="
          position:absolute;top:2px;left:2px;width:20px;height:20px;
          border-radius:50%;background:rgba(196,127,0,0.25);
          animation:pulseRing 2s ease-out infinite;"></div>
        <svg viewBox="0 0 24 36" width="24" height="36"
          style="display:block;position:relative;z-index:1;
          filter:drop-shadow(0 3px 6px rgba(10,26,14,0.35));">
          <path d="M12 0C6 0 1 5 1 11c0 8 11 25 11 25s11-17 11-25C23 5 18 0 12 0z" fill="#c47f00"/>
          <circle cx="12" cy="11" r="4" fill="white"/>
        </svg>
      </div>`,
    iconSize: [24, 36],
    iconAnchor: [12, 36],
    tooltipAnchor: [0, -34],
  });

  const pins = [
    { city: "Cairo", lat: 30.0444, lng: 31.2357 },
    { city: "Addis Ababa", lat: 8.9806, lng: 38.7578 },
    { city: "Lagos", lat: 6.5244, lng: 3.3792 },
    { city: "Accra", lat: 5.6037, lng: -0.187 },
    { city: "Abidjan", lat: 5.3599, lng: -4.0083 },
    { city: "Douala", lat: 4.0511, lng: 9.7679 },
    { city: "Nairobi", lat: -1.2921, lng: 36.8219 },
    { city: "Kampala", lat: 0.3476, lng: 32.5825 },
    { city: "Dar es Salaam", lat: -6.7924, lng: 39.2083 },
    { city: "Kinshasa", lat: -4.4419, lng: 15.2663 },
    { city: "Lusaka", lat: -15.3875, lng: 28.3228 },
    { city: "Johannesburg", lat: -26.2041, lng: 28.0473 },
    { city: "Dhaka", lat: 23.8103, lng: 90.4125 },
  ];

  const citiesMarquee = [
    "South Africa",
    "Nigeria",
    "Republic of the Congo",
    "DR Congo",
    "Ghana",
    "Madagascar",
    "Benin",
    "Uganda",
    "Kenya",
    "Ivory Coast",
    "Egypt",
    "Ethiopia",
    "Niger",
    "Tanzania",
    "Namibia",
    "Zambia",
    "Zimbabwe",
    "Liberia",
    "Sierra Leone",
    "Bangladesh",
  ];

  const impactCards = [
    {
      num: "01",
      title: "Partnership",
      text: "In partnership with our philanthropic partners, Lifewood has expanded operations in South Africa, Nigeria, Republic of the Congo, Democratic Republic of the Congo, Ghana, Madagascar, Benin, Uganda, Kenya, Ivory Coast, Egypt, Ethiopia, Niger, Tanzania, Namibia, Zambia, Zimbabwe, Liberia, Sierra Leone, and Bangladesh.",
      sub: "This requires the application of our methods and experience for the development of people in under resourced economies.",
      image:
        "https://images.unsplash.com/photo-1531482615713-2afd69097998?auto=format&fit=crop&w=1400&q=80",
    },
    {
      num: "02",
      title: "Application",
      text: "Applying our operational methods and AI-enabled delivery model to develop people in under-resourced economies with measurable, long-term outcomes that build lasting economic resilience and community self-sufficiency.",
      image:
        "https://images.unsplash.com/photo-1517486808906-6ca8b3f04846?auto=format&fit=crop&w=1400&q=80",
    },
    {
      num: "03",
      title: "Expanding",
      text: "We are expanding access to training, establishing equitable wage structures and career and leadership progression to create sustainable change—equipping individuals to take the lead and grow the business for themselves for the long term benefit of everyone.",
      image:
        "https://images.unsplash.com/photo-1469571486292-0ba58a3f068b?auto=format&fit=crop&w=1400&q=80",
    },
  ];

  return (
    <main className="phil-page">
      {/* NAV */}
      <nav className={`phil-nav ${scrolled ? "scrolled" : ""}`}>
        <div className="phil-nav-logo">
          Life<span>wood</span>
        </div>
        <div className="phil-nav-right">
          <a href="#" className="phil-nav-link">
            About
          </a>
          <a href="#" className="phil-nav-link">
            Programs
          </a>
          <a href="#" className="phil-nav-link">
            Philanthropy
          </a>
          <button
            className="phil-nav-btn"
            type="button"
            onClick={() => {
              navigate("/contact-us");
              window.scrollTo({ top: 0, behavior: "smooth" });
            }}
          >
            Contact Us
          </button>
        </div>
      </nav>

      {/* ── Hero ── */}
      <section className="phil-hero-section" aria-labelledby="phil-title">
        <div className="phil-eyebrow">
          <span className="phil-eyebrow-line" />
          Philanthropy &amp; Impact
          <span className="phil-eyebrow-line" />
        </div>

        <div className="phil-hero-left">
          <h1 className="phil-hero-h1" id="phil-title">
            Building futures
            <br />
            across <em>Africa.</em>
          </h1>
        </div>

        <div className="phil-hero-right">
          <p className="phil-hero-desc">
            We direct resources into education and developmental projects that
            create lasting change. Our approach goes beyond giving. It builds
            sustainable growth and empowers communities across Africa and the
            Indian sub-continent for the long term.
          </p>
        </div>
      </section>

      {/* DIVIDER */}
      <div className="phil-divider" />

      {/* MAP */}
      <section className="phil-map-section">
        <div className="container">
          {/* <div className="phil-section-tag reveal">
            <span className="phil-section-tag-line" />
            Our Reach
          </div>
          <h2 className="phil-section-h2 reveal reveal-d1">
            Transforming Communities Worldwide
          </h2> */}

          <div className="phil-map-frame reveal reveal-d2">
            <MapContainer
              center={[4, 22]}
              zoom={3}
              zoomControl={false}
              className="phil-map-leaflet"
            >
              <TileLayer
                attribution=""
                url="https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}"
              />
              <MapViewport center={[4, 22]} zoom={3} />
              {pins.map((pin) => (
                <Marker
                  key={pin.city}
                  position={[pin.lat, pin.lng]}
                  icon={markerIcon}
                >
                  <Tooltip direction="top" offset={[0, -10]}>
                    {pin.city}
                  </Tooltip>
                </Marker>
              ))}
            </MapContainer>
          </div>

          <div className="phil-cities-marquee">
            <div className="phil-cities-track">
              {[...citiesMarquee, ...citiesMarquee].map((city, i) => (
                <span key={i} className="phil-cities-item">
                  {city}
                </span>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* IMPACT */}
      <section className="phil-impact-section">
        <div className="container">
          <div className="phil-impact-intro">
            <div>
              <div className="phil-section-tag reveal">
                <span className="phil-section-tag-line" />
                Impact
              </div>
              <h2
                className="phil-section-h2 reveal reveal-d1"
                style={{ marginBottom: 0 }}
              >
                How we create <em>real change</em>
              </h2>
            </div>
            <p className="phil-impact-intro-right reveal reveal-d2">
              Through purposeful partnerships and sustainable investment, we
              empower communities across Africa and the Indian sub-continent to
              create lasting{" "}
              <strong>economic and social transformation.</strong>
            </p>
          </div>

          {impactCards.map((card, i) => (
            <article
              key={card.title}
              className={`phil-card reveal ${i % 2 === 1 ? "flipped" : ""}`}
            >
              <div className="phil-card-body">
                <div className="phil-card-tag">
                  <span className="phil-card-tag-dot" />
                  {card.num}
                </div>
                <h3 className="phil-card-h3">{card.title}</h3>
                <p className="phil-card-p">{card.text}</p>
                {card.sub && <p className="phil-card-sub">{card.sub}</p>}
              </div>
              <div className="phil-card-img">
                <img src={card.image} alt={card.title} loading="lazy" />
                <div className="phil-card-img-glow" />
              </div>
            </article>
          ))}
        </div>
      </section>
    </main>
  );
};

export default PhilantrophyPage;
