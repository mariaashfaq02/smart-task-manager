
import React from 'react';
import { Filter, Calendar, CheckCircle2, Clock, Tag, TrendingUp } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { TaskFilter } from '../types/task';

interface TaskFiltersProps {
  filters: TaskFilter;
  onFiltersChange: (filters: TaskFilter) => void;
  taskCounts: {
    all: number;
    work: number;
    personal: number;
    learning: number;
    completed: number;
    pending: number;
  };
}

const TaskFilters: React.FC<TaskFiltersProps> = ({ filters, onFiltersChange, taskCounts }) => {
  const updateFilter = (key: keyof TaskFilter, value: string) => {
    onFiltersChange({ ...filters, [key]: value });
  };

  const filterButtons = [
    { key: 'all', label: 'All Tasks', count: taskCounts.all, icon: Tag },
    { key: 'work', label: 'Work', count: taskCounts.work, icon: Tag, color: 'blue' },
    { key: 'personal', label: 'Personal', count: taskCounts.personal, icon: Tag, color: 'green' },
    { key: 'learning', label: 'Learning', count: taskCounts.learning, icon: Tag, color: 'purple' },
  ];

  const statusButtons = [
    { key: 'all', label: 'All', count: taskCounts.all, icon: Tag },
    { key: 'pending', label: 'Pending', count: taskCounts.pending, icon: Clock },
    { key: 'completed', label: 'Completed', count: taskCounts.completed, icon: CheckCircle2 },
  ];

  const getButtonColor = (isActive: boolean, color?: string) => {
    if (!isActive) return 'text-gray-600 hover:text-gray-900 hover:bg-gray-50';
    
    switch (color) {
      case 'blue': return 'text-blue-600 bg-blue-50 hover:bg-blue-100';
      case 'green': return 'text-green-600 bg-green-50 hover:bg-green-100';
      case 'purple': return 'text-purple-600 bg-purple-50 hover:bg-purple-100';
      default: return 'text-indigo-600 bg-indigo-50 hover:bg-indigo-100';
    }
  };

  return (
    <div className="space-y-6">
      {/* Category Filters */}
      <Card className="p-4 bg-white/70 backdrop-blur-sm border-0 shadow-md">
        <div className="flex items-center mb-3">
          <Tag className="w-4 h-4 mr-2 text-gray-600" />
          <h3 className="font-medium text-gray-900">Categories</h3>
        </div>
        <div className="space-y-2">
          {filterButtons.map(({ key, label, count, icon: Icon, color }) => (
            <Button
              key={key}
              variant="ghost"
              onClick={() => updateFilter('category', key)}
              className={`w-full justify-between h-auto p-3 ${getButtonColor(filters.category === key, color)}`}
            >
              <div className="flex items-center">
                <Icon className="w-4 h-4 mr-2" />
                {label}
              </div>
              <span className="text-sm font-medium">{count}</span>
            </Button>
          ))}
        </div>
      </Card>

      {/* Status Filters */}
      <Card className="p-4 bg-white/70 backdrop-blur-sm border-0 shadow-md">
        <div className="flex items-center mb-3">
          <CheckCircle2 className="w-4 h-4 mr-2 text-gray-600" />
          <h3 className="font-medium text-gray-900">Status</h3>
        </div>
        <div className="space-y-2">
          {statusButtons.map(({ key, label, count, icon: Icon }) => (
            <Button
              key={key}
              variant="ghost"
              onClick={() => updateFilter('status', key)}
              className={`w-full justify-between h-auto p-3 ${getButtonColor(filters.status === key)}`}
            >
              <div className="flex items-center">
                <Icon className="w-4 h-4 mr-2" />
                {label}
              </div>
              <span className="text-sm font-medium">{count}</span>
            </Button>
          ))}
        </div>
      </Card>

      {/* Sort Options */}
      <Card className="p-4 bg-white/70 backdrop-blur-sm border-0 shadow-md">
        <div className="flex items-center mb-3">
          <TrendingUp className="w-4 h-4 mr-2 text-gray-600" />
          <h3 className="font-medium text-gray-900">Sort By</h3>
        </div>
        <Select value={filters.sortBy} onValueChange={(value) => updateFilter('sortBy', value)}>
          <SelectTrigger>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="deadline">
              <div className="flex items-center">
                <Calendar className="w-4 h-4 mr-2" />
                Deadline
              </div>
            </SelectItem>
            <SelectItem value="priority">
              <div className="flex items-center">
                <TrendingUp className="w-4 h-4 mr-2" />
                Priority
              </div>
            </SelectItem>
            <SelectItem value="created">
              <div className="flex items-center">
                <Clock className="w-4 h-4 mr-2" />
                Date Created
              </div>
            </SelectItem>
          </SelectContent>
        </Select>
      </Card>
    </div>
  );
};

export default TaskFilters;
