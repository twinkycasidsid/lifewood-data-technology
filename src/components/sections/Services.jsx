import { useState } from 'react';
import { motion } from 'framer-motion';

const services = [
  {
    id: 'audio',
    title: 'Audio Intelligence & Voice AI',
    tag: 'What We Offer',
    tagIndex: '01 / 04',
    tags: ['Audio Collection', 'Labeling', 'Voice Categorization', 'Music Categorization', 'Intelligent Customer Support'],
    description:
      'We capture and structure audio data at scale—from voice recordings and music libraries to customer interaction datasets—enabling speech recognition, voice AI, and intelligent automation systems to perform with human-grade precision.',
    // Audio: close-up condenser mic in dark studio — Jason Rosewell / Unsplash
    image: 'https://images.unsplash.com/photo-1478737270239-2f02b77fc618?w=600&h=800&fit=crop&q=80',
    backBg: 'linear-gradient(135deg, #046241 0%, #034e34 100%)',
  },
  {
    id: 'text',
    title: 'Natural Language & Text Engineering',
    tag: 'What We Offer',
    tagIndex: '02 / 04',
    tags: ['Text Collection', 'Labeling', 'Transcription', 'Utterance Collection', 'Sentiment Analysis'],
    description:
      'Our text data services fuel the next generation of LLMs and NLP systems. We handle everything from raw text collection and transcription to nuanced sentiment analysis and utterance datasets for conversational AI.',
    // Text/NLP: person typing on laptop keyboard — Kaitlyn Baker / Unsplash
    image: 'https://images.unsplash.com/photo-1455390582262-044cdead277a?w=600&h=800&fit=crop&q=80',
    backBg: 'linear-gradient(135deg, #046241 0%, #034e34 100%)',
  },
  {
    id: 'image',
    title: 'Computer Vision & Image Synthesis',
    tag: 'What We Offer',
    tagIndex: '03 / 04',
    tags: ['Image Collection', 'Labeling', 'Classification', 'Audit', 'Object Detection & Tagging'],
    description:
      'From everyday photographs to complex visual environments, Lifewood builds richly annotated image datasets that train computer vision models to see, understand, and act with accuracy.',
    // Computer vision: camera lens close-up — Paul Skorupskas / Unsplash
    image: 'https://images.unsplash.com/photo-1516035069371-29a1b244cc32?w=600&h=800&fit=crop&q=80',
    backBg: 'linear-gradient(135deg, #046241 0%, #034e34 100%)',
  },
  {
    id: 'video',
    title: 'Video Analytics & Media Compliance',
    tag: 'What We Offer',
    tagIndex: '04 / 04',
    tags: ['Video Collection', 'Labeling', 'Audit', 'Live Broadcast', 'Subtitle Generation'],
    description:
      'We process video data across industries and formats—supporting everything from autonomous vehicle training to media compliance auditing and AI-powered subtitle generation for global accessibility.',
    // Video production: cinema camera on set — Jakob Owens / Unsplash
    image: 'https://images.unsplash.com/photo-1492691527719-9d1e07e534b4?w=600&h=800&fit=crop&q=80',
    backBg: 'linear-gradient(135deg, #046241 0%, #034e34 100%)',
  },
];

const ServiceCard = ({ service, index }) => {
  const [isFlipped, setIsFlipped] = useState(false);

  return (
    <motion.div
      initial={{ opacity: 0, y: 32 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-40px' }}
      transition={{ duration: 0.55, delay: index * 0.1, ease: [0.22, 1, 0.36, 1] }}
      style={{ perspective: 2500, height: 500 }}
      onMouseEnter={() => setIsFlipped(true)}
      onMouseLeave={() => setIsFlipped(false)}
    >
      <motion.div
        style={{
          position: 'relative',
          height: '100%',
          transformStyle: 'preserve-3d',
          cursor: 'pointer',
        }}
        animate={{
          rotateY: isFlipped ? 180 : 0,
          z: isFlipped ? 60 : 0,
        }}
        transition={{
          duration: 0.8,
          type: 'spring',
          stiffness: 50,
          damping: 18,
          mass: 1,
        }}
      >
        {/* ── Front ── */}
        <div style={{
          position: 'absolute', inset: 0,
          borderRadius: 40, overflow: 'hidden',
          background: '#0a1a0e',
          color: '#fff',
          padding: '40px 32px',
          display: 'flex', flexDirection: 'column',
          boxShadow: '0 8px 40px rgba(0,0,0,0.18)',
          border: '1px solid rgba(255,255,255,0.05)',
          backfaceVisibility: 'hidden',
          WebkitBackfaceVisibility: 'hidden',
        }}>
          {/* Background image */}
          <div style={{ position: 'absolute', inset: 0, opacity: 0.38 }}>
            <img
              src={service.image}
              alt={service.title}
              style={{
                width: '100%', height: '100%', objectFit: 'cover',
                filter: 'grayscale(1)',
                transform: 'scale(1.08)',
                transition: 'transform 1s ease, filter 1s ease',
              }}
              referrerPolicy="no-referrer"
            />
            <div style={{
              position: 'absolute', inset: 0,
              background: 'linear-gradient(to top, #0a1a0e 30%, rgba(10,26,14,0.6) 65%, transparent)',
            }} />
          </div>

          {/* Content */}
          <div style={{ position: 'relative', zIndex: 1, marginTop: 'auto' }}>
            {/* Index tag */}
            <div style={{
              fontSize: 10, fontWeight: 700, letterSpacing: '0.16em',
              textTransform: 'uppercase', color: 'rgba(245,166,35,0.7)',
              marginBottom: 14, fontFamily: 'Courier New, monospace',
            }}>
              {service.tagIndex}
            </div>

            <motion.h3
              animate={{ y: isFlipped ? -10 : 0, opacity: isFlipped ? 0 : 1 }}
              transition={{ duration: 0.25 }}
              style={{
                margin: '0 0 16px',
                fontSize: 'clamp(20px, 2vw, 26px)',
                fontWeight: 800,
                lineHeight: 1.15,
                letterSpacing: '-0.02em',
                color: '#fff',
              }}
            >
              {service.title}
            </motion.h3>

            <motion.p
              animate={{ y: isFlipped ? -6 : 0, opacity: isFlipped ? 0 : 1 }}
              transition={{ duration: 0.22 }}
              style={{
                margin: 0,
                fontSize: 14,
                lineHeight: 1.7,
                color: 'rgba(255,255,255,0.72)',
                display: '-webkit-box',
                WebkitLineClamp: 4,
                WebkitBoxOrient: 'vertical',
                overflow: 'hidden',
              }}
            >
              {service.description}
            </motion.p>
          </div>
        </div>

        {/* ── Back ── */}
        <div style={{
          position: 'absolute', inset: 0,
          borderRadius: 40,
          background: service.backBg,
          color: '#fff',
          padding: '36px 32px',
          display: 'flex', flexDirection: 'column',
          boxShadow: '0 8px 40px rgba(0,0,0,0.18)',
          border: '1px solid rgba(255,255,255,0.1)',
          backfaceVisibility: 'hidden',
          WebkitBackfaceVisibility: 'hidden',
          transform: 'rotateY(180deg)',
        }}>
          {/* Header */}
          <div style={{
            display: 'flex', alignItems: 'center', gap: 12,
            paddingBottom: 20,
            borderBottom: '1px solid rgba(255,255,255,0.12)',
            marginBottom: 24,
          }}>
            <div style={{
              background: '#F5A623',
              color: '#0a1a0e',
              borderRadius: 14,
              width: 44, height: 44,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontSize: 18, fontWeight: 800,
              boxShadow: '0 4px 16px rgba(245,166,35,0.3)',
              flexShrink: 0,
            }}>
              {index + 1}
            </div>
            <div>
              <div style={{
                fontSize: 9, fontWeight: 700, letterSpacing: '0.18em',
                textTransform: 'uppercase', color: 'rgba(245,166,35,0.8)',
                marginBottom: 3,
              }}>
                Service Scope
              </div>
              <div style={{ fontWeight: 800, fontSize: 16, lineHeight: 1.2 }}>
                Capabilities
              </div>
            </div>
          </div>

          {/* Tags list */}
          <div style={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center', gap: 10 }}>
            {service.tags.map((tag, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, x: 20 }}
                animate={isFlipped ? { opacity: 1, x: 0 } : { opacity: 0, x: 20 }}
                transition={{
                  delay: 0.2 + i * 0.07,
                  type: 'spring',
                  stiffness: 120,
                  damping: 14,
                }}
                style={{
                  display: 'flex', alignItems: 'center', gap: 12,
                  padding: '12px 14px',
                  borderRadius: 14,
                  background: 'rgba(255,255,255,0.06)',
                  border: '1px solid rgba(255,255,255,0.08)',
                }}
              >
                <div style={{
                  width: 7, height: 7, borderRadius: '50%',
                  background: '#F5A623',
                  boxShadow: '0 0 10px rgba(245,166,35,0.6)',
                  flexShrink: 0,
                }} />
                <span style={{ fontSize: 13.5, fontWeight: 600, color: 'rgba(255,255,255,0.92)' }}>
                  {tag}
                </span>
              </motion.div>
            ))}
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
};

const Services = () => {
  return (
    <>
      <style>{`
        .services-section * { box-sizing: border-box; }
      `}</style>

      <section
        className="services-section"
        style={{
          padding: 'clamp(64px, 10vw, 128px) clamp(24px, 6vw, 80px)',
          background: '#f4f7f5',
          fontFamily: "'Manrope', 'Segoe UI', sans-serif",
        }}
      >
        <div style={{ maxWidth: 1440, margin: '0 auto' }}>

          {/* Header */}
          <div style={{ textAlign: 'center', maxWidth: 820, margin: '0 auto clamp(40px,7vw,80px)' }}>
            <motion.span
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4 }}
              style={{
                display: 'inline-block',
                fontSize: 11, fontWeight: 700,
                letterSpacing: '0.18em', textTransform: 'uppercase',
                color: '#046241', marginBottom: 16,
              }}
            >
              Services
            </motion.span>

            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.08 }}
              style={{
                margin: '0 0 20px',
                fontSize: 'clamp(36px, 5.5vw, 72px)',
                fontWeight: 800,
                lineHeight: 1.05,
                letterSpacing: '-0.025em',
                color: '#0a1a0e',
              }}
            >
              What we offer
            </motion.h2>

            <motion.p
              initial={{ opacity: 0, y: 14 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.15 }}
              style={{
                margin: 0,
                fontSize: 'clamp(15px, 1.6vw, 19px)',
                lineHeight: 1.72,
                color: 'rgba(10,26,14,0.55)',
              }}
            >
              From raw collection to refined annotation, Lifewood delivers end-to-end data
              solutions across every modality — powering the AI systems of tomorrow, today.
            </motion.p>
          </div>

          {/* Grid */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))',
            gap: 24,
          }}>
            {services.map((service, index) => (
              <ServiceCard key={service.id} service={service} index={index} />
            ))}
          </div>

        </div>
      </section>
    </>
  );
};

export default Services;