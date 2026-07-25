import { useParams, useNavigate } from "react-router-dom";
import { useState, useEffect, useRef } from "react";
import api from "../services/axios";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import ReactQuill from "react-quill-new";
import { logger } from "../utils/logger";
import { unwrapData, getErrorMessage } from "../utils/response";
import { validateMinLength } from "../utils/validation";

export default function NotePage() {
  const { notebookId, noteId } = useParams();
  const navigate = useNavigate();
  const [note, setNote] = useState({ title: "", content: "" });
  const [lastSaved, setLastSaved] = useState(null);
  const [isLoading, setIsLoading] = useState(Boolean(noteId));
  const [currentNoteId, setCurrentNoteId] = useState(noteId || null);
  const [initialNote, setInitialNote] = useState({ title: "", content: "" });
  const [dirty, setDirty] = useState(false); // will only become true when actual change is made
  const [titleTouched, setTitleTouched] = useState(false);
  const saveTimer = useRef(null);
  const titleInputRef = useRef(null);
  const SAVE_DELAY_MS = 300;

  // --- Fetch Note from DB ---
  useEffect(() => {
    if (!noteId) return;
    const fetchNote = async () => {
      setIsLoading(true);
      try {
        const res = await api.get(`/notebook/${notebookId}/notes/${noteId}`);
        const fetchedNote = unwrapData(res.data);
        setNote(fetchedNote);
        setInitialNote({
          title: fetchedNote.title || "",
          content: fetchedNote.content || "",
        });
        setLastSaved(
          fetchedNote.updatedAt ? new Date(fetchedNote.updatedAt) : null,
        );
        setDirty(false); // ensure autosave doesn't trigger on load
      } catch (err) {
        logger.error("Error fetching note:", getErrorMessage(err));
      } finally {
        setIsLoading(false);
      }
    };
    fetchNote();
  }, [noteId, notebookId]);

  useEffect(() => {
    if (!noteId && !currentNoteId) {
      titleInputRef.current?.focus();
    }
  }, [noteId, currentNoteId]);

  const validateTitle = (value, shouldToast = false) => {
    const trimmedTitle = value?.trim() ?? "";

    if (trimmedTitle.length === 0) {
      if (shouldToast) {
        toast.dismiss();
        toast.error("Note title is required", {
          toastId: "note-title-required",
        });
      }
      return "Note title is required";
    }

    const titleError = validateMinLength(trimmedTitle, 2, "Note title");
    if (shouldToast && titleError) {
      toast.dismiss();
      toast.error(titleError, { toastId: "note-title-min" });
    }

    return titleError;
  };

  const handleTitleBlur = () => {
    setTitleTouched(true);
    validateTitle(note.title, true);
  };

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

    if (note.title.trim().length < 2 && titleTouched) {
      return;
    }

    if (!titleTouched && note.title.trim().length === 0) {
      return;
    }

    clearTimeout(saveTimer.current);
    saveTimer.current = setTimeout(async () => {
      try {
        let savedNote;
        const safeNote = {
          title: note.title?.trim() || "Untitled Note",
          content: note.content || "",
          updatedAt: new Date(),
        };

        if (currentNoteId) {
          savedNote = await api.put(
            `/notebook/${notebookId}/notes/${currentNoteId}`,
            safeNote,
          );
        } else {
          savedNote = await api.post(`/notebook/${notebookId}/notes`, safeNote);
          const createdNote = unwrapData(savedNote.data);
          setCurrentNoteId(createdNote._id || currentNoteId);
          setInitialNote({
            title: createdNote.title || safeNote.title,
            content: createdNote.content || safeNote.content,
          });
        }

        const savedPayload = unwrapData(savedNote.data);

        // Update UI with DB data
        setLastSaved(new Date(savedPayload.updatedAt || new Date()));
        setInitialNote({
          title: savedPayload.title || safeNote.title,
          content: savedPayload.content || safeNote.content,
        });
        setDirty(false);
        toast.success("Note saved", { autoClose: 1000 });
      } catch (err) {
        logger.error("Autosave failed:", getErrorMessage(err));
        toast.dismiss();
        toast.error("Autosave failed", { toastId: "note-autosave-failed" });
      }
    }, SAVE_DELAY_MS);

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
          ref={titleInputRef}
          value={note.title}
          onChange={(e) => handleChange(e.target.value, "title")}
          onBlur={handleTitleBlur}
          placeholder="Untitled Note"
          className="text-2xl font-semibold w-full mb-2 border-b p-2 focus:outline-none bg-transparent"
          autoFocus={!noteId && !currentNoteId}
        />
        {lastSaved && (
          <p className="text-sm text-gray-500">
            Last edited {lastSaved.toLocaleString()}
          </p>
        )}
      </div>

      {isLoading && noteId && (
        <div className="mb-4 flex items-center gap-3 rounded-xl border border-slate-200 bg-white px-4 py-3 shadow-sm">
          <div className="h-5 w-5 animate-spin rounded-full border-2 border-blue-600 border-t-transparent" />
          <div>
            <p className="text-sm font-medium text-slate-800">
              Loading note...
            </p>
            <p className="text-xs text-slate-500">
              Fetching the latest content.
            </p>
          </div>
        </div>
      )}

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
