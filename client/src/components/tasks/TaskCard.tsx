import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { 
  MoreVertical, 
  CheckCircle, 
  Clock, 
  Calendar, 
  Paperclip,
  Edit,
  Trash2,
  Play
} from "lucide-react";
import { cn } from "@/lib/utils";
import type { Task } from "@shared/schema";

interface TaskCardProps {
  task: Task;
  isDragging?: boolean;
}

export function TaskCard({ task, isDragging = false }: TaskCardProps) {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging: isSortableDragging,
  } = useSortable({ id: task.id });

  const deleteTaskMutation = useMutation({
    mutationFn: async () => {
      return await apiRequest("DELETE", `/api/tasks/${task.id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/tasks"] });
      toast({
        title: "Task deleted",
        description: "The task has been removed successfully.",
      });
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to delete task",
        variant: "destructive",
      });
    },
  });

  const updateTaskMutation = useMutation({
    mutationFn: async (updates: Partial<Task>) => {
      return await apiRequest("PATCH", `/api/tasks/${task.id}`, updates);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/tasks"] });
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to update task",
        variant: "destructive",
      });
    },
  });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  const formatDueDate = (date: Date | string | null) => {
    if (!date) return null;
    
    const dueDate = new Date(date);
    const now = new Date();
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const tomorrow = new Date(today.getTime() + 24 * 60 * 60 * 1000);
    const dueDay = new Date(dueDate.getFullYear(), dueDate.getMonth(), dueDate.getDate());

    if (dueDay.getTime() === today.getTime()) return "Due: Today";
    if (dueDay.getTime() === tomorrow.getTime()) return "Due: Tomorrow";
    
    const diffTime = dueDay.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays < 0) return `Overdue by ${Math.abs(diffDays)} day${Math.abs(diffDays) > 1 ? 's' : ''}`;
    if (diffDays <= 7) return `Due: In ${diffDays} day${diffDays > 1 ? 's' : ''}`;
    
    return `Due: ${dueDate.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}`;
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "high": return "bg-destructive/10 text-destructive border-destructive/20";
      case "medium": return "bg-primary/10 text-primary border-primary/20";
      case "low": return "bg-muted text-muted-foreground border-border";
      default: return "bg-muted text-muted-foreground border-border";
    }
  };

  const getPriorityLabel = (priority: string) => {
    switch (priority) {
      case "high": return "High Priority";
      case "medium": return "Medium";
      case "low": return "Low";
      default: return "Medium";
    }
  };

  const handleCompleteTask = () => {
    const updates: Partial<Task> = {
      status: task.status === "done" ? "todo" : "done",
      completedAt: task.status === "done" ? null : new Date(),
      progress: task.status === "done" ? 0 : 100,
    };
    updateTaskMutation.mutate(updates);
  };

  const dueDateString = formatDueDate(task.dueDate);
  const isOverdue = task.dueDate && new Date(task.dueDate) < new Date() && task.status !== "done";

  return (
    <Card
      ref={setNodeRef}
      style={style}
      className={cn(
        "cursor-pointer hover:shadow-md transition-all",
        isDragging || isSortableDragging ? "opacity-50 rotate-2 scale-105" : "",
        task.status === "done" ? "opacity-75" : "",
        isOverdue ? "ring-1 ring-destructive/50" : ""
      )}
      data-testid={`task-card-${task.id}`}
      {...attributes}
      {...listeners}
    >
      <CardContent className="p-4">
        <div className="flex items-start justify-between mb-3">
          <div className="flex items-start gap-2 flex-1 min-w-0">
            <Button
              variant="ghost"
              size="icon"
              className="h-5 w-5 mt-0.5 flex-shrink-0"
              onClick={(e) => {
                e.stopPropagation();
                handleCompleteTask();
              }}
              data-testid={`button-complete-task-${task.id}`}
            >
              <CheckCircle 
                className={cn(
                  "h-4 w-4",
                  task.status === "done" ? "text-accent fill-accent/20" : "text-muted-foreground"
                )}
              />
            </Button>
            
            <h4 className={cn(
              "font-medium text-sm flex-1 min-w-0",
              task.status === "done" ? "line-through text-muted-foreground" : ""
            )}>
              {task.title}
            </h4>
          </div>

          <DropdownMenu>
            <DropdownMenuTrigger asChild onClick={(e) => e.stopPropagation()}>
              <Button 
                variant="ghost" 
                size="icon" 
                className="h-6 w-6 flex-shrink-0"
                data-testid={`button-task-menu-${task.id}`}
              >
                <MoreVertical className="h-3 w-3" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem data-testid={`menu-edit-task-${task.id}`}>
                <Edit className="h-4 w-4 mr-2" />
                Edit Task
              </DropdownMenuItem>
              <DropdownMenuItem data-testid={`menu-start-session-${task.id}`}>
                <Play className="h-4 w-4 mr-2" />
                Start Timer
              </DropdownMenuItem>
              <DropdownMenuItem 
                className="text-destructive"
                onClick={(e) => {
                  e.stopPropagation();
                  deleteTaskMutation.mutate();
                }}
                data-testid={`menu-delete-task-${task.id}`}
              >
                <Trash2 className="h-4 w-4 mr-2" />
                Delete
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>

        {task.description && (
          <p className="text-xs text-muted-foreground mb-3 line-clamp-2">
            {task.description}
          </p>
        )}

        {/* Progress bar for in-progress tasks */}
        {task.status === "in_progress" && (
          <div className="mb-3">
            <div className="flex items-center justify-between text-xs mb-1">
              <span className="text-muted-foreground">Progress</span>
              <span className="font-medium">{task.progress || 0}%</span>
            </div>
            <Progress value={task.progress || 0} className="h-2" />
          </div>
        )}

        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Badge 
              variant="outline"
              className={cn("text-xs", getPriorityColor(task.priority))}
            >
              {getPriorityLabel(task.priority)}
            </Badge>
            
            {task.subject && (
              <Badge variant="secondary" className="text-xs">
                {task.subject}
              </Badge>
            )}
          </div>

          {dueDateString && (
            <div className={cn(
              "flex items-center gap-1 text-xs",
              isOverdue ? "text-destructive" : "text-muted-foreground"
            )}>
              <Calendar className="h-3 w-3" />
              <span>{dueDateString}</span>
            </div>
          )}
        </div>

        {/* Completion timestamp for done tasks */}
        {task.status === "done" && task.completedAt && (
          <div className="mt-3 pt-3 border-t border-border">
            <div className="flex items-center gap-1 text-xs text-muted-foreground">
              <CheckCircle className="h-3 w-3" />
              <span>
                Completed: {new Date(task.completedAt).toLocaleDateString('en-US', {
                  month: 'short',
                  day: 'numeric',
                  hour: '2-digit',
                  minute: '2-digit'
                })}
              </span>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
