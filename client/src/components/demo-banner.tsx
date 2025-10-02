import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { X, FlaskConical } from "lucide-react";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";

export default function DemoBanner() {
  const [isVisible, setIsVisible] = useState(true);
  const { toast } = useToast();

  const clearDemoDataMutation = useMutation({
    mutationFn: async () => {
      return await apiRequest("POST", "/api/demo/clear");
    },
    onSuccess: () => {
      toast({
        title: "Demo data cleared",
        description: "All demo data has been removed successfully.",
      });
      setIsVisible(false);
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to clear demo data. Please try again.",
        variant: "destructive",
      });
    },
  });

  const handleSignUp = () => {
    window.location.href = "/api/login";
  };

  if (!isVisible) return null;

  return (
    <div className="fixed bottom-6 right-6 z-40 max-w-sm">
      <Card className="shadow-2xl border">
        <CardContent className="p-4">
          <div className="flex items-start gap-3">
            <div className="w-10 h-10 bg-accent/10 text-accent rounded-full flex items-center justify-center flex-shrink-0">
              <FlaskConical className="h-5 w-5" />
            </div>
            <div className="flex-1">
              <h4 className="font-semibold mb-1" data-testid="text-demo-title">
                Demo Mode Active
              </h4>
              <p className="text-sm text-muted-foreground mb-3" data-testid="text-demo-description">
                You're exploring with sample data. Sign in to save your progress!
              </p>
              <div className="flex gap-2">
                <Button 
                  size="sm" 
                  onClick={handleSignUp}
                  data-testid="button-demo-signup"
                >
                  Sign Up
                </Button>
                <Button 
                  size="sm" 
                  variant="outline" 
                  onClick={() => clearDemoDataMutation.mutate()}
                  disabled={clearDemoDataMutation.isPending}
                  data-testid="button-clear-demo-data"
                >
                  {clearDemoDataMutation.isPending ? "Clearing..." : "Clear Demo Data"}
                </Button>
              </div>
            </div>
            <Button 
              variant="ghost" 
              size="sm"
              onClick={() => setIsVisible(false)}
              data-testid="button-close-demo-banner"
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
