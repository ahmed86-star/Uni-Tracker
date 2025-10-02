import { useState } from "react";
import { Navigation } from "@/components/Navigation";
import { PomodoroTimer } from "@/components/timers/PomodoroTimer";
import { StudyTimer } from "@/components/timers/StudyTimer";
import { CountdownTimer } from "@/components/timers/CountdownTimer";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Slider } from "@/components/ui/slider";
import { 
  Waves, 
  Flame, 
  Wind, 
  Coffee, 
  TreePine, 
  Volume2,
  VolumeX,
  Volume1
} from "lucide-react";

const focusSounds = [
  { id: "rain", name: "Rain", icon: Waves, color: "text-blue-500" },
  { id: "fireplace", name: "Fireplace", icon: Flame, color: "text-orange-500" },
  { id: "wind", name: "Wind", icon: Wind, color: "text-gray-500" },
  { id: "cafe", name: "Cafe", icon: Coffee, color: "text-brown-500" },
  { id: "forest", name: "Forest", icon: TreePine, color: "text-green-500" },
];

export default function Timer() {
  const [volume, setVolume] = useState([60]);
  const [activeSound, setActiveSound] = useState<string | null>(null);

  const handleSoundToggle = (soundId: string) => {
    setActiveSound(activeSound === soundId ? null : soundId);
  };

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Focus Sessions</h1>
          <p className="text-muted-foreground">
            Choose your preferred timer and create the perfect study environment
          </p>
        </div>

        {/* Timers Grid */}
        <div className="grid md:grid-cols-3 gap-6 mb-8">
          <PomodoroTimer />
          <StudyTimer />
          <CountdownTimer />
        </div>

        {/* Focus Sounds */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Volume2 className="h-5 w-5 text-primary" />
              Focus Sounds
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-6">
              {focusSounds.map((sound) => (
                <Button
                  key={sound.id}
                  variant={activeSound === sound.id ? "default" : "outline"}
                  className="flex flex-col items-center gap-2 h-20"
                  onClick={() => handleSoundToggle(sound.id)}
                  data-testid={`button-sound-${sound.id}`}
                >
                  <sound.icon className={`h-6 w-6 ${
                    activeSound === sound.id ? "text-primary-foreground" : sound.color
                  }`} />
                  <span className="text-sm">{sound.name}</span>
                </Button>
              ))}
            </div>

            {/* Volume Control */}
            <div className="flex items-center gap-4">
              <VolumeX className="h-4 w-4 text-muted-foreground" />
              <Slider
                value={volume}
                onValueChange={setVolume}
                max={100}
                step={1}
                className="flex-1"
                data-testid="slider-volume"
              />
              <Volume2 className="h-4 w-4 text-muted-foreground" />
              <span className="text-sm font-medium w-12 text-right">
                {volume[0]}%
              </span>
            </div>
          </CardContent>
        </Card>
      </main>
    </div>
  );
}
