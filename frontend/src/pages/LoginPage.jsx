import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { login } from "../features/auth/authSlice";
import { Link, useNavigate } from "react-router-dom";

export default function LoginPage() {
    const [form, setForm] = useState({ email: "", password: "" });
    const { loading } = useSelector((state) => state.auth);
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

    const handleSubmit = (e) => {
        e.preventDefault();
        dispatch(login(form)).then((res) => {
            if (res.meta.requestStatus === "fulfilled") {
                navigate("/");
            }
        });
    };

    return (
        <div className="flex justify-center items-center h-screen bg-gray-50">
            <div className="shadow-lg rounded-lg p-8 w-96" style={{ background: 'var(--card-bg)', color: 'var(--text-color)', border: '1px solid var(--card-border)' }}>
                <h2 className="text-2xl font-bold text-center mb-6">Login</h2>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <input
                        type="email"
                        name="email"
                        placeholder="Email"
                        value={form.email}
                        onChange={handleChange}
                        className="w-full px-4 py-2 border rounded-lg"
                        style={{ background: 'var(--card-bg)', color: 'var(--text-color)', borderColor: 'var(--card-border)' }}
                        required
                    />
                    <input
                        type="password"
                        name="password"
                        placeholder="Password"
                        value={form.password}
                        onChange={handleChange}
                        className="w-full px-4 py-2 border rounded-lg"
                        style={{ background: 'var(--card-bg)', color: 'var(--text-color)', borderColor: 'var(--card-border)' }}
                        required
                    />
                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full text-white py-2 rounded-lg bg-blue-600 hover:bg-blue-700 disabled:opacity-50"
                        style={{ background: 'var(--primary-color)' }}
                    >
                        {loading ? "Logging in..." : "Login"}
                    </button>
                </form>
                <p className="text-sm text-center mt-4">
                    Don’t have an account?{" "}
                    <Link to="/register" className="text-primary hover:underline">
                        Register
                    </Link>
                </p>
            </div>
        </div>
    );
}
