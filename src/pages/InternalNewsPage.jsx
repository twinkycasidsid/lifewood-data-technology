const InternalNewsPage = () => {
  return (
    <main className="lw-news">
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Manrope:wght@400;500;600;700;800&display=swap');

        /* ── Base ── */
        .lw-news {
          font-family: 'Manrope', sans-serif;
          background: #ffffff;
          min-height: 100vh;
          color: #0a1a0e;
          overflow-x: hidden;
        }

        /* ── Hero ── */
        .lw-news-hero {
          position: relative;
          max-width: 1320px;
          margin: 0 auto;
          padding: 140px 48px 0;
          display: grid;
          grid-template-columns: 1fr auto;
          align-items: end;
          gap: 40px;
        }

        .lw-news-eyebrow {
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
        .lw-news-eyebrow-line {
          display: inline-block;
          width: 22px; height: 1px;
          background: rgba(200,130,0,0.60);
          border-radius: 2px;
        }

        .lw-news-title-wrap { grid-column: 1; }

        .lw-news-title {
          font-size: clamp(2.4rem, 4.5vw, 4rem);
          font-weight: 800;
          line-height: 1.06;
          letter-spacing: -0.028em;
          color: #0a1a0e;
          margin: 0 0 14px;
        }
        .lw-news-title em {
          font-style: italic;
          color: #133020;
        }

        .lw-news-desc {
          font-size: 15px;
          line-height: 1.75;
          color: rgba(10,26,14,0.48);
          max-width: 460px;
          margin: 0;
        }

        /* Coming soon badge — top right */
        .lw-news-badge {
          grid-column: 2;
          align-self: start;
          margin-top: 4px;
          display: inline-flex;
          flex-direction: column;
          align-items: center;
          gap: 6px;
          padding: 18px 24px;
          border-radius: 16px;
          background: rgba(200,130,0,0.07);
          border: 1px solid rgba(200,130,0,0.22);
          text-align: center;
          white-space: nowrap;
        }
        .lw-news-badge-dot {
          width: 8px; height: 8px;
          border-radius: 50%;
          background: #c47f00;
          box-shadow: 0 0 0 4px rgba(200,130,0,0.15);
          animation: lw-pulse-dot 2s ease-in-out infinite;
        }
        @keyframes lw-pulse-dot {
          0%, 100% { box-shadow: 0 0 0 4px rgba(200,130,0,0.15); }
          50%       { box-shadow: 0 0 0 8px rgba(200,130,0,0.07); }
        }
        .lw-news-badge-text {
          font-size: 10px;
          font-weight: 700;
          letter-spacing: 0.14em;
          text-transform: uppercase;
          color: #c47f00;
        }
        .lw-news-badge-label {
          font-size: 13px;
          font-weight: 800;
          color: #0a1a0e;
          letter-spacing: -0.01em;
        }

        /* ── Divider ── */
        .lw-news-divider {
          max-width: 1320px;
          margin: 48px auto 0;
          padding: 0 48px;
          height: 1px;
          background: rgba(10,26,14,0.07);
        }

        /* ── Video section ── */
        .lw-news-video-section {
          max-width: 1320px;
          margin: 0 auto;
          padding: 56px 48px 80px;
          display: grid;
          grid-template-columns: 1fr 280px;
          gap: 40px;
          align-items: start;
        }

        /* Video frame */
        .lw-news-video-wrap {
          position: relative;
          border-radius: 18px;
          overflow: hidden;
          border: 1px solid rgba(10,26,14,0.09);
          box-shadow:
            0 4px 24px rgba(10,26,14,0.07),
            0 20px 60px rgba(10,26,14,0.05);
          background: #0a1a0e;
          aspect-ratio: 16 / 9;
        }

        .lw-news-video-wrap iframe {
          position: absolute;
          inset: 0;
          width: 100%;
          height: 100%;
          border: none;
          display: block;
        }

        /* Video label strip below player */
        .lw-news-video-meta {
          margin-top: 16px;
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 12px;
        }
        .lw-news-video-tag {
          display: inline-flex;
          align-items: center;
          gap: 6px;
          font-size: 10.5px;
          font-weight: 700;
          letter-spacing: 0.12em;
          text-transform: uppercase;
          color: #c47f00;
          background: rgba(200,130,0,0.08);
          border: 1px solid rgba(200,130,0,0.20);
          padding: 4px 10px;
          border-radius: 999px;
        }
        .lw-news-video-tag-dot {
          width: 5px; height: 5px;
          border-radius: 50%;
          background: #c47f00;
        }
        .lw-news-video-title {
          font-size: 13px;
          font-weight: 600;
          color: rgba(10,26,14,0.45);
        }

        /* ── Sidebar info panel ── */
        .lw-news-sidebar {
          display: flex;
          flex-direction: column;
          gap: 16px;
          padding-top: 4px;
        }

        .lw-news-sidebar-heading {
          font-size: 10px;
          font-weight: 700;
          letter-spacing: 0.16em;
          text-transform: uppercase;
          color: rgba(10,26,14,0.28);
          margin-bottom: 4px;
        }

        .lw-news-info-card {
          padding: 18px;
          border-radius: 14px;
          background: rgba(19,48,32,0.03);
          border: 1px solid rgba(19,48,32,0.08);
        }

        .lw-news-info-card-label {
          font-size: 9.5px;
          font-weight: 700;
          letter-spacing: 0.14em;
          text-transform: uppercase;
          color: rgba(10,26,14,0.28);
          margin: 0 0 6px;
        }
        .lw-news-info-card-value {
          font-size: 14.5px;
          font-weight: 800;
          color: #0a1a0e;
          margin: 0 0 2px;
          letter-spacing: -0.01em;
        }
        .lw-news-info-card-sub {
          font-size: 12px;
          color: rgba(10,26,14,0.40);
          font-weight: 500;
        }

        .lw-news-info-divider {
          height: 1px;
          background: rgba(10,26,14,0.06);
        }

        /* Stay tuned card */
        .lw-news-stay-card {
          padding: 20px;
          border-radius: 14px;
          background: #133020;
          border: 1px solid rgba(19,48,32,0.5);
        }
        .lw-news-stay-card p {
          font-size: 9.5px;
          font-weight: 700;
          letter-spacing: 0.14em;
          text-transform: uppercase;
          color: rgba(255,255,255,0.35);
          margin: 0 0 8px;
        }
        .lw-news-stay-card strong {
          display: block;
          font-size: 15px;
          font-weight: 800;
          color: #fff;
          margin-bottom: 6px;
          line-height: 1.3;
        }
        .lw-news-stay-card span {
          font-size: 12.5px;
          color: rgba(255,255,255,0.45);
          line-height: 1.6;
        }

        /* ── Responsive ── */
        @media (max-width: 1024px) {
          .lw-news-hero { padding: 120px 24px 0; grid-template-columns: 1fr; }
          .lw-news-badge { grid-column: 1; justify-self: start; flex-direction: row; }
          .lw-news-divider { padding: 0 24px; }
          .lw-news-video-section { grid-template-columns: 1fr; padding: 40px 24px 60px; }
        }
        @media (max-width: 600px) {
          .lw-news-title { font-size: 2.2rem; }
          .lw-news-video-meta { flex-direction: column; align-items: flex-start; }
        }
      `}</style>

      {/* ── Hero ── */}
      <section className="lw-news-hero" aria-labelledby="news-title">

        <div className="lw-news-eyebrow">
          <span className="lw-news-eyebrow-line" />
          Internal News
          <span className="lw-news-eyebrow-line" />
        </div>

        <div className="lw-news-title-wrap">
          <h1 className="lw-news-title" id="news-title">
            RootsTech<br />
            <em>2026.</em>
          </h1>
          <p className="lw-news-desc">
            Lifewood's latest internal feature — stay connected with the stories,
            events, and milestones shaping our global team.
          </p>
        </div>

      </section>

      <div className="lw-news-divider" aria-hidden="true" />

      {/* ── Video + Sidebar ── */}
      <section className="lw-news-video-section" aria-label="Featured video and event details">

        {/* Video */}
        <div>
          <div className="lw-news-video-wrap">
            <iframe
              src="https://www.youtube.com/embed/ccyrQ87EJag"
              title="Lifewood Internal News — RootsTech 2026"
              loading="lazy"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
              allowFullScreen
              referrerPolicy="strict-origin-when-cross-origin"
            />
          </div>
          <div className="lw-news-video-meta">
            <span className="lw-news-video-tag">
              <span className="lw-news-video-tag-dot" />
              Featured Highlight
            </span>
            <span className="lw-news-video-title">RootsTech 2026 — Lifewood Preview</span>
          </div>
        </div>

        {/* Sidebar */}
        <aside className="lw-news-sidebar" aria-label="Event details">

          <p className="lw-news-sidebar-heading">Event Details</p>

          <div className="lw-news-info-card">
            <p className="lw-news-info-card-label">Event</p>
            <p className="lw-news-info-card-value">RootsTech 2026</p>
            <p className="lw-news-info-card-sub">Annual global gathering</p>
          </div>

          <div className="lw-news-info-divider" />

          <div className="lw-news-info-card">
            <p className="lw-news-info-card-label">Hosted by</p>
            <p className="lw-news-info-card-value">Lifewood Data Technology</p>
            <p className="lw-news-info-card-sub">Internal communications team</p>
          </div>

          <div className="lw-news-info-divider" />

          <div className="lw-news-info-card">
            <p className="lw-news-info-card-label">Coverage</p>
            <p className="lw-news-info-card-value">Global Teams</p>
            <p className="lw-news-info-card-sub">Across all 30+ countries</p>
          </div>

            {/* <div className="lw-news-stay-card">
              <p>Stay Tuned</p>
              <strong>More updates on the way.</strong>
              <span>
                Full event coverage, highlights, and stories from our teams worldwide will be published here.
              </span>
            </div> */}

        </aside>
      </section>
    </main>
  );
};

export default InternalNewsPage;