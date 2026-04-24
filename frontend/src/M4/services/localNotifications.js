// Local activity log — stores events in localStorage
// Used to show login/logout/booking activity in the notifications page

const KEY = 'localNotifications';

export const getLocalNotifications = () => {
  try {
    return JSON.parse(localStorage.getItem(KEY) || '[]');
  } catch { return []; }
};

const saveAll = (list) => {
  localStorage.setItem(KEY, JSON.stringify(list.slice(0, 50))); // keep last 50
};

export const addLocalNotification = (type, title, message) => {
  const list = getLocalNotifications();
  list.unshift({
    id:        `local_${Date.now()}`,
    type,
    title,
    message,
    createdAt: new Date().toISOString(),
    read:      false,
    local:     true,
  });
  saveAll(list);
};

export const markLocalRead = (id) => {
  const list = getLocalNotifications().map(n => n.id === id ? { ...n, read: true } : n);
  saveAll(list);
};

export const markAllLocalRead = () => {
  const list = getLocalNotifications().map(n => ({ ...n, read: true }));
  saveAll(list);
};

export const deleteLocalNotification = (id) => {
  saveAll(getLocalNotifications().filter(n => n.id !== id));
};

export const clearLocalNotifications = () => {
  localStorage.removeItem(KEY);
};
