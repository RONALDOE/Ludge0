import axios from "axios";
import config from "./config";

const api = axios.create({
  baseURL: `${config.VITE_HOSTAPI}/api/v1`,
  timeout: 2500,
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers["Authorization"] = `Bearer ${token}`;
  }
  return config;
});

export default api;
