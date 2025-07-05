
import React, { useState } from 'react';
import { CheckCircle2, Circle, Calendar, Clock, AlertCircle, Edit2, Trash2, Tag } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Task } from '../types/task';

interface TaskItemProps {
  task: Task;
  onToggleComplete: (id: string) => void;
  onEdit: (task: Task) => void;
  onDelete: (id: string) => void;
}

const TaskItem: React.FC<TaskItemProps> = ({ task, onToggleComplete, onEdit, onDelete }) => {
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'work': return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'personal': return 'bg-green-100 text-green-800 border-green-200';
      case 'learning': return 'bg-purple-100 text-purple-800 border-purple-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'text-red-600';
      case 'medium': return 'text-yellow-600';
      case 'low': return 'text-green-600';
      default: return 'text-gray-600';
    }
  };

  const getDeadlineStatus = () => {
    if (!task.deadline) return null;
    
    const deadline = new Date(task.deadline);
    const today = new Date();
    const diffTime = deadline.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays < 0) {
      return { status: 'overdue', text: `${Math.abs(diffDays)} days overdue`, color: 'text-red-600' };
    } else if (diffDays === 0) {
      return { status: 'today', text: 'Due today', color: 'text-orange-600' };
    } else if (diffDays <= 3) {
      return { status: 'soon', text: `${diffDays} days left`, color: 'text-yellow-600' };
    } else {
      return { status: 'future', text: `${diffDays} days left`, color: 'text-gray-600' };
    }
  };

  const deadlineStatus = getDeadlineStatus();

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  };

  const handleDelete = () => {
    if (showDeleteConfirm) {
      onDelete(task.id);
      setShowDeleteConfirm(false);
    } else {
      setShowDeleteConfirm(true);
      setTimeout(() => setShowDeleteConfirm(false), 3000);
    }
  };

  return (
    <Card className={`p-4 bg-white border transition-all duration-200 hover:shadow-md ${
      task.completed ? 'opacity-75' : ''
    }`}>
      <div className="flex items-start space-x-3">
        {/* Completion Toggle */}
        <button
          onClick={() => onToggleComplete(task.id)}
          className={`flex-shrink-0 mt-0.5 transition-colors duration-200 ${
            task.completed ? 'text-green-600' : 'text-gray-400 hover:text-green-600'
          }`}
        >
          {task.completed ? (
            <CheckCircle2 className="w-5 h-5" />
          ) : (
            <Circle className="w-5 h-5" />
          )}
        </button>

        {/* Task Content */}
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <h3 className={`font-medium text-gray-900 ${
                task.completed ? 'line-through text-gray-500' : ''
              }`}>
                {task.title}
              </h3>
              
              {task.description && (
                <p className={`text-sm mt-1 ${
                  task.completed ? 'text-gray-400' : 'text-gray-600'
                }`}>
                  {task.description}
                </p>
              )}

              {/* Tags and Info */}
              <div className="flex items-center flex-wrap gap-2 mt-3">
                {/* Category Tag */}
                <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium border ${getCategoryColor(task.category)}`}>
                  <Tag className="w-3 h-3 mr-1" />
                  {task.category.charAt(0).toUpperCase() + task.category.slice(1)}
                </span>

                {/* Priority Indicator */}
                <span className={`inline-flex items-center text-xs font-medium ${getPriorityColor(task.priority)}`}>
                  <AlertCircle className="w-3 h-3 mr-1" />
                  {task.priority.charAt(0).toUpperCase() + task.priority.slice(1)}
                </span>

                {/* Deadline */}
                {task.deadline && (
                  <span className={`inline-flex items-center text-xs ${deadlineStatus?.color || 'text-gray-600'}`}>
                    <Calendar className="w-3 h-3 mr-1" />
                    {formatDate(task.deadline)}
                    {deadlineStatus && (
                      <span className="ml-1">({deadlineStatus.text})</span>
                    )}
                  </span>
                )}
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex items-center space-x-1 ml-4">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => onEdit(task)}
                className="text-gray-400 hover:text-blue-600 h-8 w-8 p-0"
              >
                <Edit2 className="w-4 h-4" />
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={handleDelete}
                className={`h-8 w-8 p-0 transition-colors ${
                  showDeleteConfirm 
                    ? 'text-red-600 bg-red-50 hover:bg-red-100' 
                    : 'text-gray-400 hover:text-red-600'
                }`}
              >
                <Trash2 className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Deadline Warning */}
      {deadlineStatus?.status === 'overdue' && !task.completed && (
        <div className="mt-3 p-2 bg-red-50 border border-red-200 rounded-md">
          <div className="flex items-center text-red-800 text-sm">
            <AlertCircle className="w-4 h-4 mr-2" />
            This task is {deadlineStatus.text}
          </div>
        </div>
      )}
    </Card>
  );
};

export default TaskItem;
