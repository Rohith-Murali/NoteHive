import mongoose from "mongoose";

const noteSchema = mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    notebook: { type: mongoose.Schema.Types.ObjectId, ref: "Notebook", required: true },
    title: { type: String, required: [true, "Note title is required"] },
    content: { type: String, default: "" },
  },
  { timestamps: true }
);

const Note = mongoose.model("Note", noteSchema);
export default Note;
