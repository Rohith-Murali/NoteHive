import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Sidebar from "../components/Sidebar";
import NoteCard from "../components/NoteCard";
import api from "../services/axios";

export default function Dashboard() {
  const [notebooks, setNotebooks] = useState([]);
  const [newTitle, setNewTitle] = useState("");
  const navigate = useNavigate();

  const fetchNotebooks = async () => {
    try {
      const res = await api.get("/notebook");
      setNotebooks(res.data);
    } catch (err) {
      console.error("Fetch error:", err);
    }
  };

  useEffect(() => {
    fetchNotebooks();
  }, []);

  // Create new notebook
  const handleAddNotebook = async () => {
    if (!newTitle.trim()) return;
    try {
      const res = await api.post("/notebook", { title: newTitle });
      setNotebooks((prev) => [...prev, res.data]);
      setNewTitle("");
    } catch (err) {
      console.error("Add error:", err);
    }
  };

  // Delete notebook
  const handleDelete = async (id) => {
    if (!window.confirm("Delete this notebook?")) return;
    try {
      await api.delete(`/notebook/${id}`);
      setNotebooks((prev) => prev.filter((n) => n._id !== id));
    } catch (err) {
      console.error("Delete error:", err);
    }
  };

  // Open notebook
  const handleOpen = (notebook) => {
    navigate(`/notebook/${notebook._id}`);
  };

  return (
    <div className="flex h-screen">
      <Sidebar />

      <main className="flex-1 overflow-y-auto p-6">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-semibold">My Notebooks</h1>
          <div className="flex gap-2">
            <input
              type="text"
              value={newTitle}
              onChange={(e) => setNewTitle(e.target.value)}
              placeholder="Notebook title"
              className="border rounded-lg px-3 py-2"
            />
            <button
              onClick={handleAddNotebook}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
            >
              + Add
            </button>
          </div>
        </div>

        {notebooks.length === 0 ? (
          <p className="text-gray-500 text-center mt-10">
            No notebooks yet. Add one above!
          </p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {notebooks.map((notebook) => (
              <div key={notebook._id} className="relative">
                <NoteCard note={notebook} onOpen={() => handleOpen(notebook)} />
                <button
                  onClick={() => handleDelete(notebook._id)}
                  className="absolute top-2 right-2 text-red-500 hover:text-red-700"
                >
                  🗑
                </button>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
