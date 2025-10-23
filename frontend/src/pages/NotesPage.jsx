import { useParams, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import api from "../services/axios";

export default function NotePage() {
  const { notebookId, noteId } = useParams();
  const navigate = useNavigate();
  const [note, setNote] = useState({ title: "", content: "" });

  useEffect(() => {
    const fetchNote = async () => {
      const res = await api.get(`/notebook/${notebookId}/notes/${noteId}`);
      setNote(res.data);
    };
    fetchNote();
  }, [noteId, notebookId]);

  const handleSave = async () => {
    await api.put(`/notebook/${notebookId}/notes/${noteId}`, note);
    alert("Saved!");
  };

  const handleDelete = async () => {
    if (window.confirm("Delete this note?")) {
      await api.delete(`/notebook/${notebookId}/notes/${noteId}`);
      navigate(`/notebook/${notebookId}`);
    }
  };

  return (
    <div className="p-6">
      <button onClick={() => navigate(-1)} className="mb-4 px-4 py-2 bg-gray-300 rounded-lg">
        ← Back
      </button>
      <input
        value={note.title}
        onChange={(e) => setNote({ ...note, title: e.target.value })}
        className="text-2xl font-semibold w-full mb-4 border-b p-2"
      />
      <textarea
        value={note.content}
        onChange={(e) => setNote({ ...note, content: e.target.value })}
        className="w-full h-96 border p-3 rounded-lg"
      />
      <div className="flex justify-end gap-3 mt-4">
        <button onClick={handleDelete} className="bg-red-500 text-white px-4 py-2 rounded-lg">
          Delete
        </button>
        <button onClick={handleSave} className="bg-blue-600 text-white px-4 py-2 rounded-lg">
          Save
        </button>
      </div>
    </div>
  );
}
