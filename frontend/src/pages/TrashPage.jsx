import { useEffect, useState } from "react";
import NoteCard from "../components/NoteCard";
import api from "../services/axios";
import { FiRotateCcw, FiTrash2 } from "react-icons/fi";
import ConfirmDialog from "../components/ConfirmDialog";

export default function TrashPage() {
  const [trashData, setTrashData] = useState({ notes: [], notebooks: [], tasks: [] });
  const [loading, setLoading] = useState(true);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [showRestoreConfirm, setShowRestoreConfirm] = useState(false);
  const [notebookToDelete, setNotebookToDelete] = useState(null);
  const [notebookToRestore, setNotebookToRestore] = useState(null);
  const [deleteType, setDeleteType] = useState("");
  const [restoreType, setRestoreType] = useState("");

  const fetchTrash = async () => {
    try {
      const { data } = await api.get("/trash");
      setTrashData(data);
    } catch (error) {
      console.error("Failed to fetch trash:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (type, notebook) => {
    setNotebookToDelete(notebook);
    setDeleteType(type)
    setShowDeleteConfirm(true);
  }

  const confirmRestore = async () => {
    try {
      let endpoint = "";

      switch (restoreType) {
        case "notebook":
          endpoint = `/notebook/${notebookToRestore._id}`;
          break;

        case "note":
          endpoint = `/notebook/${notebookToRestore.notebook}/notes/${notebookToRestore._id}`;
          break;

        case "task":
          endpoint = `/notebook/${notebookToRestore.notebook}/tasks/${notebookToRestore._id}`;
          break;

        default:
          throw new Error("Invalid type");
      }

      await api.put(`${endpoint}/trash`);

      setTrashData(prev => ({
        ...prev,
        [restoreType + "s"]: prev[restoreType + "s"].filter(item => item._id !== notebookToRestore._id)
      }));
      setNotebookToRestore(null);
      setShowRestoreConfirm(false);
    } catch (error) {
      console.error("Permanent delete failed:", error);
    }
  };

  const handleRestore = async (type, notebook) => {
    setNotebookToRestore(notebook);
    setRestoreType(type);
    setShowRestoreConfirm(true);
  }

  const confirmDelete = async () => {
    try {
      let endpoint = "";

      switch (deleteType) {
        case "notebook":
          endpoint = `/notebook/${notebookToDelete._id}`;
          break;

        case "note":
          endpoint = `/notebook/${notebookToDelete.notebook}/notes/${notebookToDelete._id}`;
          break;

        case "task":
          endpoint = `/notebook/${notebookToDelete._id}/tasks/${notebookToDelete._id}`;
          break;

        default:
          throw new Error("Invalid type");
      }

      await api.delete(endpoint);

      setTrashData(prev => ({
        ...prev,
        [deleteType + "s"]: prev[deleteType + "s"].filter(item => item._id !== notebookToDelete._id)
      }));
      setNotebookToDelete(null);
      setShowDeleteConfirm(false);
    } catch (error) {
      console.error("Permanent delete failed:", error);
    }
  };


  useEffect(() => {
    fetchTrash();
  }, []);

  if (loading) return <div className="flex justify-center items-center h-screen">Loading...</div>;

  return (
    <div className="flex">
      <main className="flex-1 p-8 bg-gray-50 min-h-screen transition-all">
        <h1 className="text-2xl font-semibold mb-6">Bin</h1>

        {["notebooks", "notes", "tasks"].map(section => (
          <div key={section} className="mb-8">
            <h2 className="text-xl font-medium mb-4 capitalize">{section}</h2>
            {trashData[section].length > 0 ? (
              <div className="grid grid-cols-[repeat(auto-fill,minmax(200px,1fr))] gap-5 mt-4">
                {trashData[section].map(item => (
                  <div key={item._id} className="relative group">
                    <NoteCard note={item} />

                    <div className="absolute top-0 right-0">
                      <button
                        onClick={() =>
                          handleRestore(section.slice(0, -1), item)
                        }
                        className="p-2 rounded-full bg-green-100 hover:bg-green-200"
                        title="Restore"
                      >
                        <FiRotateCcw />
                      </button>

                      <button
                        onClick={() =>
                          handleDelete(section.slice(0, -1), item)
                        }
                        className="p-2 rounded-full bg-red-100 hover:bg-red-200"
                        title="Delete Permanently"
                      >
                        <FiTrash2 />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-gray-500 italic">No deleted {section}.</p>
            )}
          </div>
        ))}
        <ConfirmDialog
          show={showRestoreConfirm}
          title={`Restore “${notebookToRestore?.title}”?`}
          message="This wil restore the file"
          onConfirm={confirmRestore}
          onCancel={() => setShowRestoreConfirm(false)}
          text="Restore"
        />
        <ConfirmDialog
          show={showDeleteConfirm}
          title={`Delete “${notebookToDelete?.title}”?`}
          message="This action cannot be undone."
          onConfirm={confirmDelete}
          onCancel={() => setShowDeleteConfirm(false)}
        />
      </main>
    </div>
  );
}
