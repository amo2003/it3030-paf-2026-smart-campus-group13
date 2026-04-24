import { useNavigate, useLocation } from "react-router-dom";
import "../styles/theme.css";

/* ── Sidebar nav item ── */
const NavItem = ({ to, label, icon, badge, onClick }) => {
  const navigate  = useNavigate();
  const { pathname } = useLocation();
  const active = pathname === to;

  const base = {
    display: "flex", alignItems: "center", gap: 9, width: "100%",
    padding: "9px 12px", borderRadius: 9, border: "1px solid transparent",
    cursor: "pointer", fontSize: 13, fontFamily: "inherit", textAlign: "left",
    background: "transparent", color: "var(--text2)", fontWeight: 400,
    transition: "all .15s",
  };
  const activeStyle = {
    ...base,
    background: "rgba(245,158,11,.1)",
    border: "1px solid rgba(245,158,11,.2)",
    color: "var(--amber)", fontWeight: 600,
  };

  return (
    <button
      style={active ? activeStyle : base}
      onClick={() => { if (onClick) onClick(); else navigate(to); }}
      onMouseEnter={e => { if (!active) { e.currentTarget.style.background = "var(--navy3)"; e.currentTarget.style.color = "var(--text)"; } }}
      onMouseLeave={e => { if (!active) { e.currentTarget.style.background = "transparent"; e.currentTarget.style.color = "var(--text2)"; } }}
    >
      <span style={{ flexShrink: 0, display: "flex", alignItems: "center" }}>{icon}</span>
      <span style={{ flex: 1 }}>{label}</span>
      {badge > 0 && (
        <span style={{ background: "var(--red)", color: "#fff", fontSize: 10, padding: "1px 7px", borderRadius: 8, fontWeight: 700 }}>
          {badge}
        </span>
      )}
    </button>
  );
};

/* ── Icons ── */
const IconPerson = () => (
  <svg width="15" height="15" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5">
    <circle cx="8" cy="5.5" r="3" />
    <path d="M2 14c0-3.3 2.7-5.5 6-5.5s6 2.2 6 5.5" />
  </svg>
);
const IconBell = () => (
  <svg width="15" height="15" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5">
    <path d="M8 2a5 5 0 00-5 5v2.5L1.5 11h13L13 9.5V7a5 5 0 00-5-5z" />
    <path d="M6.5 13a1.5 1.5 0 003 0" />
  </svg>
);
const IconTeam = () => (
  <svg width="15" height="15" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5">
    <circle cx="5.5" cy="5" r="2.5" />
    <path d="M1 14c0-2.5 2-4.5 4.5-4.5" />
    <circle cx="11.5" cy="8.5" r="2" />
    <path d="M8.5 14c0-2 1.5-3.5 3-3.5s3 1.5 3 3.5" />
  </svg>
);
const IconLogout = () => (
  <svg width="14" height="14" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5">
    <path d="M6 14H3a1 1 0 01-1-1V3a1 1 0 011-1h3" />
    <path d="M11 11l3-3-3-3" />
    <line x1="14" y1="8" x2="6" y2="8" />
  </svg>
);

/* ── Main layout ── */
const Layout = ({ children, unreadCount = 0 }) => {
  const navigate    = useNavigate();
  const currentUser = JSON.parse(localStorage.getItem("currentUser") || "null");

  const initials = currentUser?.name
    ? currentUser.name.split(" ").map(w => w[0]).slice(0, 2).join("").toUpperCase()
    : "?";

  const handleLogout = () => {
    // Clear ALL user-related data so next login starts fresh
    localStorage.removeItem("currentUser");
    localStorage.removeItem("myTicketsName");
    sessionStorage.clear();
    navigate("/login");
  };

  return (
    <div style={{ display: "flex", minHeight: "100vh", background: "var(--navy2)" }}>

      {/* ─── Sidebar ─── */}
      <aside style={{
        width: 224, background: "var(--navy)", borderRight: "1px solid var(--border)",
        display: "flex", flexDirection: "column", padding: "16px 10px",
        position: "fixed", top: 0, left: 0, height: "100vh", zIndex: 20,
      }}>

        {/* Logo */}
        <div style={{ display: "flex", alignItems: "center", gap: 10, padding: "8px 10px", marginBottom: 20 }}>
          <div style={{
            width: 34, height: 34, background: "var(--amber)", borderRadius: 10,
            display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0,
          }}>
            <svg width="17" height="17" viewBox="0 0 16 16" fill="none">
              <rect x="2" y="2" width="5" height="5" rx="1"   fill="#000" />
              <rect x="9" y="2" width="5" height="5" rx="1"   fill="#000" opacity=".5" />
              <rect x="2" y="9" width="5" height="5" rx="1"   fill="#000" opacity=".5" />
              <rect x="9" y="9" width="5" height="5" rx="1"   fill="#000" />
            </svg>
          </div>
          <div>
            <div style={{ fontSize: 13, fontWeight: 700, color: "var(--text)", letterSpacing: "-.2px" }}>Smart Campus</div>
            <div style={{ fontSize: 10, color: "var(--text3)", marginTop: 1 }}>Operations Hub</div>
          </div>
        </div>

        {/* Section */}
        <div style={{ fontSize: 10, color: "var(--text3)", textTransform: "uppercase", letterSpacing: ".8px", padding: "0 12px", marginBottom: 6 }}>
          Menu
        </div>

        {/* Nav */}
        <nav style={{ display: "flex", flexDirection: "column", gap: 2 }}>
          <NavItem to="/profile"       label="Profile"          icon={<IconPerson />} />
          <NavItem to="/notifications" label="Notifications"    icon={<IconBell />}   badge={unreadCount} />
          {currentUser?.role === "ADMIN" && (
            <NavItem to="/admin-users" label="Role management" icon={<IconTeam />} />
          )}
        </nav>

        {/* Bottom */}
        <div style={{ marginTop: "auto" }}>
          <div style={{ height: 1, background: "var(--border)", margin: "12px 0" }} />

          {/* User chip */}
          <div style={{
            display: "flex", alignItems: "center", gap: 9, padding: "9px 10px",
            background: "var(--navy2)", borderRadius: 9, border: "1px solid var(--border)", marginBottom: 4,
          }}>
            <div style={{
              width: 30, height: 30, borderRadius: "50%", background: "var(--amber)",
              display: "flex", alignItems: "center", justifyContent: "center",
              fontSize: 11, fontWeight: 700, color: "#000", flexShrink: 0,
            }}>{initials}</div>
            <div style={{ minWidth: 0 }}>
              <div style={{ fontSize: 12, fontWeight: 600, color: "var(--text)", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                {currentUser?.name || "User"}
              </div>
              <div style={{ fontSize: 10, color: "var(--text3)" }}>{currentUser?.role || "USER"}</div>
            </div>
          </div>

          {/* Logout */}
          <button
            onClick={handleLogout}
            style={{
              display: "flex", alignItems: "center", gap: 8, width: "100%",
              padding: "8px 12px", borderRadius: 9, border: "none",
              background: "transparent", cursor: "pointer",
              fontSize: 12, fontWeight: 500, color: "var(--red)",
              fontFamily: "inherit", transition: "background .15s",
            }}
            onMouseEnter={e => e.currentTarget.style.background = "rgba(239,68,68,0.08)"}
            onMouseLeave={e => e.currentTarget.style.background = "transparent"}
          >
            <IconLogout />
            Sign out
          </button>
        </div>
      </aside>

      {/* ─── Content ─── */}
      <main style={{ marginLeft: 224, flex: 1, padding: 28, minHeight: "100vh" }}>
        {children}
      </main>
    </div>
  );
};

export default Layout;