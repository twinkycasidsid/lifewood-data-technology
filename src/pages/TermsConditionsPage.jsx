import { useState } from "react";

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
  @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@400;600;700&family=Source+Serif+4:ital,wght@0,300;0,400;1,300&display=swap');

  * { box-sizing: border-box; margin: 0; padding: 0; }

  .tnc-root {
    min-height: 100vh;
    background-color: #F7F4EF;
    font-family: 'Source Serif 4', Georgia, serif;
    color: #1C1A17;
  }

  .tnc-header {
    background-color: #1C1A17;
    color: #F7F4EF;
    padding: 60px 0 50px;
    position: relative;
    overflow: hidden;
  }

  .tnc-header::before {
    content: '';
    position: absolute;
    top: -40px; right: -40px;
    width: 300px; height: 300px;
    border: 1px solid rgba(247,244,239,0.1);
    border-radius: 50%;
  }

  .tnc-header::after {
    content: '';
    position: absolute;
    bottom: -60px; left: 60px;
    width: 200px; height: 200px;
    border: 1px solid rgba(247,244,239,0.07);
    border-radius: 50%;
  }

  .tnc-header-inner {
    max-width: 860px;
    margin: 0 auto;
    padding: 0 40px;
    position: relative;
    z-index: 1;
  }

  .tnc-eyebrow {
    font-family: 'Source Serif 4', serif;
    font-weight: 300;
    font-size: 11px;
    letter-spacing: 0.25em;
    text-transform: uppercase;
    color: #C4A882;
    margin-bottom: 18px;
  }

  .tnc-title {
    font-family: 'Playfair Display', serif;
    font-size: clamp(36px, 5vw, 58px);
    font-weight: 700;
    line-height: 1.1;
    letter-spacing: -0.02em;
    margin-bottom: 20px;
  }

  .tnc-subtitle {
    font-size: 15px;
    font-weight: 300;
    font-style: italic;
    color: rgba(247,244,239,0.6);
    line-height: 1.6;
  }

  .tnc-divider-line {
    height: 1px;
    background: linear-gradient(90deg, #C4A882, transparent);
    margin: 24px 0 0;
  }

  .tnc-layout {
    max-width: 860px;
    margin: 0 auto;
    padding: 0 40px;
    display: grid;
    grid-template-columns: 220px 1fr;
    gap: 0;
    align-items: start;
  }

  .tnc-nav {
    position: sticky;
    top: 32px;
    padding: 40px 24px 40px 0;
    border-right: 1px solid #E0D9CE;
  }

  .tnc-nav-label {
    font-size: 10px;
    letter-spacing: 0.2em;
    text-transform: uppercase;
    color: #9A9080;
    margin-bottom: 16px;
    font-weight: 300;
  }

  .tnc-nav-item {
    display: block;
    width: 100%;
    background: none;
    border: none;
    text-align: left;
    cursor: pointer;
    padding: 7px 0;
    font-family: 'Source Serif 4', serif;
    font-size: 13px;
    font-weight: 300;
    color: #6B6358;
    transition: color 0.2s;
    line-height: 1.3;
    border-left: 2px solid transparent;
    padding-left: 12px;
    margin-left: -12px;
  }

  .tnc-nav-item:hover {
    color: #1C1A17;
  }

  .tnc-nav-item.active {
    color: #1C1A17;
    border-left-color: #C4A882;
    font-weight: 400;
  }

  .tnc-content {
    padding: 48px 0 80px 48px;
  }

  .tnc-section {
    margin-bottom: 52px;
    scroll-margin-top: 32px;
    opacity: 0;
    transform: translateY(12px);
    animation: fadeUp 0.5s forwards;
  }

  @keyframes fadeUp {
    to { opacity: 1; transform: translateY(0); }
  }

  .tnc-section-header {
    display: flex;
    align-items: baseline;
    gap: 16px;
    margin-bottom: 20px;
    padding-bottom: 14px;
    border-bottom: 1px solid #E0D9CE;
  }

  .tnc-section-num {
    font-family: 'Playfair Display', serif;
    font-size: 13px;
    color: #C4A882;
    font-weight: 600;
    min-width: 20px;
  }

  .tnc-section-title {
    font-family: 'Playfair Display', serif;
    font-size: 20px;
    font-weight: 600;
    color: #1C1A17;
    line-height: 1.25;
  }

  .tnc-clause {
    margin-bottom: 16px;
    display: flex;
    gap: 14px;
  }

  .tnc-clause-id {
    font-size: 12px;
    color: #C4A882;
    min-width: 30px;
    padding-top: 2px;
    font-weight: 300;
    letter-spacing: 0.03em;
  }

  .tnc-clause-text {
    font-size: 14.5px;
    line-height: 1.75;
    color: #3A3530;
    font-weight: 300;
  }

  .tnc-sub-items {
    margin-top: 12px;
    border-left: 2px solid #E0D9CE;
    padding-left: 16px;
    display: flex;
    flex-direction: column;
    gap: 10px;
  }

  .tnc-sub-item {
    display: flex;
    gap: 10px;
  }

  .tnc-sub-id {
    font-size: 12px;
    color: #9A9080;
    min-width: 22px;
    padding-top: 1px;
  }

  .tnc-sub-text {
    font-size: 13.5px;
    line-height: 1.7;
    color: #4A4540;
    font-weight: 300;
  }

  .tnc-footer {
    background-color: #1C1A17;
    color: rgba(247,244,239,0.5);
    padding: 32px 40px;
    text-align: center;
    font-size: 12px;
    font-weight: 300;
    letter-spacing: 0.05em;
  }

  .tnc-footer a {
    color: #C4A882;
    text-decoration: none;
  }

  @media (max-width: 700px) {
    .tnc-layout {
      grid-template-columns: 1fr;
      padding: 0 20px;
    }
    .tnc-nav { display: none; }
    .tnc-content { padding: 32px 0 60px; }
    .tnc-header-inner { padding: 0 20px; }
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

  return (
    <>
      <style>{styles}</style>
      <div className="tnc-root">
        <header className="tnc-header">
          <div className="tnc-header-inner">
            <p className="tnc-eyebrow">Lifewood Data Technology Limited</p>
            <h1 className="tnc-title">Terms &amp;<br />Conditions</h1>
            <p className="tnc-subtitle">
              Please read these terms carefully before using lifewood.com
            </p>
            <div className="tnc-divider-line" />
          </div>
        </header>

        <div className="tnc-layout">
          <nav className="tnc-nav">
            <p className="tnc-nav-label">Sections</p>
            {sections.map((s) => (
              <button
                key={s.id}
                className={`tnc-nav-item${activeSection === s.id ? " active" : ""}`}
                onClick={() => scrollTo(s.id)}
              >
                {s.id}. {s.title}
              </button>
            ))}
          </nav>

          <main className="tnc-content">
            {sections.map((section, i) => (
              <section
                key={section.id}
                id={`section-${section.id}`}
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

        <footer className="tnc-footer">
          &copy; Lifewood Data Technology Limited &mdash; Unit 19, 9/F, Core C, Cyberport 3, 100 Cyberport Road, Hong Kong &mdash;{" "}
          <a href="mailto:hr@lifewood.com">hr@lifewood.com</a>
        </footer>
      </div>
    </>
  );
}