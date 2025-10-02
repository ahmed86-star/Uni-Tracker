import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { BarChart3 } from "lucide-react";

interface DayStats {
  date: string;
  totalMinutes: number;
  sessionCount: number;
}

interface StudyTimeChartProps {
  data: DayStats[];
}

export function StudyTimeChart({ data }: StudyTimeChartProps) {
  const formatMinutes = (minutes: number) => {
    if (minutes < 60) return `${minutes}m`;
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return mins > 0 ? `${hours}h ${mins}m` : `${hours}h`;
  };

  const getDayName = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { weekday: 'short' });
  };

  // Calculate max time for progress bars
  const maxTime = Math.max(...data.map(d => d.totalMinutes || 0), 1);

  // Calculate weekly total
  const weeklyTotal = data.reduce((sum, day) => sum + (day.totalMinutes || 0), 0);

  // Pad data to show full week
  const weekDays = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
  const chartData = weekDays.map(day => {
    const existingData = data.find(d => getDayName(d.date) === day);
    return {
      day,
      minutes: existingData?.totalMinutes || 0,
      sessions: existingData?.sessionCount || 0,
    };
  });

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <BarChart3 className="h-5 w-5 text-primary" />
          Study Time This Week
        </CardTitle>
      </CardHeader>
      <CardContent>
        {chartData.length === 0 || weeklyTotal === 0 ? (
          <div className="flex flex-col items-center justify-center py-8 text-center">
            <BarChart3 className="h-12 w-12 text-muted-foreground mb-4" />
            <h3 className="text-lg font-semibold mb-2">No study data yet</h3>
            <p className="text-muted-foreground text-sm">
              Start a study session to see your progress here
            </p>
          </div>
        ) : (
          <>
            <div className="space-y-4 mb-6">
              {chartData.map((day) => (
                <div key={day.day} className="flex items-center gap-4">
                  <span className="text-sm font-medium w-12 text-muted-foreground">
                    {day.day}
                  </span>
                  <div className="flex-1 bg-muted rounded-full h-3 overflow-hidden">
                    <div 
                      className="bg-gradient-to-r from-primary to-secondary h-full rounded-full transition-all duration-300"
                      style={{ 
                        width: `${maxTime > 0 ? (day.minutes / maxTime) * 100 : 0}%` 
                      }}
                      data-testid={`chart-bar-${day.day}`}
                    />
                  </div>
                  <span 
                    className="text-sm font-medium w-16 text-right"
                    data-testid={`chart-value-${day.day}`}
                  >
                    {formatMinutes(day.minutes)}
                  </span>
                </div>
              ))}
            </div>

            <div className="pt-6 border-t border-border">
              <div className="flex justify-between items-center">
                <span className="text-sm text-muted-foreground">Weekly Total</span>
                <span className="text-lg font-bold" data-testid="weekly-total">
                  {formatMinutes(weeklyTotal)}
                </span>
              </div>
            </div>
          </>
        )}
      </CardContent>
    </Card>
  );
}
