import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Sidebar from "../components/Sidebar";
import NoteCard from "../components/NoteCard";
import EditModal from "../components/EditModal";
import ConfirmDialog from "../components/ConfirmDialog";
import api from "../services/axios";
import "bootstrap-icons/font/bootstrap-icons.css";
import "../app.css";

export default function Dashboard() {
  const [notebooks, setNotebooks] = useState([]);
  const [newTitle, setNewTitle] = useState("");
  const [showInput, setShowInput] = useState(false);
  const [editNotebook, setEditNotebook] = useState(null);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [notebookToDelete, setNotebookToDelete] = useState(null);
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

  const handleAddNotebook = async () => {
    if (!newTitle.trim()) return;
    try {
      const res = await api.post("/notebook", { title: newTitle });
      setNotebooks((prev) => [...prev, res.data]);
      setNewTitle("");
      setShowInput(false);
    } catch (err) {
      console.error("Add error:", err);
    }
  };

  const handleDelete = async () => {
    try {
      await api.delete(`/notebook/${notebookToDelete._id}`);
      setNotebooks((prev) =>
        prev.filter((n) => n._id !== notebookToDelete._id)
      );
      setNotebookToDelete(null);
      setShowDeleteConfirm(false);
    } catch (err) {
      console.error("Delete error:", err);
    }
  };

  const handleEdit = async () => {
    if (!editNotebook.title.trim()) return;
    try {
      const res = await api.put(`/notebook/${editNotebook._id}`, {
        title: editNotebook.title,
      });
      setNotebooks((prev) =>
        prev.map((n) => (n._id === res.data._id ? res.data : n))
      );
      setEditNotebook(null);
    } catch (err) {
      console.error("Edit error:", err);
    }
  };

  const handleOpen = (notebook) => {
    navigate(`/notebook/${notebook._id}`);
  };

  return (
    <div className="flex h-screen">
      <Sidebar />
      <main className="flex-1 overflow-y-auto p-6">
        <h1 className="text-2xl font-semibold mb-8">My Notebooks</h1>

        {notebooks.length === 0 ? (
          <p className="text-gray-500 text-center mt-10">
            No notebooks yet. Add one below!
          </p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-10">
            {notebooks.map((notebook) => (
              <div key={notebook._id} className="relative group">
                <NoteCard note={notebook} onOpen={() => handleOpen(notebook)} />
                <div className="absolute top-2 right-2 flex">
                  <button className="icon-btn edit" onClick={() => handleEdit(notebook)}>
                    <i className="bi bi-pencil-square"></i>
                  </button>
                  <button className="icon-btn delete" onClick={() => handleDelete(notebook._id)}>
                    <i className="bi bi-trash"></i>
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Add Notebook Section */}
        <div className="flex flex-col items-center mt-4">
          {!showInput ? (
            <button
              onClick={() => setShowInput(true)}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
            >
              + Add Notebook
            </button>
          ) : (
            <div className="flex gap-2">
              <input
                type="text"
                value={newTitle}
                onChange={(e) => setNewTitle(e.target.value)}
                placeholder="Enter notebook title"
                className="border rounded-lg px-3 py-2"
                onKeyDown={(e) => e.key === "Enter" && handleAddNotebook()}
                autoFocus
              />
              <button
                onClick={handleAddNotebook}
                className="px-3 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
              >
                Save
              </button>
              <button
                onClick={() => setShowInput(false)}
                className="px-3 py-2 bg-gray-300 rounded-lg hover:bg-gray-400"
              >
                Cancel
              </button>
            </div>
          )}
        </div>

        {/* Reusable Components */}
        <EditModal
          show={!!editNotebook}
          title="Edit Notebook"
          value={editNotebook?.title || ""}
          onChange={(val) =>
            setEditNotebook((prev) => ({ ...prev, title: val }))
          }
          onSave={handleEdit}
          onClose={() => setEditNotebook(null)}
          onEnter={handleEdit}
        />

        <ConfirmDialog
          show={showDeleteConfirm}
          title={`Delete “${notebookToDelete?.title}”?`}
          message="This action cannot be undone."
          onConfirm={handleDelete}
          onCancel={() => setShowDeleteConfirm(false)}
        />
      </main>
    </div>
  );
}
