
import React, { useState, useEffect } from 'react';
import { X, Calendar, Tag, AlertCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Task, TaskCategory, TaskPriority } from '../types/task';

interface TaskFormProps {
  task?: Task | null;
  onSubmit: (task: Omit<Task, 'id' | 'createdAt'>) => void;
  onCancel: () => void;
}

const TaskForm: React.FC<TaskFormProps> = ({ task, onSubmit, onCancel }) => {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    category: 'personal' as TaskCategory,
    priority: 'medium' as TaskPriority,
    deadline: '',
    completed: false
  });

  useEffect(() => {
    if (task) {
      setFormData({
        title: task.title,
        description: task.description || '',
        category: task.category,
        priority: task.priority,
        deadline: task.deadline ? task.deadline.split('T')[0] : '',
        completed: task.completed
      });
    }
  }, [task]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.title.trim()) return;

    onSubmit({
      ...formData,
      deadline: formData.deadline || null,
      description: formData.description || null
    });

    // Reset form
    setFormData({
      title: '',
      description: '',
      category: 'personal',
      priority: 'medium',
      deadline: '',
      completed: false
    });
  };

  const getCategoryColor = (category: TaskCategory) => {
    switch (category) {
      case 'work': return 'bg-blue-100 text-blue-800';
      case 'personal': return 'bg-green-100 text-green-800';
      case 'learning': return 'bg-purple-100 text-purple-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getPriorityColor = (priority: TaskPriority) => {
    switch (priority) {
      case 'high': return 'bg-red-100 text-red-800';
      case 'medium': return 'bg-yellow-100 text-yellow-800';
      case 'low': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
      <Card className="w-full max-w-md bg-white shadow-2xl border-0">
        <div className="p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold text-gray-900">
              {task ? 'Edit Task' : 'Add New Task'}
            </h2>
            <Button
              variant="ghost"
              size="sm"
              onClick={onCancel}
              className="text-gray-400 hover:text-gray-600"
            >
              <X className="w-5 h-5" />
            </Button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <Label htmlFor="title" className="text-sm font-medium text-gray-700">
                Task Title *
              </Label>
              <Input
                id="title"
                type="text"
                value={formData.title}
                onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
                placeholder="Enter task title..."
                className="mt-1"
                required
              />
            </div>

            <div>
              <Label htmlFor="description" className="text-sm font-medium text-gray-700">
                Description
              </Label>
              <Textarea
                id="description"
                value={formData.description}
                onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                placeholder="Add details about your task..."
                className="mt-1 resize-none"
                rows={3}
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label className="text-sm font-medium text-gray-700">
                  Category
                </Label>
                <Select
                  value={formData.category}
                  onValueChange={(value: TaskCategory) => 
                    setFormData(prev => ({ ...prev, category: value }))
                  }
                >
                  <SelectTrigger className="mt-1">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="work">
                      <div className="flex items-center">
                        <span className={`inline-block w-2 h-2 rounded-full mr-2 bg-blue-500`}></span>
                        Work
                      </div>
                    </SelectItem>
                    <SelectItem value="personal">
                      <div className="flex items-center">
                        <span className={`inline-block w-2 h-2 rounded-full mr-2 bg-green-500`}></span>
                        Personal
                      </div>
                    </SelectItem>
                    <SelectItem value="learning">
                      <div className="flex items-center">
                        <span className={`inline-block w-2 h-2 rounded-full mr-2 bg-purple-500`}></span>
                        Learning
                      </div>
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label className="text-sm font-medium text-gray-700">
                  Priority
                </Label>
                <Select
                  value={formData.priority}
                  onValueChange={(value: TaskPriority) => 
                    setFormData(prev => ({ ...prev, priority: value }))
                  }
                >
                  <SelectTrigger className="mt-1">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="high">
                      <div className="flex items-center">
                        <AlertCircle className="w-4 h-4 mr-2 text-red-500" />
                        High
                      </div>
                    </SelectItem>
                    <SelectItem value="medium">
                      <div className="flex items-center">
                        <AlertCircle className="w-4 h-4 mr-2 text-yellow-500" />
                        Medium
                      </div>
                    </SelectItem>
                    <SelectItem value="low">
                      <div className="flex items-center">
                        <AlertCircle className="w-4 h-4 mr-2 text-green-500" />
                        Low
                      </div>
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div>
              <Label htmlFor="deadline" className="text-sm font-medium text-gray-700">
                Deadline
              </Label>
              <div className="relative mt-1">
                <Input
                  id="deadline"
                  type="date"
                  value={formData.deadline}
                  onChange={(e) => setFormData(prev => ({ ...prev, deadline: e.target.value }))}
                  min={new Date().toISOString().split('T')[0]}
                  className="pl-10"
                />
                <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
              </div>
            </div>

            <div className="flex space-x-3 pt-4">
              <Button
                type="button"
                variant="outline"
                onClick={onCancel}
                className="flex-1"
              >
                Cancel
              </Button>
              <Button
                type="submit"
                className="flex-1 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
              >
                {task ? 'Update Task' : 'Add Task'}
              </Button>
            </div>
          </form>
        </div>
      </Card>
    </div>
  );
};

export default TaskForm;
