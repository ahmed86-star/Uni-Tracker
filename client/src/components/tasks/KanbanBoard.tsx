import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { DndContext, DragEndEvent, DragOverlay, DragStartEvent, PointerSensor, useSensor, useSensors } from "@dnd-kit/core";
import { SortableContext, verticalListSortingStrategy } from "@dnd-kit/sortable";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { TaskCard } from "./TaskCard";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { MoreHorizontal, Plus } from "lucide-react";
import type { Task } from "@shared/schema";

const columns = [
  { id: "todo", title: "To Do", color: "bg-muted-foreground" },
  { id: "in_progress", title: "In Progress", color: "bg-secondary" },
  { id: "done", title: "Done", color: "bg-accent" },
] as const;

export function KanbanBoard() {
  const [activeTask, setActiveTask] = useState<Task | null>(null);
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const sensors = useSensors(useSensor(PointerSensor, { activationConstraint: { distance: 8 } }));

  const { data: tasks = [], isLoading } = useQuery<Task[]>({
    queryKey: ["/api/tasks"],
  });

  const updateTaskMutation = useMutation({
    mutationFn: async ({ id, updates }: { id: string; updates: Partial<Task> }) => {
      return await apiRequest("PATCH", `/api/tasks/${id}`, updates);
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

  const handleDragStart = (event: DragStartEvent) => {
    const task = tasks.find(t => t.id === event.active.id);
    setActiveTask(task || null);
  };

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    setActiveTask(null);

    if (!over || active.id === over.id) return;

    const taskId = active.id as string;
    const newStatus = over.id as string;

    // Validate that it's a valid column
    if (!columns.find(col => col.id === newStatus)) return;

    const updates: Partial<Task> = { status: newStatus as Task['status'] };
    
    // Mark as completed if moved to done
    if (newStatus === "done") {
      updates.completedAt = new Date();
      updates.progress = 100;
    } else if (newStatus === "in_progress") {
      updates.progress = Math.max(updates.progress || 0, 1); // Ensure some progress
    }

    updateTaskMutation.mutate({ id: taskId, updates });

    toast({
      title: "Task updated",
      description: `Task moved to ${columns.find(col => col.id === newStatus)?.title}`,
    });
  };

  const getTasksByStatus = (status: string) => {
    return tasks.filter(task => task.status === status);
  };

  const getColumnCount = (status: string) => {
    return getTasksByStatus(status).length;
  };

  if (isLoading) {
    return (
      <div className="grid lg:grid-cols-3 gap-4" data-testid="kanban-loading">
        {columns.map((column) => (
          <Card key={column.id}>
            <CardHeader className="pb-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className={`w-3 h-3 ${column.color} rounded-full`}></div>
                  <div className="h-4 bg-muted rounded w-20 animate-pulse"></div>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-3">
              {Array.from({ length: 3 }).map((_, i) => (
                <div key={i} className="bg-background rounded-lg p-4 border border-border animate-pulse">
                  <div className="h-4 bg-muted rounded w-3/4 mb-2"></div>
                  <div className="h-3 bg-muted rounded w-full mb-3"></div>
                  <div className="flex justify-between">
                    <div className="h-5 bg-muted rounded w-16"></div>
                    <div className="h-3 bg-muted rounded w-20"></div>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  return (
    <DndContext sensors={sensors} onDragStart={handleDragStart} onDragEnd={handleDragEnd}>
      <div className="grid lg:grid-cols-3 gap-4" data-testid="kanban-board">
        {columns.map((column) => (
          <Card key={column.id} className="flex flex-col">
            <CardHeader className="pb-4 border-b border-border">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className={`w-3 h-3 ${column.color} rounded-full`}></div>
                  <CardTitle className="text-base font-semibold">{column.title}</CardTitle>
                  <Badge variant="secondary" data-testid={`column-count-${column.id}`}>
                    {getColumnCount(column.id)}
                  </Badge>
                </div>
                <Button variant="ghost" size="icon" className="h-8 w-8" data-testid={`column-menu-${column.id}`}>
                  <MoreHorizontal className="h-4 w-4" />
                </Button>
              </div>
            </CardHeader>

            <SortableContext items={getTasksByStatus(column.id).map(t => t.id)} strategy={verticalListSortingStrategy}>
              <CardContent className="flex-1 p-4 space-y-3 max-h-[600px] overflow-y-auto kanban-column">
                {getTasksByStatus(column.id).length === 0 ? (
                  <div className="flex flex-col items-center justify-center py-8 text-center" data-testid={`empty-column-${column.id}`}>
                    <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center mb-3">
                      <Plus className="h-6 w-6 text-muted-foreground" />
                    </div>
                    <p className="text-sm text-muted-foreground mb-2">No tasks yet</p>
                    <p className="text-xs text-muted-foreground">
                      {column.id === "todo" && "Create a new task to get started"}
                      {column.id === "in_progress" && "Drag tasks here to work on them"}
                      {column.id === "done" && "Completed tasks will appear here"}
                    </p>
                  </div>
                ) : (
                  getTasksByStatus(column.id).map((task) => (
                    <TaskCard key={task.id} task={task} />
                  ))
                )}
              </CardContent>
            </SortableContext>
          </Card>
        ))}
      </div>

      <DragOverlay>
        {activeTask ? <TaskCard task={activeTask} isDragging /> : null}
      </DragOverlay>
    </DndContext>
  );
}
