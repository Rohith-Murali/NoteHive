import mongoose from "mongoose";

const userDetailsSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      unique: true,
    },
    name: { type: String },
    bio: { type: String, default: "" },
    avatar: { type: String, default: "" }, // profile picture URL
    themePreference: {
      type: String,
      enum: ["light", "dark", "system"],
      default: "system",
    },
    fontSizePreference: { type: Number, default: 16 },
    passwordLastChanged: { type: Date },
    lastLogin: { type: Date, default: Date.now },
    joinedAt: { type: Date, default: Date.now },
  },
  { timestamps: true }
);

const UserDetails = mongoose.model("UserDetails", userDetailsSchema);

export default UserDetails;
