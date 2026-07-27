import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import NoteCard from "../components/NoteCard";
import ConfirmDialog from "../components/ConfirmDialog";
import api from "../services/axios";
import { FaPlus, FaSort, FaFilter } from "react-icons/fa";
import { FiTrash2 } from "react-icons/fi";
import { logger } from "../utils/logger";
import { unwrapData, getErrorMessage } from "../utils/response";

export default function NotebookPage() {
  const { notebookId } = useParams();
  const navigate = useNavigate();

  const [notes, setNotes] = useState([]);
  const [tasks, setTasks] = useState([]);
  const [notebook, setNotebook] = useState({ title: "Loading..." });
  const [isLoading, setIsLoading] = useState(true);

  const [sortOption, setSortOption] = useState("date");
  const [filter, setFilter] = useState("all");
  const [menuOpen, setMenuOpen] = useState(false);

  // Edit/Delete modal states
  const [showConfirm, setShowConfirm] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);
  const [selectedType, setSelectedType] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      try {
        const [notesRes, tasksRes, notebookRes] = await Promise.all([
          api.get(`/notebook/${notebookId}/notes`),
          api.get(`/notebook/${notebookId}/tasks`),
          api.get(`/notebook/${notebookId}`),
        ]);
        setNotes(unwrapData(notesRes.data));
        setTasks(unwrapData(tasksRes.data));
        setNotebook(unwrapData(notebookRes.data));
        logger.info("Notebook page data loaded", { notebookId });
      } catch (err) {
        logger.error("Fetch error:", getErrorMessage(err));
      } finally {
        setIsLoading(false);
      }
    };
    if (notebookId) fetchData();
  }, [notebookId]);

  // Sort logic
  const sortItems = (arr) => {
    const safeItems = Array.isArray(arr) ? arr : [];
    if (sortOption === "name") {
      return [...safeItems].sort((a, b) =>
        (a?.title || "").localeCompare(b?.title || ""),
      );
    }
    return [...safeItems].sort((a, b) => {
      const aDate = new Date(a?.updatedAt || a?.createdAt || 0);
      const bDate = new Date(b?.updatedAt || b?.createdAt || 0);
      return bDate - aDate;
    });
  };

  // Filter + sort
  const visibleNotes =
    filter === "all" || filter === "notes" ? sortItems(notes) : [];
  const visibleTasks =
    filter === "all" || filter === "tasks" ? sortItems(tasks) : [];

  // Handlers
  const handleAddNote = () => navigate(`/notebook/${notebookId}/notes/new`);
  const handleAddTask = () => navigate(`/notebook/${notebookId}/tasks/new`);

  const handleOpenItem = (item) => {
    if (item.type === "text")
      navigate(`/notebook/${notebookId}/notes/${item._id}`);
    else navigate(`/notebook/${notebookId}/tasks/${item._id}`);
  };

  const handleDelete = (item, type) => {
    setSelectedItem(item);
    setSelectedType(type);
    setShowConfirm(true);
  };

  const confirmDelete = async () => {
    try {
      await api.put(
        `/notebook/${notebookId}/${selectedType}/${selectedItem._id}/trash`,
      );
      if (selectedType === "notes") {
        setNotes(notes.filter((n) => n._id !== selectedItem._id));
      } else {
        setTasks(tasks.filter((t) => t._id !== selectedItem._id));
      }
    } catch (err) {
      logger.error("Delete error:", getErrorMessage(err));
    }
    setShowConfirm(false);
  };

  return (
    <div
      className={`flex  h-full w-full overflow-x-hidden ${showConfirm ? "backdrop-blur-sm" : ""}`}
    >
      <main className="flex-1 min-w-0 overflow-y-auto overflow-x-hidden p-4 sm:p-6 relative">
        <button
          onClick={() => navigate(-1)}
          className="mb-4 px-4 py-2 bg-gray-200 rounded-lg hover:bg-gray-300"
        >
          ← Back
        </button>

        {isLoading ? (
          <div className="flex h-[70vh] items-center justify-center">
            <div className="mb-4 flex items-center gap-3 rounded-xl border border-slate-200 bg-white px-4 py-3 shadow-sm">
              <div className="h-5 w-5 animate-spin rounded-full border-2 border-blue-600 border-t-transparent" />
              <div>
                <p className="text-sm font-medium text-slate-800">
                  Loading notebook...
                </p>
                <p className="text-xs text-slate-500">
                  Fetching the latest notes and tasks.
                </p>
              </div>
            </div>
          </div>
        ) : (
          <>
            <h1 className="text-2xl font-semibold mb-6 sm:mb-8 break-words">
              {notebook.title}
            </h1>
            {/* Header */}
            <div className="flex flex-col lg:flex-row lg:justify-between lg:items-center gap-4 mb-6 border-b pb-4">
              <div className="flex flex-col sm:flex-row sm:flex-wrap gap-3 sm:gap-4">
                {/* Sort */}
                <button
                  className="flex items-center justify-center gap-2 px-3 py-2 bg-gray-200 rounded hover:bg-gray-300 w-full sm:w-auto"
                  onClick={() =>
                    setSortOption(sortOption === "date" ? "name" : "date")
                  }
                >
                  <FaSort /> Sort by {sortOption === "date" ? "Date" : "Name"}
                </button>

                {/* Filter */}
                <div className="flex items-center gap-2 w-full sm:w-auto">
                  <FaFilter className="shrink-0" />
                  <select
                    value={filter}
                    onChange={(e) => setFilter(e.target.value)}
                    className="border px-3 py-2 rounded w-full sm:w-auto"
                  >
                    <option value="all">All</option>
                    <option value="notes">Notes</option>
                    <option value="tasks">Tasks</option>
                  </select>
                </div>
              </div>

              {/* Add */}
              <div className="relative self-start sm:self-auto">
                <button
                  onClick={() => setMenuOpen(!menuOpen)}
                  className="flex items-center justify-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 w-full sm:w-auto"
                >
                  <FaPlus />
                  Add
                </button>

                {menuOpen && (
                  <div className="absolute right-0 mt-2 min-w-[170px] border rounded-lg bg-gray-200 shadow-md z-20">
                    <button
                      onClick={() => {
                        handleAddNote();
                        setMenuOpen(false);
                      }}
                      className="block w-full px-4 py-2 hover:bg-gray-100 text-left"
                    >
                      + Add Note
                    </button>
                    <button
                      onClick={() => {
                        handleAddTask();
                        setMenuOpen(false);
                      }}
                      className="block w-full px-4 py-2 hover:bg-gray-100 text-left"
                    >
                      + Add Task
                    </button>
                  </div>
                )}
              </div>
            </div>

            {/* Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-[repeat(auto-fill,minmax(200px,1fr))] gap-4 sm:gap-5 mt-4">
              {!isLoading && [...visibleNotes, ...visibleTasks].length === 0 ? (
                <h1 className="text-xl font-semibold">
                  Add new notes or tasks
                </h1>
              ) : (
                [...visibleNotes, ...visibleTasks].map((item) => (
                  <div key={item._id} className="relative group">
                    <NoteCard
                      note={{
                        ...item,
                        type: item.tasks ? "task" : "text",
                      }}
                      onOpen={handleOpenItem}
                    />
                    <div className="absolute top-2 right-2 flex opacity-100 sm:opacity-0 sm:group-hover:opacity-100 transition-opacity">
                      <button
                        className="p-2 rounded-full bg-red-100 hover:bg-red-200 shadow"
                        onClick={() =>
                          handleDelete(item, item.tasks ? "tasks" : "notes")
                        }
                      >
                        <FiTrash2 />
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>
          </>
        )}
      </main>

      <ConfirmDialog
        show={showConfirm}
        title="Delete Confirmation"
        message={`Are you sure you want to move this ${selectedType} to the Trash?`}
        onConfirm={confirmDelete}
        onCancel={() => setShowConfirm(false)}
      />
    </div>
  );
}
