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
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Task, insertTaskSchema } from "@shared/schema";
import { useToast } from "@/hooks/use-toast";

const createTaskSchema = insertTaskSchema.extend({
  dueDate: z.string().optional(),
});

type CreateTaskInput = z.infer<typeof createTaskSchema>;

export default function KanbanBoard() {
  const { user } = useAuth();
  const { toast } = useToast();
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [viewMode, setViewMode] = useState<'board' | 'calendar'>('board');
  
  const { data: tasks = [] } = useQuery<Task[]>({
    queryKey: ['/api/tasks'],
    enabled: !!user,
  });

  const createTaskMutation = useMutation({
    mutationFn: async (data: CreateTaskInput) => {
      return await apiRequest("POST", "/api/tasks", data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/tasks'] });
      setIsCreateDialogOpen(false);
      toast({
        title: "Task created",
        description: "Your task has been added successfully.",
      });
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to create task. Please try again.",
        variant: "destructive",
      });
    },
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
      toast({
        title: "Task deleted",
        description: "Your task has been removed.",
      });
    },
  });

  const form = useForm<CreateTaskInput>({
    resolver: zodResolver(createTaskSchema),
    defaultValues: {
      userId: user?.id || "demo-user",
      title: "",
      description: "",
      status: "todo",
      priority: "medium",
      dueDate: "",
    },
  });

  const onSubmit = (data: CreateTaskInput) => {
    const taskData = {
      ...data,
      dueDate: data.dueDate ? data.dueDate : undefined,
    };
    createTaskMutation.mutate(taskData as CreateTaskInput);
  };

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
    <>
      <section className="mb-8" id="tasks">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold">Task Board</h2>
          <div className="flex gap-2">
            <Button 
              variant="outline" 
              onClick={() => {
                const element = document.getElementById('calendar');
                if (element) {
                  element.scrollIntoView({ behavior: 'smooth', block: 'center' });
                }
              }}
              data-testid="button-calendar-view"
            >
              <Calendar className="h-4 w-4 mr-2" />
              Calendar View
            </Button>
            <Button 
              onClick={() => setIsCreateDialogOpen(true)}
              data-testid="button-create-task"
            >
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

      {/* Create Task Dialog */}
      <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Create New Task</DialogTitle>
            <DialogDescription>
              Add a new task to your board. Set priority and due date to stay organized.
            </DialogDescription>
          </DialogHeader>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <FormField
                control={form.control}
                name="title"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Title</FormLabel>
                    <FormControl>
                      <Input placeholder="Enter task title..." {...field} data-testid="input-task-title" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="description"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Description</FormLabel>
                    <FormControl>
                      <Textarea 
                        placeholder="Add task description..." 
                        {...field} 
                        value={field.value || ""}
                        data-testid="input-task-description"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="grid grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="priority"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Priority</FormLabel>
                      <Select 
                        onValueChange={field.onChange} 
                        defaultValue={field.value}
                      >
                        <FormControl>
                          <SelectTrigger data-testid="select-task-priority">
                            <SelectValue placeholder="Select priority" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="low">Low</SelectItem>
                          <SelectItem value="medium">Medium</SelectItem>
                          <SelectItem value="high">High</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="dueDate"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Due Date</FormLabel>
                      <FormControl>
                        <Input 
                          type="date" 
                          {...field} 
                          value={field.value || ""}
                          data-testid="input-task-due-date"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <div className="flex justify-end gap-2 pt-4">
                <Button 
                  type="button" 
                  variant="outline" 
                  onClick={() => setIsCreateDialogOpen(false)}
                  data-testid="button-cancel-task"
                >
                  Cancel
                </Button>
                <Button 
                  type="submit" 
                  disabled={createTaskMutation.isPending}
                  data-testid="button-submit-task"
                >
                  {createTaskMutation.isPending ? "Creating..." : "Create Task"}
                </Button>
              </div>
            </form>
          </Form>
        </DialogContent>
      </Dialog>
    </>
  );
}
