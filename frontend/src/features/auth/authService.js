import api from "../../services/axios";
import { setTokens } from "../../utils/token";

const normalizeAuthResponse = (res) => {
  const payload = res?.data?.data ?? res?.data ?? {};
  const user =
    payload.user ||
    (payload._id
      ? { _id: payload._id, name: payload.name, email: payload.email }
      : null);

  if (payload.accessToken && payload.refreshToken) {
    setTokens(payload.accessToken, payload.refreshToken);
  }

  return { ...payload, user };
};

const register = async (userData) => {
  const res = await api.post("/auth/register", userData);
  return normalizeAuthResponse(res);
};

const login = async (userData) => {
  const res = await api.post("/auth/login", userData);
  return normalizeAuthResponse(res);
};

const authService = { register, login };
export default authService;
