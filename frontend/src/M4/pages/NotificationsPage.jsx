import { useEffect, useState, useCallback } from "react";
import Layout from "../components/Layout";
import { getNotificationsByUser, markAsRead, markAllAsRead, deleteNotification } from "../services/notificationService";
import { getLocalNotifications, markLocalRead, markAllLocalRead, deleteLocalNotification } from "../services/localNotifications";
import "./NotificationsPage.css";

const TYPE_META = {
  BOOKING_APPROVED:  { icon: "✅", color: "#059669", bg: "#f0fdf4", border: "#bbf7d0", label: "Approved"   },
  BOOKING_REJECTED:  { icon: "❌", color: "#dc2626", bg: "#fef2f2", border: "#fecaca", label: "Rejected"   },
  BOOKING_CREATED:   { icon: "📅", color: "#4f46e5", bg: "#eef2ff", border: "#c7d2fe", label: "Booking"    },
  BOOKING_CANCELLED: { icon: "🚫", color: "#d97706", bg: "#fefce8", border: "#fde68a", label: "Cancelled"  },
  BOOKING_DELETED:   { icon: "🗑️", color: "#64748b", bg: "#f8fafc", border: "#e2e8f0", label: "Deleted"    },
  TICKET_UPDATE:     { icon: "🎫", color: "#d97706", bg: "#fefce8", border: "#fde68a", label: "Ticket"     },
  COMMENT:           { icon: "💬", color: "#7c3aed", bg: "#faf5ff", border: "#ddd6fe", label: "Comment"    },
  ROLE_CHANGE:       { icon: "👤", color: "#2563eb", bg: "#eff6ff", border: "#bfdbfe", label: "Role"       },
  LOGIN:             { icon: "🔐", color: "#059669", bg: "#f0fdf4", border: "#bbf7d0", label: "Login"      },
  LOGOUT:            { icon: "🚪", color: "#64748b", bg: "#f8fafc", border: "#e2e8f0", label: "Logout"     },
};

const getMeta = (type) => {
  if (!type) return { icon: "🔔", color: "#4f46e5", bg: "#eef2ff", border: "#c7d2fe", label: "Alert" };
  for (const k of Object.keys(TYPE_META)) {
    if (type.includes(k)) return TYPE_META[k];
  }
  return { icon: "🔔", color: "#4f46e5", bg: "#eef2ff", border: "#c7d2fe", label: "Alert" };
};

const fmtTime = (ts) => {
  if (!ts) return "";
  try { return new Date(ts).toLocaleString([], { month: "short", day: "numeric", hour: "2-digit", minute: "2-digit" }); }
  catch { return ""; }
};

const FILTERS = [
  { key: "all",     label: "All"      },
  { key: "BOOKING", label: "Bookings" },
  { key: "TICKET",  label: "Tickets"  },
  { key: "LOGIN",   label: "Activity" },
];

const NotificationsPage = () => {
  const [backendNotifs, setBackendNotifs] = useState([]);
  const [localNotifs,   setLocalNotifs]   = useState([]);
  const [filter, setFilter]               = useState("all");
  const [loading, setLoading]             = useState(true);

  const currentUser = JSON.parse(localStorage.getItem("currentUser") || "null");
  const userId = currentUser?.id;

  const loadLocal = () => setLocalNotifs(getLocalNotifications());

  const loadBackend = useCallback(async () => {
    if (!userId || userId === 0) { setLoading(false); return; }
    try {
      const res = await getNotificationsByUser(userId);
      setBackendNotifs(Array.isArray(res.data) ? res.data : []);
    } catch { setBackendNotifs([]); }
    finally { setLoading(false); }
  }, [userId]);

  useEffect(() => {
    loadLocal();
    loadBackend();
  }, [loadBackend]);

  // Merge: backend first, then local — sorted by date desc
  const all = [
    ...backendNotifs.map(n => ({ ...n, source: "backend" })),
    ...localNotifs.map(n => ({ ...n, source: "local" })),
  ].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

  const visible = filter === "all"
    ? all
    : all.filter(n => n.type?.includes(filter));

  const unread = all.filter(n => !n.read).length;

  const handleRead = async (n) => {
    if (n.source === "local") { markLocalRead(n.id); loadLocal(); }
    else { try { await markAsRead(n.id); await loadBackend(); } catch {} }
  };

  const handleReadAll = async () => {
    markAllLocalRead(); loadLocal();
    if (userId && userId !== 0) { try { await markAllAsRead(userId); await loadBackend(); } catch {} }
  };

  const handleDelete = async (n) => {
    if (n.source === "local") { deleteLocalNotification(n.id); loadLocal(); }
    else { try { await deleteNotification(n.id); await loadBackend(); } catch {} }
  };

  return (
    <Layout unreadCount={unread}>
      <div className="notif-page">

        {/* Header */}
        <div className="notif-header">
          <div>
            <h1 className="notif-title">Notifications</h1>
            <p className="notif-sub">
              {loading ? "Loading..." : unread > 0 ? `${unread} unread` : "You're all caught up"}
            </p>
          </div>
          {unread > 0 && (
            <button className="notif-read-all-btn" onClick={handleReadAll}>
              ✓ Mark all as read
            </button>
          )}
        </div>

        {/* Filter tabs */}
        <div className="notif-filters">
          {FILTERS.map(f => (
            <button
              key={f.key}
              onClick={() => setFilter(f.key)}
              className={`notif-filter-btn${filter === f.key ? " active" : ""}`}
            >
              {f.label}
            </button>
          ))}
        </div>

        {/* Loading */}
        {loading && <p className="notif-state">Loading notifications...</p>}

        {/* Empty */}
        {!loading && visible.length === 0 && (
          <div className="notif-empty">
            <div className="notif-empty-icon">🔔</div>
            <p>No notifications in this category</p>
          </div>
        )}

        {/* List */}
        {!loading && visible.length > 0 && (
          <div className="notif-list">
            {visible.map(n => {
              const m = getMeta(n.type);
              return (
                <div key={n.id} className={`notif-card${n.read ? " read" : ""}`}
                  style={{ borderLeftColor: m.color }}>

                  {/* Icon */}
                  <div className="notif-icon-wrap" style={{ background: m.bg, border: `1px solid ${m.border}` }}>
                    <span className="notif-icon">{m.icon}</span>
                  </div>

                  {/* Content */}
                  <div className="notif-content">
                    <div className="notif-card-title">{n.title || "Notification"}</div>
                    <div className="notif-card-msg">{n.message}</div>
                    <div className="notif-card-meta">
                      <span className="notif-type-tag" style={{ background: m.bg, color: m.color, border: `1px solid ${m.border}` }}>
                        {m.label}
                      </span>
                      {n.source === "local" && (
                        <span className="notif-local-tag">Local</span>
                      )}
                      {n.createdAt && (
                        <span className="notif-time">{fmtTime(n.createdAt)}</span>
                      )}
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="notif-actions">
                    {!n.read && (
                      <button className="notif-act-btn" title="Mark as read" onClick={() => handleRead(n)}>
                        <svg width="12" height="12" viewBox="0 0 12 12" fill="none" stroke="currentColor" strokeWidth="1.8">
                          <polyline points="2,6 5,9 10,3"/>
                        </svg>
                      </button>
                    )}
                    <button className="notif-act-btn danger" title="Delete" onClick={() => handleDelete(n)}>
                      <svg width="12" height="12" viewBox="0 0 12 12" fill="none" stroke="currentColor" strokeWidth="1.8">
                        <line x1="2" y1="2" x2="10" y2="10"/><line x1="10" y1="2" x2="2" y2="10"/>
                      </svg>
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </Layout>
  );
};

export default NotificationsPage;
