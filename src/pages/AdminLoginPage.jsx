import { useState } from "react";
import { Lock, Mail } from "lucide-react";

const allowedAdminRoles = new Set(["super_admin", "hr_admin", "sales_client_manager"]);

const AdminLoginPage = ({ onNavigate = () => {} }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const apiBaseUrl = import.meta.env.VITE_API_BASE_URL || "";

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (!email || !password) return;
    setIsSubmitting(true);
    setError("");

    try {
      const response = await fetch(`${apiBaseUrl}/api/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: email.trim(), password }),
      });

      const payload = await response.json().catch(() => ({}));
      if (!response.ok) {
        setError(payload?.error || "Login failed. Please try again.");
        return;
      }

      const accessToken = payload?.session?.access_token || "";
      const role = payload?.role || "user";

      if (!accessToken) {
        setError("Login failed. Please try again.");
        return;
      }

      localStorage.setItem("lwAuthToken", accessToken);
      localStorage.setItem("lwAuthRole", role);
      localStorage.setItem("lwAuthUser", JSON.stringify(payload?.user || {}));
      sessionStorage.removeItem("lwAuthToken");
      sessionStorage.removeItem("lwAuthRole");
      sessionStorage.removeItem("lwAuthUser");

      if (allowedAdminRoles.has(role)) {
        onNavigate("/dashboard");
      } else {
        sessionStorage.removeItem("lwAuthToken");
        sessionStorage.removeItem("lwAuthRole");
        sessionStorage.removeItem("lwAuthUser");
        localStorage.removeItem("lwAuthToken");
        localStorage.removeItem("lwAuthRole");
        localStorage.removeItem("lwAuthUser");
        setError("Access restricted. Please contact an administrator.");
      }
    } catch (err) {
      console.error(err);
      setError("Login failed. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      <style>{`
  @import url('https://fonts.googleapis.com/css2?family=Manrope:wght@300;400;500;600;700;800&display=swap');
  *, *::before, *::after { box-sizing: border-box; }

  .admin-login-root {
    min-height: 100vh;
    display: grid;
    place-items: center;
    padding: 32px 16px;
    background:
      radial-gradient(circle at 20% 20%, rgba(4,98,65,0.07), transparent 40%),
      radial-gradient(circle at 80% 25%, rgba(232,160,32,0.08), transparent 45%),
      #f2f5f7;
    font-family: 'Manrope', sans-serif;
    color: #0f2a1a;
  }

  .admin-login-card {
    width: min(420px, 94vw);
    background: #fff;
    border-radius: 18px;
    padding: 36px 34px 28px;
    box-shadow: 0 18px 50px rgba(15, 42, 26, 0.14);
    border: 1px solid rgba(15, 42, 26, 0.08);
  }

  .admin-login-brand {
    display: grid;
    justify-items: center;
    gap: 6px;
    margin-bottom: 26px;
  }

  .admin-login-brand img {
    width: 170px;
    height: auto;
  }

  .admin-login-sub {
    font-size: 11px;
    font-weight: 700;
    letter-spacing: 0.12em;
    color: #e39b1d;
    text-transform: uppercase;
  }

  .admin-login-field {
    display: flex;
    flex-direction: column;
    gap: 8px;
    margin-bottom: 14px;
  }

  .admin-login-input {
    width: 100%;
    background: #f9fafb;
    border: 1px solid rgba(15, 42, 26, 0.12);
    border-radius: 12px;
    padding: 12px 14px 12px 38px;
    font-size: 13.5px;
    font-weight: 500;
    outline: none;
    transition: border-color 0.2s ease, box-shadow 0.2s ease, background 0.2s ease;
  }

  .admin-login-input:focus {
    border-color: rgba(4,98,65,0.5);
    box-shadow: 0 0 0 3px rgba(4,98,65,0.08);
    background: #fff;
  }

  .admin-login-input-wrap {
    position: relative;
  }

  .admin-login-icon {
    position: absolute;
    left: 12px;
    top: 50%;
    transform: translateY(-50%);
    color: rgba(15, 42, 26, 0.45);
  }

  .admin-login-forgot {
    color: rgba(15, 42, 26, 0.6);
    text-decoration: none;
    font-weight: 600;
  }

  .admin-login-meta {
    display: flex;
    justify-content: flex-end;
    margin: 10px 0 18px;
    font-size: 12px;
  }

  .admin-login-error {
    background: rgba(220,38,38,0.08);
    border: 1px solid rgba(220,38,38,0.18);
    color: #b91c1c;
    font-size: 12.5px;
    font-weight: 600;
    padding: 10px 12px;
    border-radius: 10px;
    margin-bottom: 12px;
  }

  .admin-login-submit {
    width: 100%;
    border: none;
    border-radius: 12px;
    padding: 12px;
    font-size: 14px;
    font-weight: 700;
    color: #fff;
    background: #046241;
    cursor: pointer;
    transition: transform 0.2s ease, box-shadow 0.2s ease, background 0.2s ease;
  }

  .admin-login-submit:hover {
    background: #035237;
    transform: translateY(-1px);
    box-shadow: 0 6px 18px rgba(4, 98, 65, 0.25);
  }

  .admin-login-submit:disabled {
    opacity: 0.6;
    cursor: not-allowed;
    transform: none;
    box-shadow: none;
  }

  @media (max-width: 480px) {
    .admin-login-card {
      padding: 30px 22px 24px;
    }
  }
`}</style>

      <main className="admin-login-root">
        <section className="admin-login-card" aria-label="Admin login">
          <div className="admin-login-brand">
            <img
              src="/lifewood-logo-v2.png"
              alt="Lifewood"
              loading="lazy"
            />
            <div className="admin-login-sub">Admin Portal</div>
          </div>

          <form onSubmit={handleSubmit}>
            <div className="admin-login-field">
              <div className="admin-login-input-wrap">
                <Mail size={16} className="admin-login-icon" />
                <input
                  className="admin-login-input"
                  type="email"
                  placeholder="Email"
                  value={email}
                  onChange={(event) => {
                    setEmail(event.target.value);
                    if (error) setError("");
                  }}
                  autoComplete="username"
                />
              </div>
            </div>

            <div className="admin-login-field">
              <div className="admin-login-input-wrap">
                <Lock size={16} className="admin-login-icon" />
                <input
                  className="admin-login-input"
                  type="password"
                  placeholder="Password"
                  value={password}
                  onChange={(event) => {
                    setPassword(event.target.value);
                    if (error) setError("");
                  }}
                  autoComplete="current-password"
                />
              </div>
            </div>

            <div className="admin-login-meta">
              <a className="admin-login-forgot" href="#">
                Forgot Password
              </a>
            </div>

            {error ? <div className="admin-login-error">{error}</div> : null}

            <button
              className="admin-login-submit"
              type="submit"
              disabled={!email || !password || isSubmitting}
            >
              {isSubmitting ? "Logging in..." : "Login"}
            </button>
          </form>
        </section>
      </main>
    </>
  );
};

export default AdminLoginPage;
