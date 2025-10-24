import { useParams, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import api from "../services/axios";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import ConfirmDialog from "../components/ConfirmDialog";

export default function TaskPage() {
  const { notebookId, taskId } = useParams();
  const navigate = useNavigate();
  const [taskGroup, setTaskGroup] = useState({ title: "", tasks: [] });
  const [newTask, setNewTask] = useState("")
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [subTaskToDelete, setSubTaskToDelete] = useState(null);
  const [dirty, setDirty] = useState(false); // track typing

  // Determine current task group id (existing or newly created)
  const [currentTaskId, setCurrentTaskId] = useState(taskId || null);

  // --- Fetch existing task group ---
  useEffect(() => {
    if (!taskId) return; // new task, skip fetch
    const fetchTask = async () => {
      try {
        const res = await api.get(`/notebook/${notebookId}/tasks/${taskId}`);
        setTaskGroup(res.data);
      } catch (err) {
        console.error("Fetch error:", err);
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

    try {
      let savedTask;
      if (currentTaskId) {
        savedTask = await api.put(`/notebook/${notebookId}/tasks/${currentTaskId}`, group);
      } else {
        savedTask = await api.post(`/notebook/${notebookId}/tasks`, group);
        setCurrentTaskId(savedTask.data._id);
      }
      setTaskGroup(savedTask.data);
      setDirty(false);
      toast.success("Task group saved", { autoClose: 1000 });
      return savedTask.data;
    } catch (err) {
      console.error("Save failed:", err);
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
    // allow adding locally; if the task group exists on the server we'll create the subtask there
    setTaskGroup((prev) => ({
      ...prev,
      tasks: [...prev.tasks, { title: "" }],
    }));
    // if group exists, create subtask on server immediately and replace group from response
    if (currentTaskId) {
      (async () => {
        try {
          const res = await api.post(`/notebook/${notebookId}/tasks/task/${currentTaskId}/subtask`, { title: newTask });
          setTaskGroup(res.data);
          setNewTask("");
        } catch (err) {
          console.error("Add subtask failed:", err);
          toast.error("Failed to add subtask");
        }
      })();
    }
  };

  const handleSubtaskChange = (index, value) => {
    setTaskGroup((prev) => ({
      ...prev,
      tasks: prev.tasks.map((t, i) => (i === index ? { ...t, title: value } : t)),
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
        const res = await api.put(`/notebook/${notebookId}/tasks/task/${currentTaskId}/subtask/${sub._id}`, { title: sub.title, completed: !!sub.completed });
        setTaskGroup(res.data);
      } else {
        // create new subtask
        const res = await api.post(`/notebook/${notebookId}/tasks/task/${currentTaskId}/subtask`, { title: sub.title });
        setTaskGroup(res.data);
      }
      toast.success("Subtask saved", { autoClose: 800 });
    } catch (err) {
      console.error("Save subtask failed:", err);
      toast.error("Failed to save subtask");
    }
  };

  const handleDeleteSubtask = (index) => {
    const sub = taskGroup.tasks[index];
    setSubTaskToDelete({ index, title: sub.title });
    setShowDeleteConfirm(true);
  }

  const confirmDeleteSubtask = () => {
    const index = subTaskToDelete.index
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
          await api.delete(`/notebook/${notebookId}/tasks/task/${currentTaskId}/subtask/${sub._id}`);
          // refresh group from server
          const res = await api.get(`/notebook/${notebookId}/tasks/${currentTaskId}`);
          setTaskGroup(res.data);
          setSubTaskToDelete(null);
          setShowDeleteConfirm(false);
        } catch (err) {
          console.error("Delete subtask failed:", err);
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
      tasks: prev.tasks.map((t, i) => (i === index ? { ...t, completed: newCompleted } : t)),
    }));

    // persist toggle via subtask update endpoint if possible
    if (currentTaskId && sub && sub._id) {
      (async () => {
        try {
          const res = await api.put(`/notebook/${notebookId}/tasks/task/${currentTaskId}/subtask/${sub._id}`, { completed: newCompleted });
          setTaskGroup(res.data);
        } catch (err) {
          console.error("Toggle failed:", err);
          toast.error("Failed to update subtask");
          // revert optimistic update by refetching
          try {
            const fresh = await api.get(`/notebook/${notebookId}/tasks/${currentTaskId}`);
            setTaskGroup(fresh.data);
          } catch (e2) {
            console.error(e2);
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
                  className={`flex-1 bg-transparent border-none focus:outline-none ${t.completed ? "line-through text-gray-500" : ""
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
