import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Phone, UserCircle2, Menu, X } from "lucide-react";

// ─── Nav Data ────────────────────────────────────────────────────────────────
const navItems = [
  { label: "Home", href: "/" },
  {
    label: "Our Company",
    children: [
      { label: "About Us", href: "/about" },
      { label: "Our Offices", href: "/offices" },
      { label: "Philanthropy & Impact", href: "/phil-impact" },
      { label: "Internal News", href: "/internal-news" },
    ],
  },
  {
    label: "AI Initiatives",
    children: [
      { label: "AI Services", href: "/ai-services" },
      { label: "AI Projects", href: "/ai-projects" },
    ],
  },
  {
    label: "What We Offer",
    children: [
      { label: "Type A – Data Servicing", href: "/data-service" },
      { label: "Type B – Horizontal LLM Data", href: "/horizontal-llm-data" },
      { label: "Type C – Vertical LLM Data", href: "/vertical-llm-data" },
      { label: "Type D – AIGC", href: "/aigc" },
    ],
  },
  { label: "Careers", href: "/careers" },
];

// ─── Main Component ───────────────────────────────────────────────────────────
const Navigation = ({
  currentPath = "/",
  onNavigate = () => {},
  onSetAuthMode = () => {},
}) => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [activeDropdown, setActiveDropdown] = useState(null);
  const [hoverTimeout, setHoverTimeout] = useState(null);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [openMobileSection, setOpenMobileSection] = useState(null);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    setIsLoaded(true);
    const handleScroll = () => setIsScrolled(window.scrollY > 40);
    window.addEventListener("scroll", handleScroll);
    handleScroll();
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    document.body.style.overflow = isMobileMenuOpen ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [isMobileMenuOpen]);

  useEffect(() => {
    setIsMobileMenuOpen(false);
    setOpenMobileSection(null);
    setActiveDropdown(null);
  }, [currentPath]);

  const closeAll = () => {
    setIsMobileMenuOpen(false);
    setOpenMobileSection(null);
    setActiveDropdown(null);
  };

  const handleMouseEnter = (label, hasChildren) => {
    if (hoverTimeout) clearTimeout(hoverTimeout);
    if (hasChildren) setActiveDropdown(label);
  };

  const handleMouseLeave = () => {
    const t = setTimeout(() => setActiveDropdown(null), 150);
    setHoverTimeout(t);
  };

  return (
    <>
      <style>{`
        .lw-nav-link {
          position: relative;
          display: inline-flex;
          align-items: center;
          gap: 5px;
          padding: 6px 14px;
          border-radius: 8px;
          font-weight: 500;
          font-size: 15px;
          white-space: nowrap;
          cursor: pointer;
          text-decoration: none;
          color: rgba(255,255,255,0.75);
          transition: color 0.18s ease, background 0.18s ease;
          border: none;
          background: transparent;
          outline: none;
        }
        .lw-nav-link::after {
          content: "";
          position: absolute;
          bottom: 0;
          left: 14px;
          right: 14px;
          height: 1.5px;
          border-radius: 2px;
          background: rgba(232,160,32,0.85);
          transform: scaleX(0);
          transform-origin: center;
          transition: transform 0.22s ease;
        }
        .lw-nav-link:hover,
        .lw-nav-link.active {
          color: #fff;
        }
        .lw-nav-link:hover::after,
        .lw-nav-link.active::after {
          transform: scaleX(1);
        }
        .lw-dropdown-wrapper {
          position: absolute;
          top: 100%;
          left: -14px;
          padding-top: 6px;
          z-index: 200;
        }
        .lw-dropdown {
          min-width: 240px;
          background: rgba(12,26,17,0.92);
          backdrop-filter: blur(28px);
          -webkit-backdrop-filter: blur(28px);
          border: 1px solid rgba(255,255,255,0.13);
          border-radius: 16px;
          padding: 6px;
          box-shadow:
            0 4px 6px rgba(0,0,0,0.12),
            0 20px 48px rgba(0,0,0,0.42),
            inset 0 1px 0 rgba(255,255,255,0.06);
        }
        .lw-dropdown-link {
          display: block;
          padding: 13px 20px;
          border-radius: 10px;
          font-size: 14px;
          font-weight: 500;
          color: rgba(255,255,255,0.68);
          text-decoration: none;
          transition: background 0.15s ease, color 0.15s ease;
          letter-spacing: 0.01em;
        }
        .lw-dropdown-link:hover {
          background: rgba(255,255,255,0.08);
          color: #fff;
        }
        .lw-contact-btn {
          display: inline-flex;
          align-items: center;
          gap: 7px;
          padding: 9px 20px;
          border-radius: 999px;
          font-weight: 600;
          font-size: 14px;
          cursor: pointer;
          border: 1px solid rgba(255,255,255,0.18);
          outline: none;
          white-space: nowrap;
          color: rgba(255,255,255,0.80);
          background: rgba(255,255,255,0.12);
          box-shadow: inset 0 1px 0 rgba(255,255,255,0.12);
          transition: all 0.2s ease;
        }
        .lw-contact-btn:hover {
          background: rgba(255,255,255,0.20);
          color: #fff;
          border-color: rgba(255,255,255,0.28);
        }
        .lw-cta-btn {
          display: inline-flex;
          align-items: center;
          gap: 7px;
          padding: 9px 22px;
          border-radius: 999px;
          font-weight: 700;
          font-size: 14px;
          cursor: pointer;
          border: none;
          outline: none;
          white-space: nowrap;
          background: #E8A020;
          color: #1a2e1e;
          box-shadow: 0 4px 18px rgba(232,160,32,0.35);
          transition: all 0.2s ease;
        }
        .lw-cta-btn:hover {
          background: #f0b030;
          box-shadow: 0 6px 24px rgba(232,160,32,0.50);
          transform: translateY(-1px);
        }
        .lw-cta-btn:active { transform: scale(0.97); }
        .lw-mobile-link {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 17px 0;
          font-size: 17px;
          font-weight: 700;
          color: #1a2e1e;
          cursor: pointer;
          border: none;
          background: transparent;
          width: 100%;
          text-align: left;
          text-decoration: none;
        }
        .lw-mobile-sublink {
          display: block;
          padding: 10px 14px;
          border-radius: 10px;
          font-size: 15px;
          font-weight: 500;
          color: rgba(26,46,30,0.60);
          text-decoration: none;
          transition: color 0.15s ease, background 0.15s ease;
        }
        .lw-mobile-sublink:hover {
          color: #046241;
          background: rgba(4,98,65,0.06);
        }
        .lw-mobile-cta {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 8px;
          padding: 14px;
          border-radius: 999px;
          font-weight: 700;
          font-size: 15px;
          cursor: pointer;
          border: none;
          background: #E8A020;
          color: #1a2e1e;
          box-shadow: 0 4px 16px rgba(232,160,32,0.30);
          transition: all 0.2s ease;
          width: 100%;
        }
        .lw-mobile-cta:hover { background: #f0b030; }
        .lw-mobile-secondary {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 8px;
          padding: 14px;
          border-radius: 999px;
          font-weight: 600;
          font-size: 15px;
          cursor: pointer;
          background: transparent;
          border: 1.5px solid rgba(26,46,30,0.15);
          color: rgba(26,46,30,0.65);
          transition: all 0.2s ease;
          width: 100%;
        }
        .lw-mobile-secondary:hover {
          border-color: rgba(26,46,30,0.30);
          color: #1a2e1e;
        }
        @media (max-width: 1024px) {
          .lw-desktop-links { display: none !important; }
          .lw-desktop-auth  { display: none !important; }
          .lw-mobile-toggle { display: flex !important; }
        }
        @media (min-width: 1025px) {
          .lw-mobile-toggle { display: none !important; }
        }
      `}</style>

      <motion.nav
        style={{
          position: "fixed",
          top: 0,
          left: 0,
          width: "100%",
          zIndex: 1000,
          background: isScrolled ? "rgba(10,22,14,0.72)" : "rgba(10,22,14,0.42)",
          backdropFilter: "blur(20px)",
          WebkitBackdropFilter: "blur(20px)",
          borderBottom: isScrolled ? "1px solid rgba(255,255,255,0.08)" : "1px solid transparent",
          boxShadow: isScrolled ? "0 8px 40px rgba(0,0,0,0.28)" : "none",
          transition: "background 0.35s ease, border-color 0.35s ease, box-shadow 0.35s ease, height 0.3s ease",
          height: isScrolled ? "64px" : "80px",
          display: "flex",
          alignItems: "center",
        }}
        initial={{ y: -80, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
      >
        <div
          style={{
            maxWidth: "1440px",
            width: "100%",
            margin: "0 auto",
            padding: "0 40px",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            gap: "24px",
          }}
        >
          {/* Logo */}
          <button
            type="button"
            onClick={() => onNavigate("/")}
            aria-label="Go to home page"
            style={{
              background: "transparent",
              border: "none",
              cursor: "pointer",
              padding: 0,
              flexShrink: 0,
              display: "flex",
              alignItems: "center",
            }}
          >
            <img
              src="/lifewood-logo.png"
              alt="Lifewood"
              style={{
                height: isScrolled ? "26px" : "30px",
                width: "auto",
                objectFit: "contain",
                transition: "height 0.3s ease",
              }}
            />
          </button>

          {/* Desktop nav links */}
          <div
            className="lw-desktop-links"
            style={{
              display: "flex",
              alignItems: "center",
              gap: "2px",
              flex: 1,
              justifyContent: "center",
            }}
          >
            {navItems.map((item) => {
              const hasChildren = !!(item.children && item.children.length);
              const isActive = activeDropdown === item.label;

              return (
                <div
                  key={item.label}
                  style={{ position: "relative" }}
                  onMouseEnter={() => handleMouseEnter(item.label, hasChildren)}
                  onMouseLeave={handleMouseLeave}
                >
                  <a
                    href={item.href || "#"}
                    className={`lw-nav-link ${isActive ? "active" : ""}`}
                    onClick={(e) => {
                      e.preventDefault();
                      if (item.href) onNavigate(item.href);
                    }}
                  >
                    <span>{item.label}</span>
                    {hasChildren && (
                      <svg
                        width="11"
                        height="11"
                        viewBox="0 0 12 12"
                        fill="none"
                        style={{
                          opacity: 0.55,
                          transition: "transform 0.2s ease",
                          transform: isActive ? "rotate(180deg)" : "rotate(0deg)",
                        }}
                      >
                        <path
                          d="M3 4.5L6 7.5L9 4.5"
                          stroke="currentColor"
                          strokeWidth="1.6"
                          strokeLinecap="round"
                        />
                      </svg>
                    )}
                  </a>

                  <AnimatePresence>
                    {hasChildren && isActive && (
                      <div
                        className="lw-dropdown-wrapper"
                        onMouseEnter={() => {
                          if (hoverTimeout) clearTimeout(hoverTimeout);
                          setActiveDropdown(item.label);
                        }}
                        onMouseLeave={handleMouseLeave}
                      >
                        <motion.div
                          className="lw-dropdown"
                          initial={{ opacity: 0, y: 4, scale: 0.97 }}
                          animate={{ opacity: 1, y: 0, scale: 1 }}
                          exit={{ opacity: 0, y: 4, scale: 0.97 }}
                          transition={{ duration: 0.15 }}
                        >
                          {item.children.map((child) => (
                            <a
                              key={child.label}
                              href={child.href}
                              className="lw-dropdown-link"
                              onClick={(e) => {
                                e.preventDefault();
                                onNavigate(child.href);
                                setActiveDropdown(null);
                              }}
                            >
                              {child.label}
                            </a>
                          ))}
                        </motion.div>
                      </div>
                    )}
                  </AnimatePresence>
                </div>
              );
            })}
          </div>

          {/* Desktop CTA buttons — FIXED: Contact Us → /contact, Get Started → /login */}
          <div
            className="lw-desktop-auth"
            style={{
              display: "flex",
              alignItems: "center",
              gap: "8px",
              flexShrink: 0,
            }}
          >
            {/* Contact Us → goes to contact form */}
            <button
              type="button"
              className="lw-contact-btn"
              onClick={() => onNavigate("/contact-us")}
            >
              <Phone size={14} strokeWidth={2.5} />
              <span>Contact Us</span>
            </button>

            {/* Get Started → goes to login */}
            <button
              type="button"
              className="lw-cta-btn"
              onClick={() => onNavigate("/get-started")}
            >
              <UserCircle2 size={15} strokeWidth={2} />
              <span>Get Started</span>
            </button>
          </div>

          {/* Mobile toggle */}
          <button
            type="button"
            className="lw-mobile-toggle"
            aria-label={isMobileMenuOpen ? "Close menu" : "Open menu"}
            onClick={() => setIsMobileMenuOpen((p) => !p)}
            style={{
              display: "none",
              alignItems: "center",
              justifyContent: "center",
              background: "rgba(255,255,255,0.10)",
              border: "1px solid rgba(255,255,255,0.15)",
              borderRadius: "10px",
              width: "42px",
              height: "42px",
              cursor: "pointer",
              color: "rgba(255,255,255,0.85)",
              flexShrink: 0,
            }}
          >
            {isMobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>
      </motion.nav>

      {/* Mobile overlay */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            onClick={closeAll}
            style={{
              position: "fixed",
              inset: 0,
              background: "rgba(0,0,0,0.45)",
              zIndex: 998,
            }}
          />
        )}
      </AnimatePresence>

      {/* Mobile drawer */}
      <motion.div
        initial={{ x: "100%" }}
        animate={{ x: isMobileMenuOpen ? "0%" : "100%" }}
        transition={{ type: "spring", stiffness: 300, damping: 32 }}
        style={{
          position: "fixed",
          top: 0,
          right: 0,
          height: "100vh",
          width: "88vw",
          maxWidth: "380px",
          background: "#fff",
          zIndex: 999,
          borderLeft: "1px solid rgba(26,46,30,0.08)",
          boxShadow: "-12px 0 48px rgba(0,0,0,0.14)",
          display: "flex",
          flexDirection: "column",
          padding: "24px",
          paddingTop: "88px",
          overflowY: "auto",
        }}
      >
        <div style={{ display: "flex", flexDirection: "column", flex: 1 }}>
          {navItems.map((item, index) => {
            const hasChildren = !!(item.children && item.children.length);
            const isExpanded = openMobileSection === index;

            return (
              <div
                key={item.label}
                style={{ borderBottom: "1px solid rgba(26,46,30,0.07)" }}
              >
                <button
                  type="button"
                  className="lw-mobile-link"
                  onClick={() => {
                    if (!hasChildren) { closeAll(); onNavigate(item.href || "/"); }
                    else setOpenMobileSection(isExpanded ? null : index);
                  }}
                >
                  <span>{item.label}</span>
                  {hasChildren && (
                    <span
                      style={{
                        fontSize: "13px",
                        color: "rgba(26,46,30,0.40)",
                        display: "inline-block",
                        transition: "transform 0.2s ease",
                        transform: isExpanded ? "rotate(180deg)" : "rotate(0deg)",
                      }}
                    >
                      ▾
                    </span>
                  )}
                </button>

                <AnimatePresence>
                  {hasChildren && isExpanded && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.2 }}
                      style={{ overflow: "hidden" }}
                    >
                      <div style={{ paddingBottom: "12px", display: "flex", flexDirection: "column", gap: "2px" }}>
                        {item.children.map((child) => (
                          <a
                            key={child.label}
                            href={child.href}
                            className="lw-mobile-sublink"
                            onClick={(e) => {
                              e.preventDefault();
                              onNavigate(child.href);
                              closeAll();
                            }}
                          >
                            {child.label}
                          </a>
                        ))}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            );
          })}
        </div>

        {/* Mobile auth — FIXED: Get Started → /login, Contact Us → /contact */}
        <div style={{ marginTop: "auto", paddingTop: "24px", display: "flex", flexDirection: "column", gap: "10px" }}>
          <button
            type="button"
            className="lw-mobile-cta"
            onClick={() => { closeAll(); onNavigate("/login"); }}
          >
            <UserCircle2 size={17} strokeWidth={2} />
            <span>Get Started</span>
          </button>
          <button
            type="button"
            className="lw-mobile-secondary"
            onClick={() => { closeAll(); onNavigate("/contact"); }}
          >
            <Phone size={15} strokeWidth={2.5} />
            <span>Contact Us</span>
          </button>
        </div>
      </motion.div>
    </>
  );
};

export default Navigation;