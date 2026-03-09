import { useEffect, useState } from "react";

const sections = [
  {
    id: 1,
    title: "Acceptance of these Terms",
    clauses: [
      { id: "1.1", text: 'These Terms govern your access to and use of lifewood.com (the "Site") and any content, features or functionality made available through it (together, the "Services").' },
      { id: "1.2", text: "By accessing or using the Site, you agree to be bound by these Terms. If you do not agree, do not use the Site." },
      { id: "1.3", text: 'If you are using the Site on behalf of a company or other organisation, you represent and warrant that you have authority to bind that entity to these Terms. In that case, "you" and "your" refers to that entity and you.' },
    ],
  },
  {
    id: 2,
    title: "Who we are and how to contact us",
    clauses: [
      { id: "2.1", text: 'The Site is operated by Lifewood Data Technology Limited ("Lifewood", "we", "us", "our").' },
      { id: "2.2", text: "Contact: hr@lifewood.com (or via our Contact Us page). Postal address: Lifewood Data Technology Limited, Unit 19, 9/F, Core C, Cyberport 3, 100 Cyberport Road, Hong Kong. For IP complaints, see clause 9.4." },
    ],
  },
  {
    id: 3,
    title: "Changes to these Terms and the Site",
    clauses: [
      { id: "3.1", text: 'We may update these Terms from time to time. The "Last updated" date indicates when changes were made. Your continued use of the Site after changes become effective means you accept the updated Terms.' },
      { id: "3.2", text: "We may update, suspend, withdraw or restrict availability of all or any part of the Site for business, operational, legal or security reasons." },
    ],
  },
  {
    id: 4,
    title: "Eligibility",
    clauses: [
      { id: "4.1", text: "The Site is intended for business and professional audiences. If you are under the age of majority in your jurisdiction, you may use the Site only with permission and supervision of a parent or legal guardian." },
    ],
  },
  {
    id: 5,
    title: "Your permitted use",
    clauses: [
      { id: "5.1", text: "You may view, download and print copies of pages from the Site solely for your internal, lawful, non-commercial reference purposes (e.g., evaluating Lifewood's capabilities or services)." },
      { id: "5.2", text: "You may share links (URLs) to the Site, provided you do so fairly and legally, and do not misrepresent your relationship with Lifewood." },
    ],
  },
  {
    id: 6,
    title: "Prohibited use and acceptable use rules",
    clauses: [
      { id: "6.1", text: "You must not use the Site:", subItems: [
        { id: "(a)", text: "in any way that breaches any applicable law or regulation;" },
        { id: "(b)", text: "to infringe, misappropriate or violate our rights or the rights of any third party;" },
        { id: "(c)", text: "to transmit or upload malware, or to interfere with or disrupt the Site or any networks or systems connected to it;" },
        { id: "(d)", text: "to attempt to gain unauthorised access to the Site, our servers or systems, or to any user accounts;" },
        { id: "(e)", text: "to impersonate another person or entity, or to misrepresent your affiliation with any person or entity." },
      ]},
      { id: "6.2", text: "You must not:", subItems: [
        { id: "(a)", text: "reproduce, duplicate, copy, sell, trade, resell or exploit any portion of the Site or Content (defined below) except as expressly permitted by these Terms;" },
        { id: "(b)", text: "remove, obscure or alter any proprietary notices (including copyright and trademark notices);" },
        { id: "(c)", text: "use the Site in a way that could damage, disable, overburden or impair it." },
      ]},
    ],
  },
  {
    id: 7,
    title: "Intellectual Property Rights",
    clauses: [
      { id: "7.1", text: '"Content" means all materials on the Site, including text, software, code, layout, design, graphics, photographs, audio, video, logos, trademarks, service marks, and compilations (including selection and arrangement).' },
      { id: "7.2", text: "We (and/or our licensors) own all right, title and interest in and to the Site and Content, including all intellectual property rights. All rights are reserved." },
      { id: "7.3", text: "Nothing in these Terms grants you any right to use any of our trademarks, logos or brand features without our prior written permission." },
      { id: "7.4", text: "Any proprietary platforms, processes or technologies referenced on the Site (including the LiFT platform) are protected by intellectual property laws and are not licensed to you by virtue of your use of the Site." },
    ],
  },
  {
    id: 8,
    title: "Restrictions on scraping, text and data mining, and AI/ML use",
    clauses: [
      { id: "8.1", text: "You must not access the Site or Content using any automated means (including robots, spiders, scrapers, data-mining tools, or similar technologies) except where:", subItems: [
        { id: "(a)", text: "such access is required for normal browser functionality; or" },
        { id: "(b)", text: "you have our prior written permission." },
      ]},
      { id: "8.2", text: "To the maximum extent permitted by applicable law, you must not (and must not permit any third party to):", subItems: [
        { id: "(a)", text: "perform text and data mining, web harvesting, or systematic extraction of Content; or" },
        { id: "(b)", text: "use any Content (including any portion, excerpt, screenshot, dataset, or derivative) to train, develop, benchmark, fine-tune, evaluate or validate any artificial intelligence or machine learning model (including large language models), or to build or enrich any dataset for those purposes," },
      ]},
      { id: "8.2b", text: "in each case without our prior written consent." },
      { id: "8.3", text: "You must not bypass or circumvent any measures used to prevent or restrict access to the Site (including rate limits, robots.txt, or other access controls)." },
    ],
  },
  {
    id: 9,
    title: "Submissions, feedback, and IP complaints",
    clauses: [
      { id: "9.1", text: "If you submit information through the Site (e.g., through a contact form, email link, or job application portal), you agree that:", subItems: [
        { id: "(a)", text: "you will not submit confidential information unless we have agreed in writing to receive it on a confidential basis; and" },
        { id: "(b)", text: "you are responsible for the accuracy and legality of your submissions." },
      ]},
      { id: "9.2", text: 'Any ideas, suggestions or feedback you provide about the Site or our services ("Feedback") may be used by us without restriction and without compensation to you. You grant us a worldwide, perpetual, irrevocable, royalty-free licence to use, reproduce, modify, distribute and otherwise exploit Feedback for any purpose.' },
      { id: "9.3", text: "We do not waive any rights to use similar or related ideas previously known to us, developed independently, or obtained from other sources." },
      { id: "9.4", text: "If you believe Content on the Site infringes your intellectual property rights, please notify us at hr@lifewood.com with:", subItems: [
        { id: "(a)", text: "sufficient detail to identify the material claimed to be infringing (including URLs);" },
        { id: "(b)", text: "evidence of your rights; and" },
        { id: "(c)", text: "your contact details and a statement of good faith belief." },
      ]},
      { id: "9.5", text: "We may remove or disable access to material we reasonably believe may infringe third-party rights." },
    ],
  },
  {
    id: 10,
    title: "Third-party links and resources",
    clauses: [
      { id: "10.1", text: "The Site may include links to third-party websites or resources. These links are provided for convenience only." },
      { id: "10.2", text: "We do not control and are not responsible for the content, availability, security or practices of third-party sites. Your use of third-party sites is at your own risk and subject to their terms." },
    ],
  },
  {
    id: 11,
    title: "Privacy and cookies",
    clauses: [
      { id: "11.1", text: "Our collection and use of personal information is described in our Privacy Policy and Cookie Policy, which form part of these Terms by reference." },
    ],
  },
  {
    id: 12,
    title: "Disclaimers",
    clauses: [
      { id: "12.1", text: "The Site and Content are provided for general information only and do not constitute professional advice (including legal, regulatory, technical, or investment advice)." },
      { id: "12.2", text: "While we aim to keep the Site accurate and up to date, we make no warranties or representations that the Site or Content is accurate, complete, reliable, available, secure or error-free." },
      { id: "12.3", text: 'To the fullest extent permitted by law, the Site is provided on an "as is" and "as available" basis and we disclaim all warranties and conditions, whether express, implied or statutory, including implied warranties of merchantability, fitness for a particular purpose and non-infringement.' },
    ],
  },
  {
    id: 13,
    title: "Limitation of liability",
    clauses: [
      { id: "13.1", text: "Nothing in these Terms excludes or limits liability that cannot be excluded or limited by law (including liability for death or personal injury caused by negligence, fraud or fraudulent misrepresentation)." },
      { id: "13.2", text: "Subject to clause 13.1, to the fullest extent permitted by law, Lifewood and its affiliates will not be liable for any indirect, incidental, special, consequential or punitive damages, or for loss of profits, revenue, business, goodwill, anticipated savings, data, or business interruption, arising out of or in connection with your use of (or inability to use) the Site." },
      { id: "13.3", text: "Subject to clause 13.1, our total aggregate liability to you arising out of or in connection with these Terms or the Site will not exceed USD 1,000." },
    ],
  },
  {
    id: 14,
    title: "Indemnity",
    clauses: [
      { id: "14.1", text: "You agree to indemnify and hold harmless Lifewood, its affiliates, officers, directors, employees and agents from and against any claims, damages, liabilities, losses and expenses (including reasonable legal fees) arising out of or relating to:", subItems: [
        { id: "(a)", text: "your breach of these Terms;" },
        { id: "(b)", text: "your misuse of the Site; or" },
        { id: "(c)", text: "your infringement or misappropriation of any third-party rights." },
      ]},
    ],
  },
  {
    id: 15,
    title: "Suspension and termination",
    clauses: [
      { id: "15.1", text: "We may suspend, restrict or terminate your access to the Site at any time if we reasonably believe you have breached these Terms or your use poses a security, legal or reputational risk." },
    ],
  },
  {
    id: 16,
    title: "General terms",
    clauses: [
      { id: "16.1", text: "Assignment: We may assign or transfer our rights and obligations under these Terms. You may not assign or transfer your rights or obligations without our prior written consent." },
      { id: "16.2", text: "Severability: If any provision is found unenforceable, the remaining provisions will remain in full force and effect." },
      { id: "16.3", text: "No waiver: Our failure to enforce any provision is not a waiver of our right to do so later." },
      { id: "16.4", text: "Entire agreement: These Terms (together with the Privacy Policy and Cookie Policy) constitute the entire agreement between you and us regarding your use of the Site, and supersede any prior understandings relating to the Site." },
    ],
  },
  {
    id: 17,
    title: "Governing law and jurisdiction",
    clauses: [
      { id: "17.1", text: "These Terms and any dispute or claim arising out of or in connection with them (including non-contractual disputes or claims) are governed by the laws of Hong Kong Special Administrative Region." },
      { id: "17.2", text: "The courts of Hong Kong shall have exclusive jurisdiction to settle any dispute or claim arising out of or in connection with these Terms or your use of the Site." },
    ],
  },
  {
    id: 18,
    title: "Contact",
    clauses: [
      { id: "18.1", text: "If you have questions about these Terms, please contact hr@lifewood.com or write to: Lifewood Data Technology Limited, Unit 19, 9/F, Core C, Cyberport 3, 100 Cyberport Road, Hong Kong." },
    ],
  },
];

const styles = `
  @import url('https://fonts.googleapis.com/css2?family=Manrope:wght@400;500;600;700;800&display=swap');

  * { box-sizing: border-box; margin: 0; padding: 0; }

  .tnc-root {
    min-height: 100vh;
    background: #f9f9f7;
    font-family: 'Manrope', sans-serif;
    color: #1a2e1e;
    padding-top: 80px;
  }

  .tnc-header {
    background: linear-gradient(135deg, rgba(10,22,14,0.94) 0%, rgba(13,34,24,0.94) 58%, rgba(4,98,65,0.86) 100%);
    color: #f8faf6;
    padding: 60px 40px 52px;
    text-align: center;
    position: relative;
    overflow: hidden;
    border-bottom: 1px solid rgba(255,255,255,0.08);
  }

  .tnc-header::before {
    content: '';
    position: absolute;
    inset: 0;
    background:
      radial-gradient(circle at 12% 14%, rgba(232,160,32,0.12), transparent 46%),
      radial-gradient(circle at 88% 84%, rgba(255,255,255,0.08), transparent 44%);
    pointer-events: none;
  }

  .tnc-header-inner {
    max-width: none;
    margin: 0 auto;
    padding: 0;
    position: relative;
    z-index: 1;
  }

  .tnc-eyebrow {
    display: inline-flex;
    align-items: center;
    gap: 7px;
    background: rgba(255,255,255,0.08);
    border: 1px solid rgba(255,255,255,0.16);
    border-radius: 999px;
    padding: 5px 14px;
    font-weight: 700;
    font-size: 11px;
    letter-spacing: 0.11em;
    text-transform: uppercase;
    color: #f4f6f2;
    margin-bottom: 20px;
  }

  .tnc-title {
    font-size: clamp(32px, 5.5vw, 62px);
    font-weight: 800;
    line-height: 1.08;
    letter-spacing: -0.03em;
    margin-bottom: 16px;
  }

  .tnc-subtitle {
    font-size: clamp(13px, 1.6vw, 15px);
    font-weight: 400;
    color: rgba(246,247,244,0.82);
    line-height: 1.65;
    max-width: 520px;
    margin: 0 auto;
  }

  .tnc-header-meta {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 24px;
    margin-top: 28px;
    flex-wrap: wrap;
    position: relative;
    z-index: 1;
  }

  .tnc-header-meta-item {
    display: flex;
    align-items: center;
    gap: 6px;
    font-size: 11.5px;
    font-weight: 600;
    color: rgba(246,247,244,0.72);
    font-family: 'Manrope', sans-serif;
  }

  .tnc-header-meta-dot {
    width: 4px;
    height: 4px;
    border-radius: 50%;
    background: rgba(255,255,255,0.45);
  }

  .tnc-layout {
    max-width: 1240px;
    margin: 0 auto;
    padding: 0 32px;
    display: grid;
    grid-template-columns: 280px minmax(0, 1fr);
    gap: 0 34px;
    align-items: start;
  }

  .tnc-nav {
    position: sticky;
    top: 96px;
    align-self: start;
    padding: 30px 14px 24px 0;
    border-right: 1px solid rgba(26,46,30,0.12);
    max-height: calc(100vh - 110px);
    overflow: auto;
  }

  .tnc-nav-label {
    font-size: 10px;
    letter-spacing: 0.16em;
    text-transform: uppercase;
    color: rgba(26,46,30,0.52);
    margin-bottom: 14px;
    font-weight: 700;
  }

  .tnc-nav-item {
    display: block;
    width: 100%;
    background: none;
    border: none;
    text-align: left;
    cursor: pointer;
    padding: 8px 12px;
    font-family: 'Manrope', sans-serif;
    font-size: 12.5px;
    font-weight: 600;
    color: rgba(26,46,30,0.60);
    transition: color 0.18s ease, background 0.18s ease;
    overflow-wrap: anywhere;
    line-height: 1.35;
    border-left: 2px solid transparent;
    border-radius: 0 8px 8px 0;
  }

  .tnc-nav-item:hover {
    color: #1a2e1e;
    background: rgba(4,98,65,0.06);
  }

  .tnc-nav-item.active {
    color: #1a2e1e;
    border-left-color: #e8a020;
    background: rgba(4,98,65,0.08);
  }

  .tnc-content {
    padding: 30px 0 82px;
  }

  .tnc-section {
    margin-bottom: 34px;
    scroll-margin-top: 100px;
    background: #fff;
    border: 1px solid rgba(26,46,30,0.09);
    border-radius: 16px;
    padding: 24px;
    box-shadow: 0 2px 14px rgba(26,46,30,0.04);
    opacity: 0;
    transform: translateY(12px);
    animation: fadeUp 0.45s forwards;
  }

  @keyframes fadeUp {
    to { opacity: 1; transform: translateY(0); }
  }

  .tnc-section-header {
    display: flex;
    align-items: baseline;
    gap: 12px;
    margin-bottom: 16px;
    padding-bottom: 10px;
    border-bottom: 1px solid rgba(26,46,30,0.12);
  }

  .tnc-section-num {
    font-size: 12px;
    color: #e8a020;
    font-weight: 700;
    min-width: 18px;
  }

  .tnc-section-title {
    font-size: 20px;
    font-weight: 800;
    color: #1a2e1e;
    line-height: 1.2;
    letter-spacing: -0.02em;
  }

  .tnc-clause {
    margin-bottom: 14px;
    display: flex;
    gap: 12px;
  }

  .tnc-clause-id {
    font-size: 12px;
    color: rgba(4,98,65,0.9);
    min-width: 30px;
    padding-top: 2px;
    font-weight: 700;
  }

  .tnc-clause-text {
    font-size: 14px;
    line-height: 1.72;
    color: rgba(26,46,30,0.72);
    font-weight: 500;
  }

  .tnc-sub-items {
    margin-top: 10px;
    border-left: 2px solid rgba(26,46,30,0.12);
    padding-left: 14px;
    display: flex;
    flex-direction: column;
    gap: 8px;
  }

  .tnc-sub-item {
    display: flex;
    gap: 9px;
  }

  .tnc-sub-id {
    font-size: 12px;
    color: rgba(26,46,30,0.54);
    min-width: 22px;
    padding-top: 1px;
    font-weight: 600;
  }

  .tnc-sub-text {
    font-size: 13px;
    line-height: 1.65;
    color: rgba(26,46,30,0.66);
    font-weight: 500;
  }

  .tnc-footer {
    background: #0f2217;
    color: rgba(246,247,244,0.58);
    padding: 28px 32px;
    text-align: center;
    font-size: 12px;
    font-weight: 500;
    letter-spacing: 0.03em;
  }

  .tnc-footer a {
    color: #e8a020;
    text-decoration: none;
  }

  @media (max-width: 1024px) {
    .tnc-layout {
      grid-template-columns: 1fr;
      padding: 0 20px;
    }
    .tnc-nav {
      position: static;
      top: auto;
      z-index: 20;
      border-right: none;
      border-bottom: 1px solid rgba(26,46,30,0.12);
      padding: 10px 0 10px;
      margin: 0 0 12px;
      background: rgba(249,249,247,0.95);
      backdrop-filter: blur(8px);
      max-height: none;
      overflow: visible;
    }
    .tnc-nav-label { margin-bottom: 8px; }
    .tnc-nav-row {
      display: flex;
      gap: 8px;
      overflow-x: auto;
      -webkit-overflow-scrolling: touch;
      scrollbar-width: thin;
      padding-bottom: 2px;
    }
    .tnc-nav-item {
      width: auto;
      white-space: nowrap;
      border-left: none;
      border-bottom: 2px solid transparent;
      border-radius: 999px;
      background: #fff;
      border: 1px solid rgba(26,46,30,0.10);
      padding: 8px 12px;
      flex: 0 0 auto;
      max-width: min(82vw, 360px);
      overflow: hidden;
      text-overflow: ellipsis;
    }
    .tnc-nav-item.active {
      border-left: 1px solid rgba(26,46,30,0.10);
      border-bottom-color: #e8a020;
    }
    .tnc-content { padding: 16px 0 56px; }
    .tnc-section { padding: 18px; }
  }

  @media (max-width: 700px) {
    .tnc-header { padding: 44px 20px 40px; }
    .tnc-header-meta { gap: 14px; }
    .tnc-nav { padding: 10px 0 10px; }
    .tnc-nav-row {
      flex-wrap: wrap;
      overflow-x: visible;
      gap: 8px;
    }
    .tnc-nav-item {
      max-width: none;
      white-space: normal;
      line-height: 1.25;
      padding: 8px 10px;
      font-size: 12px;
    }
  }
`;

export default function TermsAndConditions() {
  const [activeSection, setActiveSection] = useState(1);

  const scrollTo = (id) => {
    const el = document.getElementById(`section-${id}`);
    if (el) {
      el.scrollIntoView({ behavior: "smooth" });
      setActiveSection(id);
    }
  };

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const id = Number(entry.target.getAttribute("data-section-id"));
            if (!Number.isNaN(id)) setActiveSection(id);
          }
        });
      },
      { rootMargin: "-20% 0px -65% 0px", threshold: 0.12 }
    );

    sections.forEach((section) => {
      const element = document.getElementById(`section-${section.id}`);
      if (element) observer.observe(element);
    });

    return () => observer.disconnect();
  }, []);

  return (
    <>
      <style>{styles}</style>
      <div className="tnc-root">
        <header className="tnc-header">
          <div className="tnc-header-inner">
            <p className="tnc-eyebrow">Legal</p>
            <h1 className="tnc-title">Terms &amp;<br />Conditions</h1>
            <p className="tnc-subtitle">
              Please read these terms carefully before using lifewood.com
            </p>
            <div className="tnc-header-meta">
              <span className="tnc-header-meta-item">Lifewood Data Technology Ltd.</span>
              <span className="tnc-header-meta-dot" />
              <span className="tnc-header-meta-item">18 sections</span>
              <span className="tnc-header-meta-dot" />
              <span className="tnc-header-meta-item">Effective 3 November 2025</span>
              <span className="tnc-header-meta-dot" />
              <span className="tnc-header-meta-item">Hong Kong (Cap. 486)</span>
            </div>
          </div>
        </header>

        <div className="tnc-layout">
          <nav className="tnc-nav">
            <p className="tnc-nav-label">Sections</p>
            <div className="tnc-nav-row">
              {sections.map((s) => (
                <button
                  key={s.id}
                  type="button"
                  className={`tnc-nav-item${activeSection === s.id ? " active" : ""}`}
                  onClick={() => scrollTo(s.id)}
                >
                  {s.id}. {s.title}
                </button>
              ))}
            </div>
          </nav>

          <main className="tnc-content">
            {sections.map((section, i) => (
              <section
                key={section.id}
                id={`section-${section.id}`}
                data-section-id={section.id}
                className="tnc-section"
                style={{ animationDelay: `${i * 0.04}s` }}
                onMouseEnter={() => setActiveSection(section.id)}
              >
                <div className="tnc-section-header">
                  <span className="tnc-section-num">{section.id}</span>
                  <h2 className="tnc-section-title">{section.title}</h2>
                </div>

                {section.clauses.map((clause) => (
                  <div key={clause.id} className="tnc-clause">
                    <span className="tnc-clause-id">{clause.id}</span>
                    <div>
                      <p className="tnc-clause-text">{clause.text}</p>
                      {clause.subItems && (
                        <div className="tnc-sub-items">
                          {clause.subItems.map((item) => (
                            <div key={item.id} className="tnc-sub-item">
                              <span className="tnc-sub-id">{item.id}</span>
                              <p className="tnc-sub-text">{item.text}</p>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </section>
            ))}
          </main>
        </div>
      </div>
    </>
  );
}

