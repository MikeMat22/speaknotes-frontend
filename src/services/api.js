import axios from 'axios';

const API_URL = 'http://localhost:3000';

const api = axios.create({
  baseURL: API_URL
});

// Add token to every request
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Auth
export const register = (email, password, name) => {
  return api.post('/auth/register', { email, password, name });
};

export const login = (email, password) => {
  return api.post('/auth/login', { email, password });
};

// Notes
export const getNotes = () => {
  return api.get('/notes');
};

export const getNote = (id) => {
  return api.get(`/notes/${id}`);
};

export const createNote = (formData) => {
  return api.post('/notes', formData, {
    headers: { 'Content-Type': 'multipart/form-data' }
  });
};

export const deleteNote = (id) => {
  return api.delete(`/notes/${id}`);
};

export default api;