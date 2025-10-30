import { useParams, useNavigate } from "react-router-dom";
import { useState, useEffect, useRef } from "react";
import api from "../services/axios";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import ReactQuill from "react-quill-new";

export default function NotePage() {
  const { notebookId, noteId } = useParams();
  const navigate = useNavigate();
  const [note, setNote] = useState({ title: "", content: "" });
  const [lastSaved, setLastSaved] = useState(null);
  const [currentNoteId, setCurrentNoteId] = useState(noteId || null);
  const [dirty, setDirty] = useState(false); // track first typing
  const saveTimer = useRef(null);

  // --- Handle change ---
  const handleChange = (value, field = "content") => {
    setNote(prev => ({ ...prev, [field]: value }));

    // Only mark dirty if there is a title
    if (!dirty && field === "title" && value.trim() !== "") {
      setDirty(true);
    } else if (!dirty && currentNoteId && field === "content") {
      // existing note, typing content counts as dirty
      setDirty(true);
    }
  };
  useEffect(() => {
    if (!noteId) return; // New note, skip fetch
    const fetchNote = async () => {
      try {
        const res = await api.get(`/notebook/${notebookId}/notes/${noteId}`);
        setNote(res.data);
      } catch (err) {
        console.error("Error fetching note:", err);
      }
    };
    fetchNote();
  }, [noteId, notebookId]);
  // --- Autosave ---
  useEffect(() => {
    if (!dirty) return;           // don’t autosave until first typing
    if (!notebookId) return;      // safety
    if (note.title.trim() === "") return; // title is required

    clearTimeout(saveTimer.current);
    saveTimer.current = setTimeout(async () => {
      try {
        let savedNote;
        if (currentNoteId) {
          // update existing note
          savedNote = await api.put(`/notebook/${notebookId}/notes/${currentNoteId}`, note);
        } else {
          // create new note
          savedNote = await api.post(`/notebook/${notebookId}/notes`, note);
          setCurrentNoteId(savedNote.data._id);
        }
        setLastSaved(new Date());
        toast.success("Note saved automatically", { autoClose: 1000 });
      } catch (err) {
        console.error("Autosave failed:", err);
        toast.error("Autosave failed");
      }
    }, 2000);

    return () => clearTimeout(saveTimer.current);
  }, [note, notebookId, currentNoteId, dirty]);

  // --- Toolbar options ---
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
        className="mb-4 px-4 py-2 bg-gray-200 rounded-lg hover:bg-gray-300"
      >
        ← Back
      </button>

      <div className="mb-4">
        <input
          value={note.title}
          onChange={(e) => handleChange(e.target.value, "title")}
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
        <ReactQuill
          value={note.content}
          onChange={(value) => handleChange(value)}
          modules={modules}
          formats={formats}
          placeholder="Start writing..."
          className="h-[70vh] rounded-lg border shadow-sm"
        />
      </div>
    </div>
  );
}
