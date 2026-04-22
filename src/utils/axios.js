import axios from "axios";

const rawBaseURL =
  import.meta.env.VITE_API_BASE_URL ||
  (import.meta.env.DEV
    ? "http://localhost:5001/api"
    : "https://backend-k5rc.onrender.com/api");

const baseURL = rawBaseURL.replace(/\/+$/, "");

const api = axios.create({
  baseURL,
  withCredentials: true,
  headers: {
    "Content-Type": "application/json",
  },
});

export default api;
