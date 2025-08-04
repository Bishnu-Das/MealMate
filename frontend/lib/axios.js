import axios from "axios";
import { userAuthStore } from "../src/customer/store/userAuthStore";

export const axiosInstance = axios.create({
  // baseURL: "http://192.168.0.101:5001/api",
  baseURL:
    import.meta.env.MODE === "development"
      ? "http://localhost:5001/api"
      : "/api",
  withCredentials: true,
});

axiosInstance.interceptors.request.use((config) => {
  const token = userAuthStore.getState().token;
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});
