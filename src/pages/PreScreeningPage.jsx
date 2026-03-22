import { useEffect, useMemo, useRef, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";

const QUESTION_BANK = [
  {
    id: "diversity-1",
    category: "Diversity",
    prompt:
      "How do you approach working with people from different backgrounds, beliefs, and philosophies? Share one specific project where diversity improved the outcome.",
  },
  {
    id: "caring-1",
    category: "Caring",
    prompt:
      "Tell us about a time you supported a colleague through a difficult situation. What did you do, and what was the impact?",
  },
  {
    id: "innovation-1",
    category: "Innovation",
    prompt:
      "Give an example of a new idea or solution you introduced to improve a process or solve a problem. Include measurable results.",
  },
  {
    id: "integrity-1",
    category: "Integrity",
    prompt:
      "Describe an ethical dilemma you encountered at work. How did you handle it and what was the final outcome?",
  },
  {
    id: "mission-vision-1",
    category: "Mission & Vision",
    prompt:
      "How would you help Lifewood become a global champion in AI data solutions while creating positive impact for communities and sustainability?",
  },
];

const safeRandomId = () => {
  if (typeof crypto !== "undefined" && crypto.randomUUID) return crypto.randomUUID();
  return `session-${Date.now()}-${Math.random().toString(36).slice(2)}`;
};

const wordsCount = (value = "") =>
  String(value || "")
    .trim()
    .split(/\s+/)
    .filter(Boolean).length;

const pickPromptVariant = (index) => {
  const variants = [
    "Use a clear structure: context, actions, and measurable outcome.",
    "Mention stakeholders, constraints, and your decision process.",
    "Be specific about what changed after your contribution.",
  ];
  return variants[index % variants.length];
};

const PreScreeningPage = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const apiBaseUrl = import.meta.env.VITE_API_BASE_URL || "";
  const applicationId = searchParams.get("applicationId") || "";
  const sessionFromQuery = searchParams.get("session") || "";
  const nameFromQuery = searchParams.get("name") || "";
  const emailFromQuery = searchParams.get("email") || "";

  const [candidateName, setCandidateName] = useState(nameFromQuery);
  const [candidateEmail, setCandidateEmail] = useState(emailFromQuery);
  const [answers, setAnswers] = useState(() => QUESTION_BANK.map(() => ""));
  const [questionElapsed, setQuestionElapsed] = useState(() => QUESTION_BANK.map(() => 0));
  const [editEvents, setEditEvents] = useState(() => QUESTION_BANK.map(() => 0));
  const [activeIndex, setActiveIndex] = useState(0);
  const [hasStarted, setHasStarted] = useState(false);
  const [startedAt, setStartedAt] = useState("");
  const [sessionId, setSessionId] = useState(sessionFromQuery || safeRandomId());
  const [questionStartMs, setQuestionStartMs] = useState(Date.now());
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [submitError, setSubmitError] = useState("");
  const [notice, setNotice] = useState("");
  const [tabSwitches, setTabSwitches] = useState(0);
  const [pasteAttempts, setPasteAttempts] = useState(0);
  const [droppedAttempts, setDroppedAttempts] = useState(0);
  const [localTime, setLocalTime] = useState(Date.now());
  const textAreaRef = useRef(null);

  const currentQuestion = QUESTION_BANK[activeIndex];
  const progress = ((activeIndex + 1) / QUESTION_BANK.length) * 100;
  const totalElapsedSec = useMemo(
    () => Math.round(questionElapsed.reduce((sum, sec) => sum + sec, 0)),
    [questionElapsed],
  );
  const totalWordCount = useMemo(
    () => answers.reduce((sum, answer) => sum + wordsCount(answer), 0),
    [answers],
  );
  const currentWordCount = wordsCount(answers[activeIndex]);

  useEffect(() => {
    const intervalId = window.setInterval(() => {
      setLocalTime(Date.now());
      setQuestionElapsed((prev) =>
        prev.map((value, index) =>
          index === activeIndex ? Math.max(value, (Date.now() - questionStartMs) / 1000) : value,
        ),
      );
    }, 1000);
    return () => window.clearInterval(intervalId);
  }, [activeIndex, questionStartMs]);

  useEffect(() => {
    const onVisibilityChange = () => {
      if (document.hidden) {
        setTabSwitches((prev) => prev + 1);
        setNotice("Focus change detected. Keep this tab active while completing the interview.");
      }
    };

    document.addEventListener("visibilitychange", onVisibilityChange);
    return () => {
      document.removeEventListener("visibilitychange", onVisibilityChange);
    };
  }, []);

  useEffect(() => {
    if (hasStarted && textAreaRef.current) textAreaRef.current.focus();
  }, [activeIndex, hasStarted]);

  const startInterview = () => {
    const trimmedName = candidateName.trim();
    const trimmedEmail = candidateEmail.trim();
    if (!trimmedName || !trimmedEmail) {
      setSubmitError("Please complete your full name and email before starting.");
      return;
    }
    setSubmitError("");
    setSessionId(sessionFromQuery || safeRandomId());
    setStartedAt(new Date().toISOString());
    setHasStarted(true);
    setQuestionStartMs(Date.now());
  };

  const updateAnswer = (value) => {
    setAnswers((prev) => prev.map((answer, index) => (index === activeIndex ? value : answer)));
    setEditEvents((prev) => prev.map((count, index) => (index === activeIndex ? count + 1 : count)));
    if (notice) setNotice("");
  };

  const moveToIndex = (index) => {
    setQuestionElapsed((prev) =>
      prev.map((value, idx) => (idx === activeIndex ? Math.max(value, (Date.now() - questionStartMs) / 1000) : value)),
    );
    setActiveIndex(index);
    setQuestionStartMs(Date.now());
  };

  const handleNext = () => {
    if (activeIndex < QUESTION_BANK.length - 1) moveToIndex(activeIndex + 1);
  };

  const handleBack = () => {
    if (activeIndex > 0) moveToIndex(activeIndex - 1);
  };

  const buildPayload = () => {
    const submittedAt = new Date().toISOString();
    const finalizedElapsed = questionElapsed.map((value, index) =>
      index === activeIndex ? Math.max(value, (Date.now() - questionStartMs) / 1000) : value,
    );
    const responses = QUESTION_BANK.map((question, index) => ({
      id: question.id,
      category: question.category,
      question: question.prompt,
      answer: answers[index],
      timeSpentSec: Math.round(finalizedElapsed[index]),
      editEvents: editEvents[index],
    }));

    return {
      sessionId,
      applicationId,
      email: candidateEmail.trim(),
      applicantName: candidateName.trim(),
      startedAt,
      submittedAt,
      responses,
      telemetry: {
        totalDurationSec: Math.round(finalizedElapsed.reduce((sum, sec) => sum + sec, 0)),
        totalWordCount,
        tabSwitches,
        pasteAttempts,
        droppedAttempts,
        userAgent: typeof navigator !== "undefined" ? navigator.userAgent : "",
      },
    };
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (isSubmitting) return;

    setIsSubmitting(true);
    setSubmitError("");

    try {
      const response = await fetch(`${apiBaseUrl}/api/pre-screening/submit`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(buildPayload()),
      });
      const data = await response.json().catch(() => ({}));
      if (!response.ok) throw new Error(data?.error || "Unable to submit pre-screening.");
      setSubmitted(true);
    } catch (error) {
      console.error(error);
      setSubmitError(error.message || "Unable to submit pre-screening.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleBlockedAction = (kind, event) => {
    event.preventDefault();
    if (kind === "paste") setPasteAttempts((prev) => prev + 1);
    if (kind === "drop") setDroppedAttempts((prev) => prev + 1);
    setNotice("Pasting external text is disabled for interview integrity. Please answer directly.");
  };

  return (
    <main className="ps-page">
      <style>{`
        .ps-page {
          min-height: 100vh;
          background: radial-gradient(circle at top right, #f8f1df 0%, #f4f1e8 45%, #eef2ed 100%);
          color: #162c1f;
          font-family: "Manrope", sans-serif;
          padding: 44px clamp(16px, 5vw, 56px);
        }
        .ps-shell {
          max-width: 960px;
          margin: 0 auto;
          background: rgba(255, 255, 255, 0.92);
          border: 1px solid rgba(18, 40, 29, 0.1);
          border-radius: 20px;
          box-shadow: 0 24px 44px rgba(9, 22, 17, 0.12);
          padding: clamp(18px, 3vw, 30px);
          display: grid;
          gap: 18px;
        }
        .ps-top { display: flex; justify-content: space-between; gap: 12px; align-items: center; flex-wrap: wrap; }
        .ps-title { margin: 0; font-size: clamp(22px, 3vw, 30px); color: #0e261a; }
        .ps-sub { margin: 6px 0 0; color: rgba(13, 36, 25, 0.72); font-size: 14px; }
        .ps-btn { border: 0; border-radius: 999px; padding: 11px 18px; font-weight: 700; cursor: pointer; }
        .ps-btn.ghost { background: rgba(11, 52, 35, 0.08); color: #0f2d20; }
        .ps-btn.primary { background: linear-gradient(135deg, #f4bf64, #eba339); color: #142d21; }
        .ps-progress { height: 8px; background: #e7ebe5; border-radius: 999px; overflow: hidden; }
        .ps-progress > span { display: block; height: 100%; background: linear-gradient(90deg, #1e7b58, #2ca76e); }
        .ps-grid { display: grid; gap: 12px; grid-template-columns: repeat(2, minmax(0, 1fr)); }
        .ps-field { display: grid; gap: 6px; font-size: 13px; color: rgba(13, 36, 25, 0.85); }
        .ps-field input { border-radius: 10px; border: 1px solid rgba(16, 39, 28, 0.16); padding: 10px 12px; font-family: inherit; }
        .ps-card {
          border: 1px solid rgba(16, 39, 28, 0.1);
          border-radius: 16px;
          padding: 16px;
          background: #fcfdfc;
          display: grid;
          gap: 10px;
        }
        .ps-rules { margin: 0; padding-left: 20px; display: grid; gap: 6px; color: rgba(13, 36, 25, 0.8); font-size: 14px; }
        .ps-tag {
          display: inline-flex;
          align-items: center;
          border-radius: 999px;
          background: rgba(18, 120, 84, 0.1);
          color: #0c5b3f;
          font-size: 12px;
          padding: 5px 10px;
          font-weight: 700;
          width: fit-content;
        }
        .ps-q { margin: 0; font-size: 18px; color: #0f2c1f; line-height: 1.5; }
        .ps-hint { margin: 0; font-size: 13px; color: rgba(13, 36, 25, 0.72); }
        .ps-answer {
          min-height: 220px;
          resize: vertical;
          border-radius: 12px;
          border: 1px solid rgba(16, 39, 28, 0.2);
          padding: 12px;
          font-family: inherit;
          font-size: 14px;
          line-height: 1.5;
        }
        .ps-meta { display: flex; justify-content: space-between; gap: 10px; color: rgba(15, 37, 27, 0.68); font-size: 13px; flex-wrap: wrap; }
        .ps-warning { margin: 0; font-size: 13px; color: #8a430a; background: rgba(242, 170, 65, 0.17); border-radius: 10px; padding: 10px 12px; }
        .ps-error { margin: 0; font-size: 13px; color: #a0162f; background: rgba(242, 65, 107, 0.12); border-radius: 10px; padding: 10px 12px; }
        .ps-actions { display: flex; justify-content: space-between; gap: 10px; flex-wrap: wrap; }
        .ps-success {
          border-radius: 14px;
          background: rgba(39, 146, 95, 0.12);
          border: 1px solid rgba(27, 110, 73, 0.25);
          padding: 14px;
          color: #14553b;
          font-weight: 600;
        }
        @media (max-width: 760px) {
          .ps-grid { grid-template-columns: 1fr; }
          .ps-answer { min-height: 180px; }
        }
      `}</style>

      <section className="ps-shell">
        <div className="ps-top">
          <div>
            <h1 className="ps-title">Lifewood Pre-Screening Interview</h1>
            <p className="ps-sub">Please answer independently. Your responses are assessed for authenticity and decision quality.</p>
          </div>
          <button type="button" className="ps-btn ghost" onClick={() => navigate("/careers")}>
            Back to Careers
          </button>
        </div>

        <div className="ps-progress">
          <span style={{ width: `${hasStarted ? progress : 0}%` }} />
        </div>

        {submitted ? (
          <div className="ps-success">Pre-screening submitted successfully. Our team will review your responses and contact you for next steps.</div>
        ) : !hasStarted ? (
          <>
            <div className="ps-grid">
              <label className="ps-field">
                Full Name
                <input
                  value={candidateName}
                  onChange={(event) => setCandidateName(event.target.value)}
                  placeholder="Juan Dela Cruz"
                />
              </label>
              <label className="ps-field">
                Email
                <input
                  type="email"
                  value={candidateEmail}
                  readOnly={Boolean(emailFromQuery)}
                  onChange={(event) => setCandidateEmail(event.target.value)}
                  placeholder="your.email@example.com"
                  required
                />
              </label>
            </div>
            <div className="ps-card">
              <strong>Interview Guidelines</strong>
              <ul className="ps-rules">
                <li>Provide honest, experience-based answers with concrete examples.</li>
                <li>Each question should be answered in your own words and based on your personal experience.</li>
                <li>You can move through the questions at your own pace and submit when you are ready.</li>
                <li>Keep this tab active throughout the interview.</li>
                <li>You may paste responses during testing.</li>
              </ul>
              <small>Session: {sessionId.slice(0, 12)}</small>
              <button type="button" className="ps-btn primary" onClick={startInterview}>
                Start Interview
              </button>
            </div>
            {submitError ? <p className="ps-error">{submitError}</p> : null}
          </>
        ) : (
          <form onSubmit={handleSubmit} className="ps-card">
            <span className="ps-tag">
              {currentQuestion.category} • Question {activeIndex + 1} of {QUESTION_BANK.length}
            </span>
            <h2 className="ps-q">{currentQuestion.prompt}</h2>
            <p className="ps-hint">{pickPromptVariant(activeIndex)}</p>
            <textarea
              ref={textAreaRef}
              className="ps-answer"
              value={answers[activeIndex]}
              onChange={(event) => updateAnswer(event.target.value)}
              placeholder="Write your response with specific context, your decisions, and outcomes."
              required
            />

            <div className="ps-meta">
              <span>Words: {currentWordCount}</span>
              <span>Time on this question: {Math.floor(questionElapsed[activeIndex])}s</span>
              <span>Total elapsed: {totalElapsedSec}s</span>
              <span>{new Date(localTime).toLocaleTimeString()}</span>
            </div>

            <div className="ps-meta">
              <span>Tab switches: {tabSwitches}</span>
              <span>Paste attempts: {pasteAttempts}</span>
            </div>

            {notice ? <p className="ps-warning">{notice}</p> : null}
            {submitError ? <p className="ps-error">{submitError}</p> : null}

            <div className="ps-actions">
              <button type="button" className="ps-btn ghost" onClick={handleBack} disabled={activeIndex === 0}>
                Previous
              </button>
              {activeIndex < QUESTION_BANK.length - 1 ? (
                <button type="button" className="ps-btn primary" onClick={handleNext}>
                  Save and Next
                </button>
              ) : (
                <button type="submit" className="ps-btn primary" disabled={isSubmitting}>
                  {isSubmitting ? "Submitting..." : "Submit Pre-Screening"}
                </button>
              )}
            </div>
          </form>
        )}
      </section>
    </main>
  );
};

export default PreScreeningPage;
