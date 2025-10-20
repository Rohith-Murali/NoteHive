import mongoose from "mongoose";

const noteSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    title: {
      type: String,
      required: [true, "Title is required"],
      trim: true,
      maxlength: [100, "Title cannot exceed 100 characters"],
    },
    type: {
      type: String,
      enum: ["text", "task"],
      default: "text",
    },
    content: {
      type: String,
      required: function () {
        return this.type === "text";
      },
    },
    tasks: [
      {
        text: { type: String, required: true },
        completed: { type: Boolean, default: false },
      },
    ],
    pinned: { type: Boolean, default: false },
    archived: { type: Boolean, default: false },
  },
  { timestamps: true }
);

export default mongoose.model("Note", noteSchema);
