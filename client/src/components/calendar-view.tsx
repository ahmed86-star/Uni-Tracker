import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";

export default function CalendarView() {
  const [currentDate, setCurrentDate] = useState(new Date());
  
  const monthNames = [
    "January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December"
  ];
  
  const dayNames = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
  
  const today = new Date();
  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();
  
  const firstDayOfMonth = new Date(year, month, 1);
  const lastDayOfMonth = new Date(year, month + 1, 0);
  const daysInMonth = lastDayOfMonth.getDate();
  const startingDayOfWeek = firstDayOfMonth.getDay();
  
  const navigateMonth = (direction: 'prev' | 'next') => {
    setCurrentDate(prev => {
      const newDate = new Date(prev);
      if (direction === 'prev') {
        newDate.setMonth(prev.getMonth() - 1);
      } else {
        newDate.setMonth(prev.getMonth() + 1);
      }
      return newDate;
    });
  };
  
  const isToday = (day: number) => {
    return today.getDate() === day && 
           today.getMonth() === month && 
           today.getFullYear() === year;
  };
  
  // No mock events - will be replaced with real task data
  const hasEvents = (day: number) => {
    return false;
  };
  
  const getEventColor = (day: number) => {
    return 'bg-primary';
  };

  return (
    <Card id="calendar">
      <CardHeader className="pb-4">
        <div className="flex items-center justify-between">
          <CardTitle>Calendar</CardTitle>
          <div className="flex items-center gap-2">
            <Button 
              variant="ghost" 
              size="sm"
              onClick={() => navigateMonth('prev')}
              data-testid="button-prev-month"
            >
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <span className="font-medium px-3" data-testid="text-current-month">
              {monthNames[month]} {year}
            </span>
            <Button 
              variant="ghost" 
              size="sm"
              onClick={() => navigateMonth('next')}
              data-testid="button-next-month"
            >
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-2">
        {/* Weekday Headers */}
        <div className="grid grid-cols-7 gap-1 mb-2">
          {dayNames.map((day) => (
            <div key={day} className="text-center text-xs font-medium text-muted-foreground py-2">
              {day}
            </div>
          ))}
        </div>
        
        {/* Calendar Grid */}
        <div className="grid grid-cols-7 gap-1">
          {/* Empty cells for days before the first day of the month */}
          {Array.from({ length: startingDayOfWeek }, (_, index) => (
            <div key={`empty-${index}`} className="aspect-square p-1"></div>
          ))}
          
          {/* Days of the month */}
          {Array.from({ length: daysInMonth }, (_, index) => {
            const day = index + 1;
            return (
              <div key={day} className="aspect-square p-1 relative">
                <Button
                  variant="ghost"
                  className={cn(
                    "w-full h-full rounded-lg text-sm transition-colors",
                    isToday(day) && "bg-primary text-primary-foreground font-medium"
                  )}
                  data-testid={`button-calendar-day-${day}`}
                >
                  {day}
                </Button>
                
                {/* Event indicators */}
                {hasEvents(day) && (
                  <div className="absolute bottom-1 left-1/2 -translate-x-1/2">
                    {day === 12 ? (
                      <div className="flex gap-0.5">
                        <div className="w-1 h-1 bg-primary-foreground rounded-full"></div>
                        <div className="w-1 h-1 bg-primary-foreground rounded-full"></div>
                      </div>
                    ) : (
                      <div className={cn("w-1 h-1 rounded-full", getEventColor(day))}></div>
                    )}
                  </div>
                )}
              </div>
            );
          })}
        </div>
        
        {/* Event Indicators Legend */}
        <div className="mt-6 pt-6 border-t border-border">
          <div className="flex flex-wrap gap-4 text-sm">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-primary rounded-full"></div>
              <span className="text-muted-foreground">Tasks</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-destructive rounded-full"></div>
              <span className="text-muted-foreground">Deadlines</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-accent rounded-full"></div>
              <span className="text-muted-foreground">Exams</span>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
