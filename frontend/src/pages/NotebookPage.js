import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import NoteCard from "../components/NoteCard";
import ConfirmDialog from "../components/ConfirmDialog";
import api from "../services/axios";
import { FaPlus, FaSort, FaFilter } from "react-icons/fa";
import { FiTrash2 } from "react-icons/fi";

export default function NotebookPage() {
    const { notebookId } = useParams();
    const navigate = useNavigate();

    const [notes, setNotes] = useState([]);
    const [tasks, setTasks] = useState([]);
    const [notebook, setNotebook] = useState({});

    const [sortOption, setSortOption] = useState("date");
    const [filter, setFilter] = useState("all");
    const [menuOpen, setMenuOpen] = useState(false);

    // Edit/Delete modal states
    const [showConfirm, setShowConfirm] = useState(false);
    const [selectedItem, setSelectedItem] = useState(null);
    const [selectedType, setSelectedType] = useState(null);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const notesRes = await api.get(`/notebook/${notebookId}/notes`);
                const tasksRes = await api.get(`/notebook/${notebookId}/tasks`);
                const notebookRes = await api.get(`/notebook/${notebookId}`);
                setNotes(notesRes.data);
                setTasks(tasksRes.data);
                setNotebook(notebookRes.data);
            } catch (err) {
                console.error("Fetch error:", err);
            }
        };
        if (notebookId) fetchData();
    }, [notebookId]);

    // Sort logic
    const sortItems = (arr) => {
        if (sortOption === "name") {
            return [...arr].sort((a, b) => a.title.localeCompare(b.title));
        } else {
            return [...arr].sort(
                (a, b) => new Date(b.updatedAt || b.createdAt) - new Date(a.updatedAt || a.createdAt)
            );
        }
    };

    // Filter + sort
    const visibleNotes = (filter === "all" || filter === "notes") ? sortItems(notes) : [];
    const visibleTasks = (filter === "all" || filter === "tasks") ? sortItems(tasks) : [];

    // Handlers
    const handleAddNote = () => navigate(`/notebook/${notebookId}/notes/new`);
    const handleAddTask = () => navigate(`/notebook/${notebookId}/tasks/new`);

    const handleOpenItem = (item) => {
        if (item.type === "text") navigate(`/notebook/${notebookId}/notes/${item._id}`);
        else navigate(`/notebook/${notebookId}/tasks/${item._id}`);
    };

    const handleDelete = (item, type) => {
        setSelectedItem(item);
        setSelectedType(type);
        setShowConfirm(true);
    };

    const confirmDelete = async () => {
        try {
            await api.put(`/notebook/${notebookId}/${selectedType}/${selectedItem._id}/trash`);
            if (selectedType === "notes")
                setNotes(notes.filter((n) => n._id !== selectedItem._id));
            else
                setTasks(tasks.filter((t) => t._id !== selectedItem._id));
        } catch (err) {
            console.error("Delete error:", err);
        }
        setShowConfirm(false);
    };

    return (
        <div className={`flex h-screen ${showConfirm ? "backdrop-blur-sm" : ""}`}>
            <main className="flex-1 overflow-y-auto p-6 relative">
                <button
                    onClick={() => navigate(-1)}
                    className="mb-4 px-4 py-2 bg-gray-200 rounded-lg hover:bg-gray-300"
                >
                    ← Back
                </button>

                <h1 className="text-2xl font-semibold mb-8">{notebook.title}</h1>
                {/* Header bar */}
                <div className="flex justify-between items-center mb-6 border-b pb-4">
                    <div className="flex gap-4 items-center">
                        {/* Sort */}
                        <button
                            className="flex items-center gap-2 px-3 py-2 bg-gray-200 rounded hover:bg-gray-300"
                            onClick={() => setSortOption(sortOption === "date" ? "name" : "date")}
                        >
                            <FaSort /> Sort by {sortOption === "date" ? "Date" : "Name"}
                        </button>

                        {/* Filter */}
                        <div className="flex items-center gap-2">
                            <FaFilter />
                            <select
                                value={filter}
                                onChange={(e) => setFilter(e.target.value)}
                                className="border px-3 py-2 rounded"
                            >
                                <option value="all">All</option>
                                <option value="notes">Notes</option>
                                <option value="tasks">Tasks</option>
                            </select>
                        </div>
                    </div>

                    {/* Add Menu */}
                    <div className="relative">
                        <button
                            onClick={() => setMenuOpen(!menuOpen)}
                            className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
                        >
                            <FaPlus /> Add
                        </button>

                        {menuOpen && (
                            <div className="absolute right-0 mt-2 border rounded-lg bg-gray-200 shadow-md z-20">
                                <button
                                    onClick={() => {
                                        handleAddNote();
                                        setMenuOpen(false);
                                    }}
                                    className="block w-full px-4 py-2 hover:bg-gray-100 text-left"
                                >
                                    + Add Note
                                </button>
                                <button
                                    onClick={() => {
                                        handleAddTask();
                                        setMenuOpen(false);
                                    }}
                                    className="block w-full px-4 py-2 hover:bg-gray-100 text-left"
                                >
                                    + Add Task
                                </button>
                            </div>
                        )}
                    </div>
                </div>

                {/* Cards Grid */}
                <div className="grid grid-cols-[repeat(auto-fill,minmax(200px,1fr))] gap-5 mt-4">
                    {[...visibleNotes, ...visibleTasks].length === 0 ?  <h1 className="text-xl font-semibold mb-8">Add new notes or tasks</h1> : ""}
                    {[...visibleNotes, ...visibleTasks].map((item) => (
                        <div key={item._id} className="relative group">
                            <NoteCard
                                note={{
                                    ...item,
                                    type: item.tasks ? "task" : "text",
                                }}
                                onOpen={handleOpenItem}
                            />
                            {/* Hover icons */}
                            <div className="absolute top-0 right-0 flex">
                                <button className="p-2 rounded-full bg-red-100 hover:bg-red-200" onClick={() => handleDelete(item, item.tasks ? "tasks" : "notes")}>
                                    <FiTrash2 />
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            </main>

            {/* Confirm Dialog */}
            <ConfirmDialog
                show={showConfirm}
                title="Delete Confirmation"
                message={`Are you sure you want to move this ${selectedType} to the Trash?`}
                onConfirm={confirmDelete}
                onCancel={() => setShowConfirm(false)}
            />
        </div>
    );
}
