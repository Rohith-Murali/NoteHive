import mongoose from "mongoose";

const taskSchema = mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    notebook: { type: mongoose.Schema.Types.ObjectId, ref: "Notebook", required: true },
    title: { type: String, required: [true, "Task group title is required"] },
    tasks: [
      {
        title: { type: String, required: [true, "Task title is required"] },
        completed: { type: Boolean, default: false },
      },
    ],
    dueDate: { type: Date },
  },
  { timestamps: true }
);

const Task = mongoose.model("Task", taskSchema);
export default Task;