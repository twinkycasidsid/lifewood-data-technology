import { motion } from "framer-motion";

// Capabilities Grid Section
const Capabilities = () => {
  const capabilities = [
    {
      icon: "🎙️",
      title: "Audio",
      description:
        "Collection, labelling, voice categorization, music categorization, and intelligent conversational support.",
    },
    {
      icon: "🖼️",
      title: "Image",
      description:
        "Collection, labelling, classification, audit, object detection, and precision tagging workflows.",
    },
    {
      icon: "🎬",
      title: "Video",
      description:
        "Collection, labelling, audit, live broadcast support, and subtitle generation for AI pipelines.",
    },
    {
      icon: "📝",
      title: "Text",
      description:
        "Text collection, labelling, transcription, utterance collection, and sentiment analysis services.",
    },
  ];

  return (
    <section className="section capabilities-section">
      <div className="container">
        <motion.div
          className="section-header text-center"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
        >
          <span className="section-label">AI DATA SERVICES</span>
          <h2>
            Built for Every <span className="text-gradient">Data Type</span>
          </h2>
          <p>
            Lifewood offers AI and IT services that enhance decision-making,
            reduce costs, and improve productivity.
          </p>
        </motion.div>

        <div className="capabilities-grid">
          {capabilities.map((cap, index) => (
            <motion.div
              key={index}
              className="capability-card glass-card"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              viewport={{ once: true }}
              whileHover={{ scale: 1.03, y: -5 }}
            >
              <div className="capability-icon">{cap.icon}</div>
              <h3>{cap.title}</h3>
              <p>{cap.description}</p>
              <motion.div className="capability-link" whileHover={{ x: 5 }}>
                Explore service →
              </motion.div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Capabilities;
