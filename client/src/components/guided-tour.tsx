import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { X } from "lucide-react";

interface TourStep {
  target: string;
  title: string;
  content: string;
  position: 'top' | 'bottom' | 'left' | 'right' | 'center';
}

const tourSteps: TourStep[] = [
  {
    target: '#dashboard',
    title: 'Welcome to Uni Tracker!',
    content: "Let's take a quick tour to help you get started. We'll show you the key features and how to use them effectively.",
    position: 'center',
  },
  {
    target: '#timer',
    title: 'Focus Timers',
    content: 'Use Pomodoro, Study Timer, or Countdown to track your study sessions. Each timer helps you stay focused in different ways.',
    position: 'top',
  },
  {
    target: '#tasks',
    title: 'Task Management',
    content: 'Organize your tasks with our Kanban board. Drag tasks between columns and track your progress visually.',
    position: 'top',
  },
  {
    target: '#notes',
    title: 'Quick Notes',
    content: 'Capture ideas, formulas, and important information quickly. Tag your notes for easy organization.',
    position: 'bottom',
  },
  {
    target: '#stats',
    title: 'Track Your Progress',
    content: 'Monitor your study habits, view achievements, and see your progress across different subjects.',
    position: 'top',
  },
  {
    target: 'nav',
    title: 'You\'re All Set!',
    content: 'Great! You now know the main features. Start by creating your first task or starting a timer session.',
    position: 'center',
  },
];

export default function GuidedTour() {
  const [isActive, setIsActive] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);
  const [showTour, setShowTour] = useState(false);

  useEffect(() => {
    // Check if tour should be shown (e.g., first visit)
    const hasSeenTour = localStorage.getItem('hasSeenTour');
    if (!hasSeenTour) {
      setShowTour(true);
    }

    // Listen for tour start events
    const handleStartTour = () => {
      startTour();
    };

    document.addEventListener('startTour', handleStartTour);
    return () => document.removeEventListener('startTour', handleStartTour);
  }, []);

  const startTour = () => {
    setIsActive(true);
    setCurrentStep(0);
    setShowTour(false);
  };

  const nextStep = () => {
    if (currentStep < tourSteps.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      endTour();
    }
  };

  const endTour = () => {
    setIsActive(false);
    setCurrentStep(0);
    setShowTour(false);
    localStorage.setItem('hasSeenTour', 'true');
  };

  const skipTour = () => {
    endTour();
  };

  if (!isActive && !showTour) return null;

  const currentTourStep = tourSteps[currentStep];

  return (
    <>
      {/* Tour Overlay */}
      {isActive && (
        <div className="fixed inset-0 z-50">
          <div className="absolute inset-0 bg-black/50 backdrop-blur-sm"></div>
          
          {/* Tour Step */}
          <div className="absolute top-20 left-1/2 -translate-x-1/2">
            <Card className="shadow-2xl max-w-md border">
              <CardContent className="p-6">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-primary text-primary-foreground rounded-full flex items-center justify-center text-sm font-bold">
                      {currentStep + 1}
                    </div>
                    <h3 className="font-semibold" data-testid="text-tour-title">
                      {currentTourStep.title}
                    </h3>
                  </div>
                  <Button variant="ghost" size="sm" onClick={skipTour} data-testid="button-skip-tour">
                    <X className="h-4 w-4" />
                  </Button>
                </div>
                <p className="text-sm text-muted-foreground mb-6" data-testid="text-tour-content">
                  {currentTourStep.content}
                </p>
                <div className="flex items-center justify-between">
                  <Button variant="ghost" onClick={skipTour} data-testid="button-skip-tour-bottom">
                    Skip Tour
                  </Button>
                  <div className="flex items-center gap-3">
                    <span className="text-sm text-muted-foreground" data-testid="text-tour-progress">
                      {currentStep + 1} of {tourSteps.length}
                    </span>
                    <Button onClick={nextStep} data-testid="button-next-tour-step">
                      {currentStep === tourSteps.length - 1 ? 'Finish' : 'Next'}
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      )}

      {/* Initial Tour Prompt */}
      {showTour && !isActive && (
        <div className="fixed inset-0 z-40 flex items-center justify-center">
          <div className="absolute inset-0 bg-black/20 backdrop-blur-sm"></div>
          <Card className="shadow-2xl max-w-md border z-10">
            <CardContent className="p-6 text-center">
              <div className="w-16 h-16 bg-gradient-to-br from-primary to-secondary rounded-full flex items-center justify-center text-white text-2xl font-bold mx-auto mb-4">
                🎯
              </div>
              <h3 className="text-xl font-bold mb-2">Welcome to Uni Tracker!</h3>
              <p className="text-muted-foreground mb-6">
                Would you like a quick tour of the main features? It only takes 2 minutes.
              </p>
              <div className="flex gap-3 justify-center">
                <Button variant="outline" onClick={() => setShowTour(false)} data-testid="button-skip-initial-tour">
                  Maybe Later
                </Button>
                <Button onClick={startTour} data-testid="button-start-initial-tour">
                  Start Tour
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </>
  );
}
