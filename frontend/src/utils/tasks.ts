import axios from "axios";
import { Task } from "@/types/task";

const API_BASE =import.meta.env.VITE_API_URL;

export const fetchTasks = async (): Promise<Task[]> => {
  const res = await axios.get(`${API_BASE}/tasks`);
  return res.data.map((task: any) => ({
    ...task,
    id: task._id,
    completed: task.isCompleted,
  }));
};


export const createTask = async (task: Omit<Task, 'id' | 'createdAt'>): Promise<Task> => {
  const res = await axios.post(`${API_BASE}/tasks`, task);
  return res.data;
};


export const updateTask = async (id: string, updates: any): Promise<Task> => {
  const res = await axios.put(`${API_BASE}/tasks/${id}`, updates);
  const data = res.data;
  return {
    ...data,
    id: data._id,
    completed: data.isCompleted
  };
};


export const deleteTask = async (id: string): Promise<void> => {
  await axios.delete(`${API_BASE}/tasks/${id}`);
};