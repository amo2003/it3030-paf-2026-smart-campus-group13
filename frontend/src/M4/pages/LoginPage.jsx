import "../styles/theme.css";

const LoginPage = () => {
  const handleLogin = () => {
    window.location.href = "http://localhost:8080/oauth2/authorization/google";
  };

  return (
    <div style={{
      minHeight: "100vh",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      background: "var(--navy)",
      position: "relative",
      overflow: "hidden",
    }}>
      {/* Ambient glow */}
      <div style={{
        position: "absolute", width: 500, height: 500, borderRadius: "50%",
        background: "radial-gradient(circle, rgba(245,158,11,0.07) 0%, transparent 70%)",
        top: "50%", left: "50%", transform: "translate(-50%, -50%)", pointerEvents: "none",
      }} />
      <div style={{
        position: "absolute", width: 300, height: 300, borderRadius: "50%",
        background: "radial-gradient(circle, rgba(59,130,246,0.05) 0%, transparent 70%)",
        top: "20%", right: "15%", pointerEvents: "none",
      }} />

      {/* Card */}
      <div style={{
        background: "var(--navy2)",
        border: "1px solid var(--border2)",
        borderRadius: 20,
        padding: "48px 44px",
        width: 360,
        textAlign: "center",
        position: "relative",
        zIndex: 1,
      }}>
        {/* Logo mark */}
        <div style={{
          width: 54, height: 54, background: "var(--amber)", borderRadius: 16,
          margin: "0 auto 24px", display: "flex", alignItems: "center", justifyContent: "center",
        }}>
          <svg width="26" height="26" viewBox="0 0 16 16" fill="none">
            <rect x="2" y="2" width="5" height="5" rx="1"   fill="#000" />
            <rect x="9" y="2" width="5" height="5" rx="1"   fill="#000" opacity=".5" />
            <rect x="2" y="9" width="5" height="5" rx="1"   fill="#000" opacity=".5" />
            <rect x="9" y="9" width="5" height="5" rx="1"   fill="#000" />
          </svg>
        </div>

        <h1 style={{ fontSize: 22, fontWeight: 700, color: "var(--text)", letterSpacing: "-.5px", marginBottom: 8 }}>
          Smart Campus
        </h1>
        <p style={{ fontSize: 13, color: "var(--text3)", lineHeight: 1.7, marginBottom: 32 }}>
          Sign in to manage bookings, facilities,<br />and maintenance across campus.
        </p>

        {/* Google button */}
        <button
          onClick={handleLogin}
          style={{
            width: "100%", padding: "13px 16px", borderRadius: 11,
            border: "1px solid var(--border2)", background: "var(--navy3)",
            cursor: "pointer", fontSize: 14, fontWeight: 600, color: "var(--text)",
            display: "flex", alignItems: "center", justifyContent: "center", gap: 11,
            fontFamily: "inherit", transition: "all .15s", letterSpacing: "-.1px",
          }}
          onMouseEnter={e => { e.currentTarget.style.background = "var(--navy4)"; e.currentTarget.style.borderColor = "rgba(255,255,255,.18)"; }}
          onMouseLeave={e => { e.currentTarget.style.background = "var(--navy3)"; e.currentTarget.style.borderColor = "var(--border2)"; }}
        >
          <svg width="18" height="18" viewBox="0 0 18 18">
            <path d="M17.64 9.2c0-.637-.057-1.251-.164-1.84H9v3.481h4.844c-.209 1.125-.843 2.078-1.796 2.717v2.258h2.908c1.702-1.567 2.684-3.874 2.684-6.615z" fill="#4285F4"/>
            <path d="M9 18c2.43 0 4.467-.806 5.956-2.184l-2.909-2.258c-.806.54-1.836.86-3.047.86-2.344 0-4.328-1.584-5.036-3.711H.957v2.332C2.438 15.983 5.482 18 9 18z" fill="#34A853"/>
            <path d="M3.964 10.707A5.41 5.41 0 013.682 9c0-.593.102-1.17.282-1.707V4.961H.957A9.006 9.006 0 000 9c0 1.452.348 2.827.957 4.039l3.007-2.332z" fill="#FBBC05"/>
            <path d="M9 3.58c1.321 0 2.508.454 3.44 1.345l2.582-2.58C13.462.891 11.426 0 9 0 5.482 0 2.438 2.017.957 4.961L3.964 6.293C4.672 4.166 6.656 3.58 9 3.58z" fill="#EA4335"/>
          </svg>
          Continue with Google
        </button>

        <p style={{ fontSize: 11, color: "var(--text3)", marginTop: 22, lineHeight: 1.5 }}>
          Protected by OAuth 2.0<br />SLIIT University · Faculty of Computing
        </p>
      </div>
    </div>
  );
};

export default LoginPage;