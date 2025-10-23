import { useParams, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import api from "../services/axios";

export default function TaskPage() {
  const { notebookId, taskId } = useParams();
  const navigate = useNavigate();
  const [taskGroup, setTaskGroup] = useState({ tasks: [] });
  const [newTask, setNewTask] = useState("");
  const [loading, setLoading] = useState(true);

  // 🔹 Fetch the current task group
  useEffect(() => {
    const fetchTask = async () => {
      try {
        const res = await api.get(`/notebook/${notebookId}/tasks/${taskId}`);
        setTaskGroup(res.data);
      } catch (err) {
        console.error("Fetch error:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchTask();
  }, [taskId, notebookId]);

  // 🔹 Add a new subtask
  const handleAddSubtask = async () => {
    if (!newTask.trim()) return;
    try {
      const updated = { ...taskGroup, tasks: [...taskGroup.tasks, { title: newTask }] };
      await api.put(`/notebook/${notebookId}/tasks/${taskId}`, updated);
      setTaskGroup(updated);
      setNewTask("");
    } catch (err) {
      console.error("Add task error:", err);
    }
  };

  const handleToggle = async (index) => {
    try {
      const subTask = taskGroup.tasks[index];
      const res = await api.put(`/notebook/${notebookId}/tasks/${taskId}/toggle`, {
        subTaskId: subTask._id,
      });
      setTaskGroup(res.data);
    } catch (err) {
      console.error("Toggle error:", err);
    }
  };

  // 🔹 Delete a single subtask
  const handleDeleteSubtask = async (index) => {
    if (!window.confirm("Delete this task?")) return;
    try {
      const updated = {
        ...taskGroup,
        tasks: taskGroup.tasks.filter((_, i) => i !== index),
      };
      await api.put(`/notebook/${notebookId}/tasks/${taskId}`, updated);
      setTaskGroup(updated);
    } catch (err) {
      console.error("Delete task error:", err);
    }
  };

  // 🔹 Delete entire task group
  const handleDeleteGroup = async () => {
    if (!window.confirm("Delete this entire task group?")) return;
    try {
      await api.delete(`/notebook/${notebookId}/tasks/${taskId}`);
      navigate(`/notebook/${notebookId}`);
    } catch (err) {
      console.error("Delete group error:", err);
    }
  };

  if (loading) return <p className="p-6 text-gray-500">Loading tasks...</p>;

  return (
    <div className="p-6">
      <button
        onClick={() => navigate(-1)}
        className="mb-4 px-4 py-2 bg-gray-300 rounded-lg hover:bg-gray-400"
      >
        ← Back
      </button>

      <h2 className="text-2xl font-semibold mb-4">Task Group</h2>

      {/* Subtasks List */}
      <div className="space-y-2">
        {taskGroup.tasks.length === 0 ? (
          <p className="text-gray-500">No tasks yet. Add one below!</p>
        ) : (
          taskGroup.tasks.map((t, i) => (
            <div
              key={t._id || i}
              className="flex justify-between items-center border p-2 rounded-lg"
            >
              <div className="flex items-center gap-3">
                <input
                  type="checkbox"
                  checked={!!t.completed}
                  onChange={() => handleToggle(i)}
                  className="cursor-pointer"
                />
                <span className={t.completed ? "line-through text-gray-500" : ""}>
                  {t.title}
                </span>
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

      {/* Delete Group */}
      <button
        onClick={handleDeleteGroup}
        className="mt-6 bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600"
      >
        Delete Task Group
      </button>
    </div>
  );
}
