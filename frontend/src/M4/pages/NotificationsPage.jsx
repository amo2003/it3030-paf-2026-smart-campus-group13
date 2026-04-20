import React, { useEffect, useState } from "react";
import {
  getNotificationsByUser,
  markAsRead,
  markAllAsRead,
  deleteNotification,
} from "../services/notificationService";

const NotificationsPage = () => {
  const [notifications, setNotifications] = useState([]);

  const currentUser = JSON.parse(localStorage.getItem("currentUser"));
  const userId = currentUser?.id;

  const fetchNotifications = async () => {
    if (!userId) return;

    try {
      const res = await getNotificationsByUser(userId);
      setNotifications(res.data);
    } catch (err) {
      console.error("Error fetching notifications:", err);
    }
  };

  useEffect(() => {
    fetchNotifications();
  }, [userId]);

  const handleMarkAsRead = async (id) => {
    await markAsRead(id);
    fetchNotifications();
  };

  const handleMarkAll = async () => {
    if (!userId) return;
    await markAllAsRead(userId);
    fetchNotifications();
  };

  const handleDelete = async (id) => {
    await deleteNotification(id);
    fetchNotifications();
  };

  return (
    <div style={{ padding: "20px" }}>
      <h2>Notifications</h2>

      <button onClick={handleMarkAll}>Mark All as Read</button>

      {notifications.length === 0 ? (
        <p>No notifications available</p>
      ) : (
        notifications.map((n) => (
          <div
            key={n.id}
            style={{
              border: "1px solid #ccc",
              margin: "10px 0",
              padding: "10px",
              backgroundColor: n.read ? "#f5f5f5" : "#e6f7ff",
            }}
          >
            <h4>{n.title}</h4>
            <p>{n.message}</p>
            <small>{n.type}</small>
            <br />
            <small>{new Date(n.createdAt).toLocaleString()}</small>
            <br /><br />

            {!n.read && (
              <button onClick={() => handleMarkAsRead(n.id)}>
                Mark as Read
              </button>
            )}

            <button onClick={() => handleDelete(n.id)}>Delete</button>
          </div>
        ))
      )}
    </div>
  );
};

export default NotificationsPage;