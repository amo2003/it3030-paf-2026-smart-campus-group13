import Layout from "./Layout";

/* ── Access Denied ── */
export const AccessDenied = () => (
  <Layout>
    <div style={{
      display: "flex", flexDirection: "column", alignItems: "center",
      justifyContent: "center", minHeight: "60vh", textAlign: "center",
    }}>
      <div style={{
        width: 64, height: 64, borderRadius: 18, background: "rgba(239,68,68,.1)",
        display: "flex", alignItems: "center", justifyContent: "center", marginBottom: 20,
      }}>
        <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#ef4444" strokeWidth="1.8">
          <circle cx="12" cy="12" r="10" />
          <line x1="12" y1="8" x2="12" y2="12" />
          <circle cx="12" cy="16" r=".8" fill="#ef4444" />
        </svg>
      </div>
      <h2 style={{ fontSize: 20, fontWeight: 700, color: "var(--text)", marginBottom: 8 }}>Access denied</h2>
      <p style={{ fontSize: 14, color: "var(--text3)", maxWidth: 320, lineHeight: 1.6 }}>
        You don't have permission to view this page. Contact an administrator to request access.
      </p>
    </div>
  </Layout>
);

/* ── Protected wrapper ── */
const ProtectedAdminPage = ({ children }) => {
  const currentUser = JSON.parse(localStorage.getItem("currentUser") || "null");
  return currentUser?.role === "ADMIN" ? children : <AccessDenied />;
};

export default ProtectedAdminPage;