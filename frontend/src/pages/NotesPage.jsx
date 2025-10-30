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
  const [initialNote, setInitialNote] = useState({ title: "", content: "" });
  const [dirty, setDirty] = useState(false); // will only become true when actual change is made
  const saveTimer = useRef(null);

  // --- Fetch Note from DB ---
  useEffect(() => {
    if (!noteId) return;
    const fetchNote = async () => {
      try {
        const res = await api.get(`/notebook/${notebookId}/notes/${noteId}`);
        setNote(res.data);
        setInitialNote({
          title: res.data.title || "",
          content: res.data.content || "",
        });
        setLastSaved(res.data.updatedAt ? new Date(res.data.updatedAt) : null);
        setDirty(false); // ensure autosave doesn't trigger on load
      } catch (err) {
        console.error("Error fetching note:", err);
      }
    };
    fetchNote();
  }, [noteId, notebookId]);

  // --- Detect actual user edits ---
  const handleChange = (value, field = "content") => {
    setNote((prev) => ({ ...prev, [field]: value }));

    // Mark dirty only when user changes something different from initial
    if (
      !dirty &&
      ((field === "title" && value.trim() !== initialNote.title.trim()) ||
        (field === "content" && value.trim() !== initialNote.content.trim()))
    ) {
      setDirty(true);
    }
  };

  // --- Autosave (only if dirty and real change) ---
  useEffect(() => {
    if (!dirty) return; // skip unless user edited
    if (!notebookId) return;
    if (note.title.trim() === "" && note.content.trim() === "") return;

    clearTimeout(saveTimer.current);
    saveTimer.current = setTimeout(async () => {
      try {
        let savedNote;
        if (currentNoteId) {
          savedNote = await api.put(
            `/notebook/${notebookId}/notes/${currentNoteId}`,
            { ...note, updatedAt: new Date() }
          );
        } else {
          savedNote = await api.post(`/notebook/${notebookId}/notes`, note);
          setCurrentNoteId(savedNote.data._id);
        }

        // Update UI with DB data
        setLastSaved(new Date(savedNote.data.updatedAt || new Date()));
        setInitialNote({ title: note.title, content: note.content });
        setDirty(false);
        toast.success("Note saved", { autoClose: 1000 });
      } catch (err) {
        console.error("Autosave failed:", err);
        toast.error("Autosave failed");
      }
    }, 2000);

    return () => clearTimeout(saveTimer.current);
  }, [note, notebookId, currentNoteId, dirty]);

  // --- Quill toolbar config ---
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
          className="text-2xl font-semibold w-full mb-2 border-b p-2 focus:outline-none bg-transparent"
        />
        {lastSaved && (
          <p className="text-sm text-gray-500">
            Last edited {lastSaved.toLocaleString()}
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
