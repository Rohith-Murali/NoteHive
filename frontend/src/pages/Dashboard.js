import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import NoteCard from "../components/NoteCard";
import EditModal from "../components/EditModal";
import ConfirmDialog from "../components/ConfirmDialog";
import api from "../services/axios";
import { FaSort } from "react-icons/fa";
import "bootstrap-icons/font/bootstrap-icons.css";
import {FiEdit3, FiTrash2 } from "react-icons/fi";

export default function Dashboard() {
  const [notebooks, setNotebooks] = useState([]);
  const [newTitle, setNewTitle] = useState("");
  const [showInput, setShowInput] = useState(false);
  const [editNotebook, setEditNotebook] = useState(null);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [notebookToDelete, setNotebookToDelete] = useState(null);
  const [sortOption, setSortOption] = useState("date");
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
  const handleDelete = async (notebook) => {
    setNotebookToDelete(notebook);
    setShowDeleteConfirm(true);
  }

  const handleEdit = (notebook) => {
    setEditNotebook(notebook);

  }
  const confirmDelete = async () => {
    try {
      await api.put(`/notebook/${notebookToDelete._id}/trash`);
      setNotebooks((prev) =>
        prev.filter((n) => n._id !== notebookToDelete._id)
      );
      setNotebookToDelete(null);
      setShowDeleteConfirm(false);
    } catch (err) {
      console.error("Delete error:", err);
    }
  };

  const confirmEdit = async () => {
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
  const visibleNotebooks = sortItems(notebooks);

  const handleOpen = (notebook) => {
    navigate(`/notebook/${notebook._id}`);
  };

  return (
    <div className="h-screen flex-1 overflow-y-auto p-6">
        <h1 className="text-2xl font-semibold mb-8">My Notebooks</h1>

        {visibleNotebooks.length === 0 ? (
          <p className="text-gray-500 text-center mt-10">
            No notebooks yet. Add one below!
          </p>
        ) : (
          <>
            <div className="flex gap-4 items-cente mb-6 pb-6">
              {/* Sort */}
              <button
                className="flex items-center gap-2 px-3 py-2 bg-gray-200 rounded hover:bg-gray-300"
                onClick={() => setSortOption(sortOption === "date" ? "name" : "date")}
              >
                <FaSort /> Sort by {sortOption === "date" ? "Date" : "Name"}
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 mb-10">
              {visibleNotebooks.map((notebook) => (
                <div key={notebook._id} className="relative group">
                  <NoteCard note={notebook} onOpen={() => handleOpen(notebook)} />
                  <div className="absolute top-0 right-0 flex">
                    <button className="p-2 rounded-full bg-green-100 hover:bg-green-200" onClick={() => handleEdit(notebook)}>
                      <FiEdit3 />
                    </button>
                    <button className="p-2 rounded-full bg-red-100 hover:bg-red-200" onClick={() => handleDelete(notebook)}>
                      <FiTrash2 />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </>
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
          onSave={confirmEdit}
          onClose={() => setEditNotebook(null)}
          onEnter={confirmEdit}
        />

        <ConfirmDialog
          show={showDeleteConfirm}
          title={`Move “${notebookToDelete?.title}” to trash?`}
          message="The file will be moved to the Trash."
          onConfirm={confirmDelete}
          onCancel={() => setShowDeleteConfirm(false)}
        />
    </div>
  );
}
