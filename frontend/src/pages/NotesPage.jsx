import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import api from "../services/axios";

export default function NotePage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [note, setNote] = useState({ title: "", content: "" });

  useEffect(() => {
    const fetchNote = async () => {
      try {
        const { data } = await api.get(`/notes/${id}`);
        setNote(data);
      } catch (error) {
        console.error("Error fetching note:", error);
      }
    };
    fetchNote();
  }, [id]);

  const handleSave = async () => {
    try {
      await api.put(`/notes/${id}`, note);
      alert("Note saved!");
    } catch (error) {
      console.error("Error saving note:", error);
    }
  };

  const handleDelete = async () => {
    if (!window.confirm("Delete this note?")) return;
    try {
      await api.delete(`/notes/${id}`);
      navigate("/dashboard");
    } catch (error) {
      console.error("Error deleting note:", error);
    }
  };

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-4">
        <button onClick={() => navigate("/dashboard")} className="text-accent">
          ← Back
        </button>
        <div className="space-x-2">
          <button
            onClick={handleSave}
            className="bg-accent text-primary px-4 py-2 rounded hover:opacity-90"
          >
            Save
          </button>
          <button
            onClick={handleDelete}
            className="bg-red-500 text-white px-4 py-2 rounded hover:opacity-90"
          >
            Delete
          </button>
        </div>
      </div>

      <input
        type="text"
        value={note.title}
        onChange={(e) => setNote({ ...note, title: e.target.value })}
        className="w-full text-2xl font-semibold border-b border-secondary mb-4 outline-none bg-transparent"
        placeholder="Note Title"
      />

      <textarea
        value={note.content}
        onChange={(e) => setNote({ ...note, content: e.target.value })}
        className="w-full h-[70vh] p-3 border border-secondary rounded resize-none outline-none bg-white"
        placeholder="Write your note..."
      />
    </div>
  );
}
