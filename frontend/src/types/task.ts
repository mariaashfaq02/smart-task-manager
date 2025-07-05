
export type TaskCategory = 'work' | 'personal' | 'learning';
export type TaskPriority = 'low' | 'medium' | 'high';
export type TaskSortBy = 'deadline' | 'priority' | 'created';
export type TaskStatus = 'all' | 'completed' | 'pending';

export interface Task {
  id: string;
  title: string;
  description?: string | null;
  category: TaskCategory;
  priority: TaskPriority;
  deadline?: string | null;
  completed: boolean;
  createdAt: string;
}

export interface TaskFilter {
  category: TaskCategory | 'all';
  status: TaskStatus;
  sortBy: TaskSortBy;
}
