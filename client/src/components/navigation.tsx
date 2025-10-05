import { Button } from "@/components/ui/button";
import { useTheme } from "@/components/theme-provider";
import { Moon, Sun, Home, Clock, CheckSquare, StickyNote, BarChart3 } from "lucide-react";

export default function Navigation() {
  const { theme, toggleTheme } = useTheme();

  return (
    <nav className="sticky top-0 z-50 bg-card border-b border-border backdrop-blur-sm bg-opacity-95">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo and brand */}
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-br from-primary to-secondary rounded-lg flex items-center justify-center text-white text-xl font-bold">
              📚
            </div>
            <span className="text-xl font-bold text-foreground">Uni Tracker</span>
          </div>
          
          {/* Navigation items */}
          <div className="hidden md:flex items-center gap-6">
            <a href="#dashboard" className="text-muted-foreground hover:text-foreground transition-colors flex items-center gap-2" data-testid="link-dashboard">
              <Home className="h-4 w-4" />
              Dashboard
            </a>
            <a href="#timer" className="text-muted-foreground hover:text-foreground transition-colors flex items-center gap-2" data-testid="link-timers">
              <Clock className="h-4 w-4" />
              Timers
            </a>
            <a href="#tasks" className="text-muted-foreground hover:text-foreground transition-colors flex items-center gap-2" data-testid="link-tasks">
              <CheckSquare className="h-4 w-4" />
              Tasks
            </a>
            <a href="#notes" className="text-muted-foreground hover:text-foreground transition-colors flex items-center gap-2" data-testid="link-notes">
              <StickyNote className="h-4 w-4" />
              Notes
            </a>
            <a href="#stats" className="text-muted-foreground hover:text-foreground transition-colors flex items-center gap-2" data-testid="link-stats">
              <BarChart3 className="h-4 w-4" />
              Stats
            </a>
          </div>
          
          {/* Right actions */}
          <div className="flex items-center gap-3">
            {/* Dark mode toggle */}
            <Button variant="ghost" size="sm" onClick={toggleTheme} data-testid="button-theme-toggle">
              {theme === 'dark' ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
            </Button>
            
            {/* Authentication coming soon badge */}
            <div className="px-3 py-1.5 bg-muted text-muted-foreground rounded-lg text-xs font-medium" data-testid="text-auth-status-nav">
              Authentication coming soon
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
}
