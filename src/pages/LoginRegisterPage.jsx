import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  LogIn,
  UserPlus,
  Eye,
  EyeOff,
  Chrome,
  Github,
  Apple,
} from "lucide-react";

const GetStartedPage = ({
  authMode = "signup",
  onAuthModeChange = () => {},
  onNavigate = () => {},
}) => {
  const isSignIn = authMode === "signin";
  const [showPw, setShowPw] = useState(false);
  const [showCPw, setShowCPw] = useState(false);
  const [identifier, setIdentifier] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const switchMode = () => {
    onAuthModeChange(isSignIn ? "signup" : "signin");
    setError("");
  };

  const handleSignIn = (e) => {
    e.preventDefault();
    if (identifier.trim().toLowerCase() === "admin1" && password === "123456") {
      setError("");
      onNavigate("/dashboard");
    } else {
      setError("Invalid credentials. Use admin1 / 123456.");
    }
  };

  return (
    <>
      <style>{`
  @import url('https://fonts.googleapis.com/css2?family=Manrope:wght@300;400;500;600;700;800&display=swap');
  *, *::before, *::after { box-sizing: border-box; }

  .gs-root {
    min-height: 100vh;
    background: #F9F7F7; /* Set the background color to #F9F7F7 */
    font-family: 'Manrope', sans-serif;
    color: #1a2e1e;
    padding-top: 80px;
  }

  /* ── Hero ── */
  .gs-hero {
    position: relative;
    padding: 56px 40px 48px;
    text-align: center;
    overflow: hidden;
    background: #fff;
    border-bottom: 1px solid rgba(26,46,30,0.07);
  }

  .gs-hero::before {
    content: "";
    position: absolute; inset: 0;
    background:
      radial-gradient(ellipse 65% 55% at 50% 0%, rgba(4,98,65,0.055) 0%, transparent 70%),
      radial-gradient(ellipse 35% 35% at 85% 85%, rgba(232,160,32,0.045) 0%, transparent 60%);
    pointer-events: none;
  }

  .gs-hero-eyebrow {
    display: inline-flex; align-items: center; gap: 7px;
    background: rgba(4,98,65,0.07);
    border: 1px solid rgba(4,98,65,0.15);
    border-radius: 999px; padding: 5px 14px;
    font-size: 11px; font-weight: 700; letter-spacing: 0.11em;
    text-transform: uppercase; color: #046241;
    margin-bottom: 20px; font-family: 'Manrope', sans-serif;
  }

  .gs-hero-title {
    font-family: 'Manrope', sans-serif;
    font-size: clamp(28px, 5vw, 54px);
    font-weight: 800; line-height: 1.1;
    letter-spacing: -0.03em; color: #1a2e1e;
    margin: 0 0 14px;
  }

  .gs-hero-title span { color: #E8A020; }
  .gs-hero-sub {
    font-size: clamp(13px, 1.6vw, 15px);
    color: rgba(26,46,30,0.50); max-width: 400px;
    margin: 0 auto; line-height: 1.65; font-weight: 400;
    font-family: 'Manrope', sans-serif;
  }

  /* ── Body ── */
  .gs-body {
    max-width: 500px;
    margin: 0 auto;
    padding: 36px 20px 80px;
  }

  /* ── Card ── */
  .gs-form-card {
    background: #fff;
    border: 1px solid rgba(26,46,30,0.085);
    border-radius: 22px;
    padding: 32px 30px;
    box-shadow: 0 2px 18px rgba(26,46,30,0.05);
  }

  /* ── Tabs ── */
  .gs-tabs {
    display: flex;
    background: #f7f7f5;
    border: 1px solid rgba(26,46,30,0.09);
    border-radius: 12px; padding: 4px;
    margin-bottom: 24px;
  }

  .gs-tab {
    flex: 1; padding: 9px 12px; border-radius: 9px;
    border: none; cursor: pointer;
    font-family: 'Manrope', sans-serif;
    font-size: 12.5px; font-weight: 700;
    display: flex; align-items: center; justify-content: center; gap: 6px;
    transition: all 0.2s ease;
  }

  .gs-tab.active { background: #fff; color: #1a2e1e; box-shadow: 0 1px 6px rgba(26,46,30,0.1); }
  .gs-tab.inactive { background: transparent; color: rgba(26,46,30,0.38); }
  .gs-tab.inactive:hover { color: rgba(26,46,30,0.65); }

  /* ── Socials ── */
  .gs-socials { display: flex; gap: 9px; margin-bottom: 4px; }
  .gs-social-btn {
    flex: 1; padding: 10px 8px;
    background: #fff; border: 1px solid rgba(26,46,30,0.085);
    border-radius: 10px; cursor: pointer;
    display: flex; align-items: center; justify-content: center; gap: 7px;
    color: rgba(26,46,30,0.55); font-size: 12px; font-weight: 600;
    font-family: 'Manrope', sans-serif;
    box-shadow: 0 1px 3px rgba(26,46,30,0.04);
    transition: all 0.18s ease;
  }

  .gs-social-btn:hover {
    background: #f7f7f5; border-color: rgba(26,46,30,0.20);
    color: #1a2e1e; transform: translateY(-1px);
    box-shadow: 0 4px 12px rgba(26,46,30,0.08);
  }

  /* ── Divider ── */
  .gs-divider { display: flex; align-items: center; gap: 12px; margin: 18px 0; }
  .gs-divider-line { flex: 1; height: 1px; background: rgba(26,46,30,0.085); }
  .gs-divider-text {
    font-size: 10px; font-weight: 700; color: rgba(26,46,30,0.36);
    letter-spacing: 0.14em; text-transform: uppercase;
    font-family: 'Manrope', sans-serif; flex-shrink: 0;
  }

  /* ── Fields ── */
  .gs-field { display: flex; flex-direction: column; gap: 6px; margin-bottom: 13px; }
  .gs-label {
    font-size: 10.5px; font-weight: 700; color: rgba(26,46,30,0.45);
    letter-spacing: 0.09em; text-transform: uppercase;
    font-family: 'Manrope', sans-serif;
  }

  .gs-input {
    width: 100%; background: #f7f7f5;
    border: 1px solid rgba(26,46,30,0.11); border-radius: 11px;
    padding: 11px 14px; font-size: 13.5px;
    font-family: 'Manrope', sans-serif; font-weight: 500; color: #1a2e1e;
    outline: none;
    transition: border-color 0.18s, background 0.18s, box-shadow 0.18s;
  }

  .gs-input::placeholder { color: rgba(26,46,30,0.27); font-weight: 400; }
  .gs-input:focus { border-color: rgba(4,98,65,0.50); background: #fff; box-shadow: 0 0 0 3px rgba(4,98,65,0.07); }
  .gs-input:hover:not(:focus) { border-color: rgba(26,46,30,0.22); }

  /* ── Password field ── */
  .gs-pw-wrap { position: relative; }
  .gs-pw-wrap .gs-input { padding-right: 42px; }
  .gs-pw-toggle {
    position: absolute; right: 12px; top: 50%; transform: translateY(-50%);
    background: none; border: none; cursor: pointer;
    color: rgba(26,46,30,0.35); display: flex; align-items: center;
    transition: color 0.15s; padding: 2px;
  }

  .gs-pw-toggle:hover { color: #046241; }

  /* ── Error ── */
  .gs-error {
    background: rgba(220,38,38,0.05); border: 1px solid rgba(220,38,38,0.18);
    border-radius: 10px; padding: 10px 14px;
    font-size: 12.5px; font-weight: 600; color: #b91c1c;
    font-family: 'Manrope', sans-serif; margin-bottom: 13px;
  }

  /* ── Submit ── */
  .gs-submit {
    width: 100%;
    display: flex; align-items: center; justify-content: center; gap: 8px;
    padding: 13px; border-radius: 999px;
    font-weight: 700; font-size: 14px; font-family: 'Manrope', sans-serif;
    letter-spacing: 0.01em; cursor: pointer; border: none;
    background: #E8A020; color: #1a2e1e;
    box-shadow: 0 4px 18px rgba(232,160,32,0.26);
    transition: all 0.2s ease; margin-top: 4px;
  }

  .gs-submit:hover { background: #f0b030; box-shadow: 0 6px 24px rgba(232,160,32,0.38); transform: translateY(-1px); }
  .gs-submit:disabled { opacity: 0.5; cursor: not-allowed; transform: none; }

  /* ── Footer link ── */
  .gs-footer-text { font-size: 13px; color: rgba(26,46,30,0.50); text-align: center; margin-top: 20px; font-family: 'Manrope', sans-serif; }
  .gs-link { background: none; border: none; cursor: pointer; font-family: 'Manrope', sans-serif; font-size: 13px; font-weight: 700; color: #046241; padding: 0; transition: color 0.18s; }
  .gs-link:hover { color: #024d33; }
  .gs-forgot { display: flex; justify-content: flex-end; margin-top: 7px; }
  .gs-forgot a { font-size: 12px; font-weight: 600; color: #046241; text-decoration: none; font-family: 'Manrope', sans-serif; }
  .gs-forgot a:hover { color: #024d33; }

  /* ── Responsive ── */
  @media (max-width: 600px) {
    .gs-root { padding-top: 64px; }
    .gs-hero { padding: 40px 20px 36px; }
    .gs-body { padding: 24px 14px 60px; }
    .gs-form-card { padding: 24px 18px; border-radius: 18px; }
  }
`}</style>

      <div className="gs-root">
        {/* ── Hero ── */}
        <motion.div
          className="gs-hero"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
        >
          <div className="gs-hero-eyebrow">
            {isSignIn ? <LogIn size={11} /> : <UserPlus size={11} />}
            {isSignIn ? "Welcome Back" : "Get Started"}
          </div>
          <h1 className="gs-hero-title">
            {isSignIn ? (
              <>
                Sign in to <span>Lifewood</span>
              </>
            ) : (
              <>
                Join the <span>AI Revolution</span>
              </>
            )}
          </h1>
          <p className="gs-hero-sub">
            {isSignIn
              ? "Enter your credentials to access your Lifewood account and continue your work."
              : "To be the global champion in AI data solutions, igniting a culture of innovation that enriches lives worldwide."}
          </p>
        </motion.div>

        {/* ── Body ── */}
        <div className="gs-body">
          <motion.div
            className="gs-form-card"
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{
              duration: 0.5,
              delay: 0.12,
              ease: [0.22, 1, 0.36, 1],
            }}
          >
            {/* Tab toggle */}
            <div className="gs-tabs">
              <button
                className={`gs-tab ${isSignIn ? "active" : "inactive"}`}
                onClick={() => {
                  onAuthModeChange("signin");
                  setError("");
                }}
              >
                <LogIn size={13} /> Sign In
              </button>
              <button
                className={`gs-tab ${!isSignIn ? "active" : "inactive"}`}
                onClick={() => {
                  onAuthModeChange("signup");
                  setError("");
                }}
              >
                <UserPlus size={13} /> Create Account
              </button>
            </div>

            {/* Forms */}
            <AnimatePresence mode="wait">
              {isSignIn ? (
                <motion.form
                  key="signin"
                  onSubmit={handleSignIn}
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -6 }}
                  transition={{ duration: 0.25 }}
                >
                  <div className="gs-field">
                    <label className="gs-label">Email or Username</label>
                    <input
                      className="gs-input"
                      type="text"
                      placeholder="Enter address"
                      value={identifier}
                      onChange={(e) => {
                        setIdentifier(e.target.value);
                        if (error) setError("");
                      }}
                      autoComplete="username"
                    />
                  </div>

                  <div className="gs-field">
                    <label className="gs-label">Password</label>
                    <div className="gs-pw-wrap">
                      <input
                        className="gs-input"
                        type={showPw ? "text" : "password"}
                        placeholder="Enter your password"
                        value={password}
                        onChange={(e) => {
                          setPassword(e.target.value);
                          if (error) setError("");
                        }}
                        autoComplete="current-password"
                      />
                      <button
                        type="button"
                        className="gs-pw-toggle"
                        onClick={() => setShowPw((p) => !p)}
                      >
                        {showPw ? <EyeOff size={14} /> : <Eye size={14} />}
                      </button>
                    </div>
                    <div className="gs-forgot">
                      <a href="#">Forgot Password?</a>
                    </div>
                  </div>
                  <div className="gs-divider">
                    <div className="gs-divider-line" />
                    <span className="gs-divider-text">
                      or continue with email
                    </span>
                    <div className="gs-divider-line" />
                  </div>
                  {/* Socials */}
                  <div className="gs-socials">
                    {[
                      { icon: <Chrome size={14} />, label: "Google" },
                      { icon: <Apple size={14} />, label: "Apple" },
                      { icon: <Github size={14} />, label: "GitHub" },
                    ].map(({ icon, label }) => (
                      <button
                        key={label}
                        className="gs-social-btn"
                        type="button"
                      >
                        {icon}
                        {label}
                      </button>
                    ))}
                  </div>
                  {error && <div className="gs-error">{error}</div>}

                  <button
                    className="gs-submit"
                    type="submit"
                    disabled={!identifier || !password}
                    style={{ marginTop: "25px" }} // Apply margin here
                  >
                    <LogIn size={14} strokeWidth={2.5} /> Login Account
                  </button>
                </motion.form>
              ) : (
                <motion.form
                  key="signup"
                  onSubmit={(e) => e.preventDefault()}
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -6 }}
                  transition={{ duration: 0.25 }}
                >
                  <div className="gs-field">
                    <label className="gs-label">Username</label>
                    <input
                      className="gs-input"
                      type="text"
                      placeholder="Choose a username"
                      autoComplete="username"
                    />
                  </div>
                  <div className="gs-field">
                    <label className="gs-label">Email Address</label>
                    <input
                      className="gs-input"
                      type="email"
                      placeholder="you@example.com"
                      autoComplete="email"
                    />
                  </div>
                  <div className="gs-field">
                    <label className="gs-label">Password</label>
                    <div className="gs-pw-wrap">
                      <input
                        className="gs-input"
                        type={showPw ? "text" : "password"}
                        placeholder="Create a password"
                        autoComplete="new-password"
                      />
                      <button
                        type="button"
                        className="gs-pw-toggle"
                        onClick={() => setShowPw((p) => !p)}
                      >
                        {showPw ? <EyeOff size={14} /> : <Eye size={14} />}
                      </button>
                    </div>
                  </div>
                  <div className="gs-field">
                    <label className="gs-label">Confirm Password</label>
                    <div className="gs-pw-wrap">
                      <input
                        className="gs-input"
                        type={showCPw ? "text" : "password"}
                        placeholder="Repeat your password"
                        autoComplete="new-password"
                      />
                      <button
                        type="button"
                        className="gs-pw-toggle"
                        onClick={() => setShowCPw((p) => !p)}
                      >
                        {showCPw ? <EyeOff size={14} /> : <Eye size={14} />}
                      </button>
                    </div>
                  </div>

                  <div className="gs-divider">
                    <div className="gs-divider-line" />
                    <span className="gs-divider-text">
                      or continue with email
                    </span>
                    <div className="gs-divider-line" />
                  </div>
                  {/* Socials */}
                  <div className="gs-socials">
                    {[
                      { icon: <Chrome size={14} />, label: "Google" },
                      { icon: <Apple size={14} />, label: "Apple" },
                      { icon: <Github size={14} />, label: "GitHub" },
                    ].map(({ icon, label }) => (
                      <button
                        key={label}
                        className="gs-social-btn"
                        type="button"
                      >
                        {icon}
                        {label}
                      </button>
                    ))}
                  </div>

                  <p
                    style={{
                      fontSize: 10.5,
                      color: "rgba(26,46,30,0.40)",
                      lineHeight: 1.7,
                      marginTop: 20,
                      marginBottom: 8,
                      fontFamily: "'Manrope', sans-serif",
                    }}
                  >
                    By creating an account you agree to our{" "}
                    <a
                      href="#"
                      style={{
                        color: "#046241",
                        fontWeight: 600,
                        textDecoration: "none",
                      }}
                    >
                      Terms of Service
                    </a>{" "}
                    and{" "}
                    <a
                      href="#"
                      style={{
                        color: "#046241",
                        fontWeight: 600,
                        textDecoration: "none",
                      }}
                    >
                      Privacy Policy
                    </a>
                    .
                  </p>

                  <button
                    className="gs-submit"
                    type="submit"
                    style={{ marginTop: "20px" }}
                  >
                    <UserPlus size={14} strokeWidth={2.5} /> Create Account
                  </button>
                </motion.form>
              )}
            </AnimatePresence>

            <p className="gs-footer-text">
              {isSignIn ? "No account? " : "Already a member? "}
              <button className="gs-link" type="button" onClick={switchMode}>
                {isSignIn ? "Create one →" : "Sign in →"}
              </button>
            </p>
          </motion.div>
        </div>
      </div>
    </>
  );
};

export default GetStartedPage;
