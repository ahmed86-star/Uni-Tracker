import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { X, ArrowRight, CheckCircle } from "lucide-react";

interface TourStep {
  target: string;
  title: string;
  content: string;
  instructions: string[];
  position: 'top' | 'bottom' | 'left' | 'right' | 'center';
}

const tourSteps: TourStep[] = [
  {
    target: '#dashboard',
    title: '👋 Welcome to Uni Tracker!',
    content: "Your all-in-one productivity companion for university life. Let's explore the key features together!",
    instructions: [
      "This tour will show you how to use all features",
      "You can skip anytime or restart later",
      "Each step highlights what you need to know"
    ],
    position: 'center',
  },
  {
    target: 'tabs-list',
    title: '📑 Main Navigation Tabs',
    content: "Switch between different sections of your dashboard using these tabs.",
    instructions: [
      "Dashboard - Your daily overview and quick stats",
      "Subjects - Manage your courses and study goals",
      "Motivation - Get inspired with quotes and study tips",
      "Profile - Update your major and hobbies",
      "Stats - View detailed progress and achievements"
    ],
    position: 'bottom',
  },
  {
    target: 'text-study-time',
    title: '⏱️ Today\'s Study Time',
    content: "Track your daily study hours automatically as you use timers.",
    instructions: [
      "Shows total minutes/hours studied today",
      "Updates in real-time as you complete timer sessions",
      "Compare with yesterday's performance"
    ],
    position: 'bottom',
  },
  {
    target: 'text-completed-tasks',
    title: '✅ Task Progress',
    content: "See your task completion rate for today at a glance.",
    instructions: [
      "Shows completed vs total tasks for today",
      "Progress bar visualizes completion percentage",
      "Stay motivated by completing more tasks!"
    ],
    position: 'bottom',
  },
  {
    target: 'link-timers',
    title: '🎯 Focus Timers',
    content: "Use different timer types for various study methods. Click 'Timers' in the navigation to jump to this section.",
    instructions: [
      "Pomodoro Timer - 25-minute focused sessions",
      "Study Timer - Flexible countdown for any duration",
      "Countdown Timer - Set custom time for specific tasks",
      "Track all sessions in your statistics"
    ],
    position: 'bottom',
  },
  {
    target: 'link-tasks',
    title: '📋 Task Management',
    content: "Organize your work with our powerful Kanban board. Click 'Tasks' to see it.",
    instructions: [
      "Create tasks with title, description, and priority",
      "Drag cards between: To Do → In Progress → Done",
      "Set due dates and track progress",
      "Filter by subject or priority level"
    ],
    position: 'bottom',
  },
  {
    target: 'link-notes',
    title: '📝 Quick Notes',
    content: "Capture ideas, formulas, and important information instantly.",
    instructions: [
      "Click 'New Note' to create a note",
      "Add title, content, and organize with tags",
      "Search and filter notes by tags",
      "Edit or delete notes anytime"
    ],
    position: 'bottom',
  },
  {
    target: 'link-stats',
    title: '📊 Statistics Dashboard',
    content: "Monitor your productivity patterns and celebrate achievements.",
    instructions: [
      "View weekly study time breakdown by day",
      "Track subject-wise progress and hours",
      "See your current study streak",
      "Unlock achievements as you progress"
    ],
    position: 'bottom',
  },
  {
    target: 'tab-subjects',
    title: '📚 Subjects Management',
    content: "Organize your courses with custom colors and study targets.",
    instructions: [
      "Click 'Subjects' tab to manage your courses",
      "Add subjects with emoji icons and colors",
      "Set weekly study hour targets",
      "Track progress for each subject"
    ],
    position: 'bottom',
  },
  {
    target: 'tab-motivation',
    title: '✨ Stay Motivated',
    content: "Get daily inspiration and study tips to keep you going.",
    instructions: [
      "Click 'Motivation' tab for quotes and tips",
      "Read science-backed study techniques",
      "Get inspired with motivational quotes",
      "Refresh anytime you need a boost"
    ],
    position: 'bottom',
  },
  {
    target: 'tab-profile',
    title: '👤 Your Profile',
    content: "Personalize your experience with your academic info.",
    instructions: [
      "Click 'Profile' tab to update your details",
      "Add your major/field of study",
      "List your hobbies and interests",
      "Reset all data if needed (careful!)"
    ],
    position: 'bottom',
  },
  {
    target: 'button-theme-toggle',
    title: '🌙 Dark Mode Toggle',
    content: "Switch between light and dark themes for comfortable viewing.",
    instructions: [
      "Click this button to toggle dark/light mode",
      "Your preference is saved automatically",
      "Perfect for late-night study sessions"
    ],
    position: 'bottom',
  },
  {
    target: 'text-auth-status-nav',
    title: '🔐 Authentication',
    content: "Currently in demo mode - authentication coming soon!",
    instructions: [
      "App is free to use without login",
      "Your data is stored locally in demo mode",
      "Full authentication will be added in future updates"
    ],
    position: 'bottom',
  },
  {
    target: 'center',
    title: '🎉 You\'re All Set!',
    content: "You now know all the main features of Uni Tracker. Time to boost your productivity!",
    instructions: [
      "Start by creating your first task or subject",
      "Use a timer for your next study session",
      "Track your progress in the Stats tab",
      "You can restart this tour anytime from settings"
    ],
    position: 'center',
  },
];

export default function GuidedTour() {
  const [isActive, setIsActive] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);
  const [showTour, setShowTour] = useState(false);

  useEffect(() => {
    const hasSeenTour = localStorage.getItem('hasSeenTour');
    if (!hasSeenTour) {
      setTimeout(() => setShowTour(true), 1000);
    }

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
      scrollToTarget(tourSteps[currentStep + 1].target);
    } else {
      endTour();
    }
  };

  const previousStep = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
      scrollToTarget(tourSteps[currentStep - 1].target);
    }
  };

  const scrollToTarget = (target: string) => {
    if (target === 'center') return;
    
    const element = document.querySelector(`[data-testid="${target}"]`) || document.getElementById(target);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'center' });
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

  useEffect(() => {
    if (isActive) {
      scrollToTarget(tourSteps[currentStep].target);
    }
  }, [currentStep, isActive]);

  if (!isActive && !showTour) return null;

  const currentTourStep = tourSteps[currentStep];
  const progressPercent = ((currentStep + 1) / tourSteps.length) * 100;

  return (
    <>
      {isActive && (
        <div className="fixed inset-0 z-50 pointer-events-none">
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm pointer-events-auto"></div>
          
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-auto">
            <Card className="shadow-2xl max-w-xl border-2 border-primary/20">
              <div className="w-full h-1.5 bg-muted">
                <div 
                  className="h-full bg-gradient-to-r from-primary to-secondary transition-all duration-300" 
                  style={{ width: `${progressPercent}%` }}
                ></div>
              </div>
              
              <CardContent className="p-8">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-gradient-to-br from-primary to-secondary text-primary-foreground rounded-full flex items-center justify-center text-sm font-bold">
                      {currentStep + 1}
                    </div>
                    <h3 className="text-xl font-bold" data-testid="text-tour-title">
                      {currentTourStep.title}
                    </h3>
                  </div>
                  <Button variant="ghost" size="sm" onClick={skipTour} data-testid="button-skip-tour">
                    <X className="h-4 w-4" />
                  </Button>
                </div>

                <p className="text-muted-foreground mb-4 leading-relaxed" data-testid="text-tour-content">
                  {currentTourStep.content}
                </p>

                <div className="bg-muted/50 rounded-lg p-4 mb-6">
                  <div className="flex items-center gap-2 mb-3">
                    <CheckCircle className="h-4 w-4 text-primary" />
                    <span className="font-semibold text-sm">What you need to know:</span>
                  </div>
                  <ul className="space-y-2">
                    {currentTourStep.instructions.map((instruction, index) => (
                      <li key={index} className="flex items-start gap-2 text-sm">
                        <ArrowRight className="h-4 w-4 text-primary mt-0.5 flex-shrink-0" />
                        <span className="text-muted-foreground">{instruction}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    {currentStep > 0 && (
                      <Button variant="outline" onClick={previousStep} data-testid="button-previous-tour-step">
                        Previous
                      </Button>
                    )}
                    <Button variant="ghost" onClick={skipTour} data-testid="button-skip-tour-bottom">
                      Skip Tour
                    </Button>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="text-sm text-muted-foreground font-medium" data-testid="text-tour-progress">
                      Step {currentStep + 1} of {tourSteps.length}
                    </span>
                    <Button onClick={nextStep} data-testid="button-next-tour-step" className="min-w-24">
                      {currentStep === tourSteps.length - 1 ? 'Finish ✨' : 'Next →'}
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      )}

      {showTour && !isActive && (
        <div className="fixed inset-0 z-40 flex items-center justify-center">
          <div className="absolute inset-0 bg-black/40 backdrop-blur-sm"></div>
          <Card className="shadow-2xl max-w-lg border-2 border-primary/20 z-10 mx-4">
            <CardContent className="p-8 text-center">
              <div className="w-20 h-20 bg-gradient-to-br from-primary via-secondary to-accent rounded-2xl flex items-center justify-center text-white text-3xl font-bold mx-auto mb-6 shadow-lg">
                🎯
              </div>
              <h3 className="text-2xl font-bold mb-3">Welcome to Uni Tracker!</h3>
              <p className="text-muted-foreground mb-6 leading-relaxed">
                New here? Take a quick interactive tour to discover all the powerful features 
                that will help you stay organized and productive. It only takes 3 minutes!
              </p>
              
              <div className="bg-muted/50 rounded-lg p-4 mb-6">
                <div className="grid grid-cols-2 gap-3 text-sm">
                  <div className="flex items-center gap-2">
                    <span className="text-lg">⏱️</span>
                    <span className="text-muted-foreground">Focus Timers</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-lg">📋</span>
                    <span className="text-muted-foreground">Task Management</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-lg">📝</span>
                    <span className="text-muted-foreground">Quick Notes</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-lg">📊</span>
                    <span className="text-muted-foreground">Progress Tracking</span>
                  </div>
                </div>
              </div>

              <div className="flex gap-3 justify-center">
                <Button variant="outline" onClick={() => { setShowTour(false); localStorage.setItem('hasSeenTour', 'true'); }} data-testid="button-skip-initial-tour">
                  Skip for Now
                </Button>
                <Button onClick={startTour} data-testid="button-start-initial-tour" className="min-w-32">
                  Start Tour →
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </>
  );
}
