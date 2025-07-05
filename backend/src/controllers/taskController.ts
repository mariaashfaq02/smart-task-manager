import { Request, Response } from "express";
import Task from "../model/Task";

//GET /api/tasks
export const getTasks =async (_req:Request,res:Response)=>{
    const tasks = await Task.find().sort({deadline:1});
    res.json(tasks);
};

//POST /api/tasks
export const createTask=async(req:Request,res:Response)=>{
    const newTask=new Task(req.body);
    const saved =await newTask.save();
    res.status(201).json(saved);
};

//PUT /api/tasks/:id
export const updateTask=async(req:Request,res:Response)=>{
    const updated = await Task.findByIdAndUpdate(req.params.id,req.body,{new:true});
    res.json(updated);
}

//DELETE /api/tasks/:id
export  const deleteTask= async  (req:Request,res:Response)=>{
    await Task.findByIdAndDelete(req.params.id);
    res.status(204).send();
}