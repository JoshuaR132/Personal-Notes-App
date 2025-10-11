import axios from "axios";
import toast from "react-hot-toast";

// ✅ Create an Axios instance with the backend base URL
const api = axios.create({
  baseURL: process.env.REACT_APP_API_URL || "http://localhost:5000/api",
});

// 🔹 Debug log to confirm base URL
console.log("API base URL:", process.env.REACT_APP_API_URL || "http://localhost:5000/api");

// ✅ Automatically attach JWT token to every request
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// ✅ Global response handler
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response) {
      if (error.response.status === 401) {
        // Token expired or invalid
        toast.error("Session expired. Please log in again.");
        localStorage.removeItem("token");
        localStorage.removeItem("user");
        setTimeout(() => {
          window.location.href = "/login";
        }, 1000);
      } else {
        // Other server errors
        const msg = error.response.data?.message || "An error occurred.";
        toast.error(msg);
      }
    } else if (error.message === "Network Error") {
      toast.error("Network error — check your connection.");
    }
    return Promise.reject(error);
  }
);

export default api;
