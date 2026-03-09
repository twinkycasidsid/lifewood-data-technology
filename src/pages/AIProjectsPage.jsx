const AIProjectsPage = () => {
  const projects = [
    {
      title: 'AI Data Extraction',
      text: 'Structured acquisition of images and text from distributed sources via scanning workflows, field capture, and secure digital pipelines.',
      tag: 'Data Pipeline',
      // Dark glowing data streams / matrix-style
      image: 'https://images.unsplash.com/photo-1558494949-ef010cbdcc31?auto=format&fit=crop&w=1200&q=80',
    },
    {
      title: 'Machine Learning Enablement',
      text: 'End-to-end dataset preparation pipelines that improve data usability for training, validation, and iterative model refinement.',
      tag: 'Model Ops',
      // Dark server room with blue light
      image: 'https://images.unsplash.com/photo-1620712943543-bcc4688e7485?auto=format&fit=crop&w=1200&q=80',
    },
    {
      title: 'Autonomous Driving Technology',
      text: 'Specialized visual and sensor data programs supporting perception systems, scene understanding, and edge-case scenario coverage.',
      tag: 'Computer Vision',
      // Dark night highway with light trails
      image: 'https://images.unsplash.com/photo-1449965408869-eaa3f722e40d?auto=format&fit=crop&w=1200&q=80',
    },
    {
      title: 'AI-Enabled Customer Service',
      text: 'Conversational datasets and intent-mapping frameworks that power intelligent support experiences across multiple languages and channels.',
      tag: 'Conversational AI',
      // Dark chat / messaging interface glow
      image: 'https://images.unsplash.com/photo-1611532736597-de2d4265fba3?auto=format&fit=crop&w=1200&q=80',
    },
    {
      title: 'NLP & Speech Acquisition',
      text: 'Curation of multilingual text and speech corpora for natural language processing and voice model development at scale.',
      tag: 'Speech',
      // Dark sound wave / audio visualizer
      image: 'https://images.unsplash.com/photo-1598488035139-bdbb2231ce04?auto=format&fit=crop&w=1200&q=80',
    },
    {
      title: 'Computer Vision (CV)',
      text: 'Image and video labeling pipelines for object detection, segmentation, tracking, and quality-controlled model training workflows.',
      tag: 'Vision',
      // Dark eye with neon/tech reflection
      image: 'https://images.unsplash.com/photo-1635070041078-e363dbe005cb?auto=format&fit=crop&w=1200&q=80',
    },
    {
      title: 'Genealogy',
      text: 'Digitization and structured indexing of historical archives to make legacy records searchable, cross-referenced, and AI-ready.',
      tag: 'Historical Data',
      // Dark moody library with dramatic lighting
      image: 'https://images.unsplash.com/photo-1481627834876-b7833e8f5570?auto=format&fit=crop&w=1200&q=80',
    },
  ]

  return (
    <main className="ap-page">
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Manrope:wght@400;500;600;700;800&display=swap');

        /* ── Base ── */
        .ap-page {
          font-family: 'Manrope', sans-serif;
          background: #ffffff;
          min-height: 100vh;
          color: #0a1a0e;
          overflow-x: hidden;
        }

        /* ── Hero ── */
        .ap-hero {
          max-width: 1320px;
          margin: 0 auto;
          padding: 120px 48px 0;
          animation: ap-fade-up 0.65s ease both;
        }
        .ap-eyebrow {
          display: inline-flex;
          align-items: center;
          gap: 10px;
          font-size: 10.5px;
          font-weight: 700;
          letter-spacing: 0.18em;
          text-transform: uppercase;
          color: rgba(10,26,14,0.32);
          margin-bottom: 20px;
        }
        .ap-eyebrow-line {
          display: inline-block;
          width: 22px;
          height: 1px;
          background: rgba(200,130,0,0.60);
          border-radius: 2px;
        }
        .ap-hero-body {
          display: grid;
          grid-template-columns: 1fr 1fr;
          align-items: end;
          gap: 60px;
        }
        .ap-hero h1 {
          font-size: clamp(2.6rem, 4.8vw, 4.2rem);
          font-weight: 800;
          line-height: 1.06;
          letter-spacing: -0.03em;
          color: #0a1a0e;
          margin: 0;
        }
        .ap-hero h1 em {
          font-style: italic;
          color: #133020;
        }
        .ap-hero-desc {
          font-size: 15px;
          line-height: 1.75;
          color: rgba(10,26,14,0.48);
          margin: 0;
          padding-bottom: 6px;
        }

        /* ── Divider ── */
        .ap-divider {
          max-width: 1320px;
          margin: 48px auto 0;
          padding: 0 48px;
          height: 1px;
          background: rgba(10,26,14,0.07);
        }

        /* ── Grid Section ── */
        .ap-grid-section {
          max-width: 1320px;
          margin: 0 auto;
          padding: 56px 48px 100px;
          animation: ap-fade-up 0.65s ease 0.15s both;
        }
        .ap-section-heading {
          display: flex;
          align-items: center;
          gap: 12px;
          margin-bottom: 36px;
        }
        .ap-section-heading span {
          font-size: 10px;
          font-weight: 700;
          letter-spacing: 0.16em;
          text-transform: uppercase;
          color: rgba(10,26,14,0.28);
        }
        .ap-section-heading h2 {
          font-size: clamp(1.1rem, 2vw, 1.35rem);
          font-weight: 800;
          letter-spacing: -0.02em;
          color: #0a1a0e;
          margin: 0;
        }

        /*
          ── Masonry Grid Layout ──
          3 columns, 4 rows × 210px each

          Placement map:
            Card 1 (AI Data Extraction)      → col 1,   row 1–2  (tall)
            Card 2 (ML Enablement)           → col 2–3, row 1    (wide)
            Card 3 (Autonomous Driving)      → col 2,   row 2    (small)
            Card 4 (AI Customer Service)     → col 3,   row 2    (small)
            Card 5 (NLP & Speech)            → col 1–2, row 3    (wide)
            Card 6 (Computer Vision)         → col 3,   row 3–4  (tall)
            Card 7 (Genealogy)               → col 1–2, row 4    (wide)
        */
        .ap-grid {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          grid-template-rows: repeat(4, 210px);
          gap: 14px;
        }

        /* ── Card base ── */
        .ap-card {
          position: relative;
          border-radius: 20px;
          overflow: hidden;
          border: 1px solid rgba(10,26,14,0.09);
          cursor: pointer;
          background: #0a1a0e;
          box-shadow: 0 2px 12px rgba(10,26,14,0.06);
          transition: box-shadow 0.35s ease, transform 0.35s ease;
          animation: ap-fade-up 0.55s ease both;
        }
        .ap-card:hover {
          box-shadow: 0 12px 52px rgba(10,26,14,0.18);
          transform: translateY(-3px);
        }

        /* Individual placements */
        .ap-card:nth-child(1) { grid-column: 1;   grid-row: 1 / 3; animation-delay: 0.10s; }
        .ap-card:nth-child(2) { grid-column: 2/4; grid-row: 1;     animation-delay: 0.16s; }
        .ap-card:nth-child(3) { grid-column: 2;   grid-row: 2;     animation-delay: 0.22s; }
        .ap-card:nth-child(4) { grid-column: 3;   grid-row: 2;     animation-delay: 0.28s; }
        .ap-card:nth-child(5) { grid-column: 1/3; grid-row: 3;     animation-delay: 0.34s; }
        .ap-card:nth-child(6) { grid-column: 3;   grid-row: 3 / 5; animation-delay: 0.40s; }
        .ap-card:nth-child(7) { grid-column: 1/3; grid-row: 4;     animation-delay: 0.46s; }

        /* ── Image ── */
        .ap-card-img {
          position: absolute;
          inset: 0;
          width: 100%;
          height: 100%;
          object-fit: cover;
          transition: transform 0.65s ease, opacity 0.4s ease;
          opacity: 0.55;
          filter: grayscale(30%) saturate(0.8);
        }
        .ap-card:hover .ap-card-img {
          transform: scale(1.06);
          opacity: 0.22;
        }

        /* Green tint layer — always on */
        .ap-card-tint {
          position: absolute;
          inset: 0;
          background: rgba(13, 40, 22, 0.55);
          mix-blend-mode: multiply;
          z-index: 1;
          transition: opacity 0.4s ease;
          pointer-events: none;
        }
        .ap-card:hover .ap-card-tint { opacity: 0; }

        /* Gradient overlay — default */
        .ap-card::before {
          content: '';
          position: absolute;
          inset: 0;
          background: linear-gradient(
            to top,
            rgba(8,22,12,0.95) 0%,
            rgba(13,40,22,0.40) 50%,
            rgba(13,40,22,0.15) 100%
          );
          z-index: 2;
          transition: opacity 0.4s ease;
        }
        .ap-card:hover::before { opacity: 0; }

        /* Dark overlay — hover */
        .ap-card::after {
          content: '';
          position: absolute;
          inset: 0;
          background: rgba(8,20,11,0.88);
          z-index: 2;
          opacity: 0;
          transition: opacity 0.4s ease;
        }
        .ap-card:hover::after { opacity: 1; }

        /* ── Idle state ── */
        .ap-card-idle {
          position: absolute;
          bottom: 0; left: 0; right: 0;
          padding: 20px 22px;
          z-index: 3;
          display: flex;
          flex-direction: column;
          gap: 8px;
          transition: opacity 0.32s ease, transform 0.32s ease;
        }
        .ap-card:hover .ap-card-idle {
          opacity: 0;
          transform: translateY(10px);
        }

        /* ── Tag ── */
        .ap-tag {
          display: inline-flex;
          align-items: center;
          gap: 5px;
          align-self: flex-start;
          font-size: 9.5px;
          font-weight: 700;
          letter-spacing: 0.13em;
          text-transform: uppercase;
          color: #c47f00;
          background: rgba(200,130,0,0.12);
          border: 1px solid rgba(200,130,0,0.28);
          padding: 4px 10px;
          border-radius: 999px;
        }
        .ap-tag-dot {
          width: 4px; height: 4px;
          border-radius: 50%;
          background: #c47f00;
        }

        .ap-card-idle h3 {
          font-size: 0.95rem;
          font-weight: 800;
          color: #fff;
          margin: 0;
          letter-spacing: -0.015em;
          line-height: 1.25;
        }
        /* Bigger title for larger cards */
        .ap-card:nth-child(1) .ap-card-idle h3,
        .ap-card:nth-child(2) .ap-card-idle h3,
        .ap-card:nth-child(5) .ap-card-idle h3,
        .ap-card:nth-child(6) .ap-card-idle h3,
        .ap-card:nth-child(7) .ap-card-idle h3 {
          font-size: 1.18rem;
        }

        /* ── Hover content ── */
        .ap-card-hover {
          position: absolute;
          inset: 0;
          padding: 28px;
          z-index: 4;
          display: flex;
          flex-direction: column;
          justify-content: center;
          gap: 12px;
          opacity: 0;
          transform: translateY(12px);
          transition: opacity 0.35s ease 0.07s, transform 0.35s ease 0.07s;
        }
        .ap-card:hover .ap-card-hover {
          opacity: 1;
          transform: translateY(0);
        }
        .ap-card-hover h3 {
          font-size: 1rem;
          font-weight: 800;
          color: #fff;
          margin: 0;
          letter-spacing: -0.015em;
          line-height: 1.25;
        }
        .ap-card:nth-child(1) .ap-card-hover h3,
        .ap-card:nth-child(2) .ap-card-hover h3,
        .ap-card:nth-child(5) .ap-card-hover h3,
        .ap-card:nth-child(6) .ap-card-hover h3,
        .ap-card:nth-child(7) .ap-card-hover h3 {
          font-size: 1.2rem;
        }
        .ap-card-hover p {
          font-size: 13px;
          line-height: 1.72;
          color: rgba(255,255,255,0.54);
          margin: 0;
          font-weight: 500;
          max-width: 360px;
        }
        /* ── Animations ── */
        @keyframes ap-fade-up {
          from { opacity: 0; transform: translateY(24px); }
          to   { opacity: 1; transform: translateY(0); }
        }

        /* ── Responsive: tablet ── */
        @media (max-width: 1024px) {
          .ap-hero { padding: 100px 24px 0; }
          .ap-hero-body { grid-template-columns: 1fr; gap: 20px; }
          .ap-divider { padding: 0 24px; }
          .ap-grid-section { padding: 40px 24px 80px; }
          .ap-grid {
            grid-template-columns: repeat(2, 1fr);
            grid-template-rows: 240px 240px 240px 240px 240px;
          }
          .ap-card:nth-child(1) { grid-column: 1;   grid-row: 1 / 3; }
          .ap-card:nth-child(2) { grid-column: 2;   grid-row: 1; }
          .ap-card:nth-child(3) { grid-column: 2;   grid-row: 2; }
          .ap-card:nth-child(4) { grid-column: 1/3; grid-row: 3; }
          .ap-card:nth-child(5) { grid-column: 1;   grid-row: 4; }
          .ap-card:nth-child(6) { grid-column: 2;   grid-row: 4 / 6; }
          .ap-card:nth-child(7) { grid-column: 1;   grid-row: 5; }
        }

        /* ── Responsive: mobile ── */
        @media (max-width: 600px) {
          .ap-hero h1 { font-size: 2.2rem; }
          .ap-grid {
            display: flex;
            flex-direction: column;
            gap: 12px;
          }
          .ap-card {
            width: 100%;
            aspect-ratio: 4 / 3;
          }
        }
      `}</style>

      {/* ── Hero ── */}
      <section className="ap-hero" aria-labelledby="ap-title">
        <div className="ap-eyebrow">
          <span className="ap-eyebrow-line" />
          What We Do
          <span className="ap-eyebrow-line" />
        </div>
        <div className="ap-hero-body">
          <h1 id="ap-title">
            AI Projects<br />
            {/* We Currently<br />
            <em>Handle.</em> */}
          </h1>
          <p className="ap-hero-desc">
            We design and deliver AI data projects that bridge global operations with tangible business outcomes — combining multilingual execution and scalable data infrastructure.
          </p>
        </div>
      </section>

      <div className="ap-divider" aria-hidden="true" />

      {/* ── Masonry Grid ── */}
      <section className="ap-grid-section" aria-label="AI project categories">
        <div className="ap-section-heading">
          <span>Our Capabilities</span>
          <h2>Projects we currently handle</h2>
        </div>

        <div className="ap-grid">
          {projects.map((project, index) => (
            <article key={`${project.title}-${index}`} className="ap-card">
              <img
                src={project.image}
                alt={project.title}
                className="ap-card-img"
                loading="lazy"
              />
              <div className="ap-card-tint" aria-hidden="true" />

              {/* Idle */}
              <div className="ap-card-idle">
                <span className="ap-tag">
                  <span className="ap-tag-dot" />
                  {project.tag}
                </span>
                <h3>{project.title}</h3>
              </div>

              {/* Hover */}
              <div className="ap-card-hover">
                <span className="ap-tag">
                  <span className="ap-tag-dot" />
                  {project.tag}
                </span>
                <h3>{project.title}</h3>
                <p>{project.text}</p>
              </div>
            </article>
          ))}
        </div>
      </section>
    </main>
  )
}

export default AIProjectsPage


