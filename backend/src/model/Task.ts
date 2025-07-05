import mongoose from "mongoose";

const TaskSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    description: String,
    category: {
      type: String,
      enum: ["Work", "Personal", "Learning"],
      default: "Personal",
    },
    priority: {
      type: String,
      enum: ["High", "Medium", "Low"],
      default: "Medium",
    },
    deadline: Date,
    isCompleted: { type: Boolean, default: false },
  },
  // Automatically adds createdAt and updatedAt
  { timestamps: true }
);

export default mongoose.model("Task",TaskSchema)