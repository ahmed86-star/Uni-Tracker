import { useQuery } from "@tanstack/react-query";
import { Navigation } from "@/components/Navigation";
import { StudyTimeChart } from "@/components/stats/StudyTimeChart";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Trophy, Target, Clock, BookOpen, TrendingUp, Calendar } from "lucide-react";

export default function Stats() {
  const { data: dailyStats = [] } = useQuery({
    queryKey: ["/api/stats/daily", 7],
  });

  const { data: subjectProgress = [] } = useQuery({
    queryKey: ["/api/stats/subjects"],
  });

  const { data: achievements = [] } = useQuery({
    queryKey: ["/api/achievements"],
  });

  const { data: streak } = useQuery({
    queryKey: ["/api/streak"],
  });

  // Calculate weekly totals
  const weeklyTotal = dailyStats.reduce((sum: number, day: any) => sum + (day.totalMinutes || 0), 0);
  const totalSessions = dailyStats.reduce((sum: number, day: any) => sum + (day.sessionCount || 0), 0);

  const formatMinutes = (minutes: number) => {
    if (minutes < 60) return `${minutes}m`;
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return mins > 0 ? `${hours}h ${mins}m` : `${hours}h`;
  };

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8" data-tour="stats">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Statistics & Progress</h1>
          <p className="text-muted-foreground">
            Track your study habits and see your progress over time
          </p>
        </div>

        {/* Quick Stats */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-3">
                <div className="w-10 h-10 bg-primary/10 text-primary rounded-lg flex items-center justify-center">
                  <Clock className="h-5 w-5" />
                </div>
                <span className="text-xs text-muted-foreground">This Week</span>
              </div>
              <div className="text-3xl font-bold mb-1" data-testid="stat-weekly-time">
                {formatMinutes(weeklyTotal)}
              </div>
              <div className="text-sm text-muted-foreground">Study Time</div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-3">
                <div className="w-10 h-10 bg-secondary/10 text-secondary rounded-lg flex items-center justify-center">
                  <Target className="h-5 w-5" />
                </div>
                <span className="text-xs text-muted-foreground">This Week</span>
              </div>
              <div className="text-3xl font-bold mb-1" data-testid="stat-sessions">
                {totalSessions}
              </div>
              <div className="text-sm text-muted-foreground">Sessions</div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-3">
                <div className="w-10 h-10 bg-accent/10 text-accent rounded-lg flex items-center justify-center">
                  <TrendingUp className="h-5 w-5" />
                </div>
                <span className="text-xs text-muted-foreground">Current</span>
              </div>
              <div className="text-3xl font-bold mb-1" data-testid="stat-streak">
                {streak?.currentStreak || 0}
              </div>
              <div className="text-sm text-muted-foreground">Day Streak</div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-3">
                <div className="w-10 h-10 bg-primary/10 text-primary rounded-lg flex items-center justify-center">
                  <Trophy className="h-5 w-5" />
                </div>
                <span className="text-xs text-muted-foreground">Earned</span>
              </div>
              <div className="text-3xl font-bold mb-1" data-testid="stat-achievements">
                {achievements.length}
              </div>
              <div className="text-sm text-muted-foreground">Achievements</div>
            </CardContent>
          </Card>
        </div>

        <div className="grid lg:grid-cols-2 gap-6">
          {/* Study Time Chart */}
          <StudyTimeChart data={dailyStats} />

          {/* Achievements */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Trophy className="h-5 w-5 text-primary" />
                Recent Achievements
              </CardTitle>
            </CardHeader>
            <CardContent>
              {achievements.length === 0 ? (
                <div className="text-center py-8">
                  <Trophy className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                  <p className="text-muted-foreground">
                    No achievements yet. Keep studying to unlock your first one!
                  </p>
                </div>
              ) : (
                <div className="space-y-4">
                  {achievements.slice(0, 5).map((achievement: any) => (
                    <div key={achievement.id} className="flex items-center gap-3 p-3 bg-background rounded-lg">
                      <div className="w-10 h-10 bg-primary/10 text-primary rounded-full flex items-center justify-center text-xl">
                        {achievement.icon}
                      </div>
                      <div className="flex-1">
                        <h4 className="font-medium text-sm">{achievement.title}</h4>
                        <p className="text-xs text-muted-foreground">{achievement.description}</p>
                      </div>
                      <span className="text-xs text-muted-foreground">
                        {new Date(achievement.unlockedAt).toLocaleDateString()}
                      </span>
                    </div>
                  ))}
                  
                  {achievements.length > 5 && (
                    <Button variant="outline" className="w-full" data-testid="button-view-all-achievements">
                      View All Achievements ({achievements.length})
                    </Button>
                  )}
                </div>
              )}
            </CardContent>
          </Card>

          {/* Subject Progress */}
          <Card className="lg:col-span-2">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <BookOpen className="h-5 w-5 text-secondary" />
                Progress by Subject
              </CardTitle>
            </CardHeader>
            <CardContent>
              {subjectProgress.length === 0 ? (
                <div className="text-center py-8">
                  <BookOpen className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                  <p className="text-muted-foreground">
                    No subject data yet. Start studying with specific subjects to see progress here!
                  </p>
                </div>
              ) : (
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {subjectProgress.map((subject: any, index: number) => {
                    const colors = [
                      "bg-primary",
                      "bg-secondary", 
                      "bg-accent",
                      "bg-destructive",
                      "bg-orange-500",
                      "bg-green-500",
                    ];
                    const completionRate = subject.totalTasks > 0 
                      ? Math.round((subject.completedTasks / subject.totalTasks) * 100)
                      : 0;
                    
                    return (
                      <div key={subject.subject || index}>
                        <div className="flex items-center justify-between mb-3">
                          <div className="flex items-center gap-2">
                            <div className={`w-3 h-3 rounded-full ${colors[index % colors.length]}`}></div>
                            <span className="font-medium text-sm">{subject.subject || "General"}</span>
                          </div>
                          <span className="text-sm font-medium">{formatMinutes(subject.totalMinutes || 0)}</span>
                        </div>
                        <Progress value={completionRate} className="mb-2" />
                        <div className="flex justify-between text-xs text-muted-foreground">
                          <span>{subject.completedTasks || 0} of {subject.totalTasks || 0} tasks</span>
                          <span>{completionRate}%</span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
}
