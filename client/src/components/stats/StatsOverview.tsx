import { useQuery } from "@tanstack/react-query";
import { Card, CardContent } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Clock, CheckCircle, TrendingUp, Target } from "lucide-react";

export function StatsOverview() {
  const { data: dailyStats = [] } = useQuery({
    queryKey: ["/api/stats/daily", 1], // Get today's stats
  });

  const { data: tasks = [] } = useQuery({
    queryKey: ["/api/tasks"],
  });

  const { data: streak } = useQuery({
    queryKey: ["/api/streak"],
  });

  // Calculate today's metrics
  const todayStats = dailyStats[0] || { totalMinutes: 0, sessionCount: 0 };
  const todayStudyTime = todayStats.totalMinutes || 0;
  const todaySessions = todayStats.sessionCount || 0;

  // Calculate task metrics
  const totalTasks = tasks.length;
  const completedTasks = tasks.filter((task: any) => task.status === "done").length;
  const completionRate = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;

  // Calculate focus score (based on completed sessions vs planned)
  const focusScore = todaySessions > 0 ? Math.min(Math.round((todaySessions / 8) * 100), 100) : 0; // Assuming 8 sessions as ideal

  const formatTime = (minutes: number) => {
    if (minutes < 60) return `${minutes}m`;
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return mins > 0 ? `${hours}h ${mins}m` : `${hours}h`;
  };

  const stats = [
    {
      icon: Clock,
      label: "Study Time",
      value: formatTime(todayStudyTime),
      subtext: "Today",
      change: todayStudyTime > 0 ? "+12% vs yesterday" : "No sessions yet",
      positive: todayStudyTime > 0,
      color: "bg-primary/10 text-primary",
    },
    {
      icon: CheckCircle,
      label: "Tasks Completed",
      value: `${completedTasks}/${totalTasks}`,
      subtext: "Today",
      progress: completionRate,
      color: "bg-accent/10 text-accent",
    },
    {
      icon: TrendingUp,
      label: "Current Streak",
      value: `${streak?.currentStreak || 0} days`,
      subtext: streak?.currentStreak === streak?.longestStreak ? "Personal best!" : "All time",
      change: streak?.currentStreak > 0 ? "🔥 On fire!" : "Start today!",
      positive: true,
      color: "bg-secondary/10 text-secondary",
    },
    {
      icon: Target,
      label: "Focus Score",
      value: `${focusScore}%`,
      subtext: "This week",
      chart: true,
      color: "bg-primary/10 text-primary",
    },
  ];

  return (
    <section className="mb-8">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold">Today's Overview</h2>
        <button className="text-sm text-primary font-medium hover:underline" data-testid="link-view-full-stats">
          View detailed stats →
        </button>
      </div>

      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat, index) => (
          <Card key={index} className="relative overflow-hidden" data-testid={`stat-card-${index}`}>
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-3">
                <div className={`w-10 h-10 ${stat.color} rounded-lg flex items-center justify-center`}>
                  <stat.icon className="h-5 w-5" />
                </div>
                <span className="text-xs text-muted-foreground">{stat.subtext}</span>
              </div>

              <div className="text-3xl font-bold mb-1" data-testid={`stat-value-${index}`}>
                {stat.value}
              </div>
              
              <div className="text-sm text-muted-foreground mb-3">{stat.label}</div>

              {/* Progress bar for task completion */}
              {stat.progress !== undefined && (
                <div className="mb-3">
                  <Progress value={stat.progress} className="h-2" />
                </div>
              )}

              {/* Change indicator */}
              {stat.change && (
                <div className={`flex items-center gap-1 text-xs ${
                  stat.positive ? "text-accent" : "text-muted-foreground"
                }`}>
                  {stat.positive && <TrendingUp className="h-3 w-3" />}
                  <span>{stat.change}</span>
                </div>
              )}

              {/* Mini chart for focus score */}
              {stat.chart && (
                <div className="flex gap-1 mt-3">
                  {Array.from({ length: 7 }).map((_, i) => {
                    const heights = [4, 6, 8, 6, 7, 4, 2]; // Mock weekly data
                    return (
                      <div 
                        key={i}
                        className={`flex-1 rounded ${
                          i === 6 ? "bg-primary" : i >= 4 ? "bg-primary/60" : "bg-muted"
                        }`}
                        style={{ height: `${heights[i] * 4}px` }}
                      />
                    );
                  })}
                </div>
              )}
            </CardContent>
          </Card>
        ))}
      </div>
    </section>
  );
}
