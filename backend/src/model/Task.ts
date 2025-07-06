import mongoose from "mongoose";

const TaskSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    description: String,
    category: {
      type: String,
      enum: ["work", "personal", "learning"],
      default: "personal",
    },
    priority: {
      type: String,
      enum: ["high", "medium", "low"],
      default: "medium",
    },
    deadline: Date,
    isCompleted: { type: Boolean, default: false },
  },
  // Automatically adds createdAt and updatedAt
  { timestamps: true }
);

export default mongoose.model("Task",TaskSchema)