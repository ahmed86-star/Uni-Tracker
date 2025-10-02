import { useState, useEffect, useRef } from 'react';

export function useTimer(initialTime: number, isStopwatch: boolean = false) {
  const [timeLeft, setTimeLeft] = useState(initialTime);
  const [isRunning, setIsRunning] = useState(false);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    if (isRunning) {
      intervalRef.current = setInterval(() => {
        setTimeLeft((prev) => {
          if (isStopwatch) {
            return prev + 1;
          } else {
            if (prev <= 1) {
              setIsRunning(false);
              return 0;
            }
            return prev - 1;
          }
        });
      }, 1000);
    } else {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    }

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [isRunning, isStopwatch]);

  const start = () => setIsRunning(true);
  const pause = () => setIsRunning(false);
  const reset = () => {
    setIsRunning(false);
    setTimeLeft(isStopwatch ? 0 : initialTime);
  };

  return {
    timeLeft,
    isRunning,
    start,
    pause,
    reset,
  };
}
