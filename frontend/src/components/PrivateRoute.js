import { Navigate, Outlet } from "react-router-dom";
import { useSelector } from "react-redux";
import { getAccessToken } from "../utils/token";

export default function PrivateRoute() {
    const { user } = useSelector((state) => state.auth);
    const token = getAccessToken();

    // if user or valid token exists → allow access
    return user || token ? <Outlet /> : <Navigate to="/login" replace />;
}
