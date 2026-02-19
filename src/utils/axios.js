import axios from "axios";

const api = axios.create({
  baseURL: "http://localhost:5001/api",
  // baseURL: "https://backend-k5rc.onrender.com/api",
  withCredentials: true,
  headers: {
    "Content-Type": "application/json",
  },
});

export default api;
