import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { register } from "../redux/slices/authSlice";
import { Link, useNavigate } from "react-router-dom";

export default function RegisterPage() {
    const [form, setForm] = useState({ name: "", email: "", password: "" });
    const { loading } = useSelector((state) => state.auth);
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

    const handleSubmit = (e) => {
        e.preventDefault();
        dispatch(register(form)).then((res) => {
            if (res.meta.requestStatus === "fulfilled") {
                navigate("/");
            }
        });
    };

    return (
        <div className="flex justify-center items-center h-screen bg-gray-50">
            <div className="shadow-lg rounded-lg p-8 w-96" style={{ background: 'var(--card-bg)', color: 'var(--text-color)', border: '1px solid var(--card-border)' }}>
                <h2 className="text-2xl font-bold text-center mb-6">Register</h2>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <input
                        type="text"
                        name="name"
                        placeholder="Name"
                        value={form.name}
                        onChange={handleChange}
                        className="w-full px-4 py-2 border rounded-lg"
                        style={{ background: 'var(--card-bg)', color: 'var(--text-color)', borderColor: 'var(--card-border)' }}
                        required
                    />
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
                        {loading ? "Registering..." : "Register"}
                    </button>
                </form>
                <p className="text-sm text-center mt-4">
                    Already have an account?{" "}
                    <Link to="/login" className="text-primary hover:underline">
                        Login
                    </Link>
                </p>
            </div>
        </div>
    );
}
