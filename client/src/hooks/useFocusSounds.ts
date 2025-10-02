import { useState, useEffect, useRef } from 'react';

export type SoundType = 'rain' | 'fireplace' | 'wind' | 'cafe' | 'forest' | 'whitenoise' | 'none';

const soundUrls: Record<SoundType, string> = {
  rain: 'https://assets.mixkit.co/active_storage/sfx/2393/2393-preview.mp3',
  fireplace: 'https://assets.mixkit.co/active_storage/sfx/2404/2404-preview.mp3',
  wind: 'https://assets.mixkit.co/active_storage/sfx/2450/2450-preview.mp3',
  cafe: 'https://assets.mixkit.co/active_storage/sfx/2460/2460-preview.mp3',
  forest: 'https://assets.mixkit.co/active_storage/sfx/2462/2462-preview.mp3',
  whitenoise: 'https://assets.mixkit.co/active_storage/sfx/2473/2473-preview.mp3',
  none: '',
};

export function useFocusSounds() {
  const [activeSound, setActiveSound] = useState<SoundType>('none');
  const [volume, setVolume] = useState(60);
  const [isMuted, setIsMuted] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    if (activeSound === 'none') {
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current.src = '';
        audioRef.current = null;
      }
      return;
    }

    const audio = new Audio();
    audio.crossOrigin = 'anonymous';
    audio.src = soundUrls[activeSound];
    audio.loop = true;
    audio.volume = isMuted ? 0 : volume / 100;
    
    const playPromise = audio.play();
    if (playPromise !== undefined) {
      playPromise.catch((error) => {
        console.error('Error playing sound:', error);
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
  }, [activeSound]);

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
