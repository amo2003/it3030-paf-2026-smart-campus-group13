import { useEffect, useState } from "react";
import { useNavigate }         from "react-router-dom";
import axios                   from "axios";
import Layout                  from "../components/Layout";
import { getUnreadCount }      from "../services/notificationService";
import { addLocalNotification } from "../services/localNotifications";

/* Stat card */
const StatCard = ({ label, value, hint, iconBg, iconColor, icon }) => (
  <div style={{
    background: "var(--navy3)", border: "1px solid var(--border)",
    borderRadius: 12, padding: "18px 20px",
  }}>
    <div style={{
      width: 36, height: 36, borderRadius: 10,
      background: iconBg, display: "flex", alignItems: "center", justifyContent: "center", marginBottom: 12,
    }}>
      <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke={iconColor} strokeWidth="1.5">{icon}</svg>
    </div>
    <div style={{ fontSize: 26, fontWeight: 700, color: "var(--text)", letterSpacing: "-.5px" }}>{value}</div>
    <div style={{ fontSize: 12, color: "var(--text3)", marginTop: 4 }}>{label}</div>
    <div style={{ fontSize: 11, color: iconColor, marginTop: 4, fontWeight: 600 }}>{hint}</div>
  </div>
);

const LoginSuccessPage = () => {
  const [user, setUser]               = useState(null);
  const [loading, setLoading]         = useState(true);
  const [unreadCount, setUnreadCount] = useState(0);
  const navigate                      = useNavigate();

  useEffect(() => {
    // If hardcoded admin is logged in, use localStorage directly — no backend call
    const stored = localStorage.getItem("currentUser");
    if (stored) {
      const parsed = JSON.parse(stored);
      // hardcoded admin has id:0 — skip backend fetch
      if (parsed.id === 0) {
        setUser(parsed);
        setLoading(false);
        return;
      }
    }

    const fetchUser = async () => {
      try {
        const res = await axios.get("http://localhost:8080/api/module4/auth/me", { withCredentials: true });
        localStorage.removeItem("currentUser");
        localStorage.removeItem("myTicketsName");
        sessionStorage.clear();
        localStorage.setItem("currentUser", JSON.stringify(res.data));
        setUser(res.data);
        addLocalNotification('LOGIN', 'Signed In', `Welcome back, ${res.data.name}! Signed in via Google.`);
        if (res.data?.id) {
          const unreadRes = await getUnreadCount(res.data.id);
          setUnreadCount(unreadRes.data);
        }
        navigate("/");
      } catch {
        // Only redirect to login if no stored user at all
        const stored2 = localStorage.getItem("currentUser");
        if (!stored2) navigate("/login");
        else { setUser(JSON.parse(stored2)); }
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, [navigate]);

  const initials = user?.name
    ? user.name.split(" ").map(w => w[0]).slice(0, 2).join("").toUpperCase()
    : "?";

  const roleConfig = {
    ADMIN:      { cls: "admin",      label: "Administrator" },
    USER:       { cls: "user",       label: "User"          },
    TECHNICIAN: { cls: "tech",       label: "Technician"    },
  };
  const rc = roleConfig[user?.role] || roleConfig.USER;

  return (
    <Layout unreadCount={unreadCount}>
      <div style={{ maxWidth: 620 }}>
        {/* Header */}
        <div style={{ marginBottom: 24 }}>
          <h2 className="m4-page-title">My Profile</h2>
          <p className="m4-page-sub">
            {user?.id === 0 ? "Signed in as Administrator" : "Signed in via Google OAuth 2.0"}
          </p>
        </div>

        {loading ? (
          <div style={{ padding: 48, textAlign: "center", color: "var(--text3)" }}>Loading…</div>
        ) : (
          <>
            {/* Profile hero card */}
            <div style={{
              background: "var(--card)", border: "1px solid var(--border)",
              borderRadius: 16, padding: "24px 28px", marginBottom: 16,
              display: "flex", alignItems: "center", gap: 20,
            }}>
              <div style={{
                width: 64, height: 64, borderRadius: "50%", background: "var(--amber)",
                display: "flex", alignItems: "center", justifyContent: "center",
                fontSize: 24, fontWeight: 700, color: "#000", flexShrink: 0,
                border: "3px solid rgba(245,158,11,0.25)",
              }}>{initials}</div>
              <div>
                <div style={{ fontSize: 18, fontWeight: 700, color: "var(--text)", letterSpacing: "-.3px" }}>
                  {user?.name}
                </div>
                <div style={{ fontSize: 13, color: "var(--text3)", marginTop: 4 }}>{user?.email}</div>
                <span className={`role-pill ${rc.cls}`} style={{ marginTop: 8, display: "inline-flex" }}>
                  {rc.label}
                </span>
              </div>
            </div>

            {/* Stats */}
            <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 12 }}>
              <StatCard
                label="Total bookings" value="12" hint="3 pending approval"
                iconBg="rgba(245,158,11,.12)" iconColor="var(--amber)"
                icon={<><rect x="2" y="3" width="12" height="11" rx="1.5"/><line x1="5" y1="1.5" x2="5" y2="4.5"/><line x1="11" y1="1.5" x2="11" y2="4.5"/><line x1="2" y1="7" x2="14" y2="7"/></>}
              />
              <StatCard
                label="Incident tickets" value="5" hint="1 in progress"
                iconBg="rgba(59,130,246,.1)" iconColor="var(--blue)"
                icon={<><circle cx="8" cy="8" r="6"/><line x1="8" y1="5" x2="8" y2="8.5"/><circle cx="8" cy="11" r=".6" fill="var(--blue)"/></>}
              />
              <StatCard
                label="Unread alerts"
                value={unreadCount}
                hint={unreadCount > 0 ? "Latest notifications" : "No unread alerts"}
                iconBg="rgba(239,68,68,.1)"
                iconColor="var(--red)"
                icon={<><path d="M8 2a5 5 0 00-5 5v2.5L1.5 11h13L13 9.5V7a5 5 0 00-5-5z"/><path d="M6.5 13a1.5 1.5 0 003 0"/></>}
              />
            </div>
          </>
        )}
      </div>
    </Layout>
  );
};

export default LoginSuccessPage;