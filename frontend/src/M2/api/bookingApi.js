import axios from 'axios';

// Axios instance — 10s timeout
const api = axios.create({
  baseURL: 'http://localhost:8080/api/bookings',
  timeout: 10000,
  headers: { 'Content-Type': 'application/json' },
});

// Intercept errors to give readable messages
api.interceptors.response.use(
  res => res,
  err => {
    if (err.code === 'ECONNABORTED') {
      return Promise.reject(new Error('Request timed out. Is the backend running?'));
    }
    if (!err.response) {
      return Promise.reject(new Error('Network Error — backend is not reachable. Make sure the server is running on port 8080.'));
    }
    const msg = err.response?.data?.message || err.response?.data?.error || err.message;
    return Promise.reject(new Error(msg));
  }
);

export const createBooking     = async (data)          => (await api.post('', data)).data;
export const getAllBookings     = async (status = null) => (await api.get(status ? `?status=${status}` : '')).data;
export const getBookingById    = async (id)             => (await api.get(`/${id}`)).data;
export const getBookingsByUser = async (userId)         => (await api.get(`/user/${userId}`)).data;
export const approveBooking    = async (id)             => (await api.put(`/${id}/approve`)).data;
export const rejectBooking     = async (id, reason)     => (await api.put(`/${id}/reject`, { reason })).data;
export const cancelBooking     = async (id)             => (await api.put(`/${id}/cancel`)).data;
export const deleteBooking     = async (id)             => { await api.delete(`/${id}`); };
