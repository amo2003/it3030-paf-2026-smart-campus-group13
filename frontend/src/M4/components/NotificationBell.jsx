import { useEffect, useRef, useState } from "react";
import {
  getNotificationsByUser,
  getUnreadCount,
  markAsRead,
  deleteNotification,
} from "../services/notificationService";

/* Type → colour mapping */
const TYPE_MAP = {
  BOOKING_APPROVED: { bg: "rgba(16,185,129,.12)",  color: "#10b981", label: "Booking"  },
  BOOKING_REJECTED: { bg: "rgba(239,68,68,.1)",    color: "#ef4444", label: "Booking"  },
  TICKET_UPDATE:    { bg: "rgba(245,158,11,.12)",  color: "#f59e0b", label: "Ticket"   },
  COMMENT:          { bg: "rgba(139,92,246,.12)",  color: "#8b5cf6", label: "Comment"  },
  ROLE_CHANGE:      { bg: "rgba(59,130,246,.1)",   color: "#3b82f6", label: "Role"     },
};
const getType = (t) => {
  for (const k of Object.keys(TYPE_MAP)) { if (t?.includes(k)) return TYPE_MAP[k]; }
  return { bg: "rgba(245,158,11,.12)", color: "#f59e0b", label: "Alert" };
};

const BellIcon = () => (
  <svg width="17" height="17" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5">
    <path d="M8 2a5 5 0 00-5 5v2.5L1.5 11h13L13 9.5V7a5 5 0 00-5-5z" />
    <path d="M6.5 13a1.5 1.5 0 003 0" />
  </svg>
);

const NotificationBell = () => {
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount]     = useState(0);
  const [open, setOpen]                   = useState(false);
  const wrapRef = useRef(null);

  const currentUser = JSON.parse(localStorage.getItem("currentUser") || "null");
  const userId = currentUser?.id;

  const fetchData = async () => {
    if (!userId) return;
    try {
      const [nr, cr] = await Promise.all([
        getNotificationsByUser(userId),
        getUnreadCount(userId),
      ]);
      setNotifications(nr.data);
      setUnreadCount(cr.data);
    } catch (e) { console.error(e); }
  };

  useEffect(() => { fetchData(); }, [userId]);

  useEffect(() => {
    const close = (e) => { if (wrapRef.current && !wrapRef.current.contains(e.target)) setOpen(false); };
    document.addEventListener("mousedown", close);
    return () => document.removeEventListener("mousedown", close);
  }, []);

  const handleRead   = async (id) => { await markAsRead(id);        fetchData(); };
  const handleDelete = async (id) => { await deleteNotification(id); fetchData(); };

  return (
    <div ref={wrapRef} style={{ position: "relative", display: "inline-block" }}>
      {/* Bell button */}
      <button
        onClick={() => setOpen(o => !o)}
        style={{
          width: 38, height: 38, borderRadius: 9,
          border: "1px solid var(--border2)", background: "var(--navy3)",
          cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center",
          color: "var(--text2)", position: "relative", transition: "all .15s",
        }}
        onMouseEnter={e => { e.currentTarget.style.background = "var(--navy4)"; e.currentTarget.style.color = "var(--text)"; }}
        onMouseLeave={e => { e.currentTarget.style.background = "var(--navy3)"; e.currentTarget.style.color = "var(--text2)"; }}
      >
        <BellIcon />
        {unreadCount > 0 && (
          <span style={{
            position: "absolute", top: -4, right: -4,
            width: 18, height: 18, background: "var(--red)", color: "#fff",
            borderRadius: "50%", fontSize: 10, fontWeight: 700,
            display: "flex", alignItems: "center", justifyContent: "center",
            border: "2px solid var(--navy2)",
          }}>{unreadCount}</span>
        )}
      </button>

      {/* Dropdown */}
      {open && (
        <div style={{
          position: "absolute", right: 0, top: 46, width: 340,
          background: "var(--navy)", border: "1px solid var(--border2)",
          borderRadius: 14, zIndex: 9999, overflow: "hidden",
          boxShadow: "0 16px 40px rgba(0,0,0,0.4)",
        }}>
          {/* Header */}
          <div style={{
            padding: "12px 16px", borderBottom: "1px solid var(--border)",
            display: "flex", alignItems: "center", justifyContent: "space-between",
          }}>
            <span style={{ fontSize: 13, fontWeight: 700, color: "var(--text)" }}>Notifications</span>
            {unreadCount > 0 && (
              <span style={{ fontSize: 11, padding: "2px 8px", borderRadius: 8, fontWeight: 600, background: "rgba(245,158,11,.12)", color: "var(--amber)" }}>
                {unreadCount} unread
              </span>
            )}
          </div>

          {/* List */}
          <div style={{ maxHeight: 340, overflowY: "auto" }}>
            {notifications.length === 0 ? (
              <div style={{ padding: "28px 16px", textAlign: "center", color: "var(--text3)", fontSize: 13 }}>
                No notifications yet
              </div>
            ) : notifications.map(n => {
              const tc = getType(n.type);
              return (
                <div key={n.id} style={{
                  padding: "12px 16px", borderBottom: "1px solid var(--border)",
                  display: "flex", gap: 10, alignItems: "flex-start",
                  background: n.read ? "transparent" : "rgba(245,158,11,0.03)",
                  transition: "background .15s",
                }}>
                  <div style={{ width: 6, height: 6, borderRadius: "50%", flexShrink: 0, marginTop: 5,
                    background: n.read ? "transparent" : "var(--amber)" }} />
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ fontSize: 12, fontWeight: 600, color: "var(--text)", marginBottom: 2 }}>{n.title}</div>
                    <div style={{ fontSize: 11, color: "var(--text2)", lineHeight: 1.5, marginBottom: 5 }}>{n.message}</div>
                    <div style={{ display: "flex", gap: 7, alignItems: "center" }}>
                      <span style={{ fontSize: 10, padding: "2px 7px", borderRadius: 7, fontWeight: 600, background: tc.bg, color: tc.color }}>{tc.label}</span>
                      <span style={{ fontSize: 10, color: "var(--text3)" }}>
                        {new Date(n.createdAt).toLocaleString([], { month: "short", day: "numeric", hour: "2-digit", minute: "2-digit" })}
                      </span>
                    </div>
                  </div>
                  <div style={{ display: "flex", gap: 4, flexShrink: 0 }}>
                    {!n.read && (
                      <button onClick={() => handleRead(n.id)} title="Mark as read" style={iconBtnStyle("#f59e0b")}>
                        <svg width="11" height="11" viewBox="0 0 12 12" fill="none" stroke="currentColor" strokeWidth="1.8"><polyline points="2,6 5,9 10,3" /></svg>
                      </button>
                    )}
                    <button onClick={() => handleDelete(n.id)} title="Delete" style={iconBtnStyle("#ef4444")}>
                      <svg width="11" height="11" viewBox="0 0 12 12" fill="none" stroke="currentColor" strokeWidth="1.8">
                        <line x1="2" y1="2" x2="10" y2="10" /><line x1="10" y1="2" x2="2" y2="10" />
                      </svg>
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};

const iconBtnStyle = (hoverColor) => ({
  width: 27, height: 27, borderRadius: 7,
  border: "1px solid var(--border)", background: "transparent",
  cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center",
  color: hoverColor, transition: "all .15s",
});

export default NotificationBell;