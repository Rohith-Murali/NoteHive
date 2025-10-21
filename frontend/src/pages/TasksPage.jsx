import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import api from "../services/axios";

export default function TaskPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [note, setNote] = useState(null);
  const [tasks, setTasks] = useState([]);

  useEffect(() => {
    const fetchNote = async () => {
      try {
        const { data } = await api.get(`/notes/${id}`);
        setNote(data);
        setTasks(data.tasks || []);
      } catch (error) {
        console.error("Error fetching task list:", error);
      }
    };
    fetchNote();
  }, [id]);

  const addTask = async () => {
    try {
      const { data } = await api.post(`/notes/${id}/tasks`, { text: "" });
      setTasks((prev) => [...prev, data]);
    } catch (error) {
      console.error("Error adding task:", error);
    }
  };

  const updateTask = async (taskId, updates) => {
    try {
      await api.put(`/notes/${id}/tasks/${taskId}`, updates);
      setTasks((prev) =>
        prev.map((t) => (t._id === taskId ? { ...t, ...updates } : t))
      );
    } catch (error) {
      console.error("Error updating task:", error);
    }
  };

  const deleteTask = async (taskId) => {
    try {
      await api.delete(`/notes/${id}/tasks/${taskId}`);
      setTasks((prev) => prev.filter((t) => t._id !== taskId));
    } catch (error) {
      console.error("Error deleting task:", error);
    }
  };

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-4">
        <button onClick={() => navigate("/dashboard")} className="text-accent">
          ← Back
        </button>
        <button
          onClick={addTask}
          className="bg-accent text-primary px-4 py-2 rounded hover:opacity-90"
        >
          + Add Task
        </button>
      </div>

      <h2 className="text-2xl font-semibold mb-4">
        {note?.title || "Task List"}
      </h2>

      <div className="space-y-2">
        {tasks.map((task) => (
          <div
            key={task._id}
            className="flex items-center justify-between bg-white border border-secondary rounded px-3 py-2"
          >
            <input
              type="checkbox"
              checked={task.completed}
              onChange={(e) => updateTask(task._id, { completed: e.target.checked })}
            />
            <input
              type="text"
              value={task.text}
              onChange={(e) => updateTask(task._id, { text: e.target.value })}
              onBlur={(e) => updateTask(task._id, { text: e.target.value })}
              className={`flex-1 mx-3 outline-none bg-transparent ${
                task.completed ? "line-through text-secondary" : ""
              }`}
              placeholder="Task description..."
            />
            <button
              onClick={() => deleteTask(task._id)}
              className="text-red-500 hover:opacity-80"
            >
              ✕
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
