import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { Input } from '../ui/input';
import { taskApi } from '../../api/client';
import { useAuthStore } from '../../stores/authStore';
import { toast } from 'sonner';
import { format } from 'date-fns';
import { 
  Clock, 
  CheckCircle2, 
  AlertCircle, 
  Calendar,
  Target,
  TrendingUp
} from 'lucide-react';
import type { Task, TaskStatus } from '../../types';

export function MemberDashboard() {
  const { user } = useAuthStore();
  const queryClient = useQueryClient();
  const [updatingTasks, setUpdatingTasks] = useState<Set<string>>(new Set());

  const { data: myTasks = [], isLoading } = useQuery({
    queryKey: ['my-tasks'],
    queryFn: taskApi.getMy,
  });

  const updateTaskMutation = useMutation({
    mutationFn: ({ taskId, data }: { taskId: string; data: any }) =>
      taskApi.update(taskId, data),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['my-tasks'] });
      toast.success('Task updated successfully');
      setUpdatingTasks(prev => {
        const newSet = new Set(prev);
        newSet.delete(variables.taskId);
        return newSet;
      });
    },
    onError: (_, variables) => {
      toast.error('Failed to update task');
      setUpdatingTasks(prev => {
        const newSet = new Set(prev);
        newSet.delete(variables.taskId);
        return newSet;
      });
    },
  });

  const handleProgressUpdate = (task: Task, newCompleted: number) => {
    setUpdatingTasks(prev => new Set(prev).add(task.id));
    
    let newStatus: TaskStatus = task.status;
    if (newCompleted >= task.quantity_requested && task.status !== 'completed') {
      newStatus = 'completed';
    } else if (newCompleted > 0 && task.status === 'pending') {
      newStatus = 'in_progress';
    }

    updateTaskMutation.mutate({
      taskId: task.id,
      data: {
        quantity_completed: newCompleted,
        status: newStatus,
      },
    });
  };

  const getStatusIcon = (status: TaskStatus) => {
    switch (status) {
      case 'completed':
        return <CheckCircle2 className="h-4 w-4 text-green-500" />;
      case 'in_progress':
        return <Clock className="h-4 w-4 text-blue-500" />;
      case 'pending':
        return <AlertCircle className="h-4 w-4 text-yellow-500" />;
      default:
        return <Clock className="h-4 w-4 text-muted-foreground" />;
    }
  };

  const getStatusVariant = (status: TaskStatus) => {
    switch (status) {
      case 'completed':
        return 'default' as const;
      case 'in_progress':
        return 'secondary' as const;
      case 'pending':
        return 'outline' as const;
      default:
        return 'outline' as const;
    }
  };

  const getProgressPercentage = (completed: number, requested: number) => {
    if (requested === 0) return 0;
    return Math.min((completed / requested) * 100, 100);
  };

  const pendingTasks = myTasks.filter(task => task.status === 'pending');
  const inProgressTasks = myTasks.filter(task => task.status === 'in_progress');
  const completedTasks = myTasks.filter(task => task.status === 'completed');

  const totalCompleted = myTasks.reduce((sum, task) => sum + task.quantity_completed, 0);
  const totalRequested = myTasks.reduce((sum, task) => sum + task.quantity_requested, 0);
  const completionRate = totalRequested > 0 ? Math.round((totalCompleted / totalRequested) * 100) : 0;

  if (isLoading) {
    return <div className="text-center py-8">Loading your tasks...</div>;
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold">My Tasks</h1>
        <p className="text-muted-foreground">
          Welcome back, {user?.username}! Here are your current assignments.
        </p>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pending Tasks</CardTitle>
            <AlertCircle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{pendingTasks.length}</div>
            <p className="text-xs text-muted-foreground">Awaiting start</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">In Progress</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{inProgressTasks.length}</div>
            <p className="text-xs text-muted-foreground">Currently working</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Completed</CardTitle>
            <CheckCircle2 className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{completedTasks.length}</div>
            <p className="text-xs text-muted-foreground">This week</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Completion Rate</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{completionRate}%</div>
            <p className="text-xs text-muted-foreground">Overall progress</p>
          </CardContent>
        </Card>
      </div>

      {/* Active Tasks */}
      <div className="space-y-6">
        <h2 className="text-xl font-semibold">Active Assignments</h2>
        
        {myTasks.length === 0 ? (
          <Card>
            <CardContent className="text-center py-12">
              <Target className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-medium mb-2">No tasks assigned</h3>
              <p className="text-muted-foreground">
                You don't have any tasks assigned yet. Check back later or contact your guild leaders.
              </p>
            </CardContent>
          </Card>
        ) : (
          <div className="grid gap-4">
            {myTasks.map((task) => {
              const progress = getProgressPercentage(task.quantity_completed, task.quantity_requested);
              const isUpdating = updatingTasks.has(task.id);
              const isOverdue = task.deadline && new Date(task.deadline) < new Date() && task.status !== 'completed';

              return (
                <Card key={task.id} className={`${isOverdue ? 'border-destructive' : ''}`}>
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div className="space-y-1">
                        <div className="flex items-center space-x-2">
                          <CardTitle className="text-lg">{task.resource_name}</CardTitle>
                          <Badge variant={getStatusVariant(task.status)} className="flex items-center space-x-1">
                            {getStatusIcon(task.status)}
                            <span className="capitalize">{task.status.replace('_', ' ')}</span>
                          </Badge>
                          {isOverdue && <Badge variant="destructive">Overdue</Badge>}
                        </div>
                        <p className="text-sm text-muted-foreground">
                          {task.settlement_name} • {task.category}
                        </p>
                      </div>
                      <div className="text-right text-sm text-muted-foreground">
                        <div>Assigned by {task.created_by}</div>
                        {task.deadline && (
                          <div className="flex items-center space-x-1 mt-1">
                            <Calendar className="h-3 w-3" />
                            <span>Due {format(new Date(task.deadline), 'MMM d, yyyy')}</span>
                          </div>
                        )}
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {/* Progress Bar */}
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span>Progress</span>
                        <span>{task.quantity_completed}/{task.quantity_requested}</span>
                      </div>
                      <div className="w-full bg-muted rounded-full h-2">
                        <div
                          className={`h-2 rounded-full transition-all ${
                            progress >= 100 ? 'bg-green-500' : 
                            progress >= 50 ? 'bg-blue-500' : 'bg-yellow-500'
                          }`}
                          style={{ width: `${progress}%` }}
                        />
                      </div>
                    </div>

                    {/* Progress Update */}
                    {task.status !== 'completed' && (
                      <div className="flex items-center space-x-4">
                        <label className="text-sm font-medium">Update Progress:</label>
                        <div className="flex items-center space-x-2">
                          <Input
                            type="number"
                            min="0"
                            max={task.quantity_requested}
                            defaultValue={task.quantity_completed}
                            className="w-24"
                            onBlur={(e) => {
                              const newValue = parseInt(e.target.value) || 0;
                              if (newValue !== task.quantity_completed) {
                                handleProgressUpdate(task, newValue);
                              }
                            }}
                            disabled={isUpdating}
                          />
                          <span className="text-sm text-muted-foreground">
                            / {task.quantity_requested}
                          </span>
                          {isUpdating && (
                            <div className="text-sm text-muted-foreground">Updating...</div>
                          )}
                        </div>
                      </div>
                    )}

                    {/* Notes */}
                    {task.notes && (
                      <div className="text-sm">
                        <span className="font-medium">Notes:</span> {task.notes}
                      </div>
                    )}
                  </CardContent>
                </Card>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}