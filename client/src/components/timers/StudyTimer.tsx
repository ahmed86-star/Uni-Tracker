import { useState, useEffect, useCallback } from "react";
import { useMutation, useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { Play, Pause, Square, Settings, BookOpen } from "lucide-react";

type TimerState = "idle" | "running" | "paused";

export function StudyTimer() {
  const [elapsedTime, setElapsedTime] = useState(0);
  const [state, setState] = useState<TimerState>("idle");
  const [subject, setSubject] = useState("General");
  const [currentSession, setCurrentSession] = useState<string | null>(null);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  
  const { toast } = useToast();

  const { data: activeSession } = useQuery({
    queryKey: ["/api/sessions/active"],
    refetchInterval: state === "running" ? 5000 : false,
  });

  const createSessionMutation = useMutation({
    mutationFn: async () => {
      return await apiRequest("POST", "/api/sessions", {
        type: "study",
        subject: subject,
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

    if (state === "running") {
      interval = setInterval(() => {
        setElapsedTime(prev => prev + 1);
      }, 1000);
    }

    return () => clearInterval(interval);
  }, [state]);

  // Sync with active session from server
  useEffect(() => {
    if (activeSession && activeSession.type === "study" && !activeSession.completed) {
      const startTime = new Date(activeSession.startTime).getTime();
      const now = Date.now();
      const elapsed = Math.floor((now - startTime) / 1000);
      
      setElapsedTime(elapsed);
      setCurrentSession(activeSession.id);
      setSubject(activeSession.subject || "General");
      setState("running");
    }
  }, [activeSession]);

  const handleStart = async () => {
    if (state === "idle") {
      try {
        const session = await createSessionMutation.mutateAsync();
        setCurrentSession(session.id);
        setElapsedTime(0);
        
        toast({
          title: "Study session started",
          description: `Started ${subject} study session`,
        });
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
    
    if (currentSession) {
      try {
        await updateSessionMutation.mutateAsync({
          sessionId: currentSession,
          updates: {
            endTime: new Date(),
            actualDuration: Math.floor(elapsedTime / 60),
            completed: true,
          },
        });
        
        toast({
          title: "Study session completed",
          description: `Studied ${subject} for ${formatTime(elapsedTime)}`,
        });
      } catch (error) {
        toast({
          title: "Error",
          description: "Failed to save session. Please try again.",
          variant: "destructive",
        });
      }
      
      setCurrentSession(null);
    }
    
    setElapsedTime(0);
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

  return (
    <Card className="relative overflow-hidden">
      <CardHeader className="pb-4">
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2 text-lg">
            <div className="w-2 h-2 bg-secondary rounded-full"></div>
            Study Timer
          </CardTitle>
          <Dialog open={isSettingsOpen} onOpenChange={setIsSettingsOpen}>
            <DialogTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8"
                data-testid="button-study-timer-settings"
              >
                <Settings className="h-4 w-4" />
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-md">
              <DialogHeader>
                <DialogTitle>Study Timer Settings</DialogTitle>
              </DialogHeader>
              <div className="space-y-4">
                <div>
                  <Label htmlFor="subject">Subject</Label>
                  <Input
                    id="subject"
                    value={subject}
                    onChange={(e) => setSubject(e.target.value)}
                    placeholder="e.g., Mathematics"
                    disabled={state === "running"}
                    data-testid="input-study-subject"
                  />
                </div>
                <div className="flex justify-end">
                  <Button onClick={() => setIsSettingsOpen(false)}>
                    Save Settings
                  </Button>
                </div>
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </CardHeader>

      <CardContent className="space-y-6">
        {/* Time Display */}
        <div className="relative flex items-center justify-center">
          <div className="w-48 h-48 rounded-full border-8 border-muted flex flex-col items-center justify-center">
            <div className="text-4xl font-bold font-mono" data-testid="text-study-timer-time">
              {formatTime(elapsedTime)}
            </div>
            <div className="text-sm text-muted-foreground mt-1">
              {state === "running" ? "Studying" : state === "paused" ? "Paused" : "Ready"}
            </div>
          </div>
          
          {state === "running" && (
            <div className="absolute inset-0 rounded-full border-8 border-transparent border-t-secondary animate-spin"></div>
          )}
        </div>

        {/* Controls */}
        <div className="flex items-center justify-center gap-3">
          {state === "idle" || state === "paused" ? (
            <Button
              size="lg"
              variant="secondary"
              className="w-14 h-14 rounded-full"
              onClick={handleStart}
              disabled={createSessionMutation.isPending}
              data-testid="button-study-timer-start"
            >
              <Play className="h-6 w-6" />
            </Button>
          ) : (
            <Button
              size="lg"
              variant="outline"
              className="w-14 h-14 rounded-full"
              onClick={handlePause}
              data-testid="button-study-timer-pause"
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
            data-testid="button-study-timer-stop"
          >
            <Square className="h-4 w-4" />
          </Button>
        </div>

        {/* Subject Info */}
        <div className="flex justify-between items-center pt-4 border-t border-border">
          <span className="text-sm text-muted-foreground">Subject</span>
          <Badge variant="secondary" className="flex items-center gap-1" data-testid="badge-study-subject">
            <BookOpen className="h-3 w-3" />
            {subject}
          </Badge>
        </div>
      </CardContent>
    </Card>
  );
}
