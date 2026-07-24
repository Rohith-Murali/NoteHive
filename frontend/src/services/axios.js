import axios from "axios";
import {
  getAccessToken,
  getRefreshToken,
  setAccessToken,
  removeTokens,
} from "../utils/token";
import { logApiError, logger } from "../utils/logger";

const api = axios.create({
  baseURL: process.env.REACT_APP_API_URL || "http://localhost:5000/api",
  withCredentials: true,
});

api.interceptors.request.use(
  (config) => {
    const token = getAccessToken();
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    logger.info(`[API] ${config.method?.toUpperCase()} ${config.url}`);
    return config;
  },
  (error) => Promise.reject(error),
);

api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      try {
        const refreshToken = getRefreshToken();
        const res = await api.post("/auth/refresh", { token: refreshToken });
        setAccessToken(res.data.accessToken);
        originalRequest.headers.Authorization = `Bearer ${res.data.accessToken}`;
        return api(originalRequest);
      } catch (refreshError) {
        logApiError(refreshError, "AUTH_REFRESH");
        removeTokens();
        window.location.href = "/login";
      }
    }

    logApiError(error, "API_RESPONSE");
    return Promise.reject(error);
  },
);

export default api;
