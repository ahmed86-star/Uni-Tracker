import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { ChevronLeft, ChevronRight, Calendar as CalendarIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import type { Task } from "@shared/schema";

export function CalendarView() {
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [viewDate, setViewDate] = useState<Date>(new Date());

  const { data: tasks = [] } = useQuery<Task[]>({
    queryKey: ["/api/tasks"],
  });

  const getTasksForDate = (date: Date) => {
    return tasks.filter(task => {
      if (!task.dueDate) return false;
      const taskDate = new Date(task.dueDate);
      return taskDate.toDateString() === date.toDateString();
    });
  };

  const getDateTaskSummary = (date: Date) => {
    const dateTasks = getTasksForDate(date);
    if (dateTasks.length === 0) return null;

    const highPriority = dateTasks.filter(t => t.priority === "high").length;
    const completed = dateTasks.filter(t => t.status === "done").length;
    
    return {
      total: dateTasks.length,
      highPriority,
      completed,
      tasks: dateTasks
    };
  };

  const getDayModifiers = () => {
    const modifiers: Record<string, Date[]> = {
      hasTasks: [],
      hasHighPriority: [],
      hasOverdue: [],
    };

    tasks.forEach(task => {
      if (!task.dueDate) return;
      const taskDate = new Date(task.dueDate);
      
      modifiers.hasTasks.push(taskDate);
      
      if (task.priority === "high") {
        modifiers.hasHighPriority.push(taskDate);
      }
      
      if (task.status !== "done" && taskDate < new Date()) {
        modifiers.hasOverdue.push(taskDate);
      }
    });

    return modifiers;
  };

  const selectedDateTasks = getTasksForDate(selectedDate);
  const selectedDateSummary = getDateTaskSummary(selectedDate);

  const navigateMonth = (direction: "prev" | "next") => {
    setViewDate(prev => {
      const newDate = new Date(prev);
      if (direction === "prev") {
        newDate.setMonth(prev.getMonth() - 1);
      } else {
        newDate.setMonth(prev.getMonth() + 1);
      }
      return newDate;
    });
  };

  return (
    <div className="grid lg:grid-cols-2 gap-6">
      {/* Calendar */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              <CalendarIcon className="h-5 w-5" />
              Calendar
            </CardTitle>
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="icon"
                className="h-8 w-8"
                onClick={() => navigateMonth("prev")}
                data-testid="button-prev-month"
              >
                <ChevronLeft className="h-4 w-4" />
              </Button>
              <span className="font-medium px-3 min-w-[140px] text-center">
                {viewDate.toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
              </span>
              <Button
                variant="outline"
                size="icon"
                className="h-8 w-8"
                onClick={() => navigateMonth("next")}
                data-testid="button-next-month"
              >
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <Calendar
            mode="single"
            selected={selectedDate}
            onSelect={(date) => date && setSelectedDate(date)}
            month={viewDate}
            onMonthChange={setViewDate}
            modifiers={getDayModifiers()}
            modifiersClassNames={{
              hasTasks: "bg-primary/10 text-primary font-medium",
              hasHighPriority: "bg-destructive/10 text-destructive font-bold",
              hasOverdue: "bg-destructive text-destructive-foreground",
            }}
            className="rounded-md"
            data-testid="calendar-view"
          />
          
          {/* Legend */}
          <div className="mt-6 pt-6 border-t border-border">
            <div className="flex flex-wrap gap-4 text-sm">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 bg-primary rounded-full"></div>
                <span className="text-muted-foreground">Tasks</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 bg-destructive rounded-full"></div>
                <span className="text-muted-foreground">High Priority</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 bg-accent rounded-full"></div>
                <span className="text-muted-foreground">Completed</span>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Selected Date Tasks */}
      <Card>
        <CardHeader>
          <CardTitle>
            {selectedDate.toLocaleDateString('en-US', { 
              weekday: 'long', 
              month: 'long', 
              day: 'numeric' 
            })}
          </CardTitle>
          {selectedDateSummary && (
            <div className="flex gap-2">
              <Badge variant="secondary">
                {selectedDateSummary.total} task{selectedDateSummary.total > 1 ? 's' : ''}
              </Badge>
              {selectedDateSummary.highPriority > 0 && (
                <Badge variant="destructive">
                  {selectedDateSummary.highPriority} high priority
                </Badge>
              )}
              {selectedDateSummary.completed > 0 && (
                <Badge variant="outline" className="bg-accent/10 text-accent border-accent/20">
                  {selectedDateSummary.completed} completed
                </Badge>
              )}
            </div>
          )}
        </CardHeader>
        <CardContent>
          {selectedDateTasks.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-8 text-center">
              <CalendarIcon className="h-12 w-12 text-muted-foreground mb-4" />
              <h3 className="text-lg font-semibold mb-2">No tasks for this date</h3>
              <p className="text-muted-foreground text-sm">
                Select a different date or create a new task with a due date.
              </p>
            </div>
          ) : (
            <div className="space-y-3 max-h-96 overflow-y-auto">
              {selectedDateTasks.map((task) => (
                <div
                  key={task.id}
                  className={cn(
                    "p-4 rounded-lg border border-border hover:shadow-sm transition-all cursor-pointer",
                    task.status === "done" ? "opacity-60" : "bg-card"
                  )}
                  data-testid={`calendar-task-${task.id}`}
                >
                  <div className="flex items-start justify-between mb-2">
                    <h4 className={cn(
                      "font-medium",
                      task.status === "done" ? "line-through text-muted-foreground" : ""
                    )}>
                      {task.title}
                    </h4>
                    <Badge
                      variant={task.status === "done" ? "outline" : "secondary"}
                      className={cn(
                        "text-xs",
                        task.status === "done" ? "bg-accent/10 text-accent" : ""
                      )}
                    >
                      {task.status === "done" ? "Done" : task.status.replace("_", " ")}
                    </Badge>
                  </div>
                  
                  {task.description && (
                    <p className="text-sm text-muted-foreground mb-3">
                      {task.description}
                    </p>
                  )}

                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Badge
                        variant="outline"
                        className={cn(
                          "text-xs",
                          task.priority === "high" && "bg-destructive/10 text-destructive border-destructive/20",
                          task.priority === "medium" && "bg-primary/10 text-primary border-primary/20"
                        )}
                      >
                        {task.priority} priority
                      </Badge>
                      
                      {task.subject && (
                        <Badge variant="secondary" className="text-xs">
                          {task.subject}
                        </Badge>
                      )}
                    </div>

                    {task.dueDate && (
                      <span className="text-xs text-muted-foreground">
                        {new Date(task.dueDate).toLocaleTimeString('en-US', { 
                          hour: '2-digit', 
                          minute: '2-digit' 
                        })}
                      </span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
