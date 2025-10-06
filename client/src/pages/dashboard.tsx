import { useState } from "react";
import { useAuth } from "@/hooks/useAuth";
import Navigation from "@/components/navigation";
import TimerSection from "@/components/timer-section";
import KanbanBoard from "@/components/kanban-board";
import CalendarView from "@/components/calendar-view";
import NotesPanel from "@/components/notes-panel";
import StatsDashboard from "@/components/stats-dashboard";
import DemoBanner from "@/components/demo-banner";
import GuidedTour from "@/components/guided-tour";
import Subjects from "./Subjects";
import Motivation from "./Motivation";
import Profile from "./Profile";
import { useQuery } from "@tanstack/react-query";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Clock, CheckCircle, Flame, Brain, Home, BookOpen, Sparkles, User } from "lucide-react";
import type { UserStats } from "@shared/schema";

export default function Dashboard() {
  const { user, isLoading } = useAuth();
  const [activeTab, setActiveTab] = useState("dashboard");

  const { data: stats } = useQuery<UserStats>({
    queryKey: ['/api/stats'],
    enabled: !!user,
  });

  if (isLoading) {
    return (
      <div className="min-h-screen w-full flex items-center justify-center bg-background">
        <div className="text-center">
          <div className="w-12 h-12 bg-gradient-to-br from-primary to-secondary rounded-lg flex items-center justify-center text-white text-xl font-bold mx-auto mb-4">
            📚
          </div>
          <div className="text-lg font-semibold">Loading dashboard...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      <GuidedTour />
      
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-5 mb-8" data-testid="tabs-list">
            <TabsTrigger value="dashboard" className="gap-2" data-testid="tab-dashboard">
              <Home className="w-4 h-4" />
              <span className="hidden sm:inline">Dashboard</span>
            </TabsTrigger>
            <TabsTrigger value="subjects" className="gap-2" data-testid="tab-subjects">
              <BookOpen className="w-4 h-4" />
              <span className="hidden sm:inline">Subjects</span>
            </TabsTrigger>
            <TabsTrigger value="motivation" className="gap-2" data-testid="tab-motivation">
              <Sparkles className="w-4 h-4" />
              <span className="hidden sm:inline">Motivation</span>
            </TabsTrigger>
            <TabsTrigger value="profile" className="gap-2" data-testid="tab-profile">
              <User className="w-4 h-4" />
              <span className="hidden sm:inline">Profile</span>
            </TabsTrigger>
            <TabsTrigger value="stats" className="gap-2" data-testid="tab-stats">
              <Brain className="w-4 h-4" />
              <span className="hidden sm:inline">Stats</span>
            </TabsTrigger>
          </TabsList>

          <TabsContent value="dashboard" className="space-y-8" data-testid="content-dashboard">
        {/* Quick Stats Overview */}
        <section className="mb-8" id="dashboard">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold">Today's Overview</h2>
            <button className="text-sm text-primary font-medium hover:underline" data-testid="link-view-stats">
              View detailed stats <i className="fas fa-arrow-right ml-1"></i>
            </button>
          </div>
          
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between mb-3">
                  <div className="w-10 h-10 bg-primary/10 text-primary rounded-lg flex items-center justify-center">
                    <Clock className="h-5 w-5" />
                  </div>
                  <span className="text-xs text-muted-foreground">Today</span>
                </div>
                <div className="text-3xl font-bold mb-1" data-testid="text-study-time">
                  {stats ? `${Math.floor(stats.todayStudyTime / 60)}h ${stats.todayStudyTime % 60}m` : '0h 0m'}
                </div>
                <div className="text-sm text-muted-foreground">Study Time</div>
                <div className="mt-3 flex items-center gap-1 text-xs text-accent">
                  <i className="fas fa-arrow-up"></i>
                  <span>+12% vs yesterday</span>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between mb-3">
                  <div className="w-10 h-10 bg-accent/10 text-accent rounded-lg flex items-center justify-center">
                    <CheckCircle className="h-5 w-5" />
                  </div>
                  <span className="text-xs text-muted-foreground">Today</span>
                </div>
                <div className="text-3xl font-bold mb-1" data-testid="text-completed-tasks">
                  {stats ? `${stats.completedTasksToday}/${stats.totalTasksToday}` : '0/0'}
                </div>
                <div className="text-sm text-muted-foreground">Tasks Completed</div>
                <div className="mt-3 w-full bg-muted rounded-full h-2">
                  <div 
                    className="bg-accent h-2 rounded-full" 
                    style={{ width: stats && stats.totalTasksToday > 0 ? `${(stats.completedTasksToday / stats.totalTasksToday) * 100}%` : '0%' }}
                  ></div>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between mb-3">
                  <div className="w-10 h-10 bg-secondary/10 text-secondary rounded-lg flex items-center justify-center">
                    <Flame className="h-5 w-5" />
                  </div>
                  <span className="text-xs text-muted-foreground">All time</span>
                </div>
                <div className="text-3xl font-bold mb-1" data-testid="text-streak">
                  {stats?.currentStreak || 0} days
                </div>
                <div className="text-sm text-muted-foreground">Current Streak</div>
                <div className="mt-3 flex items-center gap-1 text-xs text-secondary">
                  <i className="fas fa-medal"></i>
                  <span>Personal best!</span>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between mb-3">
                  <div className="w-10 h-10 bg-primary/10 text-primary rounded-lg flex items-center justify-center">
                    <Brain className="h-5 w-5" />
                  </div>
                  <span className="text-xs text-muted-foreground">This week</span>
                </div>
                <div className="text-3xl font-bold mb-1" data-testid="text-focus-score">
                  {stats?.focusScore || 0}%
                </div>
                <div className="text-sm text-muted-foreground">Focus Score</div>
                <div className="mt-3 flex gap-1">
                  {[1, 2, 3, 4, 5, 6, 7].map((_, index) => (
                    <div key={index} className="flex-1 bg-primary/20 rounded h-8"></div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </section>

        <TimerSection />
        <KanbanBoard />
        
        <div className="grid lg:grid-cols-2 gap-6 mb-8">
          <CalendarView />
          <NotesPanel />
        </div>
          </TabsContent>

          <TabsContent value="subjects" data-testid="content-subjects">
            <Subjects />
          </TabsContent>

          <TabsContent value="motivation" data-testid="content-motivation">
            <Motivation />
          </TabsContent>

          <TabsContent value="profile" data-testid="content-profile">
            <Profile />
          </TabsContent>

          <TabsContent value="stats" data-testid="content-stats">
            <StatsDashboard />
          </TabsContent>
        </Tabs>
      </main>
      
      <DemoBanner />
      
      {/* Floating Action Button */}
      <button 
        className="fixed bottom-6 left-6 w-14 h-14 bg-primary text-primary-foreground rounded-full shadow-lg hover:shadow-xl transition-all flex items-center justify-center z-40"
        data-testid="button-quick-actions"
      >
        <i className="fas fa-plus text-xl"></i>
      </button>
    </div>
  );
}
