import axios from "axios";

const API_BASE = "http://localhost:8080/api/module4/notifications";

export const getNotificationsByUser = (userId) => {
  return axios.get(`${API_BASE}/user/${userId}`);
};

export const markAsRead = (id) => {
  return axios.patch(`${API_BASE}/${id}/read`);
};

export const markAllAsRead = (userId) => {
  return axios.patch(`${API_BASE}/user/${userId}/read-all`);
};

export const deleteNotification = (id) => {
  return axios.delete(`${API_BASE}/${id}`);
};