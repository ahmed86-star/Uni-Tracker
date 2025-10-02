import { useState, useEffect, useRef } from 'react';
import { useToast } from './use-toast';

export type SoundType = 'rain' | 'fireplace' | 'wind' | 'cafe' | 'forest' | 'whitenoise' | 'none';

const soundFiles: Record<Exclude<SoundType, 'none'>, string> = {
  rain: '/sounds/rain.mp3',
  fireplace: '/sounds/fireplace.mp3',
  wind: '/sounds/wind.mp3',
  cafe: '/sounds/cafe.mp3',
  forest: '/sounds/forest.mp3',
  whitenoise: '/sounds/whitenoise.mp3',
};

export function useFocusSounds() {
  const [activeSound, setActiveSound] = useState<SoundType>('none');
  const [volume, setVolume] = useState(60);
  const [isMuted, setIsMuted] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    // Cleanup previous audio
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.src = '';
      audioRef.current = null;
    }

    if (activeSound === 'none') {
      return;
    }

    const audio = new Audio(soundFiles[activeSound]);
    audio.loop = true;
    audio.volume = isMuted ? 0 : volume / 100;
    
    const playPromise = audio.play();
    if (playPromise !== undefined) {
      playPromise.catch((error) => {
        console.error('Error playing sound:', error);
        if (error.name === 'NotFoundError' || error.message.includes('404')) {
          toast({
            title: "Audio file missing",
            description: "Please download ambient sounds from Pixabay and place them in /client/public/sounds/. See README in that folder.",
            variant: "destructive",
          });
        }
      });
    }

    audioRef.current = audio;

    return () => {
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current.src = '';
        audioRef.current = null;
      }
    };
  }, [activeSound, toast]);

  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = isMuted ? 0 : volume / 100;
    }
  }, [volume, isMuted]);

  const toggleSound = (sound: SoundType) => {
    if (activeSound === sound) {
      setActiveSound('none');
    } else {
      setActiveSound(sound);
    }
  };

  return {
    activeSound,
    volume,
    isMuted,
    setVolume,
    setIsMuted,
    toggleSound,
  };
}
