import { createContext, useContext, useState, useCallback } from "react";
import Joyride, { CallBackProps, Step, STATUS } from "react-joyride";

interface TourProviderProps {
  children: React.ReactNode;
}

interface TourContextValue {
  startTour: () => void;
  resetTour: () => void;
  isRunning: boolean;
}

const TourContext = createContext<TourContextValue | null>(null);

const steps: Step[] = [
  {
    target: '[data-tour="welcome"]',
    content: "Welcome to Uni Tracker! Let's take a quick tour to help you get started with all the features.",
    placement: "center",
  },
  {
    target: '[data-tour="timer-section"]',
    content: "Here you can start Pomodoro sessions, study timers, or countdown timers. Choose the one that fits your study style!",
    placement: "bottom",
  },
  {
    target: '[data-tour="tasks-section"]',
    content: "Manage all your tasks with our Kanban board. Drag and drop tasks between To Do, In Progress, and Done columns.",
    placement: "top",
  },
  {
    target: '[data-tour="calendar"]',
    content: "View your tasks and study sessions in a calendar format. Click on dates to see what's planned.",
    placement: "right",
  },
  {
    target: '[data-tour="notes"]',
    content: "Quick notes help you capture ideas, formulas, and important information. Tag them for easy organization.",
    placement: "left",
  },
  {
    target: '[data-tour="stats"]',
    content: "Track your progress with detailed statistics showing study time, streaks, and achievements.",
    placement: "top",
  },
  {
    target: '[data-tour="demo-banner"]',
    content: "You're in demo mode! Create an account to save your progress, or clear demo data anytime.",
    placement: "top",
  },
];

export function TourProvider({ children }: TourProviderProps) {
  const [run, setRun] = useState(false);
  const [stepIndex, setStepIndex] = useState(0);

  const startTour = useCallback(() => {
    setStepIndex(0);
    setRun(true);
  }, []);

  const resetTour = useCallback(() => {
    setStepIndex(0);
    setRun(false);
  }, []);

  const handleJoyrideCallback = (data: CallBackProps) => {
    const { status } = data;

    if ([STATUS.FINISHED, STATUS.SKIPPED].includes(status)) {
      setRun(false);
    }
  };

  return (
    <TourContext.Provider
      value={{
        startTour,
        resetTour,
        isRunning: run,
      }}
    >
      <Joyride
        steps={steps}
        run={run}
        continuous
        showProgress
        showSkipButton
        stepIndex={stepIndex}
        callback={handleJoyrideCallback}
        styles={{
          options: {
            primaryColor: "hsl(262 83% 58%)",
            backgroundColor: "hsl(var(--card))",
            textColor: "hsl(var(--foreground))",
            overlayColor: "rgba(0, 0, 0, 0.4)",
          },
        }}
      />
      {children}
    </TourContext.Provider>
  );
}

export const useTour = () => {
  const context = useContext(TourContext);
  if (!context) {
    throw new Error("useTour must be used within a TourProvider");
  }
  return context;
};
