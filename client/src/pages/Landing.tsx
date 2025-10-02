import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { useTour } from "@/components/TourProvider";
import { Timer, Calendar, BarChart3, BookOpen, Target, Trophy } from "lucide-react";

export default function Landing() {
  const { startTour } = useTour();

  const features = [
    {
      icon: Timer,
      title: "Smart Timers",
      description: "Pomodoro, Study Timer, and Countdown for productive sessions with full customization.",
      color: "bg-primary/10 text-primary",
    },
    {
      icon: Calendar,
      title: "Task Management", 
      description: "Kanban board, calendar view, and recurring tasks to keep everything organized.",
      color: "bg-secondary/10 text-secondary",
    },
    {
      icon: BarChart3,
      title: "Progress Tracking",
      description: "Visualize your streaks, achievements, and study statistics with beautiful charts.",
      color: "bg-accent/10 text-accent",
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/10 via-secondary/10 to-accent/10">
      {/* Hero Section */}
      <section className="relative overflow-hidden py-20" data-tour="welcome">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-primary/10 text-primary rounded-full text-sm font-medium mb-6">
              <Trophy className="h-4 w-4" />
              <span>Welcome to your productivity journey!</span>
            </div>
            
            <h1 className="text-5xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-primary via-secondary to-accent bg-clip-text text-transparent">
              Uni Tracker 📚
            </h1>
            
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto mb-8">
              Your modern, visual, and productive companion for university life. Organize your time, tasks, and academic progress all in one place.
            </p>

            {/* CTA Buttons */}
            <div className="flex flex-wrap items-center justify-center gap-4 mb-12">
              <Button 
                size="lg" 
                onClick={startTour}
                className="px-8 py-3 shadow-lg hover:shadow-xl"
                data-testid="button-start-tour"
              >
                <BookOpen className="mr-2 h-5 w-5" />
                Start Guided Tour
              </Button>
              
              <Button 
                variant="outline" 
                size="lg"
                asChild
                className="px-8 py-3"
                data-testid="button-sign-in"
              >
                <a href="/api/login">
                  <Target className="mr-2 h-5 w-5" />
                  Sign in with Google
                </a>
              </Button>
            </div>
          </div>

          {/* Feature Highlights */}
          <div className="grid md:grid-cols-3 gap-6 mb-12">
            {features.map((feature, index) => (
              <Card key={index} className="hover:shadow-lg transition-all">
                <CardContent className="p-6">
                  <div className={`w-12 h-12 ${feature.color} rounded-lg flex items-center justify-center mb-4`}>
                    <feature.icon className="h-6 w-6" />
                  </div>
                  <h3 className="text-lg font-semibold mb-2">{feature.title}</h3>
                  <p className="text-muted-foreground text-sm">{feature.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Tour Call-to-Action */}
          <div className="flex items-center justify-center gap-3 text-sm text-muted-foreground">
            <BookOpen className="h-4 w-4" />
            <span>New here? 
              <Button 
                variant="link" 
                className="p-0 ml-1 text-primary font-medium h-auto"
                onClick={startTour}
                data-testid="button-take-tour"
              >
                Take the interactive tour
              </Button> to get started!
            </span>
          </div>
        </div>
      </section>

      {/* Additional Features */}
      <section className="py-16 bg-card/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">Everything you need to succeed</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              From time management to progress tracking, Uni Tracker provides all the tools modern students need.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="text-center">
              <div className="w-16 h-16 bg-primary/10 text-primary rounded-full flex items-center justify-center text-2xl mx-auto mb-4">
                🎯
              </div>
              <h3 className="font-semibold mb-2">Focus Sessions</h3>
              <p className="text-sm text-muted-foreground">Customizable Pomodoro and study timers</p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-secondary/10 text-secondary rounded-full flex items-center justify-center text-2xl mx-auto mb-4">
                📋
              </div>
              <h3 className="font-semibold mb-2">Smart Organization</h3>
              <p className="text-sm text-muted-foreground">Kanban boards and calendar views</p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-accent/10 text-accent rounded-full flex items-center justify-center text-2xl mx-auto mb-4">
                📊
              </div>
              <h3 className="font-semibold mb-2">Progress Analytics</h3>
              <p className="text-sm text-muted-foreground">Detailed insights and achievements</p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-primary/10 text-primary rounded-full flex items-center justify-center text-2xl mx-auto mb-4">
                🌙
              </div>
              <h3 className="font-semibold mb-2">Modern Interface</h3>
              <p className="text-sm text-muted-foreground">Dark mode and customizable themes</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
