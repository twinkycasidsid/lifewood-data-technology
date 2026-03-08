import { Link, useNavigate } from "react-router-dom";
import {
  IconBrandLinkedin,
  IconBrandInstagram,
  IconBrandFacebook,
  IconBrandYoutube,
} from "@tabler/icons-react";
import {
  FOOTER_LINKS,
  INTERNAL_LINKS,
  CONNECT_LINKS,
} from "../utils/constants";

const Footer = () => {
  const navigate = useNavigate();

  const footerLinks = FOOTER_LINKS;
  const internalLinks = INTERNAL_LINKS;
  const connectLinks = CONNECT_LINKS;

  return (
    <>
      <style>{`
        /* Styling for the footer section */
        .lw-footer {
          position: relative;
          font-family: 'Manrope', sans-serif;
          background: linear-gradient(175deg, #081510 0%, #0a1a0e 30%, #0d2218 65%, #133020 100%);
          overflow: hidden;
        }
        .lw-footer-sep {
          position: relative;
          z-index: 2;
          height: 1px;
          background: linear-gradient(90deg, transparent, rgba(232,160,32,0.20), transparent);
        }
        .lw-footer-inner {
          position: relative;
          z-index: 2;
          max-width: 1280px;
          margin: 0 auto;
          padding: 72px 48px 48px;
        }
        .lw-footer-grid {
          display: grid;
          grid-template-columns: 1.6fr 1fr 1fr 1fr;
          gap: 0 48px;
          align-items: start;
        }
        .lw-footer-brand {
          padding-right: 32px;
          border-right: 1px solid rgba(255,255,255,0.06);
        }
        .lw-footer-img img {
          height: 30px;
          width: auto;
          object-fit: contain;
          opacity: 0.92;
          background: transparent;
        }
        .lw-footer-tagline {
          font-size: 15px;
          font-weight: 300;
          line-height: 1.2;
          letter-spacing: -0.02em;
          color: #fff;
          margin: 0 0 14px;
        }
        .lw-footer-social {
          display: flex;
          gap: 8px;
        }
        .lw-social-icon {
          display: flex;
          align-items: center;
          justify-content: center;
          width: 36px;
          height: 36px;
          border-radius: 10px;
          background: rgba(255,255,255,0.06);
          border: 1px solid rgba(255,255,255,0.08);
          color: rgba(255,255,255,0.50);
          transition: background 0.18s ease, color 0.18s ease, border-color 0.18s ease, transform 0.15s ease;
          text-decoration: none;
        }
        .lw-social-icon:hover {
          background: rgba(232,160,32,0.12);
          border-color: rgba(232,160,32,0.30);
          color: #E8A020;
          transform: translateY(-2px);
        }

        /* Link columns */
        .lw-footer-col h4 {
          font-size: 10px;
          font-weight: 700;
          letter-spacing: 0.16em;
          text-transform: uppercase;
          color: rgba(255,255,255,0.30);
          margin: 0 0 16px;
        }
        .lw-footer-col ul {
          list-style: none;
          padding: 0;
          margin: 0;
          display: flex;
          flex-direction: column;
          gap: 2px;
        }
        .lw-footer-col li a {
          display: inline-block;
          font-size: 13.5px;
          font-weight: 500;
          color: rgba(255,255,255,0.52);
          text-decoration: none;
          padding: 5px 0;
          transition: color 0.15s ease, padding-left 0.15s ease;
          position: relative;
        }
        .lw-footer-col li a:hover {
          color: #fff;
          padding-left: 6px;
        }

        /* ── Bottom bar ── */
        .lw-footer-bottom-sep {
          position: relative;
          z-index: 2;
          height: 1px;
          margin: 0 48px;
          background: rgba(255,255,255,0.06);
        }
        .lw-footer-bottom {
          position: relative;
          z-index: 2;
          max-width: 1280px;
          margin: 0 auto;
          padding: 20px 48px 36px;
          display: flex;
          align-items: center;
          justify-content: space-between;
          flex-wrap: wrap;
          gap: 12px;
        }
        .lw-footer-copy {
          font-size: 12.5px;
          color: rgba(255,255,255,0.25);
          letter-spacing: 0.01em;
        }
        .lw-footer-legal {
          display: flex;
          gap: 20px;
        }
        .lw-footer-legal a {
          font-size: 12.5px;
          color: rgba(255,255,255,0.25);
          text-decoration: none;
          transition: color 0.15s ease;
        }
        .lw-footer-legal a:hover {
          color: rgba(255,255,255,0.6);
        }
        
        /* ── Responsive ── */
        @media (max-width: 1024px) {
          .lw-footer-grid {
            grid-template-columns: 1fr 1fr;
            gap: 40px 40px;
          }
          .lw-footer-brand {
            grid-column: 1 / -1;
            border-right: none;
            border-bottom: 1px solid rgba(255,255,255,0.06);
            padding-right: 0;
            padding-bottom: 32px;
          }
        }

        @media (max-width: 600px) {
          .lw-footer-inner { padding: 56px 24px 40px; }
          .lw-footer-grid { grid-template-columns: 1fr 1fr; gap: 32px; }
          .lw-footer-bottom { padding: 16px 24px 28px; flex-direction: column; align-items: flex-start; }
          .lw-footer-bottom-sep { margin: 0 24px; }
        }
      `}</style>

      <footer className="lw-footer">
        <div className="lw-footer-sep" />

        <div className="lw-footer-inner">
          <div className="lw-footer-grid">
            {/* Brand column */}
            <div className="lw-footer-brand">
              {/* <button
                type="button"
                className="lw-footer-logo"
                onClick={() => navigate("/")}
                aria-label="Go to home page"
              > */}
              <img
                onClick={() => navigate("/")}
                aria-label="Go to home page"
                className="lw-footer-img"
                src="https://framerusercontent.com/images/Ca8ppNsvJIfTsWEuHr50gvkDow.png?scale-down-to=1024&width=2624&height=474"
                alt="Lifewood"
              />
              {/* </button> */}

              <p className="lw-footer-tagline">
                The world’s leading provider of
                <br />
                <em>AI-powered data solutions.</em>
              </p>

              <div className="lw-footer-social">
                <a
                  href="https://www.linkedin.com/company/lifewood-data-technology-ltd./posts/?feedView=all"
                  className="lw-social-icon"
                  aria-label="LinkedIn"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <IconBrandLinkedin size={17} />
                </a>
                <a
                  href="https://www.instagram.com/lifewood_official/?hl=af"
                  className="lw-social-icon"
                  aria-label="Instagram"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <IconBrandInstagram size={17} />
                </a>
                <a
                  href="https://www.facebook.com/LifewoodPH"
                  className="lw-social-icon"
                  aria-label="Facebook"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <IconBrandFacebook size={17} />
                </a>
                <a
                  href="https://www.youtube.com/@LifewoodDataTechnology"
                  className="lw-social-icon"
                  aria-label="YouTube"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <IconBrandYoutube size={17} />
                </a>
              </div>
            </div>

            {/* Dynamic link columns */}
            {Object.entries(footerLinks).map(([category, links]) => (
              <div key={category} className="lw-footer-col">
                <h4>{category}</h4>
                <ul>
                  {links.map((link, index) => (
                    <li key={index}>
                      {category === "Connect" ? (
                        <a
                          href={connectLinks[link]}
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          {link}
                        </a>
                      ) : (
                        <Link to={internalLinks[link] || "#"}>{link}</Link>
                      )}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>

        {/* Bottom bar */}
        <div className="lw-footer-bottom-sep" />
        <div className="lw-footer-bottom">
          <span className="lw-footer-copy">
            © 2026 Lifewood — All Rights Reserved
          </span>
          <div className="lw-footer-legal">
            <Link to="/privacy-policy">Privacy Policy</Link>
            <Link to="/terms-conditions">Terms of Service</Link>
            <Link to="/cookie-policy">Cookie Policy</Link>
          </div>
        </div>
      </footer>
    </>
  );
};

export default Footer;
