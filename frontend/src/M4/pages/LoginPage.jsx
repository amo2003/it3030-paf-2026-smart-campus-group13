import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { addLocalNotification } from "../services/localNotifications";
import "./LoginPage.css";

const ADMIN_EMAIL    = "admin@gmail.com";
const ADMIN_PASSWORD = "admin";
const ADMIN_USER     = { id: 0, name: "Administrator", email: ADMIN_EMAIL, role: "ADMIN" };

const LoginPage = () => {
  const navigate = useNavigate();
  const [email, setEmail]       = useState("");
  const [password, setPassword] = useState("");
  const [error, setError]       = useState("");
  const [loading, setLoading]   = useState(false);

  useEffect(() => {
    localStorage.removeItem("currentUser");
    localStorage.removeItem("myTicketsName");
    sessionStorage.clear();
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();
    setError(""); setLoading(true);
    setTimeout(() => {
      if (email.trim() === ADMIN_EMAIL && password === ADMIN_PASSWORD) {
        localStorage.setItem("currentUser", JSON.stringify(ADMIN_USER));
        addLocalNotification("LOGIN", "Admin Signed In", `Administrator signed in at ${new Date().toLocaleTimeString()}`);
        navigate("/");
      } else {
        setError("use_google");
      }
      setLoading(false);
    }, 350);
  };

  const handleGoogle = () => {
    window.location.href = "http://localhost:8080/oauth2/authorization/google";
  };

  return (
    <div className="login-page">

      {/* Left panel — branding */}
      <div className="login-left">
        <div className="login-left-inner">
          <div className="login-brand-icon">
            <svg width="32" height="32" viewBox="0 0 16 16" fill="none">
              <rect x="2" y="2" width="5" height="5" rx="1.2" fill="#fff" />
              <rect x="9" y="2" width="5" height="5" rx="1.2" fill="#fff" opacity=".6" />
              <rect x="2" y="9" width="5" height="5" rx="1.2" fill="#fff" opacity=".6" />
              <rect x="9" y="9" width="5" height="5" rx="1.2" fill="#fff" />
            </svg>
          </div>
          <h1 className="login-brand-title">Smart Campus</h1>
          <p className="login-brand-sub">Operations Hub</p>

          <div className="login-features">
            {[
              { icon: "📅", text: "Book campus resources instantly" },
              { icon: "🎫", text: "Report and track incidents" },
              { icon: "📊", text: "Real-time analytics & insights" },
              { icon: "🔔", text: "Instant notifications & updates" },
            ].map(f => (
              <div key={f.text} className="login-feature-row">
                <span className="login-feature-icon">{f.icon}</span>
                <span>{f.text}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Right panel — form */}
      <div className="login-right">
        <div className="login-card">

          <div className="login-card-header">
            <h2>Welcome back</h2>
            <p>Sign in to your Smart Campus account</p>
          </div>

          <form onSubmit={handleSubmit} className="login-form">

            <div className="login-field">
              <label>Email address</label>
              <input
                type="email"
                placeholder="you@example.com"
                value={email}
                onChange={e => { setEmail(e.target.value); setError(""); }}
                required
                className="login-input"
              />
            </div>

            <div className="login-field">
              <label>Password</label>
              <input
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={e => { setPassword(e.target.value); setError(""); }}
                required
                className="login-input"
              />
            </div>

            {/* Error */}
            {error === "use_google" && (
              <div className="login-tip-box">
                <span className="login-tip-icon">💡</span>
                <div>
                  <div className="login-tip-title">Use Google Login</div>
                  <div className="login-tip-msg">
                    These credentials don't match. Please use the <strong>Continue with Google</strong> button below to sign in with your university account.
                  </div>
                </div>
              </div>
            )}

            <button type="submit" disabled={loading} className="login-submit-btn">
              {loading ? "Signing in..." : "Sign In"}
            </button>

            {/* Divider */}
            <div className="login-divider">
              <span />
              <p>or continue with</p>
              <span />
            </div>

            {/* Google */}
            <button type="button" onClick={handleGoogle} className="login-google-btn">
              <svg width="18" height="18" viewBox="0 0 18 18">
                <path d="M17.64 9.2c0-.637-.057-1.251-.164-1.84H9v3.481h4.844c-.209 1.125-.843 2.078-1.796 2.717v2.258h2.908c1.702-1.567 2.684-3.874 2.684-6.615z" fill="#4285F4"/>
                <path d="M9 18c2.43 0 4.467-.806 5.956-2.184l-2.909-2.258c-.806.54-1.836.86-3.047.86-2.344 0-4.328-1.584-5.036-3.711H.957v2.332C2.438 15.983 5.482 18 9 18z" fill="#34A853"/>
                <path d="M3.964 10.707A5.41 5.41 0 013.682 9c0-.593.102-1.17.282-1.707V4.961H.957A9.006 9.006 0 000 9c0 1.452.348 2.827.957 4.039l3.007-2.332z" fill="#FBBC05"/>
                <path d="M9 3.58c1.321 0 2.508.454 3.44 1.345l2.582-2.58C13.462.891 11.426 0 9 0 5.482 0 2.438 2.017.957 4.961L3.964 6.293C4.672 4.166 6.656 3.58 9 3.58z" fill="#EA4335"/>
              </svg>
              Continue with Google
            </button>

          </form>

          <p className="login-footer-note">
            Protected by OAuth 2.0 · SLIIT University · Faculty of Computing
          </p>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
