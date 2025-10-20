import api from "../../services/axios";
import { setTokens } from "../../utils/token";

const register = async (userData) => {
    const res = await api.post("/auth/register", userData);
    if (res.data.accessToken && res.data.refreshToken) {
        setTokens(res.data.accessToken, res.data.refreshToken);
    }
    return res.data;
};

const login = async (userData) => {
    const res = await api.post("/auth/login", userData);
    if (res.data.accessToken && res.data.refreshToken) {
        setTokens(res.data.accessToken, res.data.refreshToken);
    }
    return res.data;
};

const authService = { register, login };
export default authService;
