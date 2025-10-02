import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Slider } from "@/components/ui/slider";
import { useTimer } from "@/hooks/useTimer";
import { Play, Pause, RotateCcw, Settings, Volume2, VolumeX } from "lucide-react";

export default function TimerSection() {
  const [focusSoundVolume, setFocusSoundVolume] = useState(60);
  const [isMuted, setIsMuted] = useState(false);
  
  const pomodoroTimer = useTimer(25 * 60); // 25 minutes
  const studyTimer = useTimer(0, true); // Stopwatch mode
  const countdownTimer = useTimer(30 * 60); // 30 minutes

  const focusSounds = [
    { icon: '🌧️', name: 'Rain', id: 'rain' },
    { icon: '🔥', name: 'Fireplace', id: 'fireplace' },
    { icon: '💨', name: 'Wind', id: 'wind' },
    { icon: '☕', name: 'Cafe', id: 'cafe' },
    { icon: '🌲', name: 'Forest', id: 'forest' },
    { icon: '🔊', name: 'White Noise', id: 'whitenoise' },
  ];

  const formatTime = (seconds: number) => {
    const hours = Math.floor(seconds / 3600);
    const mins = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    
    if (hours > 0) {
      return `${hours}:${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    }
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const CircularProgress = ({ value, max, color }: { value: number; max: number; color: string }) => {
    const radius = 88;
    const circumference = 2 * Math.PI * radius;
    const progress = max > 0 ? (value / max) : 0;
    const strokeDashoffset = circumference * (1 - progress);

    return (
      <div className="relative w-48 h-48 mx-auto">
        <svg className="w-full h-full -rotate-90">
          <circle 
            cx="96" 
            cy="96" 
            r={radius} 
            fill="none" 
            stroke="hsl(var(--muted))" 
            strokeWidth="8"
          />
          <circle 
            cx="96" 
            cy="96" 
            r={radius} 
            fill="none" 
            stroke={color} 
            strokeWidth="8" 
            strokeDasharray={circumference}
            strokeDashoffset={strokeDashoffset}
            strokeLinecap="round"
            className="transition-all duration-300"
          />
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <div className="text-4xl font-bold font-mono" data-testid="text-timer-display">
            {formatTime(value)}
          </div>
          <div className="text-sm text-muted-foreground mt-1">
            {progress > 0 && max > 0 ? `${Math.round(progress * 100)}%` : 'Ready'}
          </div>
        </div>
      </div>
    );
  };

  return (
    <section className="mb-8" id="timer">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold">Focus Sessions</h2>
        <Button data-testid="button-new-session">
          <i className="fas fa-plus mr-2"></i>New Session
        </Button>
      </div>
      
      <div className="grid md:grid-cols-3 gap-6">
        {/* Pomodoro Timer */}
        <Card>
          <CardHeader className="pb-4">
            <div className="flex items-center justify-between">
              <CardTitle className="flex items-center gap-2 text-lg">
                <span className="text-destructive">🍅</span>
                Pomodoro
              </CardTitle>
              <Button variant="ghost" size="sm" data-testid="button-pomodoro-settings">
                <Settings className="h-4 w-4" />
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <CircularProgress 
              value={pomodoroTimer.timeLeft} 
              max={25 * 60} 
              color="hsl(var(--destructive))" 
            />
            
            <div className="flex items-center justify-center gap-3 mt-6">
              <Button 
                size="lg"
                className="w-12 h-12 rounded-full"
                variant={pomodoroTimer.isRunning ? "secondary" : "default"}
                onClick={pomodoroTimer.isRunning ? pomodoroTimer.pause : pomodoroTimer.start}
                data-testid="button-pomodoro-toggle"
              >
                {pomodoroTimer.isRunning ? <Pause className="h-5 w-5" /> : <Play className="h-5 w-5" />}
              </Button>
              <Button 
                variant="ghost" 
                size="sm"
                className="w-10 h-10 rounded-full"
                onClick={pomodoroTimer.reset}
                data-testid="button-pomodoro-reset"
              >
                <RotateCcw className="h-4 w-4" />
              </Button>
            </div>
            
            <div className="mt-6 pt-6 border-t border-border">
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Sessions today</span>
                <span className="font-medium" data-testid="text-pomodoro-sessions">3/8</span>
              </div>
            </div>
          </CardContent>
        </Card>
        
        {/* Study Timer */}
        <Card>
          <CardHeader className="pb-4">
            <div className="flex items-center justify-between">
              <CardTitle className="flex items-center gap-2 text-lg">
                <span className="text-secondary">📖</span>
                Study Timer
              </CardTitle>
              <Button variant="ghost" size="sm" data-testid="button-study-settings">
                <Settings className="h-4 w-4" />
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <CircularProgress 
              value={studyTimer.timeLeft} 
              max={studyTimer.timeLeft > 3600 ? studyTimer.timeLeft : 3600} 
              color="hsl(var(--secondary))" 
            />
            
            <div className="flex items-center justify-center gap-3 mt-6">
              <Button 
                size="lg"
                className="w-12 h-12 rounded-full"
                variant={studyTimer.isRunning ? "secondary" : "default"}
                onClick={studyTimer.isRunning ? studyTimer.pause : studyTimer.start}
                data-testid="button-study-toggle"
              >
                {studyTimer.isRunning ? <Pause className="h-5 w-5" /> : <Play className="h-5 w-5" />}
              </Button>
              <Button 
                variant="ghost" 
                size="sm"
                className="w-10 h-10 rounded-full"
                onClick={studyTimer.reset}
                data-testid="button-study-reset"
              >
                <RotateCcw className="h-4 w-4" />
              </Button>
            </div>
            
            <div className="mt-6 pt-6 border-t border-border">
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Subject</span>
                <span className="font-medium" data-testid="text-study-subject">Mathematics</span>
              </div>
            </div>
          </CardContent>
        </Card>
        
        {/* Countdown Timer */}
        <Card>
          <CardHeader className="pb-4">
            <div className="flex items-center justify-between">
              <CardTitle className="flex items-center gap-2 text-lg">
                <span className="text-accent">⏳</span>
                Countdown
              </CardTitle>
              <Button variant="ghost" size="sm" data-testid="button-countdown-settings">
                <Settings className="h-4 w-4" />
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <CircularProgress 
              value={countdownTimer.timeLeft} 
              max={30 * 60} 
              color="hsl(var(--accent))" 
            />
            
            <div className="flex items-center justify-center gap-3 mt-6">
              <Button 
                size="lg"
                className="w-12 h-12 rounded-full"
                variant={countdownTimer.isRunning ? "secondary" : "default"}
                onClick={countdownTimer.isRunning ? countdownTimer.pause : countdownTimer.start}
                data-testid="button-countdown-toggle"
              >
                {countdownTimer.isRunning ? <Pause className="h-5 w-5" /> : <Play className="h-5 w-5" />}
              </Button>
              <Button 
                variant="ghost" 
                size="sm"
                className="w-10 h-10 rounded-full"
                onClick={countdownTimer.reset}
                data-testid="button-countdown-reset"
              >
                <RotateCcw className="h-4 w-4" />
              </Button>
            </div>
            
            <div className="mt-6 pt-6 border-t border-border">
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Task</span>
                <span className="font-medium" data-testid="text-countdown-task">Submit Essay</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
      
      {/* Focus Sounds */}
      <Card className="mt-6">
        <CardHeader className="pb-4">
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              <Volume2 className="h-5 w-5 text-primary" />
              Focus Sounds
            </CardTitle>
            <Button variant="ghost" className="text-sm" data-testid="button-browse-sounds">
              Browse all sounds
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3 mb-6">
            {focusSounds.map((sound) => (
              <Button
                key={sound.id}
                variant="ghost"
                className="flex flex-col items-center gap-2 p-4 h-auto"
                data-testid={`button-sound-${sound.id}`}
              >
                <div className="w-12 h-12 bg-primary/10 text-primary rounded-full flex items-center justify-center text-2xl">
                  {sound.icon}
                </div>
                <span className="text-sm font-medium">{sound.name}</span>
              </Button>
            ))}
          </div>
          
          <div className="flex items-center gap-4 pt-6 border-t border-border">
            <Button 
              variant="ghost" 
              size="sm"
              onClick={() => setIsMuted(!isMuted)}
              data-testid="button-mute-toggle"
            >
              {isMuted ? <VolumeX className="h-4 w-4" /> : <Volume2 className="h-4 w-4" />}
            </Button>
            <div className="flex-1">
              <Slider
                value={[focusSoundVolume]}
                onValueChange={(value) => setFocusSoundVolume(value[0])}
                max={100}
                step={1}
                className="flex-1"
                data-testid="slider-volume"
              />
            </div>
            <span className="text-sm font-medium w-12 text-right" data-testid="text-volume">
              {focusSoundVolume}%
            </span>
          </div>
        </CardContent>
      </Card>
    </section>
  );
}
