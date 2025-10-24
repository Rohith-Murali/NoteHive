import { useParams, useNavigate } from "react-router-dom";
import { useState, useEffect, useRef } from "react";
import ReactQuill from "react-quill-new";
import "react-quill-new/dist/quill.snow.css";
import api from "../services/axios";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export default function NotePage() {
  const { notebookId, noteId } = useParams();
  const navigate = useNavigate();
  const [note, setNote] = useState({ title: "", content: "", updatedAt: "" });
  const [lastSaved, setLastSaved] = useState(null);
  const saveTimer = useRef(null);

  // --- Fetch Note ---
  useEffect(() => {
    const fetchNote = async () => {
      try {
        const res = await api.get(`/notebook/${notebookId}/notes/${noteId}`);
        setNote(res.data);
      } catch (err) {
        console.error("Error fetching note:", err);
      }
    };
    fetchNote();
  }, [notebookId, noteId]);

  // --- Autosave ---
  useEffect(() => {
    if (!noteId || !note.title) return;

    // debounce-like autosave (2s after stop typing)
    clearTimeout(saveTimer.current);
    saveTimer.current = setTimeout(async () => {
      try {
        await api.put(`/notebook/${notebookId}/notes/${noteId}`, note);
        setLastSaved(new Date());
        toast.success("Note saved automatically", { autoClose: 1000 });
      } catch (err) {
        console.error("Autosave failed:", err);
        toast.error("Autosave failed");
      }
    }, 2000);

    return () => clearTimeout(saveTimer.current);
  }, [note, noteId, notebookId]);

  // --- Toolbar Options ---
  const modules = {
    toolbar: [
      [{ header: [1, 2, 3, false] }],
      ["bold", "italic", "underline", "strike"],
      [{ list: "ordered" }, { list: "bullet" }],
      [{ align: [] }],
      ["blockquote", "code-block"],
      ["link", "image"],
      ["clean"],
    ],
  };

  const formats = [
    "header",
    "bold",
    "italic",
    "underline",
    "strike",
    "list",
    "bullet",
    "align",
    "blockquote",
    "code-block",
    "link",
    "image",
  ];

  return (
    <div className="p-6">
      <ToastContainer position="bottom-right" theme="dark" />
      <button
        onClick={() => navigate(-1)}
        className="mb-4 px-4 py-2 bg-gray-300 rounded-lg hover:bg-gray-400"
      >
        ← Back
      </button>

      <div className="mb-4">
        <input
          value={note.title}
          onChange={(e) => setNote({ ...note, title: e.target.value })}
          placeholder="Untitled Note"
          className="text-2xl font-semibold w-full mb-2 border-b p-2 focus:outline-none"
        />
        {lastSaved && (
          <p className="text-sm text-gray-500">
            Last edited {lastSaved.toLocaleTimeString()}
          </p>
        )}
      </div>

      <div className="relative">
        <div className="sticky top-0 z-10 bg-white border-b border-gray-200">
          {/* Quill toolbar automatically rendered here */}
        </div>

        <ReactQuill
          value={note.content}
          onChange={(value) => setNote({ ...note, content: value })}
          modules={modules}
          formats={formats}
          placeholder="Start writing..."
          className="h-[70vh] bg-white rounded-lg border shadow-sm"
        />
      </div>
    </div>
  );
}
