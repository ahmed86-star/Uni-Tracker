import { useState, useEffect } from "react";
import { useMutation } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { Play, Pause, Square, Edit, AlarmClock } from "lucide-react";

type TimerState = "idle" | "running" | "paused" | "finished";

export function CountdownTimer() {
  const [timeRemaining, setTimeRemaining] = useState(30 * 60); // 30 minutes default
  const [initialTime, setInitialTime] = useState(30 * 60);
  const [state, setState] = useState<TimerState>("idle");
  const [taskName, setTaskName] = useState("Submit Essay");
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [tempMinutes, setTempMinutes] = useState("30");
  const [tempTaskName, setTempTaskName] = useState("Submit Essay");
  
  const { toast } = useToast();

  const createSessionMutation = useMutation({
    mutationFn: async () => {
      return await apiRequest("POST", "/api/sessions", {
        type: "countdown",
        plannedDuration: Math.floor(initialTime / 60),
        notes: `Countdown for: ${taskName}`,
      });
    },
  });

  useEffect(() => {
    let interval: NodeJS.Timeout;

    if (state === "running" && timeRemaining > 0) {
      interval = setInterval(() => {
        setTimeRemaining((prev) => {
          if (prev <= 1) {
            setState("finished");
            toast({
              title: "Time's Up!",
              description: `Countdown for "${taskName}" has finished.`,
            });
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }

    return () => clearInterval(interval);
  }, [state, timeRemaining, taskName, toast]);

  const handleStart = async () => {
    if (state === "idle") {
      try {
        await createSessionMutation.mutateAsync();
      } catch (error) {
        toast({
          title: "Error",
          description: "Failed to start countdown. Please try again.",
          variant: "destructive",
        });
        return;
      }
    }
    setState("running");
  };

  const handlePause = () => {
    setState("paused");
  };

  const handleStop = () => {
    setState("idle");
    setTimeRemaining(initialTime);
  };

  const handleSaveSettings = () => {
    const minutes = parseInt(tempMinutes);
    if (isNaN(minutes) || minutes <= 0) {
      toast({
        title: "Invalid time",
        description: "Please enter a valid number of minutes.",
        variant: "destructive",
      });
      return;
    }

    const newTime = minutes * 60;
    setInitialTime(newTime);
    setTimeRemaining(newTime);
    setTaskName(tempTaskName);
    setIsSettingsOpen(false);
    setState("idle");

    toast({
      title: "Settings saved",
      description: `Countdown set for ${minutes} minutes`,
    });
  };

  const formatTime = (seconds: number) => {
    const hours = Math.floor(seconds / 3600);
    const mins = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    
    if (hours > 0) {
      return `${hours}:${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
    }
    return `${mins}:${secs.toString().padStart(2, "0")}`;
  };

  const progress = initialTime > 0 ? ((initialTime - timeRemaining) / initialTime) * 100 : 0;

  return (
    <Card className={`relative overflow-hidden ${state === "finished" ? "ring-2 ring-destructive" : ""}`}>
      <CardHeader className="pb-4">
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2 text-lg">
            <div className="w-2 h-2 bg-accent rounded-full"></div>
            Countdown
          </CardTitle>
          <Dialog open={isSettingsOpen} onOpenChange={setIsSettingsOpen}>
            <DialogTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8"
                data-testid="button-countdown-settings"
              >
                <Edit className="h-4 w-4" />
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-md">
              <DialogHeader>
                <DialogTitle>Countdown Settings</DialogTitle>
              </DialogHeader>
              <div className="space-y-4">
                <div>
                  <Label htmlFor="task-name">Task Name</Label>
                  <Input
                    id="task-name"
                    value={tempTaskName}
                    onChange={(e) => setTempTaskName(e.target.value)}
                    placeholder="e.g., Submit Essay"
                    data-testid="input-countdown-task"
                  />
                </div>
                <div>
                  <Label htmlFor="minutes">Duration (minutes)</Label>
                  <Input
                    id="minutes"
                    type="number"
                    min="1"
                    value={tempMinutes}
                    onChange={(e) => setTempMinutes(e.target.value)}
                    data-testid="input-countdown-minutes"
                  />
                </div>
                <div className="flex justify-end gap-2">
                  <Button
                    variant="outline"
                    onClick={() => setIsSettingsOpen(false)}
                  >
                    Cancel
                  </Button>
                  <Button onClick={handleSaveSettings}>
                    Save Settings
                  </Button>
                </div>
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </CardHeader>

      <CardContent className="space-y-6">
        {/* Progress Ring */}
        <div className="relative flex items-center justify-center">
          <div className="w-48 h-48">
            <Progress 
              value={progress} 
              className="w-full h-full rounded-full"
              style={{
                background: `conic-gradient(hsl(var(--accent)) ${progress * 3.6}deg, hsl(var(--muted)) 0deg)`,
              }}
            />
          </div>
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <div className="text-4xl font-bold font-mono" data-testid="text-countdown-time">
              {formatTime(timeRemaining)}
            </div>
            <div className="text-sm text-muted-foreground mt-1">
              {state === "finished" ? "Finished!" : state === "running" ? "Counting Down" : "Ready"}
            </div>
          </div>
        </div>

        {/* Controls */}
        <div className="flex items-center justify-center gap-3">
          {state === "idle" || state === "paused" ? (
            <Button
              size="lg"
              className="w-14 h-14 rounded-full bg-accent hover:bg-accent/90"
              onClick={handleStart}
              disabled={createSessionMutation.isPending || timeRemaining <= 0}
              data-testid="button-countdown-start"
            >
              <Play className="h-6 w-6" />
            </Button>
          ) : state === "running" ? (
            <Button
              size="lg"
              variant="outline"
              className="w-14 h-14 rounded-full"
              onClick={handlePause}
              data-testid="button-countdown-pause"
            >
              <Pause className="h-6 w-6" />
            </Button>
          ) : (
            <Button
              size="lg"
              className="w-14 h-14 rounded-full bg-accent hover:bg-accent/90"
              onClick={handleStop}
              data-testid="button-countdown-reset"
            >
              <Square className="h-6 w-6" />
            </Button>
          )}
        </div>

        {/* Task Info */}
        <div className="flex justify-between items-center pt-4 border-t border-border">
          <span className="text-sm text-muted-foreground">Task</span>
          <Badge variant="secondary" className="flex items-center gap-1 max-w-32 truncate" data-testid="badge-countdown-task">
            <AlarmClock className="h-3 w-3" />
            {taskName}
          </Badge>
        </div>
      </CardContent>
    </Card>
  );
}
