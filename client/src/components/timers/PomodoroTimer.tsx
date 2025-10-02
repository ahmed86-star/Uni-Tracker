import { useState, useEffect, useCallback } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { Play, Pause, Square, RotateCcw, Settings } from "lucide-react";

type TimerState = "idle" | "running" | "paused" | "break";

export function PomodoroTimer() {
  const [timeRemaining, setTimeRemaining] = useState(25 * 60); // 25 minutes in seconds
  const [state, setState] = useState<TimerState>("idle");
  const [sessionCount, setSessionCount] = useState(0);
  const [currentSession, setCurrentSession] = useState<string | null>(null);
  
  const totalTime = 25 * 60; // For progress calculation
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const createSessionMutation = useMutation({
    mutationFn: async () => {
      return await apiRequest("POST", "/api/sessions", {
        type: "pomodoro",
        plannedDuration: 25,
      });
    },
  });

  const updateSessionMutation = useMutation({
    mutationFn: async ({ sessionId, updates }: { sessionId: string; updates: any }) => {
      return await apiRequest("PATCH", `/api/sessions/${sessionId}`, updates);
    },
  });

  useEffect(() => {
    let interval: NodeJS.Timeout;

    if (state === "running" && timeRemaining > 0) {
      interval = setInterval(() => {
        setTimeRemaining((prev) => prev - 1);
      }, 1000);
    } else if (state === "running" && timeRemaining === 0) {
      handleSessionComplete();
    }

    return () => clearInterval(interval);
  }, [state, timeRemaining]);

  const handleSessionComplete = useCallback(async () => {
    setState("break");
    setSessionCount(prev => prev + 1);
    
    if (currentSession) {
      await updateSessionMutation.mutateAsync({
        sessionId: currentSession,
        updates: {
          endTime: new Date(),
          actualDuration: 25,
          completed: true,
        },
      });
    }

    toast({
      title: "Pomodoro Complete!",
      description: "Great work! Take a 5-minute break.",
    });

    // Start break timer (5 minutes)
    setTimeRemaining(5 * 60);
    setState("running");
  }, [currentSession, updateSessionMutation, toast]);

  const handleStart = async () => {
    if (state === "idle") {
      try {
        const session = await createSessionMutation.mutateAsync();
        setCurrentSession(session.id);
      } catch (error) {
        toast({
          title: "Error",
          description: "Failed to start session. Please try again.",
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

  const handleStop = async () => {
    setState("idle");
    setTimeRemaining(25 * 60);
    
    if (currentSession) {
      await updateSessionMutation.mutateAsync({
        sessionId: currentSession,
        updates: {
          endTime: new Date(),
          actualDuration: Math.floor((totalTime - timeRemaining) / 60),
          completed: false,
        },
      });
      setCurrentSession(null);
    }
  };

  const handleReset = () => {
    setState("idle");
    setTimeRemaining(25 * 60);
    setCurrentSession(null);
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, "0")}`;
  };

  const progress = ((totalTime - timeRemaining) / totalTime) * 100;
  const isBreakTime = state === "break" || (state === "running" && sessionCount > 0 && timeRemaining <= 5 * 60);

  return (
    <Card className="relative overflow-hidden">
      <CardHeader className="pb-4">
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2 text-lg">
            <div className="w-2 h-2 bg-destructive rounded-full"></div>
            Pomodoro
          </CardTitle>
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8"
            data-testid="button-pomodoro-settings"
          >
            <Settings className="h-4 w-4" />
          </Button>
        </div>
      </CardHeader>

      <CardContent className="space-y-6">
        {/* Circular Progress */}
        <div className="relative flex items-center justify-center">
          <Progress
            value={progress}
            className="w-48 h-48 rounded-full"
            style={{
              background: `conic-gradient(hsl(var(--destructive)) ${progress * 3.6}deg, hsl(var(--muted)) 0deg)`,
            }}
          />
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <div className="text-4xl font-bold font-mono" data-testid="text-pomodoro-time">
              {formatTime(timeRemaining)}
            </div>
            <div className="text-sm text-muted-foreground mt-1">
              {isBreakTime ? "Break Time" : "Focus Time"}
            </div>
          </div>
        </div>

        {/* Controls */}
        <div className="flex items-center justify-center gap-3">
          {state === "idle" || state === "paused" ? (
            <Button
              size="lg"
              className="w-14 h-14 rounded-full"
              onClick={handleStart}
              disabled={createSessionMutation.isPending}
              data-testid="button-pomodoro-start"
            >
              <Play className="h-6 w-6" />
            </Button>
          ) : (
            <Button
              size="lg"
              variant="outline"
              className="w-14 h-14 rounded-full"
              onClick={handlePause}
              data-testid="button-pomodoro-pause"
            >
              <Pause className="h-6 w-6" />
            </Button>
          )}

          <Button
            variant="outline"
            size="icon"
            className="w-12 h-12 rounded-full"
            onClick={handleStop}
            disabled={state === "idle"}
            data-testid="button-pomodoro-stop"
          >
            <Square className="h-4 w-4" />
          </Button>

          <Button
            variant="outline"
            size="icon"
            className="w-12 h-12 rounded-full"
            onClick={handleReset}
            data-testid="button-pomodoro-reset"
          >
            <RotateCcw className="h-4 w-4" />
          </Button>
        </div>

        {/* Session Info */}
        <div className="flex justify-between items-center pt-4 border-t border-border">
          <span className="text-sm text-muted-foreground">Sessions today</span>
          <Badge variant="secondary" data-testid="badge-pomodoro-sessions">
            {sessionCount}
          </Badge>
        </div>
      </CardContent>
    </Card>
  );
}
