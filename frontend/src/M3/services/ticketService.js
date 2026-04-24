import axios from "axios";

const API_URL = "http://localhost:8080/api/tickets";

const getAllTickets = () => axios.get(API_URL);
const getTicketById = (id) => axios.get(`${API_URL}/${id}`);
const createTicket = (ticket) => axios.post(API_URL, ticket);
const updateStatus = (id, status) =>
  axios.put(`${API_URL}/${id}/status?status=${status}`);
const addComment = (id, comment) =>
  axios.post(`${API_URL}/${id}/comments`, comment);
const getComments = (id) =>
  axios.get(`${API_URL}/${id}/comments`);
const uploadAttachment = (id, formData) =>
  axios.post(`${API_URL}/${id}/attachments`, formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
const assignTechnician = (id, data) =>
  axios.put(`${API_URL}/${id}/assign`, data);
const rejectTicket = (id, data) =>
  axios.put(`${API_URL}/${id}/reject`, data);
const resolveTicket = (id, data) =>
  axios.put(`${API_URL}/${id}/resolve`, data);

const ticketService = {
  getAllTickets,
  getTicketById,
  createTicket,
  updateStatus,
  addComment,
  getComments,
  uploadAttachment,
  assignTechnician,
  rejectTicket,
  resolveTicket,
};

export default ticketService;