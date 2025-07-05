
import React, { useState, useEffect } from 'react';
import { Plus, Calendar, Filter, CheckCircle2, Clock, AlertCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import TaskForm from './TaskForm';
import TaskItem from './TaskItem';
import TaskFilters from './TaskFilters';
import { Task, TaskCategory, TaskFilter } from '../types/task';
import {
  fetchTasks,
  createTask,
  updateTask as updateTaskApi,
  deleteTask as deleteTaskApi
} from '@/utils/tasks';

const TaskManager = () => {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [showTaskForm, setShowTaskForm] = useState(false);
  const [editingTask, setEditingTask] = useState<Task | null>(null);
  const [filters, setFilters] = useState<TaskFilter>({
    category: 'all',
    status: 'all',
    sortBy: 'deadline'
  });

  // Load tasks from localStorage on component mount
  useEffect(() => {
    const loadTasks = async () => {
      const data = await fetchTasks();
      setTasks(data);
    };
    loadTasks();
  }, []);

  // Save tasks to localStorage whenever tasks change
  useEffect(() => {
    localStorage.setItem('smart-tasks', JSON.stringify(tasks));
  }, [tasks]);

  const addTask = async (taskData: Omit<Task, 'id' | 'createdAt'>) => {
    const newTask = await createTask(taskData);
    setTasks(prev => [...prev, newTask]);
    setShowTaskForm(false);
  };


  const updateTask = async (id: string, updates: Partial<Task>) => {
    const updated = await updateTaskApi(id, updates);
    setTasks(prev => prev.map(task => task.id === id ? updated : task));
    setEditingTask(null);
  };



  const deleteTask = async (id: string) => {
    await deleteTaskApi(id);
    setTasks(prev => prev.filter(task => task.id !== id));
  };


  const toggleTaskComplete = async (id: string) => {
    const task = tasks.find(t => t.id === id);
    if (!task) return;
    const updated = await updateTaskApi(id, { completed: !task.completed });
    setTasks(prev => prev.map(t => t.id === id ? updated : t));
  };


  const handleEditTask = (task: Task) => {
    setEditingTask(task);
    setShowTaskForm(true);
  };

  const handleCancelEdit = () => {
    setEditingTask(null);
    setShowTaskForm(false);
  };

  // Filter and sort tasks
  const filteredTasks = tasks
    .filter(task => {
      if (filters.category !== 'all' && task.category !== filters.category) return false;
      if (filters.status === 'completed' && !task.completed) return false;
      if (filters.status === 'pending' && task.completed) return false;
      return true;
    })
    .sort((a, b) => {
      switch (filters.sortBy) {
        case 'deadline':
          if (!a.deadline && !b.deadline) return 0;
          if (!a.deadline) return 1;
          if (!b.deadline) return -1;
          return new Date(a.deadline).getTime() - new Date(b.deadline).getTime();
        case 'priority': {
          const priorityOrder = { high: 3, medium: 2, low: 1 };
          return priorityOrder[b.priority] - priorityOrder[a.priority];
        }
        case 'created':
          return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
        default:
          return 0;
      }
    });

  const getTaskStats = () => {
    const total = tasks.length;
    const completed = tasks.filter(t => t.completed).length;
    const overdue = tasks.filter(t =>
      !t.completed && t.deadline && new Date(t.deadline) < new Date()
    ).length;

    return { total, completed, overdue };
  };

  const stats = getTaskStats();

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
      <div className="max-w-6xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                Smart Task Manager
              </h1>
              <p className="text-gray-600 mt-2">Stay organized and productive</p>
            </div>
            <Button
              onClick={() => setShowTaskForm(true)}
              className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white shadow-lg hover:shadow-xl transition-all duration-300"
              size="lg"
            >
              <Plus className="w-5 h-5 mr-2" />
              Add Task
            </Button>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            <Card className="p-4 bg-white/70 backdrop-blur-sm border-0 shadow-md">
              <div className="flex items-center">
                <div className="p-2 bg-blue-100 rounded-lg mr-3">
                  <CheckCircle2 className="w-5 h-5 text-blue-600" />
                </div>
                <div>
                  <p className="text-sm text-gray-600">Total Tasks</p>
                  <p className="text-2xl font-bold text-gray-900">{stats.total}</p>
                </div>
              </div>
            </Card>
            <Card className="p-4 bg-white/70 backdrop-blur-sm border-0 shadow-md">
              <div className="flex items-center">
                <div className="p-2 bg-green-100 rounded-lg mr-3">
                  <CheckCircle2 className="w-5 h-5 text-green-600" />
                </div>
                <div>
                  <p className="text-sm text-gray-600">Completed</p>
                  <p className="text-2xl font-bold text-gray-900">{stats.completed}</p>
                </div>
              </div>
            </Card>
            <Card className="p-4 bg-white/70 backdrop-blur-sm border-0 shadow-md">
              <div className="flex items-center">
                <div className="p-2 bg-red-100 rounded-lg mr-3">
                  <AlertCircle className="w-5 h-5 text-red-600" />
                </div>
                <div>
                  <p className="text-sm text-gray-600">Overdue</p>
                  <p className="text-2xl font-bold text-gray-900">{stats.overdue}</p>
                </div>
              </div>
            </Card>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Filters Sidebar */}
          <div className="lg:col-span-1">
            <TaskFilters
              filters={filters}
              onFiltersChange={setFilters}
              taskCounts={{
                all: tasks.length,
                work: tasks.filter(t => t.category === 'work').length,
                personal: tasks.filter(t => t.category === 'personal').length,
                learning: tasks.filter(t => t.category === 'learning').length,
                completed: tasks.filter(t => t.completed).length,
                pending: tasks.filter(t => !t.completed).length
              }}
            />
          </div>

          {/* Task List */}
          <div className="lg:col-span-3">
            <Card className="bg-white/70 backdrop-blur-sm border-0 shadow-lg">
              <div className="p-6">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-xl font-semibold text-gray-900">
                    {filters.category === 'all' ? 'All' :
                      filters.category.charAt(0).toUpperCase() + filters.category.slice(1)} Tasks
                    <span className="ml-2 text-sm text-gray-500">({filteredTasks.length})</span>
                  </h2>
                </div>

                {filteredTasks.length === 0 ? (
                  <div className="text-center py-12">
                    <div className="w-24 h-24 mx-auto mb-4 bg-gray-100 rounded-full flex items-center justify-center">
                      <CheckCircle2 className="w-12 h-12 text-gray-400" />
                    </div>
                    <h3 className="text-lg font-medium text-gray-900 mb-2">No tasks found</h3>
                    <p className="text-gray-600 mb-4">
                      {tasks.length === 0
                        ? "Start by adding your first task!"
                        : "Try adjusting your filters or add a new task."
                      }
                    </p>
                    <Button
                      onClick={() => setShowTaskForm(true)}
                      variant="outline"
                      className="border-gray-300"
                    >
                      <Plus className="w-4 h-4 mr-2" />
                      Add Task
                    </Button>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {filteredTasks.map(task => (
                      <TaskItem
                        key={task.id}
                        task={task}
                        onToggleComplete={toggleTaskComplete}
                        onEdit={handleEditTask}
                        onDelete={deleteTask}
                      />
                    ))}
                  </div>
                )}
              </div>
            </Card>
          </div>
        </div>

        {/* Task Form Modal */}
        {showTaskForm && (
          <TaskForm
            task={editingTask}
            onSubmit={editingTask ?
              (data) => updateTask(editingTask.id, data) :
              addTask
            }
            onCancel={handleCancelEdit}
          />
        )}
      </div>
    </div>
  );
};

export default TaskManager;
