import axios from "axios";
import toast from "react-hot-toast";

// ✅ Axios instance with base URL
const api = axios.create({
  baseURL: process.env.REACT_APP_API_URL || "http://localhost:5000/api",
});

// 🔹 Debug log
console.log("API base URL:", process.env.REACT_APP_API_URL);

// ✅ Attach JWT token to every request
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

// ✅ Handle global responses
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 401) {
      // 🔒 Token invalid or expired
      toast.error("Session expired. Please log in again.");

      // Only redirect if we're NOT already on /login
      if (window.location.pathname !== "/login") {
        setTimeout(() => {
          localStorage.removeItem("token");
          localStorage.removeItem("user");
          window.location.href = "/login";
        }, 1500);
      }
    } else if (error.message === "Network Error") {
      toast.error("Network error — check your connection.");
    } else {
      const message = error.response?.data?.message || "An error occurred.";
      toast.error(message);
    }

    return Promise.reject(error);
  }
);

export default api;
