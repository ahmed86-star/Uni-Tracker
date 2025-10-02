import { useQuery } from "@tanstack/react-query";
import { Navigation } from "@/components/Navigation";
import { StatsOverview } from "@/components/stats/StatsOverview";
import { PomodoroTimer } from "@/components/timers/PomodoroTimer";
import { StudyTimer } from "@/components/timers/StudyTimer";
import { CountdownTimer } from "@/components/timers/CountdownTimer";
import { KanbanBoard } from "@/components/tasks/KanbanBoard";
import { CalendarView } from "@/components/calendar/CalendarView";
import { NotesPanel } from "@/components/notes/NotesPanel";
import { DemoBanner } from "@/components/ui/demo-banner";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Plus } from "lucide-react";

export default function Home() {
  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Quick Stats Overview */}
        <StatsOverview />

        {/* Timer Section */}
        <section className="mb-8" data-tour="timer-section">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold">Focus Sessions</h2>
            <Button data-testid="button-new-session">
              <Plus className="mr-2 h-4 w-4" />
              New Session
            </Button>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            <PomodoroTimer />
            <StudyTimer />
            <CountdownTimer />
          </div>
        </section>

        {/* Main Content Grid */}
        <div className="grid lg:grid-cols-2 gap-6 mb-8">
          {/* Tasks Section */}
          <div data-tour="tasks-section">
            <Tabs defaultValue="kanban" className="w-full">
              <div className="flex items-center justify-between mb-4">
                <TabsList>
                  <TabsTrigger value="kanban">Kanban</TabsTrigger>
                  <TabsTrigger value="calendar">Calendar</TabsTrigger>
                </TabsList>
                <Button size="sm" data-testid="button-create-task">
                  <Plus className="mr-2 h-4 w-4" />
                  New Task
                </Button>
              </div>

              <TabsContent value="kanban">
                <KanbanBoard />
              </TabsContent>

              <TabsContent value="calendar" data-tour="calendar">
                <CalendarView />
              </TabsContent>
            </Tabs>
          </div>

          {/* Notes Section */}
          <div data-tour="notes">
            <NotesPanel />
          </div>
        </div>
      </main>

      <DemoBanner />
    </div>
  );
}
