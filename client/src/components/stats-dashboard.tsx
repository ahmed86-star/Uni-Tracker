import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { useAuth } from "@/hooks/useAuth";
import { Trophy, Flame, BookOpen, Target } from "lucide-react";

export default function StatsDashboard() {
  const { user } = useAuth();
  
  const { data: stats } = useQuery({
    queryKey: ['/api/stats'],
    enabled: !!user,
  });

  if (!stats) {
    return (
      <section className="mb-8" id="stats">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold">Statistics & Progress</h2>
        </div>
        <div className="text-center py-12 text-muted-foreground">
          <div className="text-4xl mb-2">📊</div>
          <div>Loading statistics...</div>
        </div>
      </section>
    );
  }

  return (
    <section className="mb-8" id="stats">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold">Statistics & Progress</h2>
        <Button variant="outline" data-testid="button-change-timerange">
          <i className="fas fa-calendar-days mr-2"></i>This Week
        </Button>
      </div>
      
      <div className="grid lg:grid-cols-2 gap-6">
        {/* Study Time Chart */}
        <Card>
          <CardHeader className="pb-4">
            <CardTitle>Study Time This Week</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {stats.weeklyStudyTime.map((dayData, index) => (
              <div key={dayData.day} className="flex items-center gap-4">
                <span className="text-sm font-medium w-12 text-muted-foreground" data-testid={`text-day-${dayData.day.toLowerCase()}`}>
                  {dayData.day}
                </span>
                <div className="flex-1 bg-muted rounded-full h-3 overflow-hidden">
                  <div 
                    className="bg-gradient-to-r from-primary to-secondary h-full rounded-full transition-all" 
                    style={{ width: `${(dayData.hours / 5) * 100}%` }}
                  ></div>
                </div>
                <span className="text-sm font-medium w-16 text-right" data-testid={`text-hours-${dayData.day.toLowerCase()}`}>
                  {dayData.hours}h
                </span>
              </div>
            ))}
            
            <div className="mt-6 pt-6 border-t border-border">
              <div className="flex justify-between items-center">
                <span className="text-sm text-muted-foreground">Weekly Total</span>
                <span className="text-lg font-bold" data-testid="text-weekly-total">
                  {stats.weeklyStudyTime.reduce((total, day) => total + day.hours, 0).toFixed(1)} hours
                </span>
              </div>
            </div>
          </CardContent>
        </Card>
        
        {/* Achievements & Streaks */}
        <Card>
          <CardHeader className="pb-4">
            <CardTitle>Achievements</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 gap-4 mb-6">
              <div className="bg-gradient-to-br from-primary/20 to-secondary/20 rounded-lg p-4 text-center">
                <div className="w-12 h-12 bg-primary text-primary-foreground rounded-full flex items-center justify-center mx-auto mb-2">
                  <Trophy className="h-6 w-6" />
                </div>
                <div className="text-2xl font-bold mb-1" data-testid="text-achievement-count">12</div>
                <div className="text-xs text-muted-foreground">Achievements</div>
              </div>
              
              <div className="bg-gradient-to-br from-accent/20 to-secondary/20 rounded-lg p-4 text-center">
                <div className="w-12 h-12 bg-accent text-accent-foreground rounded-full flex items-center justify-center mx-auto mb-2">
                  <Flame className="h-6 w-6" />
                </div>
                <div className="text-2xl font-bold mb-1" data-testid="text-streak-days">
                  {stats.currentStreak}
                </div>
                <div className="text-xs text-muted-foreground">Day Streak</div>
              </div>
            </div>
            
            {/* Recent Achievements */}
            <div className="space-y-3">
              <Card className="bg-background">
                <CardContent className="p-3">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-primary/10 text-primary rounded-full flex items-center justify-center">
                      <Target className="h-5 w-5" />
                    </div>
                    <div className="flex-1">
                      <h4 className="font-medium text-sm">Focus Master</h4>
                      <p className="text-xs text-muted-foreground">Complete 50 Pomodoro sessions</p>
                    </div>
                    <span className="text-xs text-muted-foreground">2 days ago</span>
                  </div>
                </CardContent>
              </Card>
              
              <Card className="bg-background">
                <CardContent className="p-3">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-accent/10 text-accent rounded-full flex items-center justify-center">
                      <i className="fas fa-check text-lg"></i>
                    </div>
                    <div className="flex-1">
                      <h4 className="font-medium text-sm">Task Warrior</h4>
                      <p className="text-xs text-muted-foreground">Complete 100 tasks</p>
                    </div>
                    <span className="text-xs text-muted-foreground">5 days ago</span>
                  </div>
                </CardContent>
              </Card>
              
              <Card className="bg-background">
                <CardContent className="p-3">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-secondary/10 text-secondary rounded-full flex items-center justify-center">
                      <BookOpen className="h-5 w-5" />
                    </div>
                    <div className="flex-1">
                      <h4 className="font-medium text-sm">Study Streak</h4>
                      <p className="text-xs text-muted-foreground">Study 7 days in a row</p>
                    </div>
                    <span className="text-xs text-muted-foreground">1 week ago</span>
                  </div>
                </CardContent>
              </Card>
            </div>
            
            <Button variant="outline" className="w-full mt-6" data-testid="button-view-achievements">
              View All Achievements
            </Button>
          </CardContent>
        </Card>
      </div>
      
      {/* Subject Progress */}
      <Card className="mt-6">
        <CardHeader className="pb-4">
          <CardTitle>Progress by Subject</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid md:grid-cols-3 gap-6">
            {stats.subjectProgress.map((subject, index) => {
              const colors = ['bg-primary', 'bg-secondary', 'bg-accent'];
              const percentage = Math.min((subject.tasksCompleted / 15) * 100, 100); // Assuming 15 tasks is 100%
              
              return (
                <div key={subject.subject}>
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-2">
                      <div className={`w-3 h-3 ${colors[index]} rounded-full`}></div>
                      <span className="font-medium text-sm" data-testid={`text-subject-${subject.subject.toLowerCase()}`}>
                        {subject.subject}
                      </span>
                    </div>
                    <span className="text-sm font-medium" data-testid={`text-subject-hours-${subject.subject.toLowerCase()}`}>
                      {subject.hours}h
                    </span>
                  </div>
                  <Progress value={percentage} className="h-2 mb-2" />
                  <div className="flex justify-between text-xs text-muted-foreground">
                    <span data-testid={`text-subject-tasks-${subject.subject.toLowerCase()}`}>
                      {subject.tasksCompleted} tasks completed
                    </span>
                    <span>{Math.round(percentage)}%</span>
                  </div>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>
    </section>
  );
}
