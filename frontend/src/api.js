// src/api.js
import axios from "axios";

const api = axios.create({
  baseURL: process.env.REACT_APP_API_URL || "http://localhost:5000/api",
});

// Request interceptor - attach token if present
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
}, (error) => Promise.reject(error));

// Response interceptor - handle 401 globally (optional)
api.interceptors.response.use(
  (res) => res,
  (err) => {
    if (err.response && err.response.status === 401) {
      // token invalid/expired - remove token and optionally redirect to login
      localStorage.removeItem("token");
      // optionally: window.location.href = "/login";
    }
    return Promise.reject(err);
  }
);

export default api;
