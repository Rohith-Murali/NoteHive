import { useDispatch } from "react-redux";
import { logout } from "../features/auth/authSlice";

export default function Dashboard() {
    const dispatch = useDispatch();

    return (
        <div className="flex flex-col items-center justify-center h-screen bg-gray-100">
            <div className="bg-white shadow-lg p-8 rounded-lg w-96 text-center">
                <h1 className="text-2xl font-bold mb-4">Welcome to NoteHive 🐝</h1>
                <p className="mb-6">You are successfully logged in!</p>
                <button
                    onClick={() => dispatch(logout())}
                    className="bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600"
                >
                    Logout
                </button>
            </div>
        </div>
    );
}
