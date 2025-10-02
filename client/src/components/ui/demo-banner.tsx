import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { useDemoMode } from "@/hooks/useDemoMode";
import { useAuth } from "@/hooks/useAuth";
import { FlaskConical, X, User, Trash2 } from "lucide-react";

export function DemoBanner() {
  const [isVisible, setIsVisible] = useState(true);
  const { isAuthenticated } = useAuth();
  const { clearDemoData, isDemoMode } = useDemoMode();

  // Only show banner for unauthenticated users or in demo mode
  if (!isVisible || isAuthenticated || !isDemoMode) {
    return null;
  }

  const handleClearDemo = async () => {
    try {
      await clearDemoData();
      setIsVisible(false);
    } catch (error) {
      console.error("Failed to clear demo data:", error);
    }
  };

  return (
    <div 
      className="fixed bottom-6 right-6 z-50 max-w-sm animate-slide-in"
      data-tour="demo-banner"
      data-testid="demo-banner"
    >
      <Card className="shadow-2xl border-2 border-accent/20">
        <CardContent className="p-4">
          <div className="flex items-start gap-3">
            <div className="w-10 h-10 bg-accent/10 text-accent rounded-full flex items-center justify-center flex-shrink-0">
              <FlaskConical className="h-5 w-5" />
            </div>
            
            <div className="flex-1 min-w-0">
              <h4 className="font-semibold text-sm mb-1">Demo Mode Active</h4>
              <p className="text-xs text-muted-foreground mb-3 leading-relaxed">
                You're exploring with sample data. Sign in to save your progress and sync across devices!
              </p>
              
              <div className="flex gap-2">
                <Button 
                  size="sm" 
                  className="h-7 px-3 text-xs"
                  asChild
                  data-testid="button-sign-up"
                >
                  <a href="/api/login">
                    <User className="mr-1.5 h-3 w-3" />
                    Sign Up
                  </a>
                </Button>
                
                <Button 
                  variant="destructive"
                  size="sm" 
                  className="h-7 px-3 text-xs"
                  onClick={handleClearDemo}
                  data-testid="button-clear-demo"
                >
                  <Trash2 className="mr-1.5 h-3 w-3" />
                  Clear Demo
                </Button>
              </div>
            </div>

            <Button
              variant="ghost"
              size="icon"
              className="h-6 w-6 text-muted-foreground hover:text-foreground"
              onClick={() => setIsVisible(false)}
              data-testid="button-close-banner"
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
