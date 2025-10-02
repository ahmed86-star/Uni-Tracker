import { Link, useLocation } from "wouter";
import { useAuth } from "@/hooks/useAuth";
import { useTheme } from "@/components/ThemeProvider";
import { useTour } from "@/components/TourProvider";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuSeparator, 
  DropdownMenuTrigger 
} from "@/components/ui/dropdown-menu";
import { Badge } from "@/components/ui/badge";
import { Moon, Sun, Home, Timer, CheckSquare, StickyNote, BarChart3, User, LogOut } from "lucide-react";

export function Navigation() {
  const { user, isAuthenticated } = useAuth();
  const { theme, setTheme } = useTheme();
  const { startTour } = useTour();
  const [location] = useLocation();

  const navItems = [
    { path: "/", icon: Home, label: "Dashboard" },
    { path: "/timer", icon: Timer, label: "Timers" },
    { path: "/tasks", icon: CheckSquare, label: "Tasks" },
    { path: "/notes", icon: StickyNote, label: "Notes" },
    { path: "/stats", icon: BarChart3, label: "Stats" },
  ];

  if (!isAuthenticated) {
    return null;
  }

  return (
    <nav className="sticky top-0 z-50 bg-card/95 backdrop-blur-sm border-b border-border">
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
            {navItems.map(({ path, icon: Icon, label }) => (
              <Link key={path} href={path}>
                <a className={`flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                  location === path 
                    ? "bg-primary/10 text-primary" 
                    : "text-muted-foreground hover:text-foreground hover:bg-muted"
                }`}>
                  <Icon className="h-4 w-4" />
                  {label}
                </a>
              </Link>
            ))}
          </div>

          {/* Right actions */}
          <div className="flex items-center gap-3">
            {/* Theme toggle */}
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
              data-testid="button-theme-toggle"
            >
              {theme === "dark" ? (
                <Sun className="h-4 w-4" />
              ) : (
                <Moon className="h-4 w-4" />
              )}
            </Button>

            {/* Tour button */}
            <Button
              variant="outline"
              size="sm"
              onClick={startTour}
              className="hidden md:flex"
              data-testid="button-start-tour"
            >
              Take Tour
            </Button>

            {/* Demo mode indicator */}
            <Badge variant="secondary" className="hidden md:flex" data-tour="demo-banner">
              Demo Mode
            </Badge>

            {/* User menu */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="relative h-8 w-8 rounded-full" data-testid="button-user-menu">
                  <Avatar className="h-8 w-8">
                    <AvatarImage src={user?.profileImageUrl} alt={user?.firstName || "User"} />
                    <AvatarFallback>
                      {user?.firstName?.[0] || user?.email?.[0] || "U"}
                    </AvatarFallback>
                  </Avatar>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-56" align="end" forceMount>
                <div className="flex items-center justify-start gap-2 p-2">
                  <div className="flex flex-col space-y-1 leading-none">
                    <p className="font-medium">
                      {user?.firstName} {user?.lastName}
                    </p>
                    <p className="w-[200px] truncate text-sm text-muted-foreground">
                      {user?.email}
                    </p>
                  </div>
                </div>
                <DropdownMenuSeparator />
                <DropdownMenuItem asChild>
                  <a href="/api/logout" className="flex items-center gap-2">
                    <LogOut className="h-4 w-4" />
                    Log out
                  </a>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </div>
    </nav>
  );
}
