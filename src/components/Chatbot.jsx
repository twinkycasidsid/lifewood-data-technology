import { useEffect, useMemo, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import {
  Bot,
  MessageCircle,
  Mic,
  Send,
  Settings,
  Trash2,
  X,
  Volume2,
  VolumeX,
} from "lucide-react";

const SUGGESTIONS = [
  "What services does Lifewood offer?",
  "Where are your offices located?",
  "How can I partner with Lifewood?",
  "I want to speak with someone.",
];

const QUOTA_MESSAGE =
  "The AI service is currently rate-limited or out of quota. Please try again shortly.";

const getLocalFallbackReply = (input) => {
  const text = String(input || "").toLowerCase();
  if (text.includes("service") || text.includes("offer") || text.includes("ai")) {
    return "Lifewood offers AI-powered data services, including AI data collection, annotation, validation, and enterprise AI solutions. You can view details in the What We Offer section.";
  }
  if (text.includes("office") || text.includes("location") || text.includes("where")) {
    return "You can view all Lifewood office locations on the Our Offices page. Use the footer link 'View all offices' to open it directly.";
  }
  if (text.includes("career") || text.includes("job") || text.includes("hiring")) {
    return "You can explore open roles on the Careers page. If a role matches your profile, apply there directly.";
  }
  if (
    text.includes("philanthropy") ||
    text.includes("impact") ||
    text.includes("social")
  ) {
    return "You can find Lifewood social initiatives and programs on the Philanthropy & Impact page.";
  }
  if (
    text.includes("contact") ||
    text.includes("partner") ||
    text.includes("enquiry")
  ) {
    return "For partnerships or inquiries, please use the Contact Us page form and the team will respond.";
  }
  return "I am in fallback mode right now. I can still help with Lifewood services, offices, careers, impact initiatives, and contact details.";
};

const Chatbot = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [step, setStep] = useState("terms"); // terms | welcome | chat
  const [messages, setMessages] = useState([]);
  const [inputValue, setInputValue] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [windowSize, setWindowSize] = useState({
    width: 390,
    height: 640,
  });
  const messagesEndRef = useRef(null);
  const recognitionRef = useRef(null);
  const chatApiUrl = useMemo(() => {
    const explicitChatApiUrl = import.meta.env.VITE_CHAT_API_URL?.trim();
    if (explicitChatApiUrl) return explicitChatApiUrl;

    const apiBaseUrl = import.meta.env.VITE_API_BASE_URL?.trim();
    if (apiBaseUrl) {
      return `${apiBaseUrl.replace(/\/+$/, "")}/api/chat`;
    }

    return "/api/chat";
  }, []);

  const isSpeechSupported =
    typeof window !== "undefined" &&
    ("webkitSpeechRecognition" in window || "SpeechRecognition" in window);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isTyping]);

  useEffect(() => {
    if (!isSpeechSupported) return;
    const SpeechRecognition =
      window.SpeechRecognition || window.webkitSpeechRecognition;
    const recognition = new SpeechRecognition();
    recognition.continuous = false;
    recognition.interimResults = false;
    recognition.lang = "en-US";
    recognition.onresult = (event) => {
      const transcript = event.results?.[0]?.[0]?.transcript || "";
      setInputValue(transcript);
    };
    recognition.onend = () => setIsRecording(false);
    recognition.onerror = () => setIsRecording(false);
    recognitionRef.current = recognition;

    return () => recognition.stop();
  }, [isSpeechSupported]);

  const welcomeMessage = {
    id: Date.now(),
    role: "bot",
    content:
      "Hi, I am Lifewood AI. Ask me anything about our services, offices, and partnerships.",
  };

  const startChat = (seedText) => {
    const nextMessages = [welcomeMessage];
    if (seedText) {
      nextMessages.push({
        id: Date.now() + 1,
        role: "user",
        content: seedText,
      });
    }
    setMessages(nextMessages);
    setStep("chat");
    if (seedText) {
      void askAssistant(seedText, nextMessages);
    }
  };

  const askAssistant = async (message, baseMessages = null) => {
    setIsTyping(true);
    try {
      const response = await fetch(chatApiUrl, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message }),
      });
      const raw = await response.text();
      let data = null;
      if (raw) {
        try {
          data = JSON.parse(raw);
        } catch {
          data = null;
        }
      }
      if (!response.ok) {
        throw new Error(
          typeof data?.reply === "string" && data.reply.trim()
            ? data.reply
            : `Chat API request failed (${response.status})`,
        );
      }

      if (!data) {
        throw new Error("Chat API returned an empty response.");
      }

      const reply =
        typeof data?.reply === "string" && data.reply.trim()
          ? data.reply
          : "I could not generate a response right now. Please try again.";
      const normalizedReply =
        reply === QUOTA_MESSAGE ? getLocalFallbackReply(message) : reply;

      setMessages((prev) => [
        ...(baseMessages || prev),
        {
          id: Date.now() + 2,
          role: "bot",
          content: normalizedReply,
        },
      ]);
    } catch (error) {
      const errorMessage =
        error instanceof Error && error.message
          ? error.message
          : "I am having trouble connecting right now. Please try again in a moment.";
      const normalizedError =
        errorMessage === QUOTA_MESSAGE
          ? getLocalFallbackReply(message)
          : errorMessage;
      setMessages((prev) => [
        ...(baseMessages || prev),
        {
          id: Date.now() + 2,
          role: "bot",
          content: normalizedError,
        },
      ]);
    } finally {
      setIsTyping(false);
    }
  };

  const onSend = async () => {
    const text = inputValue.trim();
    if (!text || isTyping) return;

    const next = [
      ...messages,
      {
        id: Date.now(),
        role: "user",
        content: text,
      },
    ];
    setMessages(next);
    setInputValue("");
    await askAssistant(text, next);
  };

  const toggleRecording = () => {
    if (!recognitionRef.current) return;
    if (isRecording) {
      recognitionRef.current.stop();
      return;
    }
    recognitionRef.current.start();
    setIsRecording(true);
  };

  const clearConversation = () => {
    setMessages([]);
    setStep("welcome");
    setShowSettings(false);
    setInputValue("");
  };

  const resetSize = () => {
    setWindowSize({
      width: 390,
      height: 640,
    });
  };

  return (
    <>
      <style>{`
        .lw-chat-fab {
          position: fixed;
          right: 20px;
          bottom: 20px;
          width: 60px;
          height: 60px;
          border: none;
          border-radius: 999px;
          background: linear-gradient(145deg, #046241, #0f7a56);
          color: #fff;
          box-shadow: 0 12px 28px rgba(4, 98, 65, 0.35);
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          z-index: 1100;
        }
        .lw-chat-fab::after {
          content: "";
          position: absolute;
          inset: -5px;
          border-radius: 999px;
          border: 1px solid rgba(232, 160, 32, 0.45);
          opacity: 0.8;
        }

        .lw-chat-window {
          position: fixed;
          right: 20px;
          bottom: 92px;
          width: min(100vw - 24px, var(--lw-chat-width));
          height: min(calc(100dvh - 110px), var(--lw-chat-height));
          min-width: 320px;
          min-height: 440px;
          max-width: min(520px, calc(100vw - 24px));
          max-height: calc(100dvh - 110px);
          background: #fff;
          border: 1px solid rgba(26, 46, 30, 0.12);
          border-radius: 20px;
          overflow: hidden;
          box-shadow: 0 24px 64px rgba(10, 26, 14, 0.24);
          display: flex;
          flex-direction: column;
          z-index: 1101;
          font-family: "Manrope", sans-serif;
        }

        .lw-chat-header {
          padding: 14px 14px 12px;
          background: linear-gradient(135deg, #0b1f14 0%, #123224 60%, #046241 100%);
          color: #fff;
          display: flex;
          align-items: center;
          justify-content: space-between;
          border-bottom: 1px solid rgba(255, 255, 255, 0.15);
        }
        .lw-chat-brand {
          display: flex;
          align-items: center;
          gap: 10px;
        }
        .lw-chat-brand-dot {
          width: 32px;
          height: 32px;
          border-radius: 10px;
          background: rgba(232, 160, 32, 0.18);
          border: 1px solid rgba(232, 160, 32, 0.35);
          display: flex;
          align-items: center;
          justify-content: center;
        }
        .lw-chat-brand h4 {
          margin: 0;
          font-size: 14px;
          line-height: 1.1;
          letter-spacing: 0.02em;
          font-weight: 800;
        }
        .lw-chat-brand p {
          margin: 2px 0 0;
          font-size: 11px;
          color: rgba(255, 255, 255, 0.75);
        }
        .lw-chat-head-actions {
          display: flex;
          gap: 6px;
        }
        .lw-chat-icon-btn {
          width: 32px;
          height: 32px;
          border-radius: 8px;
          border: 1px solid rgba(255, 255, 255, 0.18);
          background: rgba(255, 255, 255, 0.08);
          color: #fff;
          display: inline-flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
        }

        .lw-chat-settings {
          position: absolute;
          top: 58px;
          right: 12px;
          width: 200px;
          background: #fff;
          border: 1px solid rgba(26, 46, 30, 0.14);
          border-radius: 12px;
          box-shadow: 0 14px 32px rgba(10, 26, 14, 0.14);
          padding: 10px;
          z-index: 2;
        }
        .lw-chat-settings button {
          width: 100%;
          border: 1px solid rgba(26, 46, 30, 0.14);
          border-radius: 10px;
          background: #fff;
          padding: 9px 10px;
          font-size: 12px;
          font-weight: 700;
          color: #1a2e1e;
          display: flex;
          align-items: center;
          gap: 8px;
          cursor: pointer;
          margin-top: 8px;
        }
        .lw-chat-settings button:first-child { margin-top: 0; }
        .lw-chat-settings button:hover { background: #f6f8f7; }

        .lw-chat-resize {
          position: absolute;
          left: 0;
          top: 0;
          width: 14px;
          height: 14px;
          border-top: 2px solid rgba(255, 255, 255, 0.5);
          border-left: 2px solid rgba(255, 255, 255, 0.5);
          border-top-left-radius: 8px;
          cursor: nwse-resize;
          z-index: 3;
        }

        .lw-chat-body {
          flex: 1;
          min-height: 0;
          display: flex;
          flex-direction: column;
          background: linear-gradient(180deg, #f9faf8 0%, #f4f6f2 100%);
        }

        .lw-chat-terms,
        .lw-chat-welcome {
          padding: 16px;
          display: flex;
          flex-direction: column;
          gap: 12px;
          height: 100%;
          overflow: auto;
        }
        .lw-chat-card {
          background: #fff;
          border: 1px solid rgba(26, 46, 30, 0.12);
          border-radius: 14px;
          padding: 14px;
        }
        .lw-chat-card p {
          margin: 0;
          font-size: 13px;
          line-height: 1.6;
          color: rgba(26, 46, 30, 0.72);
        }
        .lw-chat-row {
          display: flex;
          gap: 8px;
        }
        .lw-chat-primary,
        .lw-chat-secondary {
          border-radius: 999px;
          padding: 10px 14px;
          font-size: 12px;
          font-weight: 800;
          border: 1px solid transparent;
          cursor: pointer;
        }
        .lw-chat-primary {
          background: #ffab00;
          color: #0a1a0e;
        }
        .lw-chat-secondary {
          background: #fff;
          border-color: rgba(26, 46, 30, 0.18);
          color: #1a2e1e;
        }

        .lw-chat-suggestions {
          display: flex;
          flex-direction: column;
          gap: 8px;
        }
        .lw-chat-suggestions button {
          text-align: left;
          background: #fff;
          border: 1px solid rgba(4, 98, 65, 0.2);
          color: #046241;
          border-radius: 12px;
          padding: 10px 12px;
          font-size: 12px;
          font-weight: 700;
          cursor: pointer;
        }

        .lw-chat-messages {
          flex: 1;
          min-height: 0;
          overflow: auto;
          padding: 14px;
          display: flex;
          flex-direction: column;
          gap: 10px;
        }
        .lw-chat-msg {
          max-width: 84%;
          padding: 10px 12px;
          border-radius: 12px;
          font-size: 13px;
          line-height: 1.5;
          border: 1px solid rgba(26, 46, 30, 0.1);
          background: #fff;
          color: #1a2e1e;
        }
        .lw-chat-msg.user {
          margin-left: auto;
          background: #046241;
          color: #fff;
          border-color: rgba(4, 98, 65, 0.5);
        }
        .lw-chat-typing {
          font-size: 12px;
          color: rgba(26, 46, 30, 0.65);
          padding-left: 2px;
        }

        .lw-chat-input-wrap {
          border-top: 1px solid rgba(26, 46, 30, 0.12);
          padding: 10px;
          background: #fff;
        }
        .lw-chat-input-row {
          display: flex;
          align-items: center;
          gap: 8px;
          border: 1px solid rgba(26, 46, 30, 0.14);
          border-radius: 999px;
          padding: 4px;
          background: #f8f9f7;
        }
        .lw-chat-input {
          flex: 1;
          border: none;
          background: transparent;
          outline: none;
          padding: 8px 6px;
          font-size: 13px;
          font-family: "Manrope", sans-serif;
          color: #1a2e1e;
        }
        .lw-chat-input-btn {
          width: 34px;
          height: 34px;
          border-radius: 999px;
          border: none;
          display: inline-flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
        }
        .lw-chat-input-btn.voice {
          background: transparent;
          color: rgba(26, 46, 30, 0.7);
        }
        .lw-chat-input-btn.voice.recording {
          background: #d62828;
          color: #fff;
        }
        .lw-chat-input-btn.send {
          background: #046241;
          color: #fff;
        }
        .lw-chat-input-btn:disabled {
          opacity: 0.45;
          cursor: not-allowed;
        }

        @media (max-width: 768px) {
          .lw-chat-fab {
            right: 14px;
            bottom: 14px;
            width: 56px;
            height: 56px;
          }
          .lw-chat-window {
            right: 8px;
            left: 8px;
            bottom: 82px;
            width: auto;
            height: min(76dvh, calc(100dvh - 90px));
            min-width: 0;
            max-width: none;
            min-height: 360px;
            border-radius: 16px;
          }
          .lw-chat-resize {
            display: none;
          }
        }
      `}</style>

      <motion.button
        className="lw-chat-fab"
        type="button"
        onClick={() => setIsOpen((prev) => !prev)}
        whileHover={{ scale: 1.03 }}
        whileTap={{ scale: 0.96 }}
        aria-label="Open Lifewood AI chat"
      >
        <MessageCircle size={24} />
      </motion.button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            className="lw-chat-window"
            style={{
              "--lw-chat-width": `${windowSize.width}px`,
              "--lw-chat-height": `${windowSize.height}px`,
            }}
            initial={{ opacity: 0, scale: 0.95, y: 16 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 16 }}
            transition={{ type: "spring", stiffness: 260, damping: 25 }}
          >
            <div
              className="lw-chat-resize"
              role="presentation"
              onMouseDown={(event) => {
                if (window.innerWidth <= 768) return;
                const startX = event.clientX;
                const startY = event.clientY;
                const startWidth = windowSize.width;
                const startHeight = windowSize.height;

                const onMove = (moveEvent) => {
                  const deltaX = startX - moveEvent.clientX;
                  const deltaY = startY - moveEvent.clientY;
                  const maxWidth = Math.min(520, window.innerWidth - 24);
                  const maxHeight = window.innerHeight - 110;
                  setWindowSize({
                    width: Math.max(320, Math.min(maxWidth, startWidth + deltaX)),
                    height: Math.max(440, Math.min(maxHeight, startHeight + deltaY)),
                  });
                };

                const onUp = () => {
                  window.removeEventListener("mousemove", onMove);
                  window.removeEventListener("mouseup", onUp);
                };

                window.addEventListener("mousemove", onMove);
                window.addEventListener("mouseup", onUp);
              }}
            />
            <div className="lw-chat-header">
              <div className="lw-chat-brand">
                <div className="lw-chat-brand-dot">
                  <Bot size={17} />
                </div>
                <div>
                  <h4>Lifewood AI</h4>
                  <p>Online assistant</p>
                </div>
              </div>
              <div className="lw-chat-head-actions">
                <button
                  type="button"
                  className="lw-chat-icon-btn"
                  onClick={() => setShowSettings((prev) => !prev)}
                  aria-label="Chat settings"
                >
                  <Settings size={16} />
                </button>
                <button
                  type="button"
                  className="lw-chat-icon-btn"
                  onClick={() => setIsOpen(false)}
                  aria-label="Close chat"
                >
                  <X size={16} />
                </button>
              </div>
            </div>

            <div className="lw-chat-body">
              <AnimatePresence>
                {showSettings && (
                  <motion.div
                    className="lw-chat-settings"
                    initial={{ opacity: 0, y: -6 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -6 }}
                  >
                    <button
                      type="button"
                      onClick={() => setSoundEnabled((prev) => !prev)}
                    >
                      {soundEnabled ? <Volume2 size={14} /> : <VolumeX size={14} />}
                      {soundEnabled ? "Sound: On" : "Sound: Off"}
                    </button>
                    <button type="button" onClick={clearConversation}>
                      <Trash2 size={14} />
                      Clear conversation
                    </button>
                    <button type="button" onClick={resetSize}>
                      <Settings size={14} />
                      Reset window size
                    </button>
                  </motion.div>
                )}
              </AnimatePresence>

              {step === "terms" && (
                <div className="lw-chat-terms">
                  <div className="lw-chat-card">
                    <p>
                      Before we begin, please review our Terms and Privacy Policy.
                      By continuing, you agree that your conversation may be used
                      to improve service quality.
                    </p>
                  </div>
                  <div className="lw-chat-row">
                    <button
                      type="button"
                      className="lw-chat-primary"
                      onClick={() => setStep("welcome")}
                    >
                      I agree
                    </button>
                    <button
                      type="button"
                      className="lw-chat-secondary"
                      onClick={() => setIsOpen(false)}
                    >
                      Close
                    </button>
                  </div>
                </div>
              )}

              {step === "welcome" && (
                <div className="lw-chat-welcome">
                  <div className="lw-chat-card">
                    <p>
                      Ask me anything about Lifewood. You can start with one of
                      these quick questions.
                    </p>
                  </div>
                  <div className="lw-chat-suggestions">
                    {SUGGESTIONS.map((item) => (
                      <button
                        key={item}
                        type="button"
                        onClick={() => startChat(item)}
                      >
                        {item}
                      </button>
                    ))}
                    <button type="button" onClick={() => startChat()}>
                      Something else
                    </button>
                  </div>
                </div>
              )}

              {step === "chat" && (
                <>
                  <div className="lw-chat-messages">
                    {messages.map((msg) => (
                      <div
                        key={msg.id}
                        className={`lw-chat-msg ${msg.role === "user" ? "user" : ""}`}
                      >
                        {msg.content}
                      </div>
                    ))}
                    {isTyping && (
                      <div className="lw-chat-typing">Lifewood AI is typing...</div>
                    )}
                    <div ref={messagesEndRef} />
                  </div>

                  <div className="lw-chat-input-wrap">
                    <div className="lw-chat-input-row">
                      <button
                        type="button"
                        className={`lw-chat-input-btn voice ${isRecording ? "recording" : ""}`}
                        onClick={toggleRecording}
                        disabled={!isSpeechSupported}
                        aria-label="Voice input"
                      >
                        <Mic size={16} />
                      </button>
                      <input
                        className="lw-chat-input"
                        type="text"
                        placeholder="Type your message..."
                        value={inputValue}
                        onChange={(event) => setInputValue(event.target.value)}
                        onKeyDown={(event) => {
                          if (event.key === "Enter") {
                            void onSend();
                          }
                        }}
                      />
                      <button
                        type="button"
                        className="lw-chat-input-btn send"
                        onClick={() => void onSend()}
                        disabled={!inputValue.trim() || isTyping}
                        aria-label="Send message"
                      >
                        <Send size={16} />
                      </button>
                    </div>
                  </div>
                </>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default Chatbot;
