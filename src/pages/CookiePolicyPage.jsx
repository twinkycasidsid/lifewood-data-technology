import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Cookie, Shield, Settings, Eye, BarChart2, Target, Users, Mail, ChevronRight } from "lucide-react";

const sections = [
  {
    number: "1",
    title: "What Are Cookies?",
    icon: Cookie,
    accent: "#046241",
    content: `Cookies are small text files that are stored on your device (computer, smartphone, or tablet) when you visit a website. They are used to store and track information about your actions and preferences, enabling the website to function properly and deliver a personalized experience.`,
    subsections: [
      { label: "Session Cookies", text: "Temporary cookies that expire once you close your browser. These are used to track your activity during a single session." },
      { label: "Persistent Cookies", text: "These cookies remain on your device until they expire or are deleted, allowing the website to remember your preferences across sessions." },
      { label: "First-party Cookies", text: "Cookies set by the website you are visiting." },
      { label: "Third-party Cookies", text: "Cookies set by a domain other than the website you are visiting, often used for advertising and analytics purposes." },
    ],
  },
  {
    number: "2",
    title: "How Lifewood Uses Cookies",
    icon: Settings,
    accent: "#E8A020",
    content: `We use cookies to improve your browsing experience, streamline functionality, and enhance the performance of our website. Specifically, Lifewood uses cookies for the following purposes:`,
    subsections: [
      { label: "Essential Cookies", text: "These cookies are necessary for the website to function properly. They allow you to navigate the site and use its features, such as accessing secure areas and completing transactions." },
      { label: "Performance and Analytics Cookies", text: "These cookies help us understand how visitors interact with our website by collecting information on site traffic, page views, and other key metrics." },
      { label: "Functionality Cookies", text: "These cookies allow the website to remember your preferences and provide enhanced, personalized features. For example, they may remember your login details or language settings." },
      { label: "Targeting and Advertising Cookies", text: "These cookies are used to deliver relevant advertisements based on your browsing habits and to measure the effectiveness of our marketing campaigns." },
    ],
  },
  {
    number: "3",
    title: "Third-Party Cookies",
    icon: Users,
    accent: "#046241",
    content: `We may allow third-party service providers, such as Google Analytics or social media platforms, to place cookies on your device to track usage, improve site functionality, and deliver targeted ads. These third parties may have access to certain information about your browsing habits but will not be able to identify you personally from this data.\n\nWe recommend reviewing the privacy policies of these third parties to understand how they handle your data.`,
    subsections: [],
  },
  {
    number: "4",
    title: "Your Cookie Choices",
    icon: Eye,
    accent: "#E8A020",
    content: `You have the right to accept or reject cookies. When you visit our website for the first time, you will be asked to consent to the use of cookies through a cookie banner. You can also manage or disable cookies by adjusting your browser settings.`,
    subsections: [
      { label: "Google Chrome", text: "Go to Settings > Privacy and Security > Cookies and other site data" },
      { label: "Mozilla Firefox", text: "Go to Options > Privacy & Security > Cookies and Site Data" },
      { label: "Microsoft Edge", text: "Go to Settings > Site Permissions > Cookies and site data" },
      { label: "Safari", text: "Go to Preferences > Privacy > Cookies and website data" },
    ],
    note: "Please note that disabling certain cookies may affect the functionality of our website and limit your ability to use some of its features.",
  },
  {
    number: "5",
    title: "Managing Cookies on Lifewood",
    icon: Shield,
    accent: "#046241",
    content: `You can manage your cookie preferences at any time by clicking on the "Cookie Settings" link in the footer of our website. From there, you can opt out of non-essential cookies, such as performance and marketing cookies.\n\nIf you do not want to receive cookies, you can also modify your browser settings to notify you when cookies are being used or to block cookies altogether. However, please be aware that some parts of our website may not function properly if you block essential cookies.`,
    subsections: [],
  },
  {
    number: "6",
    title: "Changes to This Cookie Policy",
    icon: BarChart2,
    accent: "#E8A020",
    content: `We may update this Cookie Policy from time to time to reflect changes in our practices, legal requirements, or the services we offer. We encourage you to review this page periodically to stay informed about how we use cookies.`,
    subsections: [],
  },
  {
    number: "7",
    title: "Contact Us",
    icon: Mail,
    accent: "#046241",
    content: `If you have any questions about our use of cookies or how to manage your preferences, please contact us at:`,
    subsections: [],
    contact: "lifewood@gmail.com",
  },
];

const CookiePolicyPage = ({ onNavigate = () => {} }) => {
  const [activeSection, setActiveSection] = useState(sections[0].number);

  const scrollToSection = (number) => {
    const target = document.getElementById(`cp-section-${number}`);
    if (target) {
      target.scrollIntoView({ behavior: "smooth", block: "start" });
      setActiveSection(number);
    }
  };

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const number = entry.target.getAttribute("data-section-number");
            if (number) setActiveSection(number);
          }
        });
      },
      { rootMargin: "-18% 0px -70% 0px", threshold: 0.12 }
    );

    sections.forEach((section) => {
      const element = document.getElementById(`cp-section-${section.number}`);
      if (element) observer.observe(element);
    });

    return () => observer.disconnect();
  }, []);

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Manrope:wght@300;400;500;600;700;800&display=swap');
        *, *::before, *::after { box-sizing: border-box; }

        .cp-root {
          min-height: 100vh;
          background: #f9f9f7;
          font-family: 'Manrope', sans-serif;
          color: #1a2e1e;
          padding-top: 80px;
        }

        /* ── Hero ── */
        .cp-hero {
          position: relative;
          padding: 60px 40px 52px;
          text-align: center;
          overflow: hidden;
          background: linear-gradient(135deg, rgba(10,22,14,0.94) 0%, rgba(13,34,24,0.94) 58%, rgba(4,98,65,0.86) 100%);
          border-bottom: 1px solid rgba(255,255,255,0.08);
        }
        .cp-hero::before {
          content: "";
          position: absolute; inset: 0;
          background:
            radial-gradient(circle at 12% 14%, rgba(232,160,32,0.14), transparent 46%),
            radial-gradient(circle at 88% 84%, rgba(255,255,255,0.08), transparent 44%);
          pointer-events: none;
        }
        .cp-hero-eyebrow {
          display: inline-flex; align-items: center; gap: 7px;
          background: rgba(255,255,255,0.08);
          border: 1px solid rgba(255,255,255,0.16);
          border-radius: 999px; padding: 5px 14px;
          font-size: 11px; font-weight: 700; letter-spacing: 0.11em;
          text-transform: uppercase; color: #f4f6f2;
          margin-bottom: 20px; font-family: 'Manrope', sans-serif;
          position: relative; z-index: 1;
        }
        .cp-hero-title {
          font-family: 'Manrope', sans-serif;
          font-size: clamp(32px, 5.5vw, 62px);
          font-weight: 800; line-height: 1.08;
          letter-spacing: -0.03em; color: #f8faf6;
          margin: 0 0 16px; position: relative; z-index: 1;
        }
        .cp-hero-title span { color: #E8A020; }
        .cp-hero-sub {
          font-size: clamp(13px, 1.6vw, 15px);
          color: rgba(246,247,244,0.82); max-width: 480px;
          margin: 0 auto; line-height: 1.65; font-weight: 400;
          font-family: 'Manrope', sans-serif;
          position: relative; z-index: 1;
        }
        .cp-hero-meta {
          display: flex; align-items: center; justify-content: center; gap: 24px;
          margin-top: 28px; flex-wrap: wrap;
          position: relative; z-index: 1;
        }
        .cp-hero-meta-item {
          display: flex; align-items: center; gap: 6px;
          font-size: 11.5px; font-weight: 600;
          color: rgba(246,247,244,0.72); font-family: 'Manrope', sans-serif;
        }
        .cp-hero-meta-dot { width: 4px; height: 4px; border-radius: 50%; background: rgba(255,255,255,0.45); }

        .cp-layout {
          max-width: 1240px;
          margin: 0 auto;
          padding: 0 28px 90px;
          display: grid;
          grid-template-columns: 280px minmax(0, 1fr);
          gap: 0 26px;
          align-items: start;
        }

        .cp-toc {
          position: sticky;
          top: 96px;
          align-self: start;
          padding: 28px 14px 20px 0;
          border-right: 1px solid rgba(26,46,30,0.12);
          max-height: calc(100vh - 110px);
          overflow: auto;
        }
        .cp-toc-label {
          font-size: 10px;
          letter-spacing: 0.16em;
          text-transform: uppercase;
          color: rgba(26,46,30,0.52);
          margin-bottom: 14px;
          font-weight: 700;
        }
        .cp-toc-row {
          display: flex;
          flex-direction: column;
          gap: 6px;
        }
        .cp-toc-item {
          border: none;
          background: none;
          text-align: left;
          font-family: 'Manrope', sans-serif;
          font-size: 12.5px;
          font-weight: 600;
          color: rgba(26,46,30,0.60);
          padding: 8px 12px;
          cursor: pointer;
          border-left: 2px solid transparent;
          border-radius: 0 8px 8px 0;
          transition: color 0.18s ease, background 0.18s ease;
          overflow-wrap: anywhere;
        }
        .cp-toc-item:hover {
          color: #1a2e1e;
          background: rgba(4,98,65,0.06);
        }
        .cp-toc-item.active {
          color: #1a2e1e;
          border-left-color: #e8a020;
          background: rgba(4,98,65,0.08);
        }
        .cp-main {
          min-width: 0;
        }

        /* ── Body ── */
        .cp-body {
          margin: 0;
          padding: 28px 0 0;
          display: flex;
          flex-direction: column;
          gap: 16px;
        }

        /* ── Section card ── */
        .cp-card {
          background: #fff;
          border: 1px solid rgba(26,46,30,0.085);
          border-radius: 20px;
          padding: 28px 32px;
          transition: border-color 0.2s ease, box-shadow 0.2s ease;
          overflow: hidden;
          position: relative;
          scroll-margin-top: 100px;
        }
        .cp-card:hover {
          border-color: rgba(4,98,65,0.18);
          box-shadow: 0 4px 24px rgba(4,98,65,0.05);
        }

        /* ── Section header ── */
        .cp-section-header {
          display: flex; align-items: flex-start; gap: 16px;
          margin-bottom: 18px;
        }
        .cp-icon-wrap {
          width: 42px; height: 42px; border-radius: 12px;
          display: flex; align-items: center; justify-content: center;
          flex-shrink: 0;
        }
        .cp-section-number {
          font-size: 9.5px; font-weight: 700; letter-spacing: 0.14em;
          text-transform: uppercase; margin-bottom: 4px;
          font-family: 'Manrope', sans-serif;
        }
        .cp-section-title {
          font-family: 'Manrope', sans-serif;
          font-size: clamp(16px, 2vw, 19px);
          font-weight: 800; color: #1a2e1e;
          letter-spacing: -0.02em; line-height: 1.2; margin: 0;
        }

        /* ── Content ── */
        .cp-content {
          font-size: 14px; line-height: 1.78;
          color: rgba(26,46,30,0.58); font-weight: 400;
          font-family: 'Manrope', sans-serif;
          margin-bottom: 0; white-space: pre-line;
        }

        /* ── Subsections ── */
        .cp-subsections {
          margin-top: 18px;
          display: flex; flex-direction: column; gap: 10px;
        }
        .cp-subsection {
          display: flex; align-items: flex-start; gap: 12px;
          background: #f9f9f7;
          border: 1px solid rgba(26,46,30,0.07);
          border-radius: 12px; padding: 14px 16px;
        }
        .cp-subsection-dot {
          width: 6px; height: 6px; border-radius: 50%;
          flex-shrink: 0; margin-top: 6px;
        }
        .cp-subsection-label {
          font-size: 12px; font-weight: 700; color: #1a2e1e;
          font-family: 'Manrope', sans-serif; margin-bottom: 3px;
          letter-spacing: -0.01em;
        }
        .cp-subsection-text {
          font-size: 13px; line-height: 1.65;
          color: rgba(26,46,30,0.54); font-weight: 400;
          font-family: 'Manrope', sans-serif; margin: 0;
        }

        /* ── Note ── */
        .cp-note {
          margin-top: 14px;
          background: rgba(232,160,32,0.06);
          border: 1px solid rgba(232,160,32,0.18);
          border-radius: 10px; padding: 12px 16px;
          font-size: 13px; line-height: 1.65;
          color: rgba(26,46,30,0.60); font-weight: 500;
          font-family: 'Manrope', sans-serif;
        }

        /* ── Contact email ── */
        .cp-email-link {
          display: inline-flex; align-items: center; gap: 8px;
          margin-top: 14px;
          background: rgba(4,98,65,0.06);
          border: 1px solid rgba(4,98,65,0.15);
          border-radius: 10px; padding: 11px 18px;
          font-size: 13.5px; font-weight: 700; color: #046241;
          text-decoration: none; font-family: 'Manrope', sans-serif;
          transition: all 0.18s ease;
        }
        .cp-email-link:hover {
          background: rgba(4,98,65,0.10);
          border-color: rgba(4,98,65,0.28);
          transform: translateY(-1px);
          box-shadow: 0 4px 14px rgba(4,98,65,0.10);
        }

        /* ── Ghost number ── */
        .cp-ghost {
          position: absolute; bottom: -16px; right: 16px;
          font-size: 100px; font-weight: 900; line-height: 1;
          color: rgba(26,46,30,0.03);
          pointer-events: none; user-select: none;
          font-family: 'Manrope', sans-serif;
        }

        /* ── Responsive ── */
        @media (max-width: 700px) {
          .cp-root { padding-top: 64px; }
          .cp-hero { padding: 44px 20px 40px; }
          .cp-body { padding: 20px 0 0; gap: 12px; }
          .cp-card { padding: 22px 20px; }
          .cp-section-header { gap: 12px; }
          .cp-hero-meta { gap: 14px; }
          .cp-toc { padding: 10px 0 10px; }
          .cp-toc-row {
            flex-wrap: wrap;
            overflow-x: visible;
            gap: 8px;
          }
          .cp-toc-item {
            max-width: none;
            white-space: normal;
            line-height: 1.25;
            padding: 8px 10px;
            font-size: 12px;
          }
        }

        @media (max-width: 1024px) {
          .cp-layout {
            grid-template-columns: 1fr;
            padding: 0 14px 64px;
          }
          .cp-toc {
            position: static;
            top: auto;
            z-index: 20;
            border-right: none;
            border-bottom: 1px solid rgba(26,46,30,0.12);
            padding: 12px 0 10px;
            margin: 0 0 10px;
            background: rgba(249,249,247,0.95);
            backdrop-filter: blur(8px);
            max-height: none;
            overflow: visible;
          }
          .cp-toc-row {
            flex-direction: row;
            gap: 8px;
            overflow-x: auto;
            -webkit-overflow-scrolling: touch;
            scrollbar-width: thin;
            padding-bottom: 2px;
          }
          .cp-toc-item {
            white-space: nowrap;
            border-left: none;
            border-bottom: 2px solid transparent;
            border-radius: 999px;
            border: 1px solid rgba(26,46,30,0.10);
            background: #fff;
            flex: 0 0 auto;
            max-width: min(82vw, 360px);
            overflow: hidden;
            text-overflow: ellipsis;
          }
          .cp-toc-item.active {
            border-left: 1px solid rgba(26,46,30,0.10);
            border-bottom-color: #e8a020;
          }
        }
      `}</style>

      <div className="cp-root">

        {/* ── Hero ── */}
        <motion.div
          className="cp-hero"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
        >
          <div className="cp-hero-eyebrow">
            <Cookie size={11} />
            Legal
          </div>
          <h1 className="cp-hero-title">
            Cookie <span>Policy</span>
          </h1>
          <p className="cp-hero-sub">
            At Lifewood Data Technology Ltd., we use cookies and similar tracking technologies to enhance your experience, analyze site usage, and personalize content.
          </p>
          <div className="cp-hero-meta">
            <span className="cp-hero-meta-item">Lifewood Data Technology Ltd.</span>
            <span className="cp-hero-meta-dot" />
            <span className="cp-hero-meta-item">7 sections</span>
            <span className="cp-hero-meta-dot" />
            <span className="cp-hero-meta-item">Last updated 2025</span>
          </div>
        </motion.div>

        <div className="cp-layout">
          <aside className="cp-toc">
            <p className="cp-toc-label">On this page</p>
            <div className="cp-toc-row">
              {sections.map((section) => (
                <button
                  key={`cp-toc-${section.number}`}
                  type="button"
                  className={`cp-toc-item${activeSection === section.number ? " active" : ""}`}
                  onClick={() => scrollToSection(section.number)}
                >
                  {section.number}. {section.title}
                </button>
              ))}
            </div>
          </aside>

          <main className="cp-main">
            {/* ── Sections ── */}
            <div className="cp-body">
              {sections.map((section, i) => {
                const Icon = section.icon;
                return (
                  <motion.div
                    key={section.number}
                    id={`cp-section-${section.number}`}
                    data-section-number={section.number}
                    className="cp-card"
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, margin: "-40px" }}
                    transition={{ duration: 0.5, delay: i * 0.05, ease: [0.22, 1, 0.36, 1] }}
                    onMouseEnter={() => setActiveSection(section.number)}
                  >
                {/* Ghost number */}
                <div className="cp-ghost">{section.number}</div>

                {/* Header */}
                <div className="cp-section-header">
                  <div
                    className="cp-icon-wrap"
                    style={{ background: `${section.accent}12`, border: `1px solid ${section.accent}22` }}
                  >
                    <Icon size={18} color={section.accent} strokeWidth={1.8} />
                  </div>
                  <div>
                    <div className="cp-section-number" style={{ color: section.accent }}>
                      Section {section.number}
                    </div>
                    <h2 className="cp-section-title">{section.title}</h2>
                  </div>
                </div>

                {/* Divider */}
                <div style={{ height: 1, background: "rgba(26,46,30,0.06)", marginBottom: 16 }} />

                {/* Body text */}
                <p className="cp-content">{section.content}</p>

                {/* Subsections */}
                {section.subsections.length > 0 && (
                  <div className="cp-subsections">
                    {section.subsections.map((sub, si) => (
                      <div key={si} className="cp-subsection">
                        <div
                          className="cp-subsection-dot"
                          style={{ background: section.accent }}
                        />
                        <div>
                          <div className="cp-subsection-label">{sub.label}</div>
                          <p className="cp-subsection-text">{sub.text}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                )}

                {/* Note */}
                {section.note && (
                  <div className="cp-note">{section.note}</div>
                )}

                {/* Contact email */}
                {section.contact && (
                  <a href={`mailto:${section.contact}`} className="cp-email-link">
                    <Mail size={14} />
                    {section.contact}
                    <ChevronRight size={13} strokeWidth={2.5} style={{ marginLeft: 2 }} />
                  </a>
                )}
                  </motion.div>
                );
              })}
            </div>
          </main>
        </div>
      </div>
    </>
  );
};

export default CookiePolicyPage;

