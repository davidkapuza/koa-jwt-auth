import axios from "axios";
import { AuthResponse } from "../types";

const API_HOST = process.env["NEXT_PUBLIC_API_HOST"] || "http://localhost:8000";

const api = axios.create({
  baseURL: API_HOST,
  withCredentials: true,
});

api.interceptors.request.use((config) => {
  config.headers.Authorization = `Bearer ${localStorage.getItem(
    "accessToken"
  )}`;
  return config;
});
api.interceptors.response.use(
  (config) => config,
  async (error) => {
    const originalRequest = error.config;
    if (error.response.status === 401) {
      try {
        const response = await axios.get<AuthResponse>(
          `${API_HOST}/api/refresh`,
          {
            withCredentials: true,
          }
        );
        localStorage.setItem("accessToken", response.data.accessToken);
        return api.request(originalRequest);
      } catch (error) {
        console.error("Unauthorized");
      }
    }
  }
);

export default api;
