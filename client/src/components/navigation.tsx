import { useAuth } from "@/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger 
} from "@/components/ui/dropdown-menu";
import { useTheme } from "@/components/theme-provider";
import { Moon, Sun, Home, Clock, CheckSquare, StickyNote, BarChart3 } from "lucide-react";

export default function Navigation() {
  const { user } = useAuth();
  const { theme, toggleTheme } = useTheme();

  const handleLogout = () => {
    window.location.href = "/api/logout";
  };

  const getInitials = (user: any) => {
    if (user?.firstName && user?.lastName) {
      return `${user.firstName[0]}${user.lastName[0]}`.toUpperCase();
    }
    if (user?.email) {
      return user.email[0].toUpperCase();
    }
    return 'U';
  };

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
            
            {/* User menu */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="flex items-center gap-2" data-testid="button-user-menu">
                  <Avatar className="h-8 w-8">
                    <AvatarImage src={user?.profileImageUrl} alt={user?.email} />
                    <AvatarFallback className="bg-primary text-primary-foreground text-sm font-semibold">
                      {getInitials(user)}
                    </AvatarFallback>
                  </Avatar>
                  <span className="hidden md:inline text-sm font-medium">
                    {user?.firstName || user?.email || 'User'}
                  </span>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem onClick={handleLogout} data-testid="button-logout">
                  <i className="fas fa-sign-out-alt mr-2"></i>
                  Sign Out
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </div>
    </nav>
  );
}
