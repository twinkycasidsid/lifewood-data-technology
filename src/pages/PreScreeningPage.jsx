import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";

const PreScreeningPage = () => {
  const navigate = useNavigate();
  const [answers, setAnswers] = useState({});
  const [submitted, setSubmitted] = useState(false);

  const questions = useMemo(
    () => [
      "Briefly describe your most recent role and responsibilities.",
      "What interests you about this position at Lifewood?",
      "How do you manage quality and accuracy in your work?",
      "Describe a time you worked with an international or cross‑functional team.",
      "What tools or software are you most proficient in?",
    ],
    []
  );

  const handleChange = (index, value) => {
    setAnswers((prev) => ({ ...prev, [index]: value }));
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    setSubmitted(true);
  };

  return (
    <main
      style={{
        minHeight: "100vh",
        background: "#f6f4ef",
        color: "#1a2e1e",
        fontFamily: "'Manrope', sans-serif",
        padding: "60px clamp(20px,6vw,80px)",
      }}
    >
      <div
        style={{
          maxWidth: 860,
          margin: "0 auto",
          background: "#ffffff",
          borderRadius: 18,
          border: "1px solid rgba(15, 26, 20, 0.08)",
          boxShadow: "0 18px 32px rgba(12, 20, 16, 0.08)",
          padding: "28px 32px",
        }}
      >
        <div style={{ display: "flex", justifyContent: "space-between", gap: 16 }}>
          <div>
            <h1 style={{ fontSize: 24, margin: 0 }}>AI Pre‑Screening Interview</h1>
            <p style={{ margin: "6px 0 0", color: "rgba(26,46,30,0.6)" }}>
              This is a mock interview page for demonstration purposes.
            </p>
          </div>
          <button
            type="button"
            onClick={() => navigate("/careers")}
            style={{
              border: "none",
              background: "#0f6d4f",
              color: "#fff",
              padding: "10px 16px",
              borderRadius: 999,
              cursor: "pointer",
              fontWeight: 600,
              height: 42,
            }}
          >
            Back to Careers
          </button>
        </div>

        {submitted ? (
          <div
            style={{
              marginTop: 24,
              padding: 18,
              borderRadius: 12,
              background: "rgba(15, 109, 79, 0.08)",
              color: "#0f6d4f",
              fontWeight: 600,
            }}
          >
            Thank you! Your responses have been recorded.
          </div>
        ) : (
          <form onSubmit={handleSubmit} style={{ marginTop: 24, display: "grid", gap: 16 }}>
            {questions.map((question, index) => (
              <label key={question} style={{ display: "grid", gap: 8 }}>
                <span style={{ fontSize: 14, fontWeight: 600 }}>{question}</span>
                <textarea
                  value={answers[index] || ""}
                  onChange={(event) => handleChange(index, event.target.value)}
                  rows={4}
                  style={{
                    borderRadius: 12,
                    border: "1px solid rgba(15, 26, 20, 0.14)",
                    padding: "10px 12px",
                    fontFamily: "'Manrope', sans-serif",
                    resize: "vertical",
                  }}
                  required
                />
              </label>
            ))}
            <div style={{ display: "flex", justifyContent: "flex-end", marginTop: 6 }}>
              <button
                type="submit"
                style={{
                  border: "none",
                  background: "#f2a74b",
                  color: "#0f2c1f",
                  padding: "12px 22px",
                  borderRadius: 999,
                  fontWeight: 700,
                  cursor: "pointer",
                }}
              >
                Submit Responses
              </button>
            </div>
          </form>
        )}
      </div>
    </main>
  );
};

export default PreScreeningPage;
