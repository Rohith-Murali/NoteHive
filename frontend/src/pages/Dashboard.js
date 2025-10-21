import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Sidebar from "../components/Sidebar";
import NoteCard from "../components/NoteCard";
import api from "../services/axios";

export default function Dashboard() {
  const [notes, setNotes] = useState([]);
  const navigate = useNavigate();

  const fetchNotes = async () => {
    try {
      const res = await api.get("/notes");
      setNotes(res.data);
    } catch (err) {
      console.error("Fetch error:", err);
    }
  };

  useEffect(() => {
    fetchNotes();
  });

  const handleNew = () => navigate("/editor");

  const handleOpen = (note) => {
    if (note.type === "text") navigate(`/notes/${note._id}`);
    else navigate(`/tasks/${note._id}`);
  };

  return (
    <div className="flex h-screen">
      <Sidebar />
      <main className="flex-1 overflow-y-auto p-6">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-semibold">My Notes</h1>
          <button
            onClick={handleNew}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            + New
          </button>
        </div>

        {notes.length === 0 ? (
          <p className="text-gray-500 text-center mt-10">
            No notes yet. Click “+ New” to create one!
          </p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {notes.map((note) => (
              <NoteCard key={note._id} note={note} onOpen={handleOpen} />
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
