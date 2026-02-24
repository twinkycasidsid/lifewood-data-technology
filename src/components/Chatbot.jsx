import { useState, useEffect, useRef } from "react";
import { AnimatePresence, motion } from "framer-motion";
import {
  MessageCircle,
  Mic,
  Send,
  Settings,
  Bell,
  Globe,
  Trash2,
  Mail,
  X,
  ChevronDown,
} from "lucide-react";

// ─── Chatbot Component ────────────────────────────────────────────────────────
const Chatbot = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [currentStep, setCurrentStep] = useState("terms"); // terms, welcome, chat
  const [messages, setMessages] = useState([]);
  const [inputValue, setInputValue] = useState("");
  const [isRecording, setIsRecording] = useState(false);
  const [settings, setSettings] = useState({
    soundEnabled: true,
    language: "English",
    clearConversation: false,
  });
  const [showSettings, setShowSettings] = useState(false);
  const [showLanguageDropdown, setShowLanguageDropdown] = useState(false);
  const [isSpeechSupported] = useState(
    "webkitSpeechRecognition" in window || "SpeechRecognition" in window,
  );
  const recognitionRef = useRef(null);
  const messagesEndRef = useRef(null);

  // Scroll to bottom of messages
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // Initialize Web Speech API
  useEffect(() => {
    if (isSpeechSupported) {
      const SpeechRecognition =
        window.SpeechRecognition || window.webkitSpeechRecognition;
      recognitionRef.current = new SpeechRecognition();
      recognitionRef.current.continuous = false;
      recognitionRef.current.interimResults = false;
      recognitionRef.current.lang = "en-US";

      recognitionRef.current.onresult = (event) => {
        const transcript = event.results[0][0].transcript;
        setInputValue(transcript);
        setIsRecording(false);
      };

      recognitionRef.current.onend = () => {
        setIsRecording(false);
      };

      recognitionRef.current.onerror = () => {
        setIsRecording(false);
      };
    }
  }, [isSpeechSupported]);

  const handleAgree = () => {
    setCurrentStep("welcome");
  };

  const handlePromptClick = (prompt) => {
    if (prompt === "Something else") {
      // Hide prompt buttons and activate input
      setMessages([
        {
          id: 1,
          type: "bot",
          content:
            "Hi there! 👋 I'm Lifewood AI, your virtual assistant. I can answer most of your questions — and if I can't, I'll connect you with someone who can. What would you like to know?",
          timestamp: new Date(),
        },
      ]);
      setCurrentStep("chat");
    } else {
      // Handle specific prompts
      const botResponse = getBotResponse(prompt);
      setMessages([
        {
          id: 1,
          type: "user",
          content: prompt,
          timestamp: new Date(),
        },
        {
          id: 2,
          type: "bot",
          content: botResponse,
          timestamp: new Date(),
        },
      ]);
      setCurrentStep("chat");
    }
  };

  const getBotResponse = (prompt) => {
    // Simple responses for demo - in real implementation, this would connect to AI
    switch (prompt) {
      case "What services does Lifewood offer?":
        return "Lifewood offers a comprehensive range of AI services including Data Servicing (Type A), Horizontal LLM Data (Type B), Vertical LLM Data (Type C), and AIGC (Type D). We specialize in AI-driven solutions for various industries.";
      case "Where are your offices located?":
        return "Lifewood has offices in multiple locations. You can find our office locations on our Offices page. We have a presence in key regions to serve our global clients effectively.";
      case "How can I partner with Lifewood?":
        return "To partner with Lifewood, please contact us through our Contact Us page or use the 'I'd like to speak with someone' option. Our team will be happy to discuss partnership opportunities with you.";
      case "I'd like to speak with someone.":
        return "I'd be happy to connect you with a human representative. Please provide your contact information and preferred time to speak, and someone from our team will reach out to you shortly.";
      default:
        return "Thank you for your question. I'm processing your request and will provide a detailed response shortly. If you need immediate assistance, feel free to contact us directly.";
    }
  };

  const handleSendMessage = async () => {
    if (!inputValue.trim()) return;

    const userMessage = {
      id: messages.length + 1,
      type: "user",
      content: inputValue,
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInputValue("");

    try {
      const res = await fetch("http://localhost:5000/api/chat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ message: userMessage.content }),
      });

      const data = await res.json();

      const botMessage = {
        id: userMessage.id + 1,
        type: "bot",
        content: data.reply,
        timestamp: new Date(),
      };

      setMessages((prev) => [...prev, botMessage]);
    } catch (error) {
      setMessages((prev) => [
        ...prev,
        {
          id: userMessage.id + 1,
          type: "bot",
          content: "I'm having trouble connecting right now.",
          timestamp: new Date(),
        },
      ]);
    }
  };
  

  const handleVoiceRecord = () => {
    if (isRecording) {
      recognitionRef.current?.stop();
    } else {
      recognitionRef.current?.start();
      setIsRecording(true);
    }
  };

  const handleClearConversation = () => {
    setMessages([]);
    setCurrentStep("welcome");
    setShowSettings(false);
  };

  const handleEmailConversation = () => {
    // In real implementation, this would send email
    alert("Conversation transcript has been sent to your email.");
    setShowSettings(false);
  };

  const toggleSound = () => {
    setSettings({ ...settings, soundEnabled: !settings.soundEnabled });
  };

  const changeLanguage = (lang) => {
    setSettings({ ...settings, language: lang });
    setShowLanguageDropdown(false);
  };

  return (
    <>
      <style>{`
        /* ── Chatbot Styles ── */
        .chatbot-floating-btn {
          position: fixed;
          bottom: 24px;
          right: 24px;
          width: 60px;
          height: 60px;
          border-radius: 50%;
          background: #046241;
          border: none;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          box-shadow: 0 4px 20px rgba(4, 98, 65, 0.3);
          z-index: 1001;
          transition: all 0.3s ease;
        }
        .chatbot-floating-btn:hover {
          transform: scale(1.05);
          box-shadow: 0 6px 25px rgba(4, 98, 65, 0.4);
        }
        .chatbot-pulse {
          position: absolute;
          width: 100%;
          height: 100%;
          border-radius: 50%;
          background: rgba(232, 160, 32, 0.3);
          animation: pulse 2s infinite;
        }
        @keyframes pulse {
          0% { transform: scale(1); opacity: 1; }
          100% { transform: scale(1.2); opacity: 0; }
        }

        .chatbot-window {
          position: fixed;
          bottom: 100px;
          right: 24px;
          width: 380px;
          height: 600px;
          background: #fff;
          border-radius: 20px;
          box-shadow: 0 20px 60px rgba(0, 0, 0, 0.15);
          z-index: 1002;
          display: flex;
          flex-direction: column;
          overflow: hidden;
          font-family: 'Manrope', sans-serif;
        }

        .chatbot-header {
          background: #046241;
          color: white;
          padding: 20px;
          display: flex;
          align-items: center;
          justify-content: space-between;
          border-radius: 20px 20px 0 0;
        }

        .chatbot-header-title {
          font-size: 18px;
          font-weight: 700;
        }

        .chatbot-settings-btn {
          background: none;
          border: none;
          color: white;
          cursor: pointer;
          padding: 4px;
          border-radius: 6px;
          transition: background 0.2s ease;
        }
        .chatbot-settings-btn:hover {
          background: rgba(255, 255, 255, 0.1);
        }

        .chatbot-content {
          flex: 1;
          display: flex;
          flex-direction: column;
          overflow: hidden;
        }

        .chatbot-messages {
          flex: 1;
          padding: 20px;
          overflow-y: auto;
          display: flex;
          flex-direction: column;
          gap: 16px;
        }

        .message {
          display: flex;
          gap: 12px;
          max-width: 80%;
        }

        .message.user {
          align-self: flex-end;
          flex-direction: row-reverse;
        }

        .message-avatar {
          width: 32px;
          height: 32px;
          border-radius: 50%;
          flex-shrink: 0;
        }

        .message.user .message-avatar {
          background: #046241;
          display: flex;
          align-items: center;
          justify-content: center;
          color: white;
          font-size: 14px;
          font-weight: 600;
        }

        .message.bot .message-avatar {
          background: white;
          border: 2px solid #046241;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .message-content {
          background: #f5f5f5;
          padding: 12px 16px;
          border-radius: 16px;
          font-size: 14px;
          line-height: 1.4;
        }

        .message.user .message-content {
          background: #046241;
          color: white;
        }

        .chatbot-input-area {
          padding: 20px;
          border-top: 1px solid #e5e5e5;
          background: white;
        }

        .chatbot-input-container {
          display: flex;
          align-items: center;
          gap: 12px;
          background: #f5f5f5;
          border-radius: 24px;
          padding: 4px;
        }

        .chatbot-input {
          flex: 1;
          border: none;
          background: transparent;
          padding: 12px 16px;
          font-size: 14px;
          outline: none;
          font-family: 'Manrope', sans-serif;
        }

        .chatbot-input::placeholder {
          color: #999;
        }

        .chatbot-voice-btn, .chatbot-send-btn {
          width: 40px;
          height: 40px;
          border-radius: 50%;
          border: none;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          transition: all 0.2s ease;
        }

        .chatbot-voice-btn {
          background: transparent;
          color: #666;
        }
        .chatbot-voice-btn:hover {
          background: rgba(4, 98, 65, 0.1);
          color: #046241;
        }
        .chatbot-voice-btn.recording {
          background: #ff4444;
          color: white;
          animation: recording-pulse 1.5s infinite;
        }
        @keyframes recording-pulse {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.5; }
        }

        .chatbot-send-btn {
          background: #046241;
          color: white;
        }
        .chatbot-send-btn:hover {
          background: #035a3a;
        }
        .chatbot-send-btn:disabled {
          background: #ccc;
          cursor: not-allowed;
        }

        .terms-card {
          padding: 24px;
          background: #f8f9fa;
          border-radius: 16px;
          margin: 20px;
          text-align: center;
        }

        .terms-text {
          font-size: 14px;
          color: #666;
          margin-bottom: 20px;
          line-height: 1.5;
        }

        .terms-buttons {
          display: flex;
          gap: 12px;
          justify-content: center;
        }

        .terms-agree-btn {
          background: #046241;
          color: white;
          border: none;
          padding: 12px 24px;
          border-radius: 24px;
          font-weight: 600;
          cursor: pointer;
          transition: background 0.2s ease;
        }
        .terms-agree-btn:hover {
          background: #035a3a;
        }

        .terms-decline-btn {
          background: none;
          border: none;
          color: #666;
          cursor: pointer;
          text-decoration: underline;
          font-size: 14px;
        }

        .welcome-screen {
          padding: 24px;
          text-align: center;
          height: 100%;
          display: flex;
          flex-direction: column;
        }

        .welcome-logo {
          width: 120px;
          height: auto;
          margin: 0 auto 16px;
        }

        .welcome-name {
          font-size: 24px;
          font-weight: 700;
          color: #046241;
          margin-bottom: 4px;
        }

        .welcome-subtitle {
          font-size: 14px;
          color: #666;
          margin-bottom: 24px;
        }

        .welcome-greeting {
          display: flex;
          align-items: flex-start;
          gap: 12px;
          margin-bottom: 24px;
          text-align: left;
        }

        .welcome-avatar {
          width: 32px;
          height: 32px;
          border-radius: 50%;
          background: white;
          border: 2px solid #046241;
          display: flex;
          align-items: center;
          justify-content: center;
          flex-shrink: 0;
        }

        .welcome-text {
          font-size: 14px;
          color: #333;
          line-height: 1.5;
        }

        .welcome-prompts {
          display: flex;
          flex-direction: column;
          gap: 8px;
        }

        .welcome-prompt-btn {
          background: none;
          border: 2px solid #E8A020;
          color: #E8A020;
          padding: 12px 16px;
          border-radius: 24px;
          cursor: pointer;
          font-size: 14px;
          font-weight: 500;
          transition: all 0.2s ease;
        }
        .welcome-prompt-btn:hover {
          background: #E8A020;
          color: white;
        }

        .settings-panel {
          position: absolute;
          top: 70px;
          right: 20px;
          background: white;
          border: 1px solid #e5e5e5;
          border-radius: 12px;
          box-shadow: 0 8px 24px rgba(0, 0, 0, 0.1);
          padding: 16px;
          min-width: 200px;
          z-index: 1003;
        }

        .settings-item {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 8px 0;
          font-size: 14px;
        }

        .settings-toggle {
          width: 40px;
          height: 20px;
          background: #ccc;
          border-radius: 10px;
          position: relative;
          cursor: pointer;
          transition: background 0.2s ease;
        }
        .settings-toggle.active {
          background: #046241;
        }
        .settings-toggle::after {
          content: '';
          position: absolute;
          width: 16px;
          height: 16px;
          background: white;
          border-radius: 50%;
          top: 2px;
          left: 2px;
          transition: transform 0.2s ease;
        }
        .settings-toggle.active::after {
          transform: translateX(20px);
        }

        .settings-dropdown {
          position: relative;
        }
        .settings-dropdown-btn {
          background: none;
          border: 1px solid #e5e5e5;
          padding: 6px 12px;
          border-radius: 6px;
          cursor: pointer;
          font-size: 14px;
          display: flex;
          align-items: center;
          gap: 8px;
        }
        .settings-dropdown-menu {
          position: absolute;
          top: 100%;
          left: 0;
          right: 0;
          background: white;
          border: 1px solid #e5e5e5;
          border-radius: 6px;
          margin-top: 4px;
          max-height: 150px;
          overflow-y: auto;
          z-index: 1004;
        }
        .settings-dropdown-item {
          padding: 8px 12px;
          cursor: pointer;
          font-size: 14px;
        }
        .settings-dropdown-item:hover {
          background: #f5f5f5;
        }

        .settings-action-btn {
          width: 100%;
          padding: 8px 12px;
          border: 1px solid #e5e5e5;
          background: none;
          border-radius: 6px;
          cursor: pointer;
          font-size: 14px;
          margin-top: 8px;
          transition: all 0.2s ease;
        }
        .settings-action-btn:hover {
          background: #f5f5f5;
        }
        .settings-action-btn.clear:hover {
          background: #ff4444;
          color: white;
          border-color: #ff4444;
        }

        /* Mobile styles */
        @media (max-width: 768px) {
          .chatbot-window {
            width: calc(100vw - 32px);
            height: calc(100vh - 120px);
            bottom: 80px;
            right: 16px;
            left: 16px;
          }
          .chatbot-floating-btn {
            bottom: 16px;
            right: 16px;
          }
        }
      `}</style>

      {/* ── Floating Button ── */}
      <motion.button
        className="chatbot-floating-btn"
        onClick={() => setIsOpen(!isOpen)}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
      >
        <div className="chatbot-pulse"></div>
        <MessageCircle size={24} color="white" />
      </motion.button>

      {/* ── Chat Window ── */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            className="chatbot-window"
            initial={{ opacity: 0, scale: 0.8, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.8, y: 20 }}
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
          >
            {/* Header */}
            <div className="chatbot-header">
              <div className="chatbot-header-title">LIFEWOOD AI</div>
              <button
                className="chatbot-settings-btn"
                onClick={() => setShowSettings(!showSettings)}
              >
                <Settings size={20} />
              </button>
            </div>

            {/* Content */}
            <div className="chatbot-content">
              {currentStep === "terms" && (
                <div className="terms-card">
                  <div className="terms-text">
                    Before we begin, please review our Terms of Use and Privacy
                    Policy. By continuing, you agree that your conversation with
                    Lifewood AI may be used to improve our services.
                  </div>
                  <div className="terms-buttons">
                    <button className="terms-agree-btn" onClick={handleAgree}>
                      I Agree — Let's Chat
                    </button>
                    <button
                      className="terms-decline-btn"
                      onClick={() => setIsOpen(false)}
                    >
                      No Thanks
                    </button>
                  </div>
                </div>
              )}

              {currentStep === "welcome" && (
                <div className="welcome-screen">
                  <img
                    src="/lifewood-logo.png"
                    alt="LIFEWOOD"
                    className="welcome-logo"
                  />
                  <div className="welcome-name">Lifewood AI</div>
                  <div className="welcome-subtitle">
                    Lifewood's AI Assistant · Powered by AI
                  </div>
                  <div className="welcome-greeting">
                    <div className="welcome-avatar">
                      <img
                        src="/lifewood-logo.png"
                        alt="Lifewood"
                        style={{ width: 20, height: 20, objectFit: "contain" }}
                      />
                    </div>
                    <div className="welcome-text">
                      Hi there! 👋 I'm Lifewood AI, your virtual assistant. I
                      can answer most of your questions — and if I can't, I'll
                      connect you with someone who can. What would you like to
                      know?
                    </div>
                  </div>
                  <div className="welcome-prompts">
                    <button
                      className="welcome-prompt-btn"
                      onClick={() =>
                        handlePromptClick("What services does Lifewood offer?")
                      }
                    >
                      What services does Lifewood offer?
                    </button>
                    <button
                      className="welcome-prompt-btn"
                      onClick={() =>
                        handlePromptClick("Where are your offices located?")
                      }
                    >
                      Where are your offices located?
                    </button>
                    <button
                      className="welcome-prompt-btn"
                      onClick={() =>
                        handlePromptClick("How can I partner with Lifewood?")
                      }
                    >
                      How can I partner with Lifewood?
                    </button>
                    <button
                      className="welcome-prompt-btn"
                      onClick={() =>
                        handlePromptClick("I'd like to speak with someone.")
                      }
                    >
                      I'd like to speak with someone.
                    </button>
                    <button
                      className="welcome-prompt-btn"
                      onClick={() => handlePromptClick("Something else")}
                    >
                      Something else
                    </button>
                  </div>
                </div>
              )}

              {currentStep === "chat" && (
                <>
                  <div className="chatbot-messages">
                    {messages.map((message) => (
                      <div
                        key={message.id}
                        className={`message ${message.type}`}
                      >
                        <div className="message-avatar">
                          {message.type === "user" ? (
                            "U"
                          ) : (
                            <img
                              src="/lifewood-logo.png"
                              alt="Lifewood"
                              style={{
                                width: 20,
                                height: 20,
                                objectFit: "contain",
                              }}
                            />
                          )}
                        </div>
                        <div className="message-content">{message.content}</div>
                      </div>
                    ))}
                    <div ref={messagesEndRef} />
                  </div>

                  <div className="chatbot-input-area">
                    <div className="chatbot-input-container">
                      <button
                        className={`chatbot-voice-btn ${isRecording ? "recording" : ""}`}
                        onClick={handleVoiceRecord}
                        disabled={!isSpeechSupported}
                      >
                        <Mic size={20} />
                      </button>
                      <input
                        type="text"
                        className="chatbot-input"
                        placeholder="Message Lifewood AI..."
                        value={inputValue}
                        onChange={(e) => setInputValue(e.target.value)}
                        onKeyPress={(e) => {
                          if (e.key === "Enter") handleSendMessage();
                        }}
                      />
                      <button
                        className="chatbot-send-btn"
                        onClick={handleSendMessage}
                        disabled={!inputValue.trim()}
                      >
                        <Send size={20} />
                      </button>
                    </div>
                  </div>
                </>
              )}
            </div>

            {/* Settings Panel */}
            <AnimatePresence>
              {showSettings && (
                <motion.div
                  className="settings-panel"
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                >
                  <div className="settings-item">
                    <span>🔔 Notification Sound</span>
                    <div
                      className={`settings-toggle ${settings.soundEnabled ? "active" : ""}`}
                      onClick={toggleSound}
                    ></div>
                  </div>
                  <div className="settings-item">
                    <span>🌐 Language</span>
                    <div className="settings-dropdown">
                      <button
                        className="settings-dropdown-btn"
                        onClick={() =>
                          setShowLanguageDropdown(!showLanguageDropdown)
                        }
                      >
                        {settings.language} <ChevronDown size={14} />
                      </button>
                      {showLanguageDropdown && (
                        <div className="settings-dropdown-menu">
                          {[
                            "English",
                            "Filipino",
                            "French",
                            "Spanish",
                            "Mandarin",
                            "Arabic",
                            "Japanese",
                          ].map((lang) => (
                            <div
                              key={lang}
                              className="settings-dropdown-item"
                              onClick={() => changeLanguage(lang)}
                            >
                              {lang}
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                  <button
                    className="settings-action-btn clear"
                    onClick={handleClearConversation}
                  >
                    🗑️ Clear Conversation
                  </button>
                  <button
                    className="settings-action-btn"
                    onClick={handleEmailConversation}
                  >
                    ✉️ Email This Conversation
                  </button>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default Chatbot;
