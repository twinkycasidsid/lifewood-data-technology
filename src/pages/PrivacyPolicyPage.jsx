import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import {
  Shield,
  FileText,
  Database,
  Share2,
  Lock,
  Clock,
  Cookie,
  Globe,
  AlertTriangle,
  ShoppingBag,
  Link,
  Baby,
  RefreshCw,
  CheckSquare,
  Phone,
  Info,
} from "lucide-react";

const sections = [
  {
    number: "BG",
    title: "Background",
    icon: Info,
    accent: "#046241",
    content: `Lifewood Data Technology Limited operates as a dynamic technology company dedicated to delivering cutting-edge AI and data-driven solutions. Lifewood specializes in collecting, processing, and securely managing diverse forms of personal data, including text, audio, pictures, videos, and AI-generated content.\n\nThe Company operates globally through corporate offices, franchise partners, subcontractors, and affiliated entities in Hong Kong, Malaysia, China, the United States, the Philippines, Bangladesh, Indonesia, and other countries.\n\nCommitted to compliance and aligned with international best practices, Lifewood emphasizes stringent data security, transparent user rights, and responsible data governance to empower innovation while safeguarding privacy across its services worldwide.`,
    subsections: [
      {
        label: "Commitment to Privacy",
        text: "The Company is committed to protecting the privacy and personal data of all individuals who interact with our services, recognizing that privacy protection is fundamental to maintaining trust.",
      },
      {
        label: "Regulatory Compliance",
        text: "This Privacy Policy has been developed to ensure compliance with Hong Kong privacy laws including the Personal Data (Privacy) Ordinance (Cap. 486), as well as applicable laws in all jurisdictions where the Company operates, including GDPR standards.",
      },
      {
        label: "Purpose of Policy",
        text: "To inform users about our data handling practices, explain their rights regarding personal data, and establish transparent procedures for data collection, use, sharing, security, and retention.",
      },
      {
        label: "International Operations",
        text: "Lifewood's operations may involve cross-border data transfers and international service delivery, including engagement with participants from European Union member states for specific projects.",
      },
    ],
  },
  {
    number: "1",
    title: "Definitions",
    icon: FileText,
    accent: "#E8A020",
    content: `This section defines key terms used throughout this Privacy Policy to ensure clarity and consistency in how we communicate our data practices.`,
    subsections: [
      {
        label: "Personal Data",
        text: "Any data, whether true or not, about an individual who can be identified from that data, including names, identification numbers, location data, online identifiers, and factors specific to the identity of that individual.",
      },
      {
        label: "Processing",
        text: "Any operation performed on personal data, whether or not by automated means, such as collection, recording, storage, adaptation, retrieval, use, disclosure, alignment, restriction, erasure, or destruction.",
      },
      {
        label: "Data Subject",
        text: "An identified or identifiable natural person who is the subject of personal data, including users, customers, website visitors, employees, and any other individuals whose data we collect, process, or store.",
      },
      {
        label: "Data Controller / Processor",
        text: "Lifewood acts as a processor when processing Personal Data on documented instructions of a client, or as an independent controller for Lifewood-run functions such as HR, recruitment, security logging, finance, and marketing.",
      },
      {
        label: "Consent",
        text: "Any freely given, specific, informed and unambiguous indication of the data subject's wishes signifying agreement to the processing of personal data relating to him or her.",
      },
      {
        label: "Data Breach",
        text: "A breach of security leading to the accidental or unlawful destruction, loss, alteration, unauthorised disclosure of, or access to, personal data transmitted, stored or otherwise processed.",
      },
      {
        label: "Data Protection Officer (DPO)",
        text: "The individual appointed by the Company to monitor compliance with data protection laws and serve as the primary contact for data protection matters.",
      },
    ],
  },
  {
    number: "2",
    title: "Information Collection",
    icon: Database,
    accent: "#046241",
    content: `We collect and process various categories of personal data necessary for providing our Services. Collection occurs when users voluntarily provide information, engage with our Services, or when data is automatically captured during service usage.`,
    subsections: [
      {
        label: "Identity & Contact Information",
        text: "Full name, email addresses, telephone numbers, postal addresses, job titles, company affiliations, and other contact details.",
      },
      {
        label: "Account & Authentication Data",
        text: "Usernames, passwords, security questions and answers, account preferences, and authentication credentials.",
      },
      {
        label: "Technical & Usage Information",
        text: "IP addresses, device identifiers, browser types and versions, operating system information, referring URLs, access times, and usage patterns.",
      },
      {
        label: "Content Data",
        text: "Text files, documents, audio recordings, images, videos, and other content materials uploaded, created, or processed through our Services.",
      },
      {
        label: "AI-Generated Content",
        text: "Data outputs, results, and derivatives created through artificial intelligence processing, including machine learning models and algorithmic outputs based on User input.",
      },
      {
        label: "Financial Information",
        text: "Billing addresses, payment method details, transaction records, and invoicing information where applicable to paid Services.",
      },
    ],
  },
  {
    number: "3",
    title: "Use of Information",
    icon: Shield,
    accent: "#E8A020",
    content: `We process Personal Data for various legitimate business purposes. All processing is conducted based on lawful grounds including consent, contractual necessity, legal obligation, or legitimate interests.`,
    subsections: [
      {
        label: "Service Provision & Operations",
        text: "We process Personal Data to provide, maintain, and improve our Services, including user authentication, account management, and delivery of requested technology solutions.",
      },
      {
        label: "Customer Support & Communications",
        text: "Personal Data is processed to respond to user inquiries, provide technical support, troubleshoot issues, and maintain communication records for quality assurance purposes.",
      },
      {
        label: "Analytics & Performance Monitoring",
        text: "We process Personal Data to analyze usage patterns, monitor system performance, generate statistical reports, and conduct research to enhance our Services.",
      },
      {
        label: "AI Model Training & Development",
        text: "Lifewood will not use client-provided datasets containing Personal Data to train models except where the client has provided documented instructions and appropriate lawful basis, or the data has been irreversibly anonymised.",
      },
      {
        label: "Security & Fraud Prevention",
        text: "Personal Data is processed to maintain system security, detect and prevent fraud, unauthorized access, and other security threats to our Services and users.",
      },
      {
        label: "Marketing & Commercial Communications",
        text: "Subject to appropriate Consent or Legitimate Interest, we process Personal Data to send marketing communications and information about new products or services. We do not sell Personal Data.",
      },
    ],
  },
  {
    number: "4",
    title: "Data Sharing and Disclosure",
    icon: Share2,
    accent: "#046241",
    content: `We may share your Personal Data with third parties in limited circumstances and only as described below. We do not disclose client-provided Personal Data to business partners for their own purposes.`,
    subsections: [
      {
        label: "Service Providers & Contractors",
        text: "We engage third party service providers to perform functions on our behalf, including IT infrastructure management, customer support, data analytics, and payment processing. They are contractually bound to process data only for specified purposes.",
      },
      {
        label: "Business Partners & Affiliates",
        text: "Personal Data may be shared with affiliated companies within our corporate group for internal business operations, consolidated reporting, and service delivery.",
      },
      {
        label: "Legal & Regulatory Disclosure",
        text: "We will disclose Personal Data when required by applicable law, court order, subpoena, or other legal process, or when necessary to protect our rights, property, or safety.",
      },
      {
        label: "Corporate Transactions",
        text: "In the event of a merger, acquisition, or sale of assets, Personal Data may be transferred to the acquiring entity, subject to appropriate confidentiality protections and user notification.",
      },
    ],
  },
  {
    number: "5",
    title: "Data Security Measures",
    icon: Lock,
    accent: "#E8A020",
    content: `The Company implements comprehensive technical and organizational security measures designed to protect Personal Data against unauthorized access, disclosure, alteration, destruction, or loss.`,
    subsections: [
      {
        label: "Technical Security",
        text: "Industry-standard encryption protocols including SSL/TLS for data transmission and AES-256 for data storage. Multi-factor authentication, role-based access permissions, firewalls, and intrusion detection systems.",
      },
      {
        label: "Organizational Security",
        text: "All employees with access to Personal Data undergo mandatory privacy and data security training. The Company maintains strict confidentiality agreements with all staff members and third-party service providers.",
      },
      {
        label: "Physical Security",
        text: "Physical access to facilities containing Personal Data is restricted through secure access controls, surveillance systems, and environmental controls.",
      },
      {
        label: "Incident Response",
        text: "The Company maintains documented procedures for detecting, reporting, and responding to security incidents, including immediate containment measures and notification procedures in accordance with applicable law.",
      },
    ],
  },
  {
    number: "6",
    title: "User Rights and Controls",
    icon: CheckSquare,
    accent: "#046241",
    content: `Data subjects have significant rights regarding their Personal Data. All rights requests must be submitted in writing to the DPO and will be processed free of charge unless requests are manifestly unfounded, excessive, or repetitive.`,
    subsections: [
      {
        label: "Right of Access",
        text: "Request confirmation of whether the Company processes your Personal Data and obtain access to such data. The Company will respond within thirty (30) days of receipt.",
      },
      {
        label: "Right to Rectification",
        text: "Request correction of inaccurate Personal Data or completion of incomplete data. Corrections will be made within thirty (30) days where the request is substantiated and technically feasible.",
      },
      {
        label: "Right to Erasure",
        text: "Request deletion of your Personal Data where it is no longer necessary, consent is withdrawn, the data has been unlawfully processed, or erasure is required by law. Deletion within sixty (60) days where granted.",
      },
      {
        label: "Right to Data Portability",
        text: "Receive your Personal Data in a structured, commonly used, and machine-readable format (CSV, JSON, or XML) within thirty (30) days.",
      },
      {
        label: "Right to Object",
        text: "Object to processing of your Personal Data based on Legitimate Interests, including processing for direct marketing purposes. The Company will immediately cease direct marketing upon objection.",
      },
      {
        label: "Right to Restrict Processing",
        text: "Request restriction of processing where accuracy is contested, processing is unlawful, data is required for legal claims, or an objection has been lodged pending verification.",
      },
    ],
  },
  {
    number: "7",
    title: "Data Retention Periods",
    icon: Clock,
    accent: "#E8A020",
    content: `The Company retains Personal Data only for as long as necessary to fulfil the purposes described in this policy, to comply with legal obligations, maintain security and audit trails, and to establish, exercise, or defend legal claims.`,
    subsections: [
      {
        label: "Customer & User Account Records",
        text: "Retained for the life of the account and typically up to 24 months after closure, unless a longer period is needed for audit, security, or dispute resolution.",
      },
      {
        label: "Customer Support & Communications",
        text: "Typically up to 24–36 months after resolution, unless a longer period is required by law or to resolve a dispute.",
      },
      {
        label: "Financial & Tax Records",
        text: "At least seven (7) years or longer where required by applicable law.",
      },
      {
        label: "Security & Access Logs",
        text: "Typically 12–24 months, subject to security and fraud-prevention needs.",
      },
      {
        label: "Recruitment Data",
        text: "Typically up to 12–24 months after the process ends unless hired or local law requires otherwise.",
      },
      {
        label: "AI-Generated Content & Training Data",
        text: "Only for the period specified by the controller and no longer than necessary for audit and model validation. Anonymised artefacts may be retained longer with re-identification prohibited.",
      },
    ],
  },
  {
    number: "8",
    title: "Cookies and Tracking Technologies",
    icon: Cookie,
    accent: "#046241",
    content: `The Company uses cookies, web beacons, local storage technologies, and analytics tracking tools to collect usage statistics and performance data. Non-essential cookies and marketing communications are opt-in where required.`,
    subsections: [
      {
        label: "Essential Cookies",
        text: "Necessary for basic website functionality, user authentication, and security features. Cannot be disabled without affecting core Services.",
      },
      {
        label: "Performance Cookies",
        text: "Collect aggregated information about website usage, page load times, and technical performance to improve our Services.",
      },
      {
        label: "Functional Cookies",
        text: "Remember user preferences, language settings, and customization choices to enhance user experience.",
      },
      {
        label: "Marketing Cookies",
        text: "Track user behavior across websites to deliver targeted advertising and measure campaign effectiveness. Activated only upon consent.",
      },
    ],
    note: "Users can manage cookie preferences through browser settings or our cookie consent management tool. Disabling essential cookies may result in reduced website functionality.",
  },
  {
    number: "9",
    title: "International Data Transfers",
    icon: Globe,
    accent: "#E8A020",
    content: `Transfers rely on recognised safeguards such as Standard Contractual Clauses, intragroup agreements, or other approved mechanisms. Where a client mandates data residency, Lifewood will enforce geographic access controls and contractual flow-down to all subprocessors.`,
    subsections: [
      {
        label: "Adequacy Assessments",
        text: "Before transferring Personal Data outside Hong Kong, the Company conducts assessments to determine whether the receiving jurisdiction provides adequate protection comparable to Hong Kong law standards.",
      },
      {
        label: "Transfer Safeguards",
        text: "Standard contractual clauses approved by relevant data protection authorities; binding corporate rules for intragroup transfers; and specific contractual obligations requiring recipients to maintain equivalent data protection standards.",
      },
      {
        label: "Third-Party Processor Obligations",
        text: "All Third Parties receiving Personal Data through Cross-Border Transfers must implement appropriate security measures, notify the Company of any Data Breach, and assist in responding to Data Subject rights requests.",
      },
    ],
  },
  {
    number: "10",
    title: "Data Breach Procedures",
    icon: AlertTriangle,
    accent: "#046241",
    content: `The Company maintains continuous monitoring systems and procedures to detect potential Data Breaches. Upon discovery, the Company will immediately conduct a preliminary assessment within 24 hours of detection.`,
    subsections: [
      {
        label: "Containment & Risk Mitigation",
        text: "Upon confirmation of a Data Breach, the Company will immediately implement containment measures including resetting passwords, suspending compromised accounts, and taking all reasonable steps to mitigate potential harm.",
      },
      {
        label: "Regulatory Notification",
        text: "The Company will notify regulators and affected individuals in accordance with applicable law in each jurisdiction, including a description of the breach, categories of Data Subjects affected, and measures taken.",
      },
      {
        label: "Individual Notification",
        text: "Affected Data Subjects will be notified without undue delay when a Data Breach is likely to result in a high risk to their rights and freedoms, communicated in clear and plain language.",
      },
      {
        label: "Documentation & Record Keeping",
        text: "Comprehensive documentation of all Data Breaches will be maintained and retained for a minimum period of seven (7) years, available to regulatory authorities upon request.",
      },
    ],
  },
  {
    number: "11",
    title: "Commercial Use of Data",
    icon: ShoppingBag,
    accent: "#E8A020",
    content: `The Company may use Personal Data for legitimate commercial purposes that support our business operations, service delivery, and growth objectives, provided such use is lawful, fair, and transparent to Data Subjects.`,
    subsections: [
      {
        label: "Marketing & Communications",
        text: "We may use Personal Data to send marketing communications and newsletters where we have obtained appropriate Consent or have a Legitimate Interest. Data Subjects may opt out at any time.",
      },
      {
        label: "Product Development & Innovation",
        text: "Personal Data may be used to develop, improve, and enhance our technology products and Services, including AI model training subject to appropriate data protection safeguards.",
      },
      {
        label: "Business Analytics & Intelligence",
        text: "We process Personal Data for market research, trend analysis, performance measurement, and strategic planning. Where possible, we utilize Anonymisation techniques to reduce privacy risks.",
      },
    ],
  },
  {
    number: "12",
    title: "Third-Party Services",
    icon: Link,
    accent: "#046241",
    content: `Our Services may contain links to third-party websites, applications, or services that are not owned or controlled by the Company. This Privacy Policy does not apply to such third-party websites or services. We are not responsible for their privacy practices, content, or policies.`,
    subsections: [
      {
        label: "Third-Party Service Providers",
        text: "We may engage third-party service providers including cloud storage providers, analytics services, payment processors, and marketing platforms. Such third parties are bound by contractual obligations to protect Personal Data.",
      },
      {
        label: "Social Media Integration",
        text: "Our Services may include social media features and widgets provided by third parties. These features may collect information about your IP address and pages visited.",
      },
    ],
  },
  {
    number: "13",
    title: "Children's Privacy",
    icon: Baby,
    accent: "#E8A020",
    content: `Our Services are not intended for use by individuals under the age of 18 years. We do not knowingly collect, use, or disclose Personal Data from children under 18 years of age without appropriate parental or guardian consent as required by applicable law.`,
    subsections: [
      {
        label: "Parental Consent Requirements",
        text: "Where we become aware that Personal Data of a child under 18 has been collected without proper parental consent, we will take immediate steps to obtain such consent or delete the Personal Data within 30 days.",
      },
      {
        label: "Enhanced Protection",
        text: "When processing children's data with appropriate consent, we apply additional safeguards including limited data collection, enhanced security measures, and restricted data sharing. We do not use children's data for direct marketing.",
      },
      {
        label: "Parental Rights & Controls",
        text: "Parents or guardians have the right to access, review, modify, or request deletion of their child's Personal Data at any time. We will respond to parental requests within 30 days of receipt.",
      },
    ],
  },
  {
    number: "14",
    title: "Policy Updates",
    icon: RefreshCw,
    accent: "#046241",
    content: `The Company reserves the right to modify, update, or amend this Privacy Policy at any time to reflect changes in our business practices, legal requirements, or regulatory developments.\n\nMaterial changes become effective thirty (30) days after notification. Non-material changes become effective immediately upon publication. Continued use of our Services after the effective date of material changes constitutes acceptance of the updated Privacy Policy.`,
    subsections: [
      {
        label: "Material Changes",
        text: "Modifications that significantly affect how we collect, use, share, or protect personal data, or changes to user rights. We will provide 30 days advance notice via website and email.",
      },
      {
        label: "Non-Material Changes",
        text: "Administrative updates, clarifications of existing practices, contact information updates, or minor editorial corrections. Effective immediately upon publication.",
      },
    ],
  },
  {
    number: "15",
    title: "Compliance Framework",
    icon: Shield,
    accent: "#E8A020",
    content: `This Privacy Policy is governed primarily by the Personal Data (Privacy) Ordinance (Cap. 486) of Hong Kong. The Company also complies with applicable privacy laws in all jurisdictions where it operates or engages with data subjects.`,
    subsections: [
      {
        label: "Hong Kong (Primary)",
        text: "Personal Data (Privacy) Ordinance (Cap. 486) and all applicable amendments, subsidiary legislation, and codes of practice issued thereunder.",
      },
      {
        label: "International Frameworks",
        text: "Malaysia's Personal Data Protection Act, relevant Chinese data protection regulations, US federal and state privacy laws, Philippine Data Privacy Act, Bangladesh Data Protection Act, and Indonesian data protection regulations.",
      },
      {
        label: "GDPR Compliance",
        text: "The EU General Data Protection Regulation (GDPR) for engagement with EU data subjects, including lawful bases for processing, data subject rights, and cross-border transfer requirements.",
      },
    ],
  },
  {
    number: "16",
    title: "Contact Information",
    icon: Phone,
    accent: "#046241",
    content: `All privacy-related inquiries, requests, and communications should be directed to our designated privacy contact. We will acknowledge receipt of privacy inquiries within three (3) business days and provide a substantive response within thirty (30) days.`,
    subsections: [
      {
        label: "Postal Address",
        text: "Lifewood Data Technology Limited\nUnit 19, 9/F, Core C, Cyberport 3\n100 Cyberport Road, Hong Kong",
      },
      {
        label: "Regulatory Authority — Hong Kong",
        text: "Privacy Commissioner for Personal Data\n12/F, Sunlight Tower, 248 Queen's Road East, Wan Chai, Hong Kong\nTel: +852 2827 2827 · Email: communications@pcpd.org.hk · Web: www.pcpd.org.hk",
      },
      {
        label: "Regulatory Authority — EU",
        text: "Relevant Data Protection Authorities in EU member states, including the Dutch Data Protection Authority (Autoriteit Persoonsgegevens) for GDPR-related matters.",
      },
      {
        label: "Other Jurisdictions",
        text: "Malaysia: Personal Data Protection Department · United States: Federal Trade Commission · Philippines: National Privacy Commission. Contact details for other authorities available upon request.",
      },
    ],
    contact: "hr@lifewood.com",
  },
];

const PrivacyPolicyPage = ({ onNavigate = () => {} }) => {
  const [activeSection, setActiveSection] = useState(sections[0].number);

  const scrollToSection = (number) => {
    const target = document.getElementById(`pp-section-${number}`);
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
      const element = document.getElementById(`pp-section-${section.number}`);
      if (element) observer.observe(element);
    });

    return () => observer.disconnect();
  }, []);

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Manrope:wght@300;400;500;600;700;800&display=swap');
        *, *::before, *::after { box-sizing: border-box; }

        .pp-root {
          min-height: 100vh;
          background: #f9f9f7;
          padding-top: 80px;
          font-family: 'Manrope', sans-serif;
        }

        /* ── Hero ── */
        .pp-hero {
          position: relative;
          padding: 60px 40px 52px;
          text-align: center;
          overflow: hidden;
          background: linear-gradient(135deg, rgba(10,22,14,0.94) 0%, rgba(13,34,24,0.94) 58%, rgba(4,98,65,0.86) 100%);
          border-bottom: 1px solid rgba(255,255,255,0.08);
        }
        .pp-hero::before {
          content: "";
          position: absolute; inset: 0;
          background:
            radial-gradient(circle at 12% 14%, rgba(232,160,32,0.14), transparent 46%),
            radial-gradient(circle at 88% 84%, rgba(255,255,255,0.08), transparent 44%);
          pointer-events: none;
        }
        .pp-hero-eyebrow {
          display: inline-flex; align-items: center; gap: 7px;
          background: rgba(255,255,255,0.08);
          border: 1px solid rgba(255,255,255,0.16);
          border-radius: 999px; padding: 5px 14px;
          font-size: 11px; font-weight: 700; letter-spacing: 0.11em;
          text-transform: uppercase; color: #f4f6f2;
          margin-bottom: 20px; font-family: 'Manrope', sans-serif;
          position: relative; z-index: 1;
        }
        .pp-hero-title {
          font-family: 'Manrope', sans-serif;
          font-size: clamp(32px, 5.5vw, 62px);
          font-weight: 800; line-height: 1.08;
          letter-spacing: -0.03em; color: #f8faf6;
          margin: 0 0 16px; position: relative; z-index: 1;
        }
        .pp-hero-title span { color: #E8A020; }
        .pp-hero-sub {
          font-size: clamp(13px, 1.6vw, 15px);
          color: rgba(246,247,244,0.82); max-width: 520px;
          margin: 0 auto; line-height: 1.65; font-weight: 400;
          font-family: 'Manrope', sans-serif;
          position: relative; z-index: 1;
        }
        .pp-hero-meta {
          display: flex; align-items: center; justify-content: center; gap: 24px;
          margin-top: 28px; flex-wrap: wrap;
          position: relative; z-index: 1;
        }
        .pp-hero-meta-item {
          display: flex; align-items: center; gap: 6px;
          font-size: 11.5px; font-weight: 600;
          color: rgba(246,247,244,0.72); font-family: 'Manrope', sans-serif;
        }
        .pp-hero-meta-dot { width: 4px; height: 4px; border-radius: 50%; background: rgba(255,255,255,0.45); }

        .pp-layout {
          max-width: 1240px;
          margin: 0 auto;
          padding: 0 28px 90px;
          display: grid;
          grid-template-columns: 280px minmax(0, 1fr);
          gap: 0 26px;
          align-items: start;
        }

        .pp-toc {
          position: sticky;
          top: 96px;
          align-self: start;
          padding: 28px 14px 20px 0;
          border-right: 1px solid rgba(26,46,30,0.12);
          max-height: calc(100vh - 110px);
          overflow: auto;
        }
        .pp-toc-label {
          font-size: 10px;
          letter-spacing: 0.16em;
          text-transform: uppercase;
          color: rgba(26,46,30,0.52);
          margin-bottom: 14px;
          font-weight: 700;
        }
        .pp-toc-row {
          display: flex;
          flex-direction: column;
          gap: 6px;
        }
        .pp-toc-item {
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
        .pp-toc-item:hover {
          color: #1a2e1e;
          background: rgba(4,98,65,0.06);
        }
        .pp-toc-item.active {
          color: #1a2e1e;
          border-left-color: #e8a020;
          background: rgba(4,98,65,0.08);
        }

        .pp-main {
          min-width: 0;
        }

        /* ── Body ── */
        .pp-body {
          margin: 0;
          padding: 28px 0 0;
          display: flex;
          flex-direction: column;
          gap: 16px;
        }

        /* ── Section card ── */
        .pp-card {
          background: #fff;
          border: 1px solid rgba(26,46,30,0.085);
          border-radius: 20px;
          padding: 28px 32px;
          transition: border-color 0.2s ease, box-shadow 0.2s ease;
          overflow: hidden;
          position: relative;
          scroll-margin-top: 100px;
        }
        .pp-card:hover {
          border-color: rgba(4,98,65,0.18);
          box-shadow: 0 4px 24px rgba(4,98,65,0.05);
        }

        /* ── Section header ── */
        .pp-section-header {
          display: flex; align-items: flex-start; gap: 16px;
          margin-bottom: 18px;
        }
        .pp-icon-wrap {
          width: 42px; height: 42px; border-radius: 12px;
          display: flex; align-items: center; justify-content: center;
          flex-shrink: 0;
        }
        .pp-section-number {
          font-size: 9.5px; font-weight: 700; letter-spacing: 0.14em;
          text-transform: uppercase; margin-bottom: 4px;
          font-family: 'Manrope', sans-serif;
        }
        .pp-section-title {
          font-family: 'Manrope', sans-serif;
          font-size: clamp(16px, 2vw, 19px);
          font-weight: 800; color: #1a2e1e;
          letter-spacing: -0.02em; line-height: 1.2; margin: 0;
        }

        /* ── Content ── */
        .pp-content {
          font-size: 14px; line-height: 1.78;
          color: rgba(26,46,30,0.58); font-weight: 400;
          font-family: 'Manrope', sans-serif;
          margin-bottom: 0; white-space: pre-line;
        }

        /* ── Subsections ── */
        .pp-subsections {
          margin-top: 18px;
          display: flex; flex-direction: column; gap: 10px;
        }
        .pp-subsection {
          display: flex; align-items: flex-start; gap: 12px;
          background: #f9f9f7;
          border: 1px solid rgba(26,46,30,0.07);
          border-radius: 12px; padding: 14px 16px;
        }
        .pp-subsection-dot {
          width: 6px; height: 6px; border-radius: 50%;
          flex-shrink: 0; margin-top: 6px;
        }
        .pp-subsection-label {
          font-size: 12px; font-weight: 700; color: #1a2e1e;
          font-family: 'Manrope', sans-serif; margin-bottom: 3px;
          letter-spacing: -0.01em;
        }
        .pp-subsection-text {
          font-size: 13px; line-height: 1.65;
          color: rgba(26,46,30,0.54); font-weight: 400;
          font-family: 'Manrope', sans-serif; margin: 0;
          white-space: pre-line;
        }

        /* ── Note ── */
        .pp-note {
          margin-top: 14px;
          background: rgba(232,160,32,0.06);
          border: 1px solid rgba(232,160,32,0.18);
          border-radius: 10px; padding: 12px 16px;
          font-size: 13px; line-height: 1.65;
          color: rgba(26,46,30,0.60); font-weight: 500;
          font-family: 'Manrope', sans-serif;
        }

        /* ── Contact email ── */
        .pp-email-link {
          display: inline-flex; align-items: center; gap: 8px;
          margin-top: 14px;
          background: rgba(4,98,65,0.06);
          border: 1px solid rgba(4,98,65,0.15);
          border-radius: 10px; padding: 11px 18px;
          font-size: 13.5px; font-weight: 700; color: #046241;
          text-decoration: none; font-family: 'Manrope', sans-serif;
          transition: all 0.18s ease;
        }
        .pp-email-link:hover {
          background: rgba(4,98,65,0.10);
          border-color: rgba(4,98,65,0.28);
          transform: translateY(-1px);
          box-shadow: 0 4px 14px rgba(4,98,65,0.10);
        }

        /* ── Ghost number ── */
        .pp-ghost {
          position: absolute; bottom: -16px; right: 16px;
          font-size: 100px; font-weight: 900; line-height: 1;
          color: rgba(26,46,30,0.03);
          pointer-events: none; user-select: none;
          font-family: 'Manrope', sans-serif;
        }

        /* ── Effective date footer ── */
        .pp-footer-note {
          max-width: 100%; margin: 0 auto;
          padding: 30px 0 0;
          text-align: center;
          font-family: 'Manrope', sans-serif;
          font-size: 12px; font-weight: 500;
          color: rgba(26,46,30,0.32);
          line-height: 1.6;
        }

        /* ── Responsive ── */
        @media (max-width: 700px) {
          .pp-hero { padding: 44px 20px 40px; }
          .pp-body { padding: 20px 0 0; gap: 12px; }
          .pp-card { padding: 22px 20px; }
          .pp-section-header { gap: 12px; }
          .pp-hero-meta { gap: 14px; }
          .pp-toc { padding: 10px 0 10px; }
          .pp-toc-row {
            flex-wrap: wrap;
            overflow-x: visible;
            gap: 8px;
          }
          .pp-toc-item {
            max-width: none;
            white-space: normal;
            line-height: 1.25;
            padding: 8px 10px;
            font-size: 12px;
          }
        }

        @media (max-width: 1024px) {
          .pp-layout {
            grid-template-columns: 1fr;
            padding: 0 14px 64px;
          }
          .pp-toc {
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
          .pp-toc-row {
            flex-direction: row;
            gap: 8px;
            overflow-x: auto;
            -webkit-overflow-scrolling: touch;
            scrollbar-width: thin;
            padding-bottom: 2px;
          }
          .pp-toc-item {
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
          .pp-toc-item.active {
            border-left: 1px solid rgba(26,46,30,0.10);
            border-bottom-color: #e8a020;
          }
          .pp-footer-note { padding-top: 18px; }
        }
      `}</style>

      <div className="pp-root">
        {/* ── Hero ── */}
        <motion.div
          className="pp-hero"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
        >
          <div className="pp-hero-eyebrow">
            <Shield size={11} />
            Legal
          </div>
          <h1 className="pp-hero-title">
            Privacy <span>Policy</span>
          </h1>
          <p className="pp-hero-sub">
            This policy explains how Lifewood Data Technology Limited collects,
            uses, shares, and protects personal data across our global
            operations and technology platforms.
          </p>
          <div className="pp-hero-meta">
            <span className="pp-hero-meta-item">
              Lifewood Data Technology Ltd.
            </span>
            <span className="pp-hero-meta-dot" />
            <span className="pp-hero-meta-item">16 sections</span>
            <span className="pp-hero-meta-dot" />
            <span className="pp-hero-meta-item">Effective 3 November 2025</span>
            <span className="pp-hero-meta-dot" />
            <span className="pp-hero-meta-item">Hong Kong (Cap. 486)</span>
          </div>
        </motion.div>

        <div className="pp-layout">
          <aside className="pp-toc">
            <p className="pp-toc-label">On this page</p>
            <div className="pp-toc-row">
              {sections.map((section) => (
                <button
                  key={`pp-toc-${section.number}`}
                  type="button"
                  className={`pp-toc-item${activeSection === section.number ? " active" : ""}`}
                  onClick={() => scrollToSection(section.number)}
                >
                  {section.number}. {section.title}
                </button>
              ))}
            </div>
          </aside>

          <main className="pp-main">
            {/* ── Section cards ── */}
            <div className="pp-body">
              {sections.map((section, i) => {
                const Icon = section.icon;
                return (
                  <motion.div
                    key={section.number}
                    id={`pp-section-${section.number}`}
                    data-section-number={section.number}
                    className="pp-card"
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, margin: "-40px" }}
                    transition={{
                      duration: 0.5,
                      delay: i * 0.04,
                      ease: [0.22, 1, 0.36, 1],
                    }}
                    onMouseEnter={() => setActiveSection(section.number)}
                  >
                {/* Ghost number */}
                <div className="pp-ghost">{section.number}</div>

                {/* Header */}
                <div className="pp-section-header">
                  <div
                    className="pp-icon-wrap"
                    style={{
                      background: `${section.accent}12`,
                      border: `1px solid ${section.accent}22`,
                    }}
                  >
                    <Icon size={18} color={section.accent} strokeWidth={1.8} />
                  </div>
                  <div>
                    <div
                      className="pp-section-number"
                      style={{ color: section.accent }}
                    >
                      {section.number === "BG"
                        ? "Background"
                        : `Section ${section.number}`}
                    </div>
                    <h2 className="pp-section-title">{section.title}</h2>
                  </div>
                </div>

                {/* Divider */}
                <div
                  style={{
                    height: 1,
                    background: "rgba(26,46,30,0.06)",
                    marginBottom: 16,
                  }}
                />

                {/* Body text */}
                <p className="pp-content">{section.content}</p>

                {/* Subsections */}
                {section.subsections && section.subsections.length > 0 && (
                  <div className="pp-subsections">
                    {section.subsections.map((sub, si) => (
                      <div key={si} className="pp-subsection">
                        <div
                          className="pp-subsection-dot"
                          style={{ background: section.accent }}
                        />
                        <div>
                          <div className="pp-subsection-label">{sub.label}</div>
                          <p className="pp-subsection-text">{sub.text}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                )}

                {/* Note */}
                {section.note && <div className="pp-note">{section.note}</div>}

                {/* Contact email */}
                {section.contact && (
                  <a
                    href={`mailto:${section.contact}`}
                    className="pp-email-link"
                  >
                    <Phone size={14} />
                    {section.contact}
                  </a>
                )}
                  </motion.div>
                );
              })}
            </div>

            {/* ── Footer ── */}
            <p className="pp-footer-note">
              This Privacy Policy was duly approved and adopted by Lifewood Data
              Technology Limited
              <br />
              and shall be effective from 3 November 2025.
            </p>
          </main>
        </div>
      </div>
    </>
  );
};

export default PrivacyPolicyPage;

