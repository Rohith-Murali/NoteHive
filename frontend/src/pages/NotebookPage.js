import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Sidebar from "../components/Sidebar";
import api from "../services/axios";

export default function NotebookPage() {
    const { notebookId } = useParams();
    const navigate = useNavigate();
    const [notes, setNotes] = useState([]);
    const [tasks, setTasks] = useState([]);

    useEffect(() => {
        const fetchAll = async () => {
            try {
                const notesRes = await api.get(`/notebook/${notebookId}/notes`);
                const tasksRes = await api.get(`/notebook/${notebookId}/tasks`);
                setNotes(notesRes.data);
                setTasks(tasksRes.data);
            } catch (err) {
                console.error("Fetch error:", err);
            }
        };
        if (notebookId)
            fetchAll();
    }, [notebookId]);

    const handleAddNote = async () => {
        const title = prompt("Note title?");
        if (!title) return;
        const res = await api.post(`/notebook/${notebookId}/notes`, { title, content: "" });
        setNotes((prev) => [...prev, res.data]);
    };

    const handleAddTask = async () => {
        const title = prompt("Task group title?");
        if (!title) return;
        const res = await api.post(`/notebook/${notebookId}/tasks`, {
            tasks: [{ title }],
        });
        setTasks((prev) => [...prev, res.data]);
    };

    return (
        <div className="flex h-screen">
            <Sidebar />
            <main className="flex-1 overflow-y-auto p-6">
                <button
                    onClick={() => navigate(-1)}
                    className="mb-4 px-4 py-2 bg-gray-300 rounded-lg hover:bg-gray-400"
                >
                    ← Back
                </button>

                <div className="flex justify-between items-center mb-4">
                    <h2 className="text-xl font-semibold">Notes</h2>
                    <button onClick={handleAddNote} className="bg-blue-600 text-white px-3 py-2 rounded-lg">
                        + Add Note
                    </button>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-4 gap-4 mb-8">
                    {notes.map((note) => (
                        <div
                            key={note._id}
                            className="border p-4 rounded-lg hover:bg-gray-100 cursor-pointer"
                            onClick={() => navigate(`/notebook/${notebookId}/notes/${note._id}`)}
                        >
                            {note.title}
                        </div>
                    ))}
                </div>

                <div className="flex justify-between items-center mb-4">
                    <h2 className="text-xl font-semibold">Tasks</h2>
                    <button onClick={handleAddTask} className="bg-blue-600 text-white px-3 py-2 rounded-lg">
                        + Add Task Group
                    </button>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
                    {tasks.map((task) => (
                        <div
                            key={task._id}
                            className="border p-4 rounded-lg hover:bg-gray-100 cursor-pointer"
                            onClick={() => navigate(`/notebook/${notebookId}/tasks/${task._id}`)}
                        >
                            {task.title || "Untitled Task Group"}
                        </div>
                    ))}
                </div>
            </main>
        </div>
    );
}
