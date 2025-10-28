import mongoose from "mongoose";

const notebookSchema = mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    title: { type: String, required: [true, "Notebook title is required"] },
    description: { type: String },
    isDeleted: { type: Boolean, default: false },
  },
  { timestamps: true }
);

const Notebook = mongoose.model("Notebook", notebookSchema);
export default Notebook;
