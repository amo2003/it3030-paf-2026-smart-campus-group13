import React, { useEffect, useState } from "react";
import {
  getNotificationsByUser,
  getUnreadCount,
  markAsRead,
  deleteNotification,
} from "../services/notificationService";

const NotificationBell = () => {
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [open, setOpen] = useState(false);

  const currentUser = JSON.parse(localStorage.getItem("currentUser"));
  const userId = currentUser?.id;

  const fetchData = async () => {
    if (!userId) return;

    try {
      const notificationsRes = await getNotificationsByUser(userId);
      const unreadRes = await getUnreadCount(userId);

      setNotifications(notificationsRes.data);
      setUnreadCount(unreadRes.data);
    } catch (error) {
      console.error("Error loading notifications:", error);
    }
  };

  useEffect(() => {
    fetchData();
  }, [userId]);

  const handleMarkAsRead = async (id) => {
    try {
      await markAsRead(id);
      fetchData();
    } catch (error) {
      console.error("Error marking as read:", error);
    }
  };

  const handleDelete = async (id) => {
    try {
      await deleteNotification(id);
      fetchData();
    } catch (error) {
      console.error("Error deleting notification:", error);
    }
  };

  return (
    <div style={{ position: "relative", display: "inline-block" }}>
      <button
        onClick={() => setOpen(!open)}
        style={{
          fontSize: "24px",
          background: "none",
          border: "none",
          cursor: "pointer",
          position: "relative",
        }}
      >
        🔔
        {unreadCount > 0 && (
          <span
            style={{
              position: "absolute",
              top: "-5px",
              right: "-8px",
              background: "red",
              color: "white",
              borderRadius: "50%",
              padding: "2px 6px",
              fontSize: "12px",
            }}
          >
            {unreadCount}
          </span>
        )}
      </button>

      {open && (
        <div
          style={{
            position: "absolute",
            right: 0,
            top: "35px",
            width: "320px",
            maxHeight: "400px",
            overflowY: "auto",
            background: "white",
            border: "1px solid #ccc",
            borderRadius: "8px",
            boxShadow: "0 4px 10px rgba(0,0,0,0.15)",
            padding: "10px",
            zIndex: 1000,
          }}
        >
          <h4 style={{ marginTop: 0 }}>Notifications</h4>

          {notifications.length === 0 ? (
            <p>No notifications</p>
          ) : (
            notifications.map((n) => (
              <div
                key={n.id}
                style={{
                  borderBottom: "1px solid #eee",
                  padding: "10px 0",
                  backgroundColor: n.read ? "#f9f9f9" : "#eef6ff",
                }}
              >
                <strong>{n.title}</strong>
                <p style={{ margin: "5px 0" }}>{n.message}</p>
                <small>{n.type}</small>
                <br />
                <small>{new Date(n.createdAt).toLocaleString()}</small>
                <br /><br />

                {!n.read && (
                  <button
                    onClick={() => handleMarkAsRead(n.id)}
                    style={{ marginRight: "8px" }}
                  >
                    Mark as Read
                  </button>
                )}

                <button onClick={() => handleDelete(n.id)}>Delete</button>
              </div>
            ))
          )}
        </div>
      )}
    </div>
  );
};

export default NotificationBell;