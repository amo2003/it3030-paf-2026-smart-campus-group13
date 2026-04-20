import axios from "axios";

const API_BASE = "http://localhost:8080/api/module4/users";

export const getAllUsers = () => {
  return axios.get(API_BASE);
};

export const createUser = (userData) => {
  return axios.post(API_BASE, userData);
};

export const updateUserRole = (id, role) => {
  return axios.put(`${API_BASE}/${id}/role`, { role });
};