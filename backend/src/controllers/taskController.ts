import { Request, Response } from "express";
import Task from "../model/Task";

//GET /api/tasks
export const getTasks =async (_req:Request,res:Response)=>{
    const tasks = await Task.find().sort({deadline:1});
    res.json(tasks);
};


//POST /api/tasks
export const createTask = async (req: Request, res: Response) => {
  try {
    const {
      title,
      description,
      category,
      priority,
      deadline,
      completed,
    } = req.body;

    const newTask = new Task({
      title,
      description,
      category,
      priority,
      deadline,
      isCompleted: completed,
    });

    const saved = await newTask.save();

    res.status(201).json({
      ...saved.toObject(),
      completed: saved.isCompleted,
    });
  } catch (err: any) {
    console.error("Error creating task:", err);

    res.status(500).json({
      error: "Failed to create task",
      message: err.message || "Unknown error",
      details: err.errors || err, // useful for Mongoose validation errors
    });
  }
};


//PUT /api/tasks/:id
export const updateTask = async (req: Request, res: Response) => {
  try {
    const updated = await Task.findByIdAndUpdate(req.params.id, req.body, { new: true });

    if (!updated) {
      console.warn(`Task not found for ID: ${req.params.id}`);
      return res.status(404).json({ error: "Task not found" });
    }

    res.json({
      ...updated.toObject(),
      completed: updated.isCompleted, 
    });
  } catch (err) {
    console.error("Error updating task:", err);
    res.status(500).json({ error: "Failed to update task" });
  }
};


//DELETE /api/tasks/:id
export  const deleteTask= async  (req:Request,res:Response)=>{
    await Task.findByIdAndDelete(req.params.id);
    res.status(204).send();
}