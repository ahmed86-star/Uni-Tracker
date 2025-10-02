import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Clock, Calendar, BarChart3 } from "lucide-react";

export default function Landing() {
  const handleSignIn = () => {
    window.location.href = "/api/login";
  };

  const startTour = () => {
    // This will be implemented with React Joyride
    console.log("Start guided tour");
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Navigation */}
      <nav className="sticky top-0 z-50 bg-card border-b border-border backdrop-blur-sm bg-opacity-95">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-br from-primary to-secondary rounded-lg flex items-center justify-center text-white text-xl font-bold">
                📚
              </div>
              <span className="text-xl font-bold text-foreground">Uni Tracker</span>
            </div>
            
            <div className="flex items-center gap-3">
              <Button variant="outline" onClick={startTour} data-testid="button-start-tour">
                <i className="fas fa-route mr-2"></i>
                Start Tour
              </Button>
              <Button onClick={handleSignIn} data-testid="button-sign-in">
                <i className="fab fa-google mr-2"></i>
                Sign in
              </Button>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-br from-primary/10 via-secondary/10 to-accent/10 py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-primary/10 text-primary rounded-full text-sm font-medium mb-6">
              <i className="fas fa-sparkles"></i>
              <span>Welcome to your productivity journey!</span>
            </div>
            <h1 className="text-5xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-primary via-secondary to-accent bg-clip-text text-transparent">
              Uni Tracker 📚
            </h1>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto mb-8">
              Your modern, visual, and productive companion for university life. Organize your time, tasks, and academic progress all in one place.
            </p>
            
            <div className="flex flex-wrap items-center justify-center gap-4 mb-12">
              <Button size="lg" onClick={startTour} data-testid="button-guided-tour">
                <i className="fas fa-route mr-2"></i>
                Start Guided Tour
              </Button>
              <Button size="lg" variant="outline" onClick={handleSignIn} data-testid="button-google-signin">
                <i className="fab fa-google mr-2"></i>
                Sign in with Google
              </Button>
            </div>
          </div>
          
          {/* Feature Highlights */}
          <div className="grid md:grid-cols-3 gap-6 mb-12">
            <Card className="hover:shadow-lg transition-all">
              <CardContent className="p-6">
                <div className="w-12 h-12 bg-primary/10 text-primary rounded-lg flex items-center justify-center mb-4">
                  <Clock className="h-6 w-6" />
                </div>
                <h3 className="text-lg font-semibold mb-2">Smart Timers</h3>
                <p className="text-muted-foreground text-sm">Pomodoro, Study Timer, and Countdown for productive sessions with full customization.</p>
              </CardContent>
            </Card>
            
            <Card className="hover:shadow-lg transition-all">
              <CardContent className="p-6">
                <div className="w-12 h-12 bg-secondary/10 text-secondary rounded-lg flex items-center justify-center mb-4">
                  <Calendar className="h-6 w-6" />
                </div>
                <h3 className="text-lg font-semibold mb-2">Task Management</h3>
                <p className="text-muted-foreground text-sm">Kanban board, calendar view, and recurring tasks to keep everything organized.</p>
              </CardContent>
            </Card>
            
            <Card className="hover:shadow-lg transition-all">
              <CardContent className="p-6">
                <div className="w-12 h-12 bg-accent/10 text-accent rounded-lg flex items-center justify-center mb-4">
                  <BarChart3 className="h-6 w-6" />
                </div>
                <h3 className="text-lg font-semibold mb-2">Progress Tracking</h3>
                <p className="text-muted-foreground text-sm">Visualize your streaks, achievements, and study statistics with beautiful charts.</p>
              </CardContent>
            </Card>
          </div>
          
          <div className="flex items-center justify-center gap-3 text-sm text-muted-foreground">
            <i className="fas fa-info-circle"></i>
            <span>New here? <button onClick={startTour} className="text-primary font-medium hover:underline">Take the interactive tour</button> to get started!</span>
          </div>
        </div>
      </section>
    </div>
  );
}
