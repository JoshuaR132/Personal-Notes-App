import axios from "axios";
import toast from "react-hot-toast";

// ✅ Create Axios instance with base URL
const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "http://localhost:5000/api",
});

// 🔹 Optional: Debug log for base URL
console.log("API base URL:", import.meta.env.VITE_API_URL);

// ✅ Automatically attach JWT token to every request
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// ✅ Global response handler (for expired / invalid tokens)
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 401) {
      // 🔒 Token invalid or expired
      toast.error("Session expired. Please log in again.");

      // ⏱ Delay redirect to allow toast to show
      setTimeout(() => {
        localStorage.removeItem("token");
        localStorage.removeItem("user");
        window.location.href = "/login";
      }, 1500);

    } else if (error.message === "Network Error") {
      toast.error("Network error — please check your connection.");
    } else {
      // Generic API error
      const message = error.response?.data?.message || "An error occurred.";
      toast.error(message);
    }
    return Promise.reject(error);
  }
);

export default api;

