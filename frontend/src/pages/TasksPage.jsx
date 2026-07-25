import { useParams, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import api from "../services/axios";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import ConfirmDialog from "../components/ConfirmDialog";
import { logger } from "../utils/logger";
import { unwrapData, getErrorMessage } from "../utils/response";
import { validateMinLength } from "../utils/validation";

export default function TaskPage() {
  const { notebookId, taskId } = useParams();
  const navigate = useNavigate();
  const [taskGroup, setTaskGroup] = useState({ title: "", tasks: [] });
  const [newTask, setNewTask] = useState("");
  const [isLoading, setIsLoading] = useState(Boolean(taskId));
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [subTaskToDelete, setSubTaskToDelete] = useState(null);
  const [dirty, setDirty] = useState(false); // track typing

  // Determine current task group id (existing or newly created)
  const [currentTaskId, setCurrentTaskId] = useState(taskId || null);

  // --- Fetch existing task group ---
  useEffect(() => {
    if (!taskId) return; // new task, skip fetch
    const fetchTask = async () => {
      setIsLoading(true);
      try {
        const res = await api.get(`/notebook/${notebookId}/tasks/${taskId}`);
        setTaskGroup(unwrapData(res.data));
      } catch (err) {
        logger.error("Fetch error:", getErrorMessage(err));
      } finally {
        setIsLoading(false);
      }
    };
    fetchTask();
  }, [taskId, notebookId]);

  const saveTaskGroup = async (group = taskGroup) => {
    // don't create/save until there's a title (except when updating existing)
    if (!group.title || group.title.trim() === "") {
      // if group already exists (has id), allow saving even if title becomes empty
      if (!currentTaskId) return null;
    }

    const titleError = validateMinLength(group.title, 2, "Task title");
    if (titleError) {
      toast.error(titleError);
      return null;
    }

    try {
      const safeGroup = {
        title: group.title?.trim() || "Untitled Task",
        tasks: Array.isArray(group.tasks) ? group.tasks : [],
      };

      let savedTask;
      if (currentTaskId) {
        savedTask = await api.put(
          `/notebook/${notebookId}/tasks/${currentTaskId}`,
          safeGroup,
        );
      } else {
        savedTask = await api.post(`/notebook/${notebookId}/tasks`, safeGroup);
        setCurrentTaskId(unwrapData(savedTask.data)._id);
      }
      const normalizedTask = unwrapData(savedTask.data);
      setTaskGroup(normalizedTask);
      setDirty(false);
      toast.success("Task group saved", { autoClose: 1000 });
      return normalizedTask;
    } catch (err) {
      logger.error("Save failed:", getErrorMessage(err));
      toast.error("Save failed");
      return null;
    }
  };

  // --- Handlers ---
  const handleTitleChange = (value) => {
    setTaskGroup((prev) => ({ ...prev, title: value }));
    if (!dirty && value.trim() !== "") setDirty(true);
  };

  const handleAddSubtask = () => {
    const trimmedTitle = newTask.trim();
    if (!trimmedTitle) {
      toast.error("Subtask title cannot be empty");
      return;
    }

    const optimisticSubtask = {
      title: trimmedTitle,
      tempId: Date.now().toString(),
    };

    setTaskGroup((prev) => ({
      ...prev,
      tasks: [...(prev.tasks || []), optimisticSubtask],
    }));
    setNewTask("");

    if (currentTaskId) {
      (async () => {
        try {
          const res = await api.post(
            `/notebook/${notebookId}/tasks/${currentTaskId}/subtask`,
            { title: trimmedTitle },
          );
          setTaskGroup((prev) => {
            const normalizedTask = unwrapData(res.data);
            return normalizedTask &&
              typeof normalizedTask === "object" &&
              !Array.isArray(normalizedTask)
              ? normalizedTask
              : prev;
          });
        } catch (err) {
          logger.error("Add subtask failed:", getErrorMessage(err));
          toast.error("Failed to add subtask");
          setTaskGroup((prev) => ({
            ...prev,
            tasks: (prev.tasks || []).filter(
              (task) => task.tempId !== optimisticSubtask.tempId,
            ),
          }));
        }
      })();
    }
  };

  const handleSubtaskChange = (index, value) => {
    setTaskGroup((prev) => ({
      ...prev,
      tasks: prev.tasks.map((t, i) =>
        i === index ? { ...t, title: value } : t,
      ),
    }));
    if (!dirty) setDirty(true);
  };

  const handleSubtaskBlur = async (index) => {
    // On leaving a subtask field, save the subtask (create or update)
    const sub = taskGroup.tasks[index];
    // if group doesn't exist yet, avoid creating group here — let title blur create it
    if (!currentTaskId) return;

    try {
      if (sub._id) {
        // update existing subtask
        const res = await api.put(
          `/notebook/${notebookId}/tasks/${currentTaskId}/subtask/${sub._id}`,
          { title: sub.title, completed: !!sub.completed },
        );
        setTaskGroup(unwrapData(res.data));
      } else {
        // create new subtask
        const res = await api.post(
          `/notebook/${notebookId}/tasks/${currentTaskId}/subtask`,
          { title: sub.title },
        );
        setTaskGroup(unwrapData(res.data));
      }
      toast.success("Subtask saved", { autoClose: 800 });
    } catch (err) {
      logger.error("Save subtask failed:", getErrorMessage(err));
      toast.error("Failed to save subtask");
    }
  };

  const handleDeleteSubtask = (index) => {
    const sub = taskGroup.tasks[index];
    setSubTaskToDelete({ index, title: sub.title });
    setShowDeleteConfirm(true);
  };

  const confirmDeleteSubtask = () => {
    const index = subTaskToDelete.index;
    const sub = taskGroup.tasks[index];
    // remove locally first
    setTaskGroup((prev) => ({
      ...prev,
      tasks: prev.tasks.filter((_, i) => i !== index),
    }));

    // If subtask exists on server, delete via API
    if (currentTaskId && sub && sub._id) {
      (async () => {
        try {
          await api.delete(
            `/notebook/${notebookId}/tasks/${currentTaskId}/subtask/${sub._id}`,
          );
          // refresh group from server
          const res = await api.get(
            `/notebook/${notebookId}/tasks/${currentTaskId}`,
          );
          setTaskGroup(unwrapData(res.data));
          setSubTaskToDelete(null);
          setShowDeleteConfirm(false);
        } catch (err) {
          logger.error("Delete subtask failed:", getErrorMessage(err));
          toast.error("Failed to delete subtask");
        }
      })();
    }
  };

  const handleToggle = (index) => {
    const sub = taskGroup.tasks[index];
    const newCompleted = !sub.completed;

    // optimistic update
    setTaskGroup((prev) => ({
      ...prev,
      tasks: prev.tasks.map((t, i) =>
        i === index ? { ...t, completed: newCompleted } : t,
      ),
    }));

    // persist toggle via subtask update endpoint if possible
    if (currentTaskId && sub && sub._id) {
      (async () => {
        try {
          const res = await api.put(
            `/notebook/${notebookId}/tasks/${currentTaskId}/subtask/${sub._id}`,
            { completed: newCompleted },
          );
          setTaskGroup(unwrapData(res.data));
        } catch (err) {
          logger.error("Toggle failed:", getErrorMessage(err));
          toast.error("Failed to update subtask");
          // revert optimistic update by refetching
          try {
            const fresh = await api.get(
              `/notebook/${notebookId}/tasks/${currentTaskId}`,
            );
            setTaskGroup(unwrapData(fresh.data));
          } catch (e2) {
            logger.error("Revert toggle failed:", getErrorMessage(e2));
          }
        }
      })();
    }
  };

  return (
    <div className="p-6">
      <ToastContainer position="bottom-right" theme="dark" />
      <button
        onClick={() => navigate(-1)}
        className="mb-4 px-4 py-2 bg-gray-300 rounded-lg hover:bg-gray-400"
      >
        ← Back
      </button>

      {isLoading && taskId && (
        <div className="mb-4 flex items-center gap-3 rounded-xl border border-slate-200 bg-white px-4 py-3 shadow-sm">
          <div className="h-5 w-5 animate-spin rounded-full border-2 border-blue-600 border-t-transparent" />
          <div>
            <p className="text-sm font-medium text-slate-800">
              Loading task...
            </p>
            <p className="text-xs text-slate-500">
              Fetching the latest content.
            </p>
          </div>
        </div>
      )}

      <input
        value={taskGroup.title}
        onChange={(e) => handleTitleChange(e.target.value)}
        onBlur={async () => {
          if (taskGroup.title && taskGroup.title.trim() !== "") {
            await saveTaskGroup();
          }
        }}
        onKeyDown={async (e) => {
          if (e.key === "Enter") {
            e.preventDefault();
            if (taskGroup.title && taskGroup.title.trim() !== "") {
              await saveTaskGroup();
            }
          }
        }}
        placeholder="Task Group Title"
        className="text-2xl font-semibold w-full mb-4 border-b p-2 focus:outline-none"
      />

      <div className="space-y-2">
        {(taskGroup.tasks || []).length === 0 ? (
          <p className="text-gray-500">No subtasks yet. Add one below!</p>
        ) : (
          (taskGroup.tasks || []).map((t, i) => (
            <div
              key={i}
              className="flex justify-between items-center border p-2 rounded-lg"
            >
              <div className="flex items-center gap-3 flex-1">
                <input
                  type="checkbox"
                  checked={!!t.completed}
                  onChange={() => handleToggle(i)}
                  className="cursor-pointer"
                />
                <input
                  type="text"
                  value={t.title}
                  onChange={(e) => handleSubtaskChange(i, e.target.value)}
                  onBlur={() => handleSubtaskBlur(i)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      e.preventDefault();
                      // blur will trigger save handler
                      e.currentTarget.blur();
                    }
                  }}
                  className={`flex-1 bg-transparent border-none focus:outline-none ${
                    t.completed ? "line-through text-gray-500" : ""
                  }`}
                />
              </div>
              <button
                onClick={() => handleDeleteSubtask(i)}
                className="text-red-500 hover:text-red-700"
              >
                ✖
              </button>
            </div>
          ))
        )}
      </div>

      {/* Add Task Input */}
      <div className="mt-4 flex gap-2">
        <input
          value={newTask}
          onChange={(e) => setNewTask(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              e.preventDefault();
              handleAddSubtask();
            }
          }}
          placeholder="New task..."
          className="border rounded-lg px-3 py-2 flex-1"
        />
        <button
          onClick={handleAddSubtask}
          className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
        >
          + Add
        </button>
      </div>
      <ConfirmDialog
        show={showDeleteConfirm}
        title={`Delete “${subTaskToDelete?.title}”?`}
        message="This action cannot be undone."
        onConfirm={confirmDeleteSubtask}
        onCancel={() => setShowDeleteConfirm(false)}
      />
    </div>
  );
}
