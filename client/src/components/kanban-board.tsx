import { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Calendar, Plus, MoreHorizontal } from "lucide-react";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { useAuth } from "@/hooks/useAuth";
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger 
} from "@/components/ui/dropdown-menu";
import { Task } from "@shared/schema";

export default function KanbanBoard() {
  const { user } = useAuth();
  
  const { data: tasks = [] } = useQuery({
    queryKey: ['/api/tasks'],
    enabled: !!user,
  });

  const updateTaskMutation = useMutation({
    mutationFn: async ({ id, ...data }: { id: string } & Partial<Task>) => {
      return await apiRequest("PUT", `/api/tasks/${id}`, data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/tasks'] });
    },
  });

  const deleteTaskMutation = useMutation({
    mutationFn: async (id: string) => {
      return await apiRequest("DELETE", `/api/tasks/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/tasks'] });
    },
  });

  const todoTasks = tasks.filter((task: Task) => task.status === 'todo');
  const inProgressTasks = tasks.filter((task: Task) => task.status === 'in_progress');
  const doneTasks = tasks.filter((task: Task) => task.status === 'done');

  const getPriorityVariant = (priority: string) => {
    switch (priority) {
      case 'high':
        return 'destructive';
      case 'medium':
        return 'default';
      case 'low':
        return 'secondary';
      default:
        return 'default';
    }
  };

  const getPriorityLabel = (priority: string) => {
    switch (priority) {
      case 'high':
        return 'High Priority';
      case 'medium':
        return 'Medium';
      case 'low':
        return 'Low';
      default:
        return 'Medium';
    }
  };

  const formatDueDate = (dueDate: string | Date | null) => {
    if (!dueDate) return null;
    
    const date = new Date(dueDate);
    const today = new Date();
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);
    
    if (date.toDateString() === today.toDateString()) {
      return 'Due: Today';
    } else if (date.toDateString() === tomorrow.toDateString()) {
      return 'Due: Tomorrow';
    } else {
      return `Due: ${date.toLocaleDateString('en-US', { 
        month: 'short', 
        day: 'numeric' 
      })}`;
    }
  };

  const TaskCard = ({ task }: { task: Task }) => {
    return (
      <Card 
        className="hover:shadow-md transition-all cursor-pointer bg-background"
        onClick={() => console.log('Open task', task.id)}
        data-testid={`card-task-${task.id}`}
      >
        <CardContent className="p-4">
          <div className="flex items-start justify-between mb-2">
            <h4 className="font-medium text-sm" data-testid="text-task-title">
              {task.title}
            </h4>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="sm" className="h-auto p-1" data-testid="button-task-menu">
                  <MoreHorizontal className="h-3 w-3" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem 
                  onClick={(e) => {
                    e.stopPropagation();
                    deleteTaskMutation.mutate(task.id);
                  }}
                  className="text-destructive"
                  data-testid="button-delete-task"
                >
                  Delete
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
          
          {task.description && (
            <p className="text-xs text-muted-foreground mb-3" data-testid="text-task-description">
              {task.description}
            </p>
          )}
          
          {task.status === 'in_progress' && task.progress && (
            <div className="mb-3">
              <div className="flex items-center justify-between text-xs mb-1">
                <span className="text-muted-foreground">Progress</span>
                <span className="font-medium" data-testid="text-task-progress">
                  {task.progress}%
                </span>
              </div>
              <Progress value={task.progress} className="h-1.5" />
            </div>
          )}
          
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Badge variant={getPriorityVariant(task.priority)} className="text-xs">
                {getPriorityLabel(task.priority)}
              </Badge>
              {task.status === 'done' && (
                <div className="text-accent">✓</div>
              )}
            </div>
            {task.dueDate && (
              <span className="text-xs text-muted-foreground" data-testid="text-task-due-date">
                {formatDueDate(task.dueDate)}
              </span>
            )}
          </div>
        </CardContent>
      </Card>
    );
  };

  const Column = ({ 
    title, 
    tasks: columnTasks, 
    status, 
    color 
  }: { 
    title: string; 
    tasks: Task[]; 
    status: string;
    color: string;
  }) => {
    return (
      <Card>
        <CardHeader className="pb-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className={`w-3 h-3 ${color} rounded-full`}></div>
              <CardTitle className="text-base">{title}</CardTitle>
              <Badge variant="secondary" className="text-xs">
                {columnTasks.length}
              </Badge>
            </div>
            <Button variant="ghost" size="sm" data-testid={`button-column-menu-${status}`}>
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </div>
        </CardHeader>
        <CardContent className="space-y-3 max-h-96 overflow-y-auto">
          {columnTasks.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              <div className="text-4xl mb-2">📝</div>
              <div className="text-sm">No tasks here</div>
            </div>
          ) : (
            columnTasks.map((task) => <TaskCard key={task.id} task={task} />)
          )}
        </CardContent>
      </Card>
    );
  };

  return (
    <section className="mb-8" id="tasks">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold">Task Board</h2>
        <div className="flex gap-2">
          <Button variant="outline" data-testid="button-calendar-view">
            <Calendar className="h-4 w-4 mr-2" />
            Calendar View
          </Button>
          <Button data-testid="button-create-task">
            <Plus className="h-4 w-4 mr-2" />
            New Task
          </Button>
        </div>
      </div>
      
      <div className="grid lg:grid-cols-3 gap-4">
        <Column 
          title="To Do" 
          tasks={todoTasks} 
          status="todo" 
          color="bg-muted-foreground" 
        />
        <Column 
          title="In Progress" 
          tasks={inProgressTasks} 
          status="in_progress" 
          color="bg-secondary" 
        />
        <Column 
          title="Done" 
          tasks={doneTasks} 
          status="done" 
          color="bg-accent" 
        />
      </div>
    </section>
  );
}
