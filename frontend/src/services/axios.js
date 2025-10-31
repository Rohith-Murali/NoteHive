import axios from "axios";
import { getAccessToken, getRefreshToken, setAccessToken, removeTokens } from "../utils/token";

const api = axios.create({
  baseURL: "http://localhost:5000/api",
  withCredentials: true,
});

// Request interceptor → attach token
api.interceptors.request.use(
  (config) => {
    const token = getAccessToken();
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor → refresh token flow
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    // If access token expired → try refresh
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      try {
        const refreshToken = getRefreshToken();
        // backend expects { token } in the body, so send under that key
        const res = await api.post("/auth/refresh", { token: refreshToken });
        setAccessToken(res.data.accessToken);
        originalRequest.headers.Authorization = `Bearer ${res.data.accessToken}`;
        return api(originalRequest);
      } catch (err) {
        removeTokens();
        window.location.href = "/login";
      }
    }
    return Promise.reject(error);
  }
);

export default api;
