import { useEffect, useState } from "react";
import Layout          from "../components/Layout";
import ProtectedAdminPage from "../components/ProtectedAdminPage";
import { getAllUsers, updateUserRole } from "../services/userService";

const ROLE_CFG = {
  ADMIN:      { cls: "admin", label: "Administrator" },
  USER:       { cls: "user",  label: "User"          },
  TECHNICIAN: { cls: "tech",  label: "Technician"    },
};

/* Avatar colours pool */
const AVA_COLORS = [
  { bg: "rgba(245,158,11,.15)", color: "#f59e0b" },
  { bg: "rgba(16,185,129,.12)", color: "#10b981" },
  { bg: "rgba(59,130,246,.12)", color: "#3b82f6" },
  { bg: "rgba(139,92,246,.12)", color: "#8b5cf6" },
  { bg: "rgba(239,68,68,.1)",   color: "#ef4444" },
];
const getAvaColor = (idx) => AVA_COLORS[idx % AVA_COLORS.length];

const initials = (name) =>
  name?.split(" ").map(w => w[0]).slice(0, 2).join("").toUpperCase() || "?";

const AdminUsersPage = () => {
  const [users, setUsers]   = useState([]);
  const [query, setQuery]   = useState("");
  const [saving, setSaving] = useState(null);

  const fetchUsers = async () => {
    try {
      const res = await getAllUsers();
      setUsers(res.data);
    } catch (e) { console.error(e); }
  };

  useEffect(() => { fetchUsers(); }, []);

  const handleRoleChange = async (id, newRole) => {
    setSaving(id);
    try {
      await updateUserRole(id, newRole);
      await fetchUsers();
    } catch (e) { console.error(e); }
    finally { setSaving(null); }
  };

  const filtered = users.filter(u =>
    u.name?.toLowerCase().includes(query.toLowerCase()) ||
    u.email?.toLowerCase().includes(query.toLowerCase())
  );

  return (
    <ProtectedAdminPage>
      <Layout>
        <div style={{ maxWidth: 700 }}>
          {/* Header */}
          <div style={{ marginBottom: 24 }}>
            <h2 className="m4-page-title">Role Management</h2>
            <p className="m4-page-sub">Manage user access levels and permissions across the platform</p>
          </div>

          {/* Stats strip */}
          <div style={{ display: "flex", gap: 10, marginBottom: 22 }}>
            {[
              { label: "Total users",   value: users.length },
              { label: "Admins",        value: users.filter(u => u.role === "ADMIN").length },
              { label: "Technicians",   value: users.filter(u => u.role === "TECHNICIAN").length },
              { label: "Regular users", value: users.filter(u => u.role === "USER").length },
            ].map(s => (
              <div key={s.label} style={{ flex: 1, background: "var(--navy3)", border: "1px solid var(--border)", borderRadius: 10, padding: "12px 16px" }}>
                <div style={{ fontSize: 20, fontWeight: 700, color: "var(--text)" }}>{s.value}</div>
                <div style={{ fontSize: 11, color: "var(--text3)", marginTop: 3 }}>{s.label}</div>
              </div>
            ))}
          </div>

          {/* Search */}
          <div style={{
            display: "flex", alignItems: "center", gap: 9,
            background: "var(--navy3)", border: "1px solid var(--border)", borderRadius: 10,
            padding: "0 14px", height: 42, marginBottom: 16,
          }}>
            <svg width="15" height="15" viewBox="0 0 16 16" fill="none" stroke="var(--text3)" strokeWidth="1.4">
              <circle cx="6.5" cy="6.5" r="4.5"/><line x1="10" y1="10" x2="14" y2="14"/>
            </svg>
            <input
              type="text"
              placeholder="Search by name or email…"
              value={query}
              onChange={e => setQuery(e.target.value)}
              style={{
                border: "none", outline: "none", background: "transparent",
                fontSize: 13, color: "var(--text)", flex: 1,
                fontFamily: "inherit",
              }}
            />
            {query && (
              <button onClick={() => setQuery("")} style={{ background: "none", border: "none", cursor: "pointer", color: "var(--text3)", fontSize: 16, lineHeight: 1 }}>×</button>
            )}
          </div>

          {/* User rows */}
          <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
            {filtered.length === 0 ? (
              <div style={{ padding: "36px 20px", textAlign: "center", color: "var(--text3)", fontSize: 13 }}>
                No users match your search
              </div>
            ) : filtered.map((user, idx) => {
              const av = getAvaColor(idx);
              const rc = ROLE_CFG[user.role] || ROLE_CFG.USER;
              return (
                <div
                  key={user.id}
                  style={{
                    background: "var(--card)", border: "1px solid var(--border)",
                    borderRadius: 12, padding: "13px 18px",
                    display: "flex", alignItems: "center", gap: 13,
                    transition: "border-color .15s",
                    opacity: saving === user.id ? 0.6 : 1,
                  }}
                  onMouseEnter={e => e.currentTarget.style.borderColor = "var(--border2)"}
                  onMouseLeave={e => e.currentTarget.style.borderColor = "var(--border)"}
                >
                  {/* Avatar */}
                  <div style={{
                    width: 38, height: 38, borderRadius: "50%", flexShrink: 0,
                    background: av.bg, color: av.color,
                    display: "flex", alignItems: "center", justifyContent: "center",
                    fontSize: 13, fontWeight: 700,
                  }}>{initials(user.name)}</div>

                  {/* Info */}
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ fontSize: 13, fontWeight: 600, color: "var(--text)" }}>{user.name}</div>
                    <div style={{ fontSize: 11, color: "var(--text3)", marginTop: 2 }}>{user.email}</div>
                  </div>

                  {/* Role badge */}
                  <span className={`role-pill ${rc.cls}`}>{rc.label}</span>

                  {/* Role select */}
                  <select
                    value={user.role}
                    onChange={e => handleRoleChange(user.id, e.target.value)}
                    disabled={saving === user.id}
                    style={{
                      padding: "7px 12px", borderRadius: 9, border: "1px solid var(--border2)",
                      background: "var(--navy3)", color: "var(--text)", fontSize: 12,
                      cursor: "pointer", fontFamily: "inherit", outline: "none",
                      transition: "border-color .15s", minWidth: 120,
                    }}
                    onFocus={e => e.currentTarget.style.borderColor = "var(--amber)"}
                    onBlur={e  => e.currentTarget.style.borderColor = "var(--border2)"}
                  >
                    <option value="ADMIN">Admin</option>
                    <option value="USER">User</option>
                    <option value="TECHNICIAN">Technician</option>
                  </select>
                </div>
              );
            })}
          </div>
        </div>
      </Layout>
    </ProtectedAdminPage>
  );
};

export default AdminUsersPage;