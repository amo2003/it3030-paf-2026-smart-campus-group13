import { useEffect, useState } from "react";
import Layout from "../components/Layout";
import {
  getNotificationsByUser,
  markAsRead,
  markAllAsRead,
  deleteNotification,
} from "../services/notificationService";

/* ── Type config ── */
const TYPE_CFG = {
  BOOKING_APPROVED: { bg: "rgba(16,185,129,.12)",  color: "#10b981", label: "Booking",  iconPath: "approved" },
  BOOKING_REJECTED: { bg: "rgba(239,68,68,.1)",    color: "#ef4444", label: "Booking",  iconPath: "rejected" },
  TICKET_UPDATE:    { bg: "rgba(245,158,11,.12)",  color: "#f59e0b", label: "Ticket",   iconPath: "ticket"   },
  COMMENT:          { bg: "rgba(139,92,246,.12)",  color: "#8b5cf6", label: "Comment",  iconPath: "comment"  },
  ROLE_CHANGE:      { bg: "rgba(59,130,246,.1)",   color: "#3b82f6", label: "Role",     iconPath: "role"     },
};
const getTC = (t) => {
  for (const k of Object.keys(TYPE_CFG)) { if (t?.includes(k)) return TYPE_CFG[k]; }
  return { bg: "rgba(245,158,11,.12)", color: "#f59e0b", label: "Alert", iconPath: "ticket" };
};

/* ── Small inline icons ── */
const NotifIcon = ({ path, color, bg }) => {
  const icons = {
    approved: <><rect x="2" y="3" width="12" height="11" rx="1.5"/><line x1="5" y1="1.5" x2="5" y2="4.5"/><line x1="11" y1="1.5" x2="11" y2="4.5"/><line x1="2" y1="7" x2="14" y2="7"/><polyline points="5,10 7,12 11,9"/></>,
    rejected: <><rect x="2" y="3" width="12" height="11" rx="1.5"/><line x1="5" y1="1.5" x2="5" y2="4.5"/><line x1="11" y1="1.5" x2="11" y2="4.5"/><line x1="2" y1="7" x2="14" y2="7"/><line x1="6" y1="10" x2="10" y2="10"/></>,
    ticket:   <><circle cx="8" cy="8" r="6"/><line x1="8" y1="5" x2="8" y2="8.5"/><circle cx="8" cy="11" r=".6" fill="currentColor"/></>,
    comment:  <path d="M2 2h12v9H9l-3 3v-3H2z"/>,
    role:     <><circle cx="5.5" cy="5" r="2.5"/><path d="M1 14c0-2.5 2-4.5 4.5-4.5"/><circle cx="11.5" cy="8.5" r="2"/><path d="M8.5 14c0-2 1.5-3.5 3-3.5s3 1.5 3 3.5"/></>,
  };
  return (
    <div style={{ width: 38, height: 38, borderRadius: 10, background: bg, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
      <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke={color} strokeWidth="1.5">{icons[path]}</svg>
    </div>
  );
};

/* ── Icon button ── */
const IBtn = ({ onClick, title, children, danger }) => (
  <button
    onClick={onClick} title={title}
    style={{
      width: 30, height: 30, borderRadius: 8, border: "1px solid var(--border)",
      background: "transparent", cursor: "pointer", display: "flex",
      alignItems: "center", justifyContent: "center", transition: "all .15s",
      color: danger ? "var(--red)" : "var(--amber)",
    }}
    onMouseEnter={e => { e.currentTarget.style.background = danger ? "rgba(239,68,68,.08)" : "rgba(245,158,11,.08)"; e.currentTarget.style.borderColor = "var(--border2)"; }}
    onMouseLeave={e => { e.currentTarget.style.background = "transparent"; e.currentTarget.style.borderColor = "var(--border)"; }}
  >{children}</button>
);

const CheckSVG = () => <svg width="12" height="12" viewBox="0 0 12 12" fill="none" stroke="currentColor" strokeWidth="1.8"><polyline points="2,6 5,9 10,3"/></svg>;
const XSvg    = () => <svg width="12" height="12" viewBox="0 0 12 12" fill="none" stroke="currentColor" strokeWidth="1.8"><line x1="2" y1="2" x2="10" y2="10"/><line x1="10" y1="2" x2="2" y2="10"/></svg>;

/* ── Filter chips ── */
const FILTERS = [
  { key: "all",     label: "All" },
  { key: "BOOKING", label: "Bookings" },
  { key: "TICKET",  label: "Tickets" },
  { key: "COMMENT", label: "Comments" },
];

const NotificationsPage = () => {
  const [notifications, setNotifications] = useState([]);
  const [filter, setFilter]               = useState("all");

  const currentUser = JSON.parse(localStorage.getItem("currentUser") || "null");
  const userId = currentUser?.id;

  const fetchData = async () => {
    if (!userId) return;
    try {
      const res = await getNotificationsByUser(userId);
      setNotifications(res.data);
    } catch (e) { console.error(e); }
  };

  useEffect(() => { fetchData(); }, [userId]);

  const handleRead    = async (id) => { await markAsRead(id);         fetchData(); };
  const handleReadAll = async ()   => { await markAllAsRead(userId);   fetchData(); };
  const handleDelete  = async (id) => { await deleteNotification(id); fetchData(); };

  const unread   = notifications.filter(n => !n.read).length;
  const visible  = filter === "all"
    ? notifications
    : notifications.filter(n => n.type?.includes(filter));

  const fmtTime = (ts) => new Date(ts).toLocaleString([], {
    month: "short", day: "numeric", hour: "2-digit", minute: "2-digit",
  });

  return (
    <Layout unreadCount={unread}>
      <div style={{ maxWidth: 680 }}>

        {/* Header */}
        <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", marginBottom: 22 }}>
          <div>
            <h2 className="m4-page-title">Notifications</h2>
            <p className="m4-page-sub">
              {unread > 0 ? `${unread} unread message${unread > 1 ? "s" : ""}` : "You're all caught up"}
            </p>
          </div>
          {unread > 0 && (
            <button
              onClick={handleReadAll}
              style={{
                padding: "8px 16px", borderRadius: 9, border: "1px solid var(--border2)",
                background: "transparent", color: "var(--text2)", fontSize: 12, fontWeight: 500,
                cursor: "pointer", fontFamily: "inherit", transition: "all .15s",
              }}
              onMouseEnter={e => { e.currentTarget.style.background = "var(--navy3)"; e.currentTarget.style.color = "var(--text)"; }}
              onMouseLeave={e => { e.currentTarget.style.background = "transparent"; e.currentTarget.style.color = "var(--text2)"; }}
            >
              Mark all as read
            </button>
          )}
        </div>

        {/* Filters */}
        <div style={{ display: "flex", gap: 6, marginBottom: 18, flexWrap: "wrap" }}>
          {FILTERS.map(f => (
            <button
              key={f.key}
              onClick={() => setFilter(f.key)}
              style={{
                padding: "6px 16px", borderRadius: 20, fontSize: 12, fontWeight: filter === f.key ? 600 : 400,
                border: filter === f.key ? "1px solid rgba(245,158,11,.3)" : "1px solid var(--border)",
                background: filter === f.key ? "rgba(245,158,11,.1)" : "transparent",
                color: filter === f.key ? "var(--amber)" : "var(--text2)",
                cursor: "pointer", fontFamily: "inherit", transition: "all .15s",
              }}
            >{f.label}</button>
          ))}
        </div>

        {/* List */}
        <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
          {visible.length === 0 ? (
            <div style={{ padding: "48px 20px", textAlign: "center", color: "var(--text3)", fontSize: 14 }}>
              No notifications in this category
            </div>
          ) : visible.map(n => {
            const tc = getTC(n.type);
            return (
              <div
                key={n.id}
                style={{
                  background: "var(--card)",
                  border: n.read ? "1px solid var(--border)" : "1px solid rgba(245,158,11,.2)",
                  borderLeft: n.read ? "1px solid var(--border)" : "2px solid var(--amber)",
                  borderRadius: 12, padding: "14px 16px",
                  display: "flex", gap: 13, alignItems: "flex-start",
                  opacity: n.read ? 0.6 : 1,
                  transition: "opacity .2s, border-color .2s",
                }}
              >
                <NotifIcon path={tc.iconPath} color={tc.color} bg={tc.bg} />
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontSize: 13, fontWeight: 600, color: "var(--text)", marginBottom: 4 }}>{n.title}</div>
                  <div style={{ fontSize: 12, color: "var(--text2)", lineHeight: 1.6, marginBottom: 8 }}>{n.message}</div>
                  <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                    <span style={{ fontSize: 10, padding: "2px 9px", borderRadius: 8, fontWeight: 600, background: tc.bg, color: tc.color }}>
                      {tc.label}
                    </span>
                    <span style={{ fontSize: 11, color: "var(--text3)" }}>{fmtTime(n.createdAt)}</span>
                  </div>
                </div>
                <div style={{ display: "flex", gap: 5, flexShrink: 0, paddingTop: 2 }}>
                  {!n.read && (
                    <IBtn onClick={() => handleRead(n.id)} title="Mark as read"><CheckSVG /></IBtn>
                  )}
                  <IBtn onClick={() => handleDelete(n.id)} title="Delete" danger><XSvg /></IBtn>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </Layout>
  );
};

export default NotificationsPage;