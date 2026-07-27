import axios from "axios";
import {
  getAccessToken,
  getRefreshToken,
  setAccessToken,
  removeTokens,
} from "../utils/token";
import { logApiError, logger } from "../utils/logger";
import { normalizeResponse } from "../utils/response";

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
  (response) => {
    const normalized = normalizeResponse(response.data);
    response.data = normalized;
    logger.info(
      `[API] ${response.config.method?.toUpperCase()} ${response.config.url} -> ${normalized.success ? "ok" : "error"}`,
    );
    return response;
  },
  async (error) => {
    const originalRequest = error.config;

    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      try {
        const refreshToken = getRefreshToken();
        if (!refreshToken) {
          throw new Error("No refresh token available");
        }

        const res = await api.post("/auth/refresh", { token: refreshToken });
        const refreshedPayload = res.data?.data || res.data;
        const newAccessToken = refreshedPayload?.accessToken;

        if (!newAccessToken) {
          throw new Error("Refresh response did not include an access token");
        }

        setAccessToken(newAccessToken);
        originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;
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
